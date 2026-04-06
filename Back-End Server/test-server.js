// Simple test server to verify deployment
const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// CORS setup
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());

// Basic routes
app.get('/', (req, res) => {
  res.json({
    message: 'LogiEdge API is running',
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/customers', (req, res) => {
  res.json([
    { id: 1, name: 'ABC Corp', email: 'abc@corp.com', gst_registered: true },
    { id: 2, name: 'XYZ Ltd', email: 'xyz@ltd.com', gst_registered: false }
  ]);
});

app.get('/api/items', (req, res) => {
  res.json([
    { id: 1, name: 'Laptop', price: 85000 },
    { id: 2, name: 'LED Monitor', price: 13450 }
  ]);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Start server
app.listen(port, () => {
  console.log(`Simple test server running on port ${port}`);
});

module.exports = app;
