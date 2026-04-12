import React, { useState } from 'react';
import { useVenue } from '../context/VenueContext';
import { Bell, BellRing } from 'lucide-react';
import { cn } from '../components/MobileLayout';

const WaitTimes = () => {
  const { facilities } = useVenue();
  const [filter, setFilter] = useState('all');
  const [notifiedId, setNotifiedId] = useState(null);
  const [toast, setToast] = useState('');

  const filters = ['all', 'food', 'restroom', 'merch'];

  const filtered = filter === 'all' ? facilities : facilities.filter(f => f.type === filter);
  
  // Sort by lowest wait descending by user request is good for quick scan
  const sorted = [...filtered].sort((a, b) => a.wait - b.wait);

  const getWaitColor = (wait) => {
    if (wait >= 9) return 'bg-[var(--color-status-red)]';
    if (wait > 4) return 'bg-[var(--color-status-amber)]';
    return 'bg-[var(--color-status-green)]';
  };

  const handleNotify = (fac) => {
    setNotifiedId(fac.id);
    setToast(`We'll alert you when ${fac.label} drops below 4 min`);
    setTimeout(() => setToast(''), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <header className="mb-2">
        <h1 className="text-2xl font-bold text-slate-100">Live Wait Times</h1>
      </header>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        {filters.map(f => (
          <button 
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium capitalize whitespace-nowrap min-h-[44px] transition-colors",
              filter === f ? "bg-[var(--color-accent-blue)] text-white" : "bg-[var(--color-navy-card)] text-slate-300 border border-[var(--color-navy-border)]"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="space-y-3">
        {sorted.map(fac => {
          const barWidth = Math.min(100, Math.max(10, (fac.wait / 20) * 100)); // normalized roughly against 20m
          
          return (
            <div key={fac.id} className="bg-[var(--color-navy-card)] border border-[var(--color-navy-border)] rounded-xl p-4">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <h3 className="font-bold text-slate-100">{fac.label}</h3>
                  <p className="text-xs text-slate-400 capitalize">{fac.type} Zone</p>
                </div>
                
                <button 
                  onClick={() => handleNotify(fac)}
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-[#0D1B2A] border border-[var(--color-navy-border)] transition-colors active:bg-blue-900/50"
                  aria-label="Notify me"
                >
                  {notifiedId === fac.id ? <BellRing size={18} className="text-[var(--color-accent-blue)]" /> : <Bell size={18} className="text-slate-400" />}
                </button>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-bold text-lg w-10 text-right">{fac.wait}m</span>
                <div className="flex-1 h-3 bg-[#0D1B2A] rounded-full overflow-hidden">
                  <div 
                    className={cn("h-full rounded-full transition-all duration-500", getWaitColor(fac.wait))}
                    style={{ width: `${barWidth}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Toast popup */}
      {toast && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 bg-[var(--color-status-amber)] text-[var(--color-navy-base)] font-bold px-4 py-2 rounded-lg shadow-lg text-sm z-50 whitespace-nowrap animate-in fade-in slide-in-from-top-5">
          {toast}
        </div>
      )}
    </div>
  );
};

export default WaitTimes;
