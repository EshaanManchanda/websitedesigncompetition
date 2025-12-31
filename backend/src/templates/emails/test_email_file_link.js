require('dotenv').config();
const { sendRegistrationEmails } = require('./src/services/emailService');

const mockRegistration = {
    _id: 'mock_id_123',
    firstName: 'Test',
    lastName: 'Student',
    email: 'test_student@example.com',
    age: '14-17',
    school: 'Test Academy',
    parentName: 'Parent Test',
    parentEmail: 'parent_test@example.com',
    category: '14-17',
    experience: 'intermediate',
    competitionDate: '2026-03-31',
    agreeTerms: true,
    agreeNewsletter: false,
    submissionFileUrl: 'https://res.cloudinary.com/demo/image/upload/v1234567890/sample.pdf',
    submissionFileName: 'my_project.pdf',
    submissionFileSize: 1024 * 1024 * 2.5, // 2.5MB
    submissionFileType: 'application/pdf',
    submissionUploadedAt: new Date().toISOString(),
    createdAt: new Date().toISOString()
};

console.log('Testing email sending with file link...');
sendRegistrationEmails(mockRegistration)
    .then(results => {
        console.log('Email Results:', JSON.stringify(results, null, 2));
        if (results.admin.success) {
            console.log('Admin email sent successfully. Check your Mailtrap inbox to verify the link matches:', mockRegistration.submissionFileUrl);
        } else {
            console.error('Failed to send admin email');
        }
    })
    .catch(err => console.error('Test Error:', err));