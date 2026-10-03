import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/theme-context';

const FakeNewsSection = () => {
  const { theme } = useTheme();
  const [fakeNews, setFakeNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Simuler des fake news détectées
    const mockFakeNews = [
      {
        id: 1,
        title: 'Formation gratuite en JavaScript certifiée',
        content: 'Devenez expert en JavaScript en 7 jours avec notre formation gratuite 100% certifiée. Places limitées !',
        source: 'https://faux-site-formation.com',
        detectedAt: new Date(Date.now() - 300000),
        severity: 'high',
        status: 'active',
        reports: 15,
        keywords: ['gratuit', 'certifiée', '7 jours']
      },
      {
        id: 2,
        title: 'Emploi garanti après formation React',
        content: 'Inscrivez-vous à notre formation React et nous vous garantissons un emploi à 5000€/mois',
        source: 'https://react-garanti.com',
        detectedAt: new Date(Date.now() - 900000),
        severity: 'medium',
        status: 'under_review',
        reports: 8,
        keywords: ['garanti', 'emploi', '5000€']
      },
      {
        id: 3,
        title: 'Méthode miracle pour apprendre à coder',
        content: 'Découvrez la méthode secrète des développeurs seniors pour apprendre n\'importe quel langage en 24h',
        source: 'https://methode-miracle.com',
        detectedAt: new Date(Date.now() - 1800000),
        severity: 'high',
        status: 'blocked',
        reports: 23,
        keywords: ['miracle', 'secret', '24h']
      },
      {
        id: 4,
        title: 'Plateforme éducative pirate détectée',
        content: 'Site copiant notre contenu et demandant des paiements pour des cours gratuits',
        source: 'https://copie-plateforme.com',
        detectedAt: new Date(Date.now() - 3600000),
        severity: 'critical',
        status: 'blocked',
        reports: 45,
        keywords: ['pirate', 'paiement', 'gratuits']
      }
    ];

    setTimeout(() => {
      setFakeNews(mockFakeNews);
      setLoading(false);
    }, 1000);
  }, []);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'under_review': return 'bg-yellow-100 text-yellow-800';
      case 'blocked': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Active';
      case 'under_review': return 'En révision';
      case 'blocked': return 'Bloquée';
      default: return 'Inconnue';
    }
  };

  const formatTimestamp = (date) => {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'À l\'instant';
    if (minutes < 60) return `Il y a ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Il y a ${hours}h`;
    const days = Math.floor(hours / 24);
    return `Il y a ${days}j`;
  };

  const filteredNews = filter === 'all' 
    ? fakeNews 
    : fakeNews.filter(news => news.severity === filter);

  const handleBlock = (id) => {
    setFakeNews(fakeNews.map(news => 
      news.id === id ? { ...news, status: 'blocked' } : news
    ));
  };

  const handleReview = (id) => {
    setFakeNews(fakeNews.map(news => 
      news.id === id ? { ...news, status: 'under_review' } : news
    ));
  };

  if (loading) {
    return (
      <div className="glass p-6 rounded-2xl">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mr-3"></div>
          <span className="text-gray-600">Analyse des fake news...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="glass p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Fake News Détectées
        </h2>
        <div className="flex items-center gap-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className={`px-3 py-2 rounded-lg border ${
              theme === 'dark' 
                ? 'bg-gray-800 border-gray-700 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="all">Toutes</option>
            <option value="critical">Critique</option>
            <option value="high">Élevée</option>
            <option value="medium">Moyenne</option>
            <option value="low">Faible</option>
          </select>
          <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            {fakeNews.filter(n => n.status === 'active').length} active
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredNews.map((news, index) => (
          <motion.div
            key={news.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className={`font-semibold text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {news.title}
                </h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mt-1`}>
                  {news.content}
                </p>
              </div>
              <div className={`px-2 py-1 rounded text-xs font-medium border ${getSeverityColor(news.severity)}`}>
                {news.severity.toUpperCase()}
              </div>
            </div>

            <div className="flex items-center gap-4 mb-3">
              <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                Source: <a href={news.source} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  {news.source}
                </a>
              </span>
              <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                {formatTimestamp(news.detectedAt)}
              </span>
              <div className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(news.status)}`}>
                {getStatusText(news.status)}
              </div>
              <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                {news.reports} signalement{news.reports > 1 ? 's' : ''}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {news.keywords.map((keyword, idx) => (
                  <span 
                    key={idx}
                    className={`px-2 py-1 text-xs rounded ${
                      theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {keyword}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2">
                {news.status !== 'blocked' && (
                  <button
                    onClick={() => handleBlock(news.id)}
                    className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
                  >
                    Bloquer
                  </button>
                )}
                {news.status === 'active' && (
                  <button
                    onClick={() => handleReview(news.id)}
                    className="px-3 py-1 bg-yellow-500 text-white text-xs rounded hover:bg-yellow-600 transition-colors"
                  >
                    Réviser
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredNews.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📰</div>
          <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Aucune fake news détectée
          </h3>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
            Aucune fausse information n'a été détectée pour le moment
          </p>
        </div>
      )}
    </div>
  );
};

export default FakeNewsSection;
