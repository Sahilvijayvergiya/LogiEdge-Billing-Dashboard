const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000;

// Basic middleware setup
app.use(cors({
 origin: true, // Allow all origins for development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With']
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Simple request logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Host: ${req.get('host')}`);
  
  // Set proper headers
  res.header('Access-Control-Allow-Origin', req.get('origin') || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  next();
});

// Sample data - hardcoded for simplicity
let customers = [
  { id: 1, name: 'ABC Corp', email: 'abc@corp.com', phone: '9876543210', gst_registered: true },
  { id: 2, name: 'XYZ Ltd', email: 'xyz@ltd.com', phone: '9876543211', gst_registered: false }
];

let items = [
  { id: 1, item_code: 'IT00001', name: 'Laptop', price: 85000, is_active: true },
  { id: 2, item_code: 'IT00002', name: 'LED Monitor', price: 13450, is_active: true },
  { id: 3, item_code: 'IT00003', name: 'Pen Drive', price: 980, is_active: true },
  { id: 4, item_code: 'IT00004', name: 'Mobile', price: 18900, is_active: true },
  { id: 5, item_code: 'IT00005', name: 'Headphone', price: 2350, is_active: false },
  { id: 6, item_code: 'IT00006', name: 'Bagpack', price: 1200, is_active: true },
  { id: 7, item_code: 'IT00007', name: 'Powerbank', price: 1400, is_active: true }
];

let invoices = [];
let nextInvoiceId = 1;

// Basic routes
app.get('/', (req, res) => {
 res.json({
    message: 'LogiEdge Billing Dashboard API',
    status: 'running',
    version: '1.0.0',
    endpoints: {
      customers: '/api/customers',
      items: '/api/items',
      invoices: '/api/invoices'
    },
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });});

app.get('/api/customers', (req, res) => {
  res.json(customers);
});

app.get('/api/items', (req, res) => {
  res.json(items);
});

app.get('/api/invoices', (req, res) => {
  res.json(invoices);
});

app.post('/api/customers', (req, res) => {
  const newCustomer = {
    id: customers.length + 1,
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    gst_registered: req.body.gst_registered || false
  };
  customers.push(newCustomer);
  res.json(newCustomer);
});

app.post('/api/invoices', (req, res) => {
  const { customer_id, items: invoiceItems, notes } = req.body;
  
  // Find customer
  const customer = customers.find(c => c.id === parseInt(customer_id));
  if (!customer) {
    return res.status(400).json({ error: 'Customer not found' });
  }
  
  // Calculate totals
  let subtotal = 0;
  const processedItems = invoiceItems.map(item => {
    const itemData = items.find(i => i.id === item.item_id);
    const total = item.quantity * itemData.price;
    subtotal += total;
    return {
      ...item,
      unit_price: itemData.price,
      total_price: total
    };
  });
  
  // Calculate GST
  const gstAmount = customer.gst_registered ? 0 : subtotal * 0.18;
  const totalAmount = subtotal + gstAmount;
  
  // Create invoice
  const invoice = {
    id: nextInvoiceId++,
    invoice_id: 'INVC' + String(nextInvoiceId).padStart(6, '0'),
    customer_id: parseInt(customer_id),
    customer_name: customer.name,
    subtotal: subtotal,
    gst_amount: gstAmount,
    total_amount: totalAmount,
    status: 'pending',
    invoice_date: new Date().toISOString(),
    notes: notes || '',
    items: processedItems
  };
  
  invoices.push(invoice);
  res.json(invoice);
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
