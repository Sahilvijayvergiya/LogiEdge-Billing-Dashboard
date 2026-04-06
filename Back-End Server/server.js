// Direct server entry - no dependencies on other files
const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// CORS setup - more permissive for development
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept']
}));

app.use(express.json());

// Additional CORS headers for all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Origin: ${req.get('origin')}`);
  
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Origin, X-Requested-With, Accept');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS request');
    res.sendStatus(200);
    return;
  }
  
  next();
});

// Test endpoint for debugging
app.get('/api/test', (req, res) => {
  res.json({
    message: 'API test endpoint working',
    timestamp: new Date().toISOString(),
    headers: req.headers,
    origin: req.get('origin')
  });
});

// Basic routes
app.get('/', (req, res) => {
  res.json({
    message: 'LogiEdge API is running',
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/customers', (req, res) => {
  console.log('GET /api/customers - Sending customer data');
  res.json([
    { id: 1, name: 'ABC Corp', email: 'abc@corp.com', gst_registered: true },
    { id: 2, name: 'XYZ Ltd', email: 'xyz@ltd.com', gst_registered: false }
  ]);
});

app.get('/api/items', (req, res) => {
  console.log('GET /api/items - Sending item data');
  res.json([
    { id: 1, name: 'Laptop', price: 85000 },
    { id: 2, name: 'LED Monitor', price: 13450 }
  ]);
});

// Invoice endpoints
app.get('/api/invoices', (req, res) => {
  res.json([]);
});

app.post('/api/invoices', (req, res) => {
  const invoice = {
    id: Date.now(),
    invoice_id: `INVC${String(Date.now()).slice(-6)}`,
    ...req.body,
    created_at: new Date().toISOString()
  };
  res.json(invoice);
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Start server
app.listen(port, () => {
  console.log(`Direct server running on port ${port}`);
});

module.exports = app;
