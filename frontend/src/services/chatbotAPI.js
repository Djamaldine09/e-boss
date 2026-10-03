import axios from 'axios';

const CHATBOT_API_URL =
  import.meta.env.VITE_AI_API_URL || 'https://e-boss-ai-api.onrender.com/api';

const chatbotAPI = {
  chat: async (message, userId = null, context = null) => {
    const response = await axios.post(`${CHATBOT_API_URL}/chatbot/chat`, {
      message,
      user_id: userId,
      context
    });
    return response.data;
  },

  checkAnswer: async (question, answer, context = null) => {
    const response = await axios.post(`${CHATBOT_API_URL}/chatbot/tutor`, {
      question,
      answer,
      context
    });
    return response.data;
  },

  getSuggestions: async (topic) => {
    const response = await axios.get(`${CHATBOT_API_URL}/chatbot/suggestions/${topic}`);
    return response.data;
  },

  healthCheck: async () => {
    const response = await axios.get(`${CHATBOT_API_URL}/health`);
    return response.data;
  },

  getMetrics: async () => {
    const response = await axios.get(`${CHATBOT_API_URL}/metrics`);
    return response.data;
  }
};

export default chatbotAPI;
