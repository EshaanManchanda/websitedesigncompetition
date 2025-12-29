# Migration Guide: New Project Structure

**Date**: December 29, 2025
**Version**: 2.0
**Status**: ✅ Completed

## Overview

The Kids Web Competition project has been reorganized to improve collaboration and maintainability. This guide explains what changed and how to update your local development environment.

## What Changed?

### Old Structure ❌
```
kids_web_competition/
├── src/                    # Frontend code
├── public/                 # Static assets
├── backend/                # Backend code
├── dist/                   # Build output
├── supabase/               # Database (removed)
├── examples/               # Examples
├── doc/                    # Some docs
├── *.md                    # Many docs at root
├── *.conf                  # Nginx configs
├── *.config.js             # Various configs
├── package.json            # All dependencies
└── index.html              # Entry point
```

### New Structure ✅
```
kids_web_competition/
├── README.md               # Main documentation
├── package.json            # Monorepo workspace config
├── .env, .env.example      # Environment files
│
├── frontend/               # All frontend code
│   ├── src/                # React source code
│   ├── public/             # Static assets
│   ├── dist/               # Build output
│   ├── index.html          # Entry point
│   ├── vite.config.ts      # Vite config
│   ├── tsconfig.json       # TypeScript config
│   ├── package.json        # Frontend dependencies
│   └── README.md           # Frontend docs
│
├── backend/                # Backend code (unchanged)
│   ├── src/                # Express API
│   ├── package.json        # Backend dependencies
│   └── README.md           # Backend docs
│
├── deployment/             # Deployment configs
│   ├── nginx/              # All nginx configs
│   ├── pm2/                # All PM2 configs
│   ├── vercel/             # Vercel config
│   ├── netlify/            # Netlify config
│   ├── scripts/            # Deployment scripts
│   └── README.md           # Deployment docs
│
├── development/            # Dev resources
│   ├── examples/           # Example code
│   ├── scripts/            # Dev scripts
│   └── README.md           # Dev docs
│
└── docs/                   # All documentation
    ├── deployment/         # Deployment guides
    ├── setup/              # Setup guides
    ├── features/           # Feature docs
    ├── maintenance/        # Maintenance docs
    └── README.md           # Docs index
```

## Key Changes

### 1. Monorepo Workspace Structure

- **Root `package.json`** is now a workspace coordinator
- **Frontend** has its own `package.json` in `/frontend`
- **Backend** keeps its `package.json` in `/backend`

### 2. Frontend Relocation

- `/src` → `/frontend/src`
- `/public` → `/frontend/public`
- `/dist` → `/frontend/dist`
- `index.html` → `/frontend/index.html`
- All frontend configs moved to `/frontend`

### 3. Deployment Consolidation

- All nginx configs → `/deployment/nginx/`
- All PM2 configs → `/deployment/pm2/`
- Platform configs (Vercel, Netlify) → `/deployment/`
- Deployment scripts → `/deployment/scripts/`

### 4. Documentation Organization

- All `.md` files → `/docs/` (organized by category)
- Kept `README.md` at root
- Each major directory has its own README

### 5. Removed Directories

- ❌ `/supabase` - Removed (using MongoDB instead)
- ❌ `/doc` - Moved contents to `/docs`
- ❌ `/examples` - Moved to `/development/examples`

## Migration Steps for Developers

### Step 1: Update Your Local Repository

```bash
# Make sure you're on main branch with latest changes
git checkout main
git pull origin main

# Your working directory will automatically update
```

### Step 2: Clean and Reinstall Dependencies

```bash
# Remove old node_modules
rm -rf node_modules
rm -rf frontend/node_modules
rm -rf backend/node_modules

# Remove old lockfiles
rm -f package-lock.json
rm -f frontend/package-lock.json

# Install fresh dependencies
npm install
```

This will:
- Install root workspace dependencies
- Install frontend dependencies automatically
- Install backend dependencies automatically

### Step 3: Update Your Development Commands

#### Old Commands ❌
```bash
npm run dev        # Started frontend only
npm run build      # Built to ./dist
```

#### New Commands ✅
```bash
# Start both frontend and backend
npm run dev

# Or start individually
npm run dev:frontend   # Frontend only
npm run dev:backend    # Backend only

# Build
npm run build:frontend  # Builds to ./frontend/dist
```

### Step 4: Update Environment Files

No changes needed to `.env` files - they remain at the root and in `/backend` as before.

### Step 5: Update Your IDE/Editor Settings

If you have workspace-specific settings:

**VS Code** (`.vscode/settings.json`):
```json
{
  "typescript.tsdk": "frontend/node_modules/typescript/lib",
  "eslint.workingDirectories": [
    "frontend",
    "backend"
  ]
}
```

**Path aliases**: No changes needed - the `@` alias still works in frontend code.

## Updated Workflows

### Development Workflow

```bash
# 1. Pull latest changes
git pull

# 2. Install dependencies (if needed)
npm install

# 3. Start development
npm run dev

# Frontend: http://localhost:8080
# Backend: http://localhost:3000
```

### Build Workflow

```bash
# Build frontend
npm run build:frontend

# Output: frontend/dist/
```

### Deployment Workflow

```bash
# 1. Build frontend locally
npm run build:frontend

# 2. Upload to VPS
rsync -avz ./ root@YOUR_VPS:/var/www/kids-competition/

# 3. SSH and deploy
ssh root@YOUR_VPS
cd /var/www/kids-competition
bash deployment/scripts/DEPLOY_VPS.sh
```

### PM2 Workflow

```bash
# Start backend with PM2
pm2 start deployment/pm2/backend-ecosystem.config.js

# View logs
pm2 logs kids-competition-api

# Stop/restart
pm2 stop kids-competition-api
pm2 restart kids-competition-api
```

## Path Changes

### Import Paths in Code

✅ **No changes needed!** The `@` alias still works:
```typescript
import { Button } from "@/components/ui/button"
```

### File References

If you have scripts or configs that reference paths:

#### Old ❌
```bash
./dist
./src
./public
./ecosystem.config.js
./nginx-kids-competition.conf
```

#### New ✅
```bash
./frontend/dist
./frontend/src
./frontend/public
./deployment/pm2/backend-ecosystem.config.js
./deployment/nginx/nginx-kids-competition.conf
```

## Common Issues and Solutions

### Issue 1: "Module not found" errors

**Solution**:
```bash
rm -rf node_modules frontend/node_modules backend/node_modules
npm install
```

### Issue 2: Frontend dev server won't start

**Solution**:
```bash
cd frontend
npm run dev
```
Or from root:
```bash
npm run dev:frontend
```

### Issue 3: Build outputs to wrong location

**Solution**: Build files now go to `frontend/dist/` instead of `./dist`. Update any scripts that reference the build directory.

### Issue 4: PM2 can't find script

**Solution**: Update PM2 commands to use new path:
```bash
# Old
pm2 start backend/ecosystem.config.js

# New
pm2 start deployment/pm2/backend-ecosystem.config.js
```

### Issue 5: Nginx 404 errors after deployment

**Solution**: Update nginx config root path:
```nginx
# Old
root /var/www/kids-competition/dist;

# New
root /var/www/kids-competition/frontend/dist;
```

## Benefits of New Structure

### For Developers

✅ **Clear separation** - Frontend and backend are clearly separated
✅ **Independent work** - Teams can work independently without conflicts
✅ **Better navigation** - Easier to find files
✅ **Reduced conflicts** - Separate configs reduce merge conflicts

### For DevOps

✅ **Organized configs** - All deployment files in one place
✅ **Clear documentation** - Deployment docs organized by topic
✅ **Easier maintenance** - Configs grouped logically

### For Everyone

✅ **Better onboarding** - New team members can navigate easily
✅ **Improved collaboration** - Clear ownership boundaries
✅ **Scalability** - Structure supports future growth

## Quick Command Reference

### Development
```bash
npm run dev                # Start both frontend and backend
npm run dev:frontend       # Frontend only (port 8080)
npm run dev:backend        # Backend only (port 3000)
```

### Building
```bash
npm run build              # Build frontend
npm run build:frontend     # Build frontend (explicit)
```

### Linting
```bash
npm run lint               # Lint frontend code
```

### Workspace Commands
```bash
npm install                           # Install all workspaces
npm install <pkg> --workspace=frontend   # Install to frontend
npm install <pkg> --workspace=backend    # Install to backend
```

### PM2
```bash
pm2 start deployment/pm2/backend-ecosystem.config.js
pm2 logs
pm2 restart all
```

## Documentation

All documentation has been reorganized in `/docs`:

- **Deployment**: `/docs/deployment/`
- **Setup**: `/docs/setup/`
- **Features**: `/docs/features/`
- **Maintenance**: `/docs/maintenance/`

See `/docs/README.md` for the complete documentation index.

## Need Help?

1. **Check README files** - Each directory has its own README
2. **Review documentation** - See `/docs/README.md`
3. **Common issues** - Check this guide's "Common Issues" section
4. **Ask the team** - Don't hesitate to ask questions

## Rollback (If Needed)

If you encounter issues with the new structure:

```bash
# The old structure is preserved in git history
git log --oneline --graph

# To see files before restructure
git show COMMIT_HASH:path/to/file
```

## Checklist for Team Members

- [ ] Pull latest changes from main branch
- [ ] Clean install dependencies (`rm -rf node_modules && npm install`)
- [ ] Test frontend dev server (`npm run dev:frontend`)
- [ ] Test backend dev server (`npm run dev:backend`)
- [ ] Test build process (`npm run build:frontend`)
- [ ] Update any custom scripts you have
- [ ] Update IDE settings if needed
- [ ] Review new README files
- [ ] Bookmark `/docs/README.md` for documentation reference

## Questions?

Contact the maintainers or open an issue in the repository.

---

**Migration completed**: December 29, 2025
**Git branch**: `feature/restructure`
**PR**: (to be created)
