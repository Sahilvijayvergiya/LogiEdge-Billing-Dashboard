import axios from 'axios';

// ✅ Use ENV variable (BEST PRACTICE)
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// ✅ Create Axios Instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
timeout: 10000, // 10 second timeout
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('Response error:', error);
    
    if (error.code === 'ECONNABORTED') {
      error.message = 'Request timeout. Please try again.';
    } else if (error.response?.status === 0) {
      error.message = 'Network error. Please check your connection.';
    } else if (error.response?.status === 404) {
      error.message = 'Resource not found.';
    } else if (error.response?.status >= 500) {
      error.message = 'Server error. Please try again later.';
    }
    
    return Promise.reject(error);
  }
);
// ==============================
// 🔹 CUSTOMER API
// ==============================
export const customerAPI = {
  getAll: async () => {
    const res = await api.get('/customers');
    return res.data;
  },

  getById: async (id) => {
    const res = await api.get(`/customers/${id}`);
    return res.data;
  },

  create: async (data) => {
    const res = await api.post('/customers', data);
    return res.data;
  },

  update: async (id, data) => {
    const res = await api.put(`/customers/${id}`, data);
    return res.data;
  },

  delete: async (id) => {
    const res = await api.delete(`/customers/${id}`);
    return res.data;
  },
};

// ==============================
// 🔹 ITEM API
// ==============================
export const itemAPI = {
  getAll: async () => {
    const res = await api.get('/items');
    return res.data;
  },

  getById: async (id) => {
    const res = await api.get(`/items/${id}`);
    return res.data;
  },

  create: async (data) => {
    const res = await api.post('/items', data);
    return res.data;
  },

  update: async (id, data) => {
    const res = await api.put(`/items/${id}`, data);
    return res.data;
  },

  delete: async (id) => {
    const res = await api.delete(`/items/${id}`);
    return res.data;
  },
};

// ==============================
// 🔹 INVOICE API
// ==============================
export const invoiceAPI = {
  getAll: async () => {
    const res = await api.get('/invoices');
    return res.data;
  },

  getById: async (id) => {
    const res = await api.get(`/invoices/${id}`);
    return res.data;
  },

  getByInvoiceId: async (invoiceId) => {
    const res = await api.get(`/invoices/invoice-id/${invoiceId}`);
    return res.data;
  },

  getByCustomerId: async (customerId) => {
    const res = await api.get(`/invoices/customer/${customerId}`);
    return res.data;
  },

  create: async (data) => {
    const res = await api.post('/invoices', data);
    return res.data;
  },

  updateStatus: async (id, status) => {
    const res = await api.put(`/invoices/${id}/status`, { status });
    return res.data;
  },

  delete: async (id) => {
    const res = await api.delete(`/invoices/${id}`);
    return res.data;
  },
};

// ==============================
// 🔹 GLOBAL ERROR HANDLER
// ==============================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error?.response || error.message);
    return Promise.reject(error);
  }
);

export default api;
