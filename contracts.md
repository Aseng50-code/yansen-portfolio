# API Contracts - CV Build for Seaman Backend

## Authentication & User Management

### 1. Register User
**POST** `/api/auth/register`
```json
Request:
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}

Response:
{
  "message": "Registration successful. Please check your email for verification.",
  "userId": "user_id_here"
}
```

### 2. Verify Email
**POST** `/api/auth/verify-email`
```json
Request:
{
  "token": "verification_token"
}

Response:
{
  "message": "Email verified successfully",
  "user": { ... }
}
```

### 3. Login
**POST** `/api/auth/login`
```json
Request:
{
  "email": "john@example.com",
  "password": "securePassword123"
}

Response:
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "john@example.com",
    "fullName": "John Doe",
    "role": "user",
    "isVerified": true
  }
}
```

### 4. Get Current User
**GET** `/api/auth/me`
Headers: `Authorization: Bearer {token}`
```json
Response:
{
  "user": {
    "id": "user_id",
    "email": "john@example.com",
    "fullName": "John Doe",
    "role": "user"
  }
}
```

## Job Management (Admin Only)

### 5. Get All Jobs
**GET** `/api/jobs`
```json
Response:
{
  "jobs": [
    {
      "id": "job_id",
      "title": "Chief Engineer",
      "company": "Maersk Line",
      "vesselType": "Container Vessel",
      "route": "Europe - Asia",
      "salary": "$8,000 - $10,000/month",
      "contract": "6 months on/off",
      "requirements": "Chief Engineer Certificate...",
      "postedDate": "2024-12-28",
      "featured": true,
      "likes": 0,
      "comments": []
    }
  ]
}
```

### 6. Create Job (Admin)
**POST** `/api/jobs`
Headers: `Authorization: Bearer {admin_token}`
```json
Request:
{
  "title": "Chief Engineer",
  "company": "Maersk Line",
  "vesselType": "Container Vessel",
  "route": "Europe - Asia",
  "salary": "$8,000 - $10,000/month",
  "contract": "6 months on/off",
  "requirements": "Chief Engineer Certificate...",
  "featured": true
}

Response:
{
  "message": "Job created successfully",
  "job": { ... }
}
```

### 7. Update Job (Admin)
**PUT** `/api/jobs/:id`
Headers: `Authorization: Bearer {admin_token}`
```json
Request: (same as create)
Response: { "message": "Job updated", "job": {...} }
```

### 8. Delete Job (Admin)
**DELETE** `/api/jobs/:id`
Headers: `Authorization: Bearer {admin_token}`
```json
Response: { "message": "Job deleted successfully" }
```

### 9. Like Job
**POST** `/api/jobs/:id/like`
Headers: `Authorization: Bearer {token}`

### 10. Comment on Job
**POST** `/api/jobs/:id/comment`
Headers: `Authorization: Bearer {token}`
```json
Request: { "text": "Great opportunity!" }
Response: { "message": "Comment added", "comment": {...} }
```

## Payment Management

### 11. Create Payment Record
**POST** `/api/payments`
Headers: `Authorization: Bearer {token}`
```json
Request:
{
  "cvId": "cv_id_here",
  "amount": 15000,
  "paymentMethod": "bank",
  "email": "user@example.com",
  "phone": "+62123456789"
}

Response:
{
  "message": "Payment record created",
  "payment": {
    "id": "payment_id",
    "userId": "user_id",
    "amount": 15000,
    "status": "pending",
    "paymentMethod": "bank",
    "createdAt": "2024-12-28"
  },
  "paymentInfo": {
    "bankName": "Bank BCA",
    "accountNumber": "1234567890",
    "accountName": "CV Build for Seaman"
  }
}
```

### 12. Get All Payments (Admin)
**GET** `/api/payments`
Headers: `Authorization: Bearer {admin_token}`
```json
Response:
{
  "payments": [
    {
      "id": "payment_id",
      "user": { "fullName": "John Doe", "email": "john@example.com" },
      "amount": 15000,
      "status": "pending",
      "paymentMethod": "bank",
      "createdAt": "2024-12-28"
    }
  ]
}
```

### 13. Confirm Payment (Admin)
**PUT** `/api/payments/:id/confirm`
Headers: `Authorization: Bearer {admin_token}`
```json
Response:
{
  "message": "Payment confirmed",
  "payment": { "status": "confirmed", ... }
}
```

### 14. Reject Payment (Admin)
**PUT** `/api/payments/:id/reject`
Headers: `Authorization: Bearer {admin_token}`
```json
Request: { "reason": "Invalid payment proof" }
Response: { "message": "Payment rejected", "payment": {...} }
```

## Settings Management (Admin)

### 15. Get Payment Info
**GET** `/api/settings/payment-info`
```json
Response:
{
  "paymentInfo": {
    "bankName": "Bank BCA",
    "accountNumber": "1234567890",
    "accountName": "CV Build for Seaman",
    "instructions": "Transfer to account above and upload proof"
  }
}
```

### 16. Update Payment Info (Admin)
**PUT** `/api/settings/payment-info`
Headers: `Authorization: Bearer {admin_token}`
```json
Request:
{
  "bankName": "Bank BCA",
  "accountNumber": "9876543210",
  "accountName": "CV Build for Seaman",
  "instructions": "Transfer to account above..."
}

Response:
{
  "message": "Payment info updated",
  "paymentInfo": { ... }
}
```

## Admin Features

### Creating First Admin:
Run this script once to create admin account:
```bash
python create_admin.py
```
Or manually set role to "admin" in database for a user.

### Protected Routes:
- All `/api/jobs` POST, PUT, DELETE require admin
- All `/api/payments` GET, PUT require admin
- All `/api/settings` PUT require admin
