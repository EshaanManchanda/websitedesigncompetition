# Deployment Instructions for VPS

## Overview
This deployment will configure two Node.js projects on your VPS (93.127.185.245):
1. **Website Design Competition** - websitedesigningcompetition.com (Backend: Port 5050)
2. **Kidrove** - kidrove.com, kidrove.in, kidrove.ae (Backend: Port 5001)

## Files Updated/Created

### Local Files (Already Updated)
- ✅ `backend/ecosystem.config.js` - PORT changed from 3000 to 5050
- ✅ `backend/.env.production` - PORT changed to 5050

### New Files Created for VPS
- ✅ `nginx-website-design.conf` - Nginx config for website-design
- ✅ `nginx-kidrove.conf` - Nginx config for kidrove
- ✅ `kidrove-ecosystem.config.js` - PM2 config for kidrove backend
- ✅ `DEPLOY_VPS.sh` - Automated deployment script

## Deployment Steps

### Step 1: Prepare Local Files

#### For Website Design Competition:
1. **Update `.env` with production credentials:**
   ```bash
   # Copy .env.production and fill in these values:
   MONGODB_URI=mongodb+srv://...  # Your MongoDB Atlas connection string
   CLOUDINARY_CLOUD_NAME=...       # From Cloudinary dashboard
   CLOUDINARY_API_KEY=...          # From Cloudinary dashboard
   CLOUDINARY_API_SECRET=...       # From Cloudinary dashboard
   SMTP_PASSWORD=...               # Your Hostinger email password
   ```

2. **Build the frontend (if not already built):**
   ```bash
   npm run build
   # This creates the dist/ folder
   ```

### Step 2: Upload Files to VPS

Use SCP to upload files from your local machine to the VPS:

```bash
# From your local project directory:

# 1. Upload updated backend config and .env
scp backend/ecosystem.config.js root@93.127.185.245:/var/www/websitedesigncompetition/backend/
scp backend/.env root@93.127.185.245:/var/www/websitedesigncompetition/backend/.env

# 2. Upload dist folder (if rebuilt)
scp -r dist root@93.127.185.245:/var/www/websitedesigncompetition/

# 3. Upload nginx configs
scp nginx-website-design.conf root@93.127.185.245:/root/
scp nginx-kidrove.conf root@93.127.185.245:/root/

# 4. Upload kidrove PM2 config
scp kidrove-ecosystem.config.js root@93.127.185.245:/var/www/GEMA-Project/backend/ecosystem.config.js

# 5. Upload deployment script
scp DEPLOY_VPS.sh root@93.127.185.245:/root/
```

### Step 3: Update Kidrove Environment on VPS

SSH into your VPS and update the kidrove `.env` file:

```bash
ssh root@93.127.185.245

# Edit kidrove backend .env
nano /var/www/GEMA-Project/backend/.env

# Make these changes:
# 1. Change PORT from 5000 to 5001:
PORT=5001

# 2. Add/update CORS configuration:
FRONTEND_URL=https://kidrove.com
ALLOWED_ORIGINS=https://kidrove.com,https://www.kidrove.com,https://kidrove.in,https://www.kidrove.in,https://kidrove.ae,https://www.kidrove.ae

# Save and exit (Ctrl+X, Y, Enter)
```

### Step 4: Run Deployment Script

```bash
# Still on VPS, run the deployment script:
cd /root
chmod +x DEPLOY_VPS.sh
bash DEPLOY_VPS.sh
```

The script will:
- ✅ Create backup of current configuration
- ✅ Stop current PM2 processes
- ✅ Verify uploaded files
- ✅ Install Nginx configurations
- ✅ Start backends with PM2
- ✅ Configure PM2 auto-startup
- ✅ Reload Nginx
- ✅ Test services

### Step 5: Setup SSL Certificates

After the deployment script completes, run these commands to set up SSL:

```bash
# Install certbot (if not already installed)
apt-get update && apt-get install -y certbot python3-certbot-nginx

# Website Design Competition SSL
certbot --nginx \
    -d websitedesigningcompetition.com \
    -d www.websitedesigningcompetition.com \
    --non-interactive --agree-tos \
    --email admin@websitedesigningcompetition.com \
    --redirect

# Kidrove SSL (all three domains)
certbot --nginx \
    -d kidrove.com -d www.kidrove.com \
    -d kidrove.in -d www.kidrove.in \
    -d kidrove.ae -d www.kidrove.ae \
    --non-interactive --agree-tos \
    --email admin@kidrove.com \
    --redirect

# Test SSL renewal
certbot renew --dry-run
```

### Step 6: Verify Deployment

```bash
# Check PM2 processes
pm2 status
pm2 logs --lines 50

# Test backend ports directly
curl http://localhost:5050/api/health
curl http://localhost:5001/api/health

# Test via domains (HTTP - should redirect to HTTPS)
curl -I http://websitedesigningcompetition.com/
curl -I http://kidrove.com/

# Test HTTPS
curl -I https://websitedesigningcompetition.com/
curl -I https://kidrove.com/
curl -I https://kidrove.in/
curl -I https://kidrove.ae/

# Check nginx logs
tail -50 /var/log/nginx/website-design-error.log
tail -50 /var/log/nginx/kidrove-error.log
```

## Manual Deployment (Alternative)

If you prefer manual deployment instead of using the script, follow the detailed steps in the deployment plan:
`C:\Users\eshaa\.claude\plans\piped-dancing-thunder.md`

## Troubleshooting

### Port Already in Use
```bash
# Find what's using the port
netstat -tulpn | grep 5050
netstat -tulpn | grep 5001

# Kill the process if needed
kill -9 <PID>
```

### PM2 Process Not Starting
```bash
# Check logs
pm2 logs kids-competition-api --err --lines 100
pm2 logs kidrove-api --err --lines 100

# Restart
pm2 restart kids-competition-api
pm2 restart kidrove-api
```

### 502 Bad Gateway
```bash
# Check if backend is running
pm2 status
curl http://localhost:5050/api/health
curl http://localhost:5001/api/health

# Check nginx config
nginx -t
systemctl status nginx
```

### CORS Errors
```bash
# Verify FRONTEND_URL in backend .env
cat /var/www/websitedesigncompetition/backend/.env | grep FRONTEND_URL
cat /var/www/GEMA-Project/backend/.env | grep FRONTEND_URL

# Should match:
# Website Design: https://websitedesigningcompetition.com
# Kidrove: https://kidrove.com (with ALLOWED_ORIGINS for all 3 domains)
```

## Rollback

If something goes wrong, you can rollback to the previous configuration:

```bash
# Find your backup directory (from deployment script output)
BACKUP_DIR="/backup/deployment-YYYYMMDD-HHMMSS"

# Restore nginx configs
cp -r $BACKUP_DIR/sites-available/* /etc/nginx/sites-available/
cp -r $BACKUP_DIR/sites-enabled/* /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

# Restore .env files
cp $BACKUP_DIR/website-design-env.bak /var/www/websitedesigncompetition/backend/.env
cp $BACKUP_DIR/kidrove-env.bak /var/www/GEMA-Project/backend/.env

# Restore PM2 processes
pm2 resurrect
```

## Post-Deployment Checklist

### Immediate Checks (0-30 min)
- [ ] PM2 processes showing "online": `pm2 status`
- [ ] No errors in logs: `pm2 logs --err --lines 100`
- [ ] Nginx running: `systemctl status nginx`
- [ ] Backends responding: `curl http://localhost:5050/api/health` and `curl http://localhost:5001/api/health`
- [ ] HTTPS working for all domains
- [ ] HTTP redirects to HTTPS

### Functional Testing (30-60 min)
**Website Design Competition:**
- [ ] Homepage loads: https://websitedesigningcompetition.com
- [ ] Registration form works
- [ ] File upload works (<50MB)
- [ ] Email notifications sent

**Kidrove:**
- [ ] All domains load: https://kidrove.com, https://kidrove.in, https://kidrove.ae
- [ ] API endpoints work
- [ ] Core functionality works

### Monitoring
```bash
# Monitor resources
htop

# Monitor PM2 processes
pm2 monit

# View logs in real-time
pm2 logs

# Check nginx access logs
tail -f /var/log/nginx/website-design-access.log
tail -f /var/log/nginx/kidrove-access.log
```

## Important Notes

1. **Credentials Required**: Before uploading `.env`, make sure you've filled in:
   - MongoDB Atlas connection string
   - Cloudinary credentials (cloud name, API key, API secret)
   - SMTP password (Hostinger email)

2. **DNS Configuration**: Ensure all domains point to your VPS IP (93.127.185.245):
   - websitedesigningcompetition.com → 93.127.185.245
   - kidrove.com → 93.127.185.245
   - kidrove.in → 93.127.185.245
   - kidrove.ae → 93.127.185.245

3. **Firewall**: Ensure ports 80 and 443 are open:
   ```bash
   ufw allow 80/tcp
   ufw allow 443/tcp
   ufw status
   ```

4. **PM2 Startup**: The deployment script configures PM2 to auto-start on reboot. Verify with:
   ```bash
   pm2 startup
   pm2 save
   ```

## Quick Commands Reference

```bash
# PM2
pm2 status                           # View all processes
pm2 logs                             # View all logs
pm2 logs kids-competition-api        # View specific app logs
pm2 restart kids-competition-api     # Restart specific app
pm2 save                             # Save process list

# Nginx
nginx -t                             # Test configuration
systemctl reload nginx               # Reload without downtime
systemctl status nginx               # Check status
tail -f /var/log/nginx/error.log    # Watch error log

# System
netstat -tulpn | grep LISTEN         # View listening ports
htop                                 # System resources
df -h                                # Disk space

# SSL
certbot certificates                 # List certificates
certbot renew                        # Renew all certificates
certbot renew --dry-run             # Test renewal
```

## Support

If you encounter issues:
1. Check logs: `pm2 logs --err`
2. Check nginx: `tail -100 /var/log/nginx/*-error.log`
3. Verify ports: `netstat -tulpn | grep -E "5050|5001"`
4. Review the detailed plan: `C:\Users\eshaa\.claude\plans\piped-dancing-thunder.md`
