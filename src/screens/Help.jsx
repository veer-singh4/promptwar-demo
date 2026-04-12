import React, { useState } from 'react';
import { useVenue } from '../context/VenueContext';
import { AlertOctagon, UserMinus, BadgeInfo, ShieldAlert, Send, Check } from 'lucide-react';
import { cn } from '../components/MobileLayout';

export default function Help() {
  const { raiseEmergency } = useVenue();
  const [sosActive, setSosActive] = useState(false);
  const [issueText, setIssueText] = useState('');
  const [seatNum, setSeatNum] = useState('');
  const [reportSuccess, setReportSuccess] = useState(false);

  const handleSos = (type) => { 
    if(!seatNum.trim()) {
      alert("Please enter your seat block first so staff can locate you.");
      return;
    }
    raiseEmergency(type, `Seat Block: ${seatNum}`, "Immediate assistance requested.");
    setSosActive(true); 
    setTimeout(() => setSosActive(false), 5000); 
  };

  const submitReport = () => { 
    if(issueText.trim() && seatNum.trim()) { 
      raiseEmergency('Security Issue', `Seat: ${seatNum}`, issueText);
      setReportSuccess(true); 
      setIssueText(''); 
      setTimeout(() => setReportSuccess(false), 3000); 
    } else {
      alert("Please provide both your seat block and an issue description.");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-8">
      <header className="mb-4">
        <h1 className="text-2xl font-bold text-slate-100">Assistance</h1>
        <p className="text-slate-400 text-sm">Need help? We're on it.</p>
      </header>

      {/* Seat Location Identifier */}
      <div className="bg-[var(--color-navy-card)] border border-[var(--color-accent-blue)] rounded-xl p-4 shadow-sm mb-4">
        <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase">Your Current Location</label>
        <input 
          type="text" 
          value={seatNum} 
          onChange={(e) => setSeatNum(e.target.value)} 
          className="w-full bg-[#0D1B2A] border border-[var(--color-navy-border)] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-accent-blue)] transition" 
          placeholder="Enter Seat (e.g. Block 112, Row F)" 
        />
      </div>

      {sosActive && (
        <div className="bg-[var(--color-status-red)] text-white p-4 rounded-xl font-bold mb-4 animate-in fade-in zoom-in duration-300 flex items-center gap-3 shadow-[0_0_20px_rgba(226,75,74,0.3)]">
          <ShieldAlert size={28} className="animate-pulse" />
          <div><p className="text-lg">Staff Alerted</p><p className="text-sm font-normal opacity-90">Help is on the way to {seatNum}.</p></div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <button onClick={() => handleSos('Medical SOS')} className="bg-[var(--color-navy-card)] border border-[var(--color-status-red)] rounded-xl p-5 flex flex-col items-center justify-center gap-3 transition-transform active:scale-95 shadow-sm relative overflow-hidden min-h-[120px]">
          <div className="absolute inset-0 bg-[var(--color-status-red)] opacity-10"></div>
          <AlertOctagon size={36} className="text-[var(--color-status-red)] relative z-10" />
          <span className="font-bold text-white text-center relative z-10 leading-tight">Medical<br/>SOS</span>
        </button>
        <button onClick={() => handleSos('Lost Child')} className="bg-[var(--color-navy-card)] border border-[var(--color-status-amber)] rounded-xl p-5 flex flex-col items-center justify-center gap-3 transition-transform active:scale-95 shadow-sm relative overflow-hidden min-h-[120px]">
          <div className="absolute inset-0 bg-[var(--color-status-amber)] opacity-10"></div>
          <UserMinus size={36} className="text-[var(--color-status-amber)] relative z-10" />
          <span className="font-bold text-white text-center relative z-10 leading-tight">Lost<br/>Child</span>
        </button>
        <button onClick={() => handleSos('Access Need')} className="bg-[var(--color-navy-card)] border border-[var(--color-accent-blue)] rounded-xl p-5 flex flex-col items-center justify-center gap-3 transition-transform active:scale-95 shadow-sm relative overflow-hidden min-h-[120px]">
          <div className="absolute inset-0 bg-[var(--color-accent-blue)] opacity-10"></div>
          <BadgeInfo size={36} className="text-[var(--color-accent-blue)] relative z-10" />
          <span className="font-bold text-white text-center relative z-10 leading-tight">Access<br/>Need</span>
        </button>
        <button onClick={() => handleSos('Security Issue')} className="bg-[var(--color-navy-card)] border border-[var(--color-navy-border)] rounded-xl p-5 flex flex-col items-center justify-center gap-3 transition-transform active:scale-95 shadow-sm min-h-[120px]">
          <ShieldAlert size={36} className="text-slate-400" />
          <span className="font-bold text-white text-center leading-tight">Security<br/>Issue</span>
        </button>
      </div>

      <div className="bg-[var(--color-navy-card)] border border-[var(--color-navy-border)] rounded-xl p-5 mt-6 shadow-sm">
        <h3 className="font-bold text-white mb-1">Report Generaly</h3>
        <div className="flex gap-3">
           <input type="text" value={issueText} onChange={(e) => setIssueText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && submitReport()} className="flex-1 bg-[#0D1B2A] border border-[var(--color-navy-border)] rounded-lg px-4 text-white text-sm focus:border-[var(--color-accent-blue)] outline-none min-h-[44px]" placeholder="E.g. Large spill in aisle" />
           <button onClick={submitReport} className={cn("px-4 rounded-lg flex items-center justify-center min-h-[44px] transition-colors text-white", reportSuccess ? "bg-[var(--color-status-green)]" : "bg-[var(--color-accent-blue)]")}>{reportSuccess ? <Check size={20} /> : <Send size={20} />}</button>
        </div>
      </div>
    </div>
  );
}
