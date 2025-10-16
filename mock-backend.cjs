// Mock backend server để test frontend
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const app = express();
const PORT = 3001; // Backend port

app.use(cors());
app.use(express.json());

// JWT Secret (trong production nên lưu trong environment variable)
const JWT_SECRET = 'your-secret-key-here-change-in-production';


// Middleware để verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Access token required'
        });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({
                success: false,
                message: 'Invalid or expired token'
            });
        }
        req.user = user;
        next();
    });
};

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Get vehicles (protected route)
app.get('/api/vehicles', authenticateToken, (req, res) => {
    console.log('🚗 GET /api/vehicles requested by user:', req.user.email);
    // TODO: Replace with real database call
    res.json({ success: true, data: [], message: 'API endpoint ready - connect to real database' });
});

// Get products (protected route)
app.get('/api/products', authenticateToken, (req, res) => {
    console.log('📦 GET /api/products requested by user:', req.user.email);
    // TODO: Replace with real database call
    res.json({ success: true, data: [], message: 'API endpoint ready - connect to real database' });
});

// Get customers (protected route)
app.get('/api/customers', authenticateToken, (req, res) => {
    console.log('👥 GET /api/customers requested by user:', req.user.email);
    // TODO: Replace with real database call
    res.json({ success: true, data: [], message: 'API endpoint ready - connect to real database' });
});

// Get vehicle parts (protected route)
app.get('/api/vehicle-parts', authenticateToken, (req, res) => {
    console.log('🔧 GET /api/vehicle-parts requested by user:', req.user.email);
    // TODO: Replace with real database call
    res.json({ success: true, data: [], message: 'API endpoint ready - connect to real database' });
});

// Get users (admin only)
app.get('/api/users', authenticateToken, (req, res) => {
    console.log('📋 GET /api/users requested by user:', req.user.email);

    // Check if user is admin
    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Admin access required'
        });
    }

    // TODO: Replace with real database call
    res.json({ success: true, data: [], message: 'API endpoint ready - connect to real database' });
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
    console.log('🔑 Login attempt:', req.body);

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: 'Username and password are required'
        });
    }

    try {
        console.log('Login request received:', { username, hasPassword: !!password });

        // Find user by username
        const user = testUsers.find(u => u.username === username);
        console.log('User found:', !!user);

        if (!user) {
            console.log('User not found');
            return res.status(401).json({
                success: false,
                message: 'Invalid username or password'
            });
        }

        // Verify password
        const passwordMatch = await bcrypt.compare(password, user.password);
        console.log('Password match:', passwordMatch);

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid username or password'
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                id: user.id,
                username: user.username,
                email: user.email,
                name: user.name,
                role: user.role
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Return success with token
        res.json({
            success: true,
            message: 'Login successful',
            data: {
                token: token,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    name: user.name,
                    role: user.role
                }
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Mock server running on http://localhost:${PORT}`);
    console.log('📌 Available endpoints:');
    console.log('   GET  /api/health');
    console.log('   GET  /api/users');
    console.log('   GET  /api/vehicles');
    console.log('   GET  /api/products');
    console.log('   GET  /api/customers');
    console.log('   GET  /api/vehicle-parts');
    console.log('   POST /api/auth/login');
    console.log('');
    console.log('🔐 Test accounts:');
    console.log('   Username: admin / Password: admin123 (Admin role)');
    console.log('   Username: staff / Password: staff123 (Staff role)');
    console.log('');
    console.log('⚠️  All endpoints return empty data - connect to real database');
});