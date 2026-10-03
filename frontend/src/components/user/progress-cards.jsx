import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/theme-context';

const ProgressCard = ({ title, progress, total, unit, color, icon, trend }) => {
  const { theme } = useTheme();
  
  return (
    <motion.div
      className="glass p-6 rounded-2xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-3xl">{icon}</div>
          <div>
            <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {title}
            </h3>
            <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              {total} {unit}
            </div>
          </div>
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-medium ${
            trend > 0 ? 'text-green-500' : 'text-red-500'
          }`}>
            <span>{trend > 0 ? '↑' : '↓'}</span>
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Progression
          </span>
          <span className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {progress}%
          </span>
        </div>
        
        <div className="relative">
          <div className={`w-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-3`}>
            <motion.div
              className={`h-3 rounded-full ${color}`}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          
          {/* Indicateurs de progression */}
          <div className="flex justify-between mt-2">
            {[0, 25, 50, 75, 100].map((mark) => (
              <div
                key={mark}
                className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}
              >
                {mark}%
              </div>
            ))}
          </div>
        </div>
        
        {/* Statistiques détaillées */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="text-center p-2 rounded-xl bg-white/5">
            <div className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {Math.floor(total * progress / 100)}
            </div>
            <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Complété
            </div>
          </div>
          <div className="text-center p-2 rounded-xl bg-white/5">
            <div className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {total - Math.floor(total * progress / 100)}
            </div>
            <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Restant
            </div>
          </div>
          <div className="text-center p-2 rounded-xl bg-white/5">
            <div className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {Math.ceil((total - Math.floor(total * progress / 100)) / 7)}
            </div>
            <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Jours restants
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const SprintProgress = ({ sprint, isActive }) => {
  const { theme } = useTheme();
  const progress = (sprint.completed / sprint.total) * 100;
  
  return (
    <motion.div
      className={`glass p-6 rounded-2xl hover:shadow-2xl transition-all duration-300 ${
        isActive ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Sprint {sprint.number}
          </h3>
          <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {sprint.duration} jours • {sprint.points} points
          </div>
        </div>
        {isActive && (
          <div className="px-3 py-1 bg-green-500 text-white text-xs rounded-full font-medium">
            Actif
          </div>
        )}
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Tâches complétées
          </span>
          <span className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {sprint.completed}/{sprint.total}
          </span>
        </div>
        
        <div className="relative">
          <div className={`w-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-3`}>
            <motion.div
              className={`h-3 rounded-full ${
                progress >= 80 ? 'bg-green-500' :
                progress >= 60 ? 'bg-blue-500' :
                progress >= 40 ? 'bg-yellow-500' :
                'bg-red-500'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>
        
        {/* Liste des tâches du sprint */}
        <div className="space-y-2 mt-4">
          {sprint.tasks?.slice(0, 3).map((task, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={task.completed}
                className="w-4 h-4 rounded border-gray-300"
                readOnly
              />
              <span className={`text-sm ${task.completed ? 'line-through opacity-60' : ''} ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {task.name}
              </span>
            </div>
          ))}
          {sprint.tasks?.length > 3 && (
            <div className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
              +{sprint.tasks.length - 3} autres tâches...
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export { ProgressCard, SprintProgress };
