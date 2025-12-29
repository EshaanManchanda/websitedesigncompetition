# Development

This directory contains development resources, tools, examples, and scripts to help developers work on the Kids Web Competition project.

## Directory Structure

```
development/
├── examples/       # Example code and integrations
├── scripts/        # Development utility scripts
└── README.md       # This file
```

## Examples (`examples/`)

### Third-Party Integrations

Located in `examples/third-party-integrations/`:

#### Stripe Integration
Example code for integrating Stripe payment processing.

**Note**: These are examples and reference implementations. Adapt them to your specific needs before using in production.

## Scripts (`scripts/`)

Development scripts and utilities will be added here as needed. Examples:
- Build scripts
- Testing utilities
- Database seeding scripts
- Development environment setup

## Development Workflow

### Initial Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd kids_web_competition
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy environment examples
   cp .env.example .env
   cp backend/.env.example backend/.env
   ```

4. **Start development servers**
   ```bash
   # Start both frontend and backend
   npm run dev

   # Or start individually
   npm run dev:frontend  # Frontend on port 8080
   npm run dev:backend   # Backend on port 3000
   ```

### Code Organization

The project uses a monorepo structure:
- `/frontend` - React/Vite frontend
- `/backend` - Express.js backend
- `/deployment` - Deployment configs
- `/development` - This directory
- `/docs` - Documentation

### Development Tools

#### Available Scripts

```bash
# Development
npm run dev              # Start both frontend and backend
npm run dev:frontend     # Start frontend only
npm run dev:backend      # Start backend only

# Build
npm run build           # Build frontend for production
npm run build:frontend  # Build frontend

# Testing & Quality
npm run lint            # Lint frontend code

# Preview
npm run preview         # Preview production build locally
```

#### Editor Setup

**Recommended VS Code Extensions**:
- ESLint
- Prettier
- TypeScript and JavaScript Language Features
- Tailwind CSS IntelliSense
- Path Intellisense
- Auto Rename Tag
- GitLens

#### Code Style

- **Frontend**: TypeScript with strict mode enabled
- **Backend**: JavaScript with Node.js best practices
- **Linting**: ESLint configured for React and TypeScript
- **Formatting**: Use Prettier (if configured)
- **Naming Conventions**:
  - Components: PascalCase (`UserProfile.tsx`)
  - Functions: camelCase (`getUserData()`)
  - Constants: UPPER_SNAKE_CASE (`API_BASE_URL`)

### Git Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes and commit**
   ```bash
   git add .
   git commit -m "feat: add user authentication"
   ```

3. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

#### Commit Message Convention

Follow conventional commits:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

### Debugging

#### Frontend Debugging

1. **React Developer Tools**
   - Install browser extension
   - Inspect component hierarchy and state

2. **Network Debugging**
   - Use browser DevTools Network tab
   - Monitor API calls and responses

3. **Console Logging**
   ```typescript
   console.log('Debug info:', data);
   console.error('Error:', error);
   ```

#### Backend Debugging

1. **Node.js Debugging**
   ```bash
   node --inspect backend/src/server.js
   ```

2. **PM2 Logs**
   ```bash
   pm2 logs
   pm2 logs kids-competition-api
   ```

3. **API Testing**
   - Use Postman or Thunder Client
   - Test endpoints at `http://localhost:3000/api/*`

### Testing

**Frontend Testing** (to be implemented):
- Unit tests: Jest or Vitest
- Component tests: React Testing Library
- E2E tests: Playwright or Cypress

**Backend Testing** (to be implemented):
- Unit tests: Jest or Mocha
- Integration tests: Supertest
- API testing: Postman collections

### Database

- **Production**: MongoDB
- **Local Development**: MongoDB local instance or MongoDB Atlas

**Connection**:
- Configure `MONGODB_URI` in `backend/.env`

### API Development

#### Backend Structure

```
backend/
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Request handlers
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── middleware/     # Express middleware
│   ├── services/       # Business logic
│   ├── utils/          # Utility functions
│   └── server.js       # Entry point
```

#### Adding a New API Endpoint

1. Create model in `models/`
2. Create controller in `controllers/`
3. Define route in `routes/`
4. Register route in `app.js`

### Frontend Development

#### Component Structure

```
frontend/src/
├── components/
│   ├── ui/            # Reusable UI components
│   └── [Feature]      # Feature-specific components
├── pages/             # Page components
├── hooks/             # Custom React hooks
├── lib/               # Libraries and utilities
└── utils/             # Helper functions
```

#### Adding a New Page

1. Create page component in `pages/`
2. Add route in `App.tsx`
3. Update navigation if needed

### Performance Optimization

- Use React.memo() for expensive components
- Implement code splitting with React.lazy()
- Optimize images (use WebP, lazy loading)
- Monitor bundle size with Vite build analysis
- Use TanStack Query for efficient data fetching

### Common Issues

#### Port Already in Use
```bash
# Kill process on port 8080 (frontend)
npx kill-port 8080

# Kill process on port 3000 (backend)
npx kill-port 3000
```

#### Node Modules Issues
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

#### Build Errors
```bash
# Clear Vite cache
rm -rf frontend/.vite
npm run build:frontend
```

## Contributing

When adding new examples or scripts:

1. Document the purpose clearly
2. Include usage instructions
3. Add any dependencies to package.json
4. Update this README with new entries

## Resources

### Learning Resources
- [React Documentation](https://react.dev)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [MongoDB University](https://university.mongodb.com)

### Project Documentation
- Main README: `/README.md`
- Setup Guide: `/docs/setup/SETUP.md`
- API Documentation: (to be added)

### Useful Commands Reference

```bash
# Package management
npm install <package>              # Install dependency
npm install --save-dev <package>  # Install dev dependency
npm update                         # Update packages

# Workspace management
npm run <script> --workspace=frontend   # Run script in frontend
npm run <script> --workspace=backend    # Run script in backend

# Git
git status                        # Check status
git log --oneline --graph        # View commit history
git stash                        # Temporarily save changes
git stash pop                    # Restore stashed changes

# Process management
pm2 list                         # List PM2 processes
pm2 restart all                  # Restart all processes
pm2 save                         # Save PM2 process list
pm2 startup                      # Configure PM2 auto-start
```

## Support

For development questions:
1. Check `/docs` directory for detailed documentation
2. Review existing code for patterns and examples
3. Consult the main project README
4. Ask team members or create an issue
