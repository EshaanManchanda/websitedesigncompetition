#!/bin/bash

###############################################################################
# Hostinger VPS KVM1 - Automated Setup Script
# Kids Web Competition Platform
#
# This script automates Phase 1 and Phase 2 of the deployment:
# - System updates
# - Installing Node.js, PM2, Nginx
# - Configuring firewall
#
# Usage:
#   1. Upload this script to your VPS
#   2. Make executable: chmod +x vps-setup.sh
#   3. Run: sudo ./vps-setup.sh
#
# Time: ~10-15 minutes
###############################################################################

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command succeeded
check_success() {
    if [ $? -eq 0 ]; then
        print_success "$1"
    else
        print_error "$2"
        exit 1
    fi
}

# Welcome message
clear
echo "=========================================="
echo "   Kids Web Competition - VPS Setup"
echo "=========================================="
echo ""
print_status "This script will install and configure:"
echo "  • System updates"
echo "  • Node.js 20 LTS"
echo "  • PM2 Process Manager"
echo "  • Nginx Web Server"
echo "  • UFW Firewall"
echo ""
print_warning "This will take 10-15 minutes. Press Ctrl+C to cancel."
echo ""
read -p "Press Enter to continue..."

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    print_error "Please run as root (use: sudo ./vps-setup.sh)"
    exit 1
fi

###############################################################################
# Phase 1: System Update
###############################################################################

echo ""
echo "=========================================="
echo "Phase 1: System Update"
echo "=========================================="
echo ""

print_status "Updating package lists..."
apt-get update -qq
check_success "Package lists updated" "Failed to update package lists"

print_status "Upgrading installed packages (this may take a few minutes)..."
DEBIAN_FRONTEND=noninteractive apt-get upgrade -y -qq
check_success "Packages upgraded" "Failed to upgrade packages"

print_status "Installing essential tools..."
apt-get install -y -qq curl wget git build-essential software-properties-common ufw nano vim
check_success "Essential tools installed" "Failed to install essential tools"

###############################################################################
# Phase 2: Install Node.js
###############################################################################

echo ""
echo "=========================================="
echo "Phase 2: Install Node.js 20 LTS"
echo "=========================================="
echo ""

print_status "Adding NodeSource repository..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash - > /dev/null 2>&1
check_success "NodeSource repository added" "Failed to add NodeSource repository"

print_status "Installing Node.js..."
apt-get install -y -qq nodejs
check_success "Node.js installed" "Failed to install Node.js"

# Verify Node.js installation
NODE_VERSION=$(node --version)
NPM_VERSION=$(npm --version)
print_success "Node.js version: $NODE_VERSION"
print_success "npm version: $NPM_VERSION"

###############################################################################
# Phase 3: Install PM2
###############################################################################

echo ""
echo "=========================================="
echo "Phase 3: Install PM2 Process Manager"
echo "=========================================="
echo ""

print_status "Installing PM2 globally..."
npm install -g pm2 > /dev/null 2>&1
check_success "PM2 installed" "Failed to install PM2"

PM2_VERSION=$(pm2 --version)
print_success "PM2 version: $PM2_VERSION"

###############################################################################
# Phase 4: Install Nginx
###############################################################################

echo ""
echo "=========================================="
echo "Phase 4: Install Nginx Web Server"
echo "=========================================="
echo ""

print_status "Installing Nginx..."
apt-get install -y -qq nginx
check_success "Nginx installed" "Failed to install Nginx"

print_status "Starting Nginx..."
systemctl start nginx
check_success "Nginx started" "Failed to start Nginx"

print_status "Enabling Nginx to start on boot..."
systemctl enable nginx > /dev/null 2>&1
check_success "Nginx enabled" "Failed to enable Nginx"

# Verify Nginx is running
if systemctl is-active --quiet nginx; then
    print_success "Nginx is running"
else
    print_error "Nginx is not running"
    exit 1
fi

###############################################################################
# Phase 5: Configure Firewall
###############################################################################

echo ""
echo "=========================================="
echo "Phase 5: Configure Firewall (UFW)"
echo "=========================================="
echo ""

print_status "Configuring firewall rules..."

# Allow SSH (important - do this first!)
ufw allow OpenSSH > /dev/null 2>&1
check_success "SSH access allowed" "Failed to allow SSH"

# Allow Nginx
ufw allow 'Nginx Full' > /dev/null 2>&1
check_success "HTTP/HTTPS access allowed" "Failed to allow Nginx"

# Enable firewall
print_status "Enabling firewall..."
ufw --force enable > /dev/null 2>&1
check_success "Firewall enabled" "Failed to enable firewall"

# Show firewall status
print_status "Firewall rules:"
ufw status

###############################################################################
# Phase 6: Create Application Directory
###############################################################################

echo ""
echo "=========================================="
echo "Phase 6: Create Application Directory"
echo "=========================================="
echo ""

print_status "Creating /var/www/kids-competition..."
mkdir -p /var/www/kids-competition
check_success "Directory created" "Failed to create directory"

# Set ownership (try to get the actual user who ran sudo)
ACTUAL_USER=${SUDO_USER:-$USER}
if [ "$ACTUAL_USER" != "root" ]; then
    print_status "Setting ownership to $ACTUAL_USER..."
    chown -R $ACTUAL_USER:$ACTUAL_USER /var/www/kids-competition
    check_success "Ownership set" "Failed to set ownership"
else
    print_warning "Running as root - skipping ownership change"
fi

###############################################################################
# Summary
###############################################################################

echo ""
echo "=========================================="
echo "         Installation Complete!"
echo "=========================================="
echo ""
print_success "All components installed successfully!"
echo ""
echo "Installed versions:"
echo "  • Node.js: $NODE_VERSION"
echo "  • npm: $NPM_VERSION"
echo "  • PM2: $PM2_VERSION"
echo "  • Nginx: $(nginx -v 2>&1 | cut -d'/' -f2)"
echo ""
echo "Next steps:"
echo "  1. Deploy your application code to: /var/www/kids-competition"
echo "  2. Configure backend .env file"
echo "  3. Build frontend"
echo "  4. Configure Nginx"
echo "  5. Setup SSL certificate"
echo ""
print_status "See HOSTINGER_VPS_DEPLOYMENT.md for detailed instructions"
echo ""

# Get server IP
SERVER_IP=$(curl -s ifconfig.me)
if [ ! -z "$SERVER_IP" ]; then
    echo "Your VPS IP address: $SERVER_IP"
    echo "Test Nginx: http://$SERVER_IP"
    echo ""
fi

print_success "Setup complete! You can now proceed with Phase 3 of the deployment."
echo ""
