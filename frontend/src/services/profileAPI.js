import api from './api';

const profileAPI = {
  // Obtenir les informations du profil
  getProfile: async () => {
    try {
      const response = await api.get('/profile');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);
      throw error;
    }
  },

  // Mettre à jour les informations du profil
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/profile', profileData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      throw error;
    }
  },

  // Uploader la photo de profil
  uploadPhoto: async (file) => {
    try {
      const formData = new FormData();
      formData.append('photo', file);
      
      const response = await api.post('/profile/photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'upload de la photo:', error);
      throw error;
    }
  },

  // Supprimer la photo de profil
  deletePhoto: async () => {
    try {
      const response = await api.delete('/profile/photo');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la suppression de la photo:', error);
      throw error;
    }
  }
};

export default profileAPI;
