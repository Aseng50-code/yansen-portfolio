# 💾 DATABASE & DEPLOYMENT GUIDE
## CV Build for Seaman - Storage & Domain Setup

---

## 📊 DATABASE STORAGE EXPLAINED

### Current Setup (Development)

**Database Type**: MongoDB (NoSQL Database)  
**Storage Location**: Local MongoDB instance running in your Docker container  
**Database Name**: `seaman_cv_db`  
**Connection String**: `mongodb://localhost:27017`

**What's Stored in Database**:
1. **Users Collection** - User accounts, passwords (hashed), roles
2. **Jobs Collection** - Maritime job postings, likes, comments
3. **Payments Collection** - Payment records, status, confirmations
4. **Settings Collection** - System settings (bank account info, etc.)

**Physical Storage Location**:
- Inside Docker container at: `/var/lib/mongodb/`
- Data persists as long as container is running
- ⚠️ Data will be LOST if container is deleted without volume mount

---

## 🔧 CURRENT DATABASE ACCESS

### View Your Data:

#### Option 1: Via MongoDB Shell
```bash
# Enter the container
docker exec -it <container_name> bash

# Connect to MongoDB
mongosh mongodb://localhost:27017/seaman_cv_db

# View collections
show collections

# View users
db.users.find().pretty()

# View jobs
db.jobs.find().pretty()

# View payments
db.payments.find().pretty()
```

#### Option 2: Via Python Script
```bash
cd /app/backend
python3 << EOF
from motor.motor_asyncio import AsyncIOMotorClient
import asyncio

async def view_data():
    client = AsyncIOMotorClient('mongodb://localhost:27017')
    db = client['seaman_cv_db']
    
    users = await db.users.find().to_list(100)
    print(f"Total Users: {len(users)}")
    for user in users:
        print(f"- {user['email']} ({user['role']})")

asyncio.run(view_data())
EOF
```

---

## 🌐 PRODUCTION DEPLOYMENT OPTIONS

### Option 1: MongoDB Atlas (Recommended - FREE Tier Available)

**Steps**:
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create a FREE cluster (M0 - 512MB storage)
4. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/`
5. Update `.env` file:
   ```bash
   MONGO_URL=mongodb+srv://your-username:password@cluster.mongodb.net/seaman_cv_db
   ```

**Advantages**:
- ✅ Free tier available (512MB)
- ✅ Automatic backups
- ✅ Always online
- ✅ Secure & managed
- ✅ No maintenance needed

---

### Option 2: Self-Hosted MongoDB

**Requirements**:
- VPS or Cloud server (DigitalOcean, AWS, etc.)
- Install MongoDB on server
- Configure security (firewall, authentication)
- Setup backups manually

---

## 🌍 DOMAIN REGISTRATION (OPTIONAL BUT RECOMMENDED)

### Do You Need a Domain?

**For Development (Current)**:
- ❌ NO domain needed
- Access via: `localhost:3000` or `http://your-ip:3000`
- Good for testing

**For Production (Public Access)**:
- ✅ YES, domain recommended
- Users access via: `www.cvbuildforseaman.com`
- Professional appearance
- SSL certificate (HTTPS)

---

### How to Get a Domain

#### Step 1: Choose Domain Registrar
Popular options:
- **Namecheap** - `namecheap.com` ($8-12/year)
- **GoDaddy** - `godaddy.com` ($10-15/year)
- **Google Domains** - `domains.google` ($12/year)
- **Cloudflare** - `cloudflare.com` ($9-10/year)

#### Step 2: Search & Buy Domain
Example domains:
- `cvbuildforseaman.com`
- `seamancv.com`
- `maritimecvbuilder.com`
- `cvseaman.id` (Indonesian domain)

#### Step 3: Point Domain to Your Server
Configure DNS records:
```
A Record:    @           →  Your Server IP (e.g., 123.45.67.89)
A Record:    www         →  Your Server IP
```

#### Step 4: Setup SSL Certificate (HTTPS)
Use Let's Encrypt (FREE):
```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d cvbuildforseaman.com -d www.cvbuildforseaman.com
```

---

## 🚀 DEPLOYMENT SCENARIOS

### Scenario 1: Deploy on VPS (Recommended)

**Providers**:
- **DigitalOcean** - $5/month (1GB RAM)
- **Vultr** - $5/month
- **Linode** - $5/month
- **AWS Lightsail** - $3.50/month

**Steps**:
1. Rent VPS (Ubuntu 22.04)
2. Install Docker
3. Clone your code
4. Setup MongoDB Atlas (or local MongoDB)
5. Point domain to VPS IP
6. Setup Nginx reverse proxy
7. Install SSL certificate
8. Run application

**Total Cost**: $5-15/month

---

### Scenario 2: Deploy on Heroku (Easy)

**Steps**:
1. Create Heroku account
2. Install Heroku CLI
3. Create Heroku app
4. Add MongoDB Atlas add-on (FREE)
5. Push code: `git push heroku main`
6. Add custom domain (optional)

**Cost**: FREE tier available (limited hours)

---

### Scenario 3: Deploy on Vercel (Frontend) + Railway (Backend)

**Frontend (Vercel)**:
- FREE hosting
- Automatic SSL
- Custom domain support
- Deploy React app

**Backend (Railway)**:
- FREE $5 credit/month
- MongoDB included
- Easy deployment
- Auto-scaling

---

## 📁 DATA PERSISTENCE & BACKUP

### Current Setup (Development)
⚠️ **WARNING**: Data is NOT persistent!
- If you delete container, all data is LOST
- Need to setup volume mounting

### Make Data Persistent (Development)

Add volume mount to your container:
```bash
docker run -v /path/on/host:/var/lib/mongodb ...
```

Or use Docker Compose:
```yaml
services:
  mongodb:
    image: mongo:latest
    volumes:
      - mongodb_data:/data/db

volumes:
  mongodb_data:
```

---

### Production Backup Strategy

**Automated Daily Backups**:
```bash
# Backup script
mongodump --uri="mongodb://localhost:27017/seaman_cv_db" --out=/backups/$(date +%Y%m%d)

# Restore script
mongorestore --uri="mongodb://localhost:27017" /backups/20241230
```

**MongoDB Atlas Auto-Backups**:
- Automatic snapshots
- Point-in-time recovery
- Download backups anytime

---

## 🔐 SECURITY FOR PRODUCTION

### Database Security Checklist:

- [ ] **Enable MongoDB Authentication**
  ```javascript
  use admin
  db.createUser({
    user: "admin",
    pwd: "strong_password",
    roles: ["root"]
  })
  ```

- [ ] **Use Strong Passwords**
  - Change default MongoDB password
  - Update JWT secret key
  - Change admin password from `123456`

- [ ] **Firewall Configuration**
  ```bash
  # Allow only your server IP to access MongoDB
  sudo ufw allow from YOUR_SERVER_IP to any port 27017
  ```

- [ ] **Enable SSL/TLS**
  - Use HTTPS for website
  - Use SSL for MongoDB connection

- [ ] **Regular Backups**
  - Daily automated backups
  - Store backups in separate location
  - Test restore process

---

## 📊 MONITORING & MAINTENANCE

### Database Monitoring:

**Check Database Size**:
```bash
mongosh mongodb://localhost:27017/seaman_cv_db
db.stats()
```

**Check Collection Sizes**:
```javascript
db.users.stats()
db.jobs.stats()
db.payments.stats()
```

**Monitor Active Connections**:
```javascript
db.serverStatus().connections
```

---

## 🆘 TROUBLESHOOTING

### Problem: "Cannot connect to database"
**Solutions**:
1. Check if MongoDB is running: `sudo supervisorctl status`
2. Check MongoDB logs: `tail -f /var/log/mongodb/mongodb.log`
3. Verify connection string in `.env` file
4. Check firewall settings

### Problem: "Database is full"
**Solutions**:
1. Upgrade to larger MongoDB Atlas tier
2. Delete old/unnecessary data
3. Compress old data and archive
4. Add database indexes for better performance

### Problem: "Lost all data after restart"
**Solutions**:
1. Setup volume mounting for persistence
2. Use MongoDB Atlas instead of local MongoDB
3. Regular backups before container restarts

---

## 💡 RECOMMENDATIONS

### For Testing (Current):
- ✅ Use local MongoDB (current setup)
- ✅ No domain needed
- ✅ Access via localhost

### For Production:
- ✅ Use MongoDB Atlas (FREE tier)
- ✅ Register a domain ($10/year)
- ✅ Deploy on VPS or cloud platform
- ✅ Setup SSL certificate (FREE via Let's Encrypt)
- ✅ Enable automated backups
- ✅ Use monitoring tools

### Estimated Production Costs:
```
Domain Registration:     $10-12/year
VPS Hosting:            $5-10/month
MongoDB Atlas:          FREE (512MB) or $9/month (2GB)
SSL Certificate:        FREE (Let's Encrypt)

Total: ~$70-150/year
```

---

## 📞 QUICK ANSWERS

**Q: Where is my database now?**  
A: Local MongoDB inside Docker container at `mongodb://localhost:27017`

**Q: Do I need a domain right now?**  
A: No, only needed for public/production deployment

**Q: Will my data be lost?**  
A: Yes, if container is deleted without volume mounting or cloud database

**Q: What's the best deployment option?**  
A: MongoDB Atlas (database) + DigitalOcean/Vercel (hosting) + Namecheap (domain)

**Q: How do I backup my database?**  
A: Use `mongodump` command or MongoDB Atlas automatic backups

**Q: Can I use this without domain?**  
A: Yes, access via IP address or localhost (for internal use only)

---

## 📚 NEXT STEPS

1. **For Now (Development)**:
   - Continue using localhost
   - No changes needed
   - Data stored locally

2. **When Ready for Production**:
   - [ ] Create MongoDB Atlas account
   - [ ] Register domain name
   - [ ] Choose hosting provider (VPS/Cloud)
   - [ ] Setup SSL certificate
   - [ ] Configure DNS records
   - [ ] Deploy application
   - [ ] Setup automated backups
   - [ ] Monitor and maintain

---

**Need Help?**
- MongoDB Atlas Docs: [docs.mongodb.com](https://docs.mongodb.com)
- Deployment Guide: Contact your hosting provider support
- Database Issues: Check `/var/log/mongodb/` logs

**Your Current Setup is Perfect for Development!** 🎉
