import axios from 'axios';

// Configuration de l'API du chatbot Python
const CHATBOT_API_URL = 'http://localhost:5000/api';

const chatbotAPI = {
  // Chat avec le bot
  chat: async (message, userId = null, context = null) => {
    try {
      const response = await axios.post(`${CHATBOT_API_URL}/chatbot/chat`, {
        message,
        user_id: userId,
        context
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors du chat:', error);
      throw error;
    }
  },

  // Vérification de réponse par le tutor IA
  checkAnswer: async (question, answer, context = null) => {
    try {
      const response = await axios.post(`${CHATBOT_API_URL}/chatbot/tutor`, {
        question,
        answer,
        context
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la vérification de réponse:', error);
      throw error;
    }
  },

  // Obtenir des suggestions pour un sujet
  getSuggestions: async (topic) => {
    try {
      const response = await axios.get(`${CHATBOT_API_URL}/chatbot/suggestions/${topic}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des suggestions:', error);
      throw error;
    }
  },

  // Vérifier la santé du service chatbot
  healthCheck: async () => {
    try {
      const response = await axios.get(`${CHATBOT_API_URL}/health`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la vérification de santé:', error);
      throw error;
    }
  },

  // Obtenir les métriques du chatbot
  getMetrics: async () => {
    try {
      const response = await axios.get(`${CHATBOT_API_URL}/metrics`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des métriques:', error);
      throw error;
    }
  }
};

export default chatbotAPI;
