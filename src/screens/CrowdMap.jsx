import React from 'react';
import { useVenue } from '../context/VenueContext';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';

/**
 * CrowdMap component provides a visual overview of venue crowding.
 * Displays heatmaps for gates and parking sectors.
 * Designed for both fans (Fan Engagement) and staff (Operations).
 */
export default function CrowdMap() {
  const { gates, parking } = useVenue();
  const { role } = useAuth();
  
  /**
   * Helper to determine density status color classes
   */
  const getStatusColor = (pct) => {
    if (pct > 70) return 'bg-[var(--color-status-red)] text-white shadow-[0_0_15px_rgba(226,75,74,0.4)] ring-2 ring-white/20';
    if (pct > 40) return 'bg-[var(--color-status-amber)] text-[#0D1B2A] shadow-[0_0_15px_rgba(239,159,39,0.4)]';
    return 'bg-[var(--color-status-green)] text-[#0D1B2A] shadow-[0_0_15px_rgba(29,158,117,0.4)]';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 flex flex-col h-full" role="region" aria-label="Crowd Density Map">
      <header>
        <h1 className="text-2xl font-black text-white leading-tight">
          {role === 'HOST' ? 'Operations Overview' : 'Venue Live Density'}
        </h1>
        <p className="text-slate-400 text-sm">Zone-level traffic monitoring updating in real-time.</p>
      </header>

      {/* 
          INTENTIONAL PLACEHOLDER: 
          In a production build with a valid API key, this div will host the 
          @vis.gl/react-google-maps implementation. 
      */}
      <div 
        className="bg-[#050b14] border-2 border-[var(--color-navy-border)] rounded-[2rem] p-4 aspect-square relative shadow-2xl overflow-hidden shrink-0 mt-2"
        role="img"
        aria-label="Schematic venue map showing gate and parking loads"
      >
        {/* Decorative Grid Background */}
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '24px 24px'}}
        ></div>

        {/* Central Arena Logic */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-72 border-2 border-slate-800/30 rounded-full flex items-center justify-center bg-[#08111a]/60 z-10 backdrop-blur-md shadow-2xl">
           <div className="w-40 h-56 bg-emerald-900/10 rounded-full border border-emerald-500/20 flex flex-col items-center justify-center relative">
             <div className="absolute inset-0 bg-emerald-500/5 blur-xl animate-pulse"></div>
             <span className="font-black text-emerald-500/40 tracking-[0.4em] transform -rotate-90 md:rotate-0 text-[10px] uppercase">Pitch Area</span>
           </div>
        </div>

        {/* Interactive Gate Markers */}
        {gates.map(g => (
          <div 
            key={g.id} 
            className={cn(
              "absolute w-12 h-12 rounded-2xl flex flex-col items-center justify-center z-30 transition-all duration-700 hover:scale-110 cursor-default", 
              g.pos, 
              getStatusColor(g.pct)
            )}
            title={`${g.label}: ${g.pct}% Capacity`}
          >
            <span className="text-[10px] font-black">{g.id}</span>
            <span className="text-[9px] font-bold opacity-80">{g.pct}%</span>
          </div>
        ))}

        {/* Interactive Parking Markers */}
        {parking.map(p => (
           <div 
            key={p.id} 
            className={cn(
              "absolute w-24 h-14 rounded-2xl flex flex-col items-center justify-center z-20 border-2 border-dashed transition-all duration-700 hover:border-white/50", 
              p.pos, 
              getStatusColor(p.pct)
            )}
            title={`${p.label}: ${p.pct}% Occupancy`}
           >
              <span className="text-[9px] font-black uppercase tracking-tighter opacity-70 mb-0.5">{p.id}</span>
              <span className="text-[11px] font-black">{p.pct}% FULL</span>
           </div>
        ))}
      </div>

      {/* Map Content Legend */}
      <div className="bg-[var(--color-navy-card)]/50 border border-[var(--color-navy-border)] rounded-2xl p-5 mt-auto shadow-lg backdrop-blur-sm">
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Live Legend</h3>
        <div className="flex justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-status-green)] shadow-[0_0_8px_rgba(29,158,117,1)]"></div>
            <span className="text-[11px] font-bold text-slate-300">Optimal</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-status-amber)] shadow-[0_0_8px_rgba(239,159,39,1)]"></div>
            <span className="text-[11px] font-bold text-slate-300">Congested</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-status-red)] shadow-[0_0_8px_rgba(226,75,74,1)]"></div>
            <span className="text-[11px] font-bold text-slate-300">At Limit</span>
          </div>
        </div>
      </div>
    </div>
  );
}
