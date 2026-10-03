import axios from 'axios';

// Create axios instance for Express backend
const API = axios.create({
  baseURL: 'http://localhost:3001/api',
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
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    const message = error.response?.data?.error || error.message || 'An error occurred';
    return Promise.reject(new Error(message));
  }
);

// Dashboard API calls for Express backend
export const dashboardAPI = {
  // Achievements
  getAchievements: () => API.get('/dashboard/achievements'),
  updateAchievement: (id, data) => API.put(`/dashboard/achievements/${id}`, data),

  // Calendar
  getEvents: (startDate, endDate) => 
    API.get('/dashboard/events', { params: { startDate, endDate } }),
  createEvent: (eventData) => API.post('/dashboard/events', eventData),
  updateEvent: (id, eventData) => API.put(`/dashboard/events/${id}`, eventData),
  deleteEvent: (id) => API.delete(`/dashboard/events/${id}`),

  // Progress
  getProgress: () => API.get('/dashboard/progress'),
  getCourseProgress: (courseId) => API.get(`/dashboard/courses/${courseId}/progress`),

  // Courses
  getCourses: (status = 'all') => API.get('/dashboard/courses', { params: { status } }),
  getCourseDetails: (courseId) => API.get(`/dashboard/courses/${courseId}`),
  updateCourseProgress: (courseId, progressData) => 
    API.post(`/dashboard/courses/${courseId}/progress`, progressData),

  // Sprints
  getSprints: () => API.get('/dashboard/sprints'),
  getSprintDetails: (sprintId) => API.get(`/dashboard/sprints/${sprintId}`),
  updateSprintTask: (sprintId, taskId, completed) => 
    API.patch(`/dashboard/sprints/${sprintId}/tasks/${taskId}`, { completed }),
  createSprint: (sprintData) => API.post('/dashboard/sprints', sprintData),
  updateSprint: (sprintId, sprintData) => 
    API.put(`/dashboard/sprints/${sprintId}`, sprintData),
};

export default dashboardAPI;
