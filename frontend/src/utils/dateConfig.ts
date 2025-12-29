import { format, parseISO, isAfter, isBefore } from 'date-fns';

/**
 * Date Configuration Utility
 * Centralizes all competition date management with environment variable support
 */

// Default fallback dates if environment variables are missing
const DEFAULT_COMPETITION_YEAR = 2025;
const DEFAULT_REGISTRATION_OPEN = '2025-01-01';
const DEFAULT_REGISTRATION_CLOSE = '2025-03-15T23:59:59';
const DEFAULT_SUBMISSION_DEADLINE = '2025-03-31T23:59:59';
const DEFAULT_RESULTS_ANNOUNCEMENT = '2025-04-15';

/**
 * Get competition year from environment or default
 */
export const getCompetitionYear = (): number => {
  const envYear = import.meta.env.VITE_COMPETITION_YEAR;
  if (envYear) {
    const year = parseInt(envYear, 10);
    if (!isNaN(year) && year >= 2024 && year <= 2030) {
      return year;
    }
    console.warn(`Invalid VITE_COMPETITION_YEAR: ${envYear}. Using default: ${DEFAULT_COMPETITION_YEAR}`);
  }
  return DEFAULT_COMPETITION_YEAR;
};

/**
 * Parse a date string from environment variable with fallback
 */
const parseDateFromEnv = (envKey: string, defaultValue: string): Date => {
  const envValue = import.meta.env[envKey];
  const dateString = envValue || defaultValue;

  try {
    const parsedDate = parseISO(dateString);
    if (isNaN(parsedDate.getTime())) {
      console.warn(`Invalid date for ${envKey}: ${dateString}. Using default: ${defaultValue}`);
      return parseISO(defaultValue);
    }
    return parsedDate;
  } catch (error) {
    console.error(`Error parsing date for ${envKey}:`, error);
    return parseISO(defaultValue);
  }
};

/**
 * Get registration open date
 */
export const getRegistrationOpenDate = (): Date => {
  return parseDateFromEnv('VITE_REGISTRATION_OPEN_DATE', DEFAULT_REGISTRATION_OPEN);
};

/**
 * Get registration close date
 */
export const getRegistrationCloseDate = (): Date => {
  return parseDateFromEnv('VITE_REGISTRATION_CLOSE_DATE', DEFAULT_REGISTRATION_CLOSE);
};

/**
 * Get submission deadline date
 */
export const getSubmissionDeadline = (): Date => {
  return parseDateFromEnv('VITE_SUBMISSION_DEADLINE', DEFAULT_SUBMISSION_DEADLINE);
};

/**
 * Get results announcement date
 */
export const getResultsAnnouncementDate = (): Date => {
  return parseDateFromEnv('VITE_RESULTS_ANNOUNCEMENT_DATE', DEFAULT_RESULTS_ANNOUNCEMENT);
};

/**
 * Check if registration is currently open
 */
export const isRegistrationOpen = (): boolean => {
  const now = new Date();
  const openDate = getRegistrationOpenDate();
  const closeDate = getRegistrationCloseDate();

  return isAfter(now, openDate) && isBefore(now, closeDate);
};

/**
 * Format a date for display
 * @param date Date to format
 * @param formatString Format pattern (date-fns format)
 */
export const formatDateForDisplay = (date: Date, formatString: string = 'dd-MM-yyyy'): string => {
  try {
    return format(date, formatString);
  } catch (error) {
    console.error('Error formatting date:', error);
    return date.toLocaleDateString();
  }
};

/**
 * Format deadline with time (e.g., "31-03-2025 at 23:59")
 */
export const formatDeadlineWithTime = (date: Date): string => {
  try {
    return format(date, "dd-MM-yyyy 'at' HH:mm");
  } catch (error) {
    console.error('Error formatting deadline:', error);
    return date.toLocaleString();
  }
};

/**
 * Get the number of days until a date
 */
export const getDaysUntil = (date: Date): number => {
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

/**
 * Check if a date is in the past
 */
export const isPast = (date: Date): boolean => {
  return isBefore(date, new Date());
};

/**
 * Check if a date is in the future
 */
export const isFuture = (date: Date): boolean => {
  return isAfter(date, new Date());
};

/**
 * Get registration status message
 */
export const getRegistrationStatusMessage = (): string => {
  const now = new Date();
  const openDate = getRegistrationOpenDate();
  const closeDate = getRegistrationCloseDate();

  if (isBefore(now, openDate)) {
    const daysUntil = getDaysUntil(openDate);
    return `Registration opens on ${formatDateForDisplay(openDate)} (in ${daysUntil} days)`;
  }

  if (isAfter(now, closeDate)) {
    return `Registration closed on ${formatDateForDisplay(closeDate)}`;
  }

  const daysRemaining = getDaysUntil(closeDate);
  return `Registration closes on ${formatDateForDisplay(closeDate)} (${daysRemaining} days remaining)`;
};
