import React, { useMemo } from 'react';
import { useVenue } from '../context/VenueContext';
import { AlertCircle, Clock, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

/**
 * Home component provides the landing experience for fans.
 * Displays venue capacity, quick stats, and live alerts.
 */
const Home = () => {
  const { alerts, gates, facilities } = useVenue();
  const navigate = useNavigate();

  // Memoize stats to prevent unnecessary re-calc on every render
  const stats = useMemo(() => {
    const bestGate = gates.reduce((prev, current) => (prev.pct < current.pct) ? prev : current);
    const bestFood = facilities.filter(f => f.type === 'food').reduce((prev, current) => (prev.wait < current.wait) ? prev : current);
    const totalCapacity = Math.round(gates.reduce((sum, g) => sum + g.pct, 0) / gates.length);
    
    return { bestGate, bestFood, totalCapacity };
  }, [gates, facilities]);

  const { bestGate, bestFood, totalCapacity } = stats;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-8" role="region" aria-label="Home Dashboard">
      <header className="flex justify-between items-end mb-2">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">VenueIQ</h1>
          <p className="text-slate-400 text-sm">Your intelligent match day partner.</p>
        </div>
        <div 
          className="bg-[var(--color-navy-card)] rounded-full px-4 py-1.5 text-xs font-bold border border-[var(--color-navy-border)] flex items-center gap-2 shadow-sm"
          aria-live="polite"
        >
          <div className={cn(
            "w-2.5 h-2.5 rounded-full animate-pulse", 
            totalCapacity > 70 ? "bg-[var(--color-status-red)]" : totalCapacity > 40 ? "bg-[var(--color-status-amber)]" : "bg-[var(--color-status-green)]"
          )} />
          {totalCapacity}% Capacity
        </div>
      </header>

      {/* Hero Event Card */}
      <section 
        className="bg-[var(--color-navy-card)] border border-[var(--color-navy-border)] rounded-2xl p-6 shadow-xl relative overflow-hidden group"
        aria-labelledby="hero-title"
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-[var(--color-accent-blue)] opacity-10 rounded-full -mr-20 -mt-20 blur-3xl transition-opacity group-hover:opacity-20"></div>
        <div className="relative z-10">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-accent-blue)] mb-2 block">Live Event</span>
          <h2 id="hero-title" className="text-2xl font-bold text-white mb-1">Quarterfinals: City vs United</h2>
          <p className="text-slate-400 text-sm mb-6">Grand Stadium • Kickoff 7:30 PM</p>
          
          <div className="flex gap-3">
            <button 
              onClick={() => navigate('/plan')}
              className="flex-1 bg-[var(--color-accent-blue)] hover:bg-blue-600 active:scale-95 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg"
            >
              Custom Plan <ArrowRight size={18} />
            </button>
            <button 
              onClick={() => navigate('/assistant')}
              className="px-4 bg-[var(--color-navy-border)] hover:bg-slate-700 text-white rounded-xl transition-all flex items-center justify-center shadow-md"
              aria-label="Talk to AI Assistant"
            >
              <Sparkles size={20} className="text-[var(--color-status-amber)]" />
            </button>
          </div>
        </div>
      </section>

      {/* Live Alerts Area */}
      <section className="space-y-4" aria-labelledby="alerts-title">
        <h3 id="alerts-title" className="text-xs font-black text-slate-500 uppercase tracking-[0.15em] px-1">System Broadcasts</h3>
        <div className="space-y-3" role="log" aria-relevant="additions">
          {alerts.slice(0, 2).map((alert) => (
            <div 
              key={alert.id} 
              className="bg-[var(--color-navy-card)]/50 backdrop-blur-sm border border-[var(--color-navy-border)] rounded-2xl p-4 flex gap-4 items-center shadow-sm hover:border-slate-600 transition-colors"
              role="alert"
            >
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                alert.type === 'warn' ? "bg-[var(--color-status-red)]/10 text-[var(--color-status-red)]" : 
                alert.type === 'info' ? "bg-[var(--color-accent-blue)]/10 text-[var(--color-accent-blue)]" : 
                "bg-[var(--color-status-green)]/10 text-[var(--color-status-green)]"
              )}>
                {alert.type === 'warn' && <AlertCircle size={20} />}
                {alert.type === 'info' && <Clock size={20} />}
                {alert.type === 'success' && <CheckCircle size={20} />}
              </div>
              <p className="text-sm font-medium text-slate-200 leading-snug">{alert.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Stats Grid */}
      <section className="space-y-4" aria-labelledby="stats-title">
        <h3 id="stats-title" className="text-xs font-black text-slate-500 uppercase tracking-[0.15em] px-1">Venue Intelligence</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[var(--color-navy-card)] border border-[var(--color-navy-border)] rounded-2xl p-5 shadow-sm transition-transform hover:scale-[1.02]">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2">Gate Traffic</p>
            <p className="text-lg font-bold text-white mb-0.5">{bestGate.label}</p>
            <p className="text-xs font-semibold text-[var(--color-status-green)] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-status-green)]"></span>
              {bestGate.pct}% Load
            </p>
          </div>
          <div className="bg-[var(--color-navy-card)] border border-[var(--color-navy-border)] rounded-2xl p-5 shadow-sm transition-transform hover:scale-[1.02]">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2">Service Speed</p>
            <p className="text-lg font-bold text-white mb-0.5 whitespace-nowrap overflow-hidden text-ellipsis">{bestFood.label}</p>
            <p className="text-xs font-semibold text-[var(--color-status-green)] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-status-green)]"></span>
              {bestFood.wait}m wait
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
