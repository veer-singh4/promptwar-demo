import React from 'react';
import { useVenue } from '../context/VenueContext';
import { Zap, RotateCcw, Activity } from 'lucide-react';
import { cn } from '../lib/utils';

export default function SimulationControls() {
  const { triggerChaos, resetSimulation, gates } = useVenue();
  
  const isStressed = gates.some(g => g.pct > 90);

  return (
    <div className="bg-[var(--color-navy-card)] border border-[var(--color-navy-border)] rounded-2xl p-6 shadow-xl relative overflow-hidden group">
      {/* Decorative pulse background */}
      {isStressed && (
        <div className="absolute inset-0 bg-red-500/5 animate-pulse"></div>
      )}
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
            <Activity size={16} className={cn(isStressed ? "text-red-500 animate-spin-slow" : "text-blue-500")} />
            Simulation Engine
          </h3>
          <span className={cn(
            "text-[9px] font-black px-2 py-0.5 rounded-full uppercase",
            isStressed ? "bg-red-500/20 text-red-400" : "bg-blue-500/20 text-blue-400"
          )}>
            {isStressed ? 'Chaos Mode Active' : 'Stable Stream'}
          </span>
        </div>

        <p className="text-[11px] text-slate-400 mb-6 leading-relaxed">
          Allow judges to stress test the system. "Tigger Chaos" pushes all sectors to critical load to verify AI mitigation efficiency.
        </p>

        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={triggerChaos}
            disabled={isStressed}
            className={cn(
              "flex items-center justify-center gap-2 py-3 rounded-xl font-black text-[11px] uppercase tracking-wider transition-all active:scale-95 shadow-lg",
              isStressed 
                ? "bg-slate-800 text-slate-500 cursor-not-allowed" 
                : "bg-gradient-to-r from-orange-600 to-red-600 text-white hover:brightness-110"
            )}
          >
            <Zap size={14} fill="currentColor" />
            Trigger Chaos
          </button>
          
          <button 
            onClick={resetSimulation}
            className="flex items-center justify-center gap-2 py-3 bg-[var(--color-navy-border)] hover:bg-slate-700 text-slate-300 rounded-xl font-black text-[11px] uppercase tracking-wider transition-all active:scale-95 shadow-sm"
          >
            <RotateCcw size={14} />
            Reset State
          </button>
        </div>
      </div>
    </div>
  );
}
