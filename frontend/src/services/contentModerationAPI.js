import axios from 'axios';

// Configuration de l'API pour la modération de contenu
const MODERATION_API_URL = 'http://localhost:5000/api';

const contentModerationAPI = {
  // Analyser une image pour détecter du contenu inapproprié
  analyzeImage: async (imageFile, userId = null) => {
    try {
      // Convertir le fichier en base64
      const base64 = await fileToBase64(imageFile);
      
      const response = await axios.post(`${MODERATION_API_URL}/content/analyze-image`, {
        image_data: base64,
        user_id: userId,
        context: "post_upload"
      });
      
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'analyse de l\'image:', error);
      throw error;
    }
  },

  // Analyser plusieurs images en batch
  batchAnalyze: async (imageFiles, userId = null) => {
    try {
      const base64Images = await Promise.all(
        imageFiles.map(file => fileToBase64(file))
      );
      
      const response = await axios.post(`${MODERATION_API_URL}/content/batch-analyze`, base64Images);
      
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'analyse batch des images:', error);
      throw error;
    }
  },

  // Obtenir les statistiques de modération
  getStats: async () => {
    try {
      const response = await axios.get(`${MODERATION_API_URL}/content/stats`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      throw error;
    }
  }
};

// Helper function pour convertir un fichier en base64
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // Extraire seulement les données base64 (sans le préfixe data:image/...;base64,)
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
}

export default contentModerationAPI;
