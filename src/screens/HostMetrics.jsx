import React from 'react';
import { useVenue } from '../context/VenueContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { BarChart2, PieChart, Activity, TrendingUp } from 'lucide-react';
import { cn } from '../lib/utils';

/**
 * HostMetrics component: Provides deep-dive data analysis for facility owners.
 */
export default function HostMetrics() {
  const { facilities } = useVenue();

  // Simulated trend data for the chart
  const trendData = [
    { time: '18:00', wait: 5 },
    { time: '18:30', wait: 8 },
    { time: '19:00', wait: 15 },
    { time: '19:30', wait: 12 },
    { time: '20:00', wait: 18 },
    { time: '20:30', wait: 10 },
  ];
  
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-8" role="region" aria-label="Operational Metrics Analysis">
      <header>
        <h1 className="text-2xl font-black text-white flex items-center gap-3 tracking-tight">
          Deep Analytics <BarChart2 size={24} className="text-[var(--color-accent-blue)]" />
        </h1>
        <p className="text-slate-400 text-sm font-medium">Comparative service node performance analysis.</p>
      </header>

      {/* Real-time Trend Chart */}
      <section className="space-y-4" aria-labelledby="trend-title">
        <div className="flex items-center gap-2 px-1">
          <TrendingUp size={14} className="text-slate-500" />
          <h2 id="trend-title" className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Peak Load Trends (Simulated)</h2>
        </div>
        <div className="bg-[var(--color-navy-card)] border border-[var(--color-navy-border)] rounded-2xl p-6 h-[250px] shadow-xl">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1b263b" vertical={false} />
              <XAxis dataKey="time" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} unit="m" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0d1b2a', border: '1px solid #1b263b', borderRadius: '8px' }}
                itemStyle={{ color: '#3b82f6', fontWeight: 'bold' }}
              />
              <Line 
                type="monotone" 
                dataKey="wait" 
                stroke="#3b82f6" 
                strokeWidth={3} 
                dot={{ fill: '#3b82f6', r: 4 }} 
                activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Facility Wait Metrics Table */}
      <section className="space-y-4" aria-labelledby="facility-metrics-title">
        <div className="flex items-center gap-2 px-1">
          <Activity size={14} className="text-slate-500" />
          <h2 id="facility-metrics-title" className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Service Node Efficiency</h2>
        </div>
        
        <div className="bg-[var(--color-navy-card)] border border-[var(--color-navy-border)] rounded-2xl overflow-hidden shadow-xl">
          <table className="w-full text-left text-sm text-slate-300 border-collapse">
            <thead className="bg-[#08111a] text-[10px] uppercase font-black text-slate-500 tracking-wider">
              <tr>
                <th className="px-6 py-4">Facility Identity</th>
                <th className="px-6 py-4">Wait (m)</th>
                <th className="px-6 py-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-navy-border)]">
               {facilities.map(f => (
                 <tr key={f.id} className="hover:bg-slate-800/40 transition-colors">
                   <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-white">{f.label}</span>
                        <span className="text-[10px] uppercase tracking-tighter text-slate-600 font-black">{f.type}</span>
                      </div>
                   </td>
                   <td className="px-6 py-4 font-mono font-bold">{f.wait}</td>
                   <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <div className={cn("w-2 h-2 rounded-full", f.wait >= 10 ? "bg-red-500" : f.wait > 5 ? "bg-amber-500" : "bg-emerald-500")}></div>
                      </div>
                   </td>
                 </tr>
               ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
