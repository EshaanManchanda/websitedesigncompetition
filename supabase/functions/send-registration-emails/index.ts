/**
 * Send Registration Emails Edge Function
 * Handles sending confirmation emails to students, parents, and admin
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import {
  sendEmail,
  getEmailConfig,
  loadTemplate,
  renderTemplate,
  formatFileSize,
  formatEmailDate
} from "./emailService.ts";

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Registration data interface
interface RegistrationData {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  age: string;
  school: string;
  parent_name: string;
  parent_email: string;
  category: string;
  experience: string;
  agree_terms: boolean;
  agree_newsletter: boolean;
  submission_file_url?: string;
  submission_file_name?: string;
  submission_file_size?: number;
  submission_file_type?: string;
  submission_uploaded_at?: string;
  created_at?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('📧 Send Registration Emails Function Started');

    // Get request body
    const data: RegistrationData = await req.json();
    console.log(`Processing registration for: ${data.first_name} ${data.last_name}`);

    // Determine environment (check APP_ENV or default to production)
    const appEnv = Deno.env.get('APP_ENV') || 'production';
    const environment: 'development' | 'production' =
      appEnv === 'development' ? 'development' : 'production';

    console.log(`Environment: ${environment}`);

    // Get email configuration
    const emailConfig = getEmailConfig(environment);
    const adminEmail = Deno.env.get('ADMIN_EMAIL') || 'admin@kidswebcomp.com';
    const competitionYear = Deno.env.get('COMPETITION_YEAR') || new Date().getFullYear().toString();

    // Prepare template data
    const templateData = {
      // Student info
      firstName: data.first_name,
      lastName: data.last_name,
      email: data.email,
      age: data.age,
      school: data.school,

      // Parent info
      parentName: data.parent_name,
      parentEmail: data.parent_email,

      // Competition details
      category: data.category,
      experience: data.experience.charAt(0).toUpperCase() + data.experience.slice(1),

      // Dates (from environment or defaults)
      competitionYear: competitionYear,
      registrationOpenDate: Deno.env.get('REGISTRATION_OPEN_DATE') || 'January 1, 2025',
      registrationCloseDate: Deno.env.get('REGISTRATION_CLOSE_DATE') || 'March 15, 2025',
      submissionDeadline: Deno.env.get('SUBMISSION_DEADLINE') || 'March 31, 2025 at 11:59 PM',
      resultsAnnouncementDate: Deno.env.get('RESULTS_ANNOUNCEMENT_DATE') || 'April 15, 2025',

      // File upload info
      submissionFileUrl: data.submission_file_url || '',
      submissionFileName: data.submission_file_name || '',
      submissionFileSize: data.submission_file_size ? formatFileSize(data.submission_file_size) : '',
      submissionFileType: data.submission_file_type || '',
      submissionUploadedAt: data.submission_uploaded_at ? formatEmailDate(data.submission_uploaded_at) : '',

      // Agreement flags
      agreeTerms: data.agree_terms,
      agreeNewsletter: data.agree_newsletter,

      // Meta
      registrationDate: formatEmailDate(data.created_at || new Date().toISOString()),
      registrationId: data.id || 'N/A',
      adminEmail: adminEmail,
    };

    // Results tracking
    const results = {
      studentEmail: { sent: false, error: '' },
      parentEmail: { sent: false, error: '' },
      adminEmail: { sent: false, error: '' },
    };

    // Load templates
    console.log('Loading email templates...');
    const studentTemplate = await loadTemplate('student_confirmation');
    const parentTemplate = await loadTemplate('parent_confirmation');
    const adminTemplate = await loadTemplate('admin_notification');

    // Send student confirmation email (if student email is provided)
    if (data.email && data.email.trim()) {
      console.log(`Sending student confirmation to ${data.email}...`);
      const studentHtml = renderTemplate(studentTemplate, templateData);
      const studentResult = await sendEmail(
        {
          to: data.email,
          subject: `Welcome to Kids Web Design Competition ${competitionYear}! 🎉`,
          htmlBody: studentHtml,
        },
        emailConfig
      );
      results.studentEmail = {
        sent: studentResult.success,
        error: studentResult.error || ''
      };
    } else {
      console.log('No student email provided, skipping student confirmation');
      results.studentEmail = { sent: false, error: 'No email provided' };
    }

    // Send parent confirmation email (always send to parent)
    if (data.parent_email && data.parent_email.trim()) {
      console.log(`Sending parent confirmation to ${data.parent_email}...`);
      const parentHtml = renderTemplate(parentTemplate, templateData);
      const parentResult = await sendEmail(
        {
          to: data.parent_email,
          subject: `${data.first_name}'s Registration Confirmed - Kids Web Design Competition ${competitionYear}`,
          htmlBody: parentHtml,
        },
        emailConfig
      );
      results.parentEmail = {
        sent: parentResult.success,
        error: parentResult.error || ''
      };
    } else {
      console.log('⚠️ Warning: No parent email provided');
      results.parentEmail = { sent: false, error: 'No parent email provided' };
    }

    // Send admin notification email
    console.log(`Sending admin notification to ${adminEmail}...`);
    const adminHtml = renderTemplate(adminTemplate, templateData);
    const adminResult = await sendEmail(
      {
        to: adminEmail,
        subject: `New Registration: ${data.first_name} ${data.last_name} - ${data.category}`,
        htmlBody: adminHtml,
      },
      emailConfig
    );
    results.adminEmail = {
      sent: adminResult.success,
      error: adminResult.error || ''
    };

    // Calculate success summary
    const totalSent = Object.values(results).filter(r => r.sent).length;
    const totalAttempted = Object.values(results).filter(r => r.sent || r.error).length;

    console.log(`📊 Email Summary: ${totalSent}/${totalAttempted} emails sent successfully`);
    console.log('Results:', JSON.stringify(results, null, 2));

    // Return response
    return new Response(
      JSON.stringify({
        success: totalSent > 0, // Consider success if at least one email sent
        partialSuccess: totalSent > 0 && totalSent < totalAttempted,
        results: results,
        summary: {
          sent: totalSent,
          attempted: totalAttempted,
        },
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: totalSent > 0 ? 200 : 500,
      }
    );

  } catch (error) {
    console.error('❌ Error in send-registration-emails function:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
