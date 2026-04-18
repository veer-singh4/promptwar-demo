import React, { useState } from 'react';
import { useVenue } from '../context/VenueContext';
import { useAuth } from '../context/AuthContext';
import { Map, AdvancedMarker, InfoWindow } from '@vis.gl/react-google-maps';
import { cn } from '../lib/utils';

/**
 * CrowdMap component provides a visual overview of venue crowding using Google Maps.
 */
export default function CrowdMap() {
  const { gates, parking } = useVenue();
  const { role } = useAuth();
  const [selectedZone, setSelectedZone] = useState(null);
  
  // Center of the venue (stadium coordinates - approx for demo)
  const center = { lat: 51.5560, lng: -0.2795 }; // Example: Wembley Stadium

  /**
   * Helper to determine density status color classes
   */
  const getStatusColor = (pct) => {
    if (pct > 70) return 'bg-[#E24B4A]';
    if (pct > 40) return 'bg-[#EF9F27]';
    return 'bg-[#1D9E75]';
  };

  const mapOptions = {
    disableDefaultUI: true,
    zoomControl: true,
    mapId: 'VENUE_IQ_DARK_MAP', // Requires configuration in Google Cloud Console
    styles: [
      { "elementType": "geometry", "stylers": [{ "color": "#0d1b2a" }] },
      { "elementType": "labels.text.fill", "stylers": [{ "color": "#7489a8" }] },
      { "elementType": "labels.text.stroke", "stylers": [{ "color": "#0d1b2a" }] },
      { "featureType": "administrative", "elementType": "geometry", "stylers": [{ "visibility": "off" }] },
      { "featureType": "poi", "stylers": [{ "visibility": "off" }] },
      { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#1b263b" }] },
      { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#08111a" }] }
    ]
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 flex flex-col h-full" role="region" aria-label="Crowd Density Map">
      <header>
        <h1 className="text-2xl font-black text-white leading-tight">
          {role === 'HOST' ? 'Operations Overview' : 'Live Crowd Density'}
        </h1>
        <p className="text-slate-400 text-sm">Zone-level traffic monitoring updating in real-time.</p>
      </header>

      <div 
        className="bg-[#050b14] border-2 border-[var(--color-navy-border)] rounded-[2rem] h-[400px] relative shadow-2xl overflow-hidden shrink-0 mt-2"
        role="application"
        aria-label="Interactive Google Map of the venue"
      >
        <Map
          defaultCenter={center}
          defaultZoom={17}
          options={mapOptions}
          mapTypeId={'roadmap'}
        >
          {/* Dynamic Gate Markers */}
          {gates.map((g, idx) => (
            <AdvancedMarker
              key={g.id}
              position={{ lat: center.lat + (idx * 0.002 - 0.005), lng: center.lng + (idx * 0.001 - 0.002) }}
              onClick={() => setSelectedZone({ ...g, type: 'Gate' })}
            >
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center border-2 border-white/20 shadow-xl transition-transform hover:scale-110",
                getStatusColor(g.pct)
              )}>
                <span className="text-[10px] font-black text-white">{g.id}</span>
              </div>
            </AdvancedMarker>
          ))}

          {/* Dynamic Parking Markers */}
          {parking.map((p, idx) => (
            <AdvancedMarker
              key={p.id}
              position={{ lat: center.lat - (idx * 0.003 - 0.004), lng: center.lng - (idx * 0.002 - 0.003) }}
              onClick={() => setSelectedZone({ ...p, type: 'Parking' })}
            >
               <div className={cn(
                "w-12 h-8 rounded-lg flex items-center justify-center border-2 border-dashed border-white/30 shadow-lg",
                getStatusColor(p.pct)
              )}>
                <span className="text-[9px] font-black text-white">{p.id}</span>
              </div>
            </AdvancedMarker>
          ))}

          {selectedZone && (
            <InfoWindow
              position={{ lat: center.lat, lng: center.lng }}
              onCloseClick={() => setSelectedZone(null)}
            >
              <div className="p-2 text-[#0d1b2a]">
                <h3 className="font-bold border-b pb-1 mb-1">{selectedZone.label}</h3>
                <p className="text-xs">{selectedZone.type} Status: <strong>{selectedZone.pct}% Capacity</strong></p>
                {selectedZone.wait && <p className="text-xs">Estimated Wait: <strong>{selectedZone.wait} min</strong></p>}
              </div>
            </InfoWindow>
          )}
        </Map>
      </div>

      {/* Map Content Legend */}
      <div className="bg-[var(--color-navy-card)]/50 border border-[var(--color-navy-border)] rounded-2xl p-5 mt-auto shadow-lg backdrop-blur-sm">
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Live Legend</h3>
        <div className="flex justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#1D9E75] shadow-[0_0_8px_rgba(29,158,117,1)]"></div>
            <span className="text-[11px] font-bold text-slate-300">Optimal</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#EF9F27] shadow-[0_0_8px_rgba(239,159,39,1)]"></div>
            <span className="text-[11px] font-bold text-slate-300">Congested</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#E24B4A] shadow-[0_0_8px_rgba(226,75,74,1)]"></div>
            <span className="text-[11px] font-bold text-slate-300">At Limit</span>
          </div>
        </div>
      </div>
    </div>
  );
}
