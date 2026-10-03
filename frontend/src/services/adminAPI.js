import axios from 'axios';

// Configuration de l'API pour le dashboard admin
const ADMIN_API_URL = 'http://localhost:5000/api';

const adminAPI = {
  // Envoyer les données d'analyse au dashboard admin
  sendAnalysisData: async (postData, analysisData) => {
    try {
      const payload = {
        post_id: postData.id,
        post_content: postData.content,
        post_author: postData.author,
        analysis: analysisData,
        timestamp: new Date().toISOString(),
        type: 'post_analysis'
      };

      console.log('Envoi des données d\'analyse au dashboard admin:', payload);
      const response = await axios.post(`${ADMIN_API_URL}/admin/analysis`, payload);
      console.log('Réponse du dashboard admin:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'envoi des données d\'analyse au dashboard admin:', error);
      throw error;
    }
  },

  // Fonction pour supprimer toutes les analyses
  clearAllAnalyses: async () => {
    try {
      console.log('Suppression de toutes les analyses...');
      const response = await axios.delete(`${ADMIN_API_URL}/admin/analysis/clear`);
      console.log('Toutes les analyses ont été supprimées:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la suppression des analyses:', error);
      throw error;
    }
  },

  // Fonction pour supprimer une analyse spécifique
  deleteAnalysis: async (analysisId) => {
    try {
      console.log(`Suppression de l'analyse ${analysisId}...`);
      const response = await axios.delete(`${ADMIN_API_URL}/admin/analysis/${analysisId}`);
      console.log(`Analyse ${analysisId} supprimée:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la suppression de l'analyse ${analysisId}:`, error);
      throw error;
    }
  },

  // Fonction pour supprimer plusieurs analyses en lot
  deleteBatchAnalyses: async (analysisIds) => {
    try {
      console.log('Suppression en lot des analyses:', analysisIds);
      const response = await axios.delete(`${ADMIN_API_URL}/admin/analysis/batch`, {
        data: { analysis_ids: analysisIds }
      });
      console.log('Analyses supprimées en lot:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la suppression en lot des analyses:', error);
      throw error;
    }
  },

  // Obtenir les statistiques d'analyse pour le dashboard admin
  getAnalysisStats: async () => {
    try {
      const response = await axios.get(`${ADMIN_API_URL}/admin/analysis/stats`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques d\'analyse:', error);
      throw error;
    }
  },

  // Obtenir les analyses détaillées
  getDetailedAnalyses: async () => {
    try {
      console.log('Récupération des analyses détaillées depuis:', `${ADMIN_API_URL}/admin/analysis/details`);
      const response = await axios.get(`${ADMIN_API_URL}/admin/analysis/details`);
      console.log('Analyses détaillées récupérées:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des analyses détaillées:', error);
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Data:', error.response.data);
      }
      throw error;
    }
  },

  // Signaler un post pour revue admin
  reportPost: async (postData, reason, analysisData = null) => {
    try {
      const payload = {
        post_id: postData.id,
        post_content: postData.content,
        post_author: postData.author,
        reason: reason,
        analysis_data: analysisData,
        timestamp: new Date().toISOString(),
        type: 'post_report'
      };

      const response = await axios.post(`${ADMIN_API_URL}/admin/reports`, payload);
      return response.data;
    } catch (error) {
      console.error('Erreur lors du signalement du post:', error);
      throw error;
    }
  },

  // Obtenir les posts signalés
  getReportedPosts: async () => {
    try {
      const response = await axios.get(`${ADMIN_API_URL}/admin/reports`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des posts signalés:', error);
      throw error;
    }
  }
};

export default adminAPI;
