import React, { useState } from 'react';
import chatbotAPI from '../../services/chatbotAPI';

const CHATBOT_CONTEXT =
  'E_BOSS est une plateforme éducative. Agis comme un assistant IA pédagogique spécialisé en React, JavaScript, Express.js, Node.js, Python, FastAPI, bases de données et développement web. Réponds en français sauf si l’utilisateur demande une autre langue. Sois clair, naturel, précis et contextualisé.';

const createChatUserId = () => {
  try {
    const existing = localStorage.getItem('e_boss_chat_user_id');
    if (existing) return existing;

    const generated =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : 'chat_' + Math.random().toString(36).slice(2) + Date.now();

    localStorage.setItem('e_boss_chat_user_id', generated);
    return generated;
  } catch {
    return 'chat_' + Date.now();
  }
};

const renderInlineText = (text) => {
  const parts = String(text).split('**');

  return parts.map((part, index) => {
    if (index % 2 === 1) {
      return <strong key={index}>{part}</strong>;
    }
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
};

const BotText = ({ text }) => {
  const lines = String(text || '').split('\n');
  const elements = [];
  let code = [];
  let inCode = false;
  let codeLanguage = '';

  const flushCode = (key) => {
    if (!code.length) return;

    elements.push(
      <pre
        key={key}
        style={{
          margin: '10px 0',
          padding: '12px',
          borderRadius: '10px',
          overflowX: 'auto',
          background: '#111827',
          color: '#f9fafb',
          fontSize: '12px',
          lineHeight: 1.55,
          border: '1px solid rgba(156, 163, 175, 0.18)'
        }}
      >
        <code>{code.join('\n')}</code>
      </pre>
    );

    code = [];
    codeLanguage = '';
  };

  lines.forEach((line, index) => {
    if (line.startsWith('~~~')) {
      if (inCode) {
        flushCode('code-' + index);
        inCode = false;
      } else {
        inCode = true;
        codeLanguage = line.slice(3).trim();
      }
      return;
    }

    if (inCode) {
      code.push(line);
      return;
    }

    if (!line.trim()) {
      elements.push(<div key={'space-' + index} style={{ height: '7px' }} />);
      return;
    }

    if (line.startsWith('### ')) {
      elements.push(
        <div
          key={index}
          style={{
            fontWeight: 700,
            fontSize: '14px',
            margin: '2px 0 7px',
            color: '#111827'
          }}
        >
          {renderInlineText(line.slice(4))}
        </div>
      );
      return;
    }

    elements.push(
      <div
        key={index}
        style={{
          lineHeight: 1.55,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word'
        }}
      >
        {renderInlineText(line)}
      </div>
    );
  });

  if (inCode) {
    flushCode('code-final-' + codeLanguage);
  }

  return <>{elements}</>;
};

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatUserId] = useState(createChatUserId);

  const handleSendMessage = async (value = message) => {
    const userMessage = String(value || '').trim();
    if (!userMessage || isLoading) return;

    setMessages((prev) => [
      ...prev,
      { text: userMessage, sender: 'user' }
    ]);
    setMessage('');
    setIsLoading(true);

    try {
      const data = await chatbotAPI.chat(
        userMessage,
        chatUserId,
        CHATBOT_CONTEXT
      );

      const botText =
        typeof data?.text === 'string' && data.text.trim()
          ? data.text.trim()
          : typeof data?.response === 'string' && data.response.trim()
            ? data.response.trim()
            : 'Je n’ai pas encore assez d’informations pour répondre précisément à cette demande.';

      setMessages((prev) => [
        ...prev,
        {
          text: botText,
          sender: 'bot',
          suggestions: Array.isArray(data?.suggestions)
            ? data.suggestions.slice(0, 4)
            : []
        }
      ]);
    } catch (error) {
      const errorText =
        error?.response?.data?.detail ||
        error?.message ||
        'Le service IA est temporairement indisponible. Veuillez réessayer.';

      setMessages((prev) => [
        ...prev,
        {
          text: 'Je rencontre un problème technique pour traiter votre demande.\\n\\n' + errorText,
          sender: 'bot',
          isError: true
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestions = [
    'Explique-moi useState',
    'À quoi sert useEffect ?',
    'Comment créer une API Express ?',
    'Analyse une erreur React',
    'Explique async/await',
    'Comment connecter MySQL à Node.js'
  ];

  if (!isOpen) {
    return (
      <div
        onClick={() => setIsOpen(true)}
        aria-label="Ouvrir le chatbot"
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') setIsOpen(true);
        }}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 9999,
          width: '60px',
          height: '60px',
          background: 'rgba(59, 130, 246, 0.88)',
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
        onMouseEnter={(event) => {
          event.currentTarget.style.transform = 'scale(1.08)';
        }}
        onMouseLeave={(event) => {
          event.currentTarget.style.transform = 'scale(1)';
        }}
      >
        <svg
          style={{ width: '24px', height: '24px', color: 'white' }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
      </div>
    );
  }

  return (
    <div
      className="floating-chatbot-window"
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 9999,
        width: 'min(390px, calc(100vw - 24px))',
        height: 'min(620px, calc(100vh - 40px))',
        minHeight: '460px',
        background: 'rgba(255, 255, 255, 0.96)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.35)',
        borderRadius: '18px',
        boxShadow: '0 18px 60px rgba(0, 0, 0, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          background: 'rgba(37, 99, 235, 0.95)',
          color: 'white',
          padding: '14px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div>
          <div style={{ fontSize: '15px', fontWeight: 700 }}>
            Assistant IA
          </div>
          <div style={{ fontSize: '11px', opacity: 0.82 }}>
            Assistant pédagogique E_BOSS
          </div>
        </div>

        <button
          onClick={() => setIsOpen(false)}
          aria-label="Fermer le chatbot"
          style={{
            background: 'rgba(255, 255, 255, 0.12)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '9px',
            width: '34px',
            height: '34px',
            color: 'white',
            cursor: 'pointer',
            fontSize: '20px',
            lineHeight: 1
          }}
        >
          ×
        </button>
      </div>

      <div
        style={{
          flex: 1,
          padding: '14px',
          overflowY: 'auto',
          background:
            'linear-gradient(180deg, rgba(249,250,251,0.98), rgba(243,246,250,0.98))',
          color: '#1f2937'
        }}
      >
        {messages.length === 0 && (
          <div style={{ marginBottom: '18px' }}>
            <div
              style={{
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '14px',
                padding: '14px',
                boxShadow: '0 5px 20px rgba(0,0,0,0.04)'
              }}
            >
              <div style={{ fontWeight: 700, marginBottom: '6px' }}>
                Bonjour 👋
              </div>
              <div style={{ fontSize: '13px', lineHeight: 1.55, color: '#4b5563' }}>
                Je peux vous aider à comprendre un concept, corriger un bug,
                écrire du code ou avancer étape par étape.
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '7px',
                marginTop: '12px'
              }}
            >
              {suggestions.map((item) => (
                <button
                  key={item}
                  onClick={() => handleSendMessage(item)}
                  style={{
                    padding: '7px 9px',
                    background: 'rgba(59,130,246,0.08)',
                    border: '1px solid rgba(59,130,246,0.18)',
                    borderRadius: '999px',
                    color: '#2563eb',
                    cursor: 'pointer',
                    fontSize: '11px'
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              marginBottom: '12px',
              display: 'flex',
              justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start'
            }}
          >
            <div
              style={{
                maxWidth: msg.sender === 'user' ? '82%' : '94%',
                padding: msg.sender === 'user' ? '9px 12px' : '11px 13px',
                borderRadius:
                  msg.sender === 'user'
                    ? '14px 14px 4px 14px'
                    : '14px 14px 14px 4px',
                background:
                  msg.sender === 'user'
                    ? 'linear-gradient(135deg, #2563eb, #3b82f6)'
                    : msg.isError
                      ? '#fff7ed'
                      : 'white',
                color: msg.sender === 'user' ? 'white' : '#1f2937',
                border:
                  msg.sender === 'bot'
                    ? '1px solid #e5e7eb'
                    : '1px solid rgba(255,255,255,0.14)',
                boxShadow:
                  msg.sender === 'bot'
                    ? '0 4px 16px rgba(0,0,0,0.04)'
                    : 'none',
                fontSize: '13px'
              }}
            >
              {msg.sender === 'bot' ? <BotText text={msg.text} /> : msg.text}

              {msg.sender === 'bot' && msg.suggestions?.length > 0 && (
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '6px',
                    marginTop: '12px'
                  }}
                >
                  {msg.suggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => handleSendMessage(suggestion)}
                      disabled={isLoading}
                      style={{
                        padding: '6px 8px',
                        background: '#eff6ff',
                        border: '1px solid #bfdbfe',
                        borderRadius: '8px',
                        color: '#2563eb',
                        cursor: isLoading ? 'default' : 'pointer',
                        fontSize: '10px'
                      }}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div style={{ marginBottom: '12px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 12px',
                borderRadius: '14px 14px 14px 4px',
                background: 'white',
                border: '1px solid #e5e7eb',
                color: '#6b7280',
                fontSize: '12px'
              }}
            >
              <span>Analyse de votre demande</span>
              <span aria-hidden="true">•••</span>
            </div>
          </div>
        )}
      </div>

      <div
        style={{
          padding: '11px',
          borderTop: '1px solid #e5e7eb',
          display: 'flex',
          gap: '8px',
          background: 'rgba(255,255,255,0.96)'
        }}
      >
        <input
          type="text"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') handleSendMessage();
          }}
          placeholder="Posez votre question..."
          aria-label="Message au chatbot"
          style={{
            flex: 1,
            minWidth: 0,
            padding: '10px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '35px',
            outline: 'none',
            background: '#fff',
            color: '#1f2937'
          }}
        />

        <button
          onClick={() => handleSendMessage()}
          disabled={!message.trim() || isLoading}
          style={{
            background:
              !message.trim() || isLoading
                ? '#93c5fd'
                : 'linear-gradient(135deg, #2563eb, #3b82f6)',
            color: 'white',
            border: 'none',
            borderRadius: '35px',
            padding: '0 22px',
            cursor: !message.trim() || isLoading ? 'default' : 'pointer',
            fontWeight: 600
          }}
        >
          Envoyer
        </button>
      </div>
    </div>
  );
};

export default FloatingChatbot;
