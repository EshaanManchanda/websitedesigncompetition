import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registrationAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useDates } from '@/hooks/useDates';
import FileUpload from '@/components/FileUpload';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  age: string;
  school: string;
  parentEmail: string;
  parentName: string;
  category: string;
  experience: string;
  agreeTerms: boolean;
  agreeNewsletter: boolean;
  uploadedFile: File | null;
}

interface FormErrors {
  [key: string]: string;
}

const Register: React.FC = () => {
  const { registrationOpen, registrationStatusMessage, registrationOpenFull, registrationCloseFull } = useDates();
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    age: '',
    school: '',
    parentEmail: '',
    parentName: '',
    category: '',
    experience: '',
    agreeTerms: false,
    agreeNewsletter: false,
    uploadedFile: null,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const ageCategories = [
    { value: '8-10', label: '8-10 years old' },
    { value: '11-13', label: '11-13 years old' },
    { value: '14-17', label: '14-17 years old' },
  ];

  const experienceLevels = [
    { value: 'beginner', label: 'Beginner - Just starting out!' },
    { value: 'intermediate', label: 'Intermediate - I know some basics' },
    { value: 'advanced', label: 'Advanced - I love coding!' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileSelect = (file: File | null) => {
    setFormData(prev => ({
      ...prev,
      uploadedFile: file
    }));
    // Clear file upload error
    if (errors.uploadedFile) {
      setErrors(prev => ({
        ...prev,
        uploadedFile: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.age) {
      newErrors.age = 'Please select your age group';
    }

    if (!formData.school.trim()) {
      newErrors.school = 'School name is required';
    }

    if (!formData.parentName.trim()) {
      newErrors.parentName = 'Parent/Guardian name is required';
    }

    if (!formData.parentEmail.trim()) {
      newErrors.parentEmail = 'Parent/Guardian email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.parentEmail)) {
      newErrors.parentEmail = 'Please enter a valid email address';
    }

    if (!formData.category) {
      newErrors.category = 'Please select an age category';
    }

    if (!formData.experience) {
      newErrors.experience = 'Please select your experience level';
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Check if email already exists
      const emailExists = await registrationAPI.checkEmailExists(formData.email);
      if (emailExists) {
        setErrors({ email: 'This email is already registered' });
        toast({
          title: "Registration Failed",
          description: "This email address is already registered. Please use a different email.",
          variant: "destructive",
        });
        return;
      }

      // Submit registration with file upload (backend handles everything)
      const result = await registrationAPI.submitRegistration({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        age: formData.age,
        school: formData.school,
        parentName: formData.parentName,
        parentEmail: formData.parentEmail,
        category: formData.category,
        experience: formData.experience,
        agreeTerms: formData.agreeTerms,
        agreeNewsletter: formData.agreeNewsletter,
      }, formData.uploadedFile);

      console.log('Registration successful:', result);

      setIsSubmitted(true);
      toast({
        title: "Registration Successful!",
        description: result.message || "Welcome to the Kids Web Design Competition!",
      });
    } catch (error) {
      console.error('Registration failed:', error);
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "An error occurred during registration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show registration closed message if registration is not open
  if (!registrationOpen) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
            <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Registration Status</h1>
            <p className="text-xl text-gray-600 mb-6">
              {registrationStatusMessage}
            </p>
            <div className="bg-blue-50 rounded-lg p-4 mb-8">
              <p className="text-gray-700">
                <span className="font-semibold">Registration Period:</span><br />
                {registrationOpenFull} - {registrationCloseFull}
              </p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-full font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to the Competition!</h1>
            <p className="text-xl text-gray-600 mb-6">
              Your registration has been submitted successfully! 🎉
            </p>
            <p className="text-gray-600 mb-8">
              We've sent a confirmation email to both you and your parent/guardian.
              If you don't receive an email within 10 minutes, please check your spam folder.
              Get ready to create something amazing!
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-full font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4">Join the Fun! 🚀</h1>
          <p className="text-xl text-white/90">
            Register for the Kids Web Design Competition and show off your creativity!
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
            <h2 className="text-3xl font-bold text-white text-center">Registration Form</h2>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Student Information */}
            <div className="bg-blue-50 rounded-2xl p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3">1</span>
                Student Information
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                      errors.firstName ? 'border-red-500 animate-shake' : 'border-gray-200'
                    }`}
                    placeholder="Enter your first name"
                    key={errors.firstName ? 'firstName-error' : 'firstName-valid'}
                  />
                  {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                      errors.lastName ? 'border-red-500 animate-shake' : 'border-gray-200'
                    }`}
                    placeholder="Enter your last name"
                    key={errors.lastName ? 'lastName-error' : 'lastName-valid'}
                  />
                  {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Your Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                      errors.email ? 'border-red-500 animate-shake' : 'border-gray-200'
                    }`}
                    placeholder="your.email@example.com"
                    key={errors.email ? 'email-error' : 'email-valid'}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Age Group *
                  </label>
                  <select
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                      errors.age ? 'border-red-500 animate-shake' : 'border-gray-200'
                    }`}
                    key={errors.age ? 'age-error' : 'age-valid'}
                  >
                    <option value="">Select your age group</option>
                    {ageCategories.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                  {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    School Name *
                  </label>
                  <input
                    type="text"
                    name="school"
                    value={formData.school}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                      errors.school ? 'border-red-500 animate-shake' : 'border-gray-200'
                    }`}
                    placeholder="Enter your school name"
                    key={errors.school ? 'school-error' : 'school-valid'}
                  />
                  {errors.school && <p className="text-red-500 text-sm mt-1">{errors.school}</p>}
                </div>
              </div>
            </div>

            {/* Parent/Guardian Information */}
            <div className="bg-green-50 rounded-2xl p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3">2</span>
                Parent/Guardian Information
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Parent/Guardian Name *
                  </label>
                  <input
                    type="text"
                    name="parentName"
                    value={formData.parentName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all ${
                      errors.parentName ? 'border-red-500 animate-shake' : 'border-gray-200'
                    }`}
                    placeholder="Enter parent/guardian name"
                    key={errors.parentName ? 'parentName-error' : 'parentName-valid'}
                  />
                  {errors.parentName && <p className="text-red-500 text-sm mt-1">{errors.parentName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Parent/Guardian Email *
                  </label>
                  <input
                    type="email"
                    name="parentEmail"
                    value={formData.parentEmail}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all ${
                      errors.parentEmail ? 'border-red-500 animate-shake' : 'border-gray-200'
                    }`}
                    placeholder="parent.email@example.com"
                    key={errors.parentEmail ? 'parentEmail-error' : 'parentEmail-valid'}
                  />
                  {errors.parentEmail && <p className="text-red-500 text-sm mt-1">{errors.parentEmail}</p>}
                </div>
              </div>
            </div>

            {/* Competition Details */}
            <div className="bg-purple-50 rounded-2xl p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3">3</span>
                Competition Details
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Competition Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                      errors.category ? 'border-red-500 animate-shake' : 'border-gray-200'
                    }`}
                    key={errors.category ? 'category-error' : 'category-valid'}
                  >
                    <option value="">Select your category</option>
                    {ageCategories.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                  {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Experience Level *
                  </label>
                  <select
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                      errors.experience ? 'border-red-500 animate-shake' : 'border-gray-200'
                    }`}
                    key={errors.experience ? 'experience-error' : 'experience-valid'}
                  >
                    <option value="">Select your experience level</option>
                    {experienceLevels.map(level => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                  {errors.experience && <p className="text-red-500 text-sm mt-1">{errors.experience}</p>}
                </div>
              </div>
            </div>

            {/* Project Submission - File Upload */}
            <div className="bg-yellow-50 rounded-2xl p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="bg-yellow-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3">4</span>
                Project Submission (Optional)
              </h3>
              <p className="text-gray-600 mb-4">
                Upload your completed project or portfolio. Accepted formats: ZIP, PDF, PPTX, DOC, DOCX, and images.
              </p>
              <FileUpload
                onFileSelect={handleFileSelect}
                maxSizeMB={parseInt(import.meta.env.VITE_MAX_FILE_SIZE_MB || '50', 10)}
                error={errors.uploadedFile}
              />
            </div>

            {/* Terms and Conditions */}
            <div className="bg-orange-50 rounded-2xl p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3">5</span>
                Agreement
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleInputChange}
                    className="mt-1 mr-3 w-5 h-5 text-orange-500 rounded focus:ring-orange-500"
                  />
                  <label className="text-sm text-gray-700">
                    I agree to the <a href="#" className="text-orange-500 hover:underline">Terms and Conditions</a> and 
                    <a href="#" className="text-orange-500 hover:underline ml-1">Privacy Policy</a> *
                  </label>
                </div>
                {errors.agreeTerms && <p className="text-red-500 text-sm">{errors.agreeTerms}</p>}

                <div className="flex items-start">
                  <input
                    type="checkbox"
                    name="agreeNewsletter"
                    checked={formData.agreeNewsletter}
                    onChange={handleInputChange}
                    className="mt-1 mr-3 w-5 h-5 text-orange-500 rounded focus:ring-orange-500"
                  />
                  <label className="text-sm text-gray-700">
                    I would like to receive updates and newsletters about future competitions and coding resources
                  </label>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center pt-6">
              <button
                type="submit"
                disabled={isSubmitting || !registrationOpen}
                className={`bg-gradient-to-r from-purple-500 to-pink-500 text-white px-12 py-4 rounded-full text-xl font-bold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isSubmitting ? 'animate-pulse' : ''
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  'Register Now! 🎉'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;