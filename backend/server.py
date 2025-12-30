from fastapi import FastAPI, APIRouter, HTTPException, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pathlib import Path
from typing import Optional, List
from datetime import datetime
from io import BytesIO
import os
import logging
import base64

from models import (
    UserCreate, UserLogin, User, UserResponse, Token, VerifyEmail, ChangePassword,
    JobCreate, Job, CommentCreate, JobComment,
    PaymentCreate, Payment, PaymentReject,
    Settings, PaymentInfo,
    AnnouncementCreate, Announcement, AnnouncementComment, AnnouncementCommentCreate,
    PublicProfileSettings, PublicProfileResponse
)
from auth_utils import (
    hash_password, verify_password, create_access_token, 
    generate_verification_token
)
from middleware import get_current_user, require_admin
from security import (
    sanitize_string, sanitize_html, sanitize_dict, validate_email, validate_password,
    validate_object_id, check_resource_ownership, sanitize_mongo_query,
    validate_input_length
)
from pdf_generator import generate_cv_pdf

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
    # Security: Validate and sanitize input
    if not validate_email(user_data.email):
        raise HTTPException(status_code=400, detail="Invalid email format")
    
    is_valid, error_msg = validate_password(user_data.password)
    if not is_valid:
        raise HTTPException(status_code=400, detail=error_msg)
    
    # Sanitize inputs to prevent XSS
    email = sanitize_string(user_data.email.lower())
    full_name = sanitize_string(user_data.fullName)
    
    # Check if user exists
    existing_user = await db.users.find_one({"email": email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    verification_token = generate_verification_token()
    user = User(
        email=email,
        fullName=full_name,
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
    # Security: Validate and sanitize input
    if not validate_email(login_data.email):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    email = sanitize_string(login_data.email.lower())
    
    user = await db.users.find_one({"email": email})
    
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

@api_router.post("/auth/change-password")
async def change_password(
    password_data: ChangePassword,
    authorization: Optional[str] = Header(None)
):
    """Change user password"""
    current_user = get_current_user(authorization)
    
    # Validate new password
    is_valid, error_msg = validate_password(password_data.newPassword)
    if not is_valid:
        raise HTTPException(status_code=400, detail=error_msg)
    
    # Get user from database
    user = await db.users.find_one({"id": current_user["userId"]})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Verify current password
    if not verify_password(password_data.currentPassword, user["hashedPassword"]):
        raise HTTPException(status_code=401, detail="Current password is incorrect")
    
    # Check if new password is different from current
    if password_data.currentPassword == password_data.newPassword:
        raise HTTPException(status_code=400, detail="New password must be different from current password")
    
    # Hash new password
    new_hashed_password = hash_password(password_data.newPassword)
    
    # Update password
    await db.users.update_one(
        {"id": current_user["userId"]},
        {"$set": {"hashedPassword": new_hashed_password}}
    )
    
    logger.info(f"Password changed for user: {user['email']}")
    
    return {
        "message": "Password changed successfully",
        "email": user["email"]
    }


# ==================== JOB ENDPOINTS ====================

@api_router.get("/jobs")
async def get_jobs():
    """Get all jobs (public)"""
    jobs = await db.jobs.find().sort("postedDate", -1).to_list(1000)
    # Remove MongoDB _id field
    for job in jobs:
        if "_id" in job:
            del job["_id"]
    return {"jobs": jobs}

@api_router.post("/jobs")
async def create_job(
    job_data: JobCreate,
    authorization: Optional[str] = Header(None)
):
    """Create a new job (admin only)"""
    require_admin(authorization)
    
    # Security: Sanitize input to prevent XSS
    sanitized_data = sanitize_dict(job_data.dict())
    
    # Validate input lengths
    if not validate_input_length(sanitized_data.get("title", ""), 200):
        raise HTTPException(status_code=400, detail="Title too long")
    if not validate_input_length(sanitized_data.get("requirements", ""), 1000):
        raise HTTPException(status_code=400, detail="Requirements text too long")
    
    job = Job(**sanitized_data)
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
    
    # Security: Validate job_id format to prevent injection
    if not validate_object_id(job_id):
        raise HTTPException(status_code=400, detail="Invalid job ID format")
    
    # Security: Sanitize comment text to prevent XSS
    comment_text = sanitize_string(comment_data.text)
    
    # Validate comment length
    if not validate_input_length(comment_text, 500):
        raise HTTPException(status_code=400, detail="Comment too long (max 500 characters)")
    
    if not comment_text.strip():
        raise HTTPException(status_code=400, detail="Comment cannot be empty")
    
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
        userName=sanitize_string(user["fullName"]),
        text=comment_text
    )
    
    await db.jobs.update_one(
        {"id": job_id},
        {"$push": {"comments": comment.dict()}}
    )
    
    return {"message": "Comment added successfully", "comment": comment}


# ==================== ANNOUNCEMENT ENDPOINTS ====================

# Rate limiting for comments (simple in-memory, use Redis in production)
comment_rate_limits = {}

def check_comment_rate_limit(user_id: str) -> bool:
    """Check if user can comment (max 5 comments per minute)"""
    now = datetime.utcnow()
    if user_id not in comment_rate_limits:
        comment_rate_limits[user_id] = []
    
    # Remove old timestamps
    comment_rate_limits[user_id] = [
        t for t in comment_rate_limits[user_id] 
        if (now - t).total_seconds() < 60
    ]
    
    if len(comment_rate_limits[user_id]) >= 5:
        return False
    
    comment_rate_limits[user_id].append(now)
    return True

# Simple profanity filter
BLOCKED_WORDS = ["spam", "scam", "fake"]  # Add more as needed

def filter_profanity(text: str) -> str:
    """Basic profanity filter"""
    filtered = text
    for word in BLOCKED_WORDS:
        filtered = filtered.lower().replace(word, "*" * len(word))
    return filtered

@api_router.get("/announcements")
async def get_announcements(status: Optional[str] = "published"):
    """Get all announcements (public)"""
    query = {"status": status} if status else {}
    announcements = await db.announcements.find(query, {"_id": 0}).sort("createdAt", -1).to_list(100)
    return {"announcements": announcements}

@api_router.get("/announcements/{announcement_id}")
async def get_announcement(announcement_id: str):
    """Get a single announcement by ID"""
    announcement = await db.announcements.find_one({"id": announcement_id}, {"_id": 0})
    if not announcement:
        raise HTTPException(status_code=404, detail="Announcement not found")
    
    # Get comments for this announcement
    comments = await db.announcement_comments.find(
        {"announcementId": announcement_id, "isModerated": False},
        {"_id": 0}
    ).sort("createdAt", -1).to_list(100)
    
    announcement["comments"] = comments
    return {"announcement": announcement}

@api_router.post("/announcements")
async def create_announcement(
    announcement_data: AnnouncementCreate,
    authorization: Optional[str] = Header(None)
):
    """Create a new announcement (admin only)"""
    require_admin(authorization)
    current_user = get_current_user(authorization)
    
    # Get admin user details
    admin = await db.users.find_one({"id": current_user["userId"]})
    
    # Sanitize inputs - use sanitize_html for body to preserve rich text formatting
    title = sanitize_string(announcement_data.title)
    body = sanitize_html(announcement_data.body)  # Allow safe HTML tags
    contact_info = sanitize_string(announcement_data.contactInfo) if announcement_data.contactInfo else None
    tags = [sanitize_string(t) for t in announcement_data.tags]
    
    # Validate
    if not validate_input_length(title, 200):
        raise HTTPException(status_code=400, detail="Title too long (max 200 chars)")
    if not validate_input_length(body, 10000):
        raise HTTPException(status_code=400, detail="Body too long (max 10000 chars)")
    
    announcement = Announcement(
        title=title,
        coverImage=announcement_data.coverImage,
        body=body,
        positions=[p.dict() for p in announcement_data.positions],
        contactInfo=contact_info,
        tags=tags,
        status=announcement_data.status,
        authorId=current_user["userId"],
        authorName=admin["fullName"] if admin else "Admin"
    )
    
    await db.announcements.insert_one(announcement.dict())
    
    return {"message": "Announcement created successfully", "announcement": announcement}

@api_router.put("/announcements/{announcement_id}")
async def update_announcement(
    announcement_id: str,
    announcement_data: AnnouncementCreate,
    authorization: Optional[str] = Header(None)
):
    """Update an announcement (admin only)"""
    require_admin(authorization)
    
    existing = await db.announcements.find_one({"id": announcement_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Announcement not found")
    
    update_data = {
        "title": sanitize_string(announcement_data.title),
        "body": sanitize_string(announcement_data.body),
        "coverImage": announcement_data.coverImage,
        "positions": [p.dict() for p in announcement_data.positions],
        "contactInfo": sanitize_string(announcement_data.contactInfo) if announcement_data.contactInfo else None,
        "tags": [sanitize_string(t) for t in announcement_data.tags],
        "status": announcement_data.status,
        "updatedAt": datetime.utcnow()
    }
    
    await db.announcements.update_one({"id": announcement_id}, {"$set": update_data})
    
    updated = await db.announcements.find_one({"id": announcement_id}, {"_id": 0})
    return {"message": "Announcement updated successfully", "announcement": updated}

@api_router.delete("/announcements/{announcement_id}")
async def delete_announcement(
    announcement_id: str,
    authorization: Optional[str] = Header(None)
):
    """Delete an announcement (admin only)"""
    require_admin(authorization)
    
    result = await db.announcements.delete_one({"id": announcement_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Announcement not found")
    
    # Also delete associated comments and likes
    await db.announcement_comments.delete_many({"announcementId": announcement_id})
    await db.announcement_likes.delete_many({"announcementId": announcement_id})
    
    return {"message": "Announcement deleted successfully"}

@api_router.post("/announcements/{announcement_id}/like")
async def like_announcement(
    announcement_id: str,
    authorization: Optional[str] = Header(None)
):
    """Like/unlike an announcement"""
    current_user = get_current_user(authorization)
    user_id = current_user["userId"]
    
    announcement = await db.announcements.find_one({"id": announcement_id})
    if not announcement:
        raise HTTPException(status_code=404, detail="Announcement not found")
    
    # Check if already liked
    existing_like = await db.announcement_likes.find_one({
        "userId": user_id,
        "announcementId": announcement_id
    })
    
    if existing_like:
        # Unlike
        await db.announcement_likes.delete_one({"_id": existing_like["_id"]})
        await db.announcements.update_one(
            {"id": announcement_id},
            {
                "$inc": {"likes": -1},
                "$pull": {"likedBy": user_id}
            }
        )
        message = "Announcement unliked"
        liked = False
    else:
        # Like
        from models import AnnouncementLike
        like = AnnouncementLike(userId=user_id, announcementId=announcement_id)
        await db.announcement_likes.insert_one(like.dict())
        await db.announcements.update_one(
            {"id": announcement_id},
            {
                "$inc": {"likes": 1},
                "$push": {"likedBy": user_id}
            }
        )
        message = "Announcement liked"
        liked = True
    
    updated = await db.announcements.find_one({"id": announcement_id}, {"_id": 0})
    return {"message": message, "liked": liked, "likes": updated["likes"]}

@api_router.post("/announcements/{announcement_id}/comment")
async def comment_on_announcement(
    announcement_id: str,
    comment_data: AnnouncementCommentCreate,
    authorization: Optional[str] = Header(None)
):
    """Add a comment to an announcement"""
    current_user = get_current_user(authorization)
    user_id = current_user["userId"]
    
    # Rate limiting
    if not check_comment_rate_limit(user_id):
        raise HTTPException(status_code=429, detail="Too many comments. Please wait a moment.")
    
    # Validate content
    content = sanitize_string(comment_data.content)
    if not content.strip():
        raise HTTPException(status_code=400, detail="Comment cannot be empty")
    if not validate_input_length(content, 1000):
        raise HTTPException(status_code=400, detail="Comment too long (max 1000 chars)")
    
    # Apply profanity filter
    content = filter_profanity(content)
    
    # Check announcement exists
    announcement = await db.announcements.find_one({"id": announcement_id})
    if not announcement:
        raise HTTPException(status_code=404, detail="Announcement not found")
    
    # Get user's public profile
    user = await db.users.find_one({"id": user_id})
    profile = await db.public_profiles.find_one({"userId": user_id})
    
    display_name = profile.get("displayName") if profile else user.get("fullName", "User")
    avatar_url = profile.get("avatarUrl") if profile else None
    
    comment = AnnouncementComment(
        announcementId=announcement_id,
        userId=user_id,
        displayName=display_name,
        avatarUrl=avatar_url,
        content=content
    )
    
    await db.announcement_comments.insert_one(comment.dict())
    
    # Update comment count
    await db.announcements.update_one(
        {"id": announcement_id},
        {"$inc": {"commentsCount": 1}}
    )
    
    return {"message": "Comment added successfully", "comment": comment.dict()}

@api_router.delete("/announcements/{announcement_id}/comments/{comment_id}")
async def delete_announcement_comment(
    announcement_id: str,
    comment_id: str,
    authorization: Optional[str] = Header(None)
):
    """Delete a comment (own comment or admin can delete any)"""
    current_user = get_current_user(authorization)
    user_id = current_user["userId"]
    is_admin = current_user.get("role") == "admin"
    
    comment = await db.announcement_comments.find_one({"id": comment_id})
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    
    # Check permission
    if comment["userId"] != user_id and not is_admin:
        raise HTTPException(status_code=403, detail="Not authorized to delete this comment")
    
    await db.announcement_comments.delete_one({"id": comment_id})
    
    # Update comment count
    await db.announcements.update_one(
        {"id": announcement_id},
        {"$inc": {"commentsCount": -1}}
    )
    
    return {"message": "Comment deleted successfully"}

@api_router.put("/announcements/comments/{comment_id}/moderate")
async def moderate_comment(
    comment_id: str,
    authorization: Optional[str] = Header(None)
):
    """Moderate (hide) a comment (admin only)"""
    require_admin(authorization)
    current_user = get_current_user(authorization)
    
    result = await db.announcement_comments.update_one(
        {"id": comment_id},
        {
            "$set": {
                "isModerated": True,
                "moderatedBy": current_user["userId"],
                "moderatedAt": datetime.utcnow()
            }
        }
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Comment not found")
    
    return {"message": "Comment moderated successfully"}


# ==================== PUBLIC PROFILE ENDPOINTS ====================

@api_router.get("/profile/settings")
async def get_profile_settings(authorization: Optional[str] = Header(None)):
    """Get current user's profile settings"""
    current_user = get_current_user(authorization)
    
    profile = await db.public_profiles.find_one({"userId": current_user["userId"]}, {"_id": 0})
    
    if not profile:
        # Return default settings
        return {
            "profile": {
                "userId": current_user["userId"],
                "isPublic": False,
                "displayName": None,
                "rank": None,
                "vesselExperience": None,
                "nationality": None,
                "city": None,
                "bio": None,
                "linkedIn": None,
                "website": None,
                "avatarUrl": None
            }
        }
    
    return {"profile": profile}

@api_router.put("/profile/settings")
async def update_profile_settings(
    settings: PublicProfileSettings,
    authorization: Optional[str] = Header(None)
):
    """Update user's public profile settings"""
    current_user = get_current_user(authorization)
    
    # Sanitize inputs
    update_data = {
        "userId": current_user["userId"],
        "isPublic": settings.isPublic,
        "displayName": sanitize_string(settings.displayName) if settings.displayName else None,
        "rank": sanitize_string(settings.rank) if settings.rank else None,
        "vesselExperience": sanitize_string(settings.vesselExperience) if settings.vesselExperience else None,
        "nationality": sanitize_string(settings.nationality) if settings.nationality else None,
        "city": sanitize_string(settings.city) if settings.city else None,
        "bio": sanitize_string(settings.bio) if settings.bio else None,
        "linkedIn": sanitize_string(settings.linkedIn) if settings.linkedIn else None,
        "website": sanitize_string(settings.website) if settings.website else None,
        "avatarUrl": settings.avatarUrl,
        "updatedAt": datetime.utcnow()
    }
    
    await db.public_profiles.update_one(
        {"userId": current_user["userId"]},
        {"$set": update_data},
        upsert=True
    )
    
    return {"message": "Profile settings updated successfully", "profile": update_data}

@api_router.get("/profile/public/{user_id}")
async def get_public_profile(user_id: str):
    """Get a user's public profile (only if visibility is ON)"""
    profile = await db.public_profiles.find_one({"userId": user_id}, {"_id": 0})
    
    if not profile or not profile.get("isPublic", False):
        raise HTTPException(status_code=404, detail="Profile not available")
    
    # Return only safe public fields - NEVER include email, phone, DOB, etc.
    return {
        "profile": PublicProfileResponse(
            displayName=profile.get("displayName"),
            rank=profile.get("rank"),
            vesselExperience=profile.get("vesselExperience"),
            nationality=profile.get("nationality"),
            city=profile.get("city"),
            bio=profile.get("bio"),
            linkedIn=profile.get("linkedIn"),
            website=profile.get("website"),
            avatarUrl=profile.get("avatarUrl")
        )
    }


# ==================== PAYMENT ENDPOINTS ====================

@api_router.post("/payments")
async def create_payment(
    payment_data: PaymentCreate,
    authorization: Optional[str] = Header(None)
):
    """Create a payment record with proof"""
    current_user = get_current_user(authorization)
    
    # Check for existing pending payment
    existing_payment = await db.payments.find_one({
        "userId": current_user["userId"],
        "status": "pending"
    })
    
    if existing_payment:
        raise HTTPException(
            status_code=400, 
            detail="You already have a pending payment. Please wait for verification or contact admin."
        )
    
    payment = Payment(
        userId=current_user["userId"],
        **payment_data.dict()
    )
    
    await db.payments.insert_one(payment.dict())
    
    # Get payment info
    settings = await db.settings.find_one({"id": "payment_settings"})
    payment_info = settings.get("paymentInfo") if settings else PaymentInfo().dict()
    
    return {
        "message": "Payment submitted successfully. Please wait for admin verification.",
        "payment": {
            "id": payment.id,
            "status": payment.status,
            "amount": payment.amount,
            "createdAt": payment.createdAt.isoformat()
        },
        "paymentInfo": payment_info
    }

@api_router.get("/payments/my-payments")
async def get_my_payments(authorization: Optional[str] = Header(None)):
    """Get current user's payment history"""
    current_user = get_current_user(authorization)
    
    payments = await db.payments.find(
        {"userId": current_user["userId"]},
        {"_id": 0, "paymentProof": 0}  # Exclude _id and large proof data
    ).sort("createdAt", -1).to_list(100)
    
    return {"payments": payments}

@api_router.get("/payments/check-status")
async def check_payment_status(authorization: Optional[str] = Header(None)):
    """Check if user has a confirmed payment (can download CV)"""
    current_user = get_current_user(authorization)
    
    # Find the most recent confirmed payment
    confirmed_payment = await db.payments.find_one({
        "userId": current_user["userId"],
        "status": "confirmed"
    }, sort=[("confirmedAt", -1)])
    
    if confirmed_payment:
        return {
            "canDownload": True,
            "payment": {
                "id": confirmed_payment["id"],
                "status": "confirmed",
                "confirmedAt": confirmed_payment.get("confirmedAt")
            }
        }
    
    # Check for pending payment
    pending_payment = await db.payments.find_one({
        "userId": current_user["userId"],
        "status": "pending"
    })
    
    if pending_payment:
        return {
            "canDownload": False,
            "payment": {
                "id": pending_payment["id"],
                "status": "pending",
                "message": "Your payment is being verified. Please wait."
            }
        }
    
    return {
        "canDownload": False,
        "payment": None,
        "message": "No payment found. Please complete payment to download your CV."
    }

@api_router.get("/payments")
async def get_payments(authorization: Optional[str] = Header(None)):
    """Get all payments (admin only)"""
    require_admin(authorization)
    
    payments = await db.payments.find({}, {"_id": 0}).sort("createdAt", -1).to_list(1000)
    
    # Enrich with user data
    enriched_payments = []
    for payment in payments:
        user = await db.users.find_one({"id": payment["userId"]}, {"_id": 0})
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
    
    payment = await db.payments.find_one({"id": payment_id}, {"_id": 0})
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
    
    payment = await db.payments.find_one({"id": payment_id}, {"_id": 0})
    return {"message": "Payment rejected", "payment": payment}


# ==================== CV DOWNLOAD ENDPOINT ====================

@api_router.post("/cv/download")
async def download_cv(
    cv_data: dict,
    authorization: Optional[str] = Header(None)
):
    """Generate and download CV as PDF (requires confirmed payment)"""
    current_user = get_current_user(authorization)
    
    # Check if user has a confirmed payment
    confirmed_payment = await db.payments.find_one({
        "userId": current_user["userId"],
        "status": "confirmed"
    })
    
    if not confirmed_payment:
        raise HTTPException(
            status_code=402, 
            detail="Payment required. Please complete payment to download your CV."
        )
    
    try:
        # Extract profile photo if provided
        profile_photo = cv_data.get('profilePhoto')
        
        # Generate PDF
        pdf_buffer = generate_cv_pdf(cv_data, profile_photo)
        
        # Get user name for filename
        personal_info = cv_data.get('personalInfo', {})
        full_name = personal_info.get('fullName', 'CV').replace(' ', '_')
        filename = f"{full_name}_Seaman_CV.pdf"
        
        return StreamingResponse(
            pdf_buffer,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename={filename}"
            }
        )
    except Exception as e:
        logger.error(f"PDF generation error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error generating PDF: {str(e)}")


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
