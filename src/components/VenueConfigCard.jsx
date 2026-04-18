import React, { useState } from 'react';
import { useVenue } from '../context/VenueContext';
import { Save, Globe } from 'lucide-react';

export default function VenueConfigCard() {
  const { venueLocation, setVenueLocation } = useVenue();
  const [address, setAddress] = useState(venueLocation.address);
  const [lat, setLat] = useState(venueLocation.lat);
  const [lng, setLng] = useState(venueLocation.lng);

  const handleSave = () => {
    setVenueLocation({ address, lat: parseFloat(lat), lng: parseFloat(lng) });
  };

  return (
    <div className="bg-[var(--color-navy-card)] border border-[var(--color-navy-border)] rounded-2xl p-6 shadow-xl space-y-4">
      <h3 className="text-xs font-black text-[var(--color-accent-blue)] uppercase tracking-[0.2em] flex items-center gap-2">
        <Globe size={16} /> Venue Configuration
      </h3>
      
      <div className="space-y-3">
        <div>
          <label className="text-[10px] font-black text-slate-500 uppercase mb-1 block">Stadium Address</label>
          <input 
            type="text" 
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full bg-[#08111a] border border-[var(--color-navy-border)] rounded-xl px-3 py-2 text-white text-sm focus:border-[var(--color-accent-blue)] outline-none"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase mb-1 block">Latitude</label>
            <input 
              type="number" 
              step="any"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              className="w-full bg-[#08111a] border border-[var(--color-navy-border)] rounded-xl px-3 py-2 text-white text-sm focus:border-[var(--color-accent-blue)] outline-none"
            />
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase mb-1 block">Longitude</label>
            <input 
              type="number" 
              step="any"
              value={lng}
              onChange={(e) => setLng(e.target.value)}
              className="w-full bg-[#08111a] border border-[var(--color-navy-border)] rounded-xl px-3 py-2 text-white text-sm focus:border-[var(--color-accent-blue)] outline-none"
            />
          </div>
        </div>
      </div>

      <button 
        onClick={handleSave}
        className="w-full bg-[var(--color-accent-blue)] text-white font-black rounded-xl py-3 text-xs flex items-center justify-center gap-2 hover:bg-blue-600 transition-all active:scale-95"
      >
        <Save size={14} /> UPDATE VENUE LOCATION
      </button>
    </div>
  );
}
