import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Sparkles, X, Send, Bot, Phone } from 'lucide-react';
import { getGiftRecommendation } from '../services/geminiService';

export const FloatingFeatures: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAI, setShowAI] = useState(false);
  
  // AI Chat State
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', text: string}[]>([
    {role: 'assistant', text: 'Chào bạn! Tôi là Boxie 🌸. Đang tìm quà tặng cho crush hay bạn bè? Hỏi tôi đi!'}
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const toggleOpen = () => setIsOpen(!isOpen);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setMessages(prev => [...prev, {role: 'user', text: userMsg}]);
    setInput('');
    setLoading(true);

    try {
      const response = await getGiftRecommendation(userMsg);
      setMessages(prev => [...prev, {role: 'assistant', text: response}]);
    } catch (e) {
      setMessages(prev => [...prev, {role: 'assistant', text: "Ôi, tôi bị vấp! Thử lại nhé?"}]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, showAI]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      
      {/* AI Chat Window */}
      {showAI && (
        <div className="bg-white rounded-3xl shadow-2xl w-80 sm:w-96 border border-primary-100 overflow-hidden flex flex-col h-96 mb-2 animate-in slide-in-from-bottom-10 fade-in duration-300">
          <div className="bg-gradient-to-r from-primary-400 to-primary-500 p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="bg-white/20 p-1.5 rounded-full">
                <Sparkles size={18} className="text-yellow-200" />
              </div>
              <span className="font-bold">Trợ lý AI Boxie</span>
            </div>
            <button onClick={() => setShowAI(false)} className="hover:bg-white/20 p-1 rounded-full"><X size={18} /></button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-primary-50/50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                  msg.role === 'user' 
                    ? 'bg-primary-500 text-white rounded-br-sm' 
                    : 'bg-white text-gray-700 shadow-sm border border-primary-100 rounded-bl-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
               <div className="flex justify-start">
                 <div className="bg-white text-gray-500 px-4 py-2 rounded-2xl text-xs flex gap-1 items-center shadow-sm">
                   <span className="animate-bounce">●</span>
                   <span className="animate-bounce delay-75">●</span>
                   <span className="animate-bounce delay-150">●</span>
                 </div>
               </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Hỏi ý tưởng quà tặng..."
              className="flex-1 bg-gray-50 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200"
            />
            <button 
              onClick={handleSendMessage}
              disabled={loading}
              className="bg-primary-500 text-white p-2 rounded-full hover:bg-primary-600 disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Expanded Menu */}
      {isOpen && !showAI && (
        <div className="flex flex-col gap-3 animate-in slide-in-from-bottom-4 fade-in duration-200">
          <button 
            onClick={() => setShowAI(true)}
            className="flex items-center gap-3 bg-white text-primary-600 px-4 py-3 rounded-full shadow-lg hover:bg-primary-50 border border-primary-100 font-medium transition-transform hover:scale-105"
          >
            <Sparkles size={20} />
            Hỏi trợ lý AI
          </button>
          <a
            href="https://www.facebook.com/profile.php?id=61581779467527"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 bg-blue-600 text-white px-4 py-3 rounded-full shadow-lg hover:bg-blue-700 font-medium transition-transform hover:scale-105"
          >
            <MessageCircle size={20} />
            Messenger
          </a>
        </div>
      )}

      {/* Main Toggle Button */}
      <button 
        onClick={toggleOpen}
        className={`p-4 rounded-full shadow-xl transition-all duration-300 transform hover:scale-110 ${
          isOpen ? 'bg-gray-200 text-gray-600 rotate-90' : 'bg-primary-500 text-white'
        }`}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </div>
  );
};
