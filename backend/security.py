"""
Security utilities for CV Build for Seaman
Protects against XSS, IDOR, and injection attacks
"""
import re
import html
from typing import Any, Dict
from fastapi import HTTPException

# XSS Protection
def sanitize_string(text: str) -> str:
    """
    Sanitize string input to prevent XSS attacks
    - Strips HTML tags
    - Escapes special characters
    - Removes potentially dangerous content
    """
    if not isinstance(text, str):
        return text
    
    # Remove HTML tags
    text = re.sub(r'<[^>]*>', '', text)
    
    # Escape HTML entities
    text = html.escape(text)
    
    # Remove script content
    text = re.sub(r'javascript:', '', text, flags=re.IGNORECASE)
    text = re.sub(r'on\w+\s*=', '', text, flags=re.IGNORECASE)
    
    return text.strip()

def sanitize_html(text: str) -> str:
    """
    Sanitize HTML content to prevent XSS attacks while allowing safe formatting tags.
    Used for rich text editor content.
    - Allows safe HTML tags (p, strong, em, ul, ol, li, etc.)
    - Removes dangerous tags and attributes (script, onclick, etc.)
    """
    if not isinstance(text, str):
        return text
    
    # Remove script tags and their content
    text = re.sub(r'<script[^>]*>.*?</script>', '', text, flags=re.IGNORECASE | re.DOTALL)
    
    # Remove style tags and their content
    text = re.sub(r'<style[^>]*>.*?</style>', '', text, flags=re.IGNORECASE | re.DOTALL)
    
    # Remove all event handlers (onclick, onload, etc.)
    text = re.sub(r'\s+on\w+\s*=\s*["\'][^"\']*["\']', '', text, flags=re.IGNORECASE)
    text = re.sub(r'\s+on\w+\s*=\s*\S+', '', text, flags=re.IGNORECASE)
    
    # Remove javascript: protocol
    text = re.sub(r'javascript:', '', text, flags=re.IGNORECASE)
    
    # Remove data: protocol in URLs (can be used for XSS)
    text = re.sub(r'data:[^;]*;base64', 'blocked', text, flags=re.IGNORECASE)
    
    # Remove iframe, object, embed tags
    text = re.sub(r'<(iframe|object|embed)[^>]*>.*?</\1>', '', text, flags=re.IGNORECASE | re.DOTALL)
    text = re.sub(r'<(iframe|object|embed)[^>]*/?>', '', text, flags=re.IGNORECASE)
    
    # Remove form tags
    text = re.sub(r'<form[^>]*>.*?</form>', '', text, flags=re.IGNORECASE | re.DOTALL)
    
    return text.strip()

def sanitize_dict(data: Dict[str, Any]) -> Dict[str, Any]:
    """Recursively sanitize dictionary values"""
    sanitized = {}
    for key, value in data.items():
        if isinstance(value, str):
            sanitized[key] = sanitize_string(value)
        elif isinstance(value, dict):
            sanitized[key] = sanitize_dict(value)
        elif isinstance(value, list):
            sanitized[key] = [sanitize_string(v) if isinstance(v, str) else v for v in value]
        else:
            sanitized[key] = value
    return sanitized

# Input Validation
def validate_email(email: str) -> bool:
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_password(password: str) -> tuple[bool, str]:
    """
    Validate password strength
    Returns: (is_valid, error_message)
    """
    if len(password) < 6:
        return False, "Password must be at least 6 characters long"
    
    # Optional: Add more strict requirements
    # if not re.search(r'[A-Z]', password):
    #     return False, "Password must contain at least one uppercase letter"
    # if not re.search(r'[a-z]', password):
    #     return False, "Password must contain at least one lowercase letter"
    # if not re.search(r'[0-9]', password):
    #     return False, "Password must contain at least one number"
    
    return True, ""

def validate_object_id(obj_id: str) -> bool:
    """Validate if string is a valid object ID format"""
    # UUID format validation
    pattern = r'^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$'
    return re.match(pattern, obj_id, re.IGNORECASE) is not None

# IDOR Protection
def check_resource_ownership(user_id: str, resource_user_id: str, user_role: str = "user"):
    """
    Check if user has access to resource
    Prevents Insecure Direct Object Reference (IDOR)
    """
    # Admin can access all resources
    if user_role == "admin":
        return True
    
    # Regular users can only access their own resources
    if user_id != resource_user_id:
        raise HTTPException(
            status_code=403,
            detail="You don't have permission to access this resource"
        )
    
    return True

# NoSQL Injection Protection
def sanitize_mongo_query(query: Dict[str, Any]) -> Dict[str, Any]:
    """
    Sanitize MongoDB query to prevent NoSQL injection
    Removes MongoDB operators from user input
    """
    dangerous_ops = ['$where', '$regex', '$ne', '$gt', '$lt', '$gte', '$lte', '$nin', '$in']
    
    def clean_value(value):
        if isinstance(value, dict):
            return {k: clean_value(v) for k, v in value.items() if k not in dangerous_ops}
        elif isinstance(value, list):
            return [clean_value(v) for v in value]
        elif isinstance(value, str):
            # Remove MongoDB operators from strings
            for op in dangerous_ops:
                value = value.replace(op, '')
            return value
        return value
    
    return clean_value(query)

# Rate Limiting Helper
def check_rate_limit(user_id: str, action: str, max_requests: int = 100):
    """
    Basic rate limiting check
    In production, use Redis or similar for distributed rate limiting
    """
    # This is a placeholder - implement with Redis in production
    # For now, we'll return True
    return True

# SQL Injection Protection
# Note: We use MongoDB which is NoSQL, so traditional SQLi doesn't apply
# But we still validate inputs and use parameterized queries
def validate_input_length(text: str, max_length: int = 500) -> bool:
    """Validate input length to prevent buffer overflow attacks"""
    return len(text) <= max_length

def sanitize_filename(filename: str) -> str:
    """Sanitize filename to prevent path traversal attacks"""
    # Remove path separators
    filename = filename.replace('/', '').replace('\\', '')
    # Remove parent directory references
    filename = filename.replace('..', '')
    # Keep only alphanumeric, dash, underscore, and dot
    filename = re.sub(r'[^a-zA-Z0-9._-]', '', filename)
    return filename
