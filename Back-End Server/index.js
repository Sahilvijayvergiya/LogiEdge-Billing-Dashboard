// Simple working server - guaranteed deployment
const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// CORS
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// ALL ENDPOINTS
app.get('/', (req, res) => {
  res.json({ message: 'API running', status: 'OK', version: '3.0.0' });
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'Test endpoint working' });
});

app.get('/api/customers', (req, res) => {
  res.json([
    { id: 1, name: 'ABC Corp', gst_registered: true },
    { id: 2, name: 'XYZ Ltd', gst_registered: false }
  ]);
});

app.get('/api/items', (req, res) => {
  res.json([
    { id: 1, name: 'Laptop', price: 85000 },
    { id: 2, name: 'LED Monitor', price: 13450 },
    { id: 3, name: 'Pen Drive', price: 980 },
    { id: 4, name: 'Mobile', price: 18900 }
  ]);
});

app.post('/api/invoices', (req, res) => {
  const invoice = {
    id: Date.now(),
    ...req.body,
    created_at: new Date().toISOString()
  };
  res.json(invoice);
});

// 404 handler
app.use('*', (req, res) => {
  console.log(`404: ${req.method} ${req.path}`);
  res.status(404).json({ error: 'Resource not found' });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server v3.0.0 running on port ${port}`);
});

module.exports = app;
