# Deployment

This directory contains all deployment configurations, scripts, and platform-specific settings for the Kids Web Competition project.

## Directory Structure

```
deployment/
├── nginx/          # Nginx web server configurations
├── pm2/            # PM2 process manager configurations
├── vercel/         # Vercel deployment settings
├── netlify/        # Netlify deployment settings
├── scripts/        # Deployment automation scripts
└── README.md       # This file
```

## Nginx Configurations (`nginx/`)

Web server configurations for production deployments:

- `nginx-kids-competition.conf` - Configuration for websitedesigningcompetition.com
- `nginx-website-design.conf` - Alternative configuration with SSL
- `nginx-kidrove.conf` - Configuration for Kidrove project
- `nginx-multi-region.conf` - Multi-region deployment configuration

### Usage

```bash
# Upload to VPS
scp deployment/nginx/nginx-kids-competition.conf root@YOUR_VPS_IP:~/

# Install on server
sudo mv ~/nginx-kids-competition.conf /etc/nginx/sites-available/kids-competition
sudo ln -s /etc/nginx/sites-available/kids-competition /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## PM2 Configurations (`pm2/`)

Process manager configurations for Node.js backend:

- `backend-ecosystem.config.js` - Kids Competition backend (port 5050)
- `kidrove-ecosystem.config.js` - Kidrove backend (port 5001)

### Usage

```bash
# Start backend with PM2
pm2 start deployment/pm2/backend-ecosystem.config.js

# View logs
pm2 logs kids-competition-api

# Monitor
pm2 monit

# Stop/restart
pm2 stop kids-competition-api
pm2 restart kids-competition-api
```

## Platform Deployments

### Vercel (`vercel/`)

Automated deployments to Vercel platform.

**Configuration**: `vercel.json`
- Build command: `npm run build --workspace=frontend`
- Output directory: `frontend/dist`

**Deploy**:
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel deploy

# Production deploy
vercel --prod
```

### Netlify (`netlify/`)

Automated deployments to Netlify platform.

**Configuration**: `netlify.toml`
- Build command: `npm run build --workspace=frontend`
- Publish directory: `frontend/dist`

**Deploy**:
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy

# Production deploy
netlify deploy --prod
```

## Deployment Scripts (`scripts/`)

Automation scripts for VPS deployment:

- `DEPLOY_VPS.sh` - Main deployment script for VPS
- `vps-setup.sh` - Initial VPS setup script

### DEPLOY_VPS.sh

Comprehensive deployment script that:
1. Creates backups
2. Stops current services
3. Configures backend
4. Verifies frontend build
5. Starts services with PM2
6. Performs health checks

**Usage**:
```bash
# On VPS server
bash deployment/scripts/DEPLOY_VPS.sh
```

## Deployment Documentation

Detailed deployment guides are available in `/docs/deployment/`:

- `DEPLOYMENT_GUIDE.md` - General deployment guide
- `DEPLOYMENT_CHECKLIST.md` - Pre-deployment checklist
- `DEPLOYMENT_INSTRUCTIONS.md` - Step-by-step instructions
- `HOSTINGER_VPS_DEPLOYMENT.md` - Hostinger VPS specific guide
- `NGINX_INSTALLATION_GUIDE.md` - Nginx setup guide

## Quick Reference

### Frontend Build

```bash
# From project root
npm run build:frontend

# Output: frontend/dist/
```

### Backend Start

```bash
# Development
npm run dev:backend

# Production with PM2
pm2 start deployment/pm2/backend-ecosystem.config.js
```

### Full Deployment Workflow

1. **Build frontend locally**
   ```bash
   npm run build:frontend
   ```

2. **Upload files to VPS**
   ```bash
   rsync -avz --exclude 'node_modules' ./ root@YOUR_VPS:/var/www/kids-competition/
   ```

3. **SSH into VPS**
   ```bash
   ssh root@YOUR_VPS
   ```

4. **Run deployment script**
   ```bash
   cd /var/www/kids-competition
   bash deployment/scripts/DEPLOY_VPS.sh
   ```

5. **Verify deployment**
   ```bash
   pm2 status
   pm2 logs
   curl http://localhost:5050/api/health
   ```

## Environment Variables

Ensure environment variables are configured:
- Backend: `/backend/.env`
- Frontend: `/frontend/.env` (if needed)

## Security Notes

- Never commit `.env` files
- Use SSL certificates in production (Let's Encrypt recommended)
- Configure firewall rules (allow ports 80, 443, 22)
- Regular security updates on VPS
- Use strong passwords and SSH keys

## Troubleshooting

### PM2 process not starting
```bash
pm2 logs kids-competition-api
pm2 describe kids-competition-api
```

### Nginx errors
```bash
sudo nginx -t
sudo tail -f /var/log/nginx/error.log
```

### Port conflicts
```bash
sudo lsof -i :5050
sudo netstat -tulpn | grep :5050
```

## Support

For issues or questions, refer to the detailed documentation in `/docs/deployment/` or check the main project README.
