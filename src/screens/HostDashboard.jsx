import React, { useState } from 'react';
import { useVenue } from '../context/VenueContext';
import { ShieldAlert, AlertOctagon, Bell, Send, CheckCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) { return twMerge(clsx(inputs)); }

export default function HostDashboard() {
  const { gates, parking, alerts, setAlerts, helpRequests, resolveEmergency } = useVenue();
  const [txt, setTxt] = useState('');
  const [toast, setToast] = useState(false);
  
  const criticalGates = gates.filter(g => g.pct > 70).length;
  const criticalPark = parking.filter(p => p.pct > 90).length;

  const triggerBroadcast = () => {
    if(!txt.trim()) return;
    setAlerts(prev => [{ id: Math.random().toString(), type: 'warn', text: txt }, ...prev]);
    setTxt('');
    setToast(true); setTimeout(() => setToast(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <header>
         <h1 className="text-2xl font-black text-white flex items-center gap-2">
          Venue Command <ShieldAlert size={20} className="text-[var(--color-status-amber)]" />
         </h1>
         <p className="text-slate-400 text-sm">Stadium Operations Real-Time View</p>
      </header>

      <div className={cn("rounded-xl border p-5 shadow-lg", criticalGates > 0 || criticalPark > 0 || helpRequests.length > 0 ? "bg-[var(--color-status-red)]/10 border-[var(--color-status-red)] text-[var(--color-status-red)]" : "bg-[var(--color-status-green)]/10 border-[var(--color-status-green)] text-[var(--color-status-green)]")}>
        <div className="flex justify-between items-center">
          <span className="font-bold text-lg">{criticalGates > 0 || criticalPark > 0 || helpRequests.length > 0 ? 'SYSTEM STRESSED' : 'SYSTEM OPTIMAL'}</span>
          <AlertOctagon size={24} />
        </div>
        <p className="text-sm mt-1 opacity-80">
          {criticalGates} Gates at capacity. {helpRequests.length} Active SOS Requests.
        </p>
      </div>

      {helpRequests.length > 0 && (
        <section className="bg-[var(--color-status-red)]/10 border border-[var(--color-status-red)] rounded-xl p-4">
          <h3 className="text-xs font-bold text-[var(--color-status-red)] uppercase mb-3">Live Attendee Emergencies</h3>
          <div className="space-y-3">
             {helpRequests.map(req => (
               <div key={req.id} className="bg-[var(--color-navy-card)] border border-[var(--color-navy-border)] rounded-lg p-3 flex justify-between items-center animate-in slide-in-from-left-2">
                 <div>
                   <h4 className="font-bold text-slate-100 flex items-center gap-2">
                     {req.type} <span className="text-[10px] bg-[var(--color-status-red)] text-white px-2 py-0.5 rounded-full uppercase">{req.timestamp}</span>
                   </h4>
                   <p className="text-xs text-slate-400 mt-1">{req.location}</p>
                   {req.details && <p className="text-xs text-slate-300 italic mt-1">"{req.details}"</p>}
                 </div>
                 <button onClick={() => resolveEmergency(req.id)} className="w-10 h-10 rounded-lg bg-[var(--color-status-green)] flex items-center justify-center text-white shrink-0 hover:bg-green-600 transition">
                   <CheckCircle size={20} />
                 </button>
               </div>
             ))}
          </div>
        </section>
      )}

      <div className="bg-[var(--color-navy-card)] border border-[var(--color-navy-border)] rounded-xl p-5 shadow-sm">
        <h3 className="block text-xs font-bold text-[var(--color-status-amber)] uppercase mb-3 flex items-center gap-2"><Send size={14}/> Dispatch PA Alert</h3>
        <textarea 
          value={txt}
          onChange={(e)=>setTxt(e.target.value)}
          className="w-full bg-[#0D1B2A] border border-[var(--color-navy-border)] rounded-lg p-3 text-white focus:outline-none focus:border-[var(--color-status-amber)] mb-3"
          placeholder="E.g. Evacuate Gate 3 immediately."
          rows={3}
        />
        <button onClick={triggerBroadcast} className="w-full bg-[var(--color-status-amber)] text-[#0D1B2A] font-black rounded-lg py-3 hover:bg-yellow-500 transition relative">
          {toast ? "SENT!" : "BROADCAST TO STADIUM"}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[var(--color-navy-card)] border border-[var(--color-navy-border)] rounded-xl p-4">
          <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wide">Gates Load</h3>
          <p className="text-2xl font-black text-white mt-1">{Math.round(gates.reduce((s, g) => s+g.pct, 0)/gates.length)}%</p>
        </div>
        <div className="bg-[var(--color-navy-card)] border border-[var(--color-navy-border)] rounded-xl p-4">
          <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wide">Parking Load</h3>
          <p className="text-2xl font-black text-white mt-1">{Math.round(parking.reduce((s, p) => s+p.pct, 0)/parking.length)}%</p>
        </div>
      </div>
    </div>
  );
}
