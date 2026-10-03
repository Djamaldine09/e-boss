import axios from 'axios';

// Create axios instance with base URL
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
API.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    // Return error message from server or default message
    const message = error.response?.data?.error || error.message || 'An error occurred';
    return Promise.reject(new Error(message));
  }
);

// Auth API calls
export const authAPI = {
  register: (userData) => API.post('/auth/register', userData),
  login: (credentials) => API.post('/auth/login', credentials),
  logout: () => API.post('/auth/logout'),
  getMe: () => API.get('/auth/me'),
  updateProfile: (userData) => API.put('/auth/me', userData),
};

// Tutor API calls
export const tutorAPI = {
  getFeedback: (data) => API.post('/tutor/feedback', data),
};

// Fact Check API calls
export const factCheckAPI = {
  checkClaim: (data) => API.post('/fact-check', data),
  searchClaims: (params) => API.get('/fact-check/search', { params }),
};

// Quiz API calls
export const quizAPI = {
  generateQuiz: (data) => API.post('/quiz/generate', data),
  validateQuiz: (data) => API.post('/quiz/validate', data),
};

// Planning API calls
export const planningAPI = {
  generatePlanning: (data) => API.post('/planning/generate', data),
  optimizePlanning: (data) => API.post('/planning/optimize', data),
};

// Health check
export const healthCheck = () => API.get('/health');

export default API;
