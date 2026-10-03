import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/theme-context';

const DashboardNavbar = ({ onSidebarToggle, sidebarOpen }) => {
  const { theme, toggleTheme } = useTheme();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const notifications = [
    { id: 1, title: 'Nouveau cours disponible', description: 'React Hooks Avancés', time: 'Il y a 5 min', read: false },
    { id: 2, title: 'Rappel de Sprint', description: 'Sprint #3 commence demain', time: 'Il y a 1h', read: false },
    { id: 3, title: 'Succès débloqué', description: 'Vous avez débloqué "Expert React"', time: 'Il y a 3h', read: true },
    { id: 4, title: 'Message de votre mentor', description: 'Révision de votre dernier projet', time: 'Il y a 5h', read: true }
  ];

  const messages = [
    { id: 1, sender: 'Marie Dubois', subject: 'Question sur le Sprint 2', preview: 'Bonjour, j\'ai une question...', time: '10:30', unread: true },
    { id: 2, sender: 'System', subject: 'Rappel de cours', preview: 'N\'oubliez pas votre cours...', time: '09:15', unread: true },
    { id: 3, sender: 'Thomas Martin', subject: 'Projet collaboratif', preview: 'Veux-tu rejoindre notre...', time: 'Hier', unread: false }
  ];

  const userMenu = [
    { name: 'Mon Profil', href: '/dashboard/profile', icon: '👤' },
    { name: 'Paramètres du compte', href: '/dashboard/settings', icon: '⚙️' },
    { name: 'Sécurité', href: '/dashboard/security', icon: '🔒' },
    { name: 'Aide', href: '/dashboard/help', icon: '❓' },
    { name: 'Déconnexion', href: '/logout', icon: '🚪', isLogout: true }
  ];

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-4 transition-all ${
          theme === 'dark' 
            ? 'glass backdrop-blur-lg border-b border-white/10' 
            : 'glass backdrop-blur-lg border-b border-gray-200/50'
        }`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {/* Section gauche - Menu burger et Logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={onSidebarToggle}
            className={`relative w-8 h-8 flex items-center justify-center rounded-xl transition-all hover:scale-105 ${
              theme === 'dark' 
                ? 'text-gray-300 hover:text-white hover:bg-white/10' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <div className="relative w-6 h-5 flex flex-col justify-center items-center">
              {/* Ligne du haut */}
              <span 
                className={`absolute block h-0.5 w-6 bg-current transition-all duration-300 ease-in-out ${
                  sidebarOpen ? 'rotate-45' : '-translate-y-1.5'
                }`}
                style={{
                  transform: sidebarOpen ? 'rotate(45deg)' : 'translateY(-6px)'
                }}
              />
              
              {/* Ligne du milieu */}
              <span 
                className={`block h-0.5 w-6 bg-current transition-all duration-300 ease-in-out ${
                  sidebarOpen ? 'opacity-0' : 'opacity-100'
                }`}
              />
              
              {/* Ligne du bas */}
              <span 
                className={`absolute block h-0.5 w-6 bg-current transition-all duration-300 ease-in-out ${
                  sidebarOpen ? '-rotate-45' : 'translate-y-1.5'
                }`}
                style={{
                  transform: sidebarOpen ? 'rotate(-45deg)' : 'translateY(6px)'
                }}
              />
            </div>
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
              ED
            </div>
            <div>
              <div className={`font-semibold text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Espace Learning
              </div>
              <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Dashboard
              </div>
            </div>
          </div>
        </div>

        {/* Section droite - Actions rapides */}
        <div className="flex items-center gap-3">
          {/* Bouton Actualité */}
          <Link
            to="/dashboard/actualite"
            className={`p-2 rounded-xl transition-all hover:scale-105 ${
              theme === 'dark' 
                ? 'text-gray-300 hover:text-white hover:bg-gray-800' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
            title="Actualité"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </Link>

          {/* Bouton Messages */}
          <div className="relative">
            <button
              onClick={() => setIsMessagesOpen(!isMessagesOpen)}
              className={`relative p-2 rounded-xl transition-all hover:scale-105 ${
                theme === 'dark' 
                  ? 'text-gray-300 hover:text-white hover:bg-gray-800' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              {messages.filter(m => m.unread).length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {messages.filter(m => m.unread).length}
                </span>
              )}
            </button>

            {/* Dropdown Messages */}
            <AnimatePresence>
              {isMessagesOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className={`absolute right-0 mt-2 w-80 rounded-2xl shadow-2xl border max-h-96 overflow-hidden ${
                theme === 'dark' 
                  ? 'bg-gray-800/98 border-gray-700' 
                  : 'bg-white/95 border-gray-300'
              }`}
                >
                  <div className="p-4 border-b border-white/10">
                    <div className="flex items-center justify-between">
                      <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        Messages
                      </h3>
                      <Link to="/dashboard/messages" className="text-blue-500 text-sm hover:underline">
                        Voir tout
                      </Link>
                    </div>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer ${
                          message.unread ? 'bg-blue-500/10' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between mb-1">
                          <div className={`font-medium text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {message.sender}
                          </div>
                          <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            {message.time}
                          </div>
                        </div>
                        <div className={`text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                          {message.subject}
                        </div>
                        <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} truncate`}>
                          {message.preview}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bouton Notifications */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className={`relative p-2 rounded-xl transition-all hover:scale-105 ${
                theme === 'dark' 
                  ? 'text-gray-300 hover:text-white hover:bg-gray-800' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538.214 1.055.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </button>

            {/* Dropdown Notifications */}
            <AnimatePresence>
              {isNotificationsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className={`absolute right-0 mt-2 w-80 rounded-2xl shadow-2xl border max-h-96 overflow-hidden ${
                theme === 'dark' 
                  ? 'bg-gray-800/98 border-gray-700' 
                  : 'bg-white/95 border-gray-300'
              }`}
                >
                  <div className="p-4 border-b border-white/10">
                    <div className="flex items-center justify-between">
                      <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        Notifications
                      </h3>
                      <button className="text-blue-500 text-sm hover:underline">
                        Marquer tout lu
                      </button>
                    </div>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer ${
                          !notification.read ? 'bg-blue-500/10' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between mb-1">
                          <div className={`font-medium text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {notification.title}
                          </div>
                          <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            {notification.time}
                          </div>
                        </div>
                        <div className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                          {notification.description}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bouton Thème */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-xl transition-all hover:scale-105 ${
              theme === 'dark' 
                ? 'text-gray-300 hover:text-white hover:bg-white/10' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            {theme === "dark" ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          {/* Bouton Profil */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className={`flex items-center gap-2 p-2 rounded-xl transition-all hover:scale-105 ${
                theme === 'dark' 
                  ? 'text-gray-300 hover:text-white hover:bg-gray-800' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                JD
              </div>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Profil */}
            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className={`absolute right-0 mt-2 w-72 rounded-2xl shadow-2xl border ${
                theme === 'dark' 
                  ? 'bg-gray-800/98 border-gray-700' 
                  : 'bg-white/95 border-gray-300'
              }`}
                >
                  {/* En-tête du profil */}
                  <div className="p-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        JD
                      </div>
                      <div>
                        <div className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          Jean Dupont
                        </div>
                        <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          jean.dupont@email.com
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions rapides */}
                  <div className="p-2">
                    <Link
                      to="/dashboard/profile"
                      className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors rounded-xl ${
                        theme === 'dark' 
                          ? 'text-gray-300 hover:text-white hover:bg-white/10' 
                          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <span className="text-lg">👤</span>
                      <div className="flex-1">
                        <div className="font-medium">Mon Profil</div>
                        <div className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                          Photo, infos personnelles
                        </div>
                      </div>
                    </Link>
                    
                    <Link
                      to="/dashboard/settings"
                      className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors rounded-xl ${
                        theme === 'dark' 
                          ? 'text-gray-300 hover:text-white hover:bg-white/10' 
                          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <span className="text-lg">⚙️</span>
                      <div className="flex-1">
                        <div className="font-medium">Paramètres du compte</div>
                        <div className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                          Préférences, confidentialité
                        </div>
                      </div>
                    </Link>
                    
                    <Link
                      to="/dashboard/security"
                      className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors rounded-xl ${
                        theme === 'dark' 
                          ? 'text-gray-300 hover:text-white hover:bg-white/10' 
                          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <span className="text-lg">🔒</span>
                      <div className="flex-1">
                        <div className="font-medium">Sécurité</div>
                        <div className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                          MDP, 2FA, sessions
                        </div>
                      </div>
                    </Link>
                    
                    <div className="border-t border-white/10 my-2"></div>
                    
                    <Link
                      to="/dashboard/help"
                      className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors rounded-xl ${
                        theme === 'dark' 
                          ? 'text-gray-300 hover:text-white hover:bg-white/10' 
                          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <span className="text-lg">❓</span>
                      <div className="flex-1">
                        <div className="font-medium">Aide & Support</div>
                        <div className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                          FAQ, contact
                        </div>
                      </div>
                    </Link>
                    
                    <div className="border-t border-white/10 my-2"></div>
                    
                    <button
                      onClick={() => {
                        // Logique de déconnexion
                        if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
                          // Rediriger vers la page de login
                          window.location.href = '/login';
                        }
                        setIsProfileOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors rounded-xl ${
                        theme === 'dark' 
                          ? 'text-red-400 hover:text-red-300 hover:bg-red-500/10' 
                          : 'text-red-600 hover:text-red-700 hover:bg-red-100'
                      }`}
                    >
                      <span className="text-lg">🚪</span>
                      <div className="flex-1 text-left">
                        <div className="font-medium">Déconnexion</div>
                        <div className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                          Quitter votre session
                        </div>
                      </div>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.nav>
    </>
  );
};

export default DashboardNavbar;
