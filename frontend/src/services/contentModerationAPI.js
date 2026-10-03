import axios from 'axios';

const MODERATION_API_URL =
  import.meta.env.VITE_AI_API_URL || 'https://e-boss-ai-api.onrender.com/api';

const contentModerationAPI = {
  analyzeImage: async (imageFile, userId = null) => {
    const base64 = await fileToBase64(imageFile);
    const response = await axios.post(`${MODERATION_API_URL}/content/analyze-image`, {
      image_data: base64,
      user_id: userId,
      context: 'post_upload'
    });
    return response.data;
  },

  batchAnalyze: async (imageFiles, userId = null) => {
    const base64Images = await Promise.all(imageFiles.map(file => fileToBase64(file)));
    const response = await axios.post(
      `${MODERATION_API_URL}/content/batch-analyze`,
      base64Images
    );
    return response.data;
  },

  getStats: async () => {
    const response = await axios.get(`${MODERATION_API_URL}/content/stats`);
    return response.data;
  }
};

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
  });
}

export default contentModerationAPI;
