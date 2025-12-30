# Kids Web Competition - Deployment Documentation

Complete deployment documentation for deploying to Hostinger VPS KVM1.

---

## 📚 Documentation Overview

This folder contains comprehensive deployment guides to help you deploy the Kids Web Competition platform to your Hostinger VPS. Here's what each document does:

### 1. **HOSTINGER_VPS_DEPLOYMENT.md** ⭐ START HERE
**Purpose:** Step-by-step deployment instructions with every detail explained

**Use this when:**
- You're deploying for the first time
- You need detailed explanations for each step
- You want to understand what each command does
- You're troubleshooting specific issues

**What's inside:**
- 9 phases from start to finish
- Exact commands to run
- What to expect at each step
- Verification steps
- Common errors and fixes
- ~45-60 minute deployment

**Read this:** If you want complete guidance from start to finish

---

### 2. **DEPLOYMENT_CHECKLIST.md** ✅ TRACK PROGRESS
**Purpose:** Printable checklist to track your deployment progress

**Use this when:**
- You want to track what you've completed
- You need to pause and resume deployment
- You want a quick overview of all steps

**What's inside:**
- Checkbox for every task
- Pre-deployment preparation section
- All 9 phases with checkboxes
- Quick reference commands
- Space for notes

**Read this:** Alongside the main guide to track progress

---

### 3. **QUICK_REFERENCE.md** 🚀 DAILY OPERATIONS
**Purpose:** Quick reference for common operations after deployment

**Use this when:**
- Your site is already deployed
- You need to restart services
- You want to check logs
- You need to update the application
- You're troubleshooting issues

**What's inside:**
- Common commands (restart, logs, monitor)
- Update procedures
- Troubleshooting guides
- Health check checklist
- Emergency procedures

**Read this:** After deployment for day-to-day management

---

### 4. **vps-setup.sh** 🤖 AUTOMATION SCRIPT
**Purpose:** Automates initial VPS setup (Phase 1 & 2)

**Use this when:**
- You want to speed up initial setup
- You want to avoid typing commands manually

**What it does:**
- Updates system packages
- Installs Node.js 20 LTS
- Installs PM2
- Installs Nginx
- Configures firewall
- Creates application directory

**How to use:**
```bash
# 1. Upload to VPS
scp vps-setup.sh root@YOUR_VPS_IP:~/

# 2. SSH into VPS
ssh root@YOUR_VPS_IP

# 3. Make executable
chmod +x vps-setup.sh

# 4. Run script
sudo ./vps-setup.sh

# 5. Wait ~10-15 minutes
```

**Note:** After this script completes, continue with Phase 3 in HOSTINGER_VPS_DEPLOYMENT.md

---

### 5. **DEPLOYMENT_GUIDE.md** (Original)
**Purpose:** Original deployment guide (Supabase-based)

**Note:** This is for the Supabase backend version. You're using Express + MongoDB, so use HOSTINGER_VPS_DEPLOYMENT.md instead.

---

## 🚀 Quick Start - First Time Deployment

### Step 1: Gather Information (15 min)
Before starting, collect all credentials:

**Required Information:**
- [ ] VPS IP address
- [ ] SSH username and password
- [ ] Domain name (and DNS configured)
- [ ] MongoDB Atlas connection string
- [ ] Cloudinary credentials (cloud name, API key, API secret)
- [ ] Hostinger email credentials (noreply@yourdomain.com)

**Checklist:** Use DEPLOYMENT_CHECKLIST.md Pre-Deployment section

---

### Step 2: Initial VPS Setup (15 min)

**Option A - Manual (Recommended for learning):**
1. Open **HOSTINGER_VPS_DEPLOYMENT.md**
2. Follow **Phase 1** (Connect to VPS)
3. Follow **Phase 2** (Install software)

**Option B - Automated (Faster):**
1. Upload **vps-setup.sh** to VPS
2. Run: `sudo ./vps-setup.sh`
3. Wait for completion (~10-15 min)

---

### Step 3: Deploy Application (30 min)
Continue with **HOSTINGER_VPS_DEPLOYMENT.md:**

1. **Phase 3:** Deploy Application Files (10 min)
2. **Phase 4:** Configure Backend (15 min)
3. **Phase 5:** Build Frontend (10 min)

**Tip:** Check off tasks in DEPLOYMENT_CHECKLIST.md as you go

---

### Step 4: Configure Web Server (10 min)
Continue with **HOSTINGER_VPS_DEPLOYMENT.md:**

1. **Phase 6:** Configure Nginx (10 min)

**Verify:** Visit http://yourdomain.com - should show your website

---

### Step 5: Setup SSL (10 min)
Continue with **HOSTINGER_VPS_DEPLOYMENT.md:**

1. **Phase 7:** Setup SSL Certificate (10 min)

**Verify:** Visit https://yourdomain.com - should show 🔒 padlock

---

### Step 6: Testing (20 min)
Continue with **HOSTINGER_VPS_DEPLOYMENT.md:**

1. **Phase 8:** Final Testing (20 min)
   - Test backend API
   - Test frontend
   - Test registration form
   - Test file upload
   - Test emails

---

### Step 7: Post-Deployment (30 min)
Continue with **HOSTINGER_VPS_DEPLOYMENT.md:**

1. **Phase 9:** Post-Deployment (30 min)
   - Configure email deliverability (SPF/DKIM)
   - Secure MongoDB Atlas
   - Setup monitoring
   - Create backups
   - Security checklist

---

## 📖 How to Use This Documentation

### For First-Time Deployment:
```
1. Start with: DEPLOYMENT_CHECKLIST.md (Pre-Deployment section)
   → Gather all credentials

2. Main guide: HOSTINGER_VPS_DEPLOYMENT.md
   → Follow all 9 phases

3. Track progress: DEPLOYMENT_CHECKLIST.md
   → Check off each task

4. After deployment: QUICK_REFERENCE.md
   → Bookmark for daily use
```

### For Ongoing Management:
```
Use: QUICK_REFERENCE.md
→ Restart services
→ View logs
→ Update application
→ Troubleshoot issues
```

### For Updates:
```
Use: QUICK_REFERENCE.md → "Update Application" section
→ Backend updates
→ Frontend updates
→ Both together
```

---

## 🎯 Deployment Phases Overview

| Phase | Task | Time | Difficulty |
|-------|------|------|------------|
| **1** | Initial VPS Setup | 15 min | Easy |
| **2** | Install Software | 15 min | Easy |
| **3** | Deploy Code | 10 min | Easy |
| **4** | Configure Backend | 15 min | Medium |
| **5** | Build Frontend | 10 min | Easy |
| **6** | Configure Nginx | 10 min | Medium |
| **7** | Setup SSL | 10 min | Easy |
| **8** | Testing | 20 min | Medium |
| **9** | Post-Deployment | 30 min | Medium |
| **Total** | | **~2 hours** | |

**Note:** Times are estimates. First-time deployment may take longer.

---

## 🔧 Architecture Overview

```
Internet
    ↓
Domain (yourdomain.com)
    ↓
Nginx (Port 80/443)
    ├─ Serves static frontend files (/)
    │  from: /var/www/kids-competition/dist/
    │
    └─ Reverse proxy to backend (/api/*)
        ↓
    PM2 Process Manager
        ├─ Instance 1 (Port 3000)
        └─ Instance 2 (Port 3000)
            ↓
        Express.js Backend
            ├─ MongoDB Atlas (cloud database)
            ├─ Cloudinary (file storage)
            └─ Hostinger SMTP (email)
```

---

## 📁 Important Files on VPS

After deployment, these are the critical files:

```
/var/www/kids-competition/
├── backend/
│   ├── .env                    ← Backend environment variables
│   ├── ecosystem.config.js     ← PM2 configuration
│   ├── src/server.js          ← Backend entry point
│   └── logs/                  ← Application logs
├── dist/                       ← Built frontend files
├── .env                        ← Frontend environment variables
└── node_modules/

/etc/nginx/
└── sites-available/
    └── kids-competition        ← Nginx configuration

/etc/letsencrypt/
└── live/yourdomain.com/        ← SSL certificates
```

---

## 🆘 Troubleshooting Resources

### Issue Categories:

**1. Backend Issues (502, API errors)**
→ See: QUICK_REFERENCE.md → "Backend Not Starting"

**2. Frontend Issues (404, page not loading)**
→ See: QUICK_REFERENCE.md → "Website Not Loading"

**3. File Upload Issues**
→ See: QUICK_REFERENCE.md → "File Upload Fails"

**4. Email Issues**
→ See: QUICK_REFERENCE.md → "Emails Not Sending"

**5. SSL Issues**
→ See: QUICK_REFERENCE.md → "SSL Certificate Management"

**6. Performance Issues**
→ See: QUICK_REFERENCE.md → "High CPU/Memory Usage"

---

## ✅ Success Criteria

Your deployment is successful when:

- [ ] ✅ Website loads: https://yourdomain.com
- [ ] ✅ SSL padlock shows (🔒)
- [ ] ✅ API responds: https://yourdomain.com/api/health
- [ ] ✅ Registration form works
- [ ] ✅ File upload works (saves to Cloudinary)
- [ ] ✅ Emails send (student, parent, admin)
- [ ] ✅ PM2 shows 2 instances online
- [ ] ✅ No errors in logs
- [ ] ✅ MongoDB records save correctly

**Verify:** Use DEPLOYMENT_CHECKLIST.md → Final Verification section

---

## 📞 Support & Resources

### Documentation
- **PM2:** https://pm2.keymetrics.io/
- **Nginx:** https://nginx.org/en/docs/
- **MongoDB Atlas:** https://docs.atlas.mongodb.com/
- **Cloudinary:** https://cloudinary.com/documentation
- **Let's Encrypt:** https://letsencrypt.org/

### Online Tools
- **SSL Test:** https://www.ssllabs.com/ssltest/
- **DNS Check:** https://dnschecker.org/
- **Email Test:** https://www.mail-tester.com/

### Hostinger Support
- **Website:** https://www.hostinger.com/contact
- **Support Portal:** (Login to Hostinger account)

---

## 🔄 Update Strategy

### When to Update:

**Weekly:**
- Check logs for errors
- Monitor resource usage
- Verify SSL certificate expiry

**Monthly:**
- Update system packages
- Review application performance
- Check backups

**As Needed:**
- Deploy code changes
- Update competition dates
- Fix bugs

**How to Update:** See QUICK_REFERENCE.md → "Update Application"

---

## 🎓 Learning Path

### For Beginners:
1. Read HOSTINGER_VPS_DEPLOYMENT.md thoroughly
2. Follow each step carefully
3. Don't skip verification steps
4. Use DEPLOYMENT_CHECKLIST.md to track progress

### For Experienced Users:
1. Skim HOSTINGER_VPS_DEPLOYMENT.md
2. Use vps-setup.sh for initial setup
3. Follow phases 3-9 quickly
4. Use QUICK_REFERENCE.md for daily operations

---

## 📝 Additional Notes

### Before You Start:
- ⏰ Set aside 2-3 hours for first deployment
- ☕ Have credentials ready
- 🌐 Ensure DNS is configured (30 min wait for propagation)
- 📱 Have access to email accounts for testing

### During Deployment:
- ✅ Check off tasks in DEPLOYMENT_CHECKLIST.md
- 📋 Copy/paste commands carefully
- 🔍 Verify each phase before moving to next
- 📝 Note any custom changes you make

### After Deployment:
- 🔖 Bookmark QUICK_REFERENCE.md
- 🔐 Save credentials securely
- 📊 Monitor logs for first few days
- 🧪 Test thoroughly with real submissions

---

## 🎉 Ready to Deploy?

**Step 1:** Open **DEPLOYMENT_CHECKLIST.md**
**Step 2:** Open **HOSTINGER_VPS_DEPLOYMENT.md**
**Step 3:** Begin with Pre-Deployment Checklist

**Good luck with your deployment! 🚀**

---

**Version:** 1.0
**Last Updated:** 2025-12-21
**Author:** Claude Code Deployment Assistant
**License:** MIT
