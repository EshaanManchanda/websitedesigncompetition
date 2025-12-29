import { useMemo } from 'react';
import {
  getCompetitionYear,
  getRegistrationOpenDate,
  getRegistrationCloseDate,
  getSubmissionDeadline,
  getResultsAnnouncementDate,
  isRegistrationOpen,
  formatDateForDisplay,
  formatDeadlineWithTime,
  getDaysUntil,
  isPast,
  isFuture,
  getRegistrationStatusMessage,
} from '@/utils/dateConfig';

/**
 * React hook for accessing competition dates with memoization
 * Provides all date-related functionality in a React-friendly way
 */
export const useDates = () => {
  // Memoize all date values to prevent unnecessary recalculations
  const competitionYear = useMemo(() => getCompetitionYear(), []);
  const registrationOpenDate = useMemo(() => getRegistrationOpenDate(), []);
  const registrationCloseDate = useMemo(() => getRegistrationCloseDate(), []);
  const submissionDeadline = useMemo(() => getSubmissionDeadline(), []);
  const resultsAnnouncementDate = useMemo(() => getResultsAnnouncementDate(), []);
  const registrationOpen = useMemo(() => isRegistrationOpen(), []);
  const registrationStatusMessage = useMemo(() => getRegistrationStatusMessage(), []);

  // Memoize formatted dates
  const formattedDates = useMemo(() => ({
    // Submission deadline in various formats
    submissionDeadlineShort: formatDateForDisplay(submissionDeadline, 'dd-MM-yyyy'),
    submissionDeadlineFull: formatDateForDisplay(submissionDeadline, 'dd-MM-yyyy'),
    submissionDeadlineWithTime: formatDeadlineWithTime(submissionDeadline),

    // Results announcement in various formats
    resultsAnnouncementShort: formatDateForDisplay(resultsAnnouncementDate, 'dd-MM-yyyy'),
    resultsAnnouncementFull: formatDateForDisplay(resultsAnnouncementDate, 'dd-MM-yyyy'),

    // Registration dates
    registrationOpenFull: formatDateForDisplay(registrationOpenDate, 'dd-MM-yyyy'),
    registrationCloseFull: formatDateForDisplay(registrationCloseDate, 'dd-MM-yyyy'),
    registrationCloseWithTime: formatDeadlineWithTime(registrationCloseDate),
  }), [submissionDeadline, resultsAnnouncementDate, registrationOpenDate, registrationCloseDate]);

  // Memoize days until key dates
  const daysUntil = useMemo(() => ({
    submission: getDaysUntil(submissionDeadline),
    results: getDaysUntil(resultsAnnouncementDate),
    registrationClose: getDaysUntil(registrationCloseDate),
  }), [submissionDeadline, resultsAnnouncementDate, registrationCloseDate]);

  // Memoize date status checks
  const dateStatus = useMemo(() => ({
    submissionPassed: isPast(submissionDeadline),
    resultsPassed: isPast(resultsAnnouncementDate),
    registrationClosePassed: isPast(registrationCloseDate),
    submissionUpcoming: isFuture(submissionDeadline),
    resultsUpcoming: isFuture(resultsAnnouncementDate),
  }), [submissionDeadline, resultsAnnouncementDate, registrationCloseDate]);

  return {
    // Raw date objects
    competitionYear,
    registrationOpenDate,
    registrationCloseDate,
    submissionDeadline,
    resultsAnnouncementDate,

    // Registration status
    registrationOpen,
    registrationStatusMessage,

    // Formatted dates
    ...formattedDates,

    // Days until
    daysUntil,

    // Date status
    dateStatus,

    // Utility functions (for custom formatting)
    formatDate: formatDateForDisplay,
    formatDeadline: formatDeadlineWithTime,
  };
};
