import React, { useState, useRef, useEffect } from 'react';
import { useVenue } from '../context/VenueContext';
import { useAuth } from '../context/AuthContext';
import { askGemini, resetChat } from '../services/geminiService';
import { trackAIQuery } from '../services/analyticsService';
import { Send, Bot, User, Sparkles, Loader2, Trash2 } from 'lucide-react';
import { cn, sanitize } from '../lib/utils';

export default function Assistant() {
  const venueData = useVenue();
  const { role } = useAuth();
  const [messages, setMessages] = useState([
    { role: 'assistant', text: `Hello! I'm your VenueIQ Assistant. How can I help you have a great match day today?`, timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    
    // Add user message to state
    const newMessages = [...messages, { role: 'user', text: userMsg, timestamp: new Date() }];
    setMessages(newMessages);
    setLoading(true);

    try {
      // Pass the entire history (excluding current message which is added inside service or handled here)
      // Actually, passing the history before this turn is better.
      const response = await askGemini(userMsg, venueData, role, messages);
      setMessages(prev => [...prev, { role: 'assistant', text: response, timestamp: new Date() }]);
      trackAIQuery(userMsg.length, true);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', text: "I'm sorry, I'm having trouble processing that right now.", timestamp: new Date() }]);
      trackAIQuery(userMsg.length, false);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    resetChat();
    setMessages([{ role: 'assistant', text: `Chat cleared. How else can I help?`, timestamp: new Date() }]);
  };

  const suggestions = role === 'HOST' 
    ? ["Summarize system stress", "Draft emergency PA alert", "Identify bottlenecks"]
    : ["Fastest food right now?", "Which gate is clearest?", "Where is block 112?"];

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      <header className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--color-accent-blue)] flex items-center justify-center shadow-[0_0_15px_rgba(30,144,255,0.4)]">
            <Bot size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              AI Assistant <Sparkles size={16} className="text-[var(--color-status-amber)] animate-pulse" />
            </h1>
            <p className="text-xs text-slate-400">Context-Aware Match Day Intelligence</p>
          </div>
        </div>
        <button 
          onClick={clearChat}
          className="p-2 text-slate-500 hover:text-red-400 transition-colors"
          title="Clear Conversation"
          aria-label="Clear Conversation"
        >
          <Trash2 size={18} />
        </button>
      </header>

      {/* Chat History */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4 scrollbar-hide bg-[#08111a]/50 rounded-2xl p-4 border border-[var(--color-navy-border)] shadow-inner"
      >
        {messages.map((msg, idx) => (
          <div key={idx} className={cn("flex items-start gap-3 animate-in slide-in-from-bottom-2", msg.role === 'user' ? "flex-row-reverse" : "")}>
            <div className={cn(
              "p-2 rounded-lg shrink-0", 
              msg.role === 'user' ? "bg-[var(--color-navy-border)]" : "bg-[var(--color-accent-blue)]/20"
            )}>
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} className="text-[var(--color-accent-blue)]" />}
            </div>
            <div 
              className={cn(
                "max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm prose prose-invert prose-sm",
                msg.role === 'user' 
                  ? "bg-[var(--color-navy-card)] border border-[var(--color-navy-border)] text-slate-100 rounded-tr-none" 
                  : "bg-[var(--color-navy-border)]/40 text-slate-200 border border-slate-700/30 rounded-tl-none backdrop-blur-sm"
              )}
              dangerouslySetInnerHTML={{ __html: sanitize(msg.text) }}
            />
          </div>
        ))}
        {loading && (
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-[var(--color-accent-blue)]/20">
              <Loader2 size={16} className="text-[var(--color-accent-blue)] animate-spin" />
            </div>
            <div className="bg-[var(--color-navy-border)]/40 p-3 rounded-2xl rounded-tl-none border border-slate-700/30">
              <span className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Suggested Prompts */}
      <div className="flex gap-2 overflow-x-auto pb-3 -mx-2 px-2">
        {suggestions.map(s => (
          <button 
            key={s} 
            onClick={() => { setInput(s); }}
            className="whitespace-nowrap bg-[var(--color-navy-card)] hover:bg-[var(--color-navy-border)] border border-[var(--color-navy-border)] px-3 py-1.5 rounded-full text-[10px] font-medium text-slate-300 transition-colors"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="relative group">
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything about the venue..."
          className="w-full bg-[var(--color-navy-card)] border border-[var(--color-navy-border)] group-focus-within:border-[var(--color-accent-blue)] rounded-xl pl-4 pr-12 py-4 text-white text-sm outline-none transition-all shadow-lg"
        />
        <button 
          type="submit"
          disabled={!input.trim() || loading}
          className="absolute right-2 top-2 bottom-2 w-10 bg-[var(--color-accent-blue)] hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg flex items-center justify-center transition-all active:scale-95"
          aria-label="Send message"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
