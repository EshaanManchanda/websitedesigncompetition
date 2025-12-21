/**
 * Email Service Module
 * Handles SMTP email sending with environment-based configuration
 * Uses npm:nodemailer for Deno compatibility
 */

import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

// Email configuration interface
export interface EmailConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  fromEmail: string;
}

// Email parameters interface
export interface EmailParams {
  to: string | string[];
  subject: string;
  htmlBody: string;
  textBody?: string;
}

/**
 * Get email configuration based on environment
 * @param env Environment (development or production)
 */
export function getEmailConfig(env: 'development' | 'production'): EmailConfig {
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
 * Send email with retry logic
 * @param params Email parameters
 * @param config Email configuration
 * @param maxRetries Maximum number of retry attempts
 */
export async function sendEmail(
  params: EmailParams,
  config: EmailConfig,
  maxRetries: number = 3
): Promise<{ success: boolean; error?: string }> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Sending email attempt ${attempt}/${maxRetries}...`);
      console.log(`To: ${Array.isArray(params.to) ? params.to.join(', ') : params.to}`);
      console.log(`Subject: ${params.subject}`);

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
        to: Array.isArray(params.to) ? params.to.join(',') : params.to,
        subject: params.subject,
        content: params.textBody || stripHtmlTags(params.htmlBody),
        html: params.htmlBody,
      });

      await client.close();

      console.log(`✅ Email sent successfully to ${params.to}`);
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

/**
 * Render email template with data
 * Simple Mustache-style template rendering
 */
export function renderTemplate(template: string, data: Record<string, any>): string {
  let rendered = template;

  // Replace {{variable}} placeholders
  Object.entries(data).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    rendered = rendered.replace(regex, value != null ? String(value) : '');
  });

  // Handle {{#variable}}...{{/variable}} conditional blocks (if truthy)
  rendered = rendered.replace(
    /{{#(\w+)}}([\s\S]*?){{\/\1}}/g,
    (match, key, content) => {
      return data[key] ? content : '';
    }
  );

  // Handle {{^variable}}...{{/variable}} conditional blocks (if falsy)
  rendered = rendered.replace(
    /{{\^(\w+)}}([\s\S]*?){{\/\1}}/g,
    (match, key, content) => {
      return !data[key] ? content : '';
    }
  );

  return rendered;
}

/**
 * Load email template from file
 */
export async function loadTemplate(templateName: string): Promise<string> {
  try {
    const templatePath = new URL(
      `./templates/${templateName}.html`,
      import.meta.url
    ).pathname;

    const template = await Deno.readTextFile(templatePath);
    return template;
  } catch (error) {
    console.error(`Failed to load template ${templateName}:`, error);
    throw new Error(`Failed to load email template: ${templateName}`);
  }
}

/**
 * Strip HTML tags for plain text email fallback
 */
function stripHtmlTags(html: string): string {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Format file size for display in emails
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Format date for email display (DD-MM-YYYY format with time)
 */
export function formatEmailDate(dateString: string): string {
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
