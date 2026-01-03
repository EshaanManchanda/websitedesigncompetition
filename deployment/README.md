# Website Design Competition - Deployment Guide

Complete deployment guide for websitedesigningcompetition.com on a VPS using git pull workflow.

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Initial VPS Setup](#initial-vps-setup)
4. [Backend Configuration](#backend-configuration)
5. [Frontend Build](#frontend-build)
6. [Nginx Configuration](#nginx-configuration)
7. [SSL Certificates](#ssl-certificates)
8. [PM2 Process Management](#pm2-process-management)
9. [Updating Deployed Website](#updating-deployed-website)
10. [Troubleshooting](#troubleshooting)
11. [Maintenance](#maintenance)

---

## Overview

### Project Architecture

**Website Design Competition** (`websitedesigningcompetition.com`)
- **Domain**: websitedesigningcompetition.com, www.websitedesigningcompetition.com
- **API Subdomain**: api.websitedesigningcompetition.com
- **Backend**: Node.js/Express API on port 5050
- **Frontend**: React SPA (static build)
- **Process Manager**: PM2 (cluster mode, 2 instances)
- **Web Server**: Nginx with SSL/TLS

### Server Requirements

- **OS**: Ubuntu 20.04 LTS or later (recommended)
- **CPU**: 2+ cores
- **RAM**: 2GB minimum, 4GB recommended
- **Storage**: 20GB minimum
- **Network**: Static IP address

---

## Prerequisites

### 1. Domain Configuration

You need to configure DNS records to point your domain to your VPS server. This is a critical step that must be completed before deploying.

#### Step 1: Get Your VPS IP Address

First, find your VPS IP address:

**From VPS provider dashboard:**
- Log into your VPS hosting provider (Hostinger, DigitalOcean, Linode, etc.)
- Navigate to your server dashboard
- Look for "IP Address" or "IPv4 Address"
- Copy this IP address (e.g., `93.127.185.245`)

**Or via SSH:**
```bash
# Connect to your VPS
ssh root@YOUR_VPS_IP

# Get public IP address
curl ifconfig.me
# or
curl ipinfo.io/ip
```

#### Step 2: Access Your Domain DNS Settings

**Where to configure DNS records:**

Log into your domain registrar (where you purchased the domain):
- **GoDaddy**: My Products → Domains → DNS → Manage DNS
- **Namecheap**: Domain List → Manage → Advanced DNS
- **Cloudflare**: Dashboard → Select Domain → DNS
- **Google Domains**: My Domains → DNS
- **Hostinger**: Domains → DNS Zone Editor

#### Step 3: Add DNS A Records

You need to create **3 A records** pointing to your VPS IP address:

| Type | Name/Host | Value/Points To | TTL |
|------|-----------|-----------------|-----|
| A | @ | YOUR_VPS_IP | 3600 |
| A | www | YOUR_VPS_IP | 3600 |
| A | api | YOUR_VPS_IP | 3600 |

**Detailed instructions by provider:**

<details>
<summary><strong>Cloudflare</strong></summary>

1. Log into Cloudflare dashboard
2. Click on your domain (`websitedesigningcompetition.com`)
3. Go to **DNS** tab
4. Click **Add record**
5. Add the following records:

**Record 1 - Root domain:**
- Type: `A`
- Name: `@`
- IPv4 address: `YOUR_VPS_IP`
- Proxy status: **DNS only** (gray cloud, not proxied)
- TTL: `Auto`
- Click **Save**

**Record 2 - WWW subdomain:**
- Type: `A`
- Name: `www`
- IPv4 address: `YOUR_VPS_IP`
- Proxy status: **DNS only**
- TTL: `Auto`
- Click **Save**

**Record 3 - API subdomain:**
- Type: `A`
- Name: `api`
- IPv4 address: `YOUR_VPS_IP`
- Proxy status: **DNS only**
- TTL: `Auto`
- Click **Save**

</details>

<details>
<summary><strong>GoDaddy</strong></summary>

1. Log into GoDaddy account
2. Go to **My Products** → **Domains**
3. Click on your domain
4. Click **DNS** button
5. Scroll to **Records** section
6. Click **Add** for each record:

**Record 1:**
- Type: `A`
- Name: `@`
- Value: `YOUR_VPS_IP`
- TTL: `1 Hour`
- Click **Save**

**Record 2:**
- Type: `A`
- Name: `www`
- Value: `YOUR_VPS_IP`
- TTL: `1 Hour`
- Click **Save**

**Record 3:**
- Type: `A`
- Name: `api`
- Value: `YOUR_VPS_IP`
- TTL: `1 Hour`
- Click **Save**

</details>

<details>
<summary><strong>Namecheap</strong></summary>

1. Log into Namecheap account
2. Go to **Domain List**
3. Click **Manage** next to your domain
4. Go to **Advanced DNS** tab
5. Under **Host Records**, click **Add New Record**

**Record 1:**
- Type: `A Record`
- Host: `@`
- Value: `YOUR_VPS_IP`
- TTL: `Automatic`
- Click green checkmark to save

**Record 2:**
- Type: `A Record`
- Host: `www`
- Value: `YOUR_VPS_IP`
- TTL: `Automatic`
- Click green checkmark to save

**Record 3:**
- Type: `A Record`
- Host: `api`
- Value: `YOUR_VPS_IP`
- TTL: `Automatic`
- Click green checkmark to save

</details>

<details>
<summary><strong>Hostinger</strong></summary>

1. Log into Hostinger control panel
2. Go to **Domains** section
3. Find your domain and click **Manage**
4. Go to **DNS / Name Servers** → **DNS Zone Editor**
5. Click **Add Record** for each:

**Record 1:**
- Type: `A`
- Name: `@` (or leave blank)
- Points to: `YOUR_VPS_IP`
- TTL: `3600`
- Click **Add Record**

**Record 2:**
- Type: `A`
- Name: `www`
- Points to: `YOUR_VPS_IP`
- TTL: `3600`
- Click **Add Record**

**Record 3:**
- Type: `A`
- Name: `api`
- Points to: `YOUR_VPS_IP`
- TTL: `3600`
- Click **Add Record**

</details>

#### Step 4: Wait for DNS Propagation

After adding DNS records, you must wait for them to propagate across the internet.

**Propagation time:**
- **Minimum**: 5-15 minutes
- **Typical**: 15-30 minutes
- **Maximum**: 24-48 hours (rare)

**Note**: Lower TTL values propagate faster. If you set TTL to 300 (5 minutes), changes propagate faster.

#### Step 5: Verify DNS Configuration

**Method 1: Using nslookup (Recommended)**

```bash
# Check root domain
nslookup websitedesigningcompetition.com

# Expected output should show your VPS IP:
# Server:  xxx.xxx.xxx.xxx
# Address: xxx.xxx.xxx.xxx#53
#
# Non-authoritative answer:
# Name:    websitedesigningcompetition.com
# Address: YOUR_VPS_IP

# Check www subdomain
nslookup www.websitedesigningcompetition.com

# Check api subdomain
nslookup api.websitedesigningcompetition.com
```

**Method 2: Using dig (Linux/Mac)**

```bash
dig websitedesigningcompetition.com +short
dig www.websitedesigningcompetition.com +short
dig api.websitedesigningcompetition.com +short

# All three should return: YOUR_VPS_IP
```

**Method 3: Using ping**

```bash
ping websitedesigningcompetition.com
ping www.websitedesigningcompetition.com
ping api.websitedesigningcompetition.com

# Should ping your VPS IP
```

**Method 4: Online DNS Checker**

Visit these websites to check DNS propagation globally:
- https://www.whatsmydns.net/
- https://dnschecker.org/
- https://www.dnswatch.info/

Enter your domain and select "A" record type.

#### Step 6: Verify All Records Are Correct

Before proceeding, ensure:

✅ **Root domain** (`websitedesigningcompetition.com`) → Points to your VPS IP
✅ **WWW subdomain** (`www.websitedesigningcompetition.com`) → Points to your VPS IP
✅ **API subdomain** (`api.websitedesigningcompetition.com`) → Points to your VPS IP
✅ **DNS propagation** complete (nslookup shows your IP)

**If DNS is not propagating:**
1. Double-check the IP address is correct
2. Ensure you saved the DNS records
3. Wait longer (can take up to 24 hours)
4. Try flushing your local DNS cache:
   ```bash
   # Windows
   ipconfig /flushdns

   # Mac
   sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder

   # Linux
   sudo systemd-resolve --flush-caches
   ```

**Summary of DNS Configuration:**

```
Record Type: A
websitedesigningcompetition.com        → YOUR_VPS_IP
www.websitedesigningcompetition.com    → YOUR_VPS_IP
api.websitedesigningcompetition.com    → YOUR_VPS_IP
```

Once all records are verified, you can proceed to the VPS setup!

### 2. Software Requirements

The following software must be installed on your VPS:
- Node.js 18.x or later
- Nginx 1.18 or later
- PM2 (process manager)
- Git
- Certbot (for SSL certificates)

---

## Initial VPS Setup

### Step 1: Connect to Your VPS

```bash
ssh root@YOUR_VPS_IP
```

Or if using SSH keys:
```bash
ssh -i ~/.ssh/your_key root@YOUR_VPS_IP
```

### Step 2: Update System Packages

```bash
# Update package lists
sudo apt update

# Upgrade installed packages
sudo apt upgrade -y

# Install basic utilities
sudo apt install -y curl wget git build-essential
```

### Step 3: Install Node.js

```bash
# Install Node.js 20.x LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version  # Should show v20.x.x
npm --version   # Should show 10.x.x or later
```

### Step 4: Install Nginx

```bash
# Install Nginx
sudo apt install -y nginx

# Start Nginx
sudo systemctl start nginx

# Enable Nginx to start on boot
sudo systemctl enable nginx

# Verify Nginx is running
sudo systemctl status nginx
```

### Step 5: Install PM2

```bash
# Install PM2 globally
sudo npm install -g pm2

# Verify installation
pm2 --version
```

### Step 6: Install Certbot for SSL

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Verify installation
certbot --version
```

### Step 7: Create Project Directory

```bash
# Create directory for the website
sudo mkdir -p /var/www/websitedesigncompetition

# Set ownership (replace 'username' with your non-root user if applicable)
sudo chown -R $USER:$USER /var/www/websitedesigncompetition
```

### Step 8: Create Certbot Directory

**IMPORTANT:** This directory is required for SSL certificate generation. Without it, Certbot will fail with a 500 error.

```bash
# Create directory for Let's Encrypt ACME challenges
sudo mkdir -p /var/www/certbot

# Set ownership to nginx user (www-data)
sudo chown -R www-data:www-data /var/www/certbot

# Set proper permissions
sudo chmod -R 755 /var/www/certbot

# Verify directory was created
ls -la /var/www/ | grep certbot
```

**Why this is needed:** Let's Encrypt uses the `.well-known/acme-challenge/` path to verify domain ownership during SSL certificate generation. Nginx serves these challenge files from `/var/www/certbot`.

### Step 9: Clone Git Repository

```bash
# Navigate to project directory
cd /var/www/websitedesigncompetition

# Clone the repository (replace with your actual repository URL)
git clone https://github.com/YOUR_USERNAME/kids_web_competition.git .

# Or if already cloned, pull latest changes
git pull origin main
```

---

## Backend Configuration

### Step 1: Navigate to Backend Directory

```bash
cd /var/www/websitedesigncompetition/backend
```

### Step 2: Install Dependencies

```bash
# Install Node.js dependencies
npm install --production
```

### Step 3: Configure Environment Variables

Create or edit the `.env` file:

```bash
nano /var/www/websitedesigncompetition/backend/.env
```

**Required environment variables:**

```env
# Server Configuration
NODE_ENV=production
PORT=5050

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/websitedesigncomp
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/websitedesigncomp

# Frontend URL
FRONTEND_URL=https://websitedesigningcompetition.com
API_SUBDOMAIN_URL=https://api.websitedesigningcompetition.com

# CORS Allowed Origins
ALLOWED_ORIGINS=https://websitedesigningcompetition.com,https://www.websitedesigningcompetition.com,https://api.websitedesigningcompetition.com

# JWT Secret (generate a strong random string)
JWT_SECRET=your-very-secure-secret-key-here
JWT_EXPIRES_IN=7d

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@websitedesigningcompetition.com

# File Storage
UPLOAD_DIR=/var/www/websitedesigncompetition/backend/uploads
MAX_FILE_SIZE=52428800

# Session Secret
SESSION_SECRET=another-very-secure-secret-key
```

**Save and exit** (Ctrl + X, then Y, then Enter).

### Step 4: Create Upload Directory

```bash
# Create uploads directory
mkdir -p /var/www/websitedesigncompetition/backend/uploads

# Set proper permissions
chmod 755 /var/www/websitedesigncompetition/backend/uploads
```

---

## Frontend Build

### Step 1: Navigate to Frontend Directory

```bash
cd /var/www/websitedesigncompetition/frontend
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Build Frontend

```bash
# Build production bundle
npm run build
```

This creates an optimized production build in `frontend/dist/`.

### Step 4: Verify Build

```bash
# Check if dist directory exists
ls -la dist/

# Should see: index.html, assets/, images/, etc.
```

---

## Nginx Configuration

### Step 1: Copy Snippet Files

```bash
# Create snippets directory if it doesn't exist
sudo mkdir -p /etc/nginx/snippets

# Copy snippet configuration files
sudo cp /var/www/websitedesigncompetition/deployment/nginx/snippets/ssl-params.conf /etc/nginx/snippets/
sudo cp /var/www/websitedesigncompetition/deployment/nginx/snippets/security-headers.conf /etc/nginx/snippets/
sudo cp /var/www/websitedesigncompetition/deployment/nginx/snippets/api-proxy.conf /etc/nginx/snippets/

# Verify snippets are copied
ls -la /etc/nginx/snippets/
```

### Step 2: Copy Main Nginx Configuration

```bash
# Copy website design competition config
sudo cp /var/www/websitedesigncompetition/deployment/nginx/nginx-website-design.conf /etc/nginx/sites-available/website-design

# Verify config file
sudo cat /etc/nginx/sites-available/website-design
```

### Step 3: Enable Site

```bash
# Create symbolic link to enable site
sudo ln -s /etc/nginx/sites-available/website-design /etc/nginx/sites-enabled/

# Remove default site (if present)
sudo rm /etc/nginx/sites-enabled/default
```

### Step 4: Test Nginx Configuration

```bash
# Test configuration syntax
sudo nginx -t

# Should output:
# nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
# nginx: configuration file /etc/nginx/nginx.conf test is successful
```

**Note**: You may see SSL warnings at this point - that's normal. We'll fix them after generating SSL certificates.

### Step 5: Reload Nginx

```bash
sudo systemctl reload nginx
```

---

## SSL Certificates

### Step 0: Verify Certbot Directory Exists

**CRITICAL:** Before generating SSL certificates, ensure the certbot directory exists. If you followed the Initial VPS Setup, this should already be created. If not, create it now:

```bash
# Check if directory exists
ls -la /var/www/certbot

# If it doesn't exist, create it
sudo mkdir -p /var/www/certbot
sudo chown -R www-data:www-data /var/www/certbot
sudo chmod -R 755 /var/www/certbot
```

**Why this is needed:** Certbot uses the `.well-known/acme-challenge/` path to verify domain ownership. Without this directory, nginx will return a 500 error and SSL certificate generation will fail with an "unauthorized" error.

### Step 1: Generate API Subdomain Certificate First

**IMPORTANT:** Generate the API subdomain certificate BEFORE the main domain certificate. This avoids a chicken-and-egg problem where the nginx HTTPS block references certificate files that don't exist yet.

```bash
# Generate API subdomain certificate first
sudo certbot --nginx -d api.websitedesigningcompetition.com --non-interactive --agree-tos --email admin@websitedesigningcompetition.com --redirect
```

**Verify it was created:**
```bash
sudo certbot certificates
# Should show: api.websitedesigningcompetition.com with valid certificate
```

### Step 2: Handle Main Domain Certificate (Choose One Method)

The main domain certificate generation can fail if the HTTPS server block references non-existent certificates. Choose one of these methods:

#### Method A: Temporary Certificate Path (Recommended)

Use the API subdomain certificate temporarily, then generate the main domain certificate:

```bash
# 1. Backup current config
sudo cp /etc/nginx/sites-available/nginx-website-design.conf /etc/nginx/sites-available/nginx-website-design.conf.backup

# 2. Edit the config to temporarily use API certificate
sudo nano /etc/nginx/sites-available/nginx-website-design.conf
```

Find the HTTPS Frontend block (around line 65-67) and change:
```nginx
# FROM:
ssl_certificate /etc/letsencrypt/live/websitedesigningcompetition.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/websitedesigningcompetition.com/privkey.pem;
ssl_trusted_certificate /etc/letsencrypt/live/websitedesigningcompetition.com/chain.pem;

# TO:
ssl_certificate /etc/letsencrypt/live/api.websitedesigningcompetition.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/api.websitedesigningcompetition.com/privkey.pem;
ssl_trusted_certificate /etc/letsencrypt/live/api.websitedesigningcompetition.com/chain.pem;
```

Save the file (Ctrl+X, Y, Enter).

```bash
# 3. Test and reload nginx
sudo nginx -t
sudo systemctl reload nginx

# 4. Generate main domain certificate (Certbot will auto-update paths)
sudo certbot --nginx -d websitedesigningcompetition.com -d www.websitedesigningcompetition.com --non-interactive --agree-tos --email admin@websitedesigningcompetition.com --redirect

# 5. Certbot automatically updates the certificate paths back to the correct ones
# No need to restore the backup - Certbot handles it

# 6. Reload nginx
sudo systemctl reload nginx
```

#### Method B: Comment Out HTTPS Block (Alternative)

If Method A doesn't work, temporarily disable the HTTPS block:

```bash
# 1. Backup config
sudo cp /etc/nginx/sites-available/nginx-website-design.conf /etc/nginx/sites-available/nginx-website-design.conf.backup

# 2. Edit config
sudo nano /etc/nginx/sites-available/nginx-website-design.conf
```

Comment out the entire HTTPS Frontend server block (lines 58-162) by adding `#` at the start of each line.

Keep the HTTP block (port 80) uncommented.

Save and exit.

```bash
# 3. Test and reload
sudo nginx -t
sudo systemctl reload nginx

# 4. Generate certificate
sudo certbot --nginx -d websitedesigningcompetition.com -d www.websitedesigningcompetition.com --non-interactive --agree-tos --email admin@websitedesigningcompetition.com --redirect

# 5. Restore original config
sudo cp /etc/nginx/sites-available/nginx-website-design.conf.backup /etc/nginx/sites-available/nginx-website-design.conf

# 6. Test and reload
sudo nginx -t
sudo systemctl reload nginx
```

### Step 3: Verify All Certificates

```bash
# List all certificates
sudo certbot certificates

# Should show both:
# - websitedesigningcompetition.com (with www.websitedesigningcompetition.com)
# - api.websitedesigningcompetition.com
```

**Expected output:**
```
Certificate Name: websitedesigningcompetition.com
  Domains: websitedesigningcompetition.com www.websitedesigningcompetition.com
  Expiry Date: [90 days from now]
  Certificate Path: /etc/letsencrypt/live/websitedesigningcompetition.com/fullchain.pem

Certificate Name: api.websitedesigningcompetition.com
  Domains: api.websitedesigningcompetition.com
  Expiry Date: [90 days from now]
  Certificate Path: /etc/letsencrypt/live/api.websitedesigningcompetition.com/fullchain.pem
```

### Step 4: Test Auto-Renewal

```bash
# Dry run certificate renewal
sudo certbot renew --dry-run

# Should output: "Congratulations, all simulated renewals succeeded"
```

### Step 5: Final Nginx Test

```bash
# Test nginx configuration (should have no SSL warnings now)
sudo nginx -t

# Reload nginx with SSL enabled
sudo systemctl reload nginx

# Test HTTPS access
curl -I https://websitedesigningcompetition.com
curl -I https://www.websitedesigningcompetition.com
curl -I https://api.websitedesigningcompetition.com
```

All three domains should return `HTTP/2 200` or `301/302` redirects without SSL errors.

---

## PM2 Process Management

### Step 1: Start Backend with PM2

```bash
# Start backend using PM2 ecosystem config
cd /var/www/websitedesigncompetition
pm2 start deployment/pm2/backend-ecosystem.config.js

# Verify backend is running
pm2 list
```

You should see:
```
┌─────┬────────────────────────┬─────────┬─────────┬──────────┬────────┬
│ id  │ name                   │ mode    │ status  │ cpu      │ memory │
├─────┼────────────────────────┼─────────┼─────────┼──────────┼────────┼
│ 0   │ kids-competition-api   │ cluster │ online  │ 0%       │ 50.2mb │
│ 1   │ kids-competition-api   │ cluster │ online  │ 0%       │ 48.5mb │
└─────┴────────────────────────┴─────────┴─────────┴──────────┴────────┴
```

### Step 2: Configure PM2 Startup

```bash
# Generate startup script
pm2 startup

# Follow the command shown in the output (copy and run it)
# It will look something like:
# sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u YOUR_USER --hp /home/YOUR_USER

# Save PM2 process list
pm2 save
```

### Step 3: Monitor Backend

```bash
# Real-time monitoring
pm2 monit

# View logs
pm2 logs kids-competition-api

# View only errors
pm2 logs kids-competition-api --err

# View specific number of log lines
pm2 logs kids-competition-api --lines 100
```

### Step 4: Test Backend API

```bash
# Test health endpoint
curl http://localhost:5050/api/health

# Should return: {"status":"ok",...}

# Test through Nginx
curl https://websitedesigningcompetition.com/api/health

# Test API subdomain
curl https://api.websitedesigningcompetition.com/health
```

---

## Updating Deployed Website

### Git Pull Workflow

Use this workflow whenever you push code changes to your repository and want to update the live website.

### Option A: Frontend Changes Only

If you only modified frontend code (React components, styles, etc.):

```bash
# 1. SSH into your VPS
ssh root@YOUR_VPS_IP

# 2. Navigate to project directory
cd /var/www/websitedesigncompetition

# 3. Pull latest changes from git
git pull origin main

# 4. Navigate to frontend directory
cd frontend

# 5. Install any new dependencies (if package.json changed)
npm install

# 6. Rebuild frontend
npm run build

# 7. Verify build completed
ls -la dist/

# 8. Clear browser cache or do a hard refresh (Ctrl+Shift+R)
# The website will automatically show new changes
```

**Time estimate**: 2-5 minutes

### Option B: Backend Changes Only

If you only modified backend code (API routes, controllers, etc.):

```bash
# 1. SSH into your VPS
ssh root@YOUR_VPS_IP

# 2. Navigate to project directory
cd /var/www/websitedesigncompetition

# 3. Pull latest changes from git
git pull origin main

# 4. Navigate to backend directory
cd backend

# 5. Install any new dependencies (if package.json changed)
npm install --production

# 6. Restart PM2 process
pm2 restart kids-competition-api

# 7. Verify backend is running
pm2 status
pm2 logs kids-competition-api --lines 50

# 8. Test API
curl http://localhost:5050/api/health
```

**Time estimate**: 1-3 minutes

### Option C: Both Frontend and Backend Changes

If you modified both frontend and backend code:

```bash
# 1. SSH into your VPS
ssh root@YOUR_VPS_IP

# 2. Navigate to project directory
cd /var/www/websitedesigncompetition

# 3. Pull latest changes from git
git pull origin main

# 4. Update backend
cd backend
npm install --production
pm2 restart kids-competition-api

# 5. Update frontend
cd ../frontend
npm install
npm run build

# 6. Verify everything is running
pm2 status
pm2 logs kids-competition-api --lines 50

# 7. Test the website
curl https://websitedesigningcompetition.com/api/health
```

**Time estimate**: 3-7 minutes

### Option D: Nginx Configuration Changes

If you modified nginx configuration files:

```bash
# 1. SSH into your VPS
ssh root@YOUR_VPS_IP

# 2. Navigate to project directory
cd /var/www/websitedesigncompetition

# 3. Pull latest changes from git
git pull origin main

# 4. Copy updated snippets (if modified)
sudo cp deployment/nginx/snippets/*.conf /etc/nginx/snippets/

# 5. Copy updated main config
sudo cp deployment/nginx/nginx-website-design.conf /etc/nginx/sites-available/website-design

# 6. Test nginx configuration
sudo nginx -t

# 7. If test passes, reload nginx
sudo systemctl reload nginx

# 8. Verify website is accessible
curl -I https://websitedesigningcompetition.com
```

**Time estimate**: 1-2 minutes

### Quick Update Script

Create a simple update script for faster deployments:

```bash
# Create update script
nano /var/www/websitedesigncompetition/update.sh
```

**Script content:**

```bash
#!/bin/bash
set -e

echo "==================================="
echo "Updating Website Design Competition"
echo "==================================="

# Pull latest code
echo "[1/6] Pulling latest code from git..."
cd /var/www/websitedesigncompetition
git pull origin main

# Update backend dependencies
echo "[2/6] Installing backend dependencies..."
cd backend
npm install --production

# Restart backend
echo "[3/6] Restarting backend..."
pm2 restart kids-competition-api

# Update frontend dependencies
echo "[4/6] Installing frontend dependencies..."
cd ../frontend
npm install

# Build frontend
echo "[5/6] Building frontend..."
npm run build

# Verify
echo "[6/6] Verification..."
pm2 status
echo ""
echo "==================================="
echo "Update completed successfully!"
echo "==================================="
echo ""
echo "Test API: curl http://localhost:5050/api/health"
echo "View logs: pm2 logs kids-competition-api"
echo "==================================="
```

**Make script executable:**

```bash
chmod +x /var/www/websitedesigncompetition/update.sh
```

**Use the script:**

```bash
cd /var/www/websitedesigncompetition
./update.sh
```

---

## Troubleshooting

### Issue 1: Website Shows "502 Bad Gateway"

**Cause**: Backend is not running or not accessible.

**Solution**:

```bash
# Check if backend is running
pm2 list

# If not running, start it
pm2 start deployment/pm2/backend-ecosystem.config.js

# Check logs for errors
pm2 logs kids-competition-api --err --lines 100

# Test backend directly
curl http://localhost:5050/api/health
```

### Issue 2: Changes Not Reflecting on Website

**Cause**: Browser cache or build not updated.

**Solution**:

```bash
# 1. Verify frontend build is recent
ls -la /var/www/websitedesigncompetition/frontend/dist/
stat /var/www/websitedesigncompetition/frontend/dist/index.html

# 2. Rebuild frontend
cd /var/www/websitedesigningcompetition/frontend
npm run build

# 3. Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)

# 4. Check if nginx is serving correct files
curl -I https://websitedesigningcompetition.com
```

### Issue 3: Certbot Fails with 500 Error During ACME Challenge

**Cause**: HTTPS server block references non-existent SSL certificates, or `/var/www/certbot` directory is missing.

**Symptoms**:
```
Certbot failed to authenticate some domains (authenticator: nginx).
The Certificate Authority reported these problems:
  Domain: websitedesigningcompetition.com
  Type:   unauthorized
  Detail: Invalid response from http://websitedesigningcompetition.com/.well-known/acme-challenge/: 500
```

**Solution**:

**Step 1: Verify certbot directory exists**
```bash
ls -la /var/www/certbot
# If doesn't exist:
sudo mkdir -p /var/www/certbot
sudo chown -R www-data:www-data /var/www/certbot
sudo chmod -R 755 /var/www/certbot
```

**Step 2: Check nginx error logs**
```bash
sudo tail -100 /var/log/nginx/website-design-error.log
sudo tail -100 /var/log/nginx/error.log
```

**Step 3: If directory exists but still failing, temporarily use API certificate**
```bash
# Backup config
sudo cp /etc/nginx/sites-available/nginx-website-design.conf /etc/nginx/sites-available/nginx-website-design.conf.backup

# Edit config
sudo nano /etc/nginx/sites-available/nginx-website-design.conf
```

Find the HTTPS Frontend block's SSL certificate lines (around line 65-67) and change:
```nginx
# FROM:
ssl_certificate /etc/letsencrypt/live/websitedesigningcompetition.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/websitedesigningcompetition.com/privkey.pem;
ssl_trusted_certificate /etc/letsencrypt/live/websitedesigningcompetition.com/chain.pem;

# TO (temporarily use API certificate):
ssl_certificate /etc/letsencrypt/live/api.websitedesigningcompetition.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/api.websitedesigningcompetition.com/privkey.pem;
ssl_trusted_certificate /etc/letsencrypt/live/api.websitedesigningcompetition.com/chain.pem;
```

Save and continue:
```bash
# Test and reload
sudo nginx -t && sudo systemctl reload nginx

# Try Certbot again (it will auto-fix the certificate paths)
sudo certbot --nginx -d websitedesigningcompetition.com -d www.websitedesigningcompetition.com --non-interactive --agree-tos --email admin@websitedesigningcompetition.com --redirect

# Reload nginx
sudo systemctl reload nginx
```

### Issue 4: SSL Certificate Expired or Invalid

**Cause**: Certificates expired or not properly configured.

**Solution**:

```bash
# Check certificate status
sudo certbot certificates

# Renew certificates
sudo certbot renew

# Test nginx configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

### Issue 5: Port 5050 Already in Use

**Cause**: Another process using port 5050.

**Solution**:

```bash
# Find process using port 5050
sudo lsof -i :5050
sudo netstat -tulpn | grep :5050

# Kill the process (replace PID with actual process ID)
sudo kill -9 PID

# Restart PM2
pm2 restart kids-competition-api
```

### Issue 6: Nginx Test Fails

**Cause**: Syntax error in configuration.

**Solution**:

```bash
# Test nginx and see detailed error
sudo nginx -t

# Check nginx error logs
sudo tail -f /var/log/nginx/error.log

# Verify snippet files exist
ls -la /etc/nginx/snippets/

# If snippets missing, copy them
sudo cp /var/www/websitedesigncompetition/deployment/nginx/snippets/*.conf /etc/nginx/snippets/
```

### Issue 7: Backend Crashes or Restarts Frequently

**Cause**: Memory issues, uncaught errors, or database connection problems.

**Solution**:

```bash
# Check PM2 logs
pm2 logs kids-competition-api --lines 200

# Check system resources
free -h
df -h
top

# Restart with more debugging
pm2 delete kids-competition-api
NODE_ENV=production pm2 start backend/src/server.js --name kids-competition-api -i 2

# Check database connection
# Verify MONGODB_URI in .env file
nano /var/www/websitedesigncompetition/backend/.env
```

### Log Locations

Important log files for debugging:

```bash
# Nginx access logs
sudo tail -f /var/log/nginx/website-design-access.log
sudo tail -f /var/log/nginx/api-subdomain-access.log

# Nginx error logs
sudo tail -f /var/log/nginx/website-design-error.log
sudo tail -f /var/log/nginx/api-subdomain-error.log

# PM2 logs
pm2 logs kids-competition-api
pm2 logs kids-competition-api --err

# System logs
sudo journalctl -u nginx -f
```

### Health Check Commands

```bash
# Check all services
sudo systemctl status nginx
pm2 status

# Test backend API
curl http://localhost:5050/api/health
curl https://websitedesigningcompetition.com/api/health
curl https://api.websitedesigningcompetition.com/health

# Test frontend
curl -I https://websitedesigningcompetition.com

# Check DNS
nslookup websitedesigningcompetition.com
nslookup api.websitedesigningcompetition.com

# Check open ports
sudo netstat -tulpn | grep LISTEN
```

---

## Maintenance

### Regular Update Procedures

**Weekly**:
- Check PM2 logs for errors: `pm2 logs kids-competition-api --lines 100`
- Monitor server resources: `htop` or `top`
- Review nginx access logs for unusual activity

**Monthly**:
- Update system packages: `sudo apt update && sudo apt upgrade -y`
- Restart services for updates to take effect
- Review and rotate logs

**Quarterly**:
- Review and update dependencies: `npm outdated`
- Test disaster recovery procedures
- Review security headers and SSL configuration

### Backup Recommendations

**Database Backups** (if using MongoDB):

```bash
# Create backup script
nano /root/backup-db.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/mongodb"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR
mongodump --uri="mongodb://localhost:27017/websitedesigncomp" --out=$BACKUP_DIR/backup_$DATE

# Keep only last 7 days of backups
find $BACKUP_DIR -type d -mtime +7 -exec rm -rf {} +
```

```bash
chmod +x /root/backup-db.sh

# Add to crontab (daily at 2 AM)
crontab -e
# Add line: 0 2 * * * /root/backup-db.sh
```

**Code Backups**:

Your code is already backed up in Git. Ensure you push changes regularly.

**Upload Directory Backup**:

```bash
# Backup user uploads
tar -czf /var/backups/uploads_$(date +%Y%m%d).tar.gz /var/www/websitedesigncompetition/backend/uploads

# Keep only last 30 days
find /var/backups/uploads_*.tar.gz -mtime +30 -delete
```

### Security Best Practices

1. **Keep Software Updated**:
   ```bash
   sudo apt update && sudo apt upgrade -y
   npm update -g npm pm2
   ```

2. **Use Firewall** (UFW):
   ```bash
   sudo ufw enable
   sudo ufw allow 22    # SSH
   sudo ufw allow 80    # HTTP
   sudo ufw allow 443   # HTTPS
   sudo ufw status
   ```

3. **Disable Root SSH Login** (recommended):
   ```bash
   sudo nano /etc/ssh/sshd_config
   # Set: PermitRootLogin no
   sudo systemctl restart sshd
   ```

4. **Monitor Failed Login Attempts**:
   ```bash
   sudo tail -f /var/log/auth.log
   ```

5. **Regular Security Audits**:
   ```bash
   npm audit
   npm audit fix
   ```

6. **Environment Variables**:
   - Never commit `.env` files to Git
   - Use strong, unique secrets for JWT_SECRET and SESSION_SECRET
   - Rotate secrets periodically

### Performance Optimization

1. **Enable Nginx Caching** (if needed):
   - Already configured in nginx-website-design.conf
   - Static assets cached for 1 year
   - HTML files not cached (for SPA updates)

2. **Monitor Backend Performance**:
   ```bash
   pm2 monit
   ```

3. **Database Indexing**:
   - Ensure proper indexes on MongoDB collections
   - Monitor slow queries

4. **CDN Integration** (optional):
   - Consider using Cloudflare or similar CDN
   - Improves global performance and adds DDoS protection

---

## Quick Reference

### Common Commands

```bash
# Update website (pull + rebuild + restart)
cd /var/www/websitedesigncompetition && ./update.sh

# Restart backend
pm2 restart kids-competition-api

# View backend logs
pm2 logs kids-competition-api

# Rebuild frontend
cd /var/www/websitedesigncompetition/frontend && npm run build

# Reload nginx
sudo nginx -t && sudo systemctl reload nginx

# Check service status
sudo systemctl status nginx
pm2 status

# View nginx error logs
sudo tail -f /var/log/nginx/website-design-error.log
```

### Contact Information

For support or questions:
- Documentation: `/docs/` directory in the repository
- Issues: Create an issue on GitHub repository

---

**Last Updated**: January 2026
**Version**: 2.0.0
