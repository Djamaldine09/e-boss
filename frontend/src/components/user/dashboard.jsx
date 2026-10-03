import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/theme-context';
import SnowLayer from '../snow-layer';
import DashboardNavbar from './dashboard-navbar';
import Sidebar from './sidebar';
import { ProgressCard, SprintProgress } from './progress-cards';
import { QuickStats, RecentActivity, UpcomingDeadlines, LearningResources, StudyTimer } from './useful-widgets';
import Footer from '../footer';
import FloatingChatbot from '../chatbot/FloatingChatbot';
import Profile from './profile';
import CoursesSection from './dashboard-sections/cours/courses';
import SprintsSection from './dashboard-sections/sprint/sprint';
import CalendarSection from './dashboard-sections/calendar/calendar';
import ProgressSection from "./dashboard-sections/progress/progress";
import AchievementsSection from "./dashboard-sections/Achievement/achievements";
import RessourcesSection from "./dashboard-sections/ressources/ressources";
import ActualiteSection from "./actuality";
import MessagesSection from "./Messages";

const Dashboard = () => {
  const { theme } = useTheme();
  const { section = 'overview' } = useParams();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentSection, setCurrentSection] = useState('overview');

  // Update current section when URL changes
  useEffect(() => {
    setCurrentSection(section || 'overview');
    console.log('Dashboard section changed to:', section);
  }, [section, location.pathname]);

  const courses = [
    { id: 1, title: 'React Hooks Avancés', progress: 75, total: 20, color: 'bg-blue-500', icon: '⚛️', trend: 12 },
    { id: 2, title: 'Node.js Backend', progress: 60, total: 25, color: 'bg-green-500', icon: '🟢', trend: -5 },
    { id: 3, title: 'TypeScript Expert', progress: 45, total: 30, color: 'bg-purple-500', icon: '📘', trend: 8 }
  ];

  const sprints = [
    {
      id: 1,
      number: 3,
      title: 'Sprint React Hooks',
      completed: 8,
      total: 12,
      duration: 7,
      points: 100,
      isActive: true,
      tasks: [
        { name: 'Compléter le cours sur useEffect', completed: true },
        { name: 'Pratiquer avec 5 exercices', completed: true },
        { name: 'Créer un projet personnalisé', completed: false },
        { name: 'Revoir les concepts avancés', completed: false },
        { name: 'Préparer la présentation', completed: false }
      ]
    },
    {
      id: 2,
      number: 2,
      title: 'Sprint Node.js',
      completed: 10,
      total: 10,
      duration: 5,
      points: 80,
      isActive: false,
      tasks: [
        { name: 'Installer Node.js', completed: true },
        { name: 'Créer un serveur simple', completed: true },
        { name: 'Apprendre Express.js', completed: true }
      ]
    }
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const renderContent = () => {
    // Si ce n'est pas la vue d'aperçu, afficher la section correspondante
    if (currentSection !== 'overview') {
      switch (currentSection) {
        case 'profile':
          return <Profile standalone={true} />;
        case 'courses':
          return <CoursesSection />;
        case 'sprints':
          return <SprintsSection />;
        case 'calendar':
          return <CalendarSection />;
        case 'progress':
          return <ProgressSection />;
        case 'achievements':
          return <AchievementsSection />;
        case 'ressources':
          return <RessourcesSection />;
        case 'actuality':
          return <ActualiteSection />;
        case 'messages':
          return <MessagesSection standalone={false} />;
        default:
          return (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="text-gray-500 mb-4">
                <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Section non trouvée</h3>
                <p className="text-sm text-gray-500 mb-4">
                  La section "{currentSection}" n'existe pas
                </p>
                <Link 
                  to="/dashboard/overview"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Retour à l'aperçu
                </Link>
              </div>
            </div>
          );
      }
    }

    // Vue d'aperçu (par défaut)
    return (
      <div className="h-[calc(100vh-8rem)] flex flex-col">
        {/* En-tête avec statistiques et timer */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
          <QuickStats />
          <div className="glass p-4 w-full sm:w-auto">
            <StudyTimer />
          </div>
        </div>

        {/* Grille principale */}
        <div className="grid grid-cols-1 xl:grid-cols-3 lg:grid-cols-2 gap-4 lg:gap-6 flex-1 overflow-hidden">
          {/* Colonne de gauche - Mes Cours */}
          <div className="xl:col-span-2 lg:col-span-1 flex flex-col h-full">
            <div className="glass p-4 sm:p-6 flex-1 flex flex-col overflow-hidden">
              <h2 className={`text-lg sm:text-xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Mes Cours
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3 sm:gap-4 overflow-y-auto flex-1 pr-2">
                {courses.map((course) => (
                  <ProgressCard 
                    key={course.id} 
                    title={course.title}
                    progress={course.progress}
                    total={course.total}
                    unit="leçons"
                    color={course.color}
                    icon={course.icon}
                    trend={course.trend}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Colonne de droite - Activité récente */}
          <div className="flex flex-col space-y-4 lg:space-y-6 h-full">
            <div className="glass p-4 sm:p-6 flex-1">
              <h2 className={`text-lg sm:text-xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Activité récente
              </h2>
              <div className="h-[calc(100%-2.5rem)] overflow-y-auto pr-2">
                <RecentActivity />
              </div>
            </div>

            {/* Section Sprints */}
            <div className="glass p-4 sm:p-6">
              <h2 className={`text-lg sm:text-xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Sprints Actifs
              </h2>
              <div className="space-y-3 sm:space-y-4">
                {sprints.map((sprint) => (
                  <SprintProgress 
                    key={sprint.id} 
                    sprint={sprint}
                    isActive={sprint.isActive}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen glass">
      <DashboardNavbar onSidebarToggle={toggleSidebar} sidebarOpen={sidebarOpen} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
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
      
      <main className={`pt-24 pb-32 px-6 transition-all duration-300 ${
        sidebarOpen ? 'lg:ml-72' : 'lg:ml-0'
      }`}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {renderContent()}
          </motion.div>
        </div>
      </main>
      
      <FloatingChatbot />
    </div>
  );
};

export default Dashboard;
