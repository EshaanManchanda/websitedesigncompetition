# Kids Web Competition Backend API

> Express.js + MongoDB backend for the Kids Web Design Competition platform

**Part of**: [Website Designing Competition Monorepo](../README.md)
**Documentation**: [Backend Deployment Guide](../docs/deployment/HOSTINGER_VPS_DEPLOYMENT.md)

## Tech Stack

- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **File Storage:** Cloudinary
- **Email:** Nodemailer (SMTP)
- **Validation:** express-validator
- **Security:** Helmet, CORS, rate limiting

---

## Architecture Overview

### Request Flow

```
Client Request
    ↓
[Nginx Reverse Proxy] (production)
    ↓
[Express.js Server]
    ↓
[Security Middleware]
├── Helmet (security headers)
├── CORS (cross-origin)
└── Rate Limiting
    ↓
[Request Processing]
├── Body Parser
├── File Upload (Multer)
└── Request Validation
    ↓
[Route Handlers]
├── /api/health
├── /api/registrations
└── /api/contact
    ↓
[Business Logic]
├── Database Operations (Mongoose)
├── File Upload (Cloudinary)
└── Email Service (Nodemailer)
    ↓
[Response]
└── JSON with standard format
```

### Directory Structure

```
backend/
├── src/
│   ├── routes/          # API route handlers
│   │   ├── contact.js      # Contact form endpoints
│   │   ├── health.js       # Health check endpoint
│   │   └── registration.js # Registration endpoints
│   ├── models/          # Mongoose schemas
│   │   ├── Registration.js # Registration data model
│   │   └── Contact.js      # Contact submission model
│   ├── middleware/      # Express middleware
│   │   ├── fileUpload.js   # Multer configuration
│   │   └── validation.js   # Input validation rules
│   ├── utils/           # Utility functions
│   │   ├── cloudinary.js   # Cloudinary integration
│   │   └── email.js        # Email service
│   ├── templates/       # Email templates
│   │   └── emails/         # HTML email templates
│   └── server.js        # Application entry point
├── logs/               # Application logs
├── .env.example        # Environment template
└── package.json        # Dependencies
```

### Database Schema

#### Registration Collection

```javascript
{
  // Student Information
  firstName: String (required),
  lastName: String (required),
  email: String (required, unique, lowercase),
  age: String (required, enum: ['11-13', '14-17']),
  school: String (required),

  // Parent Information
  parentName: String (required),
  parentEmail: String (required, lowercase),
  parentPhone: String (optional),

  // Competition Details
  category: String (required, enum: ['11-13', '14-17']),
  experience: String (required, enum: ['beginner', 'intermediate', 'advanced']),

  // Project Submission
  submissionFile: {
    url: String (Cloudinary URL),
    publicId: String (Cloudinary ID),
    format: String (file extension),
    size: Number (bytes)
  },

  // Consent & Preferences
  agreeTerms: Boolean (required, must be true),
  agreeNewsletter: Boolean (default: false),

  // Metadata
  submittedAt: Date (default: Date.now),
  ipAddress: String (optional),
  userAgent: String (optional),

  // Status
  status: String (default: 'pending', enum: ['pending', 'approved', 'rejected'])
}
```

#### Contact Collection

```javascript
{
  name: String (required),
  email: String (required, lowercase),
  age: String (optional),
  subject: String (required, enum: [
    'general-question',
    'registration-help',
    'technical-support',
    'partnership',
    'other'
  ]),
  message: String (required, min: 10 chars),

  // Metadata
  submittedAt: Date (default: Date.now),
  ipAddress: String (optional),
  userAgent: String (optional),

  // Status
  replied: Boolean (default: false),
  repliedAt: Date (optional),
  notes: String (optional)
}
```

### API Response Format

All API responses follow this standard structure:

**Success Response:**
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data here
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message",
  "details": [
    // Optional validation errors or additional info
  ]
}
```

**HTTP Status Codes Used:**
- `200` - Success (GET, PUT)
- `201` - Created (POST)
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `409` - Conflict (duplicate email)
- `413` - Payload Too Large (file size)
- `429` - Too Many Requests (rate limit)
- `500` - Internal Server Error

---

## Prerequisites

- Node.js v18+ or v20 LTS
- MongoDB (local or MongoDB Atlas)
- Cloudinary account
- SMTP server (Hostinger or Mailtrap for dev)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Copy `.env.example` to `.env` and configure:
```bash
cp .env.example .env
```

3. Update `.env` with your credentials:
```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/kids_competition

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email (Hostinger)
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_USER=noreply@yourdomain.com
SMTP_PASSWORD=your-password
FROM_EMAIL=noreply@kidswebcomp.com
ADMIN_EMAIL=admin@kidswebcomp.com

# Frontend URL for CORS
FRONTEND_URL=http://localhost:5173
```

## Running Locally

### Development Mode
```bash
npm run dev
```

Server runs on `http://localhost:3000`

### Production Mode
```bash
npm start
```

## API Endpoints

### Health Check
- `GET /api/health` - Server health status

### Registration
- `POST /api/registrations` - Create new registration
- `GET /api/registrations/check-email/:email` - Check if email exists
- `GET /api/registrations` - Get all registrations (paginated)

### Contact
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get all contact submissions (paginated)

## Request Examples

### Register with File Upload

```bash
curl -X POST http://localhost:3000/api/registrations \
  -F "firstName=John" \
  -F "lastName=Doe" \
  -F "email=john@example.com" \
  -F "age=11-13" \
  -F "school=Test School" \
  -F "parentName=Jane Doe" \
  -F "parentEmail=jane@example.com" \
  -F "category=11-13" \
  -F "experience=beginner" \
  -F "agreeTerms=true" \
  -F "agreeNewsletter=false" \
  -F "submissionFile=@/path/to/project.zip"
```

### Submit Contact Form

```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "age": "12",
    "subject": "general-question",
    "message": "This is a test message with more than 10 characters."
  }'
```

## Deployment (Hostinger VPS)

### 1. Install Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 2. Install PM2
```bash
sudo npm install -g pm2
```

### 3. Install MongoDB (or use Atlas)
```bash
# For Atlas, just use connection string in .env
# For local MongoDB:
sudo apt-get install mongodb
```

### 4. Deploy Code
```bash
# Upload code to VPS
git clone <repository-url>
cd backend
npm install --production
```

### 5. Configure Environment
```bash
# Create .env file with production values
nano .env
```

### 6. Start with PM2
```bash
# Navigate to PM2 config directory
cd ../deployment/pm2

# Start backend with PM2
pm2 start backend-ecosystem.config.js

# Save PM2 process list
pm2 save

# Configure PM2 to start on boot
pm2 startup
```

**See**: [VPS Deployment Guide](../docs/deployment/HOSTINGER_VPS_DEPLOYMENT.md) for complete deployment instructions.

### 7. Configure Nginx
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        client_max_body_size 51M;
    }
}
```

### 8. Setup SSL with Let's Encrypt
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d api.yourdomain.com
```

## Monitoring & Logging

### PM2 Process Management

**Status and Monitoring:**
```bash
# Check application status
pm2 status

# Real-time monitoring (CPU, memory)
pm2 monit

# Detailed process information
pm2 show kids-competition-api

# List all processes
pm2 list
```

**Process Control:**
```bash
# Restart application
pm2 restart kids-competition-api

# Reload with zero downtime
pm2 reload kids-competition-api

# Stop application
pm2 stop kids-competition-api

# Delete from PM2
pm2 delete kids-competition-api

# Restart all processes
pm2 restart all
```

**Log Management:**
```bash
# View live logs (all instances)
pm2 logs kids-competition-api

# View last 50 lines
pm2 logs kids-competition-api --lines 50

# View error logs only
pm2 logs kids-competition-api --err

# View output logs only
pm2 logs kids-competition-api --out

# Clear all logs
pm2 flush
```

### Application Logs

**Log Files:**
```bash
# Standard output log
tail -f logs/out.log
tail -n 100 logs/out.log  # Last 100 lines

# Error log
tail -f logs/err.log
grep -i error logs/err.log  # Search for errors

# Combined view
tail -f logs/*.log
```

**Log Rotation:**
- Logs are automatically rotated by PM2
- Configured in `deployment/pm2/backend-ecosystem.config.js`
- Max file size: 10MB
- Retention: 7 days

### What Gets Logged

**Application Events:**
- Server startup/shutdown
- MongoDB connection status
- API requests (method, path, status, duration)
- File uploads (size, type, Cloudinary response)
- Email sending (success/failure)
- Validation errors
- Database errors
- Rate limit violations

**Error Logging:**
- Stack traces (development only)
- Error messages (sanitized in production)
- Request context (IP, user agent)
- Timestamp and severity level

**Not Logged (Security):**
- Passwords or sensitive credentials
- Full email addresses (hashed in production)
- Cloudinary API secrets
- SMTP passwords
- MongoDB connection strings

### Performance Monitoring

**Resource Usage:**
```bash
# System resource monitoring
htop

# Disk usage
df -h

# Memory usage
free -h

# Check Node.js process
ps aux | grep node

# Network connections
netstat -tulpn | grep :5050
```

**PM2 Metrics:**
```bash
# Enable PM2 monitoring (optional)
pm2 install pm2-logrotate

# Configure log rotation
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### Health Checks

**API Health Endpoint:**
```bash
# Check backend health
curl http://localhost:5050/api/health

# Expected response:
{
  "status": "healthy",
  "timestamp": "2025-12-29T10:00:00.000Z",
  "uptime": 3600,
  "environment": "production"
}
```

**Automated Monitoring:**
- Set up external monitoring (UptimeRobot, Pingdom)
- Monitor `/api/health` endpoint every 5 minutes
- Alert on 3 consecutive failures
- Check response time < 1000ms

### Troubleshooting Logs

**Common Issues:**

1. **MongoDB Connection Errors:**
   ```bash
   grep -i "mongodb" logs/err.log
   # Check for: connection refused, authentication failed
   ```

2. **Cloudinary Upload Errors:**
   ```bash
   grep -i "cloudinary" logs/err.log
   # Check for: invalid credentials, quota exceeded
   ```

3. **Email Sending Errors:**
   ```bash
   grep -i "smtp\|email" logs/err.log
   # Check for: authentication failed, connection timeout
   ```

4. **Rate Limit Violations:**
   ```bash
   grep -i "rate limit" logs/out.log
   # Shows IPs hitting rate limits
   ```

**See Also**: [Quick Reference Guide](../docs/setup/QUICK_REFERENCE.md) for more monitoring commands.

## Security Features

### Security Middleware

1. **Helmet.js** - HTTP Security Headers
   - Sets secure HTTP headers
   - Prevents clickjacking (X-Frame-Options)
   - Enables XSS protection
   - Prevents MIME sniffing
   - Enforces HTTPS (HSTS)

2. **CORS** - Cross-Origin Resource Sharing
   - Configured allowed origins (frontend URL)
   - Credentials support enabled
   - Preflight request handling
   - Production: Restricted to specific domains
   - Development: Localhost allowed

3. **Rate Limiting** - DDoS Protection
   - **Registration**: 5 requests per 15 minutes per IP
   - **Contact Form**: 10 requests per 15 minutes per IP
   - **General API**: 100 requests per 15 minutes per IP
   - Prevents brute force attacks
   - Configurable limits per endpoint

4. **Input Validation** - express-validator
   - Email format validation
   - Required field checks
   - String length limits
   - Enum value validation
   - Sanitization (trim, lowercase)

5. **File Upload Security**
   - **Size Limit**: 50MB maximum
   - **MIME Type Validation**: Whitelist approach
   - **Magic Number Verification**: File signature check
   - **Virus Scanning**: Cloudinary automatic scan
   - **Allowed Types**: ZIP, PDF, DOC, DOCX, PPT, PPTX, PNG, JPG, GIF, WebP, SVG
   - **Unique Filenames**: Auto-generated to prevent conflicts

6. **MongoDB Injection Prevention**
   - Mongoose query sanitization
   - Schema validation
   - No raw query execution
   - Parameterized queries only

7. **Environment Variable Protection**
   - `.env` file permissions (600)
   - No secrets in code
   - Separate dev/prod configurations
   - Git-ignored sensitive files

### Security Best Practices Implemented

- **HTTPS Only** in production (enforced by Nginx)
- **Secure Cookies** (HttpOnly, Secure flags when implemented)
- **Content Security Policy** (via Helmet)
- **No Exposed Error Details** in production
- **Regular Dependency Updates** (npm audit)
- **Logging Without PII** (no passwords/sensitive data logged)

## File Upload Limits

- **Max Size:** 50MB (configurable)
- **Allowed Types:** ZIP, PDF, DOC, DOCX, PPT, PPTX, PNG, JPG, GIF, WebP, SVG
- **Validation:** MIME type + magic number verification

## Email Templates

Templates are located in `src/templates/emails/`:
- `student_confirmation.html` - Student welcome email
- `parent_confirmation.html` - Parent notification
- `admin_notification.html` - Admin registration alert
- `contact_admin.html` - Contact form notification

## Environment Variables

See `.env.example` for all required variables.

## Troubleshooting

### MongoDB Connection Issues
```bash
# Check MongoDB is running
sudo systemctl status mongodb

# Check connection string in .env
```

### Email Not Sending
```bash
# Verify SMTP credentials
# Check logs for email errors
# Test with Mailtrap in development
```

### File Upload Issues
```bash
# Check Cloudinary credentials
# Verify file size limits
# Check MIME type validation
```

---

## Related Documentation

- **[Root README](../README.md)** - Project overview and quick start
- **[Frontend README](../frontend/README.md)** - Frontend development guide
- **[VPS Deployment](../docs/deployment/HOSTINGER_VPS_DEPLOYMENT.md)** - Complete deployment guide
- **[Environment Variables](../docs/setup/ENVIRONMENT_VARIABLES.md)** - Environment configuration
- **[Quick Reference](../docs/setup/QUICK_REFERENCE.md)** - Common commands and operations
- **[Documentation Index](../docs/README.md)** - All project documentation

---

## License

**© 2025 Website Designing Competition. All Rights Reserved.**

This is proprietary software. Unauthorized copying, modification, distribution, or use of this software is strictly prohibited.
