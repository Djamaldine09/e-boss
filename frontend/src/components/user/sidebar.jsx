import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/theme-context';

const Sidebar = ({ isOpen, onClose }) => {
  const { theme } = useTheme();
  const location = useLocation();
  const activeSection = location.pathname.split('/').pop() || 'overview';

  const menuItems = [
    {
      id: 'overview',
      name: 'Aperçu',
      icon: '📊',
      description: 'Vue d\'ensemble'
    },
    {
      id: 'courses',
      name: 'Cours',
      icon: '📚',
      description: 'Mes cours en cours'
    },
    {
      id: 'sprints',
      name: 'Sprints',
      icon: '⚡',
      description: 'Sprints d\'apprentissage'
    },
    {
      id: 'calendar',
      name: 'Calendrier',
      icon: '📅',
      description: 'Planning et rappels'
    },
    {
      id: 'progress',
      name: 'Progression',
      icon: '📈',
      description: 'Statistiques détaillées'
    },
    {
      id: 'achievements',
      name: 'Succès',
      icon: '🏆',
      description: 'Badges et récompenses'
    },
    {
      id: 'ressources',
      name: 'Ressources',
      icon: '💎',
      description: 'Documents et outils'
    }
  ];


  return (
    <>
      {/* Overlay pour mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <motion.div
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-72 z-30 transform transition-all duration-300 shadow-2xl ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {/* Fond du sidebar avec délimitation renforcée */}
        <div className={`h-full glass border-r-4 ${
          theme === 'dark' 
            ? 'border-blue-500/30 bg-gray-900/95' 
            : 'border-blue-500/20 bg-white/95'
        }`}>
        <div className="flex flex-col h-full">
          {/* Header du Sidebar */}
          <div className="p-6 border-b border-white/10">
            <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Menu
            </h2>
          </div>

          {/* Navigation principale */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.id === 'overview' ? '/dashboard' : `/dashboard/${item.id}`}
                  className={`flex items-center w-full p-3 rounded-lg transition-all ${
                    activeSection === item.id 
                      ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' 
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="text-2xl">{item.icon}</div>
                  <div className="flex-1 text-left">
                    <div className="font-medium">{item.name}</div>
                    <div className={`text-xs ${activeSection === item.id ? 'text-white/80' : theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                      {item.description}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </nav>

          {/* Footer du Sidebar */}
          <div className="p-4 border-t border-white/10">
            <div className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
              <div className="mb-2">Espace d'apprentissage</div>
              <div>Version 2.0</div>
            </div>
          </div>
        </div>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;
