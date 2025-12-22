# Hostinger VPS Deployment - Progress Checklist

Use this checklist to track your deployment progress. Check off each item as you complete it.

---

## Pre-Deployment Preparation

### Information Gathering
- [ ] VPS IP Address: `_______________`
- [ ] SSH Username: `_______________`
- [ ] SSH Password/Key obtained
- [ ] Domain name: `_______________`
- [ ] DNS A Record configured and propagated
- [ ] MongoDB Atlas connection string ready
- [ ] Cloudinary credentials ready (Cloud name, API key, API secret)
- [ ] Hostinger email account created: `noreply@yourdomain.com`
- [ ] Email password documented

### Verify DNS
```bash
ping yourdomain.com
# Should return your VPS IP
```
- [ ] DNS returning correct IP address

---

## Phase 1: Initial VPS Setup (15 min)

### Connect to VPS
- [ ] Successfully connected via SSH
- [ ] Logged in as root or sudo user

### System Updates
- [ ] Ran `sudo apt-get update`
- [ ] Ran `sudo apt-get upgrade -y`
- [ ] Installed essential tools (curl, wget, git, etc.)

### Verify Tools
```bash
git --version
curl --version
```
- [ ] Git installed and working
- [ ] Curl installed and working

---

## Phase 2: Install Required Software (15 min)

### Node.js
- [ ] Added NodeSource repository
- [ ] Installed Node.js 20.x
- [ ] Verified: `node --version` shows v20.x.x
- [ ] Verified: `npm --version` shows v10.x.x

### PM2
- [ ] Installed PM2 globally: `sudo npm install -g pm2`
- [ ] Verified: `pm2 --version` works

### Nginx
- [ ] Installed Nginx
- [ ] Started Nginx: `sudo systemctl start nginx`
- [ ] Enabled Nginx: `sudo systemctl enable nginx`
- [ ] Verified status: `sudo systemctl status nginx` shows "active (running)"
- [ ] Tested in browser: `http://VPS_IP` shows Nginx welcome page

### Firewall
- [ ] Allowed SSH: `sudo ufw allow OpenSSH`
- [ ] Allowed Nginx: `sudo ufw allow 'Nginx Full'`
- [ ] Enabled firewall: `sudo ufw --force enable`
- [ ] Verified: `sudo ufw status` shows correct rules

---

## Phase 3: Deploy Application Files (10 min)

### Create Directory
- [ ] Created: `/var/www/kids-competition`
- [ ] Set ownership: `sudo chown -R $USER:$USER /var/www/kids-competition`
- [ ] Navigated to directory: `cd /var/www/kids-competition`

### Deploy Code (Choose One)
**Option A - Git Clone:**
- [ ] Pushed code to GitHub
- [ ] Cloned repository to VPS
- [ ] Moved files from temp folder
- [ ] Removed temp folder

**Option B - File Transfer:**
- [ ] Transferred files via SCP/SFTP
- [ ] Verified all files present

### Verify Files
- [ ] Confirmed `backend/` folder exists
- [ ] Confirmed `src/` folder exists
- [ ] Confirmed `package.json` exists
- [ ] Confirmed `vite.config.ts` exists

---

## Phase 4: Configure Backend (15 min)

### Install Dependencies
- [ ] Navigated to: `cd /var/www/kids-competition/backend`
- [ ] Ran: `npm install --production`
- [ ] No errors during installation
- [ ] Created logs directory: `mkdir -p logs`

### Create .env File
- [ ] Created: `/var/www/kids-competition/backend/.env`
- [ ] Filled in all required variables:
  - [ ] `MONGODB_URI` (MongoDB Atlas connection string)
  - [ ] `CLOUDINARY_CLOUD_NAME`
  - [ ] `CLOUDINARY_API_KEY`
  - [ ] `CLOUDINARY_API_SECRET`
  - [ ] `SMTP_USER` (full email address)
  - [ ] `SMTP_PASSWORD` (email password)
  - [ ] `FROM_EMAIL`
  - [ ] `ADMIN_EMAIL`
  - [ ] `FRONTEND_URL` (https://yourdomain.com)
- [ ] Set permissions: `chmod 600 .env`
- [ ] Verified permissions: `ls -la .env` shows `-rw-------`

### Test Backend
- [ ] Test run: `node src/server.js` (check for errors)
- [ ] Stopped test: `Ctrl+C`

### Start with PM2
- [ ] Started: `pm2 start ecosystem.config.js`
- [ ] Verified: `pm2 status` shows 2 instances online
- [ ] Saved: `pm2 save`
- [ ] Setup startup: `pm2 startup` and ran generated command

### Verify Backend
```bash
curl http://localhost:8080/api/health
```
- [ ] Returns: `{"status":"healthy",...}`
- [ ] No errors in: `pm2 logs kids-competition-api`

---

## Phase 5: Build Frontend (10 min)

### Create Frontend .env
- [ ] Created: `/var/www/kids-competition/.env`
- [ ] Set `VITE_API_URL=https://yourdomain.com/api`
- [ ] Set all VITE_* variables
- [ ] Set `VITE_ENABLE_ROUTE_MESSAGING=false`
- [ ] Set permissions: `chmod 600 .env`

### Install and Build
- [ ] Navigated to: `cd /var/www/kids-competition`
- [ ] Installed: `npm install`
- [ ] Built: `npm run build`
- [ ] Verified: `dist/` folder created
- [ ] Verified: `dist/index.html` exists
- [ ] Verified: `dist/assets/` folder exists

### Set Permissions
- [ ] Ran: `sudo chmod -R 755 /var/www/kids-competition/dist`

---

## Phase 6: Configure Nginx (10 min)

### Remove Default Config
- [ ] Removed: `sudo rm /etc/nginx/sites-enabled/default`

### Create Nginx Config
- [ ] Created: `/etc/nginx/sites-available/kids-competition`
- [ ] Pasted complete configuration
- [ ] Replaced `yourdomain.com` with actual domain (2 places)
- [ ] Verified configuration is complete

### Enable and Test
- [ ] Created symlink: `sudo ln -s /etc/nginx/sites-available/kids-competition /etc/nginx/sites-enabled/`
- [ ] Tested config: `sudo nginx -t` (should show "syntax is ok")
- [ ] Reloaded: `sudo systemctl reload nginx`

### Test in Browser (HTTP)
- [ ] Opened: `http://yourdomain.com`
- [ ] Website loads correctly
- [ ] Tested: `http://yourdomain.com/api/health` returns JSON
- [ ] No 502 or 404 errors

---

## Phase 7: Setup SSL Certificate (10 min)

### Install Certbot
- [ ] Updated: `sudo apt-get update`
- [ ] Installed: `sudo apt-get install -y certbot python3-certbot-nginx`
- [ ] Verified: `certbot --version` works

### Obtain Certificate
- [ ] Verified DNS is propagated (wait 30+ min after DNS changes)
- [ ] Ran: `sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com`
- [ ] Entered email address
- [ ] Agreed to terms
- [ ] Chose option 2 (redirect HTTP to HTTPS)
- [ ] Certificate obtained successfully

### Verify SSL
- [ ] Tested config: `sudo nginx -t`
- [ ] Reloaded: `sudo systemctl reload nginx`
- [ ] Opened: `https://yourdomain.com` (shows padlock 🔒)
- [ ] Tested redirect: `http://yourdomain.com` → `https://yourdomain.com`

### Test Auto-Renewal
- [ ] Ran: `sudo certbot renew --dry-run`
- [ ] Shows: "Congratulations, all simulated renewals succeeded"
- [ ] Checked timer: `sudo systemctl status certbot.timer`

---

## Phase 8: Final Testing (20 min)

### Backend API Tests
- [ ] Health check works: `curl https://yourdomain.com/api/health`
- [ ] Returns proper JSON response
- [ ] No errors in PM2 logs

### Frontend Tests
- [ ] Homepage loads: `https://yourdomain.com`
- [ ] SSL certificate valid (green padlock)
- [ ] All pages accessible (/, /register, /faq, /resources, /contact)
- [ ] Images load correctly
- [ ] No console errors (F12 in browser)

### Registration Form Test
- [ ] Opened: `https://yourdomain.com/register`
- [ ] Form displays all fields
- [ ] Filled out test registration:
  - [ ] Personal information
  - [ ] Uploaded test file (< 50MB)
  - [ ] Agreed to terms
- [ ] Submitted successfully
- [ ] Success message appeared

### Verify File Upload
**Cloudinary:**
- [ ] Logged into Cloudinary dashboard
- [ ] Navigated to Media Library
- [ ] File appears in `kids-competition` folder

**MongoDB Atlas:**
- [ ] Logged into MongoDB Atlas
- [ ] Went to Browse Collections
- [ ] Database: `kids_competition`
- [ ] Collection: `registrations`
- [ ] New registration document exists

### Email Test
- [ ] Checked backend logs: `pm2 logs kids-competition-api | grep -i email`
- [ ] Emails sent successfully (no SMTP errors)
- [ ] Checked student email inbox
- [ ] Checked parent email inbox
- [ ] Checked admin email inbox
- [ ] If not received, checked spam folders

### Contact Form Test
- [ ] Opened: `https://yourdomain.com/contact`
- [ ] Submitted test contact form
- [ ] Success message appeared
- [ ] Admin received notification email

### Performance Check
- [ ] Ran: `pm2 status`
- [ ] Both instances online
- [ ] CPU < 50%
- [ ] Memory < 400M per instance
- [ ] Ran: `htop` - system resources healthy
- [ ] Ran: `df -h` - sufficient disk space (> 20% free)

---

## Phase 9: Post-Deployment (30 min)

### Email Deliverability
- [ ] Added SPF record to DNS:
  - Type: TXT
  - Name: @
  - Content: `v=spf1 include:smtp.hostinger.com ~all`
- [ ] Added DKIM record to DNS (from Hostinger email panel)
- [ ] Waited 24-48 hours for DNS propagation
- [ ] Verified SPF: `dig yourdomain.com TXT`

### MongoDB Security
- [ ] Logged into MongoDB Atlas
- [ ] Got VPS IP: `curl ifconfig.me`
- [ ] Added VPS IP to Network Access whitelist
- [ ] Removed 0.0.0.0/0 if present
- [ ] Tested connection still works: `pm2 restart kids-competition-api`

### Monitoring Setup
- [ ] Installed htop: `sudo apt-get install -y htop`
- [ ] Tested: `htop` (q to exit)
- [ ] Tested: `pm2 monit`
- [ ] Verified logs accessible:
  - [ ] `pm2 logs kids-competition-api`
  - [ ] `sudo tail -f /var/log/nginx/kids-competition-error.log`
  - [ ] `sudo tail -f /var/log/nginx/kids-competition-access.log`

### Backup Setup (Optional)
- [ ] Created backup directory: `sudo mkdir -p /backup/kids-competition`
- [ ] Created backup script: `/usr/local/bin/backup-kids-competition.sh`
- [ ] Made executable: `sudo chmod +x /usr/local/bin/backup-kids-competition.sh`
- [ ] Tested backup: `sudo /usr/local/bin/backup-kids-competition.sh`
- [ ] Setup cron job: `sudo crontab -e` (added backup schedule)

### Security Checklist
- [ ] Firewall configured: `sudo ufw status`
- [ ] .env files secured (600 permissions)
- [ ] MongoDB IP whitelist configured (not 0.0.0.0/0)
- [ ] Strong passwords used for all services
- [ ] SSL certificate valid and auto-renewing
- [ ] Rate limiting active (Nginx + Express)
- [ ] Security headers present: `curl -I https://yourdomain.com`
- [ ] CORS restricted to production domain
- [ ] NODE_ENV=production in backend .env

### Documentation
- [ ] Documented all credentials in secure location
- [ ] Saved important file paths
- [ ] Noted SSL expiration date
- [ ] Created update procedures document

---

## Final Verification

### All Systems Check
- [ ] Website accessible: `https://yourdomain.com`
- [ ] API working: `https://yourdomain.com/api/health`
- [ ] Backend running: `pm2 status` (2 instances online)
- [ ] Nginx running: `sudo systemctl status nginx`
- [ ] SSL valid: Certificate shows in browser
- [ ] File uploads work: Tested with registration
- [ ] Emails sending: Tested with registration
- [ ] Database connected: No MongoDB errors in logs
- [ ] System resources healthy: htop shows < 80% usage

### Success Criteria Met
- [ ] ✅ Backend health check returns 200
- [ ] ✅ Frontend loads correctly
- [ ] ✅ SSL certificate installed and working
- [ ] ✅ File uploads save to Cloudinary
- [ ] ✅ Emails send successfully
- [ ] ✅ Database records save correctly
- [ ] ✅ No errors in application logs
- [ ] ✅ System performance is good

---

## 🎉 Deployment Status

**Date Completed:** _______________

**Deployed By:** _______________

**Live URL:** https://_______________

**Status:**
- [ ] ✅ Successfully Deployed
- [ ] ⚠️ Deployed with Issues (note below)
- [ ] ❌ Deployment Failed

**Notes:**
```
_________________________________________________
_________________________________________________
_________________________________________________
```

---

## Quick Reference

### Common Commands
```bash
# Check status
pm2 status
sudo systemctl status nginx

# View logs
pm2 logs kids-competition-api
sudo tail -f /var/log/nginx/kids-competition-error.log

# Restart services
pm2 restart kids-competition-api
sudo systemctl reload nginx

# Monitor
htop
pm2 monit

# Update application
cd /var/www/kids-competition/backend && git pull && npm install --production && pm2 restart kids-competition-api
cd /var/www/kids-competition && git pull && npm install && npm run build
```

### Important File Paths
- Backend .env: `/var/www/kids-competition/backend/.env`
- Frontend .env: `/var/www/kids-competition/.env`
- Nginx config: `/etc/nginx/sites-available/kids-competition`
- PM2 config: `/var/www/kids-competition/backend/ecosystem.config.js`
- SSL certs: `/etc/letsencrypt/live/yourdomain.com/`

### Support Contacts
- MongoDB Atlas: https://cloud.mongodb.com
- Cloudinary: https://cloudinary.com
- Hostinger Support: https://www.hostinger.com/contact
- Let's Encrypt: https://letsencrypt.org/

---

**Deployment Complete! 🚀**
