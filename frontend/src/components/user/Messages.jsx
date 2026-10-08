import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/theme-context';
import { Search, MoreVertical, Phone, Video, Paperclip, Smile, Send, Settings, Users, Calendar, Bookmark } from 'lucide-react';
import DashboardNavbar from './dashboard-navbar';
import Sidebar from './sidebar';
import Footer from '../footer';

const Messages = ({ standalone = true }) => {
  const { theme } = useTheme();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [replyText, setReplyText] = useState('');
  const [replies, setReplies] = useState([]);
  const [alertMessage, setAlertMessage] = useState('');

  // 🔹 Liste de mots toxiques
  const toxicWords = ['merde', 'con', 'connard', 'conne', 'salope', 'enculé', 'enculée', 'chiant', 'bordel', 'ta gueule', 'nique', 'nique ta mère', 'branleur', 'branleuse', 'abruti', 'abrutie', 'imbécile', 'idiot', 'idiote', 'crétin', 'crétine', 'andouille', 'trou du cul', 'cul', 'culé', 'chiotte', 'chiottes', 'chié', 'chiée', 'chiant', 'chiarde', 'chiard', 'gueule', 'ferme ta gueule', 'fils de pute', 'fils de chien', 'pute', 'putasse', 'putain de merde', 'putain de bordel', 'putain de chiotte', 'putain de con', 'putain de connard', 'putain de salope', 'putain de bâtard', 'bâtard', 'bâtarde', 'ordure', 'sale con', 'sale connard', 'sale conne', 'sale pute', 'sale salope', 'sale bâtard', 'sale merde', 'sale chien', 'sale enfoiré', 'enfoiré', 'enfoirée', 'casse-couilles', 'couilles', 'couillon', 'couillonne', 'couillarde', 'couillasse', 'couillots', 'couillots de merde', 'couilles molles', 'couilles en or', 'couilles de singe', 'couilles de chien', 'couilles de taureau', 'couilles de merde', 'cul de merde', 'cul de sac', 'cul bordé de nouilles', 'cul terreux', 'cul serré', 'cul mou', 'cul sale', 'cul puant', 'cul chiant', 'cul chiotte', 'cul bordel', 'cul putain', 'cul connard', 'cul bâtard', 'cul enfoiré', 'cul ordure', 'cul salope', 'cul pute', 'cul branleur', 'cul abruti', 'cul imbécile', 'cul idiot', 'cul crétin', 'cul andouille', 'cul trou du cul', 'lelena ah', 'masospory', 'nemany', 'nique ta mère', 'lelena ah', 'masospory','nemany', 'nique ta mère'];

  const messages = [
    {
      id: 1,
      sender: 'Kevinn',
      avatar: 'MD',
      subject: 'Kevinn',
      preview: 'Bonjour, est-ce que cava ?',
      time: '10:30',
      unread: true,
      fullMessage: 'Bonjour, est-ce que cava ?',
      color: 'from-purple-500 to-pink-500',
    },
    {
      id: 2,
      sender: 'Karen',
      avatar: 'SY',
      subject: 'Rappel de cours',
      preview: 'Cours React Hooks demain...',
      time: '09:15',
      unread: false,
      fullMessage: 'Cours React Hooks demain à 14h.',
      color: 'from-blue-500 to-cyan-500',
    },
  ];

  const filteredMessages = messages.filter(
    (msg) =>
      msg.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 🔹 ENVOI MESSAGE AVEC DÉTECTION TOXIQUE
  const handleSend = () => {
    if (!replyText.trim()) return;

    const lowerText = replyText.toLowerCase();
    const foundToxic = toxicWords.some(word => lowerText.includes(word));

    if (foundToxic) {
      setAlertMessage('⚠️ Le message contient des mots interdits et ne peut pas être envoyé.');
      return;
    }

    setReplies((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);

    setReplyText('');
    setAlertMessage('');
  };

  return (
    <>
      {standalone && (
        <>
          <DashboardNavbar
            onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
            sidebarOpen={sidebarOpen}
          />
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        </>
      )}

      <div className={`${standalone ? `pt-20 w-full max-w-full min-w-0 overflow-x-hidden px-2 sm:px-6 lg:px-8 ${sidebarOpen ? 'lg:pl-80' : ''}` : 'w-full max-w-none min-w-0 overflow-x-hidden flex justify-center px-2 sm:px-0'}`}>
        <div className={`${standalone ? 'h-[calc(100dvh-5rem)]' : 'min-h-[calc(100dvh-8rem)] h-[calc(100dvh-8rem)]'} w-full max-w-[1600px] min-w-0 mx-auto overflow-hidden rounded-none sm:rounded-2xl flex flex-col lg:flex-row ${theme === 'dark' ? 'bg-gray-900/80' : 'bg-gray-50/80'}`}>
          {/* SIDEBAR GAUCHE - STYLE TEAMS */}
          <div className={`w-full max-w-full min-w-0 mx-0 lg:ml-0 lg:mr-0 lg:w-[360px] lg:max-w-none lg:shrink-0 ${theme === 'dark' ? 'bg-gray-800/60 border-gray-700/60' : 'bg-white/60 border-gray-200/60'} border-r lg:border-r-0 border-b lg:border-b flex flex-col glass ${selectedMessage ? 'hidden' : 'flex'} lg:flex h-full order-none`}>
            {/* Header Teams */}
            <div className={`p-4 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between mb-4">
                <h1 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Messages</h1>
                <div className="flex items-center space-x-2">
                  <button className={`p-2 ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-lg transition-colors`}>
                    <Settings className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                  </button>
                  <button className={`p-2 ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-lg transition-colors`}>
                    <Users className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                  </button>
                </div>
              </div>
              
              {/* Barre de recherche style Teams */}
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`} />
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Rechercher des messages..."
                  className={`w-full pl-10 pr-4 py-2 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-100 border-gray-200 text-gray-900 placeholder-gray-500'} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm`}
                />
              </div>
            </div>

            {/* Navigation secondaire */}
            <div className={`px-4 py-2 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex space-x-1">
                <button className={`px-3 py-1.5 ${theme === 'dark' ? 'bg-blue-700' : 'bg-blue-600'} text-white rounded-md text-sm font-medium`}>
                  Conversations
                </button>
                <button className={`px-3 py-1.5 ${theme === 'dark' ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'} rounded-md text-sm font-medium transition-colors`}>
                  Équipes
                </button>
                <button className={`px-3 py-1.5 ${theme === 'dark' ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'} rounded-md text-sm font-medium transition-colors`}>
                  Meetings
                </button>
              </div>
            </div>

            {/* Liste des conversations */}
            <div className="flex-1 overflow-y-auto">
              {filteredMessages.map((message) => (
                <motion.div
                  key={message.id}
                  onClick={() => {
                    setSelectedMessage(message);
                    setReplies([]);
                    setAlertMessage('');
                  }}
                  className={`p-4 cursor-pointer border-b transition-all duration-200 ${
                    selectedMessage?.id === message.id 
                      ? theme === 'dark' 
                        ? 'bg-gradient-to-r from-blue-900/50 to-blue-800/30 border-l-4 border-l-blue-500 shadow-lg' 
                        : 'bg-gradient-to-r from-blue-50 to-blue-100/50 border-l-4 border-l-blue-600 shadow-lg'
                      : theme === 'dark'
                        ? 'hover:bg-gray-700/50 border-gray-700/30'
                        : 'hover:bg-gray-50/50 border-gray-100/50'
                  }`}
                >
                  <div className="flex items-start space-x-3 w-full">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm ${message.color} shadow-md ${selectedMessage?.id === message.id ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}>
                      {message.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className={`font-semibold truncate ${selectedMessage?.id === message.id ? (theme === 'dark' ? 'text-blue-300' : 'text-blue-900') : (theme === 'dark' ? 'text-gray-100' : 'text-gray-900')}`}>
                          {message.sender}
                        </h3>
                        <span className={`text-xs ${selectedMessage?.id === message.id ? (theme === 'dark' ? 'text-blue-400' : 'text-blue-600') : (theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}`}>
                          {message.time}
                        </span>
                      </div>
                      <p className={`text-sm truncate mt-1 ${selectedMessage?.id === message.id ? (theme === 'dark' ? 'text-blue-200' : 'text-blue-800') : (theme === 'dark' ? 'text-gray-300' : 'text-gray-600')}`}>
                        {message.preview}
                      </p>
                      {message.unread && (
                        <div className="mt-1">
                          <span className={`inline-block w-2 h-2 ${selectedMessage?.id === message.id ? 'bg-blue-500' : 'bg-blue-600'} rounded-full`}></span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ZONE DE CONVERSATION - STYLE TEAMS */}
          <div className={`flex-1 min-w-0 w-0 max-w-full flex flex-col overflow-hidden ${theme === 'dark' ? 'bg-gray-800/60' : 'bg-white/60'} glass ${selectedMessage ? 'flex' : 'hidden lg:flex'} order-none`}>
            {selectedMessage ? (
              <>
                {/* HEADER CONVERSATION */}
                <div className={`w-full min-w-0 px-3 sm:px-6 py-3 sm:py-4 border-b ${theme === 'dark' ? 'border-gray-700/60 bg-gray-800/60' : 'border-gray-200/60 bg-white/60'}`}>
                  <div className="flex items-center justify-between">
                    {/* Bouton retour mobile */}
                    <button 
                      onClick={() => setSelectedMessage(null)}
                      className={`lg:hidden p-2 mr-2 ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-lg transition-colors`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white font-semibold text-xs sm:text-sm ${selectedMessage.color}`}>
                        {selectedMessage.avatar}
                      </div>
                      <div>
                        <h2 className={`font-semibold text-sm sm:text-base ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{selectedMessage.sender}</h2>
                        <p className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>En ligne</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <button className={`p-1.5 sm:p-2 ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-lg transition-colors`}>
                        <Phone className={`w-4 h-4 sm:w-5 sm:h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                      </button>
                      <button className={`p-1.5 sm:p-2 ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-lg transition-colors`}>
                        <Video className={`w-4 h-4 sm:w-5 sm:h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                      </button>
                      <button className={`p-1.5 sm:p-2 ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-lg transition-colors`}>
                        <MoreVertical className={`w-4 h-4 sm:w-5 sm:h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* ZONE DES MESSAGES */}
                <div className={`flex-1 min-w-0 w-full overflow-y-auto overflow-x-hidden ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} p-3 sm:p-6`}>
                  <div className="w-full max-w-5xl mx-auto space-y-5 px-0 sm:px-2 lg:px-6">
                    {/* Message reçu */}
                    <div className="flex items-start gap-3 w-full min-w-0 px-0 sm:px-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm ${selectedMessage.color} shadow-lg`}>
                        {selectedMessage.avatar}
                      </div>
                      <div className="flex-1 min-w-0 w-0 max-w-2xl mx-auto">
                        <div className={`${theme === 'dark' ? 'bg-gray-700/80 border-gray-600/50' : 'bg-white/90 border-gray-200/50'} p-4 rounded-2xl shadow-lg backdrop-blur-sm border`}>
                          <p className={`${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'} text-sm leading-relaxed`}>{selectedMessage.fullMessage}</p>
                        </div>
                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mt-2 ml-1`}>{selectedMessage.time}</p>
                      </div>
                    </div>

                    {/* Réponses envoyées */}
                    {replies.map((reply) => (
                      <div key={reply.id} className="flex items-start justify-center gap-3 w-full min-w-0 px-1 sm:px-4">
                        <div className="flex-1 min-w-0 w-0 max-w-2xl">
                          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-2xl shadow-lg backdrop-blur-sm">
                            <p className="text-sm leading-relaxed">{reply.text}</p>
                          </div>
                          <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mt-2 mr-1 text-right`}>{reply.time}</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center text-white font-semibold text-sm shadow-lg">
                          MOI
                        </div>
                      </div>
                    ))}
                    
                    {/* Zone de saisie */}
                    {alertMessage && (
                      <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-red-900/30 border border-red-700' : 'bg-red-50 border border-red-200'}`}>
                        <p className={`text-sm ${theme === 'dark' ? 'text-red-300' : 'text-red-700'}`}>{alertMessage}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* ZONE DE RÉPONSE */}
                <div className={`border-t p-3 sm:p-4 ${theme === 'dark' ? 'border-gray-700/60 bg-gray-800/60' : 'border-gray-200/60 bg-white/60'}`}>
                  <div className="flex items-center space-x-2 sm:space-x-3 w-full min-w-0">
                    <div style={{ borderRadius: "35px" }} className={`flex-1 min-w-0 flex items-center space-x-1 sm:space-x-2 h-[44px] min-h-[44px] border px-2 sm:px-3 overflow-hidden ${theme === 'dark' ? 'bg-gray-700/70 border-gray-600' : 'bg-gray-100 border-gray-300'}`}>
                      <button className={`h-[31px] w-[31px] p-0 shrink-0 flex items-center justify-center ${theme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-200'} transition-colors rounded-lg`}>
                        <Paperclip className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                      </button>
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Tapez un message..."
                        style={{ borderRadius: "35px" }} className={`flex-1 min-w-0 h-[34px] min-h-[34px] max-h-[34px] py-1 px-1 bg-transparent resize-none focus:outline-none text-sm ${theme === 'dark' ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'}`}
                        rows={1}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                          }
                        }}
                      />
                      <button className={`p-2 ${theme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-200'} transition-colors rounded-lg`}>
                        <Smile className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                      </button>
                    </div>
                    <button
                      onClick={handleSend}
                      disabled={!replyText.trim()}
                      style={{ borderRadius: "35px" }}
                      className={`h-[44px] min-h-[44px] w-[44px] min-w-[44px] p-0 shrink-0 flex items-center justify-center transition-colors ${
                        replyText.trim() 
                          ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                          : theme === 'dark' ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-between mt-2 space-y-1 sm:space-y-0">
                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Appuyez sur Entrée pour envoyer</p>
                    <div className="flex items-center space-x-2">
                      <button className={`text-xs ${theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}>
                        <Bookmark className="w-3 h-3" />
                      </button>
                      <button className={`text-xs ${theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}>
                        <Calendar className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8">
                <div className="text-center">
                  <Users className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`} />
                  <h3 className={`text-lg sm:text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>Sélectionnez une conversation</h3>
                  <p className={`text-sm sm:text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Choisissez une conversation dans la liste pour commencer à discuter</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {standalone && <Footer />}
    </>
  );
};

export default Messages;