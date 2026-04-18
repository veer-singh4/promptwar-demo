import React, { useState, useEffect } from 'react';
import { useVenue } from '../context/VenueContext';
import { useAuth } from '../context/AuthContext';
import { Map, AdvancedMarker, InfoWindow, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { cn } from '../lib/utils';
import { Navigation } from 'lucide-react';

/**
 * Helper component to handle drawing directions on the map
 */
const Directions = ({ destination, onDistanceLoaded }) => {
  const map = useMap();
  const routesLibrary = useMapsLibrary('routes');
  const [directionsService, setDirectionsService] = useState();
  const [directionsRenderer, setDirectionsRenderer] = useState();

  useEffect(() => {
    if (!routesLibrary || !map) return;
    setDirectionsService(new routesLibrary.DirectionsService());
    setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ 
      map,
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: '#3b82f6',
        strokeWeight: 5,
        strokeOpacity: 0.8
      }
    }));
  }, [routesLibrary, map]);

  useEffect(() => {
    if (!directionsService || !directionsRenderer || !destination) {
      if (directionsRenderer) directionsRenderer.setDirections({ routes: [] });
      return;
    }

    directionsService.route({
      origin: { lat: 51.5560, lng: -0.2795 }, // Static main transport hub
      destination: destination,
      travelMode: google.maps.TravelMode.WALKING,
    }).then(response => {
      directionsRenderer.setDirections(response);
      const route = response.routes[0].legs[0];
      if (onDistanceLoaded) onDistanceLoaded(route.duration.text);
    }).catch(err => console.error("Navigation Error:", err));
  }, [directionsService, directionsRenderer, destination]);

  return null;
};

/**
 * CrowdMap component provides a visual overview of venue crowding using Google Maps.
 */
export default function CrowdMap() {
  const { gates, parking } = useVenue();
  const { role } = useAuth();
  const [selectedZone, setSelectedZone] = useState(null);
  const [navTarget, setNavTarget] = useState(null);
  const [walkTime, setWalkTime] = useState(null);
  const [address, setAddress] = useState("Loading location...");
  
  const center = { lat: 51.5560, lng: -0.2795 }; 
  const geocodingLibrary = useMapsLibrary('geocoding');

  useEffect(() => {
    if (!geocodingLibrary) return;
    const geocoder = new geocodingLibrary.Geocoder();
    geocoder.geocode({ location: center }, (results, status) => {
      if (status === 'OK' && results[0]) {
        setAddress(results[0].formatted_address);
      }
    });
  }, [geocodingLibrary]);

  const getStatusColor = (pct) => {
    if (pct > 70) return 'bg-[#E24B4A]';
    if (pct > 40) return 'bg-[#EF9F27]';
    return 'bg-[#1D9E75]';
  };

  const mapOptions = {
    disableDefaultUI: true,
    zoomControl: true,
    mapId: 'VENUE_IQ_DARK_MAP',
    styles: [
      { "elementType": "geometry", "stylers": [{ "color": "#0d1b2a" }] },
      { "elementType": "labels.text.fill", "stylers": [{ "color": "#7489a8" }] },
      { "elementType": "labels.text.stroke", "stylers": [{ "color": "#0d1b2a" }] },
      { "featureType": "poi", "stylers": [{ "visibility": "off" }] },
      { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#1b263b" }] },
      { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#08111a" }] }
    ]
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 flex flex-col h-full" role="region" aria-label="Crowd Density Map">
      <header>
        <h1 className="text-2xl font-black text-white leading-tight">
          {role === 'HOST' ? 'Operations Overview' : 'Live Crowd Map'}
        </h1>
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{address}</p>
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
          <Directions 
            destination={navTarget} 
            onDistanceLoaded={(t) => setWalkTime(t)} 
          />

          {/* Markers Logic */}
          {gates.map((g, idx) => {
             const pos = { lat: center.lat + (idx * 0.002 - 0.005), lng: center.lng + (idx * 0.001 - 0.002) };
             return (
              <AdvancedMarker
                key={g.id}
                position={pos}
                onClick={() => {
                  setSelectedZone({ ...g, type: 'Gate', pos });
                  setNavTarget(null);
                  setWalkTime(null);
                }}
              >
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center border-2 border-white/20 shadow-xl transition-transform hover:scale-110",
                  getStatusColor(g.pct)
                )}>
                  <span className="text-[10px] font-black text-white">{g.id}</span>
                </div>
              </AdvancedMarker>
             );
          })}

          {parking.map((p, idx) => {
            const pos = { lat: center.lat - (idx * 0.003 - 0.004), lng: center.lng - (idx * 0.002 - 0.003) };
            return (
              <AdvancedMarker
                key={p.id}
                position={pos}
                onClick={() => {
                  setSelectedZone({ ...p, type: 'Parking', pos });
                  setNavTarget(null);
                  setWalkTime(null);
                }}
              >
                 <div className={cn(
                  "w-12 h-8 rounded-lg flex items-center justify-center border-2 border-dashed border-white/30 shadow-lg",
                  getStatusColor(p.pct)
                )}>
                  <span className="text-[9px] font-black text-white">{p.id}</span>
                </div>
              </AdvancedMarker>
            );
          })}

          {selectedZone && (
            <InfoWindow
              position={selectedZone.pos}
              onCloseClick={() => {
                setSelectedZone(null);
                setNavTarget(null);
              }}
            >
              <div className="p-3 text-[#0d1b2a] min-w-[160px]">
                <h3 className="font-bold border-b pb-1 mb-2 text-sm">{selectedZone.label}</h3>
                <div className="space-y-1 mb-4">
                  <p className="text-[10px]">Occupancy: <strong>{selectedZone.pct}%</strong></p>
                  {walkTime && <p className="text-[10px] text-blue-600 font-bold">Estimated Arrival: {walkTime}</p>}
                </div>
                
                <button 
                  onClick={() => setNavTarget(selectedZone.pos)}
                  className="w-full bg-[#3b82f6] text-white py-2 rounded-lg text-[10px] font-black flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors"
                >
                  <Navigation size={12} /> GET DIRECTIONS
                </button>
              </div>
            </InfoWindow>
          )}
        </Map>
      </div>

      <div className="bg-[var(--color-navy-card)]/50 border border-[var(--color-navy-border)] rounded-2xl p-5 mt-auto shadow-lg backdrop-blur-sm">
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Occupancy Legend</h3>
        <div className="flex justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#1D9E75] shadow-[0_0_8px_rgba(29,158,117,1)]"></div>
            <span className="text-[11px] font-bold text-slate-300">Optimal</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#EF9F27] shadow-[0_0_8px_rgba(239,159,39,1)]"></div>
            <span className="text-[11px] font-bold text-slate-300">Busy</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#E24B4A] shadow-[0_0_8px_rgba(226,75,74,1)]"></div>
            <span className="text-[11px] font-bold text-slate-300">Crowded</span>
          </div>
        </div>
      </div>
    </div>
  );
}
