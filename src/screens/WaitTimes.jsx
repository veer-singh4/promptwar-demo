import React, { useState, useMemo } from 'react';
import { useVenue } from '../context/VenueContext';
import { trackEvent } from '../services/analyticsService';
import { Bell, BellRing, Utensils, Accessibility, ShoppingBag, Filter } from 'lucide-react';
import { cn } from '../lib/utils';

/**
 * WaitTimes component allows fans to monitor service speed at food, 
 * restroom, and merch facilities. Includes notification requesting logic.
 */
const WaitTimes = () => {
  const { facilities } = useVenue();
  const [filter, setFilter] = useState('all');
  const [notifiedId, setNotifiedId] = useState(null);
  const [toast, setToast] = useState('');

  const filterOptions = [
    { id: 'all', icon: Filter },
    { id: 'food', icon: Utensils },
    { id: 'restroom', icon: Accessibility },
    { id: 'merch', icon: ShoppingBag }
  ];

  // Memoize filtered and sorted list for efficiency
  const processedFacilities = useMemo(() => {
    let list = filter === 'all' ? facilities : facilities.filter(f => f.type === filter);
    return [...list].sort((a, b) => a.wait - b.wait);
  }, [facilities, filter]);

  /**
   * Helper to determine status color bar based on wait time
   */
  const getWaitColor = (wait) => {
    if (wait >= 10) return 'bg-[var(--color-status-red)] shadow-[0_0_10px_rgba(226,75,74,0.4)]';
    if (wait > 5) return 'bg-[var(--color-status-amber)] shadow-[0_0_10px_rgba(239,159,39,0.4)]';
    return 'bg-[var(--color-status-green)] shadow-[0_0_10px_rgba(29,158,117,0.4)]';
  };

  const handleNotify = (fac) => {
    setNotifiedId(fac.id);
    const msg = `Alert set: We'll notify you when ${fac.label} drops below 4 mins.`;
    setToast(msg);
    trackEvent('notify_wait_request', { facility: fac.label, wait: fac.wait });
    setTimeout(() => setToast(''), 4000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-8" role="region" aria-label="Service Wait Times">
      <header className="mb-2">
        <h1 className="text-2xl font-black text-white tracking-tight">Live Service Status</h1>
        <p className="text-slate-400 text-sm">Real-time queue monitoring at your current block.</p>
      </header>

      {/* Filter Tabs */}
      <div 
        className="flex gap-2 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide" 
        role="tablist" 
        aria-label="Filter facilities"
      >
        {filterOptions.map(({ id, icon: Icon }) => (
          <button 
            key={id}
            role="tab"
            aria-selected={filter === id}
            onClick={() => setFilter(id)}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-black capitalize whitespace-nowrap min-h-[48px] transition-all border outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-blue)]",
              filter === id 
                ? "bg-[var(--color-accent-blue)] text-white border-[var(--color-accent-blue)] shadow-lg shadow-blue-900/20" 
                : "bg-[var(--color-navy-card)] text-slate-400 border-[var(--color-navy-border)] hover:border-slate-600"
            )}
          >
            <Icon size={16} />
            {id}
          </button>
        ))}
      </div>

      {/* Facility Cards */}
      <div className="space-y-4" role="list">
        {processedFacilities.map(fac => {
          const barWidth = Math.min(100, Math.max(8, (fac.wait / 20) * 100)); // Normalize against 20m max
          
          return (
            <div 
              key={fac.id} 
              role="listitem"
              className="bg-[var(--color-navy-card)] border border-[var(--color-navy-border)] rounded-2xl p-5 shadow-sm transition-all hover:border-slate-700"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg text-white mb-0.5">{fac.label}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Zone {fac.type}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                    <span className="text-[10px] text-slate-500 font-bold">Updated Live</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => handleNotify(fac)}
                  className={cn(
                    "w-11 h-11 rounded-2xl flex items-center justify-center transition-all outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-blue)]",
                    notifiedId === fac.id ? "bg-[var(--color-accent-blue)] text-white shadow-lg" : "bg-[#08111a] border border-[var(--color-navy-border)] text-slate-500 hover:text-white"
                  )}
                  aria-label={`Notify me when wait at ${fac.label} decreases`}
                  aria-pressed={notifiedId === fac.id}
                >
                  {notifiedId === fac.id ? <BellRing size={20} /> : <Bell size={20} />}
                </button>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end w-12 shrink-0" aria-label={`Current wait time: ${fac.wait} minutes`}>
                  <span className="text-2xl font-black text-white leading-none">{fac.wait}</span>
                  <span className="text-[10px] font-black text-slate-500 uppercase">Min</span>
                </div>
                <div className="flex-1 h-3 bg-[#08111a] rounded-full overflow-hidden border border-[var(--color-navy-border)] shadow-inner">
                  <div 
                    className={cn("h-full rounded-full transition-all duration-1000 ease-out", getWaitColor(fac.wait))}
                    style={{ width: `${barWidth}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Global Toast with ARIA live region */}
      <div 
        aria-live="assertive" 
        className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-3rem)] max-w-sm pointer-events-none"
      >
        {toast && (
          <div className="bg-[var(--color-status-amber)] text-[var(--color-navy-base)] font-black px-6 py-4 rounded-2xl shadow-2xl text-sm flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
             <Bell size={18} className="shrink-0" />
             {toast}
          </div>
        )}
      </div>
    </div>
  );
};

export default WaitTimes;
