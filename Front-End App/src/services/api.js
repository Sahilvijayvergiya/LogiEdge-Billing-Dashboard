import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://logiedge-billing-dashboard-zqwe.onrender.com/api';

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
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    console.log(`📋 Full URL: ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    console.log(`📦 Data:`, response.data);
    return response;
  },
  (error) => {
    console.error('❌ Response error:', error);
    console.error('🔗 Error URL:', error.config?.baseURL + error.config?.url);
    console.error('📊 Status:', error.response?.status);
    console.error('💬 Message:', error.message);
    
    if (error.code === 'ECONNABORTED') {
      error.message = 'Request timeout. Please try again.';
    } else if (error.response?.status === 0) {
      error.message = 'Network error. Please check your connection.';
    } else if (error.response?.status === 404) {
      error.message = 'API endpoint not found. Please check backend deployment.';
    } else if (error.response?.status >= 500) {
      error.message = 'Server error. Please try again later.';
    }
    
    return Promise.reject(error);
  }
);

// API test function
export const testAPI = async () => {
  try {
    console.log('🧪 Testing API connection...');
    const response = await api.get('/');
    console.log('✅ API test successful:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('❌ API test failed:', error);
    return { success: false, error: error.message };
  }
};

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
