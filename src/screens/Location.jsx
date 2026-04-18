import React, { useState, useEffect } from 'react';
import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { MapPin, Navigation, Car, Footprints, Bus } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Location() {
  const map = useMap();
  const routesLibrary = useMapsLibrary('routes');
  
  const [directionsService, setDirectionsService] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const [travelMode, setTravelMode] = useState('WALKING');
  const [routeInfo, setRouteInfo] = useState(null);
  const [error, setError] = useState(null);

  const stadiumLocation = { lat: 51.5560, lng: -0.2795 }; // Wembley Stadium

  useEffect(() => {
    if (!routesLibrary || !map) return;
    const ds = new routesLibrary.DirectionsService();
    const dr = new routesLibrary.DirectionsRenderer({ 
      map,
      polylineOptions: {
        strokeColor: '#3b82f6',
        strokeWeight: 6,
        strokeOpacity: 0.8
      }
    });
    setDirectionsService(ds);
    setDirectionsRenderer(dr);
  }, [routesLibrary, map]);

  useEffect(() => {
    if (!directionsService || !directionsRenderer || !routesLibrary) return;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const origin = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

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
              setError("Could not find a route to the stadium.");
            }
          });
        },
        () => {
          setError("Please enable location services to get directions.");
        }
      );
    }
  }, [directionsService, directionsRenderer, travelMode, routesLibrary]);

  const modes = [
    { id: 'DRIVING', icon: Car },
    { id: 'WALKING', icon: Footprints },
    { id: 'TRANSIT', icon: Bus },
  ];

  return (
    <div className="flex flex-col h-full space-y-4 animate-in fade-in duration-500">
      <header>
        <h1 className="text-2xl font-black text-white px-1">Getting Here</h1>
        <p className="text-slate-400 text-xs px-1 uppercase tracking-widest font-bold">Wembley Stadium, London HA9 0WS</p>
      </header>

      {/* Travel Mode Selector */}
      <div className="flex bg-[var(--color-navy-card)] border border-[var(--color-navy-border)] p-1 rounded-2xl">
        {modes.map((m) => (
          <button
            key={m.id}
            onClick={() => setTravelMode(m.id)}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all",
              travelMode === m.id ? "bg-[var(--color-accent-blue)] text-white shadow-lg" : "text-slate-400 hover:text-slate-200"
            )}
          >
            <m.icon size={18} />
            <span className="text-[10px] font-black uppercase tracking-tighter">{m.id}</span>
          </button>
        ))}
      </div>

      {/* Route Info Card */}
      {routeInfo ? (
        <div className="bg-gradient-to-br from-[var(--color-accent-blue)] to-blue-700 p-5 rounded-3xl shadow-xl border border-blue-400/30">
          <div className="flex justify-between items-center text-white">
            <div>
              <p className="text-[10px] font-black uppercase opacity-80 mb-1">Estimated Arrival</p>
              <h2 className="text-3xl font-black leading-none">{routeInfo.duration.text}</h2>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black uppercase opacity-80 mb-1">Distance</p>
              <h2 className="text-xl font-black">{routeInfo.distance.text}</h2>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/20 flex items-center justify-between text-white/90 text-xs font-bold">
            <div className="flex items-center gap-2">
              <MapPin size={14} />
              <span>Current Position</span>
            </div>
            <div className="h-px w-8 bg-white/20"></div>
            <div className="flex items-center gap-2">
              <Navigation size={14} />
              <span>Stadium</span>
            </div>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-2xl text-red-400 text-sm font-bold text-center">
          {error}
        </div>
      ) : (
        <div className="bg-[var(--color-navy-card)] border border-[var(--color-navy-border)] p-8 rounded-2xl flex flex-col items-center justify-center space-y-3 opacity-50">
          <div className="w-8 h-8 border-2 border-slate-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-bold tracking-widest text-slate-400 uppercase">Calculating Route...</p>
        </div>
      )}

      {/* Mini Hint */}
      <div className="bg-[#08111a] border border-[var(--color-navy-border)] p-4 rounded-2xl flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
          <Navigation size={20} className="text-[var(--color-accent-blue)]" />
        </div>
        <div>
          <h4 className="text-xs font-black text-white">Live Navigation</h4>
          <p className="text-[10px] text-slate-500 leading-tight">Follow the blue line on the map above to reach the main entrance.</p>
        </div>
      </div>
    </div>
  );
}
