import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/theme-context';

const OnlineUsersList = () => {
  const { theme } = useTheme();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuler des utilisateurs en ligne
    const mockUsers = [
      {
        id: 1,
        name: 'Alice Martin',
        email: 'alice.martin@email.com',
        avatar: '👩',
        status: 'online',
        lastSeen: new Date(),
        courses: ['React', 'Node.js'],
        progress: 75
      },
      {
        id: 2,
        name: 'Bob Dupont',
        email: 'bob.dupont@email.com',
        avatar: '👨',
        status: 'online',
        lastSeen: new Date(Date.now() - 300000),
        courses: ['Python', 'Django'],
        progress: 60
      },
      {
        id: 3,
        name: 'Claire Bernard',
        email: 'claire.bernard@email.com',
        avatar: '👩',
        status: 'away',
        lastSeen: new Date(Date.now() - 600000),
        courses: ['JavaScript', 'Vue.js'],
        progress: 85
      },
      {
        id: 4,
        name: 'David Leroy',
        email: 'david.leroy@email.com',
        avatar: '👨',
        status: 'online',
        lastSeen: new Date(Date.now() - 120000),
        courses: ['TypeScript', 'Angular'],
        progress: 45
      },
      {
        id: 5,
        name: 'Emma Petit',
        email: 'emma.petit@email.com',
        avatar: '👩',
        status: 'offline',
        lastSeen: new Date(Date.now() - 1800000),
        courses: ['HTML', 'CSS', 'JavaScript'],
        progress: 90
      }
    ];

    setTimeout(() => {
      setUsers(mockUsers);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'online': return 'En ligne';
      case 'away': return 'Absent';
      case 'offline': return 'Hors ligne';
      default: return 'Inconnu';
    }
  };

  const formatLastSeen = (date) => {
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

  if (loading) {
    return (
      <div className="glass p-6 rounded-2xl">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mr-3"></div>
          <span className="text-gray-600">Chargement des utilisateurs...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="glass p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Utilisateurs en ligne
        </h2>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600">{users.filter(u => u.status === 'online').length} en ligne</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`p-4 rounded-xl border ${
              theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            } hover:shadow-lg transition-all`}
          >
            <div className="flex items-start gap-3">
              <div className="relative">
                <div className="text-3xl">{user.avatar}</div>
                <div className={`absolute bottom-0 right-0 w-3 h-3 ${getStatusColor(user.status)} rounded-full border-2 ${
                  theme === 'dark' ? 'border-gray-800' : 'border-white'
                }`}></div>
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {user.name}
                </h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {user.email}
                </p>
                <div className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                  {getStatusText(user.status)} • {formatLastSeen(user.lastSeen)}
                </div>
                
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Progression
                    </span>
                    <span className={`text-sm font-bold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                      {user.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${user.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="mt-3">
                  <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                    Cours actifs :
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {user.courses.map((course, idx) => (
                      <span 
                        key={idx}
                        className={`px-2 py-1 text-xs rounded ${
                          theme === 'dark' ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {course}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {users.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">👥</div>
          <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Aucun utilisateur en ligne
          </h3>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
            Tous les utilisateurs sont actuellement hors ligne
          </p>
        </div>
      )}
    </div>
  );
};

export default OnlineUsersList;
