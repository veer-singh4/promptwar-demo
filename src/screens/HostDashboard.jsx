import React, { useState, useMemo, useCallback } from 'react';
import { useVenue } from '../context/VenueContext';
import { trackBroadcast } from '../services/analyticsService';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, AlertOctagon, Bell, Send, CheckCircle, 
  Activity, Users, Truck, Sparkles, BarChart3, Map as MapIcon, Route
} from 'lucide-react';
import { cn, sanitize } from '../lib/utils';
import SimulationControls from '../components/SimulationControls';
import AtmosphereCard from '../components/AtmosphereCard';

export default function HostDashboard() {
  const { gates, parking, setAlerts, helpRequests, resolveEmergency } = useVenue();
  const [broadcastText, setBroadcastText] = useState('');
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();
  
  const metrics = useMemo(() => {
    const criticalGates = gates.filter(g => g.pct > 70).length;
    const criticalPark = parking.filter(p => p.pct > 90).length;
    const avgGateLoad = Math.round(gates.reduce((s, g) => s + g.pct, 0) / gates.length);
    const avgParkLoad = Math.round(parking.reduce((s, p) => s + p.pct, 0) / parking.length);
    const systemStressed = criticalGates > 0 || criticalPark > 0 || helpRequests.length > 0;
    return { criticalGates, criticalPark, avgGateLoad, avgParkLoad, systemStressed };
  }, [gates, parking, helpRequests]);

  const { criticalGates, avgGateLoad, avgParkLoad, systemStressed } = metrics;

  const triggerBroadcast = useCallback(() => {
    const cleanText = sanitize(broadcastText.trim());
    if(!cleanText) return;
    setAlerts(prev => [{ id: Math.random().toString(36).substr(2, 9), type: 'warn', text: cleanText }, ...prev]);
    trackBroadcast(cleanText);
    setBroadcastText('');
    setShowToast(true); 
    setTimeout(() => setShowToast(false), 3000);
  }, [broadcastText, setAlerts]);

  const primaryActions = [
    { title: 'Sys Map', desc: 'Venue Overlay', icon: MapIcon, path: '/map', color: 'text-blue-400 bg-blue-500/10' },
    { title: 'Travel Hub', desc: 'Travel Config', icon: Route, path: '/location', color: 'text-amber-400 bg-amber-500/10' },
    { title: 'Metrics', desc: 'Facility Data', icon: BarChart3, path: '/metrics', color: 'text-green-400 bg-green-500/10' },
    { title: 'AI Insights', desc: 'Smart Ops', icon: Sparkles, path: '/assistant', color: 'text-purple-400 bg-purple-500/10' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-8">
      <header className="flex justify-between items-start">
         <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2 tracking-tight uppercase">
            Command Center <Activity size={18} className="text-[var(--color-status-amber)] animate-pulse" />
          </h1>
          <p className="text-slate-400 text-sm font-bold">Hackathon Production Edition</p>
         </div>
         <div className="bg-[var(--color-navy-card)] border border-[var(--color-navy-border)] px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-lg">
            <div className="w-2 h-2 rounded-full bg-[var(--color-status-green)] animate-pulse"></div>
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">OPS LIVE</span>
         </div>
      </header>

      {/* NEW: Operational Action Grid */}
      <div className="grid grid-cols-2 gap-3">
        {primaryActions.map(card => (
          <button 
            key={card.title}
            onClick={() => navigate(card.path)}
            className="bg-[var(--color-navy-card)] border border-[var(--color-navy-border)] p-4 rounded-2xl flex flex-col items-center text-center group active:scale-[0.98] transition-all hover:border-slate-500 shadow-xl"
          >
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3", card.color)}>
              <card.icon size={20} />
            </div>
            <h3 className="text-white font-black text-[10px] uppercase tracking-wider">{card.title}</h3>
            <p className="text-[8px] text-slate-500 font-bold mt-1 uppercase tracking-tight">{card.desc}</p>
          </button>
        ))}
      </div>

      <SimulationControls />

      {/* System Status Banner */}
      <section 
        className={cn(
          "rounded-2xl border-2 p-5 shadow-2xl transition-all duration-700", 
          systemStressed ? "bg-red-500/10 border-red-500/50 text-red-500" : "bg-green-500/10 border-green-500/50 text-green-500"
        )}
      >
        <div className="flex justify-between items-center mb-2">
          <span className="font-black text-lg tracking-tighter uppercase">{systemStressed ? 'STATUS: STRESSED' : 'STATUS: OPTIMAL'}</span>
          <AlertOctagon size={24} className={cn(systemStressed ? "animate-bounce" : "")} />
        </div>
        <p className="text-[10px] font-black uppercase tracking-widest opacity-80">
          {criticalGates} saturated segments • {helpRequests.length} active emergency
        </p>
      </section>

      {/* Broadcast Control Wrapper */}
      <section className="bg-[var(--color-navy-card)] border border-[var(--color-navy-border)] rounded-2xl p-5 shadow-xl">
        <h3 className="text-[10px] font-black text-[var(--color-status-amber)] uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
          <Send size={14}/> SYSTEM-WIDE BROADCAST
        </h3>
        <textarea 
          value={broadcastText}
          onChange={(e)=>setBroadcastText(e.target.value)}
          className="w-full bg-[#08111a] border border-[var(--color-navy-border)] rounded-xl p-4 text-white placeholder-slate-600 focus:outline-none focus:border-[var(--color-status-amber)] mb-4 min-h-[80px] text-sm font-bold"
          placeholder="Dispatch emergency instructions..."
        />
        <button 
          onClick={triggerBroadcast} 
          disabled={!broadcastText.trim()}
          className="w-full bg-[var(--color-status-amber)] disabled:opacity-50 text-[var(--color-navy-base)] font-black rounded-xl py-4 hover:bg-yellow-500 transition-all active:scale-[0.98] text-xs shadow-lg shadow-yellow-900/40"
        >
          {showToast ? "BROADCAST DISPATCHED" : "PUSH GLOBAL ALERT"}
        </button>
      </section>

      <AtmosphereCard />
    </div>
  );
}
