import axios from 'axios';
import { securityConfig } from '../config/security';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    ...securityConfig.headers
  }
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't redirect for login or change-password 401 errors
    if (error.response?.status === 401 && 
        !error.config.url.includes('/auth/change-password') && 
        !error.config.url.includes('/auth/login')) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const auth = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  changePassword: (data) => api.post('/auth/change-password', data),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  verifyResetToken: (data) => api.post('/auth/verify-reset-token', data),
  resetPassword: (data) => api.post('/auth/reset-password', data)
};

export const customers = {
  add: (data) => api.post('/customers', data),
  getLatest: () => api.get('/customers/latest')
};

export default api; 