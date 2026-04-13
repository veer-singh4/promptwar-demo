import React, { useState, useCallback } from 'react';
import { useVenue } from '../context/VenueContext';
import { trackEmergency } from '../services/analyticsService';
import { AlertOctagon, UserMinus, BadgeInfo, ShieldAlert, Send, Check, MapPin } from 'lucide-react';
import { cn, sanitize } from '../lib/utils';

/**
 * Help component allows attendees to report emergencies or request assistance.
 * Includes Medical SOS, Lost Child, and general security reporting.
 */
export default function Help() {
  const { raiseEmergency } = useVenue();
  const [sosActive, setSosActive] = useState(false);
  const [issueText, setIssueText] = useState('');
  const [seatNum, setSeatNum] = useState('');
  const [reportSuccess, setReportSuccess] = useState(false);

  /**
   * Triggers an high-priority emergency alert
   */
  const handleSos = useCallback((type) => { 
    if(!seatNum.trim()) {
      alert("Please enter your location indicator (Seat/Block) so staff can find you.");
      return;
    }
    
    const wasRaised = raiseEmergency(type, `Location: ${seatNum}`, "Urgent response requested via SOS interface.");
    
    if (wasRaised) {
      setSosActive(true); 
      trackEmergency(type, seatNum);
      setTimeout(() => setSosActive(false), 5000);
    }
  }, [seatNum, raiseEmergency]);

  /**
   * Submits a general report
   */
  const submitReport = useCallback(() => { 
    const cleanText = sanitize(issueText.trim());
    const cleanSeat = sanitize(seatNum.trim());

    if(cleanText && cleanSeat) { 
      raiseEmergency('Security Report', `Seat: ${cleanSeat}`, cleanText);
      trackEmergency('General Report', cleanSeat);
      setReportSuccess(true); 
      setIssueText(''); 
      setTimeout(() => setReportSuccess(false), 3000); 
    } else {
      alert("Please provide both your location (Seat/Block) and a description of the issue.");
    }
  }, [issueText, seatNum, raiseEmergency]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-8" role="region" aria-label="Assistance and SOS Center">
      <header className="mb-4">
        <h1 className="text-2xl font-black text-white tracking-tight">Assistance Center</h1>
        <p className="text-slate-400 text-sm">Immediate help is available 24/7 during events.</p>
      </header>

      {/* Location Input Group */}
      <div 
        className="bg-[var(--color-navy-card)] border border-[var(--color-accent-blue)]/50 rounded-2xl p-5 shadow-xl shadow-blue-900/10"
        aria-labelledby="location-label"
      >
        <div className="flex items-center gap-2 mb-3">
          <MapPin size={14} className="text-[var(--color-accent-blue)]" />
          <label id="location-label" htmlFor="seat-input" className="block text-[10px] font-black text-slate-300 uppercase tracking-widest">Your Current Position</label>
        </div>
        <input 
          id="seat-input"
          type="text" 
          value={seatNum} 
          onChange={(e) => setSeatNum(e.target.value)} 
          className="w-full bg-[#08111a] border border-[var(--color-navy-border)] rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-[var(--color-accent-blue)] focus:ring-4 focus:ring-[var(--color-accent-blue)]/10 transition-all font-medium" 
          placeholder="Block #, Row #, Seat # (e.g. 112-F-12)" 
          aria-required="true"
        />
      </div>

      {/* SOS Active Overlay (ARIA Live Region) */}
      <div aria-live="assertive" className="empty:hidden">
        {sosActive && (
          <div 
            className="bg-[var(--color-status-red)] text-white p-5 rounded-2xl font-bold mb-4 animate-in zoom-in duration-300 flex items-center gap-4 shadow-[0_0_40px_rgba(226,75,74,0.4)] ring-4 ring-white/10"
            role="alert"
          >
            <ShieldAlert size={32} className="animate-pulse shrink-0" />
            <div>
              <p className="text-lg leading-none mb-1">Response Triggered</p>
              <p className="text-xs font-medium opacity-90">Medical/Security staff dispatched to your location.</p>
            </div>
          </div>
        )}
      </div>

      {/* SOS Action Grid */}
      <div className="grid grid-cols-2 gap-4" role="group" aria-label="One-tap emergency buttons">
        <button 
          onClick={() => handleSos('Medical SOS')} 
          className="bg-[var(--color-navy-card)] border border-[var(--color-status-red)]/30 hover:border-[var(--color-status-red)] rounded-2xl p-6 flex flex-col items-center justify-center gap-4 transition-all active:scale-95 shadow-lg relative overflow-hidden min-h-[140px] group"
          aria-label="Trigger Medical Emergency SOS"
        >
          <div className="absolute inset-0 bg-[var(--color-status-red)] opacity-5 group-hover:opacity-10 transition-opacity"></div>
          <AlertOctagon size={40} className="text-[var(--color-status-red)] relative z-10 transition-transform group-hover:scale-110" />
          <span className="font-black text-white text-center relative z-10 text-xs tracking-widest uppercase">Medical<br/>SOS</span>
        </button>

        <button 
          onClick={() => handleSos('Lost Child')} 
          className="bg-[var(--color-navy-card)] border border-[var(--color-status-amber)]/30 hover:border-[var(--color-status-amber)] rounded-2xl p-6 flex flex-col items-center justify-center gap-4 transition-all active:scale-95 shadow-lg relative overflow-hidden min-h-[140px] group"
          aria-label="Report Lost Child"
        >
          <div className="absolute inset-0 bg-[var(--color-status-amber)] opacity-5 group-hover:opacity-10 transition-opacity"></div>
          <UserMinus size={40} className="text-[var(--color-status-amber)] relative z-10 transition-transform group-hover:scale-110" />
          <span className="font-black text-white text-center relative z-10 text-xs tracking-widest uppercase">Lost<br/>Child</span>
        </button>

        <button 
          onClick={() => handleSos('Access Need')} 
          className="bg-[var(--color-navy-card)] border border-[var(--color-accent-blue)]/30 hover:border-[var(--color-accent-blue)] rounded-2xl p-6 flex flex-col items-center justify-center gap-4 transition-all active:scale-95 shadow-lg relative overflow-hidden min-h-[140px] group"
          aria-label="Request Accessibility Assistance"
        >
          <div className="absolute inset-0 bg-[var(--color-accent-blue)] opacity-5 group-hover:opacity-10 transition-opacity"></div>
          <BadgeInfo size={40} className="text-[var(--color-accent-blue)] relative z-10 transition-transform group-hover:scale-110" />
          <span className="font-black text-white text-center relative z-10 text-xs tracking-widest uppercase">Access<br/>Need</span>
        </button>

        <button 
          onClick={() => handleSos('Security Issue')} 
          className="bg-[var(--color-navy-card)] border border-[var(--color-navy-border)] hover:border-slate-600 rounded-2xl p-6 flex flex-col items-center justify-center gap-4 transition-all active:scale-95 shadow-lg min-h-[140px] group"
          aria-label="Report Security Incident"
        >
          <ShieldAlert size={40} className="text-slate-500 relative z-10 transition-transform group-hover:scale-110" />
          <span className="font-black text-white text-center relative z-10 text-xs tracking-widest uppercase">Security<br/>Issue</span>
        </button>
      </div>

      {/* General Report Input Group */}
      <div 
        className="bg-[var(--color-navy-card)] border border-[var(--color-navy-border)] rounded-2xl p-6 mt-4 shadow-lg focus-within:border-slate-500 transition-colors"
        aria-labelledby="report-header"
      >
        <h3 id="report-header" className="text-xs font-black text-white uppercase tracking-widest mb-4">Detailed Issue Report</h3>
        <div className="flex gap-3">
           <input 
             id="issue-description"
             type="text" 
             value={issueText} 
             onChange={(e) => setIssueText(e.target.value)} 
             onKeyDown={(e) => e.key === 'Enter' && submitReport()} 
             className="flex-1 bg-[#08111a] border border-[var(--color-navy-border)] rounded-xl px-4 py-3 text-white text-sm focus:border-[var(--color-accent-blue)] focus:outline-none transition-all" 
             placeholder="E.g. Large spill in aisle 4" 
             aria-label="Issue description"
           />
           <button 
             onClick={submitReport} 
             className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center transition-all shadow-lg active:scale-90", 
              reportSuccess ? "bg-[var(--color-status-green)] text-white" : "bg-[var(--color-accent-blue)] text-white hover:bg-blue-600"
             )}
             aria-label="Submit report"
           >
             {reportSuccess ? <Check size={22} className="animate-in zoom-in" /> : <Send size={20} />}
           </button>
        </div>
      </div>
    </div>
  );
}
