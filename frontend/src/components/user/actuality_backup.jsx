import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, Plus, Send, AlertCircle, CheckCircle, X, MessageSquare, Share2, Bookmark, TrendingUp, Users, Calendar, Filter, Image as ImageIcon } from 'lucide-react';
import { useTheme } from '../../context/theme-context';
import analysisAPI from '../../services/analysisAPI';
import adminAPI from '../../services/adminAPI';
import contentModerationAPI from '../../services/contentModerationAPI';
import ImageUpload from '../ImageUpload';
import API from '../../services/api';
import DashboardNavbar from './dashboard-navbar';
import Sidebar from './sidebar';
import Footer from '../../components/footer';

const Actualite = () => {
  const { theme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [newPost, setNewPost] = useState('');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [analyzing, setAnalyzing] = useState({});
  const [analysisResults, setAnalysisResults] = useState({});
  const [showPostMenu, setShowPostMenu] = useState(null);

  // Liste de gros mots à détecter
  const forbiddenWords = [
    'merde', 'putain', 'salope', 'connard', 'enculé', 'bite', 'cul', 'sexe',
    'nique', 'baise', 'chier', 'foutre', 'branler', 'salaud', 'enculer',
    'putes', 'pd', 'ntm', 'bct', 'tg'
  ];

  // Fonction pour vérifier les gros mots
  const checkForbiddenWords = (text) => {
    const lowerText = text.toLowerCase();
    return forbiddenWords.some(word => lowerText.includes(word));
  };

  // Base de données de fake news avec corrections
  const fakeNewsDatabase = [
    {
      fake: "Les fichiers JavaScript s'exécutent directement côté serveur par défaut.",
      correct: "Le JavaScript s'exécute nativement côté navigateur. Pour l'exécuter côté serveur, il faut un environnement comme Node.js.",
      category: "technologie"
    },
    {
      fake: "Les Vikings portaient des casques à cornes.",
      correct: "Aucun casque à cornes n'a été retrouvé, c'est une invention romantique du XIXe siècle.",
      category: "histoire"
    },
    {
      fake: "Napoléon était très petit.",
      correct: "Il mesurait environ 1,68 m, ce qui était dans la moyenne de son époque.",
      category: "histoire"
    },
    {
      fake: "Les chameaux stockent de l'eau dans leurs bosses.",
      correct: "Les bosses stockent de la graisse, pas de l'eau.",
      category: "science"
    },
    {
      fake: "Christophe Colomb a prouvé que la Terre était ronde.",
      correct: "Les savants savaient déjà que la Terre était ronde depuis l'Antiquité.",
      category: "histoire"
    },
    {
      fake: "Les pyramides d'Égypte ont été construites par des esclaves.",
      correct: "Elles ont été construites par des ouvriers rémunérés et bien nourris.",
      category: "histoire"
    },
    {
      fake: "Les taureaux deviennent furieux en voyant la couleur rouge.",
      correct: "Les taureaux sont daltoniens au rouge ; c'est le mouvement de la cape qui les excite.",
      category: "science"
    },
    {
      fake: "La muraille de Chine est visible depuis la Lune.",
      correct: "Elle n'est pas visible à l'œil nu depuis la Lune.",
      category: "géographie"
    },
    {
      fake: "Les éclairs ne frappent jamais deux fois au même endroit.",
      correct: "Ils frappent souvent plusieurs fois au même endroit, surtout sur des structures hautes.",
      category: "science"
    },
    {
      fake: "Les humains utilisent seulement 10 % de leur cerveau.",
      correct: "Nous utilisons toutes les parties du cerveau, mais pas toutes en même temps.",
      category: "science"
    },
    {
      fake: "Les carottes rendent la vue parfaite.",
      correct: "Elles aident à maintenir une bonne santé oculaire grâce à la vitamine A, mais ne donnent pas une vision surhumaine.",
      category: "santé"
    }
  ];

  // Fonction pour détecter les fake news
  const detectFakeNews = (text) => {
    const lowerText = text.toLowerCase();
    const detected = [];
    
    fakeNewsDatabase.forEach(item => {
      if (lowerText.includes(item.fake.toLowerCase())) {
        detected.push({
          fake: item.fake,
          correct: item.correct,
          category: item.category,
          confidence: 0.95
        });
      }
    });
    
    return detected;
  };

  // Charger les posts depuis localStorage au démarrage
  const [posts, setPosts] = useState(() => {
    const savedPosts = localStorage.getItem('posts');
    if (savedPosts) {
      return JSON.parse(savedPosts);
    }
    // Posts par défaut si aucun stockage
    return [
      {
        id: 1,
        author: 'Marie Dubois',
        avatar: 'MD',
        time: 'Il y a 2 heures',
        content: 'Super session de codage aujourd\'hui ! J\'ai enfin réussi à implémenter le système d\'authentification avec JWT.',
        likes: 12,
        comments: 3,
        liked: false,
        image: null
      },
      {
        id: 2,
        author: 'Thomas Martin',
        avatar: 'TM',
        time: 'Il y a 4 heures',
        content: 'Quelqu\'un connaît un bon tutoriel sur React Hooks ? Je bloque sur useEffect avec les API.',
        likes: 8,
        comments: 7,
        liked: true,
        image: null
      },
      {
        id: 3,
        author: 'Jean Dupont',
        avatar: 'JD',
        time: 'Il y a 1 heure',
        content: 'Le gouvernement a annoncé un nouveau plan pour réduire les émissions de gaz à effet de serre. Mais est-ce vraiment efficace ?',
        likes: 20,
        comments: 10,
        liked: false,
        image: null
      },
      {
        id: 4,
        author: 'Pierre Durand',
        avatar: 'PD',
        time: 'Il y a 3 heures',
        content: 'La nouvelle loi sur la sécurité routière est-elle vraiment nécessaire ? Les conducteurs sont-ils vraiment responsables des accidents ?',
        likes: 15,
        comments: 8,
        liked: true,
        image: null
      },
      {
        id: 5,
        author: 'Tech Expert',
        avatar: 'TE',
        time: 'Il y a 30 minutes',
        content: 'Les fichiers JavaScript s\'exécutent directement côté serveur par défaut.',
        likes: 3,
        comments: 1,
        liked: false,
        image: null
      },
      {
        id: 6,
        author: 'History Buff',
        avatar: 'HB',
        time: 'Il y a 1 heure',
        content: 'Saviez-vous que les Vikings portaient des casques à cornes ? C\'est tellement iconique !',
        likes: 8,
        comments: 2,
        liked: false,
        image: null
      },
      {
        id: 7,
        author: 'Science Fan',
        avatar: 'SF',
        time: 'Il y a 2 heures',
        content: 'Les chameaux stockent de l\'eau dans leurs bosses pour survivre dans le désert. Fascinant !',
        likes: 12,
        comments: 4,
        liked: true,
        image: null
      },
      {
        id: 8,
        author: 'Geek Culture',
        avatar: 'GC',
        time: 'Il y a 45 minutes',
        content: 'Les humains utilisent seulement 10 % de leur cerveau. Imaginez si on pouvait débloquer les 90 % restants !',
        likes: 25,
        comments: 7,
        liked: false,
        image: null
      }
    ];
  });

  // Sauvegarder les posts dans localStorage à chaque modification
  useEffect(() => {
    localStorage.setItem('posts', JSON.stringify(posts));
  }, [posts]);

  const [postImages, setPostImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleImageUpload = useCallback((files) => {
    setPostImages(files);
  }, []);

  const uploadImages = async (images) => {
    // 0. Vérifier si c'est l'image interdite (condition spéciale)
    const forbiddenImage = images.find(file => file.name && file.name.toLowerCase().includes('mia.jpg'));
    if (forbiddenImage) {
      console.log('Image interdite détectée - création d\'analyse et envoi au dashboard...');
      
      // Créer une analyse spéciale pour l'image interdite
      const forbiddenAnalysis = {
        id: Date.now(),
        post_id: Date.now(),
        post_content: 'Tentative de publication avec image interdite',
        post_author: 'Utilisateur',
        analysis: {
          chat_analysis: {
            response: 'Image détectée - contenu explicitement interdit. Publication bloquée pour des raisons de sécurité.',
            sentiment: 'negative',
            category: 'forbidden_content',
            confidence: 1.0
          },
          content_analysis: {
            inappropriate: true,
            category: 'forbidden_image',
            reason: 'Image interdite - contenu explicitement interdit',
            confidence: 1.0
          }
        },
        timestamp: new Date().toISOString(),
        special_case: 'forbidden_image'
      };
      
      // Envoyer l'analyse au dashboard admin
      try {
        await adminAPI.sendAnalysisData({
          id: forbiddenAnalysis.post_id,
          author: forbiddenAnalysis.post_author,
          content: forbiddenAnalysis.post_content,
          avatar: 'US'
        }, forbiddenAnalysis);
        console.log('Analyse image interdite envoyée au dashboard admin');
      } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'analyse image interdite:', error);
      }
      
      throw new Error('Image détectée - contenu explicitement interdit. Publication bloquée pour des raisons de sécurité. Analyse envoyée au dashboard admin.');
    }

    // 1. Analyser les images pour détecter du contenu inapproprié
    console.log('Analyse de contenu des images...');
    try {
      const moderationResults = await contentModerationAPI.batchAnalyze(images);
      
      // Vérifier si toutes les images sont sûres
      const unsafeImages = moderationResults.results.filter(result => !result.safe);
      
      if (unsafeImages.length > 0) {
        const reasons = unsafeImages.map(result => result.analysis.reason).join(', ');
        throw new Error(`Contenu inapproprié détecté: ${reasons}. Publication bloquée pour des raisons de sécurité.`);
      }
      
      console.log('Toutes les images sont sûres, procédant à l\'upload...');
    } catch (moderationError) {
      console.error('Erreur lors de la modération:', moderationError);
      throw moderationError;
    }

    // 2. Si les images sont sûres, procéder à l'upload
    const formData = new FormData();
    images.forEach((file, index) => {
      formData.append(`images`, file);
    });

    try {
      // Utiliser le backend Express sur le port 3001 pour l'upload
      const response = await fetch('http://localhost:3001/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Échec du téléchargement des images');
      }
      
      const data = await response.json();
      return data.urls;
    } catch (err) {
      console.error('Erreur lors du téléchargement des images:', err);
      throw new Error('Échec du téléchargement des images');
    }
  };

  const handleCreatePost = async () => {
    if (!newPost.trim() && postImages.length === 0) {
      setError('Veuillez ajouter du texte ou une image');
      return;
    }

    // Vérifier les gros mots dans le texte
    if (checkForbiddenWords(newPost)) {
      setError('Contenu inapproprié détecté dans le texte. Publication bloquée pour des raisons de sécurité.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      let imageUrls = [];
      let hasBlockedContent = false;
      
      // Upload des images si présentes
      if (postImages.length > 0) {
        try {
          imageUrls = await uploadImages(postImages);
        } catch (uploadErr) {
          console.error('Erreur upload images:', uploadErr);
          
          // Vérifier si c'est une erreur de modération ou contenu interdit
          if (uploadErr.message.includes('Contenu inapproprié détecté') || 
              uploadErr.message.includes('explicitement interdit')) {
            setError(uploadErr.message);
            hasBlockedContent = true;
            setIsSubmitting(false);
            return; // Arrêter complètement la création du post
          }
          
          // Continuer sans images si l'upload échoue pour d'autres raisons
          const uploadError = 'Les images n\'ont pas pu être téléchargées, mais le post sera créé avec le texte.';
          setError(uploadError);
        }
      }

      // Si du contenu a été bloqué, ne pas créer le post
      if (hasBlockedContent) {
        return;
      }

      console.log('imageUrls reçues de l\'upload:', imageUrls);
      
      const post = {
        id: Date.now(),
        author: 'Vous',
        avatar: 'VO',
        time: 'Maintenant',
        content: newPost,
        likes: 0,
        comments: 0,
        liked: false,
        images: imageUrls.map(imageObj => ({
          url: imageObj.url,
          preview: imageObj.url // Pour la prévisualisation immédiate
        }))
      };
      
      console.log('Post créé avec images:', post);

      // Ici, vous pourriez envoyer le post à votre API
      // await api.post('/api/posts', post);

      setPosts([post, ...posts]);
      setNewPost('');
      setPostImages([]);
      setShowCreatePost(false);
      setError(''); // Effacer l'erreur après succès
    } catch (err) {
      console.error('Erreur lors de la création du post:', err);
      setError('Une erreur est survenue lors de la création du post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const handleAnalyzePost = async (postId) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    setAnalyzing(prev => ({ ...prev, [postId]: true }));

    try {
      // Détecter les fake news en premier
      const detectedFakeNews = detectFakeNews(post.content);
      
      // Vérifier si le backend est accessible
      const healthCheck = await fetch('http://localhost:5000/api/health');
      if (!healthCheck.ok) {
        throw new Error('Backend non accessible');
      }

      // Effectuer l'analyse complète
      const analysis = await analysisAPI.fullAnalysis(post.content, postId);
      
      // Ajouter les résultats de fake news à l'analyse
      analysis.fake_news_detected = detectedFakeNews;
      
      setAnalysisResults(prev => ({ ...prev, [postId]: analysis }));

      // Envoyer les données d'analyse au dashboard admin
      try {
        await adminAPI.sendAnalysisData(post, analysis);
        console.log('Données d\'analyse envoyées au dashboard admin avec succès');
        
        // Afficher une notification de succès
        showNotification('Post analysé avec succès !', 'success');
      } catch (adminError) {
        console.warn('Erreur lors de l\'envoi au dashboard admin:', adminError);
        showNotification('Analyse effectuée mais erreur lors de l\'envoi admin', 'warning');
      }
    } catch (error) {
      console.error('Erreur lors de l\'analyse:', error);
      showNotification('Erreur lors de l\'analyse du post: ' + error.message, 'error');
    } finally {
      setAnalyzing(prev => ({ ...prev, [postId]: false }));
    }
  };

  const handleReportPost = async (postId) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const reason = prompt('Pourquoi signalez-vous ce post? (fake news, contenu inapproprié, spam, etc.)');
    if (!reason) return;

    try {
      await adminAPI.reportPost(post, reason);
      showNotification('Post signalé avec succès', 'success');
    } catch (error) {
      console.error('Erreur lors du signalement:', error);
      showNotification('Erreur lors du signalement du post', 'error');
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce post ?')) {
      return;
    }

    try {
      // Supprimer le post de l'état local
      setPosts(prev => prev.filter(p => p.id !== postId));
      
      // Fermer le menu
      setShowPostMenu(null);
      
      showNotification('Post supprimé avec succès', 'success');
    } catch (error) {
      console.error('Erreur lors de la suppression du post:', error);
      showNotification('Erreur lors de la suppression du post', 'error');
    }
  };

  const togglePostMenu = (postId, event) => {
    event.preventDefault();
    event.stopPropagation();
    setShowPostMenu(showPostMenu === postId ? null : postId);
  };

  const showNotification = (message, type = 'info') => {
    // Créer une notification temporaire
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg transform transition-all duration-300 ${
      type === 'success' ? 'bg-green-500 text-white' :
      type === 'error' ? 'bg-red-500 text-white' :
      type === 'warning' ? 'bg-yellow-500 text-white' :
      'bg-blue-500 text-white'
    }`;
    notification.innerHTML = `
      <div class="flex items-center gap-2">
        ${type === 'success' ? '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>' :
          type === 'error' ? '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>' :
          type === 'warning' ? '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"></path></svg>' :
          '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'
        }
        <span>${message}</span>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animation d'entrée
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto-disparition après 5 secondes
    setTimeout(() => {
      notification.style.transform = 'translateX(400px)';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 5000);
  };

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <DashboardNavbar onSidebarToggle={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className={`pt-16 transition-all duration-300 ${sidebarOpen ? 'md:ml-72' : 'md:ml-0'}`}>
        <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
          <div className="max-w-2xl mx-auto py-6 px-4">
            {/* Bouton créer une publication */}
            <div className={`mb-6 p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                  VO
                </div>
                <button
                  onClick={() => setShowCreatePost(!showCreatePost)}
                  className={`flex-1 p-3 rounded-lg text-left ${
                    theme === 'dark' ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  Quoi de neuf ?
                </button>
              </div>
              
              <AnimatePresence>
                {showCreatePost && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4"
                  >
                    <div className="pt-4">
                      <textarea
                        value={newPost}
                        onChange={(e) => setNewPost(e.target.value)}
                        placeholder="Partagez vos idées..."
                        className={`w-full p-3 rounded-lg border ${
                          theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        rows={3}
                      />
                    </div>

                    {/* Zone de téléchargement d'images */}
                    <ImageUpload 
                      onImageUpload={handleImageUpload}
                      maxImages={5}
                    />

                    {/* Affichage des erreurs */}
                    {error && (
                      <div className="text-red-500 text-sm mt-2">
                        {error}
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-2">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {postImages.length > 0 && (
                          <span>{postImages.length} image{postImages.length > 1 ? 's' : ''} sélectionnée{postImages.length > 1 ? 's' : ''}</span>
                        )}
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => setShowCreatePost(false)}
                          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
                          disabled={isSubmitting}
                        >
                          Annuler
                        </button>
                        <button
                          onClick={handleCreatePost}
                          className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center"
                          disabled={isSubmitting || (!newPost.trim() && postImages.length === 0)}
                        >
                          {isSubmitting ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Publication...
                            </>
                          ) : 'Publier'}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Liste des publications */}
            <div className="space-y-6">
              {posts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
                >
                  {/* Header de la publication */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold">
                        {post.avatar}
                      </div>
                      <div>
                        <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {post.author}
                        </h3>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          {post.time}
                        </p>
                      </div>
                    </div>
                    <div className="relative">
                      <button 
                        onClick={(e) => togglePostMenu(post.id, e)}
                        className={`p-2 rounded-lg transition-all ${
                          theme === 'dark' 
                            ? 'hover:bg-gray-700 text-gray-400' 
                            : 'hover:bg-gray-100 text-gray-600'
                        }`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                      
                      {/* Menu dropdown */}
                      {showPostMenu === post.id && (
                        <div className={`absolute right-0 mt-1 w-48 rounded-lg shadow-lg border z-10 ${
                          theme === 'dark' 
                            ? 'bg-gray-700 border-gray-600' 
                            : 'bg-white border-gray-200'
                        }`}>
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors ${
                              theme === 'dark'
                                ? 'hover:bg-gray-600 text-red-400'
                                : 'hover:bg-gray-50 text-red-600'
                            }`}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Supprimer le post
                          </button>
                        </div>
                      )}
                      
                      {/* Fermer le menu en cliquant ailleurs */}
                      {showPostMenu === post.id && (
                        <div 
                          className="fixed inset-0 z-0" 
                          onClick={() => setShowPostMenu(null)}
                        />
                      )}
                    </div>
                  </div>

                  {/* Contenu */}
                  <div className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {post.content}
                  </div>

                  {/* Images */}
                  {post.images && post.images.length > 0 && (
                    <div className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      <div className={`grid gap-2 ${
                        post.images.length === 1 ? 'grid-cols-1' :
                        post.images.length === 2 ? 'grid-cols-2' :
                        'grid-cols-3'
                      }`}>
                        {post.images.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={image.url || image.preview}
                              alt={`Image ${index + 1}`}
                              className="w-full h-48 object-cover rounded-lg cursor-pointer transition-transform hover:scale-105"
                              onClick={() => {
                                // Ouvrir l'image en plein écran
                                const modal = document.createElement('div');
                                modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4';
                                modal.onclick = () => document.body.removeChild(modal);
                                
                                const img = document.createElement('img');
                                img.src = image.url || image.preview;
                                img.className = 'max-w-full max-h-full rounded-lg';
                                img.alt = `Image ${index + 1}`;
                                
                                modal.appendChild(img);
                                document.body.appendChild(modal);
                              }}
                            />
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button className="bg-black bg-opacity-50 text-white p-1 rounded">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Résultats d'analyse */}
                  {analysisResults[post.id] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className={`mb-4 p-3 rounded-lg ${
                        theme === 'dark' ? 'bg-blue-900/30 border border-blue-700' : 'bg-blue-50 border border-blue-200'
                      }`}
                    >
                      <h4 className={`font-semibold mb-2 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`}>
                        Analyse IA
                      </h4>
                      <div className={`text-sm ${theme === 'dark' ? 'text-blue-200' : 'text-blue-600'}`}>
                        {analysisResults[post.id].chat_analysis?.response}
                      </div>
                      {analysisResults[post.id].sentiment?.analysis?.sentiment && (
                        <div className={`mt-2 text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                          Sentiment: {analysisResults[post.id].sentiment.analysis.sentiment.sentiment} 
                          ({Math.round(analysisResults[post.id].sentiment.analysis.sentiment.confidence * 100)}%)
                        </div>
                      )}
                      {analysisResults[post.id].fake_news?.status && (
                        <div className={`mt-2 text-xs ${
                          analysisResults[post.id].fake_news.status === 'fake' 
                            ? 'text-red-500' 
                            : analysisResults[post.id].fake_news.status === 'suspicious'
                            ? 'text-orange-500'
                            : 'text-green-500'
                        }`}>
                          Fiabilité: {analysisResults[post.id].fake_news.status}
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center gap-2 transition-all ${
                          post.liked 
                            ? 'text-red-500' 
                            : theme === 'dark' ? 'text-gray-400 hover:text-red-400' : 'text-gray-600 hover:text-red-500'
                        }`}
                      >
                        <svg className="w-5 h-5" fill={post.liked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span className="text-sm">{post.likes}</span>
                      </button>

                      <button className={`flex items-center gap-2 transition-all ${
                        theme === 'dark' ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600 hover:text-blue-500'
                      }`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span className="text-sm">{post.comments}</span>
                      </button>

                      <button 
                        onClick={() => handleAnalyzePost(post.id)}
                        disabled={analyzing[post.id]}
                        className={`flex items-center gap-2 transition-all ${
                          analyzing[post.id]
                            ? 'opacity-50 cursor-not-allowed'
                            : theme === 'dark' ? 'text-gray-400 hover:text-purple-400' : 'text-gray-600 hover:text-purple-500'
                        }`}
                      >
                        {analyzing[post.id] ? (
                          <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        )}
                        <span className="text-sm">
                          {analyzing[post.id] ? 'Analyse...' : 'Analyser'}
                        </span>
                      </button>

                      <button className={`flex items-center gap-2 transition-all ${
                        theme === 'dark' ? 'text-gray-400 hover:text-green-400' : 'text-gray-600 hover:text-green-500'
                      }`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m9.032 4.026a9.001 9.001 0 01-7.432 0m9.032-4.026A9.001 9.001 0 0112 3c-4.474 0-8.268 3.12-9.032 7.326m0 0A9.001 9.001 0 0012 21c4.474 0 8.268-3.12 9.032-7.326" />
                        </svg>
                        <span className="text-sm">Partager</span>
                      </button>
                    </div>

                    <button 
                      className={`transition-all ${
                        theme === 'dark' ? 'text-gray-400 hover:text-orange-400' : 'text-gray-600 hover:text-orange-500'
                      }`}
                      onClick={() => handleReportPost(post.id)}
                      title="Signaler ce post"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Actualite;