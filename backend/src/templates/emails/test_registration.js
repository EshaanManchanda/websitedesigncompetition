// fetch is global in Node 22
// For Node 18+, fetch is built-in.

const API_URL = 'http://localhost:5050/api/registrations';

const testRegistration = async () => {
    const data = {
        firstName: 'Test',
        lastName: 'User',
        email: `test${Date.now()}@example.com`,
        age: '14-17',
        school: 'Test School',
        parentName: 'Parent Test',
        parentEmail: 'parent@example.com',
        category: '14-17',
        experience: 'beginner',
        competitionDate: '2026-03-31',
        agreeTerms: true,
        agreeNewsletter: false
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        console.log('Status:', response.status);
        console.log('Result:', JSON.stringify(result, null, 2));
    } catch (error) {
        console.error('Error:', error);
    }
};

testRegistration();