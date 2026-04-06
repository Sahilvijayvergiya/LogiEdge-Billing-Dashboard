import axios from 'axios';

const API_BASE_URL = 'https://logiedge-billing-dashboard-zqwe.onrender.com/';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Customer API
export const customerAPI = {
  getAll: () => api.get('/customers'),
  getById: (id) => api.get(`/customers/${id}`),
  create: (data) => api.post('/customers', data),
  update: (id, data) => api.put(`/customers/${id}`, data),
  delete: (id) => api.delete(`/customers/${id}`),
};

// Item API
export const itemAPI = {
  getAll: () => api.get('/items'),
  getById: (id) => api.get(`/items/${id}`),
  create: (data) => api.post('/items', data),
  update: (id, data) => api.put(`/items/${id}`, data),
  delete: (id) => api.delete(`/items/${id}`),
};

// Invoice API
export const invoiceAPI = {
  getAll: () => api.get('/invoices'),
  getById: (id) => api.get(`/invoices/${id}`),
  getByInvoiceId: (invoiceId) => api.get(`/invoices/invoice-id/${invoiceId}`),
  getByCustomerId: (customerId) => api.get(`/invoices/customer/${customerId}`),
  create: (data) => api.post('/invoices', data),
  updateStatus: (id, status) => api.put(`/invoices/${id}/status`, { status }),
  delete: (id) => api.delete(`/invoices/${id}`),
};

export default api;
