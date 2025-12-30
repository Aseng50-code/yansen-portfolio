from fastapi import FastAPI, APIRouter, HTTPException, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pathlib import Path
from typing import Optional, List
from datetime import datetime
import os
import logging

from models import (
    UserCreate, UserLogin, User, UserResponse, Token, VerifyEmail,
    JobCreate, Job, CommentCreate, JobComment,
    PaymentCreate, Payment, PaymentReject,
    Settings, PaymentInfo
)
from auth_utils import (
    hash_password, verify_password, create_access_token, 
    generate_verification_token
)
from middleware import get_current_user, require_admin

# Setup
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# ==================== AUTH ENDPOINTS ====================

@api_router.post("/auth/register")
async def register(user_data: UserCreate):
    """Register a new user"""
    # Check if user exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    verification_token = generate_verification_token()
    user = User(
        email=user_data.email,
        fullName=user_data.fullName,
        verificationToken=verification_token
    )
    
    # Hash password and store separately (not in User model)
    hashed_password = hash_password(user_data.password)
    user_dict = user.dict()
    user_dict["hashedPassword"] = hashed_password
    
    await db.users.insert_one(user_dict)
    
    # In production, send verification email here
    logger.info(f"Verification token for {user.email}: {verification_token}")
    
    return {
        "message": "Registration successful. Please check your email for verification.",
        "userId": user.id,
        # For demo purposes, return the token (remove in production)
        "verificationToken": verification_token
    }

@api_router.post("/auth/verify-email")
async def verify_email(verify_data: VerifyEmail):
    """Verify user email"""
    user = await db.users.find_one({"verificationToken": verify_data.token})
    
    if not user:
        raise HTTPException(status_code=400, detail="Invalid verification token")
    
    # Update user
    await db.users.update_one(
        {"_id": user["_id"]},
        {"$set": {"isVerified": True, "verificationToken": None}}
    )
    
    updated_user = await db.users.find_one({"_id": user["_id"]})
    
    return {
        "message": "Email verified successfully",
        "user": UserResponse(
            id=updated_user["id"],
            email=updated_user["email"],
            fullName=updated_user["fullName"],
            role=updated_user["role"],
            isVerified=updated_user["isVerified"]
        )
    }

@api_router.post("/auth/login", response_model=Token)
async def login(login_data: UserLogin):
    """Login user"""
    user = await db.users.find_one({"email": login_data.email})
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not verify_password(login_data.password, user["hashedPassword"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not user["isVerified"]:
        raise HTTPException(status_code=401, detail="Please verify your email first")
    
    # Create access token
    token = create_access_token(
        data={
            "userId": user["id"],
            "email": user["email"],
            "role": user["role"]
        }
    )
    
    return Token(
        token=token,
        user=UserResponse(
            id=user["id"],
            email=user["email"],
            fullName=user["fullName"],
            role=user["role"],
            isVerified=user["isVerified"]
        )
    )

@api_router.get("/auth/me", response_model=UserResponse)
async def get_me(authorization: Optional[str] = Header(None)):
    """Get current user"""
    current_user = get_current_user(authorization)
    
    user = await db.users.find_one({"id": current_user["userId"]})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return UserResponse(
        id=user["id"],
        email=user["email"],
        fullName=user["fullName"],
        role=user["role"],
        isVerified=user["isVerified"]
    )


# ==================== JOB ENDPOINTS ====================

@api_router.get("/jobs")
async def get_jobs():
    """Get all jobs (public)"""
    jobs = await db.jobs.find().sort("postedDate", -1).to_list(1000)
    return {"jobs": jobs}

@api_router.post("/jobs")
async def create_job(
    job_data: JobCreate,
    authorization: Optional[str] = Header(None)
):
    """Create a new job (admin only)"""
    require_admin(authorization)
    
    job = Job(**job_data.dict())
    await db.jobs.insert_one(job.dict())
    
    return {"message": "Job created successfully", "job": job}

@api_router.put("/jobs/{job_id}")
async def update_job(
    job_id: str,
    job_data: JobCreate,
    authorization: Optional[str] = Header(None)
):
    """Update a job (admin only)"""
    require_admin(authorization)
    
    result = await db.jobs.update_one(
        {"id": job_id},
        {"$set": job_data.dict()}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Job not found")
    
    updated_job = await db.jobs.find_one({"id": job_id})
    return {"message": "Job updated successfully", "job": updated_job}

@api_router.delete("/jobs/{job_id}")
async def delete_job(
    job_id: str,
    authorization: Optional[str] = Header(None)
):
    """Delete a job (admin only)"""
    require_admin(authorization)
    
    result = await db.jobs.delete_one({"id": job_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Job not found")
    
    return {"message": "Job deleted successfully"}

@api_router.post("/jobs/{job_id}/like")
async def like_job(
    job_id: str,
    authorization: Optional[str] = Header(None)
):
    """Like a job"""
    current_user = get_current_user(authorization)
    user_id = current_user["userId"]
    
    job = await db.jobs.find_one({"id": job_id})
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    # Toggle like
    liked_by = job.get("likedBy", [])
    if user_id in liked_by:
        # Unlike
        await db.jobs.update_one(
            {"id": job_id},
            {
                "$pull": {"likedBy": user_id},
                "$inc": {"likes": -1}
            }
        )
        message = "Job unliked"
    else:
        # Like
        await db.jobs.update_one(
            {"id": job_id},
            {
                "$push": {"likedBy": user_id},
                "$inc": {"likes": 1}
            }
        )
        message = "Job liked"
    
    updated_job = await db.jobs.find_one({"id": job_id})
    return {"message": message, "job": updated_job}

@api_router.post("/jobs/{job_id}/comment")
async def comment_on_job(
    job_id: str,
    comment_data: CommentCreate,
    authorization: Optional[str] = Header(None)
):
    """Comment on a job"""
    current_user = get_current_user(authorization)
    
    # Get user details
    user = await db.users.find_one({"id": current_user["userId"]})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    job = await db.jobs.find_one({"id": job_id})
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    # Create comment
    comment = JobComment(
        userId=user["id"],
        userName=user["fullName"],
        text=comment_data.text
    )
    
    await db.jobs.update_one(
        {"id": job_id},
        {"$push": {"comments": comment.dict()}}
    )
    
    return {"message": "Comment added successfully", "comment": comment}


# ==================== PAYMENT ENDPOINTS ====================

@api_router.post("/payments")
async def create_payment(
    payment_data: PaymentCreate,
    authorization: Optional[str] = Header(None)
):
    """Create a payment record"""
    current_user = get_current_user(authorization)
    
    payment = Payment(
        userId=current_user["userId"],
        **payment_data.dict()
    )
    
    await db.payments.insert_one(payment.dict())
    
    # Get payment info
    settings = await db.settings.find_one({"id": "payment_settings"})
    payment_info = settings.get("paymentInfo") if settings else PaymentInfo().dict()
    
    return {
        "message": "Payment record created. Please complete the payment.",
        "payment": payment,
        "paymentInfo": payment_info
    }

@api_router.get("/payments")
async def get_payments(authorization: Optional[str] = Header(None)):
    """Get all payments (admin only)"""
    require_admin(authorization)
    
    payments = await db.payments.find().sort("createdAt", -1).to_list(1000)
    
    # Enrich with user data
    enriched_payments = []
    for payment in payments:
        user = await db.users.find_one({"id": payment["userId"]})
        payment_copy = payment.copy()
        payment_copy["user"] = {
            "fullName": user["fullName"],
            "email": user["email"]
        } if user else None
        enriched_payments.append(payment_copy)
    
    return {"payments": enriched_payments}

@api_router.put("/payments/{payment_id}/confirm")
async def confirm_payment(
    payment_id: str,
    authorization: Optional[str] = Header(None)
):
    """Confirm a payment (admin only)"""
    require_admin(authorization)
    
    result = await db.payments.update_one(
        {"id": payment_id},
        {
            "$set": {
                "status": "confirmed",
                "confirmedAt": datetime.utcnow()
            }
        }
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Payment not found")
    
    payment = await db.payments.find_one({"id": payment_id})
    return {"message": "Payment confirmed successfully", "payment": payment}

@api_router.put("/payments/{payment_id}/reject")
async def reject_payment(
    payment_id: str,
    reject_data: PaymentReject,
    authorization: Optional[str] = Header(None)
):
    """Reject a payment (admin only)"""
    require_admin(authorization)
    
    result = await db.payments.update_one(
        {"id": payment_id},
        {
            "$set": {
                "status": "rejected",
                "rejectionReason": reject_data.reason
            }
        }
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Payment not found")
    
    payment = await db.payments.find_one({"id": payment_id})
    return {"message": "Payment rejected", "payment": payment}


# ==================== SETTINGS ENDPOINTS ====================

@api_router.get("/settings/payment-info")
async def get_payment_info():
    """Get payment information (public)"""
    settings = await db.settings.find_one({"id": "payment_settings"})
    
    if not settings:
        # Create default settings
        default_settings = Settings(paymentInfo=PaymentInfo())
        await db.settings.insert_one(default_settings.dict())
        return {"paymentInfo": default_settings.paymentInfo}
    
    return {"paymentInfo": settings["paymentInfo"]}

@api_router.put("/settings/payment-info")
async def update_payment_info(
    payment_info: PaymentInfo,
    authorization: Optional[str] = Header(None)
):
    """Update payment information (admin only)"""
    require_admin(authorization)
    
    await db.settings.update_one(
        {"id": "payment_settings"},
        {
            "$set": {
                "paymentInfo": payment_info.dict(),
                "updatedAt": datetime.utcnow()
            }
        },
        upsert=True
    )
    
    return {
        "message": "Payment information updated successfully",
        "paymentInfo": payment_info
    }


# Include the router in the main app
app.include_router(api_router)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()


# Health check
@api_router.get("/")
async def health_check():
    return {"status": "ok", "message": "CV Build for Seaman API"}
