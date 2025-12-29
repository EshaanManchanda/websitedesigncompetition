# Documentation

Welcome to the Kids Web Competition project documentation. This directory contains comprehensive guides, setup instructions, and reference materials.

## Directory Structure

```
docs/
├── deployment/    # Deployment guides and instructions
├── setup/         # Setup and configuration guides
├── features/      # Feature-specific documentation
├── maintenance/   # Maintenance and troubleshooting
└── README.md      # This file
```

## Quick Navigation

### Deployment Documentation (`deployment/`)

Everything related to deploying the application to production:

- **[DEPLOYMENT_GUIDE.md](deployment/DEPLOYMENT_GUIDE.md)** - Comprehensive deployment guide
- **[DEPLOYMENT_CHECKLIST.md](deployment/DEPLOYMENT_CHECKLIST.md)** - Pre-deployment checklist
- **[DEPLOYMENT_INSTRUCTIONS.md](deployment/DEPLOYMENT_INSTRUCTIONS.md)** - Step-by-step deployment instructions
- **[DEPLOYMENT_README.md](deployment/DEPLOYMENT_README.md)** - Deployment overview
- **[YOUR_DEPLOYMENT_SUMMARY.md](deployment/YOUR_DEPLOYMENT_SUMMARY.md)** - Custom deployment notes
- **[HOSTINGER_VPS_DEPLOYMENT.md](deployment/HOSTINGER_VPS_DEPLOYMENT.md)** - Hostinger VPS specific guide
- **[NGINX_INSTALLATION_GUIDE.md](deployment/NGINX_INSTALLATION_GUIDE.md)** - Nginx web server setup

### Setup & Configuration (`setup/`)

Getting started with local development and configuration:

- **[SETUP.md](setup/SETUP.md)** - Local development setup guide
- **[SECURITY_CHECKLIST.md](setup/SECURITY_CHECKLIST.md)** - Security best practices and checklist
- **[QUICK_REFERENCE.md](setup/QUICK_REFERENCE.md)** - Quick command reference

### Feature Documentation (`features/`)

Detailed documentation for specific features:

- **[CONTACT_FORM_SETUP.md](features/CONTACT_FORM_SETUP.md)** - Contact form implementation guide
- **[CONTACT_FORM_CHANGES.md](features/CONTACT_FORM_CHANGES.md)** - Contact form change history

### Maintenance & Troubleshooting (`maintenance/`)

Guides for maintaining and fixing issues:

- **[FIXES.md](maintenance/FIXES.md)** - Known issues and fixes
- **[FIX_BOTH_SITES.md](maintenance/FIX_BOTH_SITES.md)** - Multi-site maintenance guide
- **[MIGRATION_SUMMARY.md](maintenance/MIGRATION_SUMMARY.md)** - Database and system migrations

## Getting Started

### New Developers

1. **Start here**: [SETUP.md](setup/SETUP.md)
2. Review: [SECURITY_CHECKLIST.md](setup/SECURITY_CHECKLIST.md)
3. Quick commands: [QUICK_REFERENCE.md](setup/QUICK_REFERENCE.md)
4. Explore: `/development/README.md` for development workflows

### DevOps/Deployment Team

1. **Start here**: [DEPLOYMENT_GUIDE.md](deployment/DEPLOYMENT_GUIDE.md)
2. Pre-flight: [DEPLOYMENT_CHECKLIST.md](deployment/DEPLOYMENT_CHECKLIST.md)
3. VPS Setup: [HOSTINGER_VPS_DEPLOYMENT.md](deployment/HOSTINGER_VPS_DEPLOYMENT.md)
4. Web server: [NGINX_INSTALLATION_GUIDE.md](deployment/NGINX_INSTALLATION_GUIDE.md)

### Feature Implementation

1. Review existing: [CONTACT_FORM_SETUP.md](features/CONTACT_FORM_SETUP.md)
2. Check changes: [CONTACT_FORM_CHANGES.md](features/CONTACT_FORM_CHANGES.md)
3. Follow patterns established in existing features

## Project Overview

### Architecture

```
kids_web_competition/
├── frontend/          # React/Vite SPA
├── backend/           # Express.js API
├── deployment/        # Deployment configs
├── development/       # Dev resources
└── docs/             # This documentation
```

### Technology Stack

**Frontend**:
- React 18.3.1 with TypeScript
- Vite 5.4.1 build tool
- Tailwind CSS for styling
- shadcn/ui component library
- React Router for routing
- TanStack Query for data fetching

**Backend**:
- Node.js with Express.js
- MongoDB database
- Cloudinary for file storage
- Nodemailer for email
- PM2 for process management

**Deployment**:
- VPS hosting (Hostinger)
- Nginx web server
- PM2 process manager
- Optional: Vercel, Netlify

### Key Features

- Competition registration system
- File upload functionality
- Email notifications
- Contact form
- Admin panel (planned)
- Multi-user collaboration support

## Common Tasks

### Local Development

```bash
# Install dependencies
npm install

# Start development servers
npm run dev

# Build for production
npm run build:frontend

# Run linting
npm run lint
```

### Deployment

```bash
# Build frontend
npm run build:frontend

# Upload to VPS
rsync -avz ./ user@host:/var/www/project/

# Deploy on VPS
bash deployment/scripts/DEPLOY_VPS.sh
```

### Troubleshooting

See [FIXES.md](maintenance/FIXES.md) for common issues and solutions.

## Documentation Standards

When adding new documentation:

1. **Location**: Place in appropriate subdirectory
2. **Format**: Use Markdown (.md)
3. **Naming**: Use descriptive, uppercase names with underscores
4. **Structure**: Include:
   - Clear title
   - Table of contents (for long docs)
   - Step-by-step instructions
   - Code examples
   - Troubleshooting section
5. **Update**: Keep this README.md index updated

### Markdown Guidelines

- Use `#` for main title
- Use `##` for sections
- Use `###` for subsections
- Use code blocks with language hints:
  ```javascript
  const example = 'code';
  ```
- Use lists for steps and items
- Link to other docs with relative paths
- Include images in a `/docs/images/` directory (if needed)

## Contributing to Documentation

Good documentation helps everyone! When you:

- **Fix a bug**: Document the fix in [FIXES.md](maintenance/FIXES.md)
- **Add a feature**: Create documentation in `features/`
- **Change deployment**: Update relevant guide in `deployment/`
- **Improve setup**: Update [SETUP.md](setup/SETUP.md)
- **Find something unclear**: Improve the existing doc

### Documentation PR Checklist

- [ ] Clear and concise writing
- [ ] Code examples tested
- [ ] Screenshots included (if relevant)
- [ ] Links verified
- [ ] Index (this file) updated
- [ ] Spelling and grammar checked

## Additional Resources

### External Documentation

- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [MongoDB Manual](https://docs.mongodb.com)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

### Project Resources

- Main README: `/README.md`
- Frontend README: `/frontend/README.md`
- Backend README: `/backend/README.md`
- Deployment README: `/deployment/README.md`
- Development README: `/development/README.md`

## Need Help?

1. **Search this documentation** - Use Ctrl+F or search in your IDE
2. **Check main README** - Project overview and quick start
3. **Review code comments** - Many files have inline documentation
4. **Check Git history** - See how features were implemented
5. **Ask the team** - Don't hesitate to ask questions

## Feedback

Found an error or have a suggestion? Please:
- Open an issue in the project repository
- Submit a pull request with improvements
- Contact the maintainers

---

**Last Updated**: 2025-12-29
**Documentation Version**: 2.0 (Post-Restructure)
