import React, { useState } from 'react';

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    // Ajouter le message de l'utilisateur
    setMessages(prev => [...prev, { text: message, sender: 'user' }]);
    setMessage('');
    setIsLoading(true);

    try {
      // Appeler l'API Python du chatbot
      const response = await fetch('http://localhost:5000/api/chatbot/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          user_id: 'user_' + Date.now(),
          context: 'react_express_learning'
        })
      });

      if (!response.ok) {
        throw new Error('Erreur de communication avec le chatbot');
      }

      const data = await response.json();
      
      // Ajouter la réponse du bot
      setMessages(prev => [...prev, { 
        text: data.response || data.message || 'Désolé, je n\'ai pas pu traiter votre demande.', 
        sender: 'bot' 
      }]);
      
    } catch (error) {
      console.error('Erreur chatbot:', error);
      // Message d'erreur si le backend n'est pas accessible
      setMessages(prev => [...prev, { 
        text: 'Désolé, le service de chatbot n\'est pas disponible. Assurez-vous que le backend Python est démarré sur localhost:5000', 
        sender: 'bot' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <div 
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 9999,
          width: '60px',
          height: '60px',
          background: 'rgba(59, 130, 246, 0.8)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          transition: 'transform 0.2s'
        }}
        onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
      >
        <svg style={{ width: '24px', height: '24px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 9999,
      width: '350px',
      height: '500px',
      background: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      borderRadius: '16px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        background: 'rgba(59, 130, 246, 0.9)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        color: 'white',
        padding: '16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h3 style={{ margin: 0, fontSize: '16px' }}>Assistant Virtuel</h3>
        <button 
          onClick={() => setIsOpen(false)}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            fontSize: '20px'
          }}
        >
          ×
        </button>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        padding: '16px',
        overflowY: 'auto',
        backgroundColor: 'rgba(249, 250, 251, 0.8)',
        color: '#1f2937'
      }}>
        <div style={{ textAlign: 'center', color: '#4b5563', marginBottom: '20px' }}>
          <p>Bonjour ! Je suis votre assistant IA powered by Python.</p>
          <p>Posez-moi vos questions sur React et Express :</p>
        </div>
        
        {/* Suggestions de questions */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '8px',
            fontSize: '12px'
          }}>
            {[
              'React Hooks',
              'useState',
              'useEffect',
              'Express',
              'Routes Express',
              'Middleware Express',
              'Components React',
              'Props React',
              'State React',
              'API REST Express'
            ].map((suggestion, index) => (
              <button
                key={index}
                onClick={() => setMessage(suggestion)}
                style={{
                  padding: '6px 8px',
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '6px',
                  color: '#3b82f6',
                  cursor: 'pointer',
                  fontSize: '11px',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(59, 130, 246, 0.2)';
                  e.target.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
        {messages.map((msg, index) => (
          <div key={index} style={{
            marginBottom: '12px',
            textAlign: msg.sender === 'user' ? 'right' : 'left'
          }}>
            <div style={{
              display: 'inline-block',
              padding: '8px 12px',
              borderRadius: '12px',
              backgroundColor: msg.sender === 'user' ? 'rgba(59, 130, 246, 0.9)' : 'rgba(229, 231, 235, 0.8)',
              color: msg.sender === 'user' ? 'white' : '#1f2937',
              maxWidth: '80%'
            }}>
              {msg.text}
            </div>
          </div>
        ))}
        
        {/* Indicateur de chargement */}
        {isLoading && (
          <div style={{
            marginBottom: '12px',
            textAlign: 'left'
          }}>
            <div style={{
              display: 'inline-block',
              padding: '8px 12px',
              borderRadius: '12px',
              backgroundColor: 'rgba(229, 231, 235, 0.8)',
              color: '#1f2937'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ display: 'flex', gap: '2px' }}>
                  <div style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: '#3b82f6',
                    animation: 'bounce 1.4s infinite ease-in-out both'
                  }}></div>
                  <div style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: '#3b82f6',
                    animation: 'bounce 1.4s infinite ease-in-out both',
                    animationDelay: '0.16s'
                  }}></div>
                  <div style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: '#3b82f6',
                    animation: 'bounce 1.4s infinite ease-in-out both',
                    animationDelay: '0.32s'
                  }}></div>
                </div>
                <span style={{ fontSize: '12px' }}>En train de réfléchir...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{
        padding: '16px',
        borderTop: '1px solid rgba(229, 231, 235, 0.5)',
        display: 'flex',
        gap: '8px',
        backgroundColor: 'rgba(255, 255, 255, 0.8)'
      }}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Tapez votre message..."
          style={{
            flex: 1,
            padding: '8px 12px',
            border: '1px solid rgba(209, 213, 219, 0.8)',
            borderRadius: '8px',
            outline: 'none',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            color: '#1f2937'
          }}
        />
        <button
          onClick={handleSendMessage}
          style={{
            backgroundColor: 'rgba(59, 130, 246, 0.9)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 16px',
            cursor: 'pointer',
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(59, 130, 246, 1)'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(59, 130, 246, 0.9)'}
        >
          Envoyer
        </button>
      </div>
    </div>
  );
};

export default FloatingChatbot;
