/**
 * Environment Variable Validation
 * Validates required environment variables on application startup
 */

interface EnvValidationResult {
  valid: boolean;
  missing: string[];
  warnings: string[];
}

/**
 * Required environment variables
 */
const REQUIRED_ENV_VARS = [
  'VITE_API_URL',
];

/**
 * Optional but recommended environment variables
 */
const RECOMMENDED_ENV_VARS = [
  'VITE_COMPETITION_YEAR',
  'VITE_REGISTRATION_OPEN_DATE',
  'VITE_REGISTRATION_CLOSE_DATE',
  'VITE_SUBMISSION_DEADLINE',
  'VITE_RESULTS_ANNOUNCEMENT_DATE',
  'VITE_MAX_FILE_SIZE_MB',
];

/**
 * Validate environment variables
 */
export function validateEnvironmentVariables(): EnvValidationResult {
  const missing: string[] = [];
  const warnings: string[] = [];

  // Check required variables
  for (const varName of REQUIRED_ENV_VARS) {
    const value = import.meta.env[varName];
    if (!value || value.trim() === '') {
      missing.push(varName);
    }
  }

  // Check recommended variables
  for (const varName of RECOMMENDED_ENV_VARS) {
    const value = import.meta.env[varName];
    if (!value || value.trim() === '') {
      warnings.push(varName);
    }
  }

  // Additional validation for API URL format
  const apiUrl = import.meta.env.VITE_API_URL;
  if (apiUrl && !apiUrl.startsWith('http://') && !apiUrl.startsWith('https://')) {
    warnings.push('VITE_API_URL should start with http:// or https://');
  }

  const valid = missing.length === 0;

  return {
    valid,
    missing,
    warnings,
  };
}

/**
 * Log validation results to console
 */
export function logValidationResults(result: EnvValidationResult): void {
  if (result.valid) {
    console.log('✅ Environment variables validated successfully');
  } else {
    console.error('❌ Environment validation failed!');
    console.error('Missing required variables:', result.missing);
  }

  if (result.warnings.length > 0) {
    console.warn('⚠️ Missing recommended environment variables:');
    result.warnings.forEach(warning => console.warn(`  - ${warning}`));
    console.warn('The application will use default values for these variables.');
  }
}

/**
 * Validate and throw error if critical variables are missing
 */
export function validateOrThrow(): void {
  const result = validateEnvironmentVariables();
  logValidationResults(result);

  if (!result.valid) {
    throw new Error(
      `Missing required environment variables: ${result.missing.join(', ')}. ` +
      'Please check your .env file and ensure all required variables are set.'
    );
  }
}

/**
 * Get environment information for debugging
 */
export function getEnvironmentInfo(): Record<string, string> {
  return {
    mode: import.meta.env.MODE || 'unknown',
    dev: import.meta.env.DEV ? 'true' : 'false',
    prod: import.meta.env.PROD ? 'true' : 'false',
    apiConfigured: import.meta.env.VITE_API_URL ? 'yes' : 'no',
    datesConfigured: import.meta.env.VITE_COMPETITION_YEAR ? 'yes' : 'no',
  };
}
