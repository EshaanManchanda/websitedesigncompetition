# 📚 Documentation

> Welcome to the Kids Web Competition project documentation. This directory contains comprehensive guides, setup instructions, and reference materials for developers, DevOps engineers, and contributors.

**Part of**: [Website Designing Competition Monorepo](../README.md)

---

## 🎯 New to the Project?

**Choose your path:**

| I want to... | Start here |
|-------------|------------|
| 🚀 **Set up local development** | [SETUP.md](setup/SETUP.md) → [ENVIRONMENT_VARIABLES.md](setup/ENVIRONMENT_VARIABLES.md) → [Quick Reference](setup/QUICK_REFERENCE.md) |
| 🌐 **Deploy to production** | [HOSTINGER_VPS_DEPLOYMENT.md](deployment/HOSTINGER_VPS_DEPLOYMENT.md) → [DEPLOYMENT_CHECKLIST.md](deployment/DEPLOYMENT_CHECKLIST.md) |
| 🎨 **Work on frontend** | [Frontend README](../frontend/README.md) → [Setup Guide](setup/SETUP.md) |
| ⚙️ **Work on backend** | [Backend README](../backend/README.md) → [API Documentation](../backend/README.md#api-endpoints) |
| 🔍 **Find a command quickly** | [QUICK_REFERENCE.md](setup/QUICK_REFERENCE.md) |
| 🐛 **Fix an issue** | [FIXES.md](maintenance/FIXES.md) → [Quick Reference](setup/QUICK_REFERENCE.md) |

---

## 📂 Directory Structure

```
docs/
├── deployment/    # Deployment guides and instructions
├── setup/         # Setup and configuration guides
├── features/      # Feature-specific documentation
├── maintenance/   # Maintenance and troubleshooting
└── README.md      # This file
```

## 🗺️ Quick Navigation

### 🚀 Deployment Documentation (`deployment/`)

Everything you need to deploy the application to production servers:

- **[HOSTINGER_VPS_DEPLOYMENT.md](deployment/HOSTINGER_VPS_DEPLOYMENT.md)** - 🌐 **Complete VPS deployment guide** (recommended)
- **[DEPLOYMENT_CHECKLIST.md](deployment/DEPLOYMENT_CHECKLIST.md)** - ✅ Pre-deployment checklist
- **[DEPLOYMENT_GUIDE.md](deployment/DEPLOYMENT_GUIDE.md)** - 📖 General deployment guide
- **[DEPLOYMENT_INSTRUCTIONS.md](deployment/DEPLOYMENT_INSTRUCTIONS.md)** - 📋 Step-by-step deployment
- **[NGINX_INSTALLATION_GUIDE.md](deployment/NGINX_INSTALLATION_GUIDE.md)** - 🔧 Nginx web server setup
- **Vercel/Netlify**: See [Deployment README](../deployment/README.md) for platform-specific configs

### ⚙️ Setup & Configuration (`setup/`)

Getting started with local development and environment configuration:

- **[SETUP.md](setup/SETUP.md)** - 🛠️ **Local development setup** (start here for development)
- **[ENVIRONMENT_VARIABLES.md](setup/ENVIRONMENT_VARIABLES.md)** - 🔐 Complete environment variable guide
- **[SECURITY_CHECKLIST.md](setup/SECURITY_CHECKLIST.md)** - 🔒 Security best practices and checklist
- **[QUICK_REFERENCE.md](setup/QUICK_REFERENCE.md)** - ⚡ Quick command reference for daily operations

### 🎨 Feature Documentation (`features/`)

Detailed implementation guides for specific features:

- **[CONTACT_FORM_SETUP.md](features/CONTACT_FORM_SETUP.md)** - 📧 Contact form implementation guide
- **[CONTACT_FORM_CHANGES.md](features/CONTACT_FORM_CHANGES.md)** - 📝 Contact form change history

### 🔧 Maintenance & Troubleshooting (`maintenance/`)

Guides for maintaining the application and resolving issues:

- **[FIXES.md](maintenance/FIXES.md)** - 🐛 Known issues and their solutions
- **[FIX_BOTH_SITES.md](maintenance/FIX_BOTH_SITES.md)** - 🔄 Multi-site maintenance guide
- **[MIGRATION_SUMMARY.md](maintenance/MIGRATION_SUMMARY.md)** - 🗄️ Database and system migrations

## 🚦 Getting Started (Detailed Paths)

### 👨‍💻 New Developers

1. **Start here**: [SETUP.md](setup/SETUP.md) - Set up your local environment
2. **Review**: [SECURITY_CHECKLIST.md](setup/SECURITY_CHECKLIST.md) - Security best practices
3. **Quick commands**: [QUICK_REFERENCE.md](setup/QUICK_REFERENCE.md) - Daily operations
4. **Explore**: [Development README](../development/README.md) - Development workflows

### 🚀 DevOps/Deployment Team

1. **Start here**: [HOSTINGER_VPS_DEPLOYMENT.md](deployment/HOSTINGER_VPS_DEPLOYMENT.md) - Complete deployment guide
2. **Pre-flight**: [DEPLOYMENT_CHECKLIST.md](deployment/DEPLOYMENT_CHECKLIST.md) - Pre-deployment checks
3. **VPS Setup**: [HOSTINGER_VPS_DEPLOYMENT.md](deployment/HOSTINGER_VPS_DEPLOYMENT.md) - Server setup guide
4. **Web server**: [NGINX_INSTALLATION_GUIDE.md](deployment/NGINX_INSTALLATION_GUIDE.md) - Nginx configuration

### 🎨 Feature Implementation

1. **Review existing**: [CONTACT_FORM_SETUP.md](features/CONTACT_FORM_SETUP.md) - Example feature
2. **Check changes**: [CONTACT_FORM_CHANGES.md](features/CONTACT_FORM_CHANGES.md) - Change tracking
3. **Follow patterns**: Use established patterns in existing features
4. **Update docs**: Document your feature in `features/` directory

---

## 📋 Project Overview

### 🏗️ Architecture

```
kids_web_competition/
├── frontend/          # React/Vite SPA
├── backend/           # Express.js API
├── deployment/        # Deployment configs
├── development/       # Dev resources
└── docs/             # This documentation
```

### 💻 Technology Stack

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

### ✨ Key Features

- ✅ Competition registration system
- 📁 File upload functionality (up to 50MB)
- 📧 Email notifications (students, parents, admins)
- 💬 Contact form
- 🎯 Admin panel (planned)
- 👥 Multi-user collaboration support
- 🔐 Secure authentication and validation
- 🌐 Multi-platform deployment options

---

## 📝 Common Tasks

### 💻 Local Development

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

### 🚀 Deployment

```bash
# Build frontend
npm run build

# Upload to VPS (if applicable)
rsync -avz ./ user@host:/var/www/project/

# Deploy on VPS
bash deployment/scripts/DEPLOY_VPS.sh

# Or deploy to Vercel/Netlify (see deployment guides)
```

**See**: [HOSTINGER_VPS_DEPLOYMENT.md](deployment/HOSTINGER_VPS_DEPLOYMENT.md) for complete VPS deployment guide.

### 🐛 Troubleshooting

See [FIXES.md](maintenance/FIXES.md) for common issues and solutions.

**Quick troubleshooting**: [QUICK_REFERENCE.md](setup/QUICK_REFERENCE.md#troubleshooting)

---

## 📖 Documentation Standards

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

## 🤝 Contributing to Documentation

Good documentation helps everyone! **When you make changes:**

| Change Type | Action Required |
|------------|----------------|
| 🐛 **Fix a bug** | Document the fix in [FIXES.md](maintenance/FIXES.md) |
| ✨ **Add a feature** | Create documentation in `features/` directory |
| 🚀 **Change deployment** | Update relevant guide in `deployment/` |
| ⚙️ **Improve setup** | Update [SETUP.md](setup/SETUP.md) |
| 📝 **Find unclear docs** | Improve the existing documentation |
| 🔐 **Update security** | Update [SECURITY_CHECKLIST.md](setup/SECURITY_CHECKLIST.md) |

### ✅ Documentation PR Checklist

Before submitting documentation changes:

- [ ] Clear and concise writing
- [ ] Code examples tested and working
- [ ] Screenshots included (if relevant)
- [ ] All links verified
- [ ] Index (this README) updated with new docs
- [ ] Spelling and grammar checked
- [ ] Emojis used appropriately for visual hierarchy
- [ ] Related docs cross-referenced

---

## 📚 Additional Resources

### 🌐 External Documentation

- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [MongoDB Manual](https://docs.mongodb.com)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

### 📂 Project Resources

- **[Root README](../README.md)** - Project overview and quick start
- **[Frontend README](../frontend/README.md)** - Frontend development guide
- **[Backend README](../backend/README.md)** - Backend API documentation
- **[Deployment README](../deployment/README.md)** - Deployment configurations
- **[Development README](../development/README.md)** - Development resources
- **[Migration Guide](MIGRATION_TO_NEW_STRUCTURE.md)** - Monorepo migration guide

## 🔍 Finding What You Need

### Search Tips

**In this documentation:**
- Press `Ctrl+F` (or `Cmd+F` on Mac) to search within a file
- Use your IDE's global search to search across all docs
- Look for keywords like "deploy", "setup", "error", "fix", etc.

**Common searches:**
- `npm install` → Setup and dependency management
- `PM2` → Process management and deployment
- `MongoDB` → Database configuration
- `Cloudinary` → File upload configuration
- `SMTP` → Email configuration
- `502` or `500` → Server error troubleshooting
- `CORS` → Cross-origin issues

### Where to Look

| Looking for... | Check here |
|---------------|------------|
| 🚀 **Quick commands** | [QUICK_REFERENCE.md](setup/QUICK_REFERENCE.md) |
| 🐛 **Error solutions** | [FIXES.md](maintenance/FIXES.md) |
| 🔐 **Environment setup** | [ENVIRONMENT_VARIABLES.md](setup/ENVIRONMENT_VARIABLES.md) |
| 🌐 **Deployment steps** | [HOSTINGER_VPS_DEPLOYMENT.md](deployment/HOSTINGER_VPS_DEPLOYMENT.md) |
| ⚙️ **API endpoints** | [Backend README](../backend/README.md#api-endpoints) |
| 🎨 **Component docs** | [Frontend README](../frontend/README.md#architecture-overview) |
| 📊 **Project structure** | [Root README](../README.md#project-structure) |

### Troubleshooting Path

1. **Check if it's a known issue** → [FIXES.md](maintenance/FIXES.md)
2. **Search documentation** → Use Ctrl+F or IDE search
3. **Check relevant logs** → See [QUICK_REFERENCE.md](setup/QUICK_REFERENCE.md#view-logs)
4. **Review configuration** → [ENVIRONMENT_VARIABLES.md](setup/ENVIRONMENT_VARIABLES.md)
5. **Check Git history** → See how features were implemented
6. **Ask the team** → Don't hesitate to ask questions

---

## 💬 Feedback & Contributions

Found an error or have a suggestion? Please:
- 🐛 Open an issue in the [GitHub repository](https://github.com/EshaanManchanda/websitedesigncompetition/issues)
- 🔧 Submit a pull request with improvements
- 📧 Contact the maintainers
- 💡 Suggest new documentation topics

---

## 📄 License

**© 2025 Website Designing Competition. All Rights Reserved.**

This is proprietary software. Unauthorized copying, modification, distribution, or use of this software is strictly prohibited.

---

**Last Updated**: 2025-12-29
**Documentation Version**: 2.0 (Post-Restructure)
**Maintained by**: Website Designing Competition Team
