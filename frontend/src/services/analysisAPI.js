import axios from 'axios';

// Configuration de l'API pour l'analyse avec ChatGPT/Copilot
const ANALYSIS_API_URL = 'http://localhost:5000/api';

const analysisAPI = {
  // Analyser un post avec ChatGPT/Copilot
  analyzePost: async (content, postId = null) => {
    try {
      const payload = {
        message: `Analyse ce post et donne une réponse détaillée : ${content}`,
        context: "post_analysis",
        user_id: String(postId || "anonymous")
      };
      console.log('Payload envoyé:', payload);
      const response = await axios.post(`${ANALYSIS_API_URL}/chatbot/chat`, payload);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'analyse du post:', error);
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Data:', JSON.stringify(error.response.data, null, 2));
        console.error('Headers:', error.response.headers);
      }
      throw error;
    }
  },

  // Obtenir une analyse de sentiment
  analyzeSentiment: async (content) => {
    try {
      const response = await axios.post(`${ANALYSIS_API_URL}/messages/analyze`, {
        message: content,
        sender_id: "sentiment_analysis",
        context: "sentiment_analysis",
        priority: "normal"
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'analyse de sentiment:', error);
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Data:', error.response.data);
      }
      throw error;
    }
  },

  // Vérifier si le contenu contient des fake news
  checkFakeNews: async (content, source = null) => {
    try {
      const response = await axios.post(`${ANALYSIS_API_URL}/fake-news/detect`, {
        content: content,
        source: source,
        metadata: { type: "social_post" }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la détection de fake news:', error);
      throw error;
    }
  },

  // Analyse complète d'un post
  fullAnalysis: async (content, postId = null, source = null) => {
    try {
      // Analyse avec ChatGPT/Copilot
      const chatAnalysis = await analysisAPI.analyzePost(content, postId);
      
      // Analyse de sentiment
      const sentimentAnalysis = await analysisAPI.analyzeSentiment(content);
      
      // Détection de fake news
      const fakeNewsAnalysis = await analysisAPI.checkFakeNews(content, source);
      
      return {
        chat_analysis: chatAnalysis,
        sentiment: sentimentAnalysis,
        fake_news: fakeNewsAnalysis,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Erreur lors de l\'analyse complète:', error);
      throw error;
    }
  }
};

export default analysisAPI;
