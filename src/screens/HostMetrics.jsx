import React from 'react';
import { useVenue } from '../context/VenueContext';
import { BarChart2, PieChart, Activity } from 'lucide-react';
import { cn } from '../lib/utils';

/**
 * HostMetrics component: Provides deep-dive data analysis for facility owners.
 * Tabular views for service waits and parking occupancy.
 */
export default function HostMetrics() {
  const { facilities, parking } = useVenue();
  
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-8" role="region" aria-label="Operational Metrics Analysis">
      <header>
        <h1 className="text-2xl font-black text-white flex items-center gap-3 tracking-tight">
          Deep Analytics <BarChart2 size={24} className="text-[var(--color-accent-blue)]" />
        </h1>
        <p className="text-slate-400 text-sm font-medium">Comparative service node performance analysis.</p>
      </header>

      {/* Facility Wait Metrics Table */}
      <section className="space-y-4" aria-labelledby="facility-metrics-title">
        <div className="flex items-center gap-2 px-1">
          <Activity size={14} className="text-slate-500" />
          <h2 id="facility-metrics-title" className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Service Node Efficiency</h2>
        </div>
        
        <div className="bg-[var(--color-navy-card)] border border-[var(--color-navy-border)] rounded-2xl overflow-hidden shadow-xl shadow-blue-900/5">
          <table className="w-full text-left text-sm text-slate-300 border-collapse">
            <caption className="sr-only">Table of current facility wait times</caption>
            <thead className="bg-[#08111a] text-[10px] uppercase font-black text-slate-500 tracking-wider">
              <tr>
                <th scope="col" className="px-6 py-4 border-b border-[var(--color-navy-border)]">Facility Identity</th>
                <th scope="col" className="px-6 py-4 border-b border-[var(--color-navy-border)]">Wait (m)</th>
                <th scope="col" className="px-6 py-4 border-b border-[var(--color-navy-border)] text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-navy-border)]">
               {facilities.map(f => (
                 <tr key={f.id} className="hover:bg-slate-800/40 transition-colors group">
                   <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-white group-hover:text-[var(--color-accent-blue)] transition-colors">{f.label}</span>
                        <span className="text-[10px] font-black uppercase tracking-tighter text-slate-600">{f.type}</span>
                      </div>
                   </td>
                   <td className="px-6 py-4 font-mono font-bold text-slate-100">{f.wait}</td>
                   <td className="px-6 py-4">
                     <div className="flex justify-center">
                        <div 
                          className={cn(
                            "w-2.5 h-2.5 rounded-full shadow-sm blink-slow", 
                            f.wait >= 10 ? "bg-[var(--color-status-red)]" : f.wait > 5 ? "bg-[var(--color-status-amber)]" : "bg-[var(--color-status-green)]"
                          )}
                          aria-label={f.wait >= 10 ? 'High Wait' : f.wait > 5 ? 'Medium Wait' : 'Low Wait'}
                        ></div>
                     </div>
                   </td>
                 </tr>
               ))}
            </tbody>
          </table>
        </div>
      </section>
      
      {/* Parking Load Metrics Table */}
      <section className="space-y-4" aria-labelledby="parking-metrics-title">
        <div className="flex items-center gap-2 px-1">
          <PieChart size={14} className="text-slate-500" />
          <h2 id="parking-metrics-title" className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Logistics Sector Status</h2>
        </div>

        <div className="bg-[var(--color-navy-card)] border border-[var(--color-navy-border)] rounded-2xl overflow-hidden shadow-xl shadow-blue-900/5">
          <table className="w-full text-left text-sm text-slate-300 border-collapse">
            <caption className="sr-only">Table of current parking sector occupancy rates</caption>
            <thead className="bg-[#08111a] text-[10px] uppercase font-black text-slate-500 tracking-wider">
              <tr>
                <th scope="col" className="px-6 py-4 border-b border-[var(--color-navy-border)]">Parking Sector</th>
                <th scope="col" className="px-6 py-4 border-b border-[var(--color-navy-border)]">Saturation %</th>
                <th scope="col" className="px-6 py-4 border-b border-[var(--color-navy-border)]">Visual</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-navy-border)]">
               {parking.map(p => (
                 <tr key={p.id} className="hover:bg-slate-800/40 transition-colors group">
                   <td className="px-6 py-4 font-bold text-white group-hover:text-[var(--color-accent-blue)] transition-colors">{p.label}</td>
                   <td className="px-6 py-4 font-mono font-bold text-slate-100">{p.pct}%</td>
                   <td className="px-6 py-4">
                      <div className="w-full max-w-[100px] h-1.5 bg-[#08111a] rounded-full overflow-hidden border border-[var(--color-navy-border)]">
                        <div 
                          className={cn("h-full transition-all duration-1000", p.pct > 80 ? "bg-[var(--color-status-red)]" : "bg-[var(--color-status-green)]")} 
                          style={{width: `${p.pct}%`}}
                        ></div>
                      </div>
                   </td>
                 </tr>
               ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
