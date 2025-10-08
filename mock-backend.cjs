// Mock backend server để test frontend
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001; // Sử dụng port khác để tránh conflict

app.use(cors());
app.use(express.json());

// Mock users data
const mockUsers = [
    { id: 1, username: 'admin', password: 'password123', role: 'ADMIN', email: 'admin@oem.com' },
    { id: 2, username: 'staff', password: 'password123', role: 'SC_STAFF', email: 'staff@oem.com' },
    { id: 3, username: 'technician', password: 'password123', role: 'SC_TECHNICIAN', email: 'tech@oem.com' }
];

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Get users
app.get('/api/users', (req, res) => {
    console.log('📋 GET /api/users requested');
    res.json({ success: true, data: mockUsers.map(u => ({ id: u.id, username: u.username, role: u.role, email: u.email })) });
});

// Login endpoint
app.post('/api/auth/login', (req, res) => {
    console.log('🔑 Login attempt:', req.body);

    const { username, password } = req.body;

    // Find user
    const user = mockUsers.find(u => u.username === username && u.password === password);

    if (user) {
        const token = 'mock_jwt_token_' + Date.now();
        const userData = { id: user.id, username: user.username, role: user.role, email: user.email };

        console.log('✅ Login successful for:', username);
        res.json({
            success: true,
            message: 'Đăng nhập thành công',
            token,
            user: userData
        });
    } else {
        console.log('❌ Login failed for:', username);
        res.status(401).json({
            success: false,
            message: 'Tên đăng nhập hoặc mật khẩu không đúng'
        });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Mock server running on http://localhost:${PORT}`);
    console.log('📌 Available endpoints:');
    console.log('   GET  /api/health');
    console.log('   GET  /api/users');
    console.log('   POST /api/auth/login');
    console.log('');
    console.log('🔐 Test accounts:');
    mockUsers.forEach(user => {
        console.log(`   ${user.username} / ${user.password} (${user.role})`);
    });
});