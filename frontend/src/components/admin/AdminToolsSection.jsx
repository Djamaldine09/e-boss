import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/theme-context';

const AdminToolsSection = () => {
  const { theme } = useTheme();
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuler des outils admin éducatifs
    const mockTools = [
      {
        id: 1,
        name: 'Générateur de Quiz',
        description: 'Créez des quiz interactifs pour vos cours avec différents types de questions',
        icon: '📝',
        category: 'Évaluation',
        status: 'active',
        usage: 156,
        lastUsed: new Date(Date.now() - 86400000),
        features: ['QCM', 'Questions ouvertes', 'Temporisateur', 'Correction automatique']
      },
      {
        id: 2,
        name: 'Analyseur de Code',
        description: 'Analysez automatiquement le code des étudiants et donnez des feedbacks pertinents',
        icon: '🔍',
        category: 'Analyse',
        status: 'active',
        usage: 89,
        lastUsed: new Date(Date.now() - 172800000),
        features: ['Détection d\'erreurs', 'Suggestions d\'optimisation', 'Métriques de qualité']
      },
      {
        id: 3,
        name: 'Gestionnaire de Progression',
        description: 'Suivez la progression des étudiants et identifiez ceux qui ont besoin d\'aide',
        icon: '📊',
        category: 'Suivi',
        status: 'active',
        usage: 234,
        lastUsed: new Date(Date.now() - 3600000),
        features: ['Tableaux de bord', 'Alertes automatiques', 'Rapports détaillés']
      },
      {
        id: 4,
        name: 'Bibliothèque de Ressources',
        description: 'Gérez et partagez des ressources pédagogiques avec les étudiants',
        icon: '📚',
        category: 'Ressources',
        status: 'maintenance',
        usage: 67,
        lastUsed: new Date(Date.now() - 259200000),
        features: ['Upload de fichiers', 'Organisation par cours', 'Partage facile']
      },
      {
        id: 5,
        name: 'Système de Notifications',
        description: 'Envoyez des notifications ciblées aux étudiants et aux groupes',
        icon: '📢',
        category: 'Communication',
        status: 'active',
        usage: 412,
        lastUsed: new Date(Date.now() - 1800000),
        features: ['Notifications push', 'Emails', 'Messages in-app', 'Programmation']
      },
      {
        id: 6,
        name: 'Générateur de Certificats',
        description: 'Créez des certificats personnalisés pour les réussites des étudiants',
        icon: '🏆',
        category: 'Certification',
        status: 'beta',
        usage: 23,
        lastUsed: new Date(Date.now() - 604800000),
        features: ['Templates personnalisables', 'QR codes', 'Signature numérique', 'PDF export']
      }
    ];

    setTimeout(() => {
      setTools(mockTools);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'beta': return 'bg-blue-100 text-blue-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Actif';
      case 'maintenance': return 'En maintenance';
      case 'beta': return 'Bêta';
      case 'inactive': return 'Inactif';
      default: return 'Inconnu';
    }
  };

  const formatLastUsed = (date) => {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 60) return `Il y a ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Il y a ${hours}h`;
    const days = Math.floor(hours / 24);
    return `Il y a ${days}j`;
  };

  const handleToolAction = (toolId, action) => {
    console.log(`Action ${action} sur l'outil ${toolId}`);
    // Logique pour gérer les actions sur les outils
  };

  if (loading) {
    return (
      <div className="glass p-6 rounded-2xl">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mr-3"></div>
          <span className="text-gray-600">Chargement des outils...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="glass p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Outils Administratifs
        </h2>
        <div className="flex items-center gap-2">
          <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            {tools.filter(t => t.status === 'active').length} actifs
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((tool, index) => (
          <motion.div
            key={tool.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`p-5 rounded-xl border ${
              theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            } hover:shadow-lg transition-all`}
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="text-3xl">{tool.icon}</div>
              <div className="flex-1">
                <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {tool.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs px-2 py-1 rounded ${getStatusColor(tool.status)}`}>
                    {getStatusText(tool.status)}
                  </span>
                  <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                    {tool.category}
                  </span>
                </div>
              </div>
            </div>

            <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-3`}>
              {tool.description}
            </p>

            <div className="space-y-2 mb-3">
              <div className="text-xs">
                <span className={`font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Fonctionnalités:
                </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {tool.features.slice(0, 3).map((feature, idx) => (
                    <span 
                      key={idx}
                      className={`px-2 py-1 text-xs rounded ${
                        theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {feature}
                    </span>
                  ))}
                  {tool.features.length > 3 && (
                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                      +{tool.features.length - 3} autres
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs mb-3">
              <div>
                <span className={`${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                  Utilisations: 
                </span>
                <span className={`font-medium ml-1 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                  {tool.usage}
                </span>
              </div>
              <div className={`${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                Dernier: {formatLastUsed(tool.lastUsed)}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleToolAction(tool.id, 'configure')}
                disabled={tool.status === 'maintenance'}
                className={`flex-1 px-3 py-2 text-sm rounded-lg font-medium transition-colors ${
                  tool.status === 'maintenance'
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Configurer
              </button>
              <button
                onClick={() => handleToolAction(tool.id, 'stats')}
                className={`px-3 py-2 text-sm rounded-lg font-medium transition-colors ${
                  theme === 'dark' 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                📊
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {tools.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🛠️</div>
          <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Aucun outil disponible
          </h3>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
            Les outils administratifs seront bientôt disponibles
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminToolsSection;
