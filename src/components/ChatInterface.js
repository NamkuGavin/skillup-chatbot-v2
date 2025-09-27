import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, BarChart3, MessageCircle, Rocket, Menu, X } from 'lucide-react';

export default function ChatInterface() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      content: "Halo! Saya SkillUp, asisten AI untuk pengembangan karir Anda. Bagaimana saya bisa membantu Anda hari ini?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [context, setContext] = useState({
    targetJob: "",
    experienceLevel: "mid",
    currentFeature: "general",
  });
  
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const assistantMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: "Terima kasih atas pertanyaan Anda! Sebagai SkillUp AI, saya siap membantu Anda dalam pengembangan karir. Silakan gunakan menu di sidebar untuk mengakses fitur-fitur khusus seperti analisis skill, latihan wawancara, dan tips karir.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: "Maaf, terjadi error. Silakan coba lagi.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickAction = (action) => {
    const quickMessages = {
      skill_analysis: "Saya ingin analisis skill untuk karir di bidang technology",
      interview_practice: "Saya ingin latihan wawancara kerja", 
      career_tips: "Berikan tips pengembangan karir untuk pemula",
    };
    
    setContext(prev => ({ ...prev, currentFeature: action }));
    setInput(quickMessages[action] || action);
    setIsSidebarOpen(false); // Close sidebar after selecting
  };

  const updateContext = (newContext) => {
    setContext(prev => ({ ...prev, ...newContext }));
  };

  const isEmpty = messages.length === 1;

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      
      {/* Mobile & Desktop Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Now hidden by default on all screen sizes */}
      <div className={`
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        fixed
        z-50
        w-80 h-full
        transition-transform duration-300 ease-in-out
        bg-white shadow-xl
        flex flex-col
      `}>
        <Sidebar 
          context={context}
          onContextUpdate={updateContext}
          onQuickAction={handleQuickAction}
          onClose={() => setIsSidebarOpen(false)}
        />
      </div>

      {/* Main Chat Area - Now takes full width */}
      <div className="flex-1 flex flex-col min-w-0 w-full">
        
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200 px-4 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button 
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-semibold text-gray-800">SkillUp Career Assistant</h1>
              <p className="text-sm text-gray-600">
                {context.targetJob && `Target: ${context.targetJob} • `}
                Level: {context.experienceLevel === 'entry' ? 'Pemula' : context.experienceLevel === 'mid' ? 'Menengah' : 'Senior'}
              </p>
            </div>
          </div>
          <div className="text-sm text-gray-500 hidden sm:block">AI Assistant</div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-[85%] sm:max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.role === 'user' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white'
                }`}>
                  {message.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                
                {/* Message Content */}
                <div className={`rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white shadow-sm border border-gray-100'
                }`}>
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.content}
                  </div>
                  <div className={`text-xs mt-2 ${
                    message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString('id-ID', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white shadow-sm border border-gray-100 rounded-2xl px-4 py-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white/90 backdrop-blur-sm border-t border-gray-200 p-4 shrink-0">
          {/* Quick Actions - Only show when conversation is empty */}
          {isEmpty && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2 justify-center">
                <button
                  onClick={() => handleQuickAction('skill_analysis')}
                  className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full text-sm font-medium transition-colors"
                >
                  📊 Analisis Skill Tech
                </button>
                <button
                  onClick={() => handleQuickAction('interview_practice')}
                  className="px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-full text-sm font-medium transition-colors"
                >
                  💼 Latihan Wawancara
                </button>
                <button
                  onClick={() => handleQuickAction('career_tips')}
                  className="px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-full text-sm font-medium transition-colors"
                >
                  🚀 Tips Karir Pemula
                </button>
              </div>
            </div>
          )}

          {/* Input Form */}
          <div className="flex gap-3 items-end max-w-4xl mx-auto">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  // Auto resize
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                }}
                onKeyDown={handleKeyDown}
                placeholder="Tanya tentang pengembangan karir, atau latihan wawancara..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none min-h-[50px] max-h-[120px] transition-all"
                rows={1}
                disabled={isLoading}
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sidebar Component
function Sidebar({ context, onContextUpdate, onQuickAction, onClose }) {
  const [localContext, setLocalContext] = useState({
    targetJob: context.targetJob || "",
    experienceLevel: context.experienceLevel || "mid",
  });

  const features = [
    {
      id: "skill_analysis",
      title: "Analisis Skill", 
      description: "Analisis kemampuan yang dibutuhkan untuk karir Anda",
      icon: <BarChart3 className="w-5 h-5" />,
    },
    {
      id: "interview_practice",
      title: "Latihan Wawancara",
      description: "Simulasi wawancara dengan AI recruiter", 
      icon: <MessageCircle className="w-5 h-5" />,
    },
    {
      id: "career_tips",
      title: "Tips Karir",
      description: "Saran pengembangan karir dan skill",
      icon: <Rocket className="w-5 h-5" />,
    },
  ];

  const handleContextUpdate = () => {
    onContextUpdate(localContext);
  };

  return (
    <>
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-xl font-bold">SkillUp AI</h1>
          <button 
            className="p-1 hover:bg-white/20 rounded transition-colors"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-blue-100 text-sm">Asisten Pengembangan Karir</p>
      </div>

      {/* Features */}
      <div className="p-4 space-y-3 flex-1 overflow-y-auto">
        <h3 className="font-semibold text-gray-800 mb-3">Fitur Utama</h3>
        {features.map((feature) => (
          <button
            key={feature.id}
            className={`w-full p-3 rounded-lg border transition-all text-left ${
              context.currentFeature === feature.id
                ? 'border-blue-500 bg-blue-50 shadow-sm'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => {
              onContextUpdate({ currentFeature: feature.id });
              onQuickAction(feature.id);
            }}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${
                context.currentFeature === feature.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {feature.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-800">{feature.title}</div>
                <div className="text-xs text-gray-600 mt-1 leading-relaxed">{feature.description}</div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Context Settings */}
      <div className="p-4 border-t border-gray-200">
        <h3 className="font-semibold text-gray-800 mb-3">Setting Karir Anda</h3>
        
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Posisi/Industri target (contoh: Software Engineer)"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            value={localContext.targetJob}
            onChange={(e) =>
              setLocalContext(prev => ({ ...prev, targetJob: e.target.value }))
            }
          />

          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            value={localContext.experienceLevel}
            onChange={(e) =>
              setLocalContext(prev => ({ ...prev, experienceLevel: e.target.value }))
            }
          >
            <option value="entry">Pemula (0-2 tahun)</option>
            <option value="mid">Menengah (2-5 tahun)</option>
            <option value="senior">Senior (5+ tahun)</option>
          </select>

          <button
            className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors text-sm"
            onClick={handleContextUpdate}
          >
            Update Setting
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 text-center text-xs text-gray-500 border-t border-gray-200">
        Powered by Gemini v2.5<br/>
        SkillUp AI Career Assistant
      </div>
    </>
  );
}