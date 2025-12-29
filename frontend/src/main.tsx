import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { validateOrThrow, getEnvironmentInfo } from './utils/validateEnv'

// Validate environment variables before starting the app
try {
  validateOrThrow();

  // Log environment info in development mode
  if (import.meta.env.DEV) {
    console.log('🌍 Environment Info:', getEnvironmentInfo());
  }
} catch (error) {
  console.error('Environment validation failed:', error);
  // In production, you might want to show a user-friendly error page
  // For now, we'll let the app continue with defaults and log the error
}

createRoot(document.getElementById("root")!).render(<App />);
