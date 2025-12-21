const fs = require('fs').promises;
const path = require('path');

/**
 * Template Service
 * Handles email template rendering with Mustache-style syntax
 */

/**
 * Simple Mustache-style template renderer
 * Supports: {{variable}}, {{#condition}}...{{/condition}}, {{^condition}}...{{/condition}}
 */
const renderTemplate = (template, data) => {
  let result = template;

  // Replace simple variables {{variable}}
  result = result.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return data[key] !== undefined && data[key] !== null ? data[key] : '';
  });

  // Handle conditional blocks {{#variable}}...{{/variable}}
  result = result.replace(/\{\{#(\w+)\}\}([\s\S]*?)\{\{\/\1\}\}/g, (match, key, content) => {
    const value = data[key];
    if (value && value !== false && value !== null && value !== undefined) {
      // Recursively render the content inside the conditional
      return renderTemplate(content, data);
    }
    return '';
  });

  // Handle inverted conditional blocks {{^variable}}...{{/variable}}
  result = result.replace(/\{\{\^(\w+)\}\}([\s\S]*?)\{\{\/\1\}\}/g, (match, key, content) => {
    const value = data[key];
    if (!value || value === false || value === null || value === undefined) {
      // Recursively render the content inside the inverted conditional
      return renderTemplate(content, data);
    }
    return '';
  });

  return result;
};

/**
 * Load and render email template
 * @param {string} templateName - Name of template file (without .html)
 * @param {Object} data - Data to populate template
 * @returns {Promise<string>} - Rendered HTML
 */
const loadAndRenderTemplate = async (templateName, data) => {
  try {
    const templatePath = path.join(__dirname, '../templates/emails', `${templateName}.html`);
    const template = await fs.readFile(templatePath, 'utf-8');
    return renderTemplate(template, data);
  } catch (error) {
    console.error(`Error loading template ${templateName}:`, error);
    throw new Error(`Failed to load email template: ${templateName}`);
  }
};

/**
 * Format date for email display
 */
const formatEmailDate = (dateString) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateString;
  }
};

/**
 * Format file size for display
 */
const formatFileSize = (bytes) => {
  if (!bytes) return 'N/A';
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Get subject label for contact form
 */
const getSubjectLabel = (subject) => {
  const labels = {
    'competition-rules': 'Competition Rules',
    'submission-help': 'Submission Help',
    'technical-support': 'Technical Support',
    'prizes': 'Prizes & Awards',
    'general-question': 'General Question',
    'other': 'Other'
  };
  return labels[subject] || subject;
};

/**
 * Capitalize first letter of each word
 */
const capitalize = (str) => {
  if (!str) return '';
  return str.split(' ').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
};

module.exports = {
  renderTemplate,
  loadAndRenderTemplate,
  formatEmailDate,
  formatFileSize,
  getSubjectLabel,
  capitalize
};
