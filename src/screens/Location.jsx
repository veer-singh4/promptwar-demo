import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useVenue } from '../context/VenueContext';
import { useMap, useMapsLibrary, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { MapPin, Navigation as NavigationIcon, Car, Footprints, Bus, Route, Map as MapIcon } from 'lucide-react';
import { cn } from '../lib/utils';
import VenueConfigCard from '../components/VenueConfigCard';

export default function Location() {
  const { role } = useAuth();
  const map = useMap();
  const routesLibrary = useMapsLibrary('routes');
  const { venueLocation } = useVenue();
  
  const [directionsService, setDirectionsService] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const [travelMode, setTravelMode] = useState('WALKING');
  const [routeInfo, setRouteInfo] = useState(null);
  const [error, setError] = useState(null);

  const stadiumLocation = { lat: venueLocation.lat, lng: venueLocation.lng };

  // For host, do not load map tracking, just show the config
  if (role === 'HOST') {
    return (
      <div className="flex flex-col h-full space-y-4 animate-in fade-in duration-500 pb-10">
        <header className="mb-4 text-center">
          <h1 className="text-2xl font-black text-white flex items-center justify-center gap-2">
            <MapIcon size={24} className="text-[var(--color-status-amber)]" />
            VENUE HUB
          </h1>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Global Location Command</p>
        </header>
        <VenueConfigCard />
      </div>
    );
  }

  // Initialize Directions Service
  useEffect(() => {
    if (!routesLibrary || !map) return;
    const ds = new routesLibrary.DirectionsService();
    const dr = new routesLibrary.DirectionsRenderer({ 
      map,
      polylineOptions: { strokeColor: '#3b82f6', strokeWeight: 6, strokeOpacity: 0.8 }
    });
    setDirectionsService(ds);
    setDirectionsRenderer(dr);
  }, [routesLibrary, map]);

  // Request Route
  useEffect(() => {
    if (!directionsService || !directionsRenderer || !routesLibrary) return;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const origin = { lat: position.coords.latitude, lng: position.coords.longitude };
          directionsService.route({
            origin: origin,
            destination: stadiumLocation,
            travelMode: routesLibrary.TravelMode[travelMode],
          }, (result, status) => {
            if (status === 'OK') {
              directionsRenderer.setDirections(result);
              setRouteInfo(result.routes[0].legs[0]);
              setError(null);
            } else {
              setError("Route mapping failed. Please check GPS.");
            }
          });
        },
        () => setError("Location access denied. Routing limited.")
      );
    }
  }, [directionsService, directionsRenderer, travelMode, routesLibrary, venueLocation]);

  const modes = [
    { id: 'DRIVING', icon: Car },
    { id: 'WALKING', icon: Footprints },
    { id: 'TRANSIT', icon: Bus },
  ];

  return (
    <div className="flex flex-col h-full space-y-4 animate-in fade-in duration-500 pb-6">
      <header className="px-1">
        <h1 className="text-2xl font-black text-white leading-tight">GETTING HERE</h1>
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{venueLocation.address}</p>
      </header>

      {/* Main Interactive Map */}
      <div className="h-56 w-full rounded-3xl border border-[var(--color-navy-border)] overflow-hidden shadow-2xl relative">
        <Map
          defaultCenter={stadiumLocation}
          defaultZoom={13}
          gestureHandling={'greedy'}
          disableDefaultUI={true}
          mapId="attendee_tracking_map"
        >
          <AdvancedMarker position={stadiumLocation}>
            <Pin background={'#ef4444'} glyphColor={'#fff'} borderColor={'#991b1b'} />
          </AdvancedMarker>
        </Map>
        {error && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 text-center">
            <p className="text-red-400 text-xs font-black uppercase tracking-wider">{error}</p>
          </div>
        )}
      </div>

      {/* Travel Mode Selector */}
      <div className="flex bg-[var(--color-navy-card)] border border-[var(--color-navy-border)] p-1 rounded-2xl shadow-lg">
        {modes.map((m) => (
          <button
            key={m.id}
            onClick={() => setTravelMode(m.id)}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl transition-all active:scale-95",
              travelMode === m.id ? "bg-[var(--color-accent-blue)] text-white shadow-xl" : "text-slate-500 hover:text-slate-300"
            )}
          >
            <m.icon size={16} />
            <span className="text-[9px] font-black uppercase tracking-tighter">{m.id}</span>
          </button>
        ))}
      </div>

      {/* Dynamic Route Insights */}
      {routeInfo ? (
        <div className="bg-gradient-to-br from-[var(--color-accent-blue)] to-[#1d4ed8] p-5 rounded-[2rem] shadow-2xl border border-blue-400/30 flex flex-col justify-between">
          <div className="flex justify-between items-center text-white mb-4">
            <div>
              <p className="text-[9px] font-black uppercase opacity-70 mb-1">Estimated Journey</p>
              <h2 className="text-3xl font-black">{routeInfo.duration.text}</h2>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-black uppercase opacity-70 mb-1">Remaining</p>
              <h2 className="text-xl font-black">{routeInfo.distance.text}</h2>
            </div>
          </div>
          <div className="flex items-center gap-4 text-white/80 text-[10px] font-bold bg-black/20 p-3 rounded-xl border border-white/10">
            <Route size={16} className="shrink-0" />
            <p className="leading-snug">{venueLocation.suggestion || "Follow the optimized match-day route for fastest entry."}</p>
          </div>
        </div>
      ) : (
        <div className="bg-[var(--color-navy-card)] border border-[var(--color-navy-border)] p-8 rounded-[2rem] flex flex-col items-center justify-center space-y-3 opacity-60">
          <div className="w-8 h-8 border-[3px] border-slate-700 border-t-[var(--color-accent-blue)] rounded-full animate-spin"></div>
          <p className="text-[10px] font-black tracking-[0.2em] text-slate-500 uppercase">Syncing Directions...</p>
        </div>
      )}

      {/* Bottom Context Hint */}
      <div className="bg-[#08111a] border border-[var(--color-navy-border)] p-4 rounded-2xl flex items-center gap-4 transition-colors hover:border-slate-700">
        <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center border border-slate-800">
          <NavigationIcon size={18} className="text-[var(--color-accent-blue)]" />
        </div>
        <div>
          <h4 className="text-[10px] font-black text-white uppercase tracking-wider">LIVE GPS OVERLAY</h4>
          <p className="text-[9px] text-slate-500 font-bold leading-tight">Match your physical movement with the blue line on the map above.</p>
        </div>
      </div>
    </div>
  );
}
