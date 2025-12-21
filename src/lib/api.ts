/**
 * API Service
 * Handles all HTTP requests to the backend API
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Registration API
 */
export const registrationAPI = {
  /**
   * Submit registration with optional file upload
   */
  async submitRegistration(data: {
    firstName: string;
    lastName: string;
    email: string;
    age: string;
    school: string;
    parentName: string;
    parentEmail: string;
    category: string;
    experience: string;
    agreeTerms: boolean;
    agreeNewsletter: boolean;
  }, file?: File | null) {
    try {
      const formData = new FormData();

      // Append form fields
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value.toString());
      });

      // Append file if provided
      if (file) {
        formData.append('submissionFile', file);
      }

      const response = await fetch(`${API_URL}/registrations`, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Registration failed');
      }

      return result;
    } catch (error) {
      console.error('Registration API error:', error);
      throw error;
    }
  },

  /**
   * Check if email already exists
   */
  async checkEmailExists(email: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/registrations/check-email/${encodeURIComponent(email)}`);

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to check email');
      }

      return result.exists;
    } catch (error) {
      console.error('Check email API error:', error);
      throw error;
    }
  }
};

/**
 * Contact API
 */
export const contactAPI = {
  /**
   * Submit contact form
   */
  async submitContact(data: {
    name: string;
    email: string;
    age: string;
    subject: string;
    message: string;
  }) {
    try {
      const response = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Contact submission failed');
      }

      return result;
    } catch (error) {
      console.error('Contact API error:', error);
      throw error;
    }
  }
};
