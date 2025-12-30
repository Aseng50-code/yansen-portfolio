# CV BUILD FOR SEAMAN - Backend Documentation

## 🚀 Backend Features

### ✅ Implemented Features:
1. **User Authentication & Verification**
   - Email/password registration with email verification
   - JWT-based authentication
   - Secure password hashing with bcrypt

2. **Role-Based Access Control**
   - User role: Regular seafarers
   - Admin role: Full access to manage system

3. **Job Board Management** (Admin)
   - Create, Read, Update, Delete maritime job openings
   - Like and comment functionality for users
   - Social features (likes count, comments with user info)

4. **Payment Management** (Admin)
   - Track payment records
   - Confirm payments
   - Reject payments with reasons
   - Link payments to users

5. **Payment Settings** (Admin)
   - Update bank account information
   - Change account number for CV downloads
   - Update payment instructions

## 🔐 Admin Credentials

**Default Admin Account:**
- Email: `admin@cvseaman.com`
- Password: `admin123`
- Role: admin

⚠️ **IMPORTANT:** Change the default password after first login!

## 📋 Creating Additional Admin Users

Run the following command:
```bash
cd /app/backend
python create_admin.py
```

Follow the prompts to create a new admin user.

## 🛠️ API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/verify-email` - Verify email with token
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Jobs (Public can view, Admin can manage)
- `GET /api/jobs` - Get all jobs
- `POST /api/jobs` - Create job (admin only)
- `PUT /api/jobs/:id` - Update job (admin only)
- `DELETE /api/jobs/:id` - Delete job (admin only)
- `POST /api/jobs/:id/like` - Like/unlike job (requires auth)
- `POST /api/jobs/:id/comment` - Comment on job (requires auth)

### Payments (Admin only)
- `POST /api/payments` - Create payment record (requires auth)
- `GET /api/payments` - Get all payments (admin only)
- `PUT /api/payments/:id/confirm` - Confirm payment (admin only)
- `PUT /api/payments/:id/reject` - Reject payment (admin only)

### Settings (Admin only for updates)
- `GET /api/settings/payment-info` - Get payment account info (public)
- `PUT /api/settings/payment-info` - Update payment info (admin only)

## 🔑 Authorization Header Format

For protected endpoints, include the JWT token in the header:
```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

## 🧪 Testing the API

### 1. Register a New User
```bash
curl -X POST http://localhost:8001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "seaman@example.com",
    "fullName": "John Doe",
    "password": "password123"
  }'
```

### 2. Verify Email (use token from registration response)
```bash
curl -X POST http://localhost:8001/api/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{"token": "VERIFICATION_TOKEN_HERE"}'
```

### 3. Login as Admin
```bash
curl -X POST http://localhost:8001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@cvseaman.com",
    "password": "admin123"
  }'
```

### 4. Create a Job (Admin)
```bash
curl -X POST http://localhost:8001/api/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "title": "Chief Engineer",
    "company": "Maersk Line",
    "vesselType": "Container Vessel",
    "route": "Europe - Asia",
    "salary": "$8,000 - $10,000/month",
    "contract": "6 months on/off",
    "requirements": "Chief Engineer Certificate, Min 5 years experience",
    "featured": true
  }'
```

### 5. Get All Jobs (Public)
```bash
curl http://localhost:8001/api/jobs
```

### 6. Update Payment Info (Admin)
```bash
curl -X PUT http://localhost:8001/api/settings/payment-info \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "bankName": "Bank BCA",
    "accountNumber": "1234567890",
    "accountName": "CV Build for Seaman",
    "instructions": "Transfer to the account above"
  }'
```

### 7. Get Payment Info (Public)
```bash
curl http://localhost:8001/api/settings/payment-info
```

### 8. Confirm Payment (Admin)
```bash
curl -X PUT http://localhost:8001/api/payments/PAYMENT_ID/confirm \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

## 📊 Database Collections

The backend uses MongoDB with the following collections:

1. **users** - User accounts with authentication
   - Fields: id, email, fullName, hashedPassword, role, isVerified, verificationToken, createdAt

2. **jobs** - Maritime job openings
   - Fields: id, title, company, vesselType, route, salary, contract, requirements, featured, postedDate, likes, likedBy, comments

3. **payments** - Payment records for CV downloads
   - Fields: id, userId, amount, paymentMethod, email, phone, status, rejectionReason, createdAt, confirmedAt

4. **settings** - System settings
   - Fields: id, paymentInfo (bankName, accountNumber, accountName, instructions), updatedAt

## 🔒 Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT tokens for authentication
- ✅ Role-based access control
- ✅ Email verification for new users
- ✅ Admin-only protected routes
- ✅ CORS configured for security

## 📝 Environment Variables

Required in `/app/backend/.env`:
```
MONGO_URL=mongodb://localhost:27017
DB_NAME=seaman_cv_db
JWT_SECRET_KEY=your-secret-key-here
```

## 🐛 Troubleshooting

1. **Backend not starting:**
   ```bash
   sudo supervisorctl restart backend
   tail -n 50 /var/log/supervisor/backend.err.log
   ```

2. **Database connection issues:**
   - Check MongoDB is running: `sudo supervisorctl status`
   - Verify MONGO_URL in .env file

3. **Authentication errors:**
   - Ensure JWT token is included in Authorization header
   - Check token hasn't expired (7-day validity)

## 📈 Next Steps for Production

1. ✅ Implement actual email sending for verification
2. ✅ Add password reset functionality
3. ✅ Implement file upload for payment proofs
4. ✅ Add rate limiting for API endpoints
5. ✅ Set up proper logging and monitoring
6. ✅ Configure production-grade JWT secret
7. ✅ Add input validation and sanitization
8. ✅ Implement HTTPS in production

## 📞 Admin Dashboard TODO

Create an admin dashboard in the frontend to:
- View all users
- Manage job postings (CRUD)
- Review and confirm payments
- Update payment account settings
- View analytics and statistics
