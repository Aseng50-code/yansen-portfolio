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

# Public Profile Settings
class PublicProfileSettings(BaseModel):
    userId: str
    isPublic: bool = False
    displayName: Optional[str] = None
    rank: Optional[str] = None
    vesselExperience: Optional[str] = None
    nationality: Optional[str] = None
    city: Optional[str] = None
    bio: Optional[str] = None
    linkedIn: Optional[str] = None
    website: Optional[str] = None
    avatarUrl: Optional[str] = None
    updatedAt: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        json_encoders = {datetime: lambda v: v.isoformat()}

class PublicProfileResponse(BaseModel):
    """Safe public profile data - no sensitive info"""
    displayName: Optional[str] = None
    rank: Optional[str] = None
    vesselExperience: Optional[str] = None
    nationality: Optional[str] = None
    city: Optional[str] = None
    bio: Optional[str] = None
    linkedIn: Optional[str] = None
    website: Optional[str] = None
    avatarUrl: Optional[str] = None

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

# Announcement Models
class AnnouncementPosition(BaseModel):
    title: str
    description: Optional[str] = None

class AnnouncementCreate(BaseModel):
    title: str
    coverImage: Optional[str] = None  # Base64 or URL
    body: str  # Rich text / markdown content
    positions: List[AnnouncementPosition] = []
    contactInfo: Optional[str] = None  # Email/phone/instructions
    tags: List[str] = []
    status: str = "published"  # "draft", "published"

class Announcement(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    coverImage: Optional[str] = None
    body: str
    positions: List[AnnouncementPosition] = []
    contactInfo: Optional[str] = None
    tags: List[str] = []
    status: str = "published"
    authorId: str
    authorName: str
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)
    likes: int = 0
    likedBy: List[str] = []
    commentsCount: int = 0
    
    class Config:
        json_encoders = {datetime: lambda v: v.isoformat()}

# Announcement Like Model
class AnnouncementLike(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    userId: str
    announcementId: str
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        json_encoders = {datetime: lambda v: v.isoformat()}

# Announcement Comment Model
class AnnouncementComment(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    announcementId: str
    userId: str
    displayName: str  # Only display name, no sensitive data
    avatarUrl: Optional[str] = None
    content: str
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    isModerated: bool = False
    moderatedBy: Optional[str] = None
    moderatedAt: Optional[datetime] = None
    
    class Config:
        json_encoders = {datetime: lambda v: v.isoformat()}

class AnnouncementCommentCreate(BaseModel):
    content: str

# Payment Models
class PaymentBase(BaseModel):
    amount: int  # In Rupiah
    paymentMethod: str  # "bank", "ewallet", "card"
    email: EmailStr
    phone: str

class PaymentCreate(PaymentBase):
    cvId: Optional[str] = None
    paymentProof: Optional[str] = None  # Base64 encoded image of payment proof

class Payment(PaymentBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    userId: str
    status: str = "pending"  # "pending", "confirmed", "rejected"
    paymentProof: Optional[str] = None  # Base64 encoded image
    rejectionReason: Optional[str] = None
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    confirmedAt: Optional[datetime] = None
    cvData: Optional[dict] = None  # Store CV data for PDF generation
    
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
