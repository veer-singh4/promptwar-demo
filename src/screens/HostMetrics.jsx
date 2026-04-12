import React from 'react';
import { useVenue } from '../context/VenueContext';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) { return twMerge(clsx(inputs)); }

export default function HostMetrics() {
  const { facilities, parking } = useVenue();
  
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <header>
        <h1 className="text-2xl font-bold text-slate-100">Deep Metrics</h1>
        <p className="text-slate-400 text-sm">Service Wait Analysis</p>
      </header>

      <div className="bg-[var(--color-navy-card)] border border-[var(--color-navy-border)] rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-[#0D1B2A] text-xs uppercase text-slate-500 font-bold border-b border-[var(--color-navy-border)]">
            <tr>
              <th className="px-4 py-3">Facility Node</th>
              <th className="px-4 py-3">Wait (min)</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-navy-border)]">
             {facilities.map(f => (
               <tr key={f.id} className="hover:bg-slate-800/50 transition duration-150">
                 <td className="px-4 py-3 font-medium text-white">{f.label}</td>
                 <td className="px-4 py-3">{f.wait}</td>
                 <td className="px-4 py-3">
                   <div className={cn("w-2 h-2 rounded-full", f.wait >= 9 ? "bg-[var(--color-status-red)]" : f.wait > 4 ? "bg-[var(--color-status-amber)]" : "bg-[var(--color-status-green)]")}></div>
                 </td>
               </tr>
             ))}
          </tbody>
        </table>
      </div>
      
       <div className="bg-[var(--color-navy-card)] border border-[var(--color-navy-border)] rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-[#0D1B2A] text-xs uppercase text-slate-500 font-bold border-b border-[var(--color-navy-border)]">
            <tr>
              <th className="px-4 py-3">Parking Sector</th>
              <th className="px-4 py-3">Fill %</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-navy-border)]">
             {parking.map(p => (
               <tr key={p.id}>
                 <td className="px-4 py-3 font-medium text-white">{p.label}</td>
                 <td className="px-4 py-3 font-mono">{p.pct}%</td>
               </tr>
             ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
