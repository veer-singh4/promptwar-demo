import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Ticket, ChevronRight } from 'lucide-react';
import { useNavigate, Navigate } from 'react-router-dom';
import { cn } from '../lib/utils';

/**
 * Login component for secure entry into the VenueIQ system.
 * Handles role-based entry for Fans and Staff.
 */
export default function Login() {
  const { login, role } = useAuth();
  const [ticketId, setTicketId] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  // Redirect if already logged in
  if (role) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (ticketId.trim()) {
      login(ticketId);
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#0D1B2A] text-slate-50 relative overflow-hidden" role="main">
      {/* Dynamic Background Elements */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-[var(--color-accent-blue)] opacity-10 rounded-full blur-[120px] mix-blend-screen animate-pulse"></div>
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[var(--color-status-amber)] opacity-5 rounded-full blur-[100px] mix-blend-screen animate-pulse [animation-delay:1s]"></div>
      
      <div className="w-full max-w-sm space-y-12 relative z-10">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-[var(--color-accent-blue)] rounded-3xl mx-auto flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(30,144,255,0.3)] animate-in zoom-in duration-700">
            <ShieldAlert size={40} className="text-white" />
          </div>
          <div className="space-y-1">
            <h1 className="text-5xl font-black tracking-tighter text-white">VenueIQ</h1>
            <p className="text-slate-400 font-medium tracking-wide">INTELLIGENT EVENT EXPERIENCE</p>
          </div>
        </div>

        <form 
          onSubmit={handleSubmit} 
          className="bg-[var(--color-navy-card)]/50 backdrop-blur-md border border-[var(--color-navy-border)] p-8 rounded-[2rem] shadow-2xl space-y-6 animate-in slide-in-from-bottom-4 duration-500"
          aria-labelledby="login-header"
        >
          <h2 id="login-header" className="sr-only">Sign In</h2>
          <div>
            <label htmlFor="ticket-id" className="block text-[10px] font-black text-slate-500 mb-3 uppercase tracking-[0.2em] px-1">Registration ID / Ticket</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-[var(--color-accent-blue)]">
                <Ticket className="h-5 w-5 text-slate-500 transition-colors" />
              </div>
              <input 
                id="ticket-id"
                type="text" 
                autoComplete="off"
                value={ticketId} 
                onChange={e => setTicketId(e.target.value)}
                className="w-full bg-[#08111a]/80 border border-[var(--color-navy-border)] rounded-2xl pl-12 pr-4 py-4 text-white placeholder-slate-600 focus:outline-none focus:border-[var(--color-accent-blue)] focus:ring-4 focus:ring-[var(--color-accent-blue)]/10 transition-all font-medium"
                placeholder="TX-4112 or HostAdmin"
                required
                aria-required="true"
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="w-full bg-[var(--color-accent-blue)] hover:bg-blue-600 active:scale-[0.98] text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-blue-900/20 flex items-center justify-center gap-2 group overflow-hidden relative"
          >
            <span className="relative z-10">ENTER VENUE</span>
            <ChevronRight size={20} className={cn("relative z-10 transition-transform duration-300", isHovered ? "translate-x-1" : "")} />
            <div className={cn("absolute inset-0 bg-white/10 transition-transform duration-500 -translate-x-full", isHovered ? "translate-x-0" : "")}></div>
          </button>
        </form>
        
        {/* Support Context Bubble */}
        <div 
          className="text-center bg-[#0D1B2A]/50 backdrop-blur-sm p-5 rounded-2xl border border-[var(--color-navy-border)] animate-in fade-in duration-1000 delay-500"
          role="complementary"
        >
          <p className="text-xs text-slate-500 font-medium">
            <span className="text-[var(--color-status-amber)] font-bold">MATCH DAY TIP:</span> Use <code className="text-slate-300 bg-slate-800 px-1.5 py-0.5 rounded">TX-123</code> for Attendee 
            experience or <code className="text-slate-300 bg-slate-800 px-1.5 py-0.5 rounded ml-1">HostAdmin</code> for Command center.
          </p>
        </div>
      </div>
    </div>
  );
}
