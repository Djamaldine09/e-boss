import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/theme-context';
import SnowLayer from '../snow-layer';
import DashboardNavbar from './dashboard-navbar';
import Sidebar from './sidebar';
import Footer from '../footer';
import profileAPI from '../../services/profileAPI';

const Profile = ({ standalone = false }) => {
  const { theme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: '',
    location: '',
    website: '',
    github: '',
    linkedin: '',
    twitter: '',
    skills: [],
    languages: [],
    education: [],
    experience: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [error, setError] = useState(null);

  // Charger les données utilisateur depuis l'API
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Essayer de charger depuis l'API d'abord
        try {
          const profile = await profileAPI.getProfile();
          setProfileData(profile);
          
          // Mettre à jour le localStorage
          localStorage.setItem('user', JSON.stringify(profile));
        } catch (apiError) {
          console.log('API non disponible, utilisation du localStorage');
          
          // Fallback sur le localStorage
          const userData = localStorage.getItem('user');
          if (userData) {
            const user = JSON.parse(userData);
            setProfileData({
              firstName: user.firstName || user.name || 'Utilisateur',
              lastName: user.lastName || '',
              email: user.email || 'user@example.com',
              phone: user.phone || '',
              bio: user.bio || 'Développeur passionné par les nouvelles technologies.',
              location: user.location || 'France',
              website: user.website || '',
              github: user.github || '',
              linkedin: user.linkedin || '',
              twitter: user.twitter || '',
              skills: user.skills || ['JavaScript', 'React', 'Node.js'],
              languages: user.languages || ['Français', 'Anglais'],
              education: user.education || [],
              experience: user.experience || []
            });
          } else {
            // Données par défaut si pas d'utilisateur connecté
            setProfileData({
              firstName: 'Visiteur',
              lastName: '',
              email: 'visiteur@example.com',
              phone: '',
              bio: 'Connectez-vous pour personnaliser votre profil.',
              location: 'Non spécifié',
              website: '',
              github: '',
              linkedin: '',
              twitter: '',
              skills: ['JavaScript', 'React', 'Node.js'],
              languages: ['Français'],
              education: [],
              experience: []
            });
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données utilisateur:', error);
        setError('Impossible de charger les données du profil');
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);
  
  const fileInputRef = useRef(null);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      
      // Sauvegarder via l'API
      await profileAPI.updateProfile(profileData);
      
      // Mettre à jour le localStorage
      localStorage.setItem('user', JSON.stringify(profileData));
      
      setIsEditing(false);
      console.log('Profil sauvegardé avec succès');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du profil:', error);
      setError('Impossible de sauvegarder le profil. Veuillez réessayer.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field, index, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        setUploadingPhoto(true);
        setError(null);
        
        // Uploader la photo via l'API
        const result = await profileAPI.uploadPhoto(file);
        
        // Mettre à jour le profil avec le nouveau chemin
        setProfileData(prev => ({
          ...prev,
          profile_photo: result.photoPath
        }));
        
        // Mettre à jour le localStorage
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        userData.profile_photo = result.photoPath;
        localStorage.setItem('user', JSON.stringify(userData));
        
        console.log('Photo uploadée avec succès:', result.photoPath);
      } catch (error) {
        console.error('Erreur lors de l\'upload de la photo:', error);
        setError('Impossible d\'uploader la photo. Veuillez réessayer.');
      } finally {
        setUploadingPhoto(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen glass flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen glass">
      {!standalone && <DashboardNavbar onSidebarToggle={toggleSidebar} sidebarOpen={sidebarOpen} />}
      {!standalone && <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />}
      
      {/* Affichage des erreurs */}
      {error && (
        <div className="fixed top-4 right-4 z-50 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg shadow-lg max-w-sm">
          <div className="flex">
            <span className="text-lg mr-2">⚠️</span>
            <span>{error}</span>
          </div>
        </div>
      )}
      
      {/* Background avec dégradé et Blobs améliorés */}
      <div className="fixed inset-0 overflow-hidden -z-20 pointer-events-none">
        {/* Fond dégradé selon le thème */}
        <div className={`absolute inset-0 ${
          theme === 'dark' 
            ? 'bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900' 
            : 'bg-gradient-to-br from-blue-50 via-purple-50/30 to-pink-50'
        }`} />
        
        {/* Les cercles de couleurs (Blobs) améliorés */}
        <div className={`absolute rounded-full top-60 left-1/4 -translate-x-1/2 size-150 blur-[120px] ${
          theme === 'dark' 
            ? 'bg-gradient-to-r from-purple-600/30 to-blue-600/30' 
            : 'bg-gradient-to-r from-blue-400/40 to-purple-400/40'
        }`} />
        
        <div className={`absolute rounded-full top-40 right-1/4 translate-x-1/2 size-180 blur-[140px] ${
          theme === 'dark' 
            ? 'bg-gradient-to-r from-pink-600/25 to-orange-600/25' 
            : 'bg-gradient-to-r from-pink-400/35 to-orange-400/35'
        }`} />
        
        <div className={`absolute rounded-full bottom-20 left-1/2 -translate-x-1/2 size-200 blur-[160px] ${
          theme === 'dark' 
            ? 'bg-gradient-to-r from-cyan-600/20 to-teal-600/20' 
            : 'bg-gradient-to-r from-cyan-400/30 to-teal-400/30'
        }`} />
        
        {/* Particules flottantes additionnelles */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-full blur-[80px] animate-pulse" />
        <div className="absolute bottom-40 left-20 w-40 h-40 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full blur-[90px] animate-pulse" />
        
        {/* La couche de neige par-dessus tout */}
        <SnowLayer />
      </div>
      
      <main className={`pt-16 sm:pt-20 pb-24 sm:pb-32 px-4 sm:px-6 transition-all duration-300 ${
        sidebarOpen ? 'lg:ml-72' : 'lg:ml-0'
      }`}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Header du profil */}
            <div className="glass p-4 sm:p-6 lg:p-8 rounded-2xl mb-8">
              <div className="flex flex-col lg:flex-row items-center gap-4 sm:gap-6">
                {/* Photo de profil */}
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl sm:text-3xl font-bold shadow-xl overflow-hidden">
                      {profileData.profile_photo ? (
                        <img 
                          src={`http://localhost:3000${profileData.profile_photo}`} 
                          alt="Photo de profil"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>{profileData.firstName?.charAt(0)?.toUpperCase() || 'U'}</span>
                      )}
                    </div>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingPhoto || !isEditing}
                      className={`absolute bottom-0 right-0 w-8 h-8 text-white rounded-full flex items-center justify-center transition-colors shadow-lg ${
                        uploadingPhoto 
                          ? 'bg-gray-500 cursor-not-allowed' 
                          : 'bg-blue-600 hover:bg-blue-700'
                      } ${!isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {uploadingPhoto ? '⏳' : '📷'}
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      disabled={!isEditing || uploadingPhoto}
                      className="hidden"
                    />
                  </div>
                  <div className={`text-sm mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {uploadingPhoto ? 'Upload en cours...' : (isEditing ? 'Cliquez pour changer votre photo' : 'Mode édition requis pour changer la photo')}
                  </div>
                </div>

                {/* Infos principales */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <h1 className={`text-2xl sm:text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Mon Profil
                    </h1>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <button
                        onClick={handleEdit}
                        disabled={saving || uploadingPhoto}
                        className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-all text-sm sm:text-base ${
                          isEditing
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        } ${saving || uploadingPhoto ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {saving ? 'Sauvegarde...' : (isEditing ? 'Sauvegarder' : 'Modifier')}
                      </button>
                      {isEditing && (
                        <button
                          onClick={handleCancel}
                          disabled={saving}
                          className={`px-4 py-2 rounded-lg font-medium transition-all ${
                            theme === 'dark' 
                              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          } ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          Annuler
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Prénom
                      </label>
                      <input
                        type="text"
                        value={profileData.firstName}
                        onChange={(e) => handleChange('firstName', e.target.value)}
                        disabled={!isEditing}
                        className={`w-full p-2 sm:p-3 rounded-lg border text-sm ${
                          !isEditing
                            ? theme === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-500' : 'bg-gray-100 border-gray-300 text-gray-500'
                            : theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Nom
                      </label>
                      <input
                        type="text"
                        value={profileData.lastName}
                        onChange={(e) => handleChange('lastName', e.target.value)}
                        disabled={!isEditing}
                        className={`w-full p-2 sm:p-3 rounded-lg border text-sm ${
                          !isEditing
                            ? theme === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-500' : 'bg-gray-100 border-gray-300 text-gray-500'
                            : theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Email
                      </label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        disabled={!isEditing}
                        className={`w-full p-2 sm:p-3 rounded-lg border text-sm ${
                          !isEditing
                            ? theme === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-500' : 'bg-gray-100 border-gray-300 text-gray-500'
                            : theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        disabled={!isEditing}
                        className={`w-full p-2 sm:p-3 rounded-lg border text-sm ${
                          !isEditing
                            ? theme === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-500' : 'bg-gray-100 border-gray-300 text-gray-500'
                            : theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Biographie
                    </label>
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => handleChange('bio', e.target.value)}
                      disabled={!isEditing}
                      rows={4}
                      className={`w-full p-3 rounded-lg border resize-none ${
                        !isEditing
                          ? theme === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-500' : 'bg-gray-100 border-gray-300 text-gray-500'
                          : theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
                        }`}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation par onglets */}
            <div className="glass p-2 mb-8 rounded-2xl">
              <div className="flex flex-wrap gap-2">
                {['personal', 'skills', 'education', 'experience', 'social'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      activeTab === tab
                        ? 'bg-blue-600 text-white'
                        : `${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} hover:bg-white/10`
                    }`}
                  >
                    {tab === 'personal' && 'Infos Personnelles'}
                    {tab === 'skills' && 'Compétences'}
                    {tab === 'education' && 'Formation'}
                    {tab === 'experience' && 'Expérience'}
                    {tab === 'social' && 'Réseaux Sociaux'}
                  </button>
                ))}
              </div>
            </div>

            {/* Contenu des onglets */}
            <div className="glass p-8 rounded-2xl">
              {activeTab === 'personal' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Informations Personnelles
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>📍</span>
                        <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                          {profileData.location}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>🌐</span>
                        <a href={profileData.website} className={`text-blue-500 hover:underline ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                          {profileData.website}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'skills' && (
                <div>
                  <h3 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Compétences Techniques
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {profileData.skills.map((skill, index) => (
                      <div
                        key={index}
                        className={`px-4 py-2 rounded-full text-sm font-medium ${
                          theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {skill}
                      </div>
                    ))}
                  </div>
                  <div className="mt-6">
                    <h4 className={`text-lg font-medium mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Langues
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {profileData.languages.map((language, index) => (
                        <div
                          key={index}
                          className={`px-3 py-1 rounded-lg text-sm ${
                            theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                          }`}
                        >
                          {language}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'education' && (
                <div>
                  <h3 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Formation
                  </h3>
                  <div className="space-y-4">
                    {profileData.education.map((edu, index) => (
                      <div key={index} className="p-4 rounded-xl border-l-4 border-blue-500 bg-blue-500/5">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                              {edu.degree}
                            </h4>
                            <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                              {edu.school} • {edu.year}
                            </div>
                            <p className={`text-sm mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>
                              {edu.description}
                            </p>
                          </div>
                          <div className={`text-lg font-bold text-blue-500`}>
                            {edu.year}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'experience' && (
                <div>
                  <h3 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Expérience Professionnelle
                  </h3>
                  <div className="space-y-4">
                    {profileData.experience.map((exp, index) => (
                      <div key={index} className="p-4 rounded-xl border-l-4 border-green-500 bg-green-500/5">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                              {exp.title}
                            </h4>
                            <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                              {exp.company} • {exp.period}
                            </div>
                            <p className={`text-sm mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>
                              {exp.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'social' && (
                <div>
                  <h3 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Réseaux Sociaux
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl hover:shadow-xl transition-all">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">💻</div>
                        <div>
                          <div className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            GitHub
                          </div>
                          <a 
                            href={`https://github.com/${profileData.github}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`text-blue-500 hover:underline ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
                          >
                            @{profileData.github}
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 rounded-xl hover:shadow-xl transition-all">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">💼</div>
                        <div>
                          <div className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            LinkedIn
                          </div>
                          <a 
                            href={`https://linkedin.com/in/${profileData.linkedin}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`text-blue-500 hover:underline ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
                          >
                            {profileData.linkedin}
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 rounded-xl hover:shadow-xl transition-all">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">🐦</div>
                        <div>
                          <div className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            Twitter
                          </div>
                          <a 
                            href={`https://twitter.com/${profileData.twitter}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`text-blue-500 hover:underline ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
                          >
                            {profileData.twitter}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </main>
      
      {!standalone && <Footer />}
    </div>
  );
};

export default Profile;
