import React from 'react';
import { useVenue } from '../context/VenueContext';
import { AlertCircle, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../components/MobileLayout';

const Home = () => {
  const { alerts, gates, facilities } = useVenue();
  const navigate = useNavigate();

  const bestGate = gates.reduce((prev, current) => (prev.pct < current.pct) ? prev : current);
  const bestFood = facilities.filter(f => f.type === 'food').reduce((prev, current) => (prev.wait < current.wait) ? prev : current);
  
  const totalCapacity = Math.round(gates.reduce((sum, g) => sum + g.pct, 0) / gates.length);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <header className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-bold text-slate-100">VenueIQ</h1>
        <div className="bg-[var(--color-navy-card)] rounded-full px-3 py-1 text-sm border border-[var(--color-navy-border)] flex items-center gap-2">
          <div className={cn("w-2 h-2 rounded-full", totalCapacity > 70 ? "bg-[var(--color-status-red)]" : totalCapacity > 40 ? "bg-[var(--color-status-amber)]" : "bg-[var(--color-status-green)]")} />
          Venue {totalCapacity}% Full
        </div>
      </header>

      <section className="bg-[var(--color-navy-card)] border border-[var(--color-navy-border)] rounded-xl p-5 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-accent-blue)] opacity-10 rounded-full -mr-10 -mt-10 blur-xl"></div>
        <h2 className="text-xl font-bold text-white mb-1 relative z-10">Quarterfinals: City vs United</h2>
        <p className="text-slate-400 text-sm mb-4 relative z-10">Grand Stadium • Kickoff 7:30 PM</p>
        
        <button 
          onClick={() => navigate('/plan')}
          className="w-full bg-[var(--color-accent-blue)] hover:bg-blue-600 active:bg-blue-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors min-h-[44px]"
        >
          Build My Plan <ArrowRight size={18} />
        </button>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Live System Alerts</h3>
        <div className="space-y-3">
          {alerts.slice(0, 2).map((alert, idx) => (
            <div key={idx} className="bg-[var(--color-navy-card)] border border-[var(--color-navy-border)] rounded-xl p-4 flex gap-3 items-start shadow-sm">
              {alert.type === 'warn' && <AlertCircle className="text-[var(--color-status-amber)] shrink-0" size={20} />}
              {alert.type === 'info' && <Clock className="text-[var(--color-accent-blue)] shrink-0" size={20} />}
              {alert.type === 'success' && <CheckCircle className="text-[var(--color-status-green)] shrink-0" size={20} />}
              <p className="text-sm text-slate-200 leading-snug">{alert.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Quick Stats</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[var(--color-navy-card)] border border-[var(--color-navy-border)] rounded-xl p-4">
            <p className="text-xs text-slate-400 mb-1">Fastest Gate</p>
            <p className="text-lg font-bold text-white">{bestGate.label}</p>
            <p className="text-xs text-[var(--color-status-green)] mt-1">{bestGate.pct}% load</p>
          </div>
          <div className="bg-[var(--color-navy-card)] border border-[var(--color-navy-border)] rounded-xl p-4">
            <p className="text-xs text-slate-400 mb-1">Quickest Food</p>
            <p className="text-lg font-bold text-white leading-tight">{bestFood.label}</p>
            <p className="text-xs text-[var(--color-status-green)] mt-1">{bestFood.wait} min wait</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
