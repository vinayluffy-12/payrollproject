const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Configure Socket.io (conditional or mock logic could be added here if needed)
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Attach Socket.io to global object for controller use
global.io = io;

// Basic Middlewares
app.use(helmet({
  contentSecurityPolicy: false // Disabled for ease of development/loading CDNs
}));
app.use(cors());
app.use(express.json());

// Rate Limiter: 100 requests per 15 minutes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests from this IP, please try again after 15 minutes.' }
});
app.use('/api/', limiter);

// Log requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// RESTful Route registry
const authRouter = require('./routes/auth');
const employeeRouter = require('./routes/employees');
const payrollRouter = require('./routes/payroll');
const attendanceRouter = require('./routes/attendance');
const leaveRouter = require('./routes/leave');
const walletRouter = require('./routes/wallet');
const fraudRouter = require('./routes/fraud');
const reportRouter = require('./routes/reports');
const currencyRouter = require('./routes/currency');
const adminRouter = require('./routes/admin');

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/employees', employeeRouter);
app.use('/api/v1/payroll', payrollRouter);
app.use('/api/v1/attendance', attendanceRouter);
app.use('/api/v1/leaves', leaveRouter);
app.use('/api/v1/wallets', walletRouter);
app.use('/api/v1/fraud-alerts', fraudRouter);
app.use('/api/v1/reports', reportRouter);
app.use('/api/v1/currencies', currencyRouter);
app.use('/api/v1/admin', adminRouter);

// Health check endpoint
app.get('/api/v1/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    db: 'connected'
  });
});

// Socket.io connection logic
io.on('connection', (socket) => {
  console.log(`[Socket] New client connected: ${socket.id}`);
  
  socket.on('join_company', (companyId) => {
    socket.join(`company_${companyId}`);
    console.log(`[Socket] Client ${socket.id} joined room company_${companyId}`);
  });

  socket.on('disconnect', () => {
    console.log(`[Socket] Client disconnected: ${socket.id}`);
  });
});

module.exports = { app, server };
