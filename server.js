import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('dist'));

// Mock data
const mockUsers = {
    'admin': { user_id: 1, username: 'admin', full_name: 'Quản trị viên', role: 'admin', service_center_id: null, password: 'admin123' },
    'evm_staff': { user_id: 2, username: 'evm_staff', full_name: 'Nhân viên EVM', role: 'evm_staff', service_center_id: null, password: 'evm123' },
    'sc_staff': { user_id: 3, username: 'sc_staff', full_name: 'Nhân viên SC', role: 'sc_staff', service_center_id: 1, password: 'sc123' },
    'technician': { user_id: 4, username: 'technician', full_name: 'Kỹ thuật viên', role: 'technician', service_center_id: 1, password: 'tech123' }
};

const mockVehicles = [
    { vehicle_id: 1, vin: '1HGCM82633A123456', model: 'EV-2023', year: 2023, color: 'Xanh dương', customer_name: 'Nguyễn Văn An', delivery_date: '2023-01-15' },
    { vehicle_id: 2, vin: '1HGCM82633A123457', model: 'EV-2023', year: 2023, color: 'Trắng', customer_name: 'Trần Thị Bình', delivery_date: '2023-02-20' },
    { vehicle_id: 3, vin: '1HGCM82633A123458', model: 'EV-2024', year: 2024, color: 'Đen', customer_name: 'Lê Văn Cường', delivery_date: '2024-01-10' }
];

const mockClaims = [
    { claim_id: 1, claim_number: 'CLM-2024-0001', vin: '1HGCM82633A123456', model: 'EV-2023', part_type: 'battery', customer_name: 'Nguyễn Văn An', status: 'completed', claim_date: '2024-09-01' },
    { claim_id: 2, claim_number: 'CLM-2024-0002', vin: '1HGCM82633A123457', model: 'EV-2023', part_type: 'motor', customer_name: 'Trần Thị Bình', status: 'approved', claim_date: '2024-09-05' },
    { claim_id: 3, claim_number: 'CLM-2024-0003', vin: '1HGCM82633A123458', model: 'EV-2024', part_type: 'bms', customer_name: 'Lê Văn Cường', status: 'pending', claim_date: '2024-09-10' }
];

// Routes
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    
    const user = mockUsers[username];
    if (!user || user.password !== password) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({
        token: 'mock-token-' + user.user_id,
        user: {
            user_id: user.user_id,
            username: user.username,
            full_name: user.full_name,
            role: user.role,
            service_center_id: user.service_center_id,
            service_center_name: user.service_center_id ? 'Trung tâm Dịch vụ Hà Nội' : null
        }
    });
});

app.get('/api/vehicles', (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    
    res.json({
        vehicles: mockVehicles.slice(offset, offset + parseInt(limit)),
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: mockVehicles.length,
            pages: Math.ceil(mockVehicles.length / limit)
        }
    });
});

app.get('/api/warranty-claims', (req, res) => {
    const { status, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    
    let filteredClaims = mockClaims;
    if (status) {
        filteredClaims = mockClaims.filter(claim => claim.status === status);
    }
    
    res.json({
        claims: filteredClaims.slice(offset, offset + parseInt(limit)),
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: filteredClaims.length,
            pages: Math.ceil(filteredClaims.length / limit)
        }
    });
});

app.get('/api/reports/statistics', (req, res) => {
    const mockStats = {
        model_statistics: [
            { model: 'EV-2023', total_claims: 2, total_vehicles: 2, failure_rate: 100.0 },
            { model: 'EV-2024', total_claims: 1, total_vehicles: 1, failure_rate: 100.0 }
        ],
        part_statistics: [
            { part_type: 'battery', total_claims: 1, percentage: 33.33 },
            { part_type: 'motor', total_claims: 1, percentage: 33.33 },
            { part_type: 'bms', total_claims: 1, percentage: 33.33 }
        ],
        region_statistics: [
            { region: 'Miền Bắc', total_claims: 2, total_vehicles: 2 },
            { region: 'Miền Nam', total_claims: 1, total_vehicles: 1 }
        ],
        cost_statistics: [
            { month: '2024-09', total_cost: 15000000, total_claims: 3 }
        ]
    };
    
    res.json(mockStats);
});

// Socket.IO
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join_room', (room) => {
        socket.join(room);
        console.log(`User ${socket.id} joined room ${room}`);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Serve React app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`�� Server running on port ${PORT}`);
    console.log(`🌐 Access the application at: http://localhost:${PORT}`);
    console.log(`�� Demo accounts:`);
    console.log(`   - admin/admin123 (Quản trị viên)`);
    console.log(`   - evm_staff/evm123 (Nhân viên EVM)`);
    console.log(`   - sc_staff/sc123 (Nhân viên SC)`);
    console.log(`   - technician/tech123 (Kỹ thuật viên)`);
});
