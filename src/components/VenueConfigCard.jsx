import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useVenue } from '../context/VenueContext';
import { Map, AdvancedMarker, Pin, useMapsLibrary, useMap } from '@vis.gl/react-google-maps';
import { Save, Globe, MapPin, Search } from 'lucide-react';

export default function VenueConfigCard() {
  const { venueLocation, setVenueLocation } = useVenue();
  const map = useMap();
  const placesLibrary = useMapsLibrary('places');
  const geocodingLibrary = useMapsLibrary('geocoding');
  
  const [address, setAddress] = useState(venueLocation.address);
  const [lat, setLat] = useState(venueLocation.lat);
  const [lng, setLng] = useState(venueLocation.lng);
  const [suggestion, setSuggestion] = useState(venueLocation.suggestion || '');
  
  const inputRef = useRef(null);
  const [autocomplete, setAutocomplete] = useState(null);

  // Initialize Autocomplete with robustness
  useEffect(() => {
    if (!placesLibrary || !inputRef.current || !window.google) return;

    try {
      const options = {
        fields: ['geometry', 'formatted_address', 'name'],
        types: ['establishment', 'geocode']
      };

      const ac = new window.google.maps.places.Autocomplete(inputRef.current, options);
      setAutocomplete(ac);

      return () => {
        if (ac && window.google) {
          window.google.maps.event.clearInstanceListeners(ac);
        }
      };
    } catch (err) {
      console.error("Autocomplete failed to init:", err);
    }
  }, [placesLibrary]);

  // Handle place selection
  useEffect(() => {
    if (!autocomplete) return;

    const listener = autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      
      if (!place.geometry || !place.geometry.location) {
        console.warn("Place has no geometry data.");
        return;
      }

      const newLat = place.geometry.location.lat();
      const newLng = place.geometry.location.lng();
      
      setLat(newLat);
      setLng(newLng);
      setAddress(place.formatted_address || place.name || '');

      // Center map on new place
      if (map) {
        map.setCenter({ lat: newLat, lng: newLng });
        map.setZoom(16);
      }
    });

    return () => {
      if (window.google) {
        window.google.maps.event.removeListener(listener);
      }
    };
  }, [autocomplete, map]);

  // Handle map click to set new coordinates manually with Reverse Geocoding
  const onMapClick = useCallback((e) => {
    if (e.detail.latLng) {
      const newLat = e.detail.latLng.lat;
      const newLng = e.detail.latLng.lng;
      setLat(newLat);
      setLng(newLng);
      
      if (geocodingLibrary) {
        const geocoder = new geocodingLibrary.Geocoder();
        geocoder.geocode({ location: { lat: newLat, lng: newLng } }, (results, status) => {
          if (status === "OK" && results[0]) {
            setAddress(results[0].formatted_address);
          } else {
            setAddress(`Pinned: ${newLat.toFixed(4)}, ${newLng.toFixed(4)}`);
          }
        });
      } else {
        setAddress(`Pinned: ${newLat.toFixed(4)}, ${newLng.toFixed(4)}`);
      }
    }
  }, [geocodingLibrary]);

  const handleSave = () => {
    setVenueLocation({ address, lat: parseFloat(lat), lng: parseFloat(lng), suggestion });
  };

  return (
    <div className="bg-[var(--color-navy-card)] border border-[var(--color-navy-border)] rounded-3xl p-6 shadow-2xl space-y-6">
      <header className="flex items-center justify-between">
        <h3 className="text-xs font-black text-[var(--color-accent-blue)] uppercase tracking-[0.2em] flex items-center gap-2">
          <Globe size={16} /> Venue Hub
        </h3>
        <div className="text-[10px] font-bold text-slate-500 bg-slate-800/50 px-2 py-1 rounded-lg tracking-widest uppercase">Sync Active</div>
      </header>
      
      <div className="space-y-3">
        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block px-1">STADIUM LOCATION (PICK OR SEARCH)</label>
        <div className="h-48 w-full rounded-2xl border border-[var(--color-navy-border)] overflow-hidden shadow-inner relative group bg-slate-900/50">
          <Map
            center={{ lat: parseFloat(lat), lng: parseFloat(lng) }}
            zoom={15}
            gestureHandling={'greedy'}
            disableDefaultUI={true}
            onClick={onMapClick}
            mapId="host_config_map"
          >
            <AdvancedMarker position={{ lat: parseFloat(lat), lng: parseFloat(lng) }}>
              <Pin background={'#3b82f6'} glyphColor={'#fff'} borderColor={'#1d4ed8'} />
            </AdvancedMarker>
          </Map>
        </div>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <label className="text-[10px] font-black text-slate-500 uppercase mb-2 block px-1">Global Address Search</label>
          <div className="relative">
            <input 
              ref={inputRef}
              type="text" 
              defaultValue={address}
              className="w-full bg-[#08111a] border border-[var(--color-navy-border)] rounded-xl pl-10 pr-4 py-4 text-white text-xs focus:border-[var(--color-accent-blue)] outline-none font-bold placeholder:text-slate-700 shadow-inner"
              placeholder="Type stadium name or location..."
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase mb-2 block px-1 leading-none">Latitude</label>
            <input 
              type="number" 
              step="any"
              value={lat}
              readOnly
              className="w-full bg-[#08111a]/50 border border-[var(--color-navy-border)] rounded-xl px-3 py-3 text-slate-400 text-[10px] outline-none font-mono"
            />
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase mb-2 block px-1 leading-none">Longitude</label>
            <input 
              type="number" 
              step="any"
              value={lng}
              readOnly
              className="w-full bg-[#08111a]/50 border border-[var(--color-navy-border)] rounded-xl px-3 py-3 text-slate-400 text-[10px] outline-none font-mono"
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] font-black text-slate-500 uppercase mb-2 block px-1">Host Suggestions</label>
          <textarea 
            value={suggestion}
            onChange={(e) => setSuggestion(e.target.value)}
            className="w-full bg-[#08111a] border border-[var(--color-navy-border)] rounded-xl px-4 py-3 text-white text-xs focus:border-[var(--color-accent-blue)] outline-none min-h-[60px] font-medium leading-relaxed placeholder:text-slate-700"
            placeholder="e.g. Use Gate 4 for VIP access..."
          />
        </div>
      </div>

      <button 
        onClick={handleSave}
        className="w-full bg-[var(--color-accent-blue)] text-white font-black rounded-2xl py-4 text-xs flex items-center justify-center gap-2 hover:bg-blue-600 transition-all active:scale-95 shadow-xl shadow-blue-900/40"
      >
        <Save size={16} /> SYNC TO ALL DEVICES
      </button>
    </div>
  );
}
