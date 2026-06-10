import React, { useState, useEffect, useRef } from 'react';
import { Send, LogOut, Menu, X } from 'lucide-react';
import { callAI } from '../services/aiService';

export default function ChatScreen({ user, onLogout }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Load chat history
    const chatHistory = JSON.parse(localStorage.getItem(`chat_${user.id}`) || '[]');
    if (chatHistory.length === 0) {
      const initialMessage = {
        id: Date.now(),
        text: 'Olá! Bem-vindo ao NutriAI! 🎉\n\nSou sua nutricionista IA e estou aqui para ajudá-lo em sua jornada de emagrecimento. Vou criar um plano personalizado baseado em seus dados e objetivos.\n\nPara começar, preciso de algumas informações sobre você. Pode responder com calma!\n\nVamos começar?',
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };
      setMessages([initialMessage]);
    } else {
      setMessages(chatHistory);
    }
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(`chat_${user.id}`, JSON.stringify(messages));
  }, [messages, user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      text: input,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await callAI(input);
      const aiMessage = {
        id: Date.now() + 1,
        text: response,
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Desculpe, ocorreu um erro. Tente novamente.',
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-white">
      {/* Header - WhatsApp Style */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 flex items-center justify-between shadow-md">
        <div>
          <h1 className="text-xl font-bold">NutriAI</h1>
          <p className="text-xs text-blue-100">Nutricionista IA</p>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-blue-700 rounded-full transition"
          >
            {showMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          {showMenu && (
            <div className="absolute right-0 top-12 bg-white text-gray-900 rounded-lg shadow-xl border border-gray-200 z-50 min-w-48">
              <button
                onClick={() => {
                  onLogout();
                  setShowMenu(false);
                }}
                className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 w-full text-left font-semibold rounded-lg transition"
              >
                <LogOut className="w-5 h-5" />
                Sair
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Messages - WhatsApp Style */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                message.sender === 'user'
                  ? 'bg-blue-500 text-white rounded-br-none'
                  : 'bg-white text-gray-900 border border-gray-200 rounded-bl-none'
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                {message.text}
              </p>
              <p
                className={`text-xs mt-1 ${
                  message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}
              >
                {new Date(message.timestamp).toLocaleTimeString('pt-BR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-900 border border-gray-200 rounded-2xl rounded-bl-none px-4 py-2">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input - WhatsApp Style */}
      <div className="bg-white border-t border-gray-200 p-4 shadow-lg">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua mensagem..."
            disabled={loading}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:border-blue-500 focus:outline-none transition"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 transition disabled:opacity-50 flex items-center justify-center"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
