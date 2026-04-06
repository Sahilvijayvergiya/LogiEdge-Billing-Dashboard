// Fresh server file - guaranteed to have all endpoints
const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// Enhanced CORS setup
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept']
}));

app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Origin: ${req.get('origin')}`);
  
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Origin, X-Requested-With, Accept');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS request');
    res.sendStatus(200);
    return;
  }
  
  next();
});

// Root endpoint
app.get('/', (req, res) => {
  console.log('GET / - Root endpoint called');
  res.json({
    message: 'LogiEdge API is running',
    status: 'OK',
    timestamp: new Date().toISOString(),
    version: '2.0.0'
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  console.log('GET /api/test - Test endpoint called');
  res.json({
    message: 'API test endpoint working',
    timestamp: new Date().toISOString(),
    headers: req.headers,
    origin: req.get('origin')
  });
});

// Customers endpoint
app.get('/api/customers', (req, res) => {
  console.log('GET /api/customers - Sending customer data');
  res.json([
    { id: 1, name: 'ABC Corp', email: 'abc@corp.com', gst_registered: true },
    { id: 2, name: 'XYZ Ltd', email: 'xyz@ltd.com', gst_registered: false }
  ]);
});

// Items endpoint
app.get('/api/items', (req, res) => {
  console.log('GET /api/items - Sending item data');
  res.json([
    { id: 1, name: 'Laptop', price: 85000, description: 'High-performance laptop' },
    { id: 2, name: 'LED Monitor', price: 13450, description: '24-inch LED monitor' },
    { id: 3, name: 'Pen Drive', price: 980, description: '64GB USB pen drive' },
    { id: 4, name: 'Mobile', price: 18900, description: 'Smartphone with latest features' },
    { id: 5, name: 'Headphone', price: 2350, description: 'Wireless headphones' },
    { id: 6, name: 'Bagpack', price: 1200, description: 'Laptop backpack' },
    { id: 7, name: 'Powerbank', price: 1400, description: 'Portable power bank 20000mAh' }
  ]);
});

// Invoices endpoints
app.get('/api/invoices', (req, res) => {
  console.log('GET /api/invoices - Sending invoice data');
  res.json([]);
});

app.post('/api/invoices', (req, res) => {
  console.log('POST /api/invoices - Creating invoice');
  const invoice = {
    id: Date.now(),
    invoice_id: `INVC${String(Date.now()).slice(-6)}`,
    ...req.body,
    created_at: new Date().toISOString()
  };
  res.json(invoice);
});

// Health check
app.get('/health', (req, res) => {
  console.log('GET /health - Health check');
  res.json({ 
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 404 handler
app.use('*', (req, res) => {
  console.log(`404 - ${req.method} ${req.path} not found`);
  res.status(404).json({ 
    error: 'Resource not found.',
    path: req.path,
    method: req.method
  });
});

// Start server
const server = app.listen(port, () => {
  console.log(`🚀 Fresh LogiEdge API server running on port ${port}`);
  console.log(`📍 Available endpoints:`);
  console.log(`   GET  / - Root endpoint`);
  console.log(`   GET  /api/test - Test endpoint`);
  console.log(`   GET  /api/customers - Customers`);
  console.log(`   GET  /api/items - Items`);
  console.log(`   GET  /api/invoices - Invoices`);
  console.log(`   POST /api/invoices - Create invoice`);
  console.log(`   GET  /health - Health check`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

module.exports = app;
