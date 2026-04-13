import React, { useState, useCallback } from 'react';
import { useVenue } from '../context/VenueContext';
import { trackBroadcast } from '../services/analyticsService';
import { Send, CheckCircle, Radio } from 'lucide-react';
import { cn, sanitize } from '../lib/utils';

/**
 * HostAlerts component: Dedicated interface for system-wide communications.
 * Allows managers to push warnings/info to all active user sessions.
 */
export default function HostAlerts() {
  const { setAlerts } = useVenue();
  const [broadcastText, setBroadcastText] = useState('');
  const [showToast, setShowToast] = useState(false);

  /**
   * Dispatches the alert to the global VenueContext
   */
  const handleTrigger = useCallback(() => {
    const cleanText = sanitize(broadcastText.trim());
    if(!cleanText) return;

    setAlerts(prev => [
      { id: Math.random().toString(36).substr(2, 9), type: 'warn', text: cleanText }, 
      ...prev
    ]);
    
    trackBroadcast(cleanText);
    setBroadcastText('');
    setShowToast(true); 
    setTimeout(() => setShowToast(false), 3000);
  }, [broadcastText, setAlerts]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-8" role="region" aria-label="Broadcast Alerts Control">
      <header className="mb-2">
        <h1 className="text-2xl font-black text-white flex items-center gap-3 tracking-tight">
          Emergency Comms <Radio size={20} className="text-[var(--color-status-red)] animate-pulse" />
        </h1>
        <p className="text-slate-400 text-sm font-medium">Force system-wide push notifications to all connected displays.</p>
      </header>

      {/* Broadcast Input Card */}
      <div 
        className="bg-[var(--color-navy-card)] border border-[var(--color-navy-border)] rounded-[2rem] p-8 space-y-6 shadow-2xl relative overflow-hidden"
        aria-labelledby="broadcast-label"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-status-red)]/5 rounded-full -mr-10 -mt-10 blur-3xl"></div>
        
        <div className="space-y-4 relative z-10">
           <label id="broadcast-label" htmlFor="alert-text" className="block text-[10px] font-black text-[var(--color-status-amber)] uppercase tracking-[0.25em] px-1 flex items-center gap-2">
            <Send size={14}/> Primary Alert Channel
           </label>
           <textarea 
             id="alert-text"
             value={broadcastText}
             onChange={(e)=>setBroadcastText(e.target.value)}
             className="w-full bg-[#08111a] border border-[var(--color-navy-border)] rounded-2xl p-5 text-white placeholder-slate-600 focus:outline-none focus:border-[var(--color-status-amber)] focus:ring-4 focus:ring-[var(--color-status-amber)]/5 transition-all shadow-inner font-medium min-h-[160px]"
             placeholder="E.g. Crowd congestion at Gate 3. Please direct attendees to Gate 6. Medical staff stand by."
             aria-describedby="broadcast-hint"
           />
           <p id="broadcast-hint" className="text-[10px] text-slate-500 font-bold uppercase tracking-wider text-center">
            Warning: This will be visible to ALL active users immediately.
           </p>
        </div>

        <button 
          onClick={handleTrigger} 
          disabled={!broadcastText.trim()}
          className="w-full bg-[var(--color-status-amber)] disabled:opacity-30 disabled:grayscale text-[var(--color-navy-base)] font-black rounded-2xl py-4 hover:bg-yellow-500 active:scale-[0.98] transition-all shadow-xl shadow-yellow-900/10 flex items-center justify-center gap-2 relative overflow-hidden"
        >
          {showToast ? <CheckCircle size={20} className="animate-in zoom-in" /> : "TRANSMIT BROADCAST"}
        </button>
      </div>

       {/* Success Toast with ARIA live-region */}
       <div aria-live="polite" className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
        {showToast && (
          <div className="bg-[var(--color-status-green)] text-white px-8 py-4 rounded-2xl shadow-[0_0_30px_rgba(29,158,117,0.4)] font-black flex items-center gap-3 animate-in zoom-in duration-300">
            <CheckCircle size={20} />
            Alert Successfully Transmitted
          </div>
        )}
       </div>
    </div>
  );
}
