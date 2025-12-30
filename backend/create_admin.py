#!/usr/bin/env python3
"""
Script to create the first admin user for CV Build for Seaman
Run this once to create your admin account
"""

import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pathlib import Path
import os
import sys

# Add parent directory to path
sys.path.append(str(Path(__file__).parent))

from models import User
from auth_utils import hash_password, generate_verification_token

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

async def create_admin():
    # Connect to MongoDB
    mongo_url = os.environ['MONGO_URL']
    client = AsyncIOMotorClient(mongo_url)
    db = client[os.environ['DB_NAME']]
    
    print("=" * 50)
    print("Create Admin User for CV Build for Seaman")
    print("=" * 50)
    
    # Get admin details
    email = input("Enter admin email: ").strip()
    full_name = input("Enter admin full name: ").strip()
    password = input("Enter admin password: ").strip()
    
    # Check if user exists
    existing = await db.users.find_one({"email": email})
    if existing:
        print(f"\n❌ User with email {email} already exists!")
        if existing.get("role") == "admin":
            print("This user is already an admin.")
        else:
            make_admin = input("Make this user an admin? (yes/no): ").lower()
            if make_admin == "yes":
                await db.users.update_one(
                    {"email": email},
                    {"$set": {"role": "admin", "isVerified": True}}
                )
                print(f"\n✅ User {email} is now an admin!")
        client.close()
        return
    
    # Create admin user
    admin = User(
        email=email,
        fullName=full_name,
        role="admin",
        isVerified=True,  # Admin is pre-verified
        verificationToken=None
    )
    
    user_dict = admin.dict()
    user_dict["hashedPassword"] = hash_password(password)
    
    await db.users.insert_one(user_dict)
    
    print(f"\n✅ Admin user created successfully!")
    print(f"Email: {email}")
    print(f"Role: admin")
    print(f"\nYou can now login with these credentials.")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(create_admin())
