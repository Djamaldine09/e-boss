import API from './api';

// Dashboard API calls
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
