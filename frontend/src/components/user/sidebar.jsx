import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import {
  BarChart3,
  BookOpen,
  Zap,
  CalendarDays,
  TrendingUp,
  Trophy,
  Gem,
  ChevronRight,
} from 'lucide-react';
import { useTheme } from '../../context/theme-context';

const Sidebar = ({ isOpen, onClose }) => {
  const { theme } = useTheme();
  const location = useLocation();
  const activeSection = location.pathname.split('/').pop() || 'overview';

  const menuItems = [
    {
      id: 'overview',
      name: 'Aperçu',
      icon: BarChart3,
      description: "Vue d’ensemble",
    },
    {
      id: 'courses',
      name: 'Cours',
      icon: BookOpen,
      description: 'Mes cours en cours',
    },
    {
      id: 'sprints',
      name: 'Sprints',
      icon: Zap,
      description: "Sprints d’apprentissage",
    },
    {
      id: 'calendar',
      name: 'Calendrier',
      icon: CalendarDays,
      description: 'Planning et rappels',
    },
    {
      id: 'progress',
      name: 'Progression',
      icon: TrendingUp,
      description: 'Statistiques détaillées',
    },
    {
      id: 'achievements',
      name: 'Succès',
      icon: Trophy,
      description: 'Badges et récompenses',
    },
    {
      id: 'ressources',
      name: 'Ressources',
      icon: Gem,
      description: 'Documents et outils',
    },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <motion.div
        className="fixed top-16 left-0 h-[calc(100vh-4rem)] w-72 z-30"
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div
          className={`h-full border-r ${ 
            theme === 'dark'
              ? 'border-white/10 bg-gray-950/95'
              : 'border-gray-200/80 bg-white/95'
          }`}
        >
          <div className="flex flex-col h-full">
            <div
              className={`px-6 pt-7 pb-6 border-b ${
                theme === 'dark' ? 'border-white/10' : 'border-gray-200'
              }`}
            >
              <div className="mb-1">
                <p
                  className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${
                    theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                  }`}
                >
                  E-BOSS
                </p>
              </div>
              <h2
                className={`text-xl font-bold tracking-tight ${
                  theme === 'dark' ? 'text-white' : 'text-gray-950'
                }`}
              >
                Espace d’apprentissage
              </h2>
              <p
                className={`mt-1.5 text-sm leading-5 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}
              >
                Organisez votre progression et vos objectifs.
              </p>
            </div>

            <nav
              className="flex-1 p-4 overflow-y-auto"
              aria-label="Navigation du tableau de bord"
            >
              <div
                className={`px-3 pb-3 text-[11px] font-semibold uppercase tracking-[0.16em] ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                }`}
              >
                Navigation
              </div>

              <div className="space-y-1.5">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;

                  return (
                    <Link
                      key={item.id}
                      to={item.id === 'overview' ? '/dashboard' : `/dashboard/${item.id}`}
                      onClick={onClose}
                      className={`group relative flex items-center gap-3 w-full px-3.5 py-3 rounded-xl transition-all duration-200 ${
                        isActive
                          ? theme === 'dark'
                            ? 'bg-blue-500/12 text-blue-300'
                            : 'bg-blue-50 text-blue-700'
                          : theme === 'dark'
                            ? 'text-gray-300 hover:bg-white/5 hover:text-white'
                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-950'
                      }`}
                    >
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors ${
                          isActive
                            ? theme === 'dark'
                              ? 'bg-blue-500/15 text-blue-300'
                              : 'bg-blue-100 text-blue-700'
                            : theme === 'dark'
                              ? 'bg-white/5 text-gray-400 group-hover:bg-white/10 group-hover:text-white'
                              : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200 group-hover:text-gray-800'
                        }`}
                      >
                        <Icon size={19} strokeWidth={1.9} />
                      </span>

                      <span className="min-w-0 flex-1 text-left">
                        <span className="block text-sm font-semibold">{item.name}</span>
                        <span
                          className={`mt-0.5 block truncate text-xs ${
                            isActive
                              ? theme === 'dark'
                                ? 'text-blue-200/70'
                                : 'text-blue-600/80'
                              : theme === 'dark'
                                ? 'text-gray-500'
                                : 'text-gray-400'
                          }`}
                        >
                          {item.description}
                        </span>
                      </span>

                      <ChevronRight
                        size={16}
                        strokeWidth={1.8}
                        className={`shrink-0 transition-all duration-200 ${
                          isActive
                            ? theme === 'dark'
                              ? 'translate-x-0 text-blue-300'
                              : 'translate-x-0 text-blue-600'
                            : '-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'
                        }`}
                      />
                    </Link>
                  );
                })}
              </div>
            </nav>

            <div
              className={`mx-4 mb-4 rounded-xl border p-4 ${
                theme === 'dark'
                  ? 'border-white/10 bg-white/[0.03]'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div
                className={`text-xs font-medium ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                Espace d’apprentissage
              </div>
              <div
                className={`mt-1 text-xs ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                }`}
              >
                Version 2.0
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;
