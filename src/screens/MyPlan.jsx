import React, { useState, useMemo } from 'react';
import { useVenue } from '../context/VenueContext';
import { MapPin, ArrowRightCircle, Coffee, Flag, Navigation, Clock as ClockIcon, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';

/**
 * MyPlan component: Generates a personalized itinerary for the fan.
 * Dynamically updates based on seat block and transport mode.
 */
export default function MyPlan() {
  const { gates, parking, facilities } = useVenue();
  const [seat, setSeat] = useState('112');
  const [transport, setTransport] = useState('car');
  
  // Memoize best options for the journey
  const journeyStats = useMemo(() => {
    const bestGate = gates.reduce((prev, current) => (prev.pct < current.pct) ? prev : current);
    const bestPark = parking.reduce((prev, current) => (prev.pct < current.pct) ? prev : current);
    const bestFood = facilities.find(f => f.id === 'f3') || facilities[0]; // Logic placeholder
    
    return { bestGate, bestPark, bestFood };
  }, [gates, parking, facilities]);

  const { bestGate, bestPark, bestFood } = journeyStats;

  const steps = [
    { id: 1, title: 'Venue Arrival', desc: transport === 'car' ? `Secured parking at ${bestPark.label} (${bestPark.pct}% full)` : `Arrival via ${transport} shuttle`, time: '6:30 PM', icon: Navigation, active: false },
    { id: 2, title: `Entry: ${bestGate.label}`, desc: `Wait queue: ~${Math.max(1, Math.floor(bestGate.pct / 10))} min. Low congestion.`, time: '6:45 PM', icon: ArrowRightCircle, active: true },
    { id: 3, title: 'Refreshments', desc: `${bestFood.label} identified as fastest node (${bestFood.wait} min)`, time: '6:52 PM', icon: Coffee, active: false },
    { id: 4, title: `Locate Section ${seat || '___'}`, desc: 'Level 1 concourse, follow northern signs', time: '7:08 PM', icon: MapPin, active: false },
    { id: 5, title: 'Match Start', desc: 'Quarterfinals: City vs United', time: '7:30 PM', icon: Flag, active: false },
    { id: 6, title: 'Safe Departure', desc: transport === 'car' ? `Exit via Gate 3 for ${bestPark.label} access` : 'Use North Tunnel for Metro access', time: '9:25 PM', icon: ClockIcon, active: false }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-8" role="region" aria-label="Personalized Journey Itinerary">
      <header className="mb-4">
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
          Your Itinerary <Sparkles size={18} className="text-[var(--color-status-amber)]" />
        </h1>
        <p className="text-slate-400 text-sm font-medium">Auto-optimized journey based on live stadium load.</p>
      </header>

      {/* Input Configuration Card */}
      <div 
        className="bg-[var(--color-navy-card)] border border-[var(--color-navy-border)] rounded-2xl p-6 space-y-5 shadow-xl shadow-blue-900/5 transition-all focus-within:border-slate-600"
        role="form"
        aria-label="Itinerary parameters"
      >
        <div>
          <label htmlFor="seat-block" className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-widest px-1">Seating Assignment</label>
          <input 
            id="seat-block"
            type="text" 
            value={seat} 
            onChange={(e) => setSeat(e.target.value)} 
            className="w-full bg-[#08111a] border border-[var(--color-navy-border)] rounded-xl px-4 py-3.5 text-white placeholder-slate-700 focus:outline-none focus:border-[var(--color-accent-blue)] transition-all font-semibold" 
            placeholder="e.g. 112-F" 
          />
        </div>
        <div>
          <label htmlFor="transport-mode" className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-widest px-1">Arrival Logistics</label>
          <div className="relative">
            <select 
              id="transport-mode"
              value={transport} 
              onChange={(e) => setTransport(e.target.value)} 
              className="w-full bg-[#08111a] border border-[var(--color-navy-border)] rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-[var(--color-accent-blue)] appearance-none cursor-pointer font-semibold"
            >
              <option value="metro">Public Transport / Metro</option>
              <option value="car">Personal Vehicle / Parking</option>
              <option value="bus">Regional Bus / Shuttle</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
              <Navigation size={14} className="rotate-45" />
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Journey Timeline */}
      <div className="relative pl-7 space-y-8 mt-10" role="list">
        {/* Continuous track line */}
        <div className="absolute left-[13px] top-3 bottom-3 w-1 bg-gradient-to-b from-[var(--color-navy-border)] via-[var(--color-accent-blue)] to-[var(--color-navy-border)] opacity-30"></div>
        
        {steps.map((step) => (
          <div key={step.id} className="relative group animate-in slide-in-from-left-4 duration-500" role="listitem">
            {/* Step marker node */}
            <div className={cn(
              "absolute -left-[40px] w-8 h-8 rounded-full flex items-center justify-center border-4 border-[var(--color-navy-base)] z-10 transition-all", 
              step.active 
                ? "bg-[var(--color-accent-blue)] scale-110 shadow-[0_0_20px_rgba(30,144,255,0.6)] ring-4 ring-blue-500/20" 
                : "bg-[var(--color-navy-border)] group-hover:bg-slate-600"
            )}>
              <step.icon size={14} className={step.active ? "text-white" : "text-slate-500"} />
            </div>

            {/* Step content card */}
            <div 
              className={cn(
                "flex justify-between items-start bg-[var(--color-navy-card)] p-5 rounded-2xl border transition-all", 
                step.active 
                  ? "border-[var(--color-accent-blue)]/50 shadow-xl shadow-blue-900/10" 
                  : "border-[var(--color-navy-border)] hover:border-slate-700"
              )}
            >
              <div className="pr-4">
                <h3 className={cn(
                  "font-black text-base tracking-tight leading-none mb-1.5 transition-colors", 
                  step.active ? "text-[var(--color-accent-blue)]" : "text-white"
                )}>
                  {step.title}
                </h3>
                <p className="text-xs font-medium text-slate-400 leading-snug">{step.desc}</p>
              </div>
              <span className="text-[10px] font-black text-[var(--color-accent-blue)] shrink-0 bg-[#08111a] px-2.5 py-1.5 rounded-lg border border-[var(--color-navy-border)]">
                {step.time}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
