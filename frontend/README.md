# Frontend

> React/Vite frontend application for the Kids Web Competition platform

**Part of**: [Website Designing Competition Monorepo](../README.md)
**Live Site**: [https://websitedesigningcompetition.com](https://websitedesigningcompetition.com)

## Technology Stack

- **Framework**: React 18.3.1
- **Build Tool**: Vite 5.4.1
- **Language**: TypeScript
- **UI Library**: shadcn/ui (Radix UI components)
- **Styling**: Tailwind CSS 3.4.11
- **Routing**: React Router DOM 6.26.2
- **State Management**: TanStack React Query 5.56.2
- **Forms**: React Hook Form 7.53.0 with Zod validation

## Directory Structure

```
frontend/
├── src/
│   ├── components/      # React components
│   │   ├── ui/         # shadcn UI components (Button, Card, Dialog, etc.)
│   │   ├── Header.tsx  # Site header navigation
│   │   ├── Footer.tsx  # Site footer
│   │   ├── Hero.tsx    # Homepage hero section
│   │   ├── About.tsx   # About section
│   │   ├── Rules.tsx   # Competition rules
│   │   ├── Submission.tsx # Submission guidelines
│   │   └── FAQ.tsx     # Frequently asked questions
│   ├── pages/          # Page components
│   │   ├── Index.tsx   # Homepage
│   │   ├── Register.tsx # Registration page
│   │   ├── Contact.tsx  # Contact page
│   │   └── NotFound.tsx # 404 page
│   ├── hooks/          # Custom React hooks
│   │   └── useDates.ts # Competition date management
│   ├── lib/            # Utilities and libraries
│   │   └── utils.ts    # Utility functions (cn, etc.)
│   └── utils/          # Helper functions
│       └── api.ts      # API client functions
├── public/             # Static assets
│   ├── images/        # Images and graphics
│   └── favicon.ico    # Site favicon
├── dist/              # Build output (git-ignored)
├── index.html         # HTML entry point
├── vite.config.ts     # Vite configuration
├── tailwind.config.ts # Tailwind CSS configuration
├── tsconfig.json      # TypeScript configuration
├── .env.example       # Environment variables template
└── package.json       # Dependencies and scripts
```

---

## Architecture Overview

### Application Architecture

```
User Browser
    ↓
[React Router]
    ↓
[Page Components]
    ↓
┌─────────────────────────────────┐
│     Component Hierarchy         │
│                                 │
│  Page (Index, Register, etc.)  │
│         ↓                       │
│  Section Components             │
│  (Hero, About, Rules, FAQ)     │
│         ↓                       │
│  UI Components (shadcn/ui)     │
│  (Button, Card, Input, etc.)   │
└─────────────────────────────────┘
    ↓
[Custom Hooks]
├── useDates (competition dates)
└── useToast (notifications)
    ↓
[API Layer]
└── fetch → Backend API
    ↓
[State Management]
├── React Query (server state)
└── React Hook Form (form state)
```

### Routing Structure

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | `Index.tsx` | Homepage with hero, about, rules, submission info, FAQ |
| `/register` | `Register.tsx` | Multi-step registration form with file upload |
| `/contact` | `Contact.tsx` | Contact form for questions and support |
| `*` | `NotFound.tsx` | 404 error page for undefined routes |

**Router Configuration:**
- Uses React Router DOM v6
- Browser-based routing (not hash-based)
- Smooth scrolling to sections on homepage
- Programmatic navigation with `useNavigate` hook

### Component Hierarchy

**Page Level:**
```
Index.tsx (Homepage)
├── Header
├── Hero (main banner with CTA)
├── About (competition overview)
├── Rules (competition rules)
├── Submission (submission guidelines)
├── FAQ (frequently asked questions)
└── Footer

Register.tsx (Registration)
├── Header
├── RegistrationForm
│   ├── PersonalInfoStep
│   ├── ProjectDetailsStep
│   └── FileUploadStep
└── Footer

Contact.tsx (Contact)
├── Header
├── ContactForm
│   ├── Input (name, email, age)
│   ├── Select (subject dropdown)
│   └── Textarea (message)
└── Footer
```

**Reusable Components:**
- All UI components from shadcn/ui (Button, Card, Input, Select, etc.)
- Form components with built-in validation
- Toast notifications for user feedback

### State Management

**Server State (TanStack Query):**
- API data fetching and caching
- Automatic background refetching
- Optimistic updates
- Error and loading states

**Form State (React Hook Form):**
- Registration form state
- Contact form state
- File upload state
- Validation with Zod schemas

**Local State (React useState):**
- UI state (modals, dropdowns)
- Form step navigation
- Theme preferences (dark mode)

### API Integration

**API Client (`utils/api.ts`):**
```typescript
// Base configuration
const API_URL = import.meta.env.VITE_API_URL;

// Registration endpoint
POST /api/registrations
- FormData with file upload
- multipart/form-data content type
- 50MB file size limit

// Contact endpoint
POST /api/contact
- JSON payload
- application/json content type

// Health check
GET /api/health
- Server status verification
```

**Error Handling:**
- Try-catch blocks for all API calls
- User-friendly error messages
- Toast notifications for feedback
- Validation errors displayed inline

### Form Validation

**Zod Schemas:**
- Email format validation
- Required field checks
- Age category validation (11-13, 14-17)
- File type and size validation
- Parent email confirmation

**Client-Side Validation:**
- Real-time field validation
- Submit button disabled until valid
- Error messages below fields
- File type preview before upload

### Build Process

**Development Build:**
```bash
npm run dev
# - Hot Module Replacement (HMR)
# - Source maps enabled
# - VITE_ENABLE_ROUTE_MESSAGING=true
# - No minification
# - Fast refresh
```

**Production Build:**
```bash
npm run build
# - Code minification
# - Tree shaking (removes unused code)
# - CSS purging (Tailwind)
# - Asset optimization
# - Chunk splitting
# - Output: dist/ directory
```

**Build Optimizations:**
- **Code Splitting**: Automatic route-based splitting
- **Lazy Loading**: Dynamic imports for heavy components
- **Asset Optimization**: Images compressed and optimized
- **CSS Purging**: Tailwind removes unused styles
- **Tree Shaking**: Dead code elimination
- **Minification**: JS and CSS minified
- **Gzip/Brotli**: Compression enabled in production

### Performance Considerations

**Bundle Size:**
- Main bundle: ~150KB gzipped
- Vendor bundle: React, React Router, UI libs
- Route chunks: Lazy-loaded per page
- Target: < 500KB total initial load

**Performance Techniques:**
- Memoization with `React.memo` for expensive components
- `useMemo` for expensive calculations
- `useCallback` for stable function references
- Image lazy loading with native `loading="lazy"`
- Font preloading for faster text rendering

**Lighthouse Scores (Target):**
- Performance: > 90
- Accessibility: > 95
- Best Practices: > 95
- SEO: > 90

---

## Development

### Prerequisites

- Node.js v18 or higher
- npm (comes with Node.js)

### Installation

From the project root:
```bash
npm install
```

### Commands

```bash
# Start development server (from project root)
npm run dev:frontend
# Or from frontend directory
cd frontend && npm run dev

# Build for production
npm run build:frontend
# Or from frontend directory
cd frontend && npm run build

# Preview production build
npm run preview
# Or from frontend directory
cd frontend && npm run preview

# Lint code
npm run lint
```

The development server runs on `http://localhost:8080`

## Environment Variables

Frontend environment variables must be prefixed with `VITE_` to be accessible in the browser.

### Setup

1. Copy the example file:
   ```bash
   cp frontend/.env.example frontend/.env
   ```

2. Configure your variables in `frontend/.env`:
   - `VITE_API_URL` - Backend API endpoint
   - `VITE_COMPETITION_YEAR` - Competition year
   - `VITE_REGISTRATION_OPEN_DATE` - Registration start date
   - `VITE_REGISTRATION_CLOSE_DATE` - Registration end date
   - `VITE_SUBMISSION_DEADLINE` - Submission deadline
   - `VITE_MAX_FILE_SIZE_MB` - Max file upload size

### Available Variables

See `frontend/.env.example` for all available variables and documentation.

## Build Output

Production builds are output to `frontend/dist/` directory.

## Configuration Files

- `vite.config.ts` - Vite build configuration
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `eslint.config.js` - ESLint rules
- `postcss.config.js` - PostCSS configuration
- `components.json` - shadcn/ui configuration

## Key Features

- Server-side routing with React Router
- Form validation with Zod schemas
- Toast notifications
- Responsive design
- Dark mode support (next-themes)
- File upload functionality
- Date picker components
- Rich UI component library

## API Integration

The frontend communicates with the backend API at `/api/*` endpoints. In development, these are proxied to the backend server running on port 3000.

## Learn More

### Framework Documentation

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [React Router](https://reactrouter.com)
- [React Hook Form](https://react-hook-form.com)
- [Zod](https://zod.dev)

### Related Project Documentation

- **[Root README](../README.md)** - Project overview and quick start
- **[Backend README](../backend/README.md)** - Backend API documentation
- **[Deployment Guides](../docs/deployment/)** - Vercel, Netlify, and VPS deployment
- **[Environment Variables](../docs/setup/ENVIRONMENT_VARIABLES.md)** - Environment configuration
- **[Documentation Index](../docs/README.md)** - All project documentation

---

## License

**© 2025 Website Designing Competition. All Rights Reserved.**

This is proprietary software. Unauthorized copying, modification, distribution, or use of this software is strictly prohibited.
