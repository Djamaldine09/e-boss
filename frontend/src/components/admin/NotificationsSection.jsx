import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/theme-context';

const NotificationsSection = () => {
  const { theme } = useTheme();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuler des notifications de messages éphémères
    const mockNotifications = [
      {
        id: 1,
        type: 'message',
        title: 'Nouveau message de Alice',
        content: 'Bonjour, j\'ai une question sur le cours React Hooks...',
        sender: 'Alice Martin',
        timestamp: new Date(Date.now() - 300000),
        priority: 'normal',
        read: false
      },
      {
        id: 2,
        type: 'alert',
        title: 'Alerte système',
        content: 'Le serveur de quiz sera en maintenance dans 30 minutes',
        sender: 'Système',
        timestamp: new Date(Date.now() - 600000),
        priority: 'high',
        read: false
      },
      {
        id: 3,
        type: 'message',
        title: 'Message du groupe React',
        content: 'Quelqu\'un peut m\'aider avec useEffect ?',
        sender: 'Bob Dupont',
        timestamp: new Date(Date.now() - 900000),
        priority: 'normal',
        read: true
      },
      {
        id: 4,
        type: 'success',
        title: 'Sprint terminé',
        content: 'Félicitations ! Vous avez terminé le sprint "React Hooks"',
        sender: 'Système',
        timestamp: new Date(Date.now() - 1800000),
        priority: 'low',
        read: true
      },
      {
        id: 5,
        type: 'message',
        title: 'Question sur le cours Node.js',
        content: 'Je ne comprends pas le middleware Express...',
        sender: 'Claire Bernard',
        timestamp: new Date(Date.now() - 3600000),
        priority: 'normal',
        read: true
      }
    ];

    setTimeout(() => {
      setNotifications(mockNotifications);
      setLoading(false);
    }, 1000);
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'message': return '💬';
      case 'alert': return '⚠️';
      case 'success': return '✅';
      default: return '📢';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-red-500 bg-red-50';
      case 'normal': return 'border-blue-500 bg-blue-50';
      case 'low': return 'border-gray-500 bg-gray-50';
      default: return 'border-gray-500 bg-gray-50';
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

  const markAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="glass p-6 rounded-2xl">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mr-3"></div>
          <span className="text-gray-600">Chargement des notifications...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="glass p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Notifications
        </h2>
        {unreadCount > 0 && (
          <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
          </div>
        )}
      </div>

      <div className="space-y-3">
        {notifications.map((notification, index) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`p-4 rounded-xl border-l-4 ${
              notification.read 
                ? theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300'
                : getPriorityColor(notification.priority)
            } hover:shadow-md transition-all`}
          >
            <div className="flex items-start gap-3">
              <div className="text-2xl flex-shrink-0">
                {getIcon(notification.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {notification.title}
                    </h3>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mt-1`}>
                      {notification.content}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                        De: {notification.sender}
                      </span>
                      <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                        •
                      </span>
                      <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                        {formatTimestamp(notification.timestamp)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-3">
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                        title="Marquer comme lu"
                      >
                        Marquer lu
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                      title="Supprimer"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {notifications.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔔</div>
          <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Aucune notification
          </h3>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
            Vous n'avez aucune nouvelle notification
          </p>
        </div>
      )}
    </div>
  );
};

export default NotificationsSection;
