import axios from 'axios';

const ANALYSIS_API_URL =
  import.meta.env.VITE_API_URL || 'https://e-boss-backend.onrender.com/api';

const analysisAPI = {
  analyzePost: async (content, postId = null) => {
    const payload = {
      message: `Analyse ce post et donne une réponse détaillée : ${content}`,
      context: 'post_analysis',
      user_id: String(postId || 'anonymous')
    };
    const response = await axios.post(`${ANALYSIS_API_URL}/chatbot/chat`, payload);
    return response.data;
  },

  analyzeSentiment: async (content) => {
    const response = await axios.post(`${ANALYSIS_API_URL}/messages/analyze`, {
      message: content,
      sender_id: 'sentiment_analysis',
      context: 'sentiment_analysis',
      priority: 'normal'
    });
    return response.data;
  },

  checkFakeNews: async (content, source = null) => {
    const response = await axios.post(`${ANALYSIS_API_URL}/fake-news/detect`, {
      content,
      source,
      metadata: { type: 'social_post' }
    });
    return response.data;
  },

  fullAnalysis: async (content, postId = null, source = null) => {
    const chatAnalysis = await analysisAPI.analyzePost(content, postId);
    const sentimentAnalysis = await analysisAPI.analyzeSentiment(content);
    const fakeNewsAnalysis = await analysisAPI.checkFakeNews(content, source);

    return {
      chat_analysis: chatAnalysis,
      sentiment: sentimentAnalysis,
      fake_news: fakeNewsAnalysis,
      timestamp: new Date().toISOString()
    };
  }
};

export default analysisAPI;
