# Kids Web Competition - Quick Reference Guide

Quick reference for common operations after deployment.

---

## 🚀 Daily Operations

### Check Application Status
```bash
# Quick status check
pm2 status

# Expected output:
# ┌─────┬──────────────────────────┬─────────┬─────────┬─────────┬──────────┐
# │ id  │ name                     │ mode    │ ↺       │ status  │ cpu      │
# ├─────┼──────────────────────────┼─────────┼─────────┼─────────┼──────────┤
# │ 0   │ kids-competition-api     │ cluster │ 0       │ online  │ 0%       │
# │ 1   │ kids-competition-api     │ cluster │ 0       │ online  │ 0%       │
# └─────┴──────────────────────────┴─────────┴─────────┴─────────┴──────────┘
```

### View Application Logs
```bash
# Live logs (all instances)
pm2 logs kids-competition-api

# Last 50 lines
pm2 logs kids-competition-api --lines 50

# Error logs only
pm2 logs kids-competition-api --err

# Clear all logs
pm2 flush
```

### Monitor System Resources
```bash
# Real-time PM2 monitoring
pm2 monit

# System resources (htop)
htop
# Press 'q' to exit

# Disk space
df -h

# Memory usage
free -h
```

---

## 🔄 Restart Services

### Restart Backend
```bash
# Standard restart (brief downtime)
pm2 restart kids-competition-api

# Zero-downtime reload (recommended)
pm2 reload kids-competition-api

# Stop application
pm2 stop kids-competition-api

# Start application
pm2 start kids-competition-api
```

### Restart Nginx
```bash
# Test configuration first (always do this!)
sudo nginx -t

# Reload (no downtime)
sudo systemctl reload nginx

# Restart (brief downtime)
sudo systemctl restart nginx

# Check status
sudo systemctl status nginx
```

---

## 📝 View Logs

### Application Logs
```bash
# PM2 logs (recommended)
pm2 logs kids-competition-api

# Application output log
tail -f /var/www/kids-competition/backend/logs/out.log

# Application error log
tail -f /var/www/kids-competition/backend/logs/err.log
```

### Nginx Logs
```bash
# Access log (all requests)
sudo tail -f /var/log/nginx/kids-competition-access.log

# Error log (errors only)
sudo tail -f /var/log/nginx/kids-competition-error.log

# Last 100 errors
sudo tail -n 100 /var/log/nginx/kids-competition-error.log
```

### Search Logs for Errors
```bash
# Search application logs
grep -i error /var/www/kids-competition/backend/logs/err.log

# Search Nginx logs
sudo grep -i "500\|502\|503" /var/log/nginx/kids-competition-error.log

# Search for specific term
pm2 logs kids-competition-api | grep -i "mongodb"
```

---

## 🔧 Update Application

### Update Backend Only
```bash
# 1. Navigate to backend
cd /var/www/kids-competition/backend

# 2. Pull latest code
git pull origin main

# 3. Install new dependencies (if package.json changed)
npm install --production

# 4. Restart PM2
pm2 restart kids-competition-api

# 5. Verify
pm2 status
pm2 logs kids-competition-api --lines 20
```

### Update Frontend Only
```bash
# 1. Navigate to project root
cd /var/www/kids-competition

# 2. Pull latest code
git pull origin main

# 3. Install dependencies (if package.json changed)
npm install

# 4. Rebuild
npm run build

# 5. Nginx automatically serves new build - no restart needed!

# 6. Verify in browser (hard refresh: Ctrl+F5)
```

### Update Both Frontend and Backend
```bash
# 1. Update backend
cd /var/www/kids-competition/backend
git pull origin main
npm install --production
pm2 restart kids-competition-api

# 2. Update frontend
cd /var/www/kids-competition
git pull origin main
npm install
npm run build

# 3. Verify
pm2 status
curl https://yourdomain.com/api/health
```

---

## 🔐 SSL Certificate Management

### Check Certificate Status
```bash
# List all certificates
sudo certbot certificates

# Expected output shows:
# - Certificate Name
# - Domains
# - Expiry Date
# - Certificate Path
```

### Renew Certificate Manually
```bash
# Dry run (test renewal)
sudo certbot renew --dry-run

# Actual renewal (only if needed)
sudo certbot renew

# Reload Nginx after renewal
sudo systemctl reload nginx
```

### Certificate Locations
```
Certificate: /etc/letsencrypt/live/yourdomain.com/fullchain.pem
Private Key: /etc/letsencrypt/live/yourdomain.com/privkey.pem
```

---

## 🐛 Troubleshooting

### Backend Not Starting
```bash
# 1. Check PM2 status
pm2 status

# 2. View error logs
pm2 logs kids-competition-api --err --lines 100

# 3. Common issues:
# - MongoDB connection: Check MONGODB_URI in .env
# - Port already in use: Check if another process is on port 3000
# - Missing dependencies: Run npm install --production

# 4. Try manual start to see errors
cd /var/www/kids-competition/backend
node src/server.js
# Press Ctrl+C to stop
```

### 502 Bad Gateway
```bash
# Means: Nginx can't connect to backend

# 1. Check if backend is running
pm2 status
curl http://localhost:3000/api/health

# 2. If not running, check logs
pm2 logs kids-competition-api --err

# 3. Restart backend
pm2 restart kids-competition-api

# 4. Check Nginx error log
sudo tail -f /var/log/nginx/kids-competition-error.log
```

### Website Not Loading
```bash
# 1. Check Nginx status
sudo systemctl status nginx

# 2. Check Nginx configuration
sudo nginx -t

# 3. Check if dist folder exists
ls -la /var/www/kids-competition/dist/

# 4. Check Nginx error logs
sudo tail -f /var/log/nginx/kids-competition-error.log

# 5. Rebuild frontend if needed
cd /var/www/kids-competition
npm run build
```

### File Upload Fails
```bash
# 1. Check backend logs
pm2 logs kids-competition-api | grep -i cloudinary

# 2. Verify Cloudinary credentials in .env
nano /var/www/kids-competition/backend/.env
# Check: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET

# 3. Check Nginx file size limit
sudo nano /etc/nginx/sites-available/kids-competition
# Verify: client_max_body_size 52M;

# 4. Test Nginx config and reload
sudo nginx -t
sudo systemctl reload nginx
```

### Emails Not Sending
```bash
# 1. Check backend logs for SMTP errors
pm2 logs kids-competition-api | grep -i smtp
pm2 logs kids-competition-api | grep -i email

# 2. Verify SMTP credentials
nano /var/www/kids-competition/backend/.env
# Check: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD

# 3. Test SMTP connection
telnet smtp.hostinger.com 587
# Press Ctrl+] then 'quit' to exit

# 4. Check if emails are in spam folder
```

### High CPU/Memory Usage
```bash
# 1. Check resource usage
htop
# Press 'q' to exit

# 2. Check PM2 metrics
pm2 monit

# 3. If memory too high, restart
pm2 restart kids-competition-api

# 4. Check for memory leaks in logs
pm2 logs kids-competition-api | grep -i "memory\|heap"
```

---

## 🔍 Testing & Verification

### Test Backend API
```bash
# Health check
curl https://yourdomain.com/api/health

# Expected: {"status":"healthy","environment":"production",...}

# Test from server (bypass Nginx)
curl http://localhost:3000/api/health
```

### Test Frontend
```bash
# Get headers
curl -I https://yourdomain.com

# Should show: HTTP/2 200

# Search for app title
curl https://yourdomain.com | grep -i "Kids Web Competition"
```

### Test SSL
```bash
# Check certificate
openssl s_client -connect yourdomain.com:443 -servername yourdomain.com

# Online test: https://www.ssllabs.com/ssltest/
```

### Test Email
```bash
# Register on website and check:
# 1. Student email inbox
# 2. Parent email inbox
# 3. Admin email inbox
# 4. Backend logs for email confirmations
pm2 logs kids-competition-api | grep -i "email sent"
```

---

## 📊 MongoDB Operations

### Check Database Connection
```bash
# View backend logs for MongoDB messages
pm2 logs kids-competition-api | grep -i mongo

# Should see: "Connected to MongoDB" (no errors)
```

### Access MongoDB Atlas
```
1. Go to: https://cloud.mongodb.com
2. Login with your account
3. Click on your cluster
4. Click "Browse Collections"
5. Database: kids_competition
6. Collections:
   - registrations (student submissions)
   - contactsubmissions (contact form)
```

### Update MongoDB IP Whitelist
```bash
# Get VPS IP
curl ifconfig.me

# Then on MongoDB Atlas:
# 1. Network Access → Add IP Address
# 2. Enter VPS IP
# 3. Confirm

# Verify connection still works:
pm2 restart kids-competition-api
pm2 logs kids-competition-api --lines 20
```

---

## ⚙️ Configuration Changes

### Update Environment Variables

**Backend .env:**
```bash
# 1. Edit file
nano /var/www/kids-competition/backend/.env

# 2. Make changes

# 3. Save (Ctrl+O, Enter, Ctrl+X)

# 4. Restart backend
pm2 restart kids-competition-api

# 5. Verify
pm2 logs kids-competition-api --lines 20
```

**Frontend .env:**
```bash
# 1. Edit file
nano /var/www/kids-competition/.env

# 2. Make changes

# 3. Save (Ctrl+O, Enter, Ctrl+X)

# 4. IMPORTANT: Rebuild frontend!
cd /var/www/kids-competition
npm run build

# 5. Nginx automatically serves new build
```

### Update Competition Dates
```bash
# 1. Update backend .env
nano /var/www/kids-competition/backend/.env
# Change: REGISTRATION_CLOSE_DATE, SUBMISSION_DEADLINE, etc.

# 2. Update frontend .env
nano /var/www/kids-competition/.env
# Change: VITE_REGISTRATION_CLOSE_DATE, VITE_SUBMISSION_DEADLINE, etc.

# 3. Rebuild frontend
cd /var/www/kids-competition
npm run build

# 4. Restart backend
cd backend
pm2 restart kids-competition-api

# 5. Verify new dates on website
```

---

## 🔒 Security Maintenance

### Check Firewall
```bash
# View firewall status
sudo ufw status

# Should show:
# - OpenSSH: ALLOW
# - Nginx Full: ALLOW
```

### Verify File Permissions
```bash
# Check .env files (should be 600)
ls -la /var/www/kids-competition/backend/.env
ls -la /var/www/kids-competition/.env

# Should show: -rw-------

# Fix if needed:
chmod 600 /var/www/kids-competition/backend/.env
chmod 600 /var/www/kids-competition/.env
```

### System Updates
```bash
# Update package lists
sudo apt-get update

# Upgrade packages
sudo apt-get upgrade -y

# Clean up
sudo apt-get autoremove -y
sudo apt-get autoclean

# Reboot if kernel updated
sudo reboot
```

---

## 📦 Backup & Restore

### Manual Backup
```bash
# Backup application files
sudo tar -czf ~/backup-$(date +%Y%m%d).tar.gz \
    /var/www/kids-competition \
    --exclude=node_modules \
    --exclude=dist \
    --exclude=logs

# Download to local machine (from local machine):
scp root@YOUR_VPS_IP:~/backup-20251221.tar.gz ./
```

### MongoDB Backup
```bash
# Install MongoDB tools
sudo apt-get install mongodb-database-tools

# Backup database
mongodump --uri="YOUR_MONGODB_URI" --out=/backup/mongo-$(date +%Y%m%d)

# Restore database
mongorestore --uri="YOUR_MONGODB_URI" /backup/mongo-20251221
```

---

## 📞 Support Resources

### Official Documentation
- **PM2:** https://pm2.keymetrics.io/docs/
- **Nginx:** https://nginx.org/en/docs/
- **MongoDB Atlas:** https://docs.atlas.mongodb.com/
- **Cloudinary:** https://cloudinary.com/documentation
- **Let's Encrypt:** https://letsencrypt.org/docs/

### Online Tools
- **SSL Test:** https://www.ssllabs.com/ssltest/
- **DNS Lookup:** https://dnschecker.org/
- **Email Test:** https://www.mail-tester.com/

### Get Help
```bash
# Command help
pm2 --help
nginx -h
certbot --help

# Man pages
man nginx
man ufw
```

---

## 🎯 Performance Optimization

### Monitor Performance
```bash
# PM2 monitoring
pm2 monit

# System performance
htop

# Disk I/O
iostat

# Network
netstat -tulpn
```

### Optimize PM2
```bash
# View current config
cat /var/www/kids-competition/backend/ecosystem.config.js

# Adjust instances based on CPU cores
# For 2 CPU cores: instances: 2 (current)
# For 4 CPU cores: instances: 4

# After editing ecosystem.config.js:
pm2 delete kids-competition-api
pm2 start ecosystem.config.js
pm2 save
```

---

## ✅ Health Check Checklist

Run this daily or weekly:

```bash
# 1. Backend status
pm2 status
# Should show: 2 instances online

# 2. Backend health
curl https://yourdomain.com/api/health
# Should return: {"status":"healthy"...}

# 3. Nginx status
sudo systemctl status nginx
# Should show: active (running)

# 4. SSL certificate
sudo certbot certificates
# Check expiry date (> 30 days)

# 5. Disk space
df -h
# Should have > 20% free

# 6. Memory usage
free -h
# Should have available memory

# 7. Check for errors
pm2 logs kids-competition-api --err --lines 50
# Should have no recent errors

# 8. Test website
# Visit: https://yourdomain.com
# Should load correctly
```

---

## 🆘 Emergency Contacts

**VPS IP:** `_______________`
**Domain:** `_______________`
**MongoDB Atlas Email:** `_______________`
**Cloudinary Email:** `_______________`
**Hostinger Support:** https://www.hostinger.com/contact

---

**Last Updated:** 2025-12-21
**Version:** 1.0
