import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/theme-context';
import DashboardNavbar from '../user/dashboard-navbar';
import Sidebar from '../user/sidebar';
import Footer from '../footer';
import SnowLayer from '../snow-layer';
import adminAPI from '../../services/adminAPI';

const AdminDashboard = () => {
  const { theme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [analysisStats, setAnalysisStats] = useState(null);
  const [analyses, setAnalyses] = useState([]);
  const [reports, setReports] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [selectedAnalyses, setSelectedAnalyses] = useState([]);

  useEffect(() => {
    const loadAdminData = async () => {
      try {
        setLoading(true);

        const statsResponse = await adminAPI.getAnalysisStats();
        setAnalysisStats(statsResponse.data);

        const reportsResponse = await adminAPI.getReportedPosts();
        setReports(reportsResponse.reports || []);

        // Récupérer les analyses détaillées
        try {
          console.log('Appel de getDetailedAnalyses...');
          const analysesResponse = await adminAPI.getDetailedAnalyses();
          console.log('Réponse de getDetailedAnalyses:', analysesResponse);
          setAnalyses(analysesResponse.analyses || []);
          console.log('Analyses définies dans le state:', analysesResponse.analyses || []);
        } catch (error) {
          console.warn('Erreur lors de la récupération des analyses détaillées:', error);
          setAnalyses([]);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error loading admin data:', error);
        setLoading(false);
      }
    };

    loadAdminData();

    const interval = setInterval(loadAdminData, 30000);
    return () => clearInterval(interval);
  }, []);

  const addNotification = (notification) => {
    setNotifications(prev => [notification, ...prev]);
  };

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const clearAllAnalyses = async () => {
    try {
      await adminAPI.clearAllAnalyses();
      setAnalyses([]);
      setAnalysisStats({ total_analyses: 0, recent_analyses: 0, average_time: "0s" });
      addNotification({
        id: Date.now(),
        message: "Toutes les analyses ont été supprimées",
        type: "success",
        read: false
      });
    } catch (error) {
      console.error('Erreur lors de la suppression des analyses:', error);
      addNotification({
        id: Date.now(),
        message: "Erreur lors de la suppression des analyses",
        type: "error",
        read: false
      });
    }
  };

  const deleteAnalysisById = async (analysisId) => {
    try {
      await adminAPI.deleteAnalysis(analysisId);
      setAnalyses(prev => prev.filter(a => a.post_id !== analysisId));
      addNotification({
        id: Date.now(),
        message: `Analyse #${analysisId} supprimée`,
        type: "success",
        read: false
      });
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'analyse:', error);
      addNotification({
        id: Date.now(),
        message: `Erreur lors de la suppression de l'analyse #${analysisId}`,
        type: "error",
        read: false
      });
    }
  };

  const toggleAnalysisSelection = (analysisId) => {
    setSelectedAnalyses(prev => 
      prev.includes(analysisId) 
        ? prev.filter(id => id !== analysisId)
        : [...prev, analysisId]
    );
  };

  const deleteSelectedAnalyses = async () => {
    if (selectedAnalyses.length === 0) return;
    
    try {
      // Utiliser la fonction de suppression en lot
      await adminAPI.deleteBatchAnalyses(selectedAnalyses);
      
      // Mettre à jour l'état
      setAnalyses(prev => prev.filter(a => !selectedAnalyses.includes(a.post_id)));
      setSelectedAnalyses([]);
      
      addNotification({
        id: Date.now(),
        message: `${selectedAnalyses.length} analyses supprimées`,
        type: "success",
        read: false
      });
    } catch (error) {
      console.error('Erreur lors de la suppression des analyses sélectionnées:', error);
      addNotification({
        id: Date.now(),
        message: "Erreur lors de la suppression des analyses sélectionnées",
        type: "error",
        read: false
      });
    }
  };

  return (
    <>
      <DashboardNavbar onSidebarToggle={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className={`pt-16 transition-all duration-300 ${sidebarOpen ? 'md:ml-72' : 'md:ml-0'}`}>
        <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
          <div className="max-w-7xl mx-auto py-6 px-4">
            <SnowLayer />

            {/* Header avec statistiques rapides */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className={`p-3 sm:p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">Analyses totales</p>
                    <p className="text-xl sm:text-2xl font-bold text-blue-500">{analysisStats?.total_analyses || 0}</p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className={`p-3 sm:p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">Signalements</p>
                    <p className="text-xl sm:text-2xl font-bold text-red-500">{reports?.length || 0}</p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className={`p-3 sm:p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">Notifications</p>
                    <p className="text-xl sm:text-2xl font-bold text-purple-500">{notifications?.length || 0}</p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className={`mb-6 p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Notifications récentes</h2>
                {notifications.length > 0 && (
                  <button
                    onClick={clearAllNotifications}
                    className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Tout effacer
                  </button>
                )}
              </div>
              {notifications.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Aucune notification
                </div>
              ) : (
                <div className="space-y-2">
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-3 rounded-lg border ${
                        notification.read
                          ? theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                          : theme === 'dark' ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-300'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <p className="text-sm">{notification.message}</p>
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="px-2 py-1 text-xs rounded bg-blue-500 text-white hover:bg-blue-600"
                          >
                            Marquer comme lu
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Dashboard content */}
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                <span className="ml-3">Chargement des données...</span>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Analyses reçues */}
                <div className={`p-4 sm:p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                  <h2 className="text-lg sm:text-xl font-bold mb-4">Analyses reçues</h2>
                  {analysisStats ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                      <div className={`p-3 sm:p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-blue-50'}`}>
                        <div className="text-xl sm:text-2xl font-bold text-blue-500">{analysisStats.total_analyses || 0}</div>
                        <div className="text-xs sm:text-sm text-gray-500">Analyses totales</div>
                      </div>
                      <div className={`p-3 sm:p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-green-50'}`}>
                        <div className="text-xl sm:text-2xl font-bold text-green-500">{analysisStats.recent_analyses || 0}</div>
                        <div className="text-xs sm:text-sm text-gray-500">Analyses récentes (24h)</div>
                      </div>
                      <div className={`p-3 sm:p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-purple-50'}`}>
                        <div className="text-xl sm:text-2xl font-bold text-purple-500">{analysisStats.average_time || 'N/A'}</div>
                        <div className="text-xs sm:text-sm text-gray-500">Temps moyen</div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6 sm:py-8 text-gray-500">
                      Aucune statistique disponible
                    </div>
                  )}
                </div>

                {/* Analyses détaillées */}
                <div className={`p-4 sm:p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                    <h2 className="text-lg sm:text-xl font-bold">Analyses détaillées</h2>
                    <div className="flex flex-wrap gap-2">
                      {selectedAnalyses.length > 0 && (
                        <button
                          onClick={deleteSelectedAnalyses}
                          className="px-3 py-1 text-sm bg-orange-500 text-white rounded hover:bg-orange-600"
                        >
                          Supprimer ({selectedAnalyses.length})
                        </button>
                      )}
                      {analyses.length > 0 && (
                        <button
                          onClick={clearAllAnalyses}
                          className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Tout supprimer
                        </button>
                      )}
                    </div>
                  </div>
                  {analyses && analyses.length > 0 ? (
                    <div className="space-y-4">
                      {analyses.map((analysis, index) => (
                        <div key={index} className={`p-4 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={selectedAnalyses.includes(analysis.post_id)}
                                onChange={() => toggleAnalysisSelection(analysis.post_id)}
                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                              />
                              <span className="font-semibold">Post #{analysis.post_id}</span>
                              <span className="text-sm text-gray-500 ml-2">par {analysis.post_author}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">
                                {new Date(analysis.timestamp).toLocaleString()}
                              </span>
                              <button
                                onClick={() => deleteAnalysisById(analysis.post_id)}
                                className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                              >
                                Supprimer
                              </button>
                            </div>
                          </div>
                          <div className="mb-2">
                            <span className="inline-block px-2 py-1 text-xs rounded bg-blue-100 text-blue-800">
                              Analyse complète
                            </span>
                          </div>
                          <div className={`text-sm mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            <strong>Contenu du post:</strong> {analysis.post_content}
                          </div>
                          {analysis.analysis && (
                            <div className="space-y-2">
                              {/* Cas spécial : image interdite */}
                              {analysis.special_case === 'forbidden_image' && (
                                <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-red-900 border border-red-700' : 'bg-red-100 border border-red-300'}`}>
                                  <div className="flex items-center gap-2 mb-2">
                                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                    <strong className="text-red-700 dark:text-red-300">IMAGE INAPPROPRIÉE</strong>
                                  </div>
                                  <p className="text-sm text-red-800 dark:text-red-200">
                                    Tentative de publication avec image interdite détectée
                                  </p>
                                </div>
                              )}
                              
                              {/* Analyse de contenu inapproprié */}
                              {analysis.analysis.content_analysis && analysis.analysis.content_analysis.inappropriate && (
                                <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-orange-900 border border-orange-700' : 'bg-orange-100 border border-orange-300'}`}>
                                  <div className="flex items-center gap-2 mb-2">
                                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                                    <strong className="text-orange-700 dark:text-orange-300">CONTENU INAPPROPRIÉ</strong>
                                  </div>
                                  <p className="text-sm text-orange-800 dark:text-orange-200">
                                    {analysis.analysis.content_analysis.reason}
                                  </p>
                                </div>
                              )}
                              
                              {/* Analyse IA simplifiée */}
                              {analysis.analysis.chat_analysis && (
                                <div className={`p-2 rounded ${theme === 'dark' ? 'bg-gray-600' : 'bg-blue-50'}`}>
                                  <strong className="text-sm">Analyse IA:</strong>
                                  <p className="text-sm mt-1">{analysis.analysis.chat_analysis.response}</p>
                                  {analysis.analysis.chat_analysis.category && (
                                    <span className={`inline-block px-2 py-1 text-xs rounded mt-1 ${
                                      analysis.analysis.chat_analysis.category === 'forbidden_content' 
                                        ? 'bg-red-200 text-red-800' 
                                        : 'bg-blue-200 text-blue-800'
                                    }`}>
                                      {analysis.analysis.chat_analysis.category}
                                    </span>
                                  )}
                                </div>
                              )}
                              
                              {/* Sentiment simplifié */}
                              {analysis.analysis.chat_analysis && analysis.analysis.chat_analysis.sentiment && (
                                <div className={`p-2 rounded ${theme === 'dark' ? 'bg-gray-600' : 'bg-green-50'}`}>
                                  <strong className="text-sm">Sentiment:</strong>
                                  <span className={`ml-2 px-2 py-1 text-xs rounded ${
                                    analysis.analysis.chat_analysis.sentiment === 'positive' ? 'bg-green-200 text-green-800' :
                                    analysis.analysis.chat_analysis.sentiment === 'negative' ? 'bg-red-200 text-red-800' :
                                    'bg-gray-200 text-gray-800'
                                  }`}>
                                    {analysis.analysis.chat_analysis.sentiment}
                                  </span>
                                </div>
                              )}
                              
                              {/* Fake News simplifié */}
                              {analysis.analysis.fake_news && (
                                <div className={`p-2 rounded ${theme === 'dark' ? 'bg-gray-600' : 'bg-purple-50'}`}>
                                  <strong className="text-sm">Fiabilité:</strong>
                                  <span className={`ml-2 px-2 py-1 text-xs rounded ${
                                    analysis.analysis.fake_news.status === 'reliable' ? 'bg-green-200 text-green-800' :
                                    analysis.analysis.fake_news.status === 'suspicious' ? 'bg-orange-200 text-orange-800' :
                                    'bg-red-200 text-red-800'
                                  }`}>
                                    {analysis.analysis.fake_news.status}
                                  </span>
                                  <span className="ml-2 text-xs text-gray-600">
                                    (Score: {analysis.analysis.fake_news.risk_score})
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      Aucune analyse détaillée disponible
                    </div>
                  )}
                </div>

                {/* Rapports */}
                <div className={`p-4 sm:p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                  <h2 className="text-lg sm:text-xl font-bold mb-4">Posts signalés</h2>
                  {reports && reports.length > 0 ? (
                    <div className="space-y-3 sm:space-y-4">
                      {reports.map((report, index) => (
                        <div key={index} className={`p-3 sm:p-4 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-2">
                            <div>
                              <span className="font-semibold text-sm sm:text-base">Post #{report.post_id}</span>
                              <span className="text-xs sm:text-sm text-gray-500 ml-2">par {report.post_author}</span>
                            </div>
                            <span className="text-xs text-gray-500">
                              {new Date(report.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <div className="mb-2">
                            <span className="inline-block px-2 py-1 text-xs rounded bg-red-100 text-red-800">
                              {report.reason}
                            </span>
                          </div>
                          <div className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            {report.post_content}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 sm:py-8 text-gray-500">
                      Aucun post signalé
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AdminDashboard;