from datetime import datetime, timedelta
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field
import uuid

# User Models
class UserBase(BaseModel):
    email: EmailStr
    fullName: str

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(UserBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    role: str = "user"  # "user" or "admin"
    isVerified: bool = False
    verificationToken: Optional[str] = None
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        json_encoders = {datetime: lambda v: v.isoformat()}

class UserResponse(UserBase):
    id: str
    role: str
    isVerified: bool

# Job Models
class JobComment(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    userId: str
    userName: str
    text: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        json_encoders = {datetime: lambda v: v.isoformat()}

class JobBase(BaseModel):
    title: str
    company: str
    vesselType: str
    route: str
    salary: str
    contract: str
    requirements: str
    featured: bool = False

class JobCreate(JobBase):
    pass

class Job(JobBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    postedDate: datetime = Field(default_factory=datetime.utcnow)
    likes: int = 0
    likedBy: List[str] = []  # List of user IDs
    comments: List[JobComment] = []
    
    class Config:
        json_encoders = {datetime: lambda v: v.isoformat()}

class CommentCreate(BaseModel):
    text: str

# Payment Models
class PaymentBase(BaseModel):
    amount: int  # In Rupiah
    paymentMethod: str  # "bank", "ewallet", "card"
    email: EmailStr
    phone: str

class PaymentCreate(PaymentBase):
    cvId: Optional[str] = None

class Payment(PaymentBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    userId: str
    status: str = "pending"  # "pending", "confirmed", "rejected"
    rejectionReason: Optional[str] = None
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    confirmedAt: Optional[datetime] = None
    
    class Config:
        json_encoders = {datetime: lambda v: v.isoformat()}

class PaymentReject(BaseModel):
    reason: str

# Settings Models
class PaymentInfo(BaseModel):
    bankName: str = "Bank BCA"
    accountNumber: str = "1234567890"
    accountName: str = "CV Build for Seaman"
    instructions: str = "Transfer to the account above and keep your payment proof"

class Settings(BaseModel):
    id: str = "payment_settings"
    paymentInfo: PaymentInfo
    updatedAt: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        json_encoders = {datetime: lambda v: v.isoformat()}

# Auth Models
class Token(BaseModel):
    token: str
    user: UserResponse

class VerifyEmail(BaseModel):
    token: str

class ChangePassword(BaseModel):
    currentPassword: str
    newPassword: str
