import React, { useState } from 'react';
import { useVenue } from '../context/VenueContext';
import { useAuth } from '../context/AuthContext';
import { cn, sanitize } from '../lib/utils';
import { Info, Gauge, Timer, Users } from 'lucide-react';

export default function CrowdMap() {
  const { gates, parking } = useVenue();
  const { role } = useAuth();
  const [selected, setSelected] = useState(null);

  const getStatusColor = (pct) => {
    if (pct > 75) return 'text-red-500 fill-red-500 shadow-[0_0_10px_red]';
    if (pct > 40) return 'text-amber-500 fill-amber-500 shadow-[0_0_10px_orange]';
    return 'text-emerald-500 fill-emerald-500 shadow-[0_0_10px_green]';
  };

  const getStatusBg = (pct) => {
    if (pct > 75) return 'bg-red-500/20 border-red-500/50 text-red-400';
    if (pct > 40) return 'bg-amber-500/20 border-amber-500/50 text-amber-400';
    return 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400';
  };

  return (
    <div className="flex flex-col h-full space-y-6 animate-in fade-in duration-700 pb-10">
      <header className="flex flex-col space-y-1">
        <h1 className="text-2xl font-black text-white tracking-tight leading-none uppercase">
          {role === 'HOST' ? 'Operations Intelligence' : 'Live Stadium Vitals'}
        </h1>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Wembley Strategic Overlook // Live Data Stream</p>
      </header>

      {/* Bespoke SVG Stadium Map */}
      <div className="relative aspect-[4/3] w-full bg-[#08111a] rounded-[2rem] border border-[var(--color-navy-border)] shadow-2xl overflow-hidden group">
        <svg 
          viewBox="0 0 400 300" 
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-full p-4 transform group-hover:scale-105 transition-transform duration-1000"
        >
          {/* Outer Ring */}
          <ellipse cx="200" cy="150" rx="180" ry="120" fill="transparent" stroke="#1b263b" strokeWidth="2" strokeDasharray="4 4" />
          
          {/* Main Stadium Bowl */}
          <ellipse 
            cx="200" cy="150" rx="150" ry="100" 
            fill="#050b14" 
            stroke="#2c3e50" 
            strokeWidth="8" 
            className="shadow-2xl"
          />

          {/* Zones Overlay */}
          <path d="M100 150 Q100 80 200 80 T300 150" fill="none" stroke="#34495e" strokeWidth="1" strokeDasharray="2 4" />
          <path d="M100 150 Q100 220 200 220 T300 150" fill="none" stroke="#34495e" strokeWidth="1" strokeDasharray="2 4" />

          {/* Gate Markers Interactivity */}
          {gates.map((g, i) => {
            const angle = (i / gates.length) * Math.PI * 2;
            const x = 200 + 150 * Math.cos(angle);
            const y = 150 + 100 * Math.sin(angle);
            const colorClass = getStatusColor(g.pct);
            
            return (
              <g 
                key={g.id} 
                className="cursor-pointer group/gate" 
                onClick={() => setSelected({ ...g, type: 'Gate', x, y })}
              >
                <circle cx={x} cy={y} r="12" className={cn("opacity-0 group-hover/gate:opacity-20 transition-all", colorClass)} />
                <circle cx={x} cy={y} r="6" className={cn("transition-all", colorClass)} />
                <text x={x} y={y - 12} textAnchor="middle" className="fill-slate-500 text-[8px] font-black uppercase tracking-tighter">{g.id}</text>
              </g>
            );
          })}

          {/* Parking Area Representation */}
          {parking.map((p, i) => {
            const x = 80 + (i * 80);
            const y = 270;
            const colorClass = getStatusColor(p.pct);
            
            return (
              <g 
                key={p.id} 
                className="cursor-pointer group/park" 
                onClick={() => setSelected({ ...p, type: 'Parking', x, y: y-10 })}
              >
                <rect x={x} y={y} width="35" height="15" rx="3" className={cn("transition-all opacity-40", colorClass)} />
                <text x={x + 17} y={y + 10} textAnchor="middle" className="fill-white text-[7px] font-black">{p.id}</text>
              </g>
            );
          })}

          {/* Field / Pitch Center */}
          <rect x="175" y="135" width="50" height="30" rx="1" fill="#1b263b" fillOpacity="0.3" stroke="#34495e" strokeWidth="1" />
        </svg>

        {/* Dynamic HUD for Selected Item */}
        {selected && (
          <div 
            className="absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-black/80 to-transparent pointer-events-none"
          >
            <div className="flex justify-between items-start animate-in slide-in-from-top-4 duration-500">
              <div className="space-y-1">
                <span className="text-[10px] font-black text-[var(--color-accent-blue)] uppercase tracking-widest">{selected.type} Analysis</span>
                <h3 className="text-2xl font-black text-white leading-none">{selected.label}</h3>
              </div>
              <div className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase border", getStatusBg(selected.pct))}>
                {selected.pct}% LOADED
              </div>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="absolute bottom-4 left-0 right-0 px-6 flex justify-around">
           <div className="flex items-center gap-1.5 grayscale opacity-50">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
             <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Optimal</span>
           </div>
           <div className="flex items-center gap-1.5 grayscale opacity-50">
             <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
             <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Busy</span>
           </div>
           <div className="flex items-center gap-1.5 grayscale opacity-50">
             <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
             <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Heavy</span>
           </div>
        </div>
      </div>

      {/* Selected Stats Card */}
      <div className={cn(
        "bg-[var(--color-navy-card)] border border-[var(--color-navy-border)] rounded-[2rem] p-6 transition-all duration-500 shadow-xl min-h-[140px] flex flex-col justify-center",
        !selected && "opacity-20"
      )}>
        {selected ? (
          <div className="grid grid-cols-3 gap-4 animate-in fade-in zoom-in-95">
             <div className="text-center">
                <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-2 text-[var(--color-accent-blue)]">
                  <Timer size={18} />
                </div>
                <p className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter">Wait Time</p>
                <p className="text-lg font-black text-white">{selected.wait || '0'}m</p>
             </div>
             <div className="text-center">
                <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-2 text-emerald-400">
                  <Gauge size={18} />
                </div>
                <p className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter">Load Factor</p>
                <p className="text-lg font-black text-white">{selected.pct}%</p>
             </div>
             <div className="text-center">
                <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-2 text-amber-400">
                  <Users size={18} />
                </div>
                <p className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter">Throughput</p>
                <p className="text-lg font-black text-white">HI</p>
             </div>
          </div>
        ) : (
          <div className="text-center space-y-2">
            <Info size={24} className="mx-auto text-slate-600 mb-2" />
            <p className="text-sm font-bold text-slate-500">Select a zone on the map above</p>
            <p className="text-[10px] text-slate-600 uppercase tracking-widest leading-none">To see real-time tactical intelligence</p>
          </div>
        )}
      </div>
    </div>
  );
}
