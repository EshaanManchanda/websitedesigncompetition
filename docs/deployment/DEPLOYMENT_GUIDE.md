# Kids Web Competition - Deployment Guide

This guide will help you deploy the updated Kids Web Competition application with all new features.

## 🎯 Features Implemented

### 1. Dynamic Date Configuration
- All competition dates are now configurable via `.env` file
- Registration automatically opens/closes based on configured dates
- Consistent date display across all pages

### 2. File Upload System
- Students can upload project files (ZIP, PDF, PPTX, DOC, DOCX, images)
- Multi-layer security validation (MIME type, extension, magic numbers, file size)
- Files stored securely in Supabase Storage
- 50MB file size limit (configurable)

### 3. Email Notification System
- **Student confirmation email** with registration details and competition info
- **Parent/Guardian confirmation email** with parental guidance
- **Admin notification email** with complete registration data
- Supports both Mailtrap (development) and Hostinger (production) SMTP
- Fallback to parent email if student email not provided

### 4. Enhanced Security
- Environment variable validation on startup
- File upload security (sanitization, validation)
- Row-level security on database and storage

---

## 📋 Prerequisites

Before deploying, ensure you have:

1. **Supabase Account** - [Sign up at supabase.com](https://supabase.com)
2. **Mailtrap Account** (for development) - [Sign up at mailtrap.io](https://mailtrap.io)
3. **Hostinger Email/SMTP** (for production) - Your hosting email credentials
4. **Node.js** (v18 or higher)
5. **Supabase CLI** - Install with `npm install -g supabase`

---

## 🚀 Deployment Steps

### Step 1: Environment Configuration

1. **Copy the example environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Fill in your environment variables in `.env`:**
   ```env
   # Supabase Configuration
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key

   # Competition Dates
   VITE_COMPETITION_YEAR=2025
   VITE_REGISTRATION_OPEN_DATE=2025-01-01
   VITE_REGISTRATION_CLOSE_DATE=2025-03-15T23:59:59
   VITE_SUBMISSION_DEADLINE=2025-03-31T23:59:59
   VITE_RESULTS_ANNOUNCEMENT_DATE=2025-04-15

   # Email Configuration - Development (Mailtrap)
   VITE_SMTP_HOST_DEV=smtp.mailtrap.io
   VITE_SMTP_PORT_DEV=2525
   VITE_SMTP_USER_DEV=your-mailtrap-username
   VITE_SMTP_PASSWORD_DEV=your-mailtrap-password

   # Email Configuration - Production (Hostinger)
   VITE_SMTP_HOST_PROD=smtp.hostinger.com
   VITE_SMTP_PORT_PROD=587
   VITE_SMTP_USER_PROD=your@email.com
   VITE_SMTP_PASSWORD_PROD=your-password

   # Email Settings
   VITE_SMTP_FROM_EMAIL=noreply@kidswebcomp.com
   VITE_ADMIN_EMAIL=admin@kidswebcomp.com

   # File Upload Configuration
   VITE_MAX_FILE_SIZE_MB=50
   VITE_STORAGE_BUCKET_NAME=competition-submissions
   ```

---

### Step 2: Database Migration

1. **Log in to your Supabase project:**
   ```bash
   supabase login
   ```

2. **Link to your project:**
   ```bash
   supabase link --project-ref your-project-ref
   ```

3. **Run the migration:**
   - Open your Supabase dashboard → SQL Editor
   - Copy the contents of `supabase/migrations/001_add_file_uploads.sql`
   - Paste and run the SQL

4. **Verify the migration:**
   - Go to Database → Tables → `registrations`
   - Confirm these new columns exist:
     - `submission_file_url`
     - `submission_file_name`
     - `submission_file_size`
     - `submission_file_type`
     - `submission_uploaded_at`

---

### Step 3: Supabase Storage Setup

1. **Create the storage bucket:**
   - Go to Storage in Supabase dashboard
   - Click "New bucket"
   - Name: `competition-submissions`
   - Make it **Private** (not public)
   - Set file size limit: 52428800 bytes (50MB)

2. **Apply storage policies:**
   - Go to Storage → Policies
   - Copy contents of `supabase/storage_policies.sql`
   - Run in SQL Editor

---

### Step 4: Deploy Edge Function

1. **Navigate to Edge Functions directory:**
   ```bash
   cd supabase/functions
   ```

2. **Create `.env.local` file for Edge Function:**
   ```bash
   cp .env.example .env.local
   ```

3. **Fill in Edge Function environment variables:**
   ```env
   # For development (Mailtrap)
   SMTP_HOST_DEV=smtp.mailtrap.io
   SMTP_PORT_DEV=2525
   SMTP_USER_DEV=your-mailtrap-username
   SMTP_PASSWORD_DEV=your-mailtrap-password

   # For production (Hostinger)
   SMTP_HOST=smtp.hostinger.com
   SMTP_PORT=587
   SMTP_USER=your@email.com
   SMTP_PASSWORD=your-password

   FROM_EMAIL=noreply@kidswebcomp.com
   ADMIN_EMAIL=admin@kidswebcomp.com
   APP_ENV=development

   COMPETITION_YEAR=2025
   REGISTRATION_OPEN_DATE=January 1, 2025
   REGISTRATION_CLOSE_DATE=March 15, 2025
   SUBMISSION_DEADLINE=March 31, 2025 at 11:59 PM
   RESULTS_ANNOUNCEMENT_DATE=April 15, 2025
   ```

4. **Deploy the Edge Function:**
   ```bash
   supabase functions deploy send-registration-emails
   ```

5. **Set production secrets:**
   ```bash
   supabase secrets set SMTP_HOST=smtp.hostinger.com
   supabase secrets set SMTP_PORT=587
   supabase secrets set SMTP_USER=your@email.com
   supabase secrets set SMTP_PASSWORD=your-password
   supabase secrets set FROM_EMAIL=noreply@kidswebcomp.com
   supabase secrets set ADMIN_EMAIL=admin@kidswebcomp.com
   supabase secrets set APP_ENV=production
   supabase secrets set COMPETITION_YEAR=2025
   supabase secrets set REGISTRATION_OPEN_DATE="January 1, 2025"
   supabase secrets set REGISTRATION_CLOSE_DATE="March 15, 2025"
   supabase secrets set SUBMISSION_DEADLINE="March 31, 2025 at 11:59 PM"
   supabase secrets set RESULTS_ANNOUNCEMENT_DATE="April 15, 2025"
   ```

---

### Step 5: Frontend Deployment

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build the frontend:**
   ```bash
   npm run build
   ```

3. **Deploy to your hosting platform:**

   **For Vercel:**
   ```bash
   vercel --prod
   ```

   **For Netlify:**
   ```bash
   netlify deploy --prod
   ```

4. **Set environment variables in your hosting platform:**
   - Go to your hosting dashboard (Vercel/Netlify/etc.)
   - Add all environment variables from your `.env` file
   - **Important:** Include all `VITE_*` variables

---

## 🧪 Testing

### Test File Upload

1. Register with a valid form
2. Upload a test file (ZIP, PDF, or image)
3. Check Supabase Storage → `competition-submissions` bucket
4. Verify file appears with correct path: `{registrationId}/{timestamp}_{filename}`

### Test Email System

**Development (Mailtrap):**
1. Register a new user
2. Check your Mailtrap inbox
3. Verify 3 emails received:
   - Student confirmation
   - Parent confirmation
   - Admin notification

**Production (Hostinger):**
1. Change `APP_ENV` secret to `production`
2. Register a test user
3. Check real email inboxes (student, parent, admin)

### Test Dynamic Dates

1. Change dates in `.env`:
   ```env
   VITE_SUBMISSION_DEADLINE=2025-12-31T23:59:59
   ```
2. Rebuild: `npm run build`
3. Verify all pages show new date

### Test Registration Status

1. Set registration close date to past:
   ```env
   VITE_REGISTRATION_CLOSE_DATE=2024-01-01T23:59:59
   ```
2. Visit `/register`
3. Should see "Registration Closed" message

---

## 📧 Email Configuration

### Mailtrap (Development)

1. Sign up at [mailtrap.io](https://mailtrap.io)
2. Create an inbox
3. Get SMTP credentials:
   - Host: `smtp.mailtrap.io`
   - Port: `2525`
   - Username: From Mailtrap dashboard
   - Password: From Mailtrap dashboard

### Hostinger (Production)

1. Log in to your Hostinger account
2. Go to Emails section
3. Create email account if needed
4. SMTP Settings:
   - Host: `smtp.hostinger.com`
   - Port: `587`
   - Username: Your full email address
   - Password: Your email password
5. **Important:** Configure SPF/DKIM records for better deliverability

---

## 🔒 Security Checklist

- [ ] All environment variables set and secured
- [ ] `.env` file added to `.gitignore` (never commit secrets!)
- [ ] Supabase RLS policies enabled on `registrations` table
- [ ] Storage bucket is **private** (not public)
- [ ] Storage policies applied correctly
- [ ] File size limits enforced (50MB)
- [ ] MIME type validation enabled
- [ ] Edge Function secrets set in production
- [ ] Email credentials secured

---

## 🐛 Troubleshooting

### File Upload Fails

**Error: "File too large"**
- Check file is under 50MB
- Verify `VITE_MAX_FILE_SIZE_MB` in .env

**Error: "Upload failed"**
- Check storage bucket exists: `competition-submissions`
- Verify storage policies are applied
- Check Supabase Storage logs

### Emails Not Sending

**Development (Mailtrap):**
- Verify Mailtrap credentials in Edge Function secrets
- Check APP_ENV is set to `development`
- Check Mailtrap inbox (emails go there, not real inboxes)

**Production:**
- Verify Hostinger SMTP credentials
- Check APP_ENV is set to `production`
- Verify SPF/DKIM records configured
- Check spam folders
- Review Edge Function logs in Supabase

### Dates Not Updating

- Ensure you rebuild after changing `.env`: `npm run build`
- Clear browser cache
- Verify environment variables in hosting platform

### Registration Form Disabled

- Check current date vs `VITE_REGISTRATION_CLOSE_DATE`
- Ensure date format is correct: `YYYY-MM-DDTHH:mm:ss`

---

## 📊 Monitoring

### Check Registrations

1. Go to Supabase → Database → `registrations` table
2. View all registrations with file upload status

### Check Uploaded Files

1. Go to Supabase → Storage → `competition-submissions`
2. Browse folders by registration ID

### Check Email Logs

1. Go to Supabase → Edge Functions → `send-registration-emails`
2. View logs for email send attempts
3. Monitor success/failure rates

---

## 🎓 User Guide

Provide this information to your users:

**Supported File Types:**
- ZIP archives
- PDF documents
- PowerPoint presentations (PPT, PPTX)
- Word documents (DOC, DOCX)
- Images (PNG, JPG, JPEG, GIF, WebP, SVG)

**Maximum File Size:** 50MB

**Email Confirmations:**
- Students receive a welcome email with competition details
- Parents receive a confirmation with guidelines
- Both emails sent automatically after registration

---

## 📞 Support

If you encounter issues during deployment:

1. Check this guide's troubleshooting section
2. Review Supabase logs (Database, Storage, Edge Functions)
3. Verify all environment variables are set correctly
4. Test in development (Mailtrap) before production

---

## 🔄 Updating Dates

To update competition dates:

1. Update `.env` file with new dates
2. Rebuild frontend: `npm run build`
3. Update Edge Function secrets:
   ```bash
   supabase secrets set SUBMISSION_DEADLINE="New Date"
   ```
4. Redeploy

---

## ✅ Post-Deployment Checklist

- [ ] All environment variables configured
- [ ] Database migration completed
- [ ] Storage bucket created and policies applied
- [ ] Edge Function deployed with secrets
- [ ] Frontend built and deployed
- [ ] Test registration with file upload
- [ ] Test email delivery (dev and prod)
- [ ] Test date display on all pages
- [ ] Test registration open/close logic
- [ ] Monitor first real registrations
- [ ] Backup database regularly

---

**Congratulations! Your Kids Web Competition is ready to accept registrations with file uploads and email notifications!** 🎉
