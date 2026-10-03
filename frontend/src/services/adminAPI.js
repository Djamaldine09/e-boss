import axios from 'axios';

const ADMIN_API_URL =
  import.meta.env.VITE_API_URL || 'https://e-boss-backend.onrender.com/api';

const adminAPI = {
  sendAnalysisData: async (postData, analysisData) => {
    const payload = {
      post_id: postData.id,
      post_content: postData.content,
      post_author: postData.author,
      analysis: analysisData,
      timestamp: new Date().toISOString(),
      type: 'post_analysis'
    };
    const response = await axios.post(`${ADMIN_API_URL}/admin/analysis`, payload);
    return response.data;
  },

  clearAllAnalyses: async () => {
    const response = await axios.delete(`${ADMIN_API_URL}/admin/analysis/clear`);
    return response.data;
  },

  deleteAnalysis: async (analysisId) => {
    const response = await axios.delete(`${ADMIN_API_URL}/admin/analysis/${analysisId}`);
    return response.data;
  },

  deleteBatchAnalyses: async (analysisIds) => {
    const response = await axios.delete(`${ADMIN_API_URL}/admin/analysis/batch`, {
      data: { analysis_ids: analysisIds }
    });
    return response.data;
  },

  getAnalysisStats: async () => {
    const response = await axios.get(`${ADMIN_API_URL}/admin/analysis/stats`);
    return response.data;
  },

  getDetailedAnalyses: async () => {
    const response = await axios.get(`${ADMIN_API_URL}/admin/analysis/details`);
    return response.data;
  },

  reportPost: async (postData, reason, analysisData = null) => {
    const payload = {
      post_id: postData.id,
      post_content: postData.content,
      post_author: postData.author,
      reason,
      analysis_data: analysisData,
      timestamp: new Date().toISOString(),
      type: 'post_report'
    };
    const response = await axios.post(`${ADMIN_API_URL}/admin/reports`, payload);
    return response.data;
  },

  getReportedPosts: async () => {
    const response = await axios.get(`${ADMIN_API_URL}/admin/reports`);
    return response.data;
  }
};

export default adminAPI;
