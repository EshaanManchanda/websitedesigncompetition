# Hostinger VPS KVM1 - Detailed Deployment Guide
## Kids Web Competition - Step-by-Step Publishing Instructions

> **Estimated Time:** 45-60 minutes
> **Difficulty:** Intermediate
> **Requirements:** SSH access, domain configured, external service credentials

---

## Table of Contents
1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Phase 1: Initial VPS Setup](#phase-1-initial-vps-setup)
3. [Phase 2: Install Required Software](#phase-2-install-required-software)
4. [Phase 3: Deploy Application Files](#phase-3-deploy-application-files)
5. [Phase 4: Configure Backend](#phase-4-configure-backend)
6. [Phase 5: Build Frontend](#phase-5-build-frontend)
7. [Phase 6: Configure Nginx](#phase-6-configure-nginx)
8. [Phase 7: Setup SSL Certificate](#phase-7-setup-ssl-certificate)
9. [Phase 8: Final Testing](#phase-8-final-testing)
10. [Phase 9: Post-Deployment](#phase-9-post-deployment)

---

## Pre-Deployment Checklist

### Step 1: Gather All Required Information

Before starting, collect and verify all credentials:

#### 1.1 VPS Access Information
- [ ] VPS IP Address: `________________`
- [ ] SSH Username: `________________` (usually `root` or `ubuntu`)
- [ ] SSH Password or Key: `________________`
- [ ] SSH Port: `________________` (default: 22)

**How to get VPS IP:**
1. Log into Hostinger Control Panel
2. Go to "VPS" section
3. Click on your VPS
4. Copy the IP address shown

#### 1.2 Domain Configuration
- [ ] Domain name: `________________` (e.g., kidswebcomp.com)
- [ ] DNS A Record pointing to VPS IP

**How to configure DNS:**
1. Go to Hostinger → Domains
2. Click "Manage" on your domain
3. Go to DNS / Name Servers
4. Add/Edit A Record:
   - Type: `A`
   - Name: `@` (for root domain)
   - Points to: `Your VPS IP`
   - TTL: `14400` (or leave default)
5. Add another A Record for www:
   - Type: `A`
   - Name: `www`
   - Points to: `Your VPS IP`
   - TTL: `14400`
6. Wait 15-30 minutes for DNS propagation

**Verify DNS is working:**
```bash
# On your local machine, run:
ping yourdomain.com
# Should return your VPS IP address
```

#### 1.3 MongoDB Atlas Credentials
- [ ] MongoDB Atlas Account created: https://cloud.mongodb.com
- [ ] Cluster created
- [ ] Database user created
- [ ] Connection String: `mongodb+srv://username:password@cluster...`

**How to get MongoDB Atlas connection string:**
1. Log into MongoDB Atlas
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Replace `<dbname>` with `kids_competition`

#### 1.4 Cloudinary Credentials
- [ ] Cloudinary Account: https://cloudinary.com
- [ ] Cloud Name: `________________`
- [ ] API Key: `________________`
- [ ] API Secret: `________________`

**How to get Cloudinary credentials:**
1. Log into Cloudinary dashboard
2. Go to Dashboard (home page)
3. Find "Account Details" section
4. Copy: Cloud name, API Key, API Secret

#### 1.5 Hostinger Email/SMTP Credentials
- [ ] Email created: `noreply@yourdomain.com`
- [ ] Email password: `________________`
- [ ] SMTP Host: `smtp.hostinger.com`
- [ ] SMTP Port: `587`

**How to create email account:**
1. Hostinger Control Panel → Emails
2. Click "Create Email Account"
3. Enter: `noreply` (username)
4. Choose your domain
5. Set a strong password
6. Note down the password

---

## Phase 1: Initial VPS Setup

### Step 1.1: Connect to Your VPS via SSH

#### On Windows (using PowerShell or Command Prompt):
```bash
ssh root@YOUR_VPS_IP
# Replace YOUR_VPS_IP with your actual VPS IP address
```

#### On Mac/Linux (using Terminal):
```bash
ssh root@YOUR_VPS_IP
```

**What to expect:**
- First time connection will ask: `Are you sure you want to continue connecting (yes/no)?`
- Type: `yes` and press Enter
- Enter your password when prompted (password won't show as you type)

**Success looks like:**
```
Welcome to Ubuntu 22.04 LTS
root@vps-xxxxx:~#
```

**Troubleshooting:**
- **Connection refused:** Check VPS IP address, ensure VPS is running
- **Permission denied:** Verify username and password
- **Timeout:** Check firewall, VPS might be off

### Step 1.2: Update System Packages

```bash
sudo apt-get update
```

**What this does:** Downloads package information from all configured sources

**Expected output:** Lines showing package lists being read
```
Hit:1 http://archive.ubuntu.com/ubuntu jammy InRelease
Get:2 http://archive.ubuntu.com/ubuntu jammy-updates InRelease
...
Reading package lists... Done
```

**Then upgrade:**
```bash
sudo apt-get upgrade -y
```

**What this does:** Upgrades all installed packages to their latest versions
**The `-y` flag:** Automatically answers "yes" to prompts
**Time:** 2-5 minutes depending on updates

**Expected output:**
```
Reading package lists... Done
Building dependency tree... Done
...
Processing triggers for ...
```

### Step 1.3: Install Essential Tools

```bash
sudo apt-get install -y curl wget git build-essential software-properties-common ufw nano vim
```

**What each tool does:**
- `curl` - Download files from URLs
- `wget` - Alternative download tool
- `git` - Version control (for cloning your code)
- `build-essential` - Compilers needed for Node.js native modules
- `software-properties-common` - Manage software repositories
- `ufw` - Firewall management
- `nano` - Text editor (easier for beginners)
- `vim` - Text editor (more advanced)

**Expected output:**
```
Reading package lists... Done
...
Setting up curl (7.81.0-1ubuntu1) ...
...
Processing triggers for libc-bin ...
```

**Verify installation:**
```bash
git --version
curl --version
```

Should show version numbers for each.

---

## Phase 2: Install Required Software

### Step 2.1: Install Node.js 20 LTS

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
```

**What this does:** Downloads and runs NodeSource setup script for Node.js 20.x

**Expected output:**
```
## Installing the NodeSource Node.js 20.x repo...
## Run 'sudo apt-get install -y nodejs' to install Node.js 20.x
```

**Now install Node.js:**
```bash
sudo apt-get install -y nodejs
```

**Expected output:**
```
Setting up nodejs (20.x.x-1nodesource1) ...
```

**Verify installation:**
```bash
node --version
npm --version
```

**Expected output:**
```
v20.11.0 (or similar v20.x.x)
10.2.4 (or similar v10.x.x)
```

**If versions don't match:**
```bash
# Remove old Node.js if exists
sudo apt-get remove nodejs -y
sudo apt-get autoremove -y
# Repeat installation steps above
```

### Step 2.2: Install PM2 Process Manager

```bash
sudo npm install -g pm2
```

**What this does:** Installs PM2 globally (the `-g` flag means globally)
**What PM2 does:** Manages Node.js applications, keeps them running, auto-restarts

**Expected output:**
```
added 183 packages in 15s
```

**Verify installation:**
```bash
pm2 --version
```

**Expected output:**
```
5.3.0 (or similar)
```

### Step 2.3: Install Nginx Web Server

```bash
sudo apt-get install -y nginx
```

**Expected output:**
```
Setting up nginx (1.18.0-6ubuntu14) ...
```

**Start Nginx:**
```bash
sudo systemctl start nginx
```

**Enable Nginx to start on boot:**
```bash
sudo systemctl enable nginx
```

**Expected output:**
```
Synchronizing state of nginx.service with SysV service script...
Created symlink /etc/systemd/system/multi-user.target.wants/nginx.service
```

**Verify Nginx is running:**
```bash
sudo systemctl status nginx
```

**Expected output:**
```
● nginx.service - A high performance web server
   Active: active (running) since ...
```

**Press `q` to exit the status view**

**Test Nginx in browser:**
1. Open browser
2. Go to: `http://YOUR_VPS_IP`
3. You should see "Welcome to nginx!" page

### Step 2.4: Configure Firewall

```bash
sudo ufw allow OpenSSH
```

**What this does:** Allows SSH connections (port 22) - IMPORTANT: Do this first or you'll lock yourself out!

**Expected output:**
```
Rules updated
Rules updated (v6)
```

```bash
sudo ufw allow 'Nginx Full'
```

**What this does:** Allows HTTP (80) and HTTPS (443) traffic

**Expected output:**
```
Rules updated
Rules updated (v6)
```

**Enable the firewall:**
```bash
sudo ufw --force enable
```

**The `--force` flag:** Skips confirmation prompt

**Expected output:**
```
Firewall is active and enabled on system startup
```

**Verify firewall status:**
```bash
sudo ufw status
```

**Expected output:**
```
Status: active

To                         Action      From
--                         ------      ----
OpenSSH                    ALLOW       Anywhere
Nginx Full                 ALLOW       Anywhere
OpenSSH (v6)               ALLOW       Anywhere (v6)
Nginx Full (v6)            ALLOW       Anywhere (v6)
```

**✅ Phase 2 Complete!** You now have Node.js, PM2, Nginx, and firewall configured.

---

## Phase 3: Deploy Application Files

### Step 3.1: Create Application Directory

```bash
sudo mkdir -p /var/www/kids-competition
```

**What this does:** Creates directory `/var/www/kids-competition`
**The `-p` flag:** Creates parent directories if they don't exist

```bash
sudo chown -R $USER:$USER /var/www/kids-competition
```

**What this does:** Changes ownership to your current user
**Why:** So you don't need `sudo` for every command in this directory

**Verify:**
```bash
ls -la /var/www/
```

**Should show:**
```
drwxr-xr-x  3 root root     4096 Dec 21 10:00 kids-competition
```

**Navigate to directory:**
```bash
cd /var/www/kids-competition
```

**Verify you're in the right place:**
```bash
pwd
```

**Should output:**
```
/var/www/kids-competition
```

### Step 3.2: Deploy Code

**CHOOSE ONE METHOD:**

#### Method A: Git Clone (Recommended if code is on GitHub)

**First, create/upload your code to GitHub:**

1. On your local machine, open terminal in: `C:\Users\eshaa\Downloads\kids_web_competition`
2. Initialize git (if not already):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```
3. Create repository on GitHub
4. Push to GitHub:
   ```bash
   git remote add origin https://github.com/yourusername/kids-web-competition.git
   git branch -M main
   git push -u origin main
   ```

**Then on VPS:**
```bash
cd /var/www/kids-competition
git clone https://github.com/yourusername/kids-web-competition.git temp
mv temp/* .
mv temp/.* . 2>/dev/null || true
rm -rf temp
```

**What these commands do:**
1. Clone into `temp` folder
2. Move all files from `temp` to current directory
3. Move hidden files (like `.env.example`)
4. Remove empty `temp` folder

#### Method B: File Transfer via SCP (Alternative)

**On your local Windows machine:**

1. Open PowerShell
2. Navigate to project folder:
   ```powershell
   cd C:\Users\eshaa\Downloads\kids_web_competition
   ```
3. Transfer files:
   ```powershell
   scp -r * root@YOUR_VPS_IP:/var/www/kids-competition/
   ```

**What this does:** Securely copies all files from local to VPS

**Verify files are uploaded:**
```bash
cd /var/www/kids-competition
ls -la
```

**Should show:**
```
drwxr-xr-x  6 root root  4096 Dec 21 10:15 backend
drwxr-xr-x  4 root root  4096 Dec 21 10:15 src
-rw-r--r--  1 root root  1234 Dec 21 10:15 package.json
-rw-r--r--  1 root root   567 Dec 21 10:15 vite.config.ts
...
```

**✅ Phase 3 Complete!** Application files are now on the VPS.

---

## Phase 4: Configure Backend

### Step 4.1: Install Backend Dependencies

```bash
cd /var/www/kids-competition/backend
```

**Verify you're in backend directory:**
```bash
pwd
```

**Should output:** `/var/www/kids-competition/backend`

**Install packages:**
```bash
npm install --production
```

**What this does:** Installs only production dependencies (excludes devDependencies)
**Time:** 1-3 minutes
**The `--production` flag:** Skips devDependencies to save space

**Expected output:**
```
added 245 packages, and audited 246 packages in 45s

32 packages are looking for funding
```

**Create logs directory:**
```bash
mkdir -p logs
```

**Verify:**
```bash
ls -la
```

**Should show `logs/` folder**

### Step 4.2: Create Backend Environment File

```bash
nano /var/www/kids-competition/backend/.env
```

**What this does:** Opens nano text editor to create `.env` file

**Copy and paste this template, then fill in YOUR values:**

```env
# Server Configuration
NODE_ENV=production
PORT=3000
API_VERSION=v1

# MongoDB Atlas - REPLACE WITH YOUR VALUES
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/kids_competition?retryWrites=true&w=majority

# Cloudinary - REPLACE WITH YOUR VALUES
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
CLOUDINARY_FOLDER=kids-competition

# Email Configuration - Production (Hostinger SMTP)
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=noreply@yourdomain.com
SMTP_PASSWORD=your-hostinger-email-password

# Email Settings - REPLACE WITH YOUR EMAIL
FROM_EMAIL=noreply@yourdomain.com
ADMIN_EMAIL=admin@yourdomain.com
SUPPORT_EMAIL=support@yourdomain.com

# Competition Configuration
COMPETITION_YEAR=2025
REGISTRATION_OPEN_DATE=January 1, 2025
REGISTRATION_CLOSE_DATE=March 15, 2025
SUBMISSION_DEADLINE=March 31, 2025 at 11:59 PM
RESULTS_ANNOUNCEMENT_DATE=April 15, 2025

# File Upload Limits
MAX_FILE_SIZE_MB=50
MAX_FILE_SIZE_BYTES=52428800

# CORS Configuration - REPLACE WITH YOUR DOMAIN
FRONTEND_URL=https://yourdomain.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**How to use nano editor:**
1. Paste the content above
2. Replace ALL placeholder values with your actual credentials:
   - `YOUR_USERNAME` → your MongoDB username
   - `YOUR_PASSWORD` → your MongoDB password
   - `YOUR_CLUSTER` → your MongoDB cluster URL
   - `your-cloud-name` → Cloudinary cloud name
   - `your-api-key` → Cloudinary API key
   - `your-api-secret` → Cloudinary API secret
   - `yourdomain.com` → your actual domain
   - `your-hostinger-email-password` → your email password
3. Press `Ctrl + O` (letter O) to save
4. Press `Enter` to confirm filename
5. Press `Ctrl + X` to exit

**Verify file was created:**
```bash
ls -la .env
```

**Should show:**
```
-rw-r--r-- 1 root root 1234 Dec 21 10:30 .env
```

**Secure the file (very important!):**
```bash
chmod 600 .env
```

**What this does:** Makes file readable/writable only by owner (you)

**Verify permissions:**
```bash
ls -la .env
```

**Should now show:**
```
-rw------- 1 root root 1234 Dec 21 10:30 .env
```

### Step 4.3: Test Backend Configuration

**Before starting PM2, let's test if the backend can start:**

```bash
cd /var/www/kids-competition/backend
node src/server.js
```

**What to expect if successful:**
```
Server running on port 3000
Connected to MongoDB
Cloudinary configured successfully
```

**If you see errors:**
- **MongoDB connection error:** Check `MONGODB_URI` in `.env`
- **Cloudinary error:** Check Cloudinary credentials in `.env`
- **Port in use:** Another process is using port 3000

**Stop the test server:**
Press `Ctrl + C`

### Step 4.4: Start Backend with PM2

```bash
cd /var/www/kids-competition/backend
pm2 start ecosystem.config.js
```

**What this does:** Starts your backend using PM2 with the configuration in `ecosystem.config.js`

**Expected output:**
```
[PM2] Spawning PM2 daemon with pm2_home=/root/.pm2
[PM2] PM2 Successfully daemonized
[PM2][WARN] Applications kids-competition-api not running, starting...
[PM2] App [kids-competition-api] launched (2 instances)

┌─────┬──────────────────────────┬─────────┬─────────┬─────────┬──────────┐
│ id  │ name                     │ mode    │ ↺       │ status  │ cpu      │
├─────┼──────────────────────────┼─────────┼─────────┼─────────┼──────────┤
│ 0   │ kids-competition-api     │ cluster │ 0       │ online  │ 0%       │
│ 1   │ kids-competition-api     │ cluster │ 0       │ online  │ 0%       │
└─────┴──────────────────────────┴─────────┴─────────┴─────────┴──────────┘
```

**Save PM2 process list:**
```bash
pm2 save
```

**Expected output:**
```
[PM2] Saving current process list...
[PM2] Successfully saved in /root/.pm2/dump.pm2
```

**Setup PM2 to start on system boot:**
```bash
pm2 startup
```

**Expected output:**
```
[PM2] Init System found: systemd
[PM2] To setup the Startup Script, copy/paste the following command:
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u root --hp /root
```

**Copy the command shown (starting with `sudo env...`) and run it:**
```bash
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u root --hp /root
```

**Expected output:**
```
[PM2] Writing init configuration in /etc/systemd/system/pm2-root.service
[PM2] Making script booting at startup...
[PM2] Successfully installed init configuration
```

**Check PM2 status:**
```bash
pm2 status
```

**Should show 2 instances running:**
```
┌─────┬──────────────────────────┬─────────┬─────────┬─────────┬──────────┐
│ id  │ name                     │ mode    │ ↺       │ status  │ cpu      │
├─────┼──────────────────────────┼─────────┼─────────┼─────────┼──────────┤
│ 0   │ kids-competition-api     │ cluster │ 0       │ online  │ 0%       │
│ 1   │ kids-competition-api     │ cluster │ 0       │ online  │ 0%       │
└─────┴──────────────────────────┴─────────┴─────────┴─────────┴──────────┘
```

### Step 4.5: Verify Backend is Working

```bash
curl http://localhost:3000/api/health
```

**Expected output:**
```json
{"status":"healthy","timestamp":"2025-12-21T10:45:23.456Z","environment":"production"}
```

**If you see an error:**
```bash
# Check logs
pm2 logs kids-competition-api

# Look for error messages
# Common issues:
# - MongoDB connection failed: Check MONGODB_URI
# - Cloudinary error: Check Cloudinary credentials
# - Port already in use: Change PORT in .env
```

**✅ Phase 4 Complete!** Backend is running via PM2.

---

## Phase 5: Build Frontend

### Step 5.1: Create Frontend Environment File

```bash
nano /var/www/kids-competition/.env
```

**Copy and paste, replacing placeholders with YOUR values:**

```env
# Backend API - REPLACE WITH YOUR DOMAIN
VITE_API_URL=https://yourdomain.com/api

# Competition Dates Configuration
VITE_COMPETITION_YEAR=2025
VITE_REGISTRATION_OPEN_DATE=2025-01-01
VITE_REGISTRATION_CLOSE_DATE=2025-03-15T23:59:59
VITE_SUBMISSION_DEADLINE=2025-03-31T23:59:59
VITE_RESULTS_ANNOUNCEMENT_DATE=2025-04-15

# Admin Configuration - REPLACE WITH YOUR EMAIL
VITE_ADMIN_EMAIL=admin@yourdomain.com

# File Upload Configuration
VITE_MAX_FILE_SIZE_MB=50

# Disable route messaging in production
VITE_ENABLE_ROUTE_MESSAGING=false
```

**Important replacements:**
- `yourdomain.com` → your actual domain (e.g., `kidswebcomp.com`)
- Make sure to use `https://` not `http://`

**Save and exit:**
1. Press `Ctrl + O` to save
2. Press `Enter`
3. Press `Ctrl + X` to exit

**Secure the file:**
```bash
chmod 600 /var/www/kids-competition/.env
```

### Step 5.2: Install Frontend Dependencies

```bash
cd /var/www/kids-competition
```

**Verify you're in the right directory:**
```bash
pwd
```

**Should output:** `/var/www/kids-competition`

**Install packages:**
```bash
npm install
```

**What this does:** Installs all frontend dependencies (including dev dependencies needed for build)
**Time:** 2-5 minutes

**Expected output:**
```
added 1247 packages, and audited 1248 packages in 2m

124 packages are looking for funding
```

### Step 5.3: Build Frontend for Production

```bash
npm run build
```

**What this does:**
- Compiles TypeScript to JavaScript
- Bundles all React components
- Minifies code
- Optimizes images
- Creates production-ready static files in `dist/` folder

**Time:** 30-90 seconds

**Expected output:**
```
vite v5.4.1 building for production...
✓ 1234 modules transformed.
dist/index.html                   0.45 kB │ gzip:  0.30 kB
dist/assets/index-a1b2c3d4.css    3.21 kB │ gzip:  1.23 kB
dist/assets/index-e5f6g7h8.js   142.34 kB │ gzip: 45.67 kB
✓ built in 23.45s
```

**Verify build was created:**
```bash
ls -la dist/
```

**Should show:**
```
total 24
drwxr-xr-x 3 root root 4096 Dec 21 11:00 .
drwxr-xr-x 8 root root 4096 Dec 21 11:00 ..
drwxr-xr-x 2 root root 4096 Dec 21 11:00 assets
-rw-r--r-- 1 root root  456 Dec 21 11:00 index.html
drwxr-xr-x 2 root root 4096 Dec 21 11:00 images
-rw-r--r-- 1 root root  123 Dec 21 11:00 favicon.ico
-rw-r--r-- 1 root root   45 Dec 21 11:00 robots.txt
```

### Step 5.4: Set Proper Permissions

```bash
sudo chmod -R 755 /var/www/kids-competition/dist
```

**What this does:**
- `7` (owner): read, write, execute
- `5` (group): read, execute
- `5` (others): read, execute
- `-R`: Recursive (applies to all files/folders inside)

**Why:** Nginx needs read access to serve these files

**Verify:**
```bash
ls -la /var/www/kids-competition/
```

**✅ Phase 5 Complete!** Frontend is built and ready to serve.

---

## Phase 6: Configure Nginx

### Step 6.1: Remove Default Nginx Configuration

```bash
sudo rm /etc/nginx/sites-enabled/default
```

**What this does:** Removes default "Welcome to nginx" page

### Step 6.2: Create Kids Competition Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/kids-competition
```

**Copy and paste the ENTIRE configuration below:**

**⚠️ IMPORTANT: Replace `yourdomain.com` with your actual domain in 2 places (line 14)**

```nginx
# Upstream backend API
upstream backend_api {
    server 127.0.0.1:3000;
    keepalive 64;
}

# Rate limiting zones
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=general_limit:10m rate=30r/s;

server {
    listen 80;
    listen [::]:80;

    server_name yourdomain.com www.yourdomain.com;

    # Root directory for frontend
    root /var/www/kids-competition/dist;
    index index.html;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' https: data: 'unsafe-inline' 'unsafe-eval'; img-src 'self' data: https://res.cloudinary.com;" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss application/rss+xml font/truetype font/opentype application/vnd.ms-fontobject image/svg+xml;
    gzip_disable "msie6";

    # Client upload size (50MB for file uploads)
    client_max_body_size 52M;
    client_body_timeout 120s;

    # API routes - reverse proxy to backend
    location /api/ {
        limit_req zone=api_limit burst=20 nodelay;

        proxy_pass http://backend_api;
        proxy_http_version 1.1;

        # Proxy headers
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Connection "";

        # Timeout settings for file uploads
        proxy_connect_timeout 120s;
        proxy_send_timeout 120s;
        proxy_read_timeout 120s;

        # Buffering settings
        proxy_buffering on;
        proxy_buffer_size 4k;
        proxy_buffers 8 4k;
        proxy_busy_buffers_size 8k;

        # WebSocket support (if needed in future)
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    # Static assets with caching
    location /assets/ {
        limit_req zone=general_limit burst=50 nodelay;
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # Images with caching
    location /images/ {
        limit_req zone=general_limit burst=50 nodelay;
        expires 1M;
        add_header Cache-Control "public";
        access_log off;
    }

    # Favicon
    location = /favicon.ico {
        access_log off;
        log_not_found off;
    }

    # Robots.txt
    location = /robots.txt {
        access_log off;
        log_not_found off;
    }

    # Frontend React routes (SPA)
    location / {
        limit_req zone=general_limit burst=50 nodelay;
        try_files $uri $uri/ /index.html;

        # HTML files - no caching
        location ~* \.html$ {
            expires -1;
            add_header Cache-Control "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0";
        }
    }

    # Deny access to hidden files
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }

    # Logging
    access_log /var/log/nginx/kids-competition-access.log;
    error_log /var/log/nginx/kids-competition-error.log warn;
}
```

**Save and exit:**
1. Press `Ctrl + O`
2. Press `Enter`
3. Press `Ctrl + X`

### Step 6.3: Enable the Configuration

```bash
sudo ln -s /etc/nginx/sites-available/kids-competition /etc/nginx/sites-enabled/
```

**What this does:** Creates a symbolic link from `sites-available` to `sites-enabled`

**Verify link was created:**
```bash
ls -la /etc/nginx/sites-enabled/
```

**Should show:**
```
lrwxrwxrwx 1 root root 42 Dec 21 11:15 kids-competition -> /etc/nginx/sites-available/kids-competition
```

### Step 6.4: Test Nginx Configuration

```bash
sudo nginx -t
```

**Expected output if successful:**
```
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

**If you see errors:**
- **"unknown directive":** Copy/paste error, check configuration
- **"conflicting server name":** Another config using same domain
- **"no such file":** Check the dist directory exists

### Step 6.5: Reload Nginx

```bash
sudo systemctl reload nginx
```

**What this does:** Reloads Nginx with new configuration (no downtime)

**Verify Nginx is running:**
```bash
sudo systemctl status nginx
```

**Should show:**
```
● nginx.service - A high performance web server
   Active: active (running) since ...
```

Press `q` to exit

### Step 6.6: Test Website (HTTP Only - Before SSL)

**Open browser and go to:**
```
http://yourdomain.com
```

**You should see:** Your Kids Web Competition website!

**If you see errors:**
- **502 Bad Gateway:** Backend not running, check: `pm2 status`
- **404 Not Found:** Nginx can't find dist folder, check path
- **Connection refused:** Firewall blocking, check: `sudo ufw status`

**Test API:**
```
http://yourdomain.com/api/health
```

**Should return:**
```json
{"status":"healthy","timestamp":"...","environment":"production"}
```

**✅ Phase 6 Complete!** Website is accessible via HTTP.

---

## Phase 7: Setup SSL Certificate

### Step 7.1: Install Certbot

```bash
sudo apt-get update
sudo apt-get install -y certbot python3-certbot-nginx
```

**Expected output:**
```
Setting up python3-certbot-nginx ...
Setting up certbot ...
```

**Verify installation:**
```bash
certbot --version
```

**Should show:** `certbot 2.x.x`

### Step 7.2: Obtain SSL Certificate

**⚠️ CRITICAL: Before running this command:**
1. Ensure your domain DNS is pointing to VPS IP (wait 30 min after DNS change)
2. Verify: `ping yourdomain.com` returns your VPS IP

**Run Certbot:**
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

**Replace `yourdomain.com` with your actual domain!**

**Interactive prompts:**

**1. Enter email address:**
```
Enter email address (used for urgent renewal and security notices):
```
Type your email and press Enter

**2. Agree to Terms:**
```
Please read the Terms of Service at https://letsencrypt.org/documents/LE-SA-v1.3-September-21-2022.pdf
(A)gree/(C)ancel:
```
Type `A` and press Enter

**3. Share email (optional):**
```
Would you be willing to share your email address with EFF? (Y/N):
```
Type `N` and press Enter (or `Y` if you want)

**4. Redirect HTTP to HTTPS:**
```
Please choose whether or not to redirect HTTP traffic to HTTPS
1: No redirect
2: Redirect - Make all requests redirect to secure HTTPS access
Select the appropriate number [1-2]:
```
Type `2` and press Enter

**Expected output if successful:**
```
Successfully received certificate.
Certificate is saved at: /etc/letsencrypt/live/yourdomain.com/fullchain.pem
Key is saved at:         /etc/letsencrypt/live/yourdomain.com/privkey.pem
This certificate expires on 2026-03-21.
Congratulations! You have successfully enabled HTTPS!
```

**If you see errors:**

**Error: "DNS problem: NXDOMAIN looking up A for yourdomain.com"**
- DNS not configured correctly
- Wait longer for DNS propagation (up to 48 hours, usually 30 min)
- Check DNS: `dig yourdomain.com`

**Error: "Could not bind to IPv4 or IPv6"**
- Port 80 or 443 blocked
- Check firewall: `sudo ufw status`

**Error: "timeout"**
- Firewall blocking Let's Encrypt servers
- VPS provider might block port 80

### Step 7.3: Verify SSL Configuration

**Test Nginx config:**
```bash
sudo nginx -t
```

**Should still show:** `syntax is ok` and `test is successful`

**Reload Nginx:**
```bash
sudo systemctl reload nginx
```

**Test HTTPS in browser:**
```
https://yourdomain.com
```

**You should see:**
- 🔒 Padlock in address bar
- Website loads over HTTPS

**Test HTTP redirect:**
```
http://yourdomain.com
```

**Should automatically redirect to:** `https://yourdomain.com`

### Step 7.4: Setup Auto-Renewal

**Certbot automatically creates a renewal timer. Verify it's working:**

```bash
sudo certbot renew --dry-run
```

**What this does:** Simulates renewal process without actually renewing

**Expected output:**
```
Saving debug log to /var/log/letsencrypt/letsencrypt.log
Processing /etc/letsencrypt/renewal/yourdomain.com.conf
Account registered.
Simulating renewal of an existing certificate for yourdomain.com

Congratulations, all simulated renewals succeeded:
  /etc/letsencrypt/live/yourdomain.com/fullchain.pem (success)
```

**Check renewal timer status:**
```bash
sudo systemctl status certbot.timer
```

**Should show:**
```
● certbot.timer - Run certbot twice daily
   Active: active (waiting) since ...
```

Press `q` to exit

**✅ Phase 7 Complete!** SSL certificate installed and auto-renewal configured.

---

## Phase 8: Final Testing

### Step 8.1: Test Backend API

**Health check:**
```bash
curl https://yourdomain.com/api/health
```

**Expected response:**
```json
{"status":"healthy","timestamp":"2025-12-21T12:00:00.000Z","environment":"production"}
```

### Step 8.2: Test Frontend

**Homepage:**
```bash
curl -I https://yourdomain.com
```

**Expected response:**
```
HTTP/2 200
server: nginx
content-type: text/html
x-frame-options: SAMEORIGIN
x-content-type-options: nosniff
```

**Search for app title:**
```bash
curl https://yourdomain.com | grep -i "Kids Web Competition"
```

**Should return:** Lines containing "Kids Web Competition"

### Step 8.3: Test in Browser - Complete Walkthrough

**1. Open browser and visit:** `https://yourdomain.com`

**Checklist:**
- [ ] Page loads without errors
- [ ] SSL padlock shows (🔒)
- [ ] Navigation menu works
- [ ] Images load (check browser console for errors)
- [ ] Footer displays correctly

**2. Test navigation:**
- [ ] Click "Register" - goes to `/register`
- [ ] Click "FAQ" - goes to `/faq`
- [ ] Click "Resources" - goes to `/resources`
- [ ] Click "Contact" - goes to `/contact`
- [ ] Logo click - returns to homepage

**3. Test registration form:**
- Go to `/register`
- [ ] Form displays all fields
- [ ] Upload button works (click to select file)
- [ ] Form validation works (try submitting empty)

### Step 8.4: Test File Upload

**Fill registration form with test data:**
1. First Name: Test
2. Last Name: User
3. Email: test@example.com
4. Age Group: 11-13
5. School: Test School
6. Parent Name: Test Parent
7. Parent Email: parent@example.com
8. Category: Web Design
9. Experience: Beginner
10. Upload a small test file (ZIP, PDF, or image < 50MB)
11. Check "I agree to terms"
12. Click Submit

**What to verify:**

**A. File upload succeeds:**
- Progress indicator shows
- Success message appears
- No errors in browser console (F12)

**B. Check Cloudinary:**
1. Log into Cloudinary dashboard
2. Go to Media Library
3. Folder: `kids-competition`
4. Should see uploaded file

**C. Check MongoDB Atlas:**
1. Log into MongoDB Atlas
2. Go to Browse Collections
3. Database: `kids_competition`
4. Collection: `registrations`
5. Should see new registration document

**D. Check backend logs:**
```bash
pm2 logs kids-competition-api --lines 50
```

Look for:
```
File uploaded successfully to Cloudinary
Registration saved to database
```

### Step 8.5: Test Email Sending

**After submitting registration form, check:**

**1. Check backend logs:**
```bash
pm2 logs kids-competition-api | grep -i email
```

**Should see:**
```
Email sent successfully to: test@example.com
Email sent successfully to: parent@example.com
Email sent successfully to: admin@yourdomain.com
```

**2. Check email inboxes:**
- Student email (`test@example.com`) - confirmation email
- Parent email (`parent@example.com`) - notification email
- Admin email (`admin@yourdomain.com`) - admin notification

**If emails not received:**
- Check spam folder
- Check backend logs for SMTP errors
- Verify SMTP credentials in `backend/.env`
- Test SMTP connection:
  ```bash
  telnet smtp.hostinger.com 587
  ```
  Should connect (Ctrl+C to exit)

### Step 8.6: Test Contact Form

1. Go to: `https://yourdomain.com/contact`
2. Fill out form:
   - Name: Test User
   - Email: test@example.com
   - Age: 12
   - Subject: General Question
   - Message: This is a test message
3. Submit

**Verify:**
- Success message appears
- Admin receives email notification
- Check MongoDB collection: `contactsubmissions`

### Step 8.7: Performance Check

**Check PM2 status:**
```bash
pm2 status
```

**Should show:**
- Both instances: `status: online`
- CPU: < 50%
- Memory: < 400M per instance

**Check system resources:**
```bash
htop
```

**Look for:**
- CPU usage < 80%
- Memory usage < 80%
- No swap usage

Press `q` to exit

**Check disk space:**
```bash
df -h
```

**Should show:** At least 20% free space on `/`

**✅ Phase 8 Complete!** All systems tested and working.

---

## Phase 9: Post-Deployment

### Step 9.1: Configure Email Deliverability (SPF/DKIM)

**To ensure emails don't go to spam:**

**1. Add SPF Record to DNS:**

Go to: Hostinger → Domains → Your Domain → DNS

Add TXT Record:
- Type: `TXT`
- Name: `@`
- Content: `v=spf1 include:smtp.hostinger.com ~all`
- TTL: `14400`

**2. Add DKIM Record:**

Go to: Hostinger → Emails → Your Email → DKIM

Copy the DKIM record shown

Add to DNS as TXT record:
- Type: `TXT`
- Name: (as shown in DKIM panel, usually `default._domainkey`)
- Content: (the DKIM public key)
- TTL: `14400`

**Wait 24-48 hours for DNS propagation**

**Verify SPF:**
```bash
dig yourdomain.com TXT
```

Should show your SPF record

### Step 9.2: MongoDB Atlas IP Whitelist

**For better security:**

1. Log into MongoDB Atlas
2. Go to Network Access
3. Remove `0.0.0.0/0` if present (allows all IPs)
4. Click "Add IP Address"
5. Enter your VPS IP address (get with `curl ifconfig.me`)
6. Click "Confirm"

**Test connection still works:**
```bash
pm2 restart kids-competition-api
pm2 logs kids-competition-api --lines 20
```

Should show: `Connected to MongoDB` (no errors)

### Step 9.3: Setup Monitoring

**Install htop for easier monitoring:**
```bash
sudo apt-get install -y htop
```

**Monitor system:**
```bash
htop
```

**Monitor PM2:**
```bash
pm2 monit
```

**Check logs regularly:**
```bash
# Application logs
pm2 logs kids-competition-api

# Nginx error logs
sudo tail -f /var/log/nginx/kids-competition-error.log

# Nginx access logs
sudo tail -f /var/log/nginx/kids-competition-access.log
```

### Step 9.4: Create Backup Script (Optional)

**Create backup directory:**
```bash
sudo mkdir -p /backup/kids-competition
```

**Create backup script:**
```bash
sudo nano /usr/local/bin/backup-kids-competition.sh
```

**Paste:**
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backup/kids-competition"

# Backup application files
tar -czf $BACKUP_DIR/app-$DATE.tar.gz /var/www/kids-competition \
    --exclude=node_modules \
    --exclude=dist \
    --exclude=logs

# Keep only last 7 days
find $BACKUP_DIR -type f -mtime +7 -delete

echo "Backup completed: $DATE"
```

**Save and make executable:**
```bash
sudo chmod +x /usr/local/bin/backup-kids-competition.sh
```

**Test backup:**
```bash
sudo /usr/local/bin/backup-kids-competition.sh
```

**Setup daily backup (2 AM):**
```bash
sudo crontab -e
```

**Choose editor (nano = 1), then add:**
```
0 2 * * * /usr/local/bin/backup-kids-competition.sh
```

Save and exit

### Step 9.5: Document Your Credentials

**Create a secure document (NOT on the server) with:**

```
KIDS WEB COMPETITION - VPS CREDENTIALS
======================================

VPS Access:
- IP: __________________
- Username: ____________
- Password: ____________

Domain:
- Domain: ______________
- DNS Provider: Hostinger

MongoDB Atlas:
- URL: https://cloud.mongodb.com
- Email: _______________
- Connection String: _______________

Cloudinary:
- URL: https://cloudinary.com
- Cloud Name: __________
- API Key: _____________
- API Secret: __________

Hostinger Email:
- Email: noreply@__________
- Password: ____________

SSL Certificate:
- Issued: ______________
- Expires: _____________
- Auto-renew: Yes (via certbot)

Important Files on VPS:
- Backend .env: /var/www/kids-competition/backend/.env
- Frontend .env: /var/www/kids-competition/.env
- Nginx config: /etc/nginx/sites-available/kids-competition
- PM2 config: /var/www/kids-competition/backend/ecosystem.config.js
```

**Store this securely in password manager or encrypted file**

### Step 9.6: Final Security Checklist

Run through this checklist:

```bash
# 1. Check firewall
sudo ufw status
# Should show: OpenSSH, Nginx Full only

# 2. Check .env permissions
ls -la /var/www/kids-competition/backend/.env
# Should show: -rw------- (600)

# 3. Check PM2 is running
pm2 status
# Should show: 2 instances online

# 4. Check Nginx is running
sudo systemctl status nginx
# Should show: active (running)

# 5. Check SSL certificate
sudo certbot certificates
# Should show: valid, not expired

# 6. Check for system updates
sudo apt-get update
sudo apt-get upgrade -y

# 7. Test HTTPS
curl -I https://yourdomain.com
# Should show: HTTP/2 200

# 8. Check logs for errors
pm2 logs kids-competition-api --err --lines 100
# Should show: no recent errors
```

**✅ Phase 9 Complete!** Post-deployment configuration finished.

---

## 🎉 DEPLOYMENT COMPLETE!

### Your application is now live at:
```
https://yourdomain.com
```

### Quick Reference Commands

**Check Application Status:**
```bash
pm2 status                    # Backend status
sudo systemctl status nginx   # Nginx status
htop                         # System resources
```

**View Logs:**
```bash
pm2 logs kids-competition-api                      # Application logs
sudo tail -f /var/log/nginx/kids-competition-error.log  # Nginx errors
```

**Restart Services:**
```bash
pm2 restart kids-competition-api   # Restart backend
pm2 reload kids-competition-api    # Zero-downtime restart
sudo systemctl reload nginx         # Reload Nginx
```

**Update Application:**
```bash
# Backend
cd /var/www/kids-competition/backend
git pull
npm install --production
pm2 restart kids-competition-api

# Frontend
cd /var/www/kids-competition
git pull
npm install
npm run build
```

### Support & Troubleshooting

If you encounter issues, check:

1. **Application Logs:**
   ```bash
   pm2 logs kids-competition-api --lines 100
   ```

2. **Nginx Logs:**
   ```bash
   sudo tail -n 100 /var/log/nginx/kids-competition-error.log
   ```

3. **System Resources:**
   ```bash
   htop
   df -h
   free -h
   ```

4. **Verify Services:**
   ```bash
   curl http://localhost:3000/api/health  # Backend
   curl https://yourdomain.com/api/health # Through Nginx
   ```

### Next Steps

1. **Test thoroughly** with real user registrations
2. **Monitor logs** for first few days
3. **Setup email alerts** for errors (optional)
4. **Create backups** regularly
5. **Update competition dates** as needed in .env files

**Congratulations on your successful deployment! 🚀**
