/**
 * Send Contact Email Edge Function
 * Sends notification to admin when a contact form is submitted
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Contact data interface
interface ContactData {
  id?: string;
  name: string;
  email: string;
  age: string;
  subject: string;
  message: string;
  created_at?: string;
}

// Email configuration interface
interface EmailConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  fromEmail: string;
}

/**
 * Get email configuration based on environment
 */
function getEmailConfig(env: 'development' | 'production'): EmailConfig {
  const isDev = env === 'development';

  return {
    host: Deno.env.get(isDev ? 'SMTP_HOST_DEV' : 'SMTP_HOST') ||
          Deno.env.get('SMTP_HOST') ||
          'smtp.mailtrap.io',
    port: parseInt(
      Deno.env.get(isDev ? 'SMTP_PORT_DEV' : 'SMTP_PORT') ||
      Deno.env.get('SMTP_PORT') ||
      '2525'
    ),
    username: Deno.env.get(isDev ? 'SMTP_USER_DEV' : 'SMTP_USER') ||
              Deno.env.get('SMTP_USER') ||
              '',
    password: Deno.env.get(isDev ? 'SMTP_PASSWORD_DEV' : 'SMTP_PASSWORD') ||
              Deno.env.get('SMTP_PASSWORD') ||
              '',
    fromEmail: Deno.env.get('FROM_EMAIL') || 'noreply@kidswebcomp.com',
  };
}

/**
 * Format date for email display
 */
function formatEmailDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  } catch {
    return dateString;
  }
}

/**
 * Get subject label for display
 */
function getSubjectLabel(subject: string): string {
  const labels: Record<string, string> = {
    'competition-rules': 'Competition Rules',
    'submission-help': 'Submission Help',
    'technical-support': 'Technical Support',
    'prizes': 'Prizes & Awards',
    'general-question': 'General Question',
    'other': 'Other'
  };
  return labels[subject] || subject;
}

/**
 * Generate HTML email template for admin notification
 */
function generateAdminEmailHtml(data: ContactData): string {
  const subjectLabel = getSubjectLabel(data.subject);
  const submittedAt = formatEmailDate(data.created_at || new Date().toISOString());

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .content {
      padding: 30px;
    }
    .info-box {
      background-color: #f8f9fa;
      border-left: 4px solid #667eea;
      padding: 15px;
      margin: 20px 0;
    }
    .info-row {
      display: flex;
      margin-bottom: 10px;
    }
    .info-label {
      font-weight: bold;
      color: #667eea;
      min-width: 120px;
    }
    .info-value {
      color: #333;
    }
    .message-box {
      background-color: #fff;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      padding: 20px;
      margin: 20px 0;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
    .footer {
      background-color: #f8f9fa;
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #666;
    }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      background-color: #667eea;
      color: white;
      border-radius: 12px;
      font-size: 12px;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📧 New Contact Form Submission</h1>
      <p style="margin: 10px 0 0 0;">Kids Web Design Competition</p>
    </div>

    <div class="content">
      <p>A new contact form has been submitted. Please review and respond as needed.</p>

      <div class="info-box">
        <div class="info-row">
          <div class="info-label">Name:</div>
          <div class="info-value">${data.name}</div>
        </div>
        <div class="info-row">
          <div class="info-label">Email:</div>
          <div class="info-value"><a href="mailto:${data.email}">${data.email}</a></div>
        </div>
        <div class="info-row">
          <div class="info-label">Age:</div>
          <div class="info-value">${data.age} years old</div>
        </div>
        <div class="info-row">
          <div class="info-label">Subject:</div>
          <div class="info-value"><span class="badge">${subjectLabel}</span></div>
        </div>
        <div class="info-row">
          <div class="info-label">Submitted:</div>
          <div class="info-value">${submittedAt}</div>
        </div>
        ${data.id ? `
        <div class="info-row">
          <div class="info-label">ID:</div>
          <div class="info-value">${data.id}</div>
        </div>
        ` : ''}
      </div>

      <h3>Message:</h3>
      <div class="message-box">${data.message}</div>

      <p style="margin-top: 30px; padding: 15px; background-color: #fff3cd; border-radius: 4px; border-left: 4px solid #ffc107;">
        <strong>⚡ Action Required:</strong> Please respond to this inquiry within 24 hours.
      </p>
    </div>

    <div class="footer">
      <p>This is an automated notification from the Kids Web Design Competition platform.</p>
      <p>Contact ID: ${data.id || 'N/A'}</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Send email with retry logic
 */
async function sendEmail(
  to: string,
  subject: string,
  htmlBody: string,
  config: EmailConfig,
  maxRetries: number = 3
): Promise<{ success: boolean; error?: string }> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Sending email attempt ${attempt}/${maxRetries}...`);
      console.log(`To: ${to}`);
      console.log(`Subject: ${subject}`);

      const client = new SMTPClient({
        connection: {
          hostname: config.host,
          port: config.port,
          tls: config.port === 465,
          auth: {
            username: config.username,
            password: config.password,
          },
        },
      });

      await client.send({
        from: config.fromEmail,
        to: to,
        subject: subject,
        content: htmlBody.replace(/<[^>]+>/g, ''),
        html: htmlBody,
      });

      await client.close();

      console.log(`✅ Email sent successfully to ${to}`);
      return { success: true };
    } catch (error) {
      lastError = error as Error;
      console.error(`❌ Email send attempt ${attempt} failed:`, error);

      // Wait before retrying (exponential backoff)
      if (attempt < maxRetries) {
        const waitTime = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
        console.log(`Waiting ${waitTime}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }

  const errorMessage = lastError?.message || 'Unknown error';
  console.error(`❌ All email send attempts failed: ${errorMessage}`);
  return {
    success: false,
    error: errorMessage,
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('📧 Send Contact Email Function Started');

    // Get request body
    const data: ContactData = await req.json();
    console.log(`Processing contact form from: ${data.name} (${data.email})`);

    // Determine environment
    const appEnv = Deno.env.get('APP_ENV') || 'production';
    const environment: 'development' | 'production' =
      appEnv === 'development' ? 'development' : 'production';

    console.log(`Environment: ${environment}`);

    // Get email configuration
    const emailConfig = getEmailConfig(environment);
    const adminEmail = Deno.env.get('ADMIN_EMAIL') || 'admin@kidswebcomp.com';

    // Generate email HTML
    const emailHtml = generateAdminEmailHtml(data);

    // Send admin notification email
    console.log(`Sending contact notification to ${adminEmail}...`);
    const result = await sendEmail(
      adminEmail,
      `Contact Form: ${getSubjectLabel(data.subject)} - ${data.name}`,
      emailHtml,
      emailConfig
    );

    if (result.success) {
      console.log('✅ Contact notification sent successfully');
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Contact notification sent to admin',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    } else {
      console.error('❌ Failed to send contact notification');
      return new Response(
        JSON.stringify({
          success: false,
          error: result.error || 'Failed to send email',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      );
    }

  } catch (error) {
    console.error('❌ Error in send-contact-email function:', error);

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
