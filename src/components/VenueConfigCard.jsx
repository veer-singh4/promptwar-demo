import React, { useState, useCallback } from 'react';
import { useVenue } from '../context/VenueContext';
import { Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { Save, Globe, MapPin, Search } from 'lucide-react';

export default function VenueConfigCard() {
  const { venueLocation, setVenueLocation } = useVenue();
  const [address, setAddress] = useState(venueLocation.address);
  const [lat, setLat] = useState(venueLocation.lat);
  const [lng, setLng] = useState(venueLocation.lng);
  const [suggestion, setSuggestion] = useState(venueLocation.suggestion || '');

  // Handle map click to set new coordinates
  const onMapClick = useCallback((e) => {
    if (e.detail.latLng) {
      setLat(e.detail.latLng.lat);
      setLng(e.detail.latLng.lng);
      // In a real app, we would reverse-geocode the address here
      setAddress(`Lat: ${e.detail.latLng.lat.toFixed(4)}, Lng: ${e.detail.latLng.lng.toFixed(4)}`);
    }
  }, []);

  const handleSave = () => {
    setVenueLocation({ address, lat: parseFloat(lat), lng: parseFloat(lng), suggestion });
  };

  return (
    <div className="bg-[var(--color-navy-card)] border border-[var(--color-navy-border)] rounded-3xl p-6 shadow-2xl space-y-6">
      <header className="flex items-center justify-between">
        <h3 className="text-xs font-black text-[var(--color-accent-blue)] uppercase tracking-[0.2em] flex items-center gap-2">
          <Globe size={16} /> Venue Hub
        </h3>
        <div className="text-[10px] font-bold text-slate-500 bg-slate-800/50 px-2 py-1 rounded-lg">LIVE SYNC</div>
      </header>
      
      {/* Dynamic Map Picker */}
      <div className="space-y-3">
        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block px-1">STADIUM LOCATION (CLICK TO PICK)</label>
        <div className="h-48 w-full rounded-2xl border border-[var(--color-navy-border)] overflow-hidden shadow-inner relative group">
          <Map
            defaultCenter={{ lat: parseFloat(lat), lng: parseFloat(lng) }}
            defaultZoom={15}
            gestureHandling={'greedy'}
            disableDefaultUI={true}
            onClick={onMapClick}
            mapId="host_config_map"
          >
            <AdvancedMarker position={{ lat: parseFloat(lat), lng: parseFloat(lng) }}>
              <Pin background={'#3b82f6'} glyphColor={'#fff'} borderColor={'#1d4ed8'} />
            </AdvancedMarker>
          </Map>
          <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-md p-2 rounded-lg text-[9px] text-white font-bold pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
            Click anywhere on the map to drop a new venue pin
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <label className="text-[10px] font-black text-slate-500 uppercase mb-2 block px-1">Display Address / Name</label>
          <div className="relative">
            <input 
              type="text" 
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-[#08111a] border border-[var(--color-navy-border)] rounded-xl pl-10 pr-4 py-3 text-white text-xs focus:border-[var(--color-accent-blue)] outline-none font-bold"
              placeholder="e.g., Wembley Stadium, London"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase mb-2 block px-1 leading-none">Lat</label>
            <input 
              type="number" 
              step="any"
              value={lat}
              readOnly
              className="w-full bg-[#08111a]/50 border border-[var(--color-navy-border)] rounded-xl px-3 py-3 text-slate-400 text-xs outline-none font-mono"
            />
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase mb-2 block px-1 leading-none">Lng</label>
            <input 
              type="number" 
              step="any"
              value={lng}
              readOnly
              className="w-full bg-[#08111a]/50 border border-[var(--color-navy-border)] rounded-xl px-3 py-3 text-slate-400 text-xs outline-none font-mono"
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] font-black text-slate-500 uppercase mb-2 block px-1">Travel Instructions</label>
          <textarea 
            value={suggestion}
            onChange={(e) => setSuggestion(e.target.value)}
            className="w-full bg-[#08111a] border border-[var(--color-navy-border)] rounded-xl px-4 py-3 text-white text-xs focus:border-[var(--color-accent-blue)] outline-none min-h-[60px] font-medium leading-relaxed"
            placeholder="e.g. Best entrance: North Gate..."
          />
        </div>
      </div>

      <button 
        onClick={handleSave}
        className="w-full bg-[var(--color-accent-blue)] text-white font-black rounded-2xl py-4 text-xs flex items-center justify-center gap-2 hover:bg-blue-600 transition-all active:scale-95 shadow-xl shadow-blue-900/20"
      >
        <Save size={16} /> PUSH TO ALL DEVICES
      </button>
    </div>
  );
}
