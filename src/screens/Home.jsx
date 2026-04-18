import React, { useMemo } from 'react';
import { useVenue } from '../context/VenueContext';
import { 
  AlertCircle, Clock, CheckCircle, ArrowRight, Sparkles, 
  ClipboardList, Timer, MessageSquare 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

export default function Home() {
  const { alerts, gates, facilities } = useVenue();
  const navigate = useNavigate();

  const stats = useMemo(() => {
    const bestGate = gates.reduce((prev, current) => (prev.pct < current.pct) ? prev : current);
    const bestFood = facilities.filter(f => f.type === 'food').reduce((prev, current) => (prev.wait < current.wait) ? prev : current);
    const totalCapacity = Math.round(gates.reduce((sum, g) => sum + g.pct, 0) / gates.length);
    return { bestGate, bestFood, totalCapacity };
  }, [gates, facilities]);

  const { bestGate, bestFood, totalCapacity } = stats;

  const actionCards = [
    { 
      title: 'AI Assistant', 
      desc: 'Smart match guidance', 
      icon: MessageSquare, 
      path: '/assistant', 
      color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' 
    },
    { 
      title: 'Wait Times', 
      desc: 'Facility queue levels', 
      icon: Timer, 
      path: '/wait-times', 
      color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
    },
    { 
      title: 'My Plan', 
      desc: 'Daily itinerary', 
      icon: ClipboardList, 
      path: '/plan', 
      color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-8">
      <header className="flex justify-between items-end mb-2">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">VenueIQ</h1>
          <p className="text-slate-400 text-sm font-medium">Digital Concierge • Grand stadium</p>
        </div>
        <div className="bg-[var(--color-navy-card)] rounded-full px-4 py-1.5 text-[10px] font-black border border-[var(--color-navy-border)] flex items-center gap-2 uppercase tracking-widest text-slate-300">
          <div className={cn(
            "w-2 h-2 rounded-full animate-pulse", 
            totalCapacity > 70 ? "bg-[var(--color-status-red)]" : totalCapacity > 40 ? "bg-[var(--color-status-amber)]" : "bg-[var(--color-status-green)]"
          )} />
          {totalCapacity}% Load
        </div>
      </header>

      {/* Hero Event Card */}
      <section className="bg-gradient-to-br from-[var(--color-navy-card)] to-[#0c1622] border border-[var(--color-navy-border)] rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-accent-blue)] opacity-5 rounded-full -mr-32 -mt-32 blur-[100px]"></div>
        <div className="relative z-10">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-accent-blue)] mb-2 block">Live Tonight</span>
          <h2 className="text-2xl font-black text-white mb-1">Quarterfinals: City vs United</h2>
          <p className="text-slate-400 text-sm font-bold mb-6">Kickoff 7:30 PM • Main Stage</p>
          
          <button 
            onClick={() => navigate('/location')}
            className="w-full bg-[var(--color-accent-blue)] hover:bg-blue-600 active:scale-[0.98] text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl shadow-blue-900/40"
          >
            GET BEST ROUTE <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* NEW Action Cards Grid */}
      <div className="grid grid-cols-1 gap-3">
        {actionCards.map((card) => (
          <button
            key={card.title}
            onClick={() => navigate(card.path)}
            className={cn(
              "flex items-center gap-4 p-4 rounded-2xl border transition-all text-left group active:scale-[0.98]",
              "bg-[var(--color-navy-card)] border-[var(--color-navy-border)] hover:border-slate-600"
            )}
          >
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center border shrink-0", card.color)}>
              <card.icon size={22} />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-black text-sm uppercase tracking-tight">{card.title}</h3>
              <p className="text-slate-500 text-xs font-bold">{card.desc}</p>
            </div>
            <ArrowRight size={16} className="text-slate-700 group-hover:text-slate-400 transition-colors mr-1" />
          </button>
        ))}
      </div>

      {/* Live Alerts Area */}
      <section className="space-y-4">
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-1">Global Broadcasts</h3>
        <div className="space-y-3">
          {alerts.slice(0, 1).map((alert) => (
            <div 
              key={alert.id} 
              className="bg-[var(--color-navy-card)]/50 border border-[var(--color-navy-border)] rounded-2xl p-4 flex gap-4 items-center"
            >
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                alert.type === 'warn' ? "bg-[var(--color-status-red)]/10 text-[var(--color-status-red)]" : "bg-[var(--color-accent-blue)]/10 text-[var(--color-accent-blue)]"
              )}>
                {alert.type === 'warn' ? <AlertCircle size={20} /> : <Clock size={20} />}
              </div>
              <p className="text-xs font-black text-slate-200 leading-snug">{alert.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
