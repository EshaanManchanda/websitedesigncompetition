# Frontend

React/Vite frontend application for the Kids Web Competition platform.

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
│   │   └── ui/         # shadcn UI components
│   ├── pages/          # Page components
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utilities and libraries
│   └── utils/          # Helper functions
├── public/             # Static assets
├── dist/              # Build output (git-ignored)
└── index.html         # HTML entry point
```

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

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
