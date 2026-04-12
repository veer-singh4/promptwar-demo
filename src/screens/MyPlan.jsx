import React, { useState } from 'react';
import { useVenue } from '../context/VenueContext';
import { MapPin, ArrowRightCircle, Coffee, Flag, Navigation, Clock as ClockIcon } from 'lucide-react';
import { cn } from '../components/MobileLayout';

export default function MyPlan() {
  const { gates, parking } = useVenue();
  const [seat, setSeat] = useState('112');
  const [transport, setTransport] = useState('car');
  
  const bestGate = gates.reduce((prev, current) => (prev.pct < current.pct) ? prev : current);
  const bestPark = parking.reduce((prev, current) => (prev.pct < current.pct) ? prev : current);

  const steps = [
    { id: 1, title: 'Arrive via Transport', desc: transport === 'car' ? `Park at ${bestPark.label} (${bestPark.pct}% full)` : `Arriving via ${transport}`, time: '6:30 PM', icon: Navigation, active: false },
    { id: 2, title: `Enter ${bestGate.label}`, desc: `Estimated wait: ${Math.max(1, Math.floor(bestGate.pct / 10))} min`, time: '6:45 PM', icon: ArrowRightCircle, active: true },
    { id: 3, title: 'Grab Food', desc: 'Food Court C is fastest (4 min)', time: '6:52 PM', icon: Coffee, active: false },
    { id: 4, title: `Find Seat Block ${seat || '___'}`, desc: 'Section 1 concourse', time: '7:08 PM', icon: MapPin, active: false },
    { id: 5, title: 'Kickoff', desc: 'Quarterfinals begin', time: '7:30 PM', icon: Flag, active: false },
    { id: 6, title: 'Exit Strategy', desc: transport === 'car' ? `Route to ${bestPark.label} via Gate 3` : 'Use Gate 7 for direct tunnel', time: '9:25 PM', icon: ClockIcon, active: false }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-6">
      <header className="mb-4"><h1 className="text-2xl font-bold text-slate-100">My Evening Plan</h1></header>

      <div className="bg-[var(--color-navy-card)] border border-[var(--color-navy-border)] rounded-xl p-5 space-y-4 shadow-sm">
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase">Seat Block</label>
          <input type="text" value={seat} onChange={(e) => setSeat(e.target.value)} className="w-full bg-[#0D1B2A] border border-[var(--color-navy-border)] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-accent-blue)]" placeholder="e.g. 112" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase">Transport Mode</label>
          <select value={transport} onChange={(e) => setTransport(e.target.value)} className="w-full bg-[#0D1B2A] border border-[var(--color-navy-border)] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-accent-blue)] appearance-none">
            <option value="metro">Metro / Train</option>
            <option value="car">Car Parking</option>
            <option value="bus">Bus Shuttle</option>
          </select>
        </div>
      </div>

      <div className="relative pl-6 space-y-8 mt-8">
        <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-[var(--color-navy-border)]"></div>
        {steps.map((step) => (
          <div key={step.id} className="relative">
            <div className={cn("absolute -left-[37px] w-6 h-6 rounded-full flex items-center justify-center border-4 border-[var(--color-navy-base)] z-10", step.active ? "bg-[var(--color-accent-blue)] scale-125 shadow-[0_0_15px_rgba(30,144,255,0.5)]" : "bg-[var(--color-navy-border)]")}></div>
            <div className="flex justify-between items-start -mt-1 bg-[var(--color-navy-card)] p-4 rounded-xl border border-[var(--color-navy-border)]">
              <div className="pr-2"><h3 className={cn("font-bold text-base md:text-lg leading-tight", step.active ? "text-[var(--color-accent-blue)]" : "text-white")}>{step.title}</h3><p className="text-xs md:text-sm text-slate-400 mt-1">{step.desc}</p></div>
              <span className="text-xs font-semibold text-slate-300 shrink-0 bg-[#0D1B2A] px-2 py-1 rounded">{step.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
