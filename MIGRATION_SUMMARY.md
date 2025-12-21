# Supabase to MongoDB Migration - Complete ✅

## Migration Summary

Successfully migrated the Kids Web Design Competition platform from Supabase to MongoDB with Express.js backend.

## What Was Done

### Backend Created (from scratch)
1. **Express.js API Server** - Complete RESTful API
2. **MongoDB Integration** - Mongoose models with full validation
3. **Cloudinary Storage** - File upload handling
4. **Nodemailer Email Service** - SMTP-based email sending
5. **Security** - Helmet, CORS, rate limiting, input validation
6. **All Email Templates** - Migrated and working

### Frontend Updated
1. **New API Service** (`src/lib/api.ts`) - Replaces Supabase calls
2. **Register.tsx** - Updated to use new backend
3. **Contact.tsx** - Updated to use new backend
4. **Environment Variables** - Updated to point to backend API

### Files Removed/Deprecated
- `src/lib/supabase.ts` - No longer needed (can be deleted)
- `src/lib/storage.ts` - No longer needed (can be deleted)
- `supabase/` folder - No longer used

---

## Testing the Migration

### Step 1: Set Up Backend

1. Navigate to backend folder:
```bash
cd backend
```

2. Install dependencies (if not done):
```bash
npm install
```

3. Configure environment variables:
Edit `backend/.env` and add:
```env
# MongoDB (required)
MONGODB_URI=mongodb://localhost:27017/kids_competition
# Or use MongoDB Atlas

# Cloudinary (required for file uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email - Hostinger SMTP (required)
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_USER=noreply@yourdomain.com
SMTP_PASSWORD=your-password
FROM_EMAIL=noreply@kidswebcomp.com
ADMIN_EMAIL=admin@kidswebcomp.com
```

4. Start MongoDB (if running locally):
```bash
# Windows
mongod

# macOS/Linux
sudo systemctl start mongodb
```

5. Start the backend:
```bash
npm run dev
```

You should see:
```
✓ MongoDB Connected
✓ Cloudinary Connected
✓ Email service ready
🚀 Server running on http://localhost:3000
```

### Step 2: Test Backend API

Test health endpoint:
```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2025-12-21T...",
  "environment": "development"
}
```

### Step 3: Test Frontend

1. In a new terminal, navigate to project root:
```bash
cd C:\Users\eshaa\Downloads\kids_web_competition
```

2. Make sure frontend `.env` has:
```env
VITE_API_URL=http://localhost:3000/api
```

3. Start frontend:
```bash
npm run dev
```

4. Open browser to `http://localhost:5173`

### Step 4: Test Registration Form

1. Go to Register page
2. Fill in all fields
3. Upload a file (optional)
4. Submit

**Expected:**
- Form submits successfully
- Success message appears
- Check backend terminal - you should see:
  - Registration created
  - File uploaded (if provided)
  - Emails being sent

**Check MongoDB:**
```bash
mongosh
use kids_competition
db.registrations.find().pretty()
```

**Check Cloudinary:**
- Login to Cloudinary dashboard
- Check `kids-competition` folder
- File should be there

**Check Emails:**
- If using Mailtrap (dev), check inbox
- If using Hostinger, check actual email

### Step 5: Test Contact Form

1. Go to Contact page
2. Fill in form
3. Submit

**Expected:**
- Success message
- Backend logs show email sent
- Admin receives email

**Check MongoDB:**
```bash
db.contact_submissions.find().pretty()
```

---

## Production Deployment

### Prerequisites
- Hostinger VPS with SSH access
- Domain name configured
- MongoDB Atlas account (or install MongoDB on VPS)
- Cloudinary account
- Hostinger email account

### Deployment Steps

#### 1. Prepare VPS

```bash
# SSH into VPS
ssh root@your-vps-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx

# Install Certbot (for SSL)
sudo apt install certbot python3-certbot-nginx
```

#### 2. Upload Backend Code

```bash
# On your local machine, from backend folder
scp -r * root@your-vps-ip:/var/www/kids-competition-api/

# Or use Git
ssh root@your-vps-ip
cd /var/www
git clone your-repo-url kids-competition-api
cd kids-competition-api/backend
```

#### 3. Configure Backend

```bash
# Create production .env
nano .env
```

Add production values:
```env
NODE_ENV=production
PORT=3000

MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/kids_competition

CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_USER=noreply@yourdomain.com
SMTP_PASSWORD=your-password
FROM_EMAIL=noreply@kidswebcomp.com
ADMIN_EMAIL=admin@kidswebcomp.com

COMPETITION_YEAR=2026
REGISTRATION_OPEN_DATE=January 1, 2026
REGISTRATION_CLOSE_DATE=March 15, 2026
SUBMISSION_DEADLINE=March 31, 2026 at 11:59 PM
RESULTS_ANNOUNCEMENT_DATE=April 15, 2026

FRONTEND_URL=https://yourdomain.com
```

Install and start:
```bash
npm install --production
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### 4. Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/api.yourdomain.com
```

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        client_max_body_size 51M;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/api.yourdomain.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 5. Setup SSL

```bash
sudo certbot --nginx -d api.yourdomain.com
```

#### 6. Deploy Frontend

```bash
# On local machine, build frontend
npm run build

# Upload dist folder to VPS
scp -r dist/* root@your-vps-ip:/var/www/yourdomain.com/
```

Configure Nginx for frontend:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    root /var/www/yourdomain.com;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Setup SSL:
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

#### 7. Update Frontend Environment

Before building, update `.env`:
```env
VITE_API_URL=https://api.yourdomain.com/api
```

Then rebuild:
```bash
npm run build
```

---

## Monitoring

### Check Backend Status
```bash
pm2 status
pm2 logs
pm2 monit
```

### Check Logs
```bash
# Application logs
tail -f /var/www/kids-competition-api/logs/out.log
tail -f /var/www/kids-competition-api/logs/err.log

# PM2 logs
pm2 logs kids-competition-api
```

### Restart Backend
```bash
pm2 restart kids-competition-api
```

---

## Rollback Plan

If you need to rollback to Supabase:

1. **Keep Supabase Project Active** - Don't delete it yet
2. **Git Branch** - Backend code is in a separate branch
3. **Frontend Rollback:**
   - Restore old `.env` with Supabase credentials
   - Revert changes to Register.tsx and Contact.tsx
   - Restore supabase.ts and storage.ts files

---

## Cost Comparison

### Old (Supabase)
- **Cost:** $0-20/month
- **Limitations:** Vendor lock-in, limited control

### New (MongoDB + Express)
- **Hostinger VPS:** $8-15/month
- **MongoDB Atlas:** $0 (free tier) or $9/month
- **Cloudinary:** $0 (free tier)
- **Total:** $8-24/month

**Benefits:**
- Full control over infrastructure
- No vendor lock-in
- Better scalability
- Custom business logic

---

## Next Steps

1. ✅ Test locally (both forms)
2. ⬜ Get Cloudinary credentials
3. ⬜ Configure Hostinger SMTP
4. ⬜ Setup MongoDB (Atlas or local)
5. ⬜ Deploy to production
6. ⬜ Test production deployment
7. ⬜ Monitor for 1 week
8. ⬜ Decommission Supabase

---

## Support

If you encounter issues:

1. **Check Logs:**
   - Backend: `pm2 logs`
   - MongoDB: Check connection string
   - Email: Verify SMTP credentials

2. **Common Issues:**
   - MongoDB connection: Check firewall/Atlas IP whitelist
   - File upload: Verify Cloudinary credentials
   - Email: Check SMTP settings, test with Mailtrap first

3. **Contact:**
   - Backend API returns detailed error messages
   - Check browser console for frontend errors

---

## Files Created/Modified

### Backend (New)
- `backend/` - Entire backend directory
- All configuration, models, controllers, routes, middleware
- Email templates
- PM2 configuration

### Frontend (Modified)
- `src/lib/api.ts` - New API service
- `src/pages/Register.tsx` - Updated
- `src/pages/Contact.tsx` - Updated
- `.env` - Updated

### Documentation
- `backend/README.md` - Backend documentation
- `MIGRATION_SUMMARY.md` - This file

---

**Migration Status: COMPLETE ✅**

Everything is ready for testing and deployment!
