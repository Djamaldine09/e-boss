import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/theme-context';

const QuickStats = () => {
  const { theme } = useTheme();
  const [stats, setStats] = useState({
    weeklyHours: 24,
    monthlyGoal: 80,
    streakDays: 7,
    completedCourses: 12
  });

  return (
    <motion.div
      className="glass p-6 rounded-2xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
        Statistiques Rapides
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-4 rounded-xl bg-blue-500/10">
          <div className="text-2xl font-bold text-blue-500">{stats.weeklyHours}h</div>
          <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Cette semaine
          </div>
        </div>
        <div className="text-center p-4 rounded-xl bg-green-500/10">
          <div className="text-2xl font-bold text-green-500">{stats.monthlyGoal}%</div>
          <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Objectif mensuel
          </div>
        </div>
        <div className="text-center p-4 rounded-xl bg-orange-500/10">
          <div className="text-2xl font-bold text-orange-500">{stats.streakDays}</div>
          <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Jours consécutifs
          </div>
        </div>
        <div className="text-center p-4 rounded-xl bg-purple-500/10">
          <div className="text-2xl font-bold text-purple-500">{stats.completedCourses}</div>
          <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Cours terminés
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const RecentActivity = () => {
  const { theme } = useTheme();
  const [activities, setActivities] = useState([
    { id: 1, type: 'course', title: 'Complété: React Hooks', time: 'Il y a 2h', icon: '✅', color: 'text-green-500' },
    { id: 2, type: 'achievement', title: 'Nouveau succès: Expert React', time: 'Il y a 5h', icon: '🏆', color: 'text-purple-500' },
    { id: 3, type: 'sprint', title: 'Sprint #3 démarré', time: 'Il y a 1 jour', icon: '⚡', color: 'text-blue-500' },
    { id: 4, type: 'message', title: 'Message de votre mentor', time: 'Il y a 2 jours', icon: '💬', color: 'text-orange-500' },
    { id: 5, type: 'course', title: 'Inscrit: Node.js Avancé', time: 'Il y a 3 jours', icon: '📚', color: 'text-indigo-500' }
  ]);

  return (
    <motion.div
      className="glass p-6 rounded-2xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
        Activité Récente
      </h3>
      <div className="space-y-3">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors"
          >
            <div className={`text-2xl ${activity.color}`}>{activity.icon}</div>
            <div className="flex-1">
              <div className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {activity.title}
              </div>
              <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                {activity.time}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const UpcomingDeadlines = () => {
  const { theme } = useTheme();
  const [deadlines, setDeadlines] = useState([
    { id: 1, title: 'Projet React Final', date: '2024-01-20', time: '23:59', priority: 'high', daysLeft: 3 },
    { id: 2, title: 'Quiz JavaScript', date: '2024-01-22', time: '18:00', priority: 'medium', daysLeft: 5 },
    { id: 3, title: 'Soumission Sprint #3', date: '2024-01-25', time: '12:00', priority: 'high', daysLeft: 8 },
    { id: 4, title: 'Examen Node.js', date: '2024-01-30', time: '14:00', priority: 'low', daysLeft: 13 }
  ]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-500 bg-red-500/10';
      case 'medium': return 'text-yellow-500 bg-yellow-500/10';
      case 'low': return 'text-green-500 bg-green-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  return (
    <motion.div
      className="glass p-6 rounded-2xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
        Échéances à Venir
      </h3>
      <div className="space-y-3">
        {deadlines.map((deadline, index) => {
          const priorityClass = getPriorityColor(deadline.priority);
          return (
            <motion.div
              key={deadline.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`p-4 rounded-xl border-l-4 ${priorityClass.replace('text-', 'border-')}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {deadline.title}
                  </div>
                  <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {deadline.date} à {deadline.time}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${priorityClass.split(' ')[0]}`}>
                    {deadline.daysLeft}
                  </div>
                  <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    jours restants
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

const LearningResources = () => {
  const { theme } = useTheme();
  const [resources, setResources] = useState([
    { id: 1, title: 'Documentation React', type: 'Documentation', url: '#', icon: '📖', downloads: 1234 },
    { id: 2, title: 'Vidéos Tutorielles', type: 'Vidéo', url: '#', icon: '🎥', downloads: 892 },
    { id: 3, title: 'Exercices Pratiques', type: 'Exercices', url: '#', icon: '💪', downloads: 567 },
    { id: 4, title: 'Projets Exemples', type: 'Code', url: '#', icon: '💻', downloads: 445 }
  ]);

  return (
    <motion.div
      className="glass p-6 rounded-2xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
        Ressources d'Apprentissage
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {resources.map((resource, index) => (
          <motion.div
            key={resource.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="p-4 rounded-xl hover:bg-white/5 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="text-2xl">{resource.icon}</div>
              <div className="flex-1">
                <div className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {resource.title}
                </div>
                <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  {resource.type}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {resource.downloads} téléchargements
              </div>
              <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors">
                Accéder
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const StudyTimer = () => {
  const { theme } = useTheme();
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [sessionType, setSessionType] = useState('pomodoro');

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTime(0);
  };

  const sessionTimes = {
    pomodoro: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
    custom: time
  };

  return (
    <motion.div
      className="glass p-6 rounded-2xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
        Timer d'Étude
      </h3>
      
      <div className="text-center mb-6">
        <div className={`text-4xl font-mono font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          {formatTime(time)}
        </div>
        <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          {isRunning ? 'En cours...' : 'En pause'}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-6">
        {Object.keys(sessionTimes).map((type) => (
          <button
            key={type}
            onClick={() => setSessionType(type)}
            className={`p-2 rounded-lg text-sm font-medium transition-all ${
              sessionType === type
                ? 'bg-blue-600 text-white'
                : `${theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`
            }`}
          >
            {type === 'pomodoro' && 'Pomodoro (25min)'}
            {type === 'shortBreak' && 'Pause courte (5min)'}
            {type === 'longBreak' && 'Pause longue (15min)'}
            {type === 'custom' && 'Personnalisé'}
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          onClick={toggleTimer}
          className={`flex-1 py-3 rounded-lg font-medium transition-all ${
            isRunning
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {isRunning ? 'Pause' : 'Démarrer'}
        </button>
        <button
          onClick={resetTimer}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            theme === 'dark' 
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Réinitialiser
        </button>
      </div>
    </motion.div>
  );
};

export { QuickStats, RecentActivity, UpcomingDeadlines, LearningResources, StudyTimer };
