# Kids Web Competition - Setup Guide

This guide will help you set up and deploy the Kids Web Design Competition website securely.

## Prerequisites

- Node.js 18 or higher
- npm or yarn
- A Supabase account (free tier available at https://supabase.com)

## Initial Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Go to https://supabase.com and create a free account
2. Create a new project
3. Wait for the project to be ready (takes ~2 minutes)

### 3. Create Database Table

1. In your Supabase dashboard, go to the SQL Editor
2. Open the file `supabase/schema.sql` in this project
3. Copy the entire SQL script and paste it into the Supabase SQL Editor
4. Click "Run" to create the `registrations` table with proper security policies

### 4. Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. In your Supabase dashboard, go to Settings -> API
3. Copy the following values to your `.env` file:
   - **Project URL** -> `VITE_SUPABASE_URL`
   - **anon/public key** -> `VITE_SUPABASE_ANON_KEY`

Your `.env` file should look like this:
```env
VITE_ENABLE_ROUTE_MESSAGING=true
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Development

Run the development server:

```bash
npm run dev
```

The site will be available at http://localhost:8080

## Security

### Fixed Vulnerabilities

- ✅ Updated packages to fix high and moderate severity vulnerabilities
- ✅ Added security headers for production deployment
- ✅ Implemented Row Level Security (RLS) in Supabase
- ✅ Environment variables are properly configured in .gitignore

### Remaining Vulnerabilities

There are 3 moderate severity vulnerabilities in esbuild/vite that only affect the development server (not production builds). These can be fixed by upgrading to Vite 6:

```bash
npm audit fix --force
```

**Note:** This will upgrade Vite from v5 to v6, which may include breaking changes. Test thoroughly after upgrading.

## Deployment

### Option 1: Vercel

1. Push your code to GitHub
2. Go to https://vercel.com and import your repository
3. Add your environment variables in Vercel project settings:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy!

The `vercel.json` file includes security headers and HTTPS redirect.

### Option 2: Netlify

1. Push your code to GitHub
2. Go to https://netlify.com and import your repository
3. Add your environment variables in Netlify site settings
4. Deploy!

The `netlify.toml` file includes security headers and HTTPS redirect.

### Option 3: Static Hosting

Build the project:

```bash
npm run build
```

Upload the `dist` folder to any static hosting service (GitHub Pages, Cloudflare Pages, etc.)

## Security Headers

The following security headers are configured in production:

- **X-Frame-Options**: Prevents clickjacking attacks
- **X-Content-Type-Options**: Prevents MIME type sniffing
- **X-XSS-Protection**: Enables XSS protection in older browsers
- **Referrer-Policy**: Controls referrer information
- **Permissions-Policy**: Restricts browser features
- **HTTPS Redirect**: Forces HTTPS in production

## Database Security

The Supabase database uses Row Level Security (RLS):

- ✅ Public can INSERT registrations (for the registration form)
- ✅ Only authenticated users can READ registrations (for admin dashboard)
- ✅ Email field is UNIQUE to prevent duplicate registrations
- ✅ All sensitive data is stored securely in Supabase

## Testing

Before going live:

1. ✅ Test the registration form with valid data
2. ✅ Test email validation (duplicate emails should be rejected)
3. ✅ Test form validation (all required fields)
4. ✅ Check that data appears in your Supabase dashboard
5. ✅ Test on mobile devices
6. ✅ Verify HTTPS is working in production

## Monitoring

In your Supabase dashboard, you can:

- View all registrations in the Table Editor
- Set up email notifications
- Export data to CSV
- Monitor API usage

## Support

If you encounter issues:

1. Check the browser console for errors
2. Check Supabase logs in your dashboard
3. Verify environment variables are set correctly
4. Ensure the database table was created properly

## Additional Security Recommendations

1. ✅ Never commit `.env` file to Git (already in .gitignore)
2. ✅ Rotate your Supabase keys if they're ever exposed
3. ✅ Set up email rate limiting in Supabase (to prevent spam)
4. ✅ Consider adding CAPTCHA for additional bot protection
5. ✅ Regularly update npm packages: `npm update`
6. ✅ Monitor Supabase usage to detect unusual activity

## License

This project is for the Kids Web Design Competition.
