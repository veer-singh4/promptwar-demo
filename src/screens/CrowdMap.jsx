import React from 'react';
import { useVenue } from '../context/VenueContext';
import { useAuth } from '../context/AuthContext';
import { cn } from '../components/MobileLayout';

export default function CrowdMap() {
  const { gates, parking } = useVenue();
  const { role } = useAuth();
  
  const getStatusColor = (pct) => {
    if (pct > 70) return 'bg-[var(--color-status-red)] text-white';
    if (pct > 40) return 'bg-[var(--color-status-amber)] text-[#0D1B2A]';
    return 'bg-[var(--color-status-green)] text-[#0D1B2A]';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 flex flex-col h-full">
      <header>
        <h1 className="text-2xl font-bold text-slate-100">{role === 'HOST' ? 'Sys Overview Map' : 'Venue Live Map'}</h1>
        <p className="text-slate-400 text-sm">Zone capacities updating dynamically</p>
      </header>

      {/* Interactive Geometic schematic */}
      <div className="bg-[#0a121e] border-2 border-[var(--color-navy-border)] rounded-2xl p-4 aspect-square relative shadow-[inset_0_0_50px_rgba(0,0,0,0.5)] overflow-hidden shrink-0 mt-4">
        {/* Environment Grid Lines */}
        <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'linear-gradient(#1e3450 1px, transparent 1px), linear-gradient(90deg, #1e3450 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>

        {/* Central Pitch Wrapper */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-64 border-2 border-slate-700/50 rounded-full flex items-center justify-center bg-[#0D1B2A]/80 z-10 shadow-xl">
           <div className="w-32 h-48 bg-green-900/40 rounded-full border border-green-500/50 flex flex-col items-center justify-center">
             <span className="font-bold text-slate-400 tracking-[0.2em] transform -rotate-90 md:rotate-0">PITCH</span>
           </div>
        </div>

        {/* Render Live Gates */}
        {gates.map(g => (
          <div key={g.id} className={cn("absolute w-12 h-10 rounded-lg flex flex-col items-center justify-center z-20 shadow-lg text-xs font-bold border border-slate-900", g.pos, getStatusColor(g.pct))}>
            <span>{g.id}</span>
            <span className="text-[10px] opacity-90">{g.pct}%</span>
          </div>
        ))}

        {/* Render Live Parking */}
        {parking.map(p => (
           <div key={p.id} className={cn("absolute w-20 h-16 rounded-xl flex flex-col items-center justify-center z-10 border-2 border-dashed shadow-sm text-center", p.pos, getStatusColor(p.pct))}>
              <span className="text-[10px] font-bold uppercase">{p.id}</span>
              <span className="text-[12px] font-black">{p.pct}% full</span>
           </div>
        ))}
      </div>

      <div className="bg-[var(--color-navy-card)] border border-[var(--color-navy-border)] rounded-xl p-4 mt-auto">
        <h3 className="text-sm font-semibold text-slate-200 mb-2">Map Legend</h3>
        <div className="grid grid-cols-3 gap-2">
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[var(--color-status-green)]"></div><span className="text-xs text-slate-400">Clear &lt;40%</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[var(--color-status-amber)]"></div><span className="text-xs text-slate-400">Busy 41-70%</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[var(--color-status-red)]"></div><span className="text-xs text-slate-400">Avoid &gt;70%</span></div>
        </div>
      </div>
    </div>
  );
}
