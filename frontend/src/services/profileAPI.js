import api from './api';

const profileAPI = {
  getProfile: async () => {
    try {
      return await api.get('/profile');
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);
      throw error;
    }
  },

  updateProfile: async (profileData) => {
    try {
      return await api.put('/profile', profileData);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      throw error;
    }
  },

  uploadPhoto: async (file) => {
    try {
      const formData = new FormData();
      formData.append('photo', file);
      return await api.post('/profile/photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (error) {
      console.error("Erreur lors de l'upload de la photo:", error);
      throw error;
    }
  },

  deletePhoto: async () => {
    try {
      return await api.delete('/profile/photo');
    } catch (error) {
      console.error('Erreur lors de la suppression de la photo:', error);
      throw error;
    }
  }
};

export default profileAPI;
