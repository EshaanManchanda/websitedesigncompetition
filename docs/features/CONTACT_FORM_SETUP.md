# Contact Form Setup Guide

This guide explains how to set up the contact form to store submissions in Supabase and send email notifications to the admin.

## Database Setup

### 1. Run the Database Migration

The contact form requires a `contact_submissions` table in your Supabase database.

**Option A: Using Supabase CLI (Recommended)**
```bash
# Navigate to your project directory
cd kids_web_competition

# Run the migration
supabase db push
```

**Option B: Manual SQL Execution**
1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Run the SQL from `supabase/migrations/002_create_contact_submissions.sql`:

```sql
-- Create contact_submissions table
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  age TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert (public form submission)
CREATE POLICY "Allow public to insert contact submissions"
  ON public.contact_submissions
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create policy for admin to view all submissions
CREATE POLICY "Allow authenticated users to read contact submissions"
  ON public.contact_submissions
  FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX idx_contact_submissions_created_at ON public.contact_submissions(created_at DESC);
CREATE INDEX idx_contact_submissions_email ON public.contact_submissions(email);
```

### 2. Verify Table Creation

Run this query in the SQL Editor to verify the table was created:
```sql
SELECT * FROM contact_submissions LIMIT 1;
```

## Edge Function Deployment

### 1. Deploy the Contact Email Function

**Using Supabase CLI:**
```bash
# Deploy the function
supabase functions deploy send-contact-email

# Set environment variables (if not already set)
supabase secrets set SMTP_HOST=your-smtp-host
supabase secrets set SMTP_PORT=587
supabase secrets set SMTP_USER=your-smtp-username
supabase secrets set SMTP_PASSWORD=your-smtp-password
supabase secrets set FROM_EMAIL=noreply@kidswebcomp.com
supabase secrets set ADMIN_EMAIL=admin@kidswebcomp.com
```

**Environment Variables Required:**
- `SMTP_HOST` - Your SMTP server hostname (e.g., smtp.gmail.com, smtp.sendgrid.net)
- `SMTP_PORT` - SMTP port (587 for TLS, 465 for SSL)
- `SMTP_USER` - SMTP username
- `SMTP_PASSWORD` - SMTP password
- `FROM_EMAIL` - Email address to send from
- `ADMIN_EMAIL` - Admin email address to receive contact notifications

### 2. Test the Function

**Using cURL:**
```bash
curl -i --location --request POST 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/send-contact-email' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{
    "name": "Test User",
    "email": "test@example.com",
    "age": "12",
    "subject": "technical-support",
    "message": "This is a test message",
    "created_at": "2025-01-15T10:00:00Z"
  }'
```

Replace:
- `YOUR_PROJECT_REF` with your Supabase project reference ID
- `YOUR_ANON_KEY` with your Supabase anonymous key

## Email Configuration

### Development vs Production

The system supports different SMTP configurations for development and production:

**Development (Testing):**
- Use Mailtrap or similar service for testing
- Set `APP_ENV=development`
- Use `SMTP_HOST_DEV`, `SMTP_PORT_DEV`, etc.

**Production:**
- Use a production email service (Gmail, SendGrid, AWS SES, etc.)
- Set `APP_ENV=production`
- Use `SMTP_HOST`, `SMTP_PORT`, etc.

### Recommended Email Services

1. **Gmail** (Free, limited)
   - SMTP_HOST: smtp.gmail.com
   - SMTP_PORT: 587
   - Enable "App Passwords" in Google Account settings

2. **SendGrid** (Free tier: 100 emails/day)
   - SMTP_HOST: smtp.sendgrid.net
   - SMTP_PORT: 587

3. **AWS SES** (Pay as you go)
   - SMTP_HOST: email-smtp.region.amazonaws.com
   - SMTP_PORT: 587

4. **Mailtrap** (Development only)
   - SMTP_HOST: smtp.mailtrap.io
   - SMTP_PORT: 2525

## Frontend Configuration

The Contact form is already configured and will work once the backend is set up. No additional frontend changes are needed.

The form will:
1. ✅ Validate all required fields
2. ✅ Submit data to Supabase `contact_submissions` table
3. ✅ Trigger email notification to admin
4. ✅ Show success/error toast messages
5. ✅ Reset form after successful submission

## Testing Checklist

- [ ] Database table `contact_submissions` created
- [ ] Row Level Security policies enabled
- [ ] Edge function `send-contact-email` deployed
- [ ] SMTP credentials configured as secrets
- [ ] Admin email set in `ADMIN_EMAIL` environment variable
- [ ] Test submission through the contact form
- [ ] Verify data appears in `contact_submissions` table
- [ ] Confirm admin receives email notification

## Troubleshooting

### Form submission fails
1. Check browser console for errors
2. Verify Supabase URL and Anon Key in `.env` file
3. Check if table exists: `SELECT * FROM contact_submissions;`
4. Verify RLS policies allow INSERT

### Email not received
1. Check Supabase Functions logs: Dashboard > Functions > send-contact-email > Logs
2. Verify SMTP credentials are correct
3. Check spam folder
4. Test SMTP connection with a mail client
5. Verify `ADMIN_EMAIL` environment variable is set correctly

### Database permission errors
```sql
-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon;
GRANT INSERT ON public.contact_submissions TO anon;
```

## Viewing Submissions

### In Supabase Dashboard
1. Go to your Supabase project
2. Navigate to Table Editor
3. Select `contact_submissions` table
4. View all submissions with filters and search

### Using SQL
```sql
-- View recent submissions
SELECT
  name,
  email,
  subject,
  message,
  created_at
FROM contact_submissions
ORDER BY created_at DESC
LIMIT 50;

-- Count submissions by subject
SELECT
  subject,
  COUNT(*) as count
FROM contact_submissions
GROUP BY subject
ORDER BY count DESC;

-- Search by email
SELECT * FROM contact_submissions
WHERE email ILIKE '%example.com%'
ORDER BY created_at DESC;
```

## Security Considerations

1. **Rate Limiting**: Consider adding rate limiting to prevent spam
2. **Captcha**: Add reCAPTCHA or similar for production
3. **Email Validation**: The form validates email format client-side
4. **Data Retention**: Set up a policy to archive/delete old submissions
5. **Sensitive Data**: Don't store sensitive personal information

## Support

For issues with:
- Database setup → Check Supabase documentation
- Email delivery → Verify SMTP provider settings
- Form validation → Check browser console for errors
- Edge Functions → Check Supabase Functions logs

---

**Last Updated:** 2025-01-15
**Version:** 1.0.0
