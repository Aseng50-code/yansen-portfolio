# 🔐 ADMINISTRATOR LOGIN PROCEDURE
## CV Build for Seaman - Admin Access Guide

---

## 📋 ADMIN CREDENTIALS

**Your Administrator Account:**
- **Email**: `yansen@jesseenergisejahtera.com`
- **Password**: `123456`
- **Role**: Administrator (Full Access)

⚠️ **SECURITY NOTICE**: Please change this password immediately after first login!

---

## 🚀 HOW TO LOGIN AS ADMINISTRATOR

### Method 1: Via Frontend (Recommended)

1. **Navigate to Login Page**
   - Open your browser
   - Go to: `http://localhost:3000/login`
   - Or click "Log in" button in the navigation bar

2. **Enter Admin Credentials**
   - Email: `yansen@jesseenergisejahtera.com`
   - Password: `123456`

3. **Click "Log In"**
   - You will be logged in with admin privileges
   - You'll be redirected to the CV Builder or Dashboard

4. **Verify Admin Access**
   - Your role should show as "admin"
   - You'll have access to admin features

### Method 2: Via API (Direct Backend)

#### Step 1: Login Request
```bash
curl -X POST http://localhost:8001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "yansen@jesseenergisejahtera.com",
    "password": "123456"
  }'
```

#### Step 2: Response (Save the Token)
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id_here",
    "email": "yansen@jesseenergisejahtera.com",
    "fullName": "Yansen Admin",
    "role": "admin",
    "isVerified": true
  }
}
```

#### Step 3: Use Token for Admin Actions
```bash
# Example: Create a job posting
curl -X POST http://localhost:8001/api/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Chief Engineer",
    "company": "Maersk Line",
    "vesselType": "Container Vessel",
    "route": "Europe - Asia",
    "salary": "$8,000 - $10,000/month",
    "contract": "6 months on/off",
    "requirements": "Chief Engineer Certificate required",
    "featured": true
  }'
```

---

## 🔑 CHANGING YOUR PASSWORD (REQUIRED)

### Via API:
```bash
curl -X POST http://localhost:8001/api/auth/change-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "currentPassword": "123456",
    "newPassword": "YourNewSecurePassword123!"
  }'
```

**Password Requirements:**
- ✅ Minimum 6 characters
- ✅ Can contain letters, numbers, and special characters
- ✅ Must be different from current password

---

## 🎯 ADMIN PRIVILEGES & CAPABILITIES

As an administrator, you have access to:

### 1. **Job Management** 📋
   - ✅ Create new maritime job openings
   - ✅ Edit existing job postings
   - ✅ Delete job postings
   - ✅ Mark jobs as "featured"
   - ✅ View all likes and comments

### 2. **Payment Management** 💰
   - ✅ View all payment records
   - ✅ Confirm payments (allow CV downloads)
   - ✅ Reject payments with reasons
   - ✅ Track payment history
   - ✅ See user details for each payment

### 3. **Payment Settings** 🏦
   - ✅ Update bank account number
   - ✅ Change bank name
   - ✅ Modify account holder name
   - ✅ Edit payment instructions

### 4. **User Management** 👥
   - ✅ View all registered users
   - ✅ See user verification status
   - ✅ Monitor user activities

---

## 🛠️ ADMIN API ENDPOINTS

### Job Management
```bash
# Get all jobs
GET /api/jobs

# Create new job (admin only)
POST /api/jobs
Headers: Authorization: Bearer {token}

# Update job (admin only)
PUT /api/jobs/{job_id}
Headers: Authorization: Bearer {token}

# Delete job (admin only)
DELETE /api/jobs/{job_id}
Headers: Authorization: Bearer {token}
```

### Payment Management
```bash
# Get all payments (admin only)
GET /api/payments
Headers: Authorization: Bearer {token}

# Confirm payment (admin only)
PUT /api/payments/{payment_id}/confirm
Headers: Authorization: Bearer {token}

# Reject payment (admin only)
PUT /api/payments/{payment_id}/reject
Headers: Authorization: Bearer {token}
Body: {"reason": "Invalid payment proof"}
```

### Payment Settings
```bash
# Get current payment info (public)
GET /api/settings/payment-info

# Update payment info (admin only)
PUT /api/settings/payment-info
Headers: Authorization: Bearer {token}
Body: {
  "bankName": "Bank BCA",
  "accountNumber": "9876543210",
  "accountName": "CV Build for Seaman",
  "instructions": "Transfer to account above"
}
```

---

## 🔒 SECURITY FEATURES IMPLEMENTED

### ✅ Protection Against XSS (Cross-Site Scripting)
- All user inputs are sanitized
- HTML tags are stripped
- Special characters are escaped
- Script injections are blocked

### ✅ Protection Against IDOR (Insecure Direct Object Reference)
- Authorization checks on all resources
- Users can only access their own data
- Admins have verified elevated access
- Object ID validation

### ✅ Protection Against SQL/NoSQL Injection
- MongoDB parameterized queries
- Input validation and sanitization
- Dangerous operators are filtered
- Query sanitization layer

### ✅ Additional Security Measures
- Password hashing with bcrypt
- JWT token authentication (7-day expiry)
- Email validation
- Input length validation
- Role-based access control

---

## 🧪 TESTING ADMIN FEATURES

### Test 1: Create a Job
```bash
TOKEN="your_admin_token_here"

curl -X POST http://localhost:8001/api/jobs \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Second Officer",
    "company": "MSC Shipping",
    "vesselType": "Bulk Carrier",
    "route": "Worldwide",
    "salary": "$5,500 - $6,500/month",
    "contract": "4 months on/2 off",
    "requirements": "OOW Certificate, ECDIS certified",
    "featured": false
  }'
```

### Test 2: Update Payment Settings
```bash
curl -X PUT http://localhost:8001/api/settings/payment-info \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "bankName": "Bank BCA",
    "accountNumber": "1234567890",
    "accountName": "PT Jesse Energi Sejahtera",
    "instructions": "Transfer Rp 15,000 ke rekening di atas. Konfirmasi dalam 1 jam."
  }'
```

### Test 3: Confirm a Payment
```bash
# First, get payment ID from /api/payments
curl -X PUT http://localhost:8001/api/payments/{payment_id}/confirm \
  -H "Authorization: Bearer $TOKEN"
```

---

## ⚠️ IMPORTANT SECURITY REMINDERS

1. **🔐 Change Default Password Immediately**
   - Current password: `123456` (WEAK - CHANGE IT!)
   - Use a strong, unique password

2. **🔒 Keep Your Token Secure**
   - Never share your JWT token
   - Token expires after 7 days
   - Re-login if token expires

3. **👁️ Monitor Admin Activities**
   - Check logs regularly
   - Review payment confirmations
   - Audit job postings

4. **🚫 Do Not Share Admin Credentials**
   - Admin access is for authorized personnel only
   - Create separate admin accounts if needed
   - Use `python create_admin.py` to add more admins

---

## 📞 SUPPORT & TROUBLESHOOTING

### Cannot Login?
- ✅ Verify email is correct: `yansen@jesseenergisejahtera.com`
- ✅ Verify password: `123456`
- ✅ Check backend is running: `sudo supervisorctl status backend`
- ✅ Check backend logs: `tail -f /var/log/supervisor/backend.err.log`

### Token Expired?
- ✅ Login again to get a new token
- ✅ Tokens are valid for 7 days

### Permission Denied?
- ✅ Verify your role is "admin" in the response
- ✅ Check token is included in Authorization header
- ✅ Format: `Authorization: Bearer {token}`

---

## 📚 ADDITIONAL RESOURCES

- **API Documentation**: `/app/contracts.md`
- **Backend README**: `/app/backend/README.md`
- **Security Features**: `/app/backend/security.py`
- **Create More Admins**: Run `python /app/backend/create_admin.py`

---

## ✅ QUICK START CHECKLIST

- [ ] Login with provided credentials
- [ ] Change your password immediately
- [ ] Test creating a job posting
- [ ] Update payment bank account settings
- [ ] Review pending payments
- [ ] Familiarize yourself with admin dashboard

---

**Last Updated**: December 30, 2024
**System**: CV Build for Seaman v1.0
**Environment**: Development

---

For any issues or questions, please check the logs or contact technical support.
