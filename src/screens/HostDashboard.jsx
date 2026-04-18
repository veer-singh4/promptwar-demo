import React, { useState, useMemo, useCallback } from 'react';
import { useVenue } from '../context/VenueContext';
import { trackBroadcast } from '../services/analyticsService';
import { ShieldAlert, AlertOctagon, Bell, Send, CheckCircle, Activity, Users, Truck } from 'lucide-react';
import { cn, sanitize } from '../lib/utils';
import SimulationControls from '../components/SimulationControls';
import AtmosphereCard from '../components/AtmosphereCard';
import VenueConfigCard from '../components/VenueConfigCard';

/**
 * HostDashboard component: The central Command and Control interface for venue managers.
 */
export default function HostDashboard() {
  const { gates, parking, setAlerts, helpRequests, resolveEmergency } = useVenue();
  const [broadcastText, setBroadcastText] = useState('');
  const [showToast, setShowToast] = useState(false);
  
  // Memoize critical indicators
  const metrics = useMemo(() => {
    const criticalGates = gates.filter(g => g.pct > 70).length;
    const criticalPark = parking.filter(p => p.pct > 90).length;
    const avgGateLoad = Math.round(gates.reduce((s, g) => s + g.pct, 0) / gates.length);
    const avgParkLoad = Math.round(parking.reduce((s, p) => s + p.pct, 0) / parking.length);
    const systemStressed = criticalGates > 0 || criticalPark > 0 || helpRequests.length > 0;
    
    return { criticalGates, criticalPark, avgGateLoad, avgParkLoad, systemStressed };
  }, [gates, parking, helpRequests]);

  const { criticalGates, avgGateLoad, avgParkLoad, systemStressed } = metrics;

  /**
   * Triggers a system-wide broadcast alert to all clients
   */
  const triggerBroadcast = useCallback(() => {
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
    <div className="space-y-6 animate-in fade-in duration-500 pb-8" role="region" aria-label="Venue Command Center">
      <header className="flex justify-between items-start">
         <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2 tracking-tight">
            Command Center <Activity size={18} className="text-[var(--color-status-amber)] animate-pulse" />
          </h1>
          <p className="text-slate-400 text-sm font-medium">Global operations and attendee safety hub.</p>
         </div>
         <div className="bg-[var(--color-navy-card)] border border-[var(--color-navy-border)] px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-[var(--color-status-green)] animate-pulse"></div>
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Sys Ready</span>
         </div>
      </header>

      {/* NEW: Simulation & Venue Controls */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SimulationControls />
        <VenueConfigCard />
      </section>

      {/* System Status Banner */}
      <section 
        className={cn(
          "rounded-2xl border-2 p-6 shadow-2xl transition-all duration-700 backdrop-blur-md", 
          systemStressed 
            ? "bg-[var(--color-status-red)]/5 border-[var(--color-status-red)]/50 text-[var(--color-status-red)]" 
            : "bg-[var(--color-status-green)]/5 border-[var(--color-status-green)]/50 text-[var(--color-status-green)]"
        )}
        role="status"
        aria-live="polite"
      >
        <div className="flex justify-between items-center mb-3">
          <span className="font-black text-xl tracking-tighter uppercase">{systemStressed ? 'SYSTEM STATUS: STRESSED' : 'SYSTEM STATUS: OPTIMAL'}</span>
          <AlertOctagon size={28} className={cn(systemStressed ? "animate-bounce" : "")} />
        </div>
        <p className="text-xs font-bold opacity-80 uppercase tracking-widest">
          {criticalGates} Gates saturated • {helpRequests.length} Active emergencies
        </p>
      </section>

      {/* Real-time Emergency Feed */}
      {helpRequests.length > 0 && (
        <section className="bg-[var(--color-status-red)]/5 border border-[var(--color-status-red)]/30 rounded-2xl p-6 space-y-4" aria-labelledby="sos-header">
          <h3 id="sos-header" className="text-xs font-black text-[var(--color-status-red)] uppercase tracking-[0.2em] px-1">Live Priority Incidents</h3>
          <div className="space-y-3" role="log" aria-relevant="additions">
             {helpRequests.map(req => (
               <div key={req.id} className="bg-[var(--color-navy-card)]/80 backdrop-blur-sm border border-[var(--color-navy-border)] rounded-2xl p-4 flex justify-between items-center animate-in slide-in-from-right-4 transition-all hover:bg-slate-800/80">
                 <div className="flex-1 pr-4">
                   <div className="flex items-center gap-2 mb-1">
                     <span className="text-sm font-black text-white">{req.type}</span>
                     <span className="text-[9px] font-black bg-[var(--color-status-red)] text-white px-2 py-0.5 rounded-full uppercase tracking-tighter shadow-sm">{req.timestamp}</span>
                   </div>
                   <div className="flex items-center gap-1.5 text-slate-400">
                     <Users size={12} />
                     <p className="text-xs font-bold">{req.location}</p>
                   </div>
                   {req.details && <p className="text-xs text-slate-300 italic mt-2 font-medium opacity-80 border-l-2 border-slate-700 pl-3">"{req.details}"</p>}
                 </div>
                 <button 
                  onClick={() => resolveEmergency(req.id)} 
                  className="w-12 h-12 rounded-2xl bg-[var(--color-status-green)] flex items-center justify-center text-white shrink-0 hover:bg-green-600 active:scale-90 transition-all shadow-lg shadow-green-900/20"
                  aria-label={`Resolve incident at ${req.location}`}
                 >
                   <CheckCircle size={22} strokeWidth={2.5} />
                 </button>
               </div>
             ))}
          </div>
        </section>
      )}

      {/* Broadcast Control Wrapper */}
      <section className="bg-[var(--color-navy-card)] border border-[var(--color-navy-border)] rounded-2xl p-6 shadow-xl" aria-labelledby="broadcast-title">
        <h3 id="broadcast-title" className="text-xs font-black text-[var(--color-status-amber)] uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
          <Send size={16}/> Push PA Alert
        </h3>
        <textarea 
          value={broadcastText}
          onChange={(e)=>setBroadcastText(e.target.value)}
          className="w-full bg-[#08111a] border border-[var(--color-navy-border)] rounded-xl p-4 text-white placeholder-slate-600 focus:outline-none focus:border-[var(--color-status-amber)] focus:ring-4 focus:ring-[var(--color-status-amber)]/5 mb-4 shadow-inner min-h-[100px] font-medium"
          placeholder="Enter emergency instructions for all attendees..."
          aria-label="Broadcast message text"
        />
        <button 
          onClick={triggerBroadcast} 
          disabled={!broadcastText.trim()}
          className="w-full bg-[var(--color-status-amber)] disabled:opacity-50 text-[var(--color-navy-base)] font-black rounded-xl py-4 hover:bg-yellow-500 transition-all shadow-xl shadow-yellow-900/10 active:scale-[0.98] flex items-center justify-center gap-2"
        >
          {showToast ? <CheckCircle size={20} className="animate-in zoom-in" /> : "DISPATCH SYSTEM BROADCAST"}
        </button>
      </section>

      {/* Live Operational Metrics */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AtmosphereCard />
        <div className="bg-[var(--color-navy-card)] border border-[var(--color-navy-border)] rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] px-1">VIP Sector Loads</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-white">Platinum Lounge</span>
              <span className="text-sm font-black text-orange-400">45%</span>
            </div>
            <div className="h-1.5 w-full bg-[#08111a] rounded-full overflow-hidden">
              <div className="h-full bg-orange-500" style={{width: '45%'}}></div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-white">Executive Suites</span>
              <span className="text-sm font-black text-red-400">72%</span>
            </div>
            <div className="h-1.5 w-full bg-[#08111a] rounded-full overflow-hidden">
              <div className="h-full bg-red-500" style={{width: '72%'}}></div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4" aria-label="Quick metrics">
        <div className="bg-[var(--color-navy-card)] border border-[var(--color-navy-border)] rounded-2xl p-5 shadow-lg group transition-colors hover:border-slate-600">
          <div className="flex items-center gap-2 mb-2">
            <Users size={14} className="text-slate-500" />
            <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Mean Gate Load</h3>
          </div>
          <p className="text-3xl font-black text-white tracking-tighter">{avgGateLoad}%</p>
          <div className="mt-3 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className={cn("h-full transition-all duration-1000", avgGateLoad > 70 ? "bg-[var(--color-status-red)]" : "bg-[var(--color-status-green)]")} style={{width: `${avgGateLoad}%`}}></div>
          </div>
        </div>
        <div className="bg-[var(--color-navy-card)] border border-[var(--color-navy-border)] rounded-2xl p-5 shadow-lg group transition-colors hover:border-slate-600">
          <div className="flex items-center gap-2 mb-2">
            <Truck size={14} className="text-slate-500" />
            <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Mean Park Load</h3>
          </div>
          <p className="text-3xl font-black text-white tracking-tighter">{avgParkLoad}%</p>
          <div className="mt-3 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className={cn("h-full transition-all duration-1000", avgParkLoad > 70 ? "bg-[var(--color-status-red)]" : "bg-[var(--color-status-green)]")} style={{width: `${avgParkLoad}%`}}></div>
          </div>
        </div>
      </section>
    </div>
  );
}
