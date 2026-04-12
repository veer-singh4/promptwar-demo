import React, { useState } from 'react';
import { useVenue } from '../context/VenueContext';
import { Send } from 'lucide-react';

export default function HostAlerts() {
  const { setAlerts } = useVenue();
  const [txt, setTxt] = useState('');
  const [toast, setToast] = useState(false);

  const trigger = () => {
    if(!txt.trim()) return;
    setAlerts(prev => [{ id: Math.random().toString(), type: 'warn', text: txt }, ...prev]);
    setTxt('');
    setToast(true); setTimeout(() => setToast(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <header>
        <h1 className="text-2xl font-bold text-slate-100">Broadcast Comms</h1>
        <p className="text-slate-400 text-sm">Force system-wide push messages to all UI clients.</p>
      </header>

      <div className="bg-[var(--color-navy-card)] border border-[var(--color-navy-border)] rounded-xl p-5 space-y-4">
        <div>
           <label className="block text-xs font-bold text-[var(--color-status-amber)] uppercase mb-2 flex items-center gap-2"><Send size={14}/> Dispatch PA Alert</label>
           <textarea 
             value={txt}
             onChange={(e)=>setTxt(e.target.value)}
             className="w-full bg-[#0D1B2A] border border-[var(--color-navy-border)] rounded-lg p-3 text-white focus:outline-none focus:border-[var(--color-status-amber)]"
             placeholder="E.g. Evacuate Gate 3 immediately."
             rows={3}
           />
        </div>
        <button onClick={trigger} className="w-full bg-[var(--color-status-amber)] text-[#0D1B2A] font-black rounded-lg py-3 hover:bg-yellow-500 transition">
          BROADCAST WORLD
        </button>
      </div>

       {toast && (
        <div className="bg-[var(--color-status-green)] text-[#0D1B2A] px-4 py-3 rounded-lg shadow-lg font-bold text-center animate-in zoom-in duration-200">
          Transmission Sent Successfully
        </div>
      )}
    </div>
  )
}
