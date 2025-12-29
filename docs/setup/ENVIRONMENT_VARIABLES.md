# Environment Variables Setup Guide

This guide explains how to configure environment variables for the Kids Web Competition project.

## Overview

With the monorepo structure, environment variables are organized by workspace:

- **Frontend** (`/frontend/.env`) - React/Vite application variables
- **Backend** (`/backend/.env`) - Express.js API variables

## Frontend Environment Variables

### Location
`frontend/.env`

### Setup

1. **Copy the example file**:
   ```bash
   cp frontend/.env.example frontend/.env
   ```

2. **Edit the file** with your configuration:
   ```bash
   # On Windows
   notepad frontend\.env

   # On Mac/Linux
   nano frontend/.env
   ```

### Required Variables

```bash
# Backend API URL
VITE_API_URL=http://localhost:5050/api

# Competition Configuration
VITE_COMPETITION_YEAR=2026
VITE_REGISTRATION_OPEN_DATE=2025-12-01
VITE_REGISTRATION_CLOSE_DATE=2026-03-15T23:59:59
VITE_SUBMISSION_DEADLINE=2026-03-31T23:59:59
VITE_RESULTS_ANNOUNCEMENT_DATE=2026-04-15

# File Upload
VITE_MAX_FILE_SIZE_MB=50
```

### Optional Variables

```bash
# Enable route messaging for development debugging
VITE_ENABLE_ROUTE_MESSAGING=true

# CDN Configuration (production only)
CDN_IMG_PREFIX=https://cdn.example.com
CDN_IMG_DEBUG=0
```

### Important Notes

- **VITE_ Prefix Required**: All frontend variables MUST be prefixed with `VITE_` to be accessible in the browser
- **Build Time**: Environment variables are embedded at build time, not runtime
- **Public Exposure**: Frontend variables are visible in the browser - never store secrets here
- **Date Format**: Use ISO 8601 format (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss)

### Development vs Production

**Development** (frontend/.env):
```bash
VITE_API_URL=http://localhost:5050/api
```

**Production** (set in deployment platform or frontend/.env.production):
```bash
VITE_API_URL=https://websitedesigningcompetition.com/api
```

## Backend Environment Variables

### Location
`backend/.env`

### Setup

1. **Copy the example file**:
   ```bash
   cp backend/.env.example backend/.env
   ```

2. **Configure required variables**:
   ```bash
   # Server Configuration
   NODE_ENV=development
   PORT=5050

   # MongoDB
   MONGODB_URI=mongodb://localhost:27017/kids-competition

   # Cloudinary (File Storage)
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret

   # Email (Nodemailer)
   SMTP_HOST=smtp.example.com
   SMTP_PORT=587
   SMTP_USER=your-email@example.com
   SMTP_PASSWORD=your-password
   SMTP_FROM_EMAIL=noreply@example.com

   # Admin
   ADMIN_EMAIL=admin@example.com
   ```

### Security Best Practices

- **Never commit** `.env` files to git (they're git-ignored)
- **Use strong passwords** for database and email
- **Rotate secrets** regularly in production
- **Use environment-specific** files (.env.development, .env.production)

## Environment Files Overview

```
kids_web_competition/
├── .env.example              # Root monorepo reference
├── frontend/
│   ├── .env                  # Frontend config (git-ignored)
│   ├── .env.example          # Frontend template
│   └── .env.production       # Frontend production (optional)
└── backend/
    ├── .env                  # Backend config (git-ignored)
    ├── .env.example          # Backend template
    └── .env.production       # Backend production (optional)
```

## Platform-Specific Configuration

### Vercel

Set environment variables in the Vercel dashboard:
1. Go to Project Settings → Environment Variables
2. Add each `VITE_*` variable
3. Select appropriate environments (Production, Preview, Development)

### Netlify

Set environment variables in the Netlify dashboard:
1. Go to Site Settings → Environment Variables
2. Add each `VITE_*` variable
3. Deploy to apply changes

### VPS Deployment

1. **Frontend**: Build with local `.env` file, upload dist folder
2. **Backend**: Upload `.env` file to server via SCP:
   ```bash
   scp backend/.env root@YOUR_VPS:/var/www/kids-competition/backend/
   ```

## Troubleshooting

### Variables Not Loading

**Problem**: `import.meta.env.VITE_API_URL` is undefined

**Solutions**:
1. Ensure variable is prefixed with `VITE_`
2. Restart the dev server after adding variables
3. Check the file is named exactly `.env` (not `.env.txt`)
4. Ensure the file is in the correct directory (`frontend/.env`)

### API URL Incorrect

**Problem**: API calls go to wrong URL

**Solution**: Update `VITE_API_URL` in `frontend/.env`:
```bash
# Development
VITE_API_URL=http://localhost:5050/api

# Production
VITE_API_URL=https://your-domain.com/api
```

### Backend Can't Connect to Database

**Problem**: MongoDB connection fails

**Solutions**:
1. Check `MONGODB_URI` in `backend/.env`
2. Ensure MongoDB is running locally or check connection string
3. Verify network access if using MongoDB Atlas
4. Check firewall rules

### Email Not Sending

**Problem**: Registration emails not being sent

**Solutions**:
1. Verify SMTP credentials in `backend/.env`
2. Check SMTP host and port are correct
3. Test with a tool like Mailtrap for development
4. Ensure "Less secure app access" is enabled (if using Gmail)

## Quick Setup Commands

### For New Developers

```bash
# 1. Clone repository
git clone <repository-url>
cd kids_web_competition

# 2. Install dependencies
npm install

# 3. Set up environment files
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env

# 4. Edit environment files with your configuration
# Edit frontend/.env
# Edit backend/.env

# 5. Start development
npm run dev
```

### For CI/CD

```bash
# Build with environment variables from CI platform
npm run build:frontend

# Or build with specific env file
npm run build:frontend --mode production
```

## Environment Variable Reference

### Frontend (VITE_ prefixed)

| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| `VITE_API_URL` | String | Yes | Backend API endpoint |
| `VITE_COMPETITION_YEAR` | Number | Yes | Competition year |
| `VITE_REGISTRATION_OPEN_DATE` | Date | Yes | Registration start date |
| `VITE_REGISTRATION_CLOSE_DATE` | DateTime | Yes | Registration end date |
| `VITE_SUBMISSION_DEADLINE` | DateTime | Yes | Submission deadline |
| `VITE_RESULTS_ANNOUNCEMENT_DATE` | Date | Yes | Results date |
| `VITE_MAX_FILE_SIZE_MB` | Number | Yes | Max upload size (MB) |
| `VITE_ENABLE_ROUTE_MESSAGING` | Boolean | No | Enable route debugging |
| `CDN_IMG_PREFIX` | String | No | CDN URL for images |

### Backend

| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| `NODE_ENV` | String | Yes | Environment (development/production) |
| `PORT` | Number | Yes | Server port (default: 5050) |
| `MONGODB_URI` | String | Yes | MongoDB connection string |
| `CLOUDINARY_CLOUD_NAME` | String | Yes | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | String | Yes | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | String | Yes | Cloudinary API secret |
| `SMTP_HOST` | String | Yes | SMTP server host |
| `SMTP_PORT` | Number | Yes | SMTP server port |
| `SMTP_USER` | String | Yes | SMTP username |
| `SMTP_PASSWORD` | String | Yes | SMTP password |
| `SMTP_FROM_EMAIL` | String | Yes | From email address |
| `ADMIN_EMAIL` | String | Yes | Admin notification email |

## Additional Resources

- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Node.js Environment Variables](https://nodejs.org/en/learn/command-line/how-to-read-environment-variables-from-nodejs)
- [dotenv Package Documentation](https://github.com/motdotla/dotenv)

---

**Last Updated**: 2025-12-29
