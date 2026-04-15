import React from 'react';
import { useVenue } from '../context/VenueContext';
import { Cloud, Wind, Volume2, Thermometer } from 'lucide-react';

export default function AtmosphereCard() {
  const { weather } = useVenue();

  return (
    <div className="bg-[var(--color-navy-card)] border border-[var(--color-navy-border)] rounded-2xl p-6 shadow-xl group">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
          <Cloud size={14} /> Atmosphere
        </h3>
        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded-full">Optimal</span>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col items-center">
          <Thermometer size={18} className="text-orange-400 mb-2" />
          <span className="text-lg font-black text-white">{weather.temp}°C</span>
          <span className="text-[9px] font-black text-slate-500 uppercase">Temp</span>
        </div>
        <div className="flex flex-col items-center">
          <Wind size={18} className="text-blue-400 mb-2" />
          <span className="text-lg font-black text-white">{weather.wind} km/h</span>
          <span className="text-[9px] font-black text-slate-500 uppercase">Wind</span>
        </div>
        <div className="flex flex-col items-center">
          <Volume2 size={18} className="text-purple-400 mb-2" />
          <span className="text-lg font-black text-white">{weather.noise} dB</span>
          <span className="text-[9px] font-black text-slate-500 uppercase">Ambient</span>
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-[var(--color-navy-border)]">
        <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase">
          <span>In-Bowl Decibel Cap</span>
          <span className="text-slate-300">110 dB</span>
        </div>
        <div className="mt-1.5 h-1 w-full bg-[#08111a] rounded-full overflow-hidden">
          <div className="h-full bg-purple-500" style={{width: `${(weather.noise/110)*100}%`}}></div>
        </div>
      </div>
    </div>
  );
}
