async function testLogin() {
    try {
        const response = await fetch('http://localhost:3001/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: 'admin',
                password: 'admin123'
            })
        });

        const data = await response.json();
        console.log('Response status:', response.status);
        console.log('Response data:', JSON.stringify(data, null, 2));

        if (data.success && data.data.token) {
            console.log('\n✅ JWT Token:', data.data.token);

            // Test protected endpoint
            const vehiclesResponse = await fetch('http://localhost:3001/api/vehicles', {
                headers: {
                    'Authorization': `Bearer ${data.data.token}`
                }
            });

            const vehiclesData = await vehiclesResponse.json();
            console.log('\n🚗 Protected endpoint test:', vehiclesData);
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

testLogin();