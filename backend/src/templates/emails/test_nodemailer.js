const nodemailer = require('nodemailer');
console.log('Type of nodemailer:', typeof nodemailer);
console.log('Keys:', Object.keys(nodemailer));
console.log('createTransporter type:', typeof nodemailer.createTransporter);
try {
    const transporter = nodemailer.createTransporter({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'test',
            pass: 'test'
        }
    });
    console.log('Transporter created successfully');
} catch (e) {
    console.error('Error creating transporter:', e);
}