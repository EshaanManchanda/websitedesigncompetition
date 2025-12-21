# Kids Web Competition Backend API

Express.js + MongoDB backend for the Kids Web Design Competition platform.

## Tech Stack

- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **File Storage:** Cloudinary
- **Email:** Nodemailer (SMTP)
- **Validation:** express-validator
- **Security:** Helmet, CORS, rate limiting

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
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

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

## Monitoring

### PM2 Commands
```bash
pm2 status              # Check status
pm2 logs               # View logs
pm2 monit              # Real-time monitoring
pm2 restart all        # Restart app
pm2 stop all           # Stop app
pm2 delete all         # Remove from PM2
```

### Check Logs
```bash
# Application logs
tail -f logs/out.log
tail -f logs/err.log

# PM2 logs
pm2 logs
```

## Security Features

- **Helmet.js** - HTTP headers security
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - Prevent abuse
- **Input Validation** - express-validator
- **File Validation** - MIME type, size, magic numbers
- **MongoDB Injection Prevention** - Mongoose sanitization

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

## License

MIT
