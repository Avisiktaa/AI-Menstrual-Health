import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, User, Bot, AlertCircle, Volume2 } from 'lucide-react';

export default function Chatbot({ t, formData, aiData, lang }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSpeak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      if (t.langCode === 'hi') utterance.lang = 'hi-IN';
      else if (t.langCode === 'bn') utterance.lang = 'bn-IN';
      else utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cycles: formData?.cycles || [],
          symptoms: formData?.symptoms || [],
          risk: aiData?.risk || 'Unknown',
          message: userMessage.text,
          lang: lang
        })
      });

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'bot', text: data.advice }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'bot', text: 'Sorry, I am having trouble connecting right now.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chatbot-wrapper">
      {/* Floating Button */}
      <button 
        className="chatbot-toggle shadow-lg"
        onClick={toggleChat}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '60px',
          height: '60px',
          borderRadius: '30px',
          background: 'linear-gradient(135deg, var(--primary), var(--accent-pink))',
          color: 'white',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 1000,
          transition: 'transform 0.2s',
        }}
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-window glass-card animate-fade-in" style={{
          position: 'fixed',
          bottom: '100px',
          right: '24px',
          width: '350px',
          height: '500px',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1000,
          padding: 0,
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{ background: 'var(--primary)', color: 'white', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Bot size={24} />
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>{t.chatTitle}</h3>
              <p style={{ fontSize: '12px', margin: 0, opacity: 0.9 }}>{t.chatDisclaimer}</p>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', background: 'var(--bg-color)', opacity: 0.95 }}>
            {messages.length === 0 && (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px', marginTop: '20px' }}>
                <AlertCircle size={24} style={{ margin: '0 auto 8px', color: 'var(--accent-teal)' }} />
                Ask me anything about menstrual health.
              </div>
            )}
            {messages.map((msg, idx) => (
              <div key={idx} style={{
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                maxWidth: '85%'
              }}>
                <div style={{
                  background: msg.role === 'user' ? 'var(--primary)' : 'var(--card-bg)',
                  color: msg.role === 'user' ? 'white' : 'var(--text-main)',
                  padding: '10px 14px',
                  borderRadius: '16px',
                  borderBottomRightRadius: msg.role === 'user' ? '4px' : '16px',
                  borderBottomLeftRadius: msg.role === 'bot' ? '4px' : '16px',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                  fontSize: '14px',
                  lineHeight: '1.4',
                  border: msg.role === 'bot' ? '1px solid var(--border-color)' : 'none'
                }}>
                  {msg.text}
                </div>
                {msg.role === 'bot' && (
                  <button 
                    onClick={() => handleSpeak(msg.text)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', alignSelf: 'flex-start', padding: '2px' }}
                  >
                    <Volume2 size={12} />
                  </button>
                )}
              </div>
            ))}
            {isLoading && (
              <div style={{ alignSelf: 'flex-start', background: 'var(--card-bg)', color: 'var(--text-main)', padding: '10px 14px', borderRadius: '16px', fontSize: '14px', border: '1px solid var(--border-color)' }}>
                Typing...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} style={{ padding: '12px', background: 'var(--card-bg)', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '8px' }}>
            <input 
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={t.typeMessage}
              style={{ flex: 1, padding: '10px 14px', borderRadius: '20px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-main)', outline: 'none' }}
            />
            <button type="submit" disabled={isLoading} style={{
              background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
            }}>
              <Send size={18} style={{ marginLeft: '-2px' }} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
