#!/bin/bash
#
# VPS Deployment Script for Website Design Competition & Kidrove
# This script should be run on the VPS server: root@93.127.185.245
#
# Usage: bash DEPLOY_VPS.sh
#

set -e  # Exit on error

echo "=========================================="
echo "Dual Project VPS Deployment"
echo "=========================================="
echo ""
echo "This will deploy:"
echo "1. Website Design Competition (websitedesigningcompetition.com) - Port 5050"
echo "2. Kidrove (kidrove.com/in/ae) - Port 5001"
echo ""
read -p "Continue? (yes/no): " -r
if [[ ! $REPLY =~ ^[Yy]es$ ]]; then
    echo "Deployment cancelled."
    exit 1
fi

# ====================
# 1. Pre-Deployment Backup
# ====================
echo ""
echo "[1/9] Creating backup..."
BACKUP_DIR="/backup/deployment-$(date +%Y%m%d-%H%M%S)"
mkdir -p $BACKUP_DIR

# Backup nginx configs
cp -r /etc/nginx/sites-available $BACKUP_DIR/ 2>/dev/null || echo "  No nginx sites-available to backup"
cp -r /etc/nginx/sites-enabled $BACKUP_DIR/ 2>/dev/null || echo "  No nginx sites-enabled to backup"

# Backup PM2 state
pm2 save 2>/dev/null || echo "  No PM2 processes to save"
pm2 list > $BACKUP_DIR/pm2-processes.txt 2>/dev/null || echo "  No PM2 processes"

# Backup .env files
cp /var/www/websitedesigncompetition/backend/.env $BACKUP_DIR/website-design-env.bak 2>/dev/null || echo "  No website-design .env to backup"
cp /var/www/GEMA-Project/backend/.env $BACKUP_DIR/kidrove-env.bak 2>/dev/null || echo "  No kidrove .env to backup"

echo "  Backup created at: $BACKUP_DIR"

# ====================
# 2. Stop Current Services
# ====================
echo ""
echo "[2/9] Stopping current services..."
pm2 stop all 2>/dev/null || echo "  No PM2 processes to stop"
pm2 delete all 2>/dev/null || echo "  No PM2 processes to delete"
echo "  Services stopped"

# ====================
# 3. Configure Website Design Competition
# ====================
echo ""
echo "[3/9] Configuring Website Design Competition..."

cd /var/www/websitedesigncompetition/backend

# Verify ecosystem.config.js exists
if [ ! -f "ecosystem.config.js" ]; then
    echo "  ERROR: ecosystem.config.js not found!"
    echo "  Please upload updated ecosystem.config.js first"
    exit 1
fi

# Check if PORT is 5050 in ecosystem.config.js
if grep -q "PORT: 5050" ecosystem.config.js; then
    echo "  ✓ ecosystem.config.js configured for port 5050"
else
    echo "  WARNING: ecosystem.config.js may not be configured for port 5050"
    echo "  Current PORT setting:"
    grep -A 2 "env:" ecosystem.config.js | grep PORT
fi

# Verify .env exists
if [ ! -f ".env" ]; then
    echo "  ERROR: .env file not found!"
    echo "  Please upload .env file with credentials"
    exit 1
fi

# Check if PORT is 5050 in .env
if grep -q "PORT=5050" .env; then
    echo "  ✓ .env configured for port 5050"
else
    echo "  WARNING: .env may not be configured for port 5050"
    echo "  Current PORT setting:"
    grep "^PORT=" .env || echo "  PORT not found in .env"
fi

# Create logs directory
mkdir -p logs
chmod 755 logs
echo "  ✓ Logs directory created"

# Verify dist folder exists
if [ -d "/var/www/websitedesigncompetition/dist" ]; then
    echo "  ✓ Frontend dist/ folder found"
else
    echo "  ERROR: Frontend dist/ folder not found!"
    echo "  Please build and upload frontend first"
    exit 1
fi

# ====================
# 4. Configure Kidrove
# ====================
echo ""
echo "[4/9] Configuring Kidrove..."

cd /var/www/GEMA-Project

# Determine frontend type
if [ -d "dist" ]; then
    KIDROVE_FRONTEND="static"
    echo "  ✓ Kidrove has dist/ folder - using OPTION A (static files)"
else
    KIDROVE_FRONTEND="proxy"
    echo "  ✓ Kidrove has NO dist/ folder - using OPTION B (proxy to port 3000)"
fi

cd backend

# Create ecosystem.config.js if doesn't exist
if [ ! -f "ecosystem.config.js" ]; then
    echo "  WARNING: ecosystem.config.js not found"
    echo "  Please create it manually or upload kidrove-ecosystem.config.js"
    echo ""
    echo "  PRESS ENTER to continue if you'll create it manually, or Ctrl+C to abort"
    read
else
    echo "  ✓ ecosystem.config.js found"
fi

# Check .env file
if [ ! -f ".env" ]; then
    echo "  ERROR: .env file not found!"
    echo "  Please create .env file for kidrove backend"
    exit 1
fi

# Check if PORT is 5001
if grep -q "PORT=5001" .env || grep -q "PORT = 5001" .env; then
    echo "  ✓ .env configured for port 5001"
else
    echo "  WARNING: .env may not be configured for port 5001"
    echo "  Current PORT setting:"
    grep "^PORT" .env || echo "  PORT not found in .env"
    echo ""
    echo "  IMPORTANT: Update PORT to 5001 in .env before continuing!"
    echo "  PRESS ENTER to continue, or Ctrl+C to abort and fix"
    read
fi

# Create logs directory
mkdir -p logs
chmod 755 logs
echo "  ✓ Logs directory created"

# ====================
# 5. Install Nginx Configurations
# ====================
echo ""
echo "[5/9] Installing Nginx configurations..."

# Check if nginx config files exist in /root or current directory
if [ -f "/root/nginx-website-design.conf" ]; then
    cp /root/nginx-website-design.conf /etc/nginx/sites-available/website-design
    echo "  ✓ Copied website-design nginx config"
elif [ -f "./nginx-website-design.conf" ]; then
    cp ./nginx-website-design.conf /etc/nginx/sites-available/website-design
    echo "  ✓ Copied website-design nginx config"
else
    echo "  ERROR: nginx-website-design.conf not found!"
    echo "  Please upload nginx-website-design.conf to /root/ or current directory"
    exit 1
fi

if [ -f "/root/nginx-kidrove.conf" ]; then
    cp /root/nginx-kidrove.conf /etc/nginx/sites-available/kidrove
    echo "  ✓ Copied kidrove nginx config"
elif [ -f "./nginx-kidrove.conf" ]; then
    cp ./nginx-kidrove.conf /etc/nginx/sites-available/kidrove
    echo "  ✓ Copied kidrove nginx config"
else
    echo "  ERROR: nginx-kidrove.conf not found!"
    echo "  Please upload nginx-kidrove.conf to /root/ or current directory"
    exit 1
fi

# Ensure server_names_hash_bucket_size is set
if grep -q "server_names_hash_bucket_size" /etc/nginx/nginx.conf; then
    echo "  ✓ server_names_hash_bucket_size already configured"
else
    echo "  Adding server_names_hash_bucket_size to nginx.conf..."
    sed -i '/http {/a \    server_names_hash_bucket_size 64;' /etc/nginx/nginx.conf
    echo "  ✓ Added server_names_hash_bucket_size"
fi

# Enable sites
ln -sf /etc/nginx/sites-available/website-design /etc/nginx/sites-enabled/
ln -sf /etc/nginx/sites-available/kidrove /etc/nginx/sites-enabled/
echo "  ✓ Enabled website-design and kidrove sites"

# Remove default if exists
rm -f /etc/nginx/sites-enabled/default 2>/dev/null && echo "  ✓ Removed default site" || true

# Test nginx configuration
echo "  Testing nginx configuration..."
if nginx -t 2>&1 | tee /tmp/nginx-test.log; then
    echo "  ✓ Nginx configuration is valid"
else
    echo "  ERROR: Nginx configuration test failed!"
    cat /tmp/nginx-test.log
    echo ""
    echo "  Restoring backup..."
    cp -r $BACKUP_DIR/sites-available/* /etc/nginx/sites-available/
    cp -r $BACKUP_DIR/sites-enabled/* /etc/nginx/sites-enabled/
    exit 1
fi

# ====================
# 6. Start Backends with PM2
# ====================
echo ""
echo "[6/9] Starting backends with PM2..."

# Start website-design backend
echo "  Starting website-design backend..."
cd /var/www/websitedesigncompetition/backend
pm2 start ecosystem.config.js --env production
sleep 5

# Start kidrove backend
echo "  Starting kidrove backend..."
cd /var/www/GEMA-Project/backend
if [ -f "ecosystem.config.js" ]; then
    pm2 start ecosystem.config.js --env production
    sleep 5
else
    echo "  WARNING: Kidrove ecosystem.config.js not found, skipping PM2 start"
fi

# Check PM2 status
echo ""
echo "  PM2 Process Status:"
pm2 status

echo ""
echo "  Checking backend health..."
# Check website-design backend
if curl -f http://localhost:5050/api/health 2>/dev/null; then
    echo "  ✓ Website-design backend responding on port 5050"
else
    echo "  WARNING: Website-design backend not responding on port 5050"
    echo "  Check logs: pm2 logs kids-competition-api"
fi

# Check kidrove backend
if curl -f http://localhost:5001/api/health 2>/dev/null || curl -f http://localhost:5001/ 2>/dev/null; then
    echo "  ✓ Kidrove backend responding on port 5001"
else
    echo "  WARNING: Kidrove backend not responding on port 5001"
    echo "  Check logs: pm2 logs kidrove-api"
fi

# Save PM2 list
pm2 save
echo "  ✓ PM2 process list saved"

# ====================
# 7. Configure PM2 Startup
# ====================
echo ""
echo "[7/9] Configuring PM2 startup..."
pm2 startup systemd -u root --hp /root 2>&1 | grep -v "PM2" || true
echo "  ✓ PM2 startup configured"

# ====================
# 8. Start Nginx
# ====================
echo ""
echo "[8/9] Starting Nginx..."
systemctl reload nginx
systemctl status nginx --no-pager || true
echo "  ✓ Nginx reloaded"

# Test internally
echo ""
echo "  Testing through Nginx..."
if curl -f -H "Host: websitedesigningcompetition.com" http://localhost/api/health 2>/dev/null; then
    echo "  ✓ Website-design accessible through Nginx"
else
    echo "  WARNING: Website-design not accessible through Nginx"
fi

if curl -f -H "Host: kidrove.com" http://localhost/api/health 2>/dev/null || curl -f -H "Host: kidrove.com" http://localhost/ 2>/dev/null; then
    echo "  ✓ Kidrove accessible through Nginx"
else
    echo "  WARNING: Kidrove not accessible through Nginx"
fi

# ====================
# 9. SSL Setup Instructions
# ====================
echo ""
echo "[9/9] SSL Setup"
echo ""
echo "SSL certificates should be set up with Certbot."
echo "Run these commands manually:"
echo ""
echo "# Install certbot (if not already installed):"
echo "apt-get update && apt-get install -y certbot python3-certbot-nginx"
echo ""
echo "# Website Design Competition SSL:"
echo "certbot --nginx -d websitedesigningcompetition.com -d www.websitedesigningcompetition.com --non-interactive --agree-tos --email admin@websitedesigningcompetition.com --redirect"
echo ""
echo "# Kidrove SSL (all three domains):"
echo "certbot --nginx -d kidrove.com -d www.kidrove.com -d kidrove.in -d www.kidrove.in -d kidrove.ae -d www.kidrove.ae --non-interactive --agree-tos --email admin@kidrove.com --redirect"
echo ""

# ====================
# Completion
# ====================
echo ""
echo "=========================================="
echo "Deployment Complete!"
echo "=========================================="
echo ""
echo "Summary:"
echo "- Backup created at: $BACKUP_DIR"
echo "- Website Design: Backend on port 5050"
echo "- Kidrove: Backend on port 5001"
echo ""
echo "Next Steps:"
echo "1. Set up SSL certificates (see commands above)"
echo "2. Test websites:"
echo "   - https://websitedesigningcompetition.com"
echo "   - https://kidrove.com"
echo "   - https://kidrove.in"
echo "   - https://kidrove.ae"
echo "3. Monitor logs: pm2 logs"
echo "4. Check PM2 status: pm2 status"
echo ""
echo "Rollback (if needed):"
echo "  cp -r $BACKUP_DIR/sites-available/* /etc/nginx/sites-available/"
echo "  cp -r $BACKUP_DIR/sites-enabled/* /etc/nginx/sites-enabled/"
echo "  systemctl reload nginx"
echo ""
