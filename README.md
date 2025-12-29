# Website Designing Competition

> A comprehensive platform for managing kids' web design competitions with online registration, file uploads, email notifications, and competition management.

**Live Site**: [https://websitedesigningcompetition.com](https://websitedesigningcompetition.com)

---

## Overview

The Website Designing Competition platform is designed to organize and manage web design competitions for kids, providing a complete end-to-end solution for registration, submission management, and participant communication.

### Key Features

- **Online Registration System**: Multi-step registration form with file upload capabilities
- **Email Notifications**: Automated emails to students, parents, and administrators
- **Competition Management**: Configurable competition dates and deadlines
- **File Upload & Storage**: Cloudinary integration for secure file storage (up to 50MB)
- **Contact System**: Built-in contact form with email notifications
- **Age-Based Categories**: Support for 11-13 years and 14-17 years age groups
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Admin Dashboard**: Centralized management interface (planned)

### Target Audience

- **Participants**: Kids aged 11-17 learning web design
- **Parents**: Guardian consent and oversight
- **Administrators**: Competition organizers and judges

---

## Tech Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.3.1 | UI framework |
| **Vite** | 5.4.1 | Build tool and dev server |
| **TypeScript** | 5.5.3 | Type-safe development |
| **shadcn/ui** | Latest | Component library (Radix UI) |
| **Tailwind CSS** | 3.4.11 | Utility-first CSS framework |
| **React Router** | 6.26.2 | Client-side routing |
| **React Hook Form** | 7.53.0 | Form management |
| **Zod** | 3.23.8 | Schema validation |
| **TanStack Query** | 5.56.2 | Data fetching and caching |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Express.js** | Latest | Web application framework |
| **MongoDB** | Latest | NoSQL database |
| **Mongoose** | Latest | MongoDB object modeling |
| **Cloudinary** | Latest | File upload and storage |
| **Nodemailer** | Latest | Email service |
| **Helmet** | Latest | Security headers |
| **CORS** | Latest | Cross-origin resource sharing |
| **Express Rate Limit** | Latest | Rate limiting |
| **Multer** | Latest | File upload handling |

### Infrastructure

- **Architecture**: Monorepo with npm workspaces
- **Process Manager**: PM2 (cluster mode)
- **Web Server**: Nginx (reverse proxy, SSL)
- **Deployment**: Vercel, Netlify, or VPS
- **SSL**: Let's Encrypt
- **Version Control**: Git & GitHub

---

## Project Structure

```
kids_web_competition/
├── frontend/                  # React/Vite frontend application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   └── ui/          # shadcn/ui components
│   │   ├── pages/           # Page components (Home, Registration, FAQ, etc.)
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utilities and libraries
│   │   └── utils/           # Helper functions
│   ├── public/              # Static assets
│   ├── dist/               # Build output (git-ignored)
│   ├── package.json        # Frontend dependencies
│   ├── vite.config.ts      # Vite configuration
│   ├── tsconfig.json       # TypeScript config
│   ├── tailwind.config.ts  # Tailwind CSS config
│   └── .env.example        # Frontend environment template
│
├── backend/                   # Express.js API server
│   ├── src/
│   │   ├── routes/          # API route handlers
│   │   ├── models/          # Mongoose schemas
│   │   ├── middleware/      # Express middleware
│   │   ├── utils/           # Backend utilities
│   │   └── server.js        # Application entry point
│   ├── logs/               # Application logs (git-ignored)
│   ├── package.json        # Backend dependencies
│   └── .env.example        # Backend environment template
│
├── deployment/                # Deployment configurations
│   ├── nginx/              # Nginx configuration files
│   ├── pm2/                # PM2 process manager configs
│   ├── vercel/             # Vercel deployment config
│   ├── netlify/            # Netlify deployment config
│   └── scripts/            # Deployment automation scripts
│
├── development/               # Development resources
│   ├── examples/           # Code examples and snippets
│   └── README.md           # Development guidelines
│
├── docs/                      # Comprehensive documentation
│   ├── deployment/         # Deployment guides
│   ├── setup/              # Setup and configuration
│   ├── features/           # Feature documentation
│   ├── maintenance/        # Maintenance guides
│   └── README.md           # Documentation index
│
├── package.json               # Root workspace manager
├── .gitignore                # Git ignore rules
├── .env.example              # Environment variable guide
└── README.md                 # This file
```

---

## Quick Start

### Prerequisites

Ensure you have the following installed:

- **Node.js**: v18 or higher ([Download](https://nodejs.org/))
- **npm**: Comes with Node.js
- **Git**: For version control ([Download](https://git-scm.com/))
- **MongoDB**: Atlas account or local instance

**Recommended**: Use [nvm](https://github.com/nvm-sh/nvm#installing-and-updating) to manage Node.js versions.

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/EshaanManchanda/websitedesigncompetition.git
   cd kids_web_competition
   ```

2. **Install all dependencies** (frontend + backend):
   ```bash
   npm install
   ```

3. **Set up environment variables**:

   **Frontend** (`frontend/.env`):
   ```bash
   cp frontend/.env.example frontend/.env
   # Edit frontend/.env with your configuration
   ```

   **Backend** (`backend/.env`):
   ```bash
   cp backend/.env.example backend/.env
   # Edit backend/.env with your MongoDB URI, Cloudinary, SMTP credentials
   ```

   See [Environment Variables Documentation](docs/setup/ENVIRONMENT_VARIABLES.md) for detailed setup.

4. **Start development servers**:
   ```bash
   npm run dev
   ```
   This starts both frontend (http://localhost:8080) and backend (http://localhost:5050).

5. **Open your browser**:
   Navigate to [http://localhost:8080](http://localhost:8080)

---

## Development

### Available Commands

**Root-level commands** (runs across workspaces):

```bash
# Start both frontend and backend development servers
npm run dev

# Start frontend only
npm run dev:frontend

# Start backend only
npm run dev:backend

# Build frontend for production
npm run build

# Install dependencies for all workspaces
npm install

# Clean all node_modules and reinstall
npm run clean-install
```

**Frontend-specific commands** (from `frontend/` directory):

```bash
cd frontend

# Start dev server with route messaging
npm run dev

# Build for production
npm run build

# Build for development (with sourcemaps)
npm run build:dev

# Preview production build
npm run preview

# Lint code
npm run lint
```

**Backend-specific commands** (from `backend/` directory):

```bash
cd backend

# Start development server with nodemon
npm run dev

# Start production server
npm start

# Run with PM2 (production)
pm2 start src/server.js --name kids-competition-api
```

### Development Workflow

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** in the appropriate workspace:
   - Frontend changes: `frontend/src/`
   - Backend changes: `backend/src/`
   - Deployment configs: `deployment/`
   - Documentation: `docs/`

3. **Test your changes**:
   ```bash
   npm run dev  # Test in development
   npm run build  # Test production build
   ```

4. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push to GitHub**:
   ```bash
   git push -u origin feature/your-feature-name
   ```

6. **Create a Pull Request** on GitHub

### Monorepo Structure Benefits

This project uses **npm workspaces** for monorepo management:

- **Isolated Dependencies**: Frontend and backend have separate `node_modules`
- **Shared Scripts**: Run commands across all workspaces from root
- **Better Organization**: Clear separation of concerns
- **Multi-Developer Friendly**: Team members can work on different parts independently
- **Consistent Tooling**: Unified development experience

---

## Environment Variables

### Overview

The project uses different environment variables for frontend and backend:

- **Frontend** (`frontend/.env`): Variables prefixed with `VITE_` (client-side accessible)
- **Backend** (`backend/.env`): Server-side configuration (secrets, API keys)

### Required Variables

**Frontend** (`frontend/.env`):
```bash
VITE_API_URL=http://localhost:5050/api
VITE_COMPETITION_YEAR=2026
VITE_REGISTRATION_OPEN_DATE=2025-12-01
VITE_REGISTRATION_CLOSE_DATE=2026-03-15T23:59:59
VITE_SUBMISSION_DEADLINE=2026-03-31T23:59:59
VITE_MAX_FILE_SIZE_MB=50
```

**Backend** (`backend/.env`):
```bash
# Server
PORT=5050
NODE_ENV=development

# MongoDB
MONGODB_URI=your_mongodb_connection_string

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# SMTP Email
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_USER=your_email@domain.com
SMTP_PASSWORD=your_smtp_password

# Admin
ADMIN_EMAIL=admin@websitedesigningcompetition.com
```

**Detailed Setup**: See [Environment Variables Guide](docs/setup/ENVIRONMENT_VARIABLES.md)

---

## Deployment

### Deployment Options

This project supports multiple deployment strategies:

#### 1. **Vercel** (Frontend) + **MongoDB Atlas** (Database)

```bash
# Frontend deployment
cd frontend
vercel deploy --prod

# Use deployment/vercel/vercel.json configuration
```

#### 2. **Netlify** (Frontend) + **MongoDB Atlas** (Database)

```bash
# Frontend deployment
cd frontend
netlify deploy --prod

# Use deployment/netlify/netlify.toml configuration
```

#### 3. **VPS** (Full Stack) with PM2 + Nginx

**Full deployment guide**: [Hostinger VPS Deployment](docs/deployment/HOSTINGER_VPS_DEPLOYMENT.md)

Quick overview:
```bash
# Build frontend
npm run build

# Start backend with PM2
cd deployment/pm2
pm2 start backend-ecosystem.config.js

# Configure Nginx
sudo cp deployment/nginx/nginx-kids-competition.conf /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/kids-competition /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Environment-Specific Builds

- **Development**: `npm run dev` (hot reload, sourcemaps)
- **Production**: `npm run build` (optimized, minified)
- **Preview**: `npm run preview` (test production build locally)

### Deployment Documentation

- [Hostinger VPS Deployment Guide](docs/deployment/HOSTINGER_VPS_DEPLOYMENT.md)
- [Deployment Checklist](docs/deployment/DEPLOYMENT_CHECKLIST.md)
- [Nginx Installation Guide](docs/deployment/NGINX_INSTALLATION_GUIDE.md)
- [Vercel/Netlify Configs](deployment/README.md) (see deployment/ folder)
- [Quick Reference](docs/setup/QUICK_REFERENCE.md)

---

## Team Collaboration

### Working with Multiple Developers

This monorepo structure is designed for collaborative development:

1. **Clear Boundaries**: Frontend and backend teams can work independently
2. **Isolated Dependencies**: Changes in one workspace don't affect the other
3. **Shared Documentation**: All team members access the same docs
4. **Consistent Workflows**: Standard commands across all workspaces

### Recommended Workflow

- **Frontend Team**: Works in `frontend/` directory
- **Backend Team**: Works in `backend/` directory
- **DevOps Team**: Manages `deployment/` configurations
- **Documentation Team**: Maintains `docs/` content

### Communication

- **Issues**: [GitHub Issues](https://github.com/EshaanManchanda/websitedesigncompetition/issues)
- **Pull Requests**: Code review and collaboration
- **Documentation**: Keep `docs/` updated with changes

---

## Documentation

### Quick Links

- **[Documentation Index](docs/README.md)** - Complete documentation overview
- **[Environment Setup](docs/setup/ENVIRONMENT_VARIABLES.md)** - Environment variable configuration
- **[VPS Deployment](docs/deployment/HOSTINGER_VPS_DEPLOYMENT.md)** - Deploy to VPS with PM2 + Nginx
- **[Deployment Configs](deployment/README.md)** - Vercel, Netlify, and other deployment configs
- **[Quick Reference](docs/setup/QUICK_REFERENCE.md)** - Common commands and operations
- **[Migration Guide](docs/MIGRATION_TO_NEW_STRUCTURE.md)** - Migrating to new structure

### Workspace Documentation

- **[Frontend README](frontend/README.md)** - Frontend development guide
- **[Backend README](backend/README.md)** - Backend API documentation
- **[Deployment README](deployment/README.md)** - Deployment configurations
- **[Development README](development/README.md)** - Development resources

### API Documentation

- **Health Check**: `GET /api/health`
- **Registration**: `POST /api/register`
- **Contact Form**: `POST /api/contact`

Full API documentation: [Backend README](backend/README.md)

---

## Troubleshooting

### Common Issues

**Frontend not connecting to backend:**
```bash
# Check backend is running
curl http://localhost:5050/api/health

# Verify VITE_API_URL in frontend/.env
cat frontend/.env | grep VITE_API_URL
```

**Build fails:**
```bash
# Clean install dependencies
rm -rf node_modules frontend/node_modules backend/node_modules
npm install
```

**Environment variables not working:**
- Frontend: Must be prefixed with `VITE_`
- Backend: No prefix required
- Rebuild frontend after changing `.env`

See [Quick Reference](docs/setup/QUICK_REFERENCE.md) for more troubleshooting tips.

---

## Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** in the appropriate workspace
4. **Test thoroughly**: `npm run dev` and `npm run build`
5. **Commit your changes**: `git commit -m 'feat: add amazing feature'`
6. **Push to branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Commit Message Convention

Use conventional commits format:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

---

## License

**© 2025 Website Designing Competition. All Rights Reserved.**

This is proprietary software. Unauthorized copying, modification, distribution, or use of this software is strictly prohibited.

---

## Contact

- **Website**: [https://websitedesigningcompetition.com](https://websitedesigningcompetition.com)
- **Email**: [contact@websitedesigningcompetition.com](mailto:contact@websitedesigningcompetition.com)
- **GitHub**: [https://github.com/EshaanManchanda/websitedesigncompetition](https://github.com/EshaanManchanda/websitedesigncompetition)

---

## Project Status

**Version**: 1.0.0
**Status**: Active Development
**Last Updated**: December 2025

### Roadmap

- [x] Frontend application with registration
- [x] Backend API with MongoDB
- [x] Email notification system
- [x] File upload with Cloudinary
- [x] Deployment configurations
- [x] Comprehensive documentation
- [ ] Admin dashboard
- [ ] Judging system
- [ ] Results publication
- [ ] Analytics dashboard

---

**Built with ❤️ for inspiring young web developers**
