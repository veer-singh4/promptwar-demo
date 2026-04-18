import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useVenue } from '../context/VenueContext';
import { useMap, useMapsLibrary, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { 
  MapPin, Navigation as NavigationIcon, Car, Footprints, 
  Bus, Route, Map as MapIcon, ChevronRight, Timer, Milestone
} from 'lucide-react';
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

  // For host experience
  if (role === 'HOST') {
    return (
      <div className="flex flex-col h-full space-y-4 animate-in fade-in duration-500 pb-10">
        <header className="mb-4 text-center">
          <h1 className="text-2xl font-black text-white flex items-center justify-center gap-2">
            <MapIcon size={24} className="text-[var(--color-status-amber)]" />
            VENUE HUB
          </h1>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Configure Global Location</p>
        </header>
        <VenueConfigCard />
      </div>
    );
  }

  // Initialize Directions Service and Renderer
  useEffect(() => {
    if (!routesLibrary || !map) return;
    
    // Cleanup old renderer if it exists
    if (directionsRenderer) {
      directionsRenderer.setMap(null);
    }

    const ds = new routesLibrary.DirectionsService();
    const dr = new routesLibrary.DirectionsRenderer({ 
      map,
      suppressMarkers: true, // We will use our own advanced markers
      polylineOptions: { 
        strokeColor: '#3b82f6', 
        strokeWeight: 6, 
        strokeOpacity: 1 
      }
    });
    
    setDirectionsService(ds);
    setDirectionsRenderer(dr);

    return () => dr.setMap(null);
  }, [routesLibrary, map]);

  // Request & Sync Route
  useEffect(() => {
    if (!directionsService || !directionsRenderer || !routesLibrary) return;

    const fetchRoute = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const origin = { lat: position.coords.latitude, lng: position.coords.longitude };
            
            directionsService.route({
              origin,
              destination: stadiumLocation,
              travelMode: routesLibrary.TravelMode[travelMode],
            }, (result, status) => {
              if (status === 'OK') {
                directionsRenderer.setDirections(result);
                setRouteInfo(result.routes[0].legs[0]);
                setError(null);
                
                // Fit bounds to show route
                if (map) {
                  const bounds = new google.maps.LatLngBounds();
                  result.routes[0].overview_path.forEach(point => bounds.extend(point));
                  map.fitBounds(bounds, 50);
                }
              } else {
                setError("No optimal route found for this mode.");
              }
            });
          },
          () => setError("Please enable GPS for live routing.")
        );
      }
    };

    fetchRoute();
  }, [directionsService, directionsRenderer, travelMode, routesLibrary, venueLocation]);

  const modes = [
    { id: 'DRIVING', icon: Car },
    { id: 'WALKING', icon: Footprints },
    { id: 'TRANSIT', icon: Bus },
  ];

  return (
    <div className="flex flex-col h-full space-y-6 animate-in fade-in duration-500 pb-16">
      <header className="px-1 text-center">
        <h1 className="text-3xl font-black text-white leading-tight uppercase tracking-tighter">Match Navigation</h1>
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">{venueLocation.address}</p>
      </header>

      {/* Expanded Interactive Map */}
      <div className="h-[360px] w-full rounded-3xl border border-[var(--color-navy-border)] overflow-hidden shadow-2xl relative">
        <Map
          defaultCenter={stadiumLocation}
          defaultZoom={13}
          gestureHandling={'greedy'}
          disableDefaultUI={true}
          mapId="attendee_tracking_map_v2"
        >
          {/* Static Marker for Stadium */}
          <AdvancedMarker position={stadiumLocation}>
             <Pin background={'#ef4444'} glyphColor={'#fff'} borderColor={'#991b1b'} scale={1.2} />
          </AdvancedMarker>
        </Map>
        
        {/* Transparent Gradient Overlays */}
        <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-black/20 to-transparent pointer-events-none"></div>
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>

        {error && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-8 text-center z-20">
            <p className="text-white text-sm font-black uppercase tracking-widest flex flex-col items-center gap-3">
              <AlertCircle size={32} className="text-red-500" />
              {error}
            </p>
          </div>
        )}
      </div>

      {/* Travel Analytics Summary */}
      {routeInfo && (
        <div className="bg-gradient-to-br from-[var(--color-accent-blue)] to-[#1d4ed8] p-6 rounded-[2.5rem] shadow-2xl border border-blue-400/30">
          <div className="flex justify-between items-center text-white">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 opacity-70">
                <Timer size={12} className="shrink-0" />
                <span className="text-[10px] font-black uppercase tracking-wider">ETA</span>
              </div>
              <h2 className="text-4xl font-black tracking-tighter">{routeInfo.duration.text}</h2>
            </div>
            <div className="text-right space-y-1">
              <div className="flex items-center gap-1.5 opacity-70 justify-end">
                <Milestone size={12} className="shrink-0" />
                <span className="text-[10px] font-black uppercase tracking-wider">Dist</span>
              </div>
              <h2 className="text-2xl font-black tracking-tight">{routeInfo.distance.text}</h2>
            </div>
          </div>
        </div>
      )}

      {/* Travel Mode Selector */}
      <div className="p-1.5 bg-[var(--color-navy-card)] border border-[var(--color-navy-border)] rounded-[2rem] flex shadow-2xl">
        {modes.map((m) => (
          <button
            key={m.id}
            onClick={() => setTravelMode(m.id)}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-4 rounded-[1.5rem] transition-all active:scale-95 font-black uppercase tracking-tighter text-[10px]",
              travelMode === m.id 
                ? "bg-white text-[var(--color-navy-base)] shadow-2xl" 
                : "text-slate-500 hover:text-slate-300"
            )}
            title={m.id}
          >
            <m.icon size={16} />
            {m.id}
          </button>
        ))}
      </div>

      {/* Turn-by-Turn Directions List */}
      {routeInfo && (
        <section className="space-y-4">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
            <Route size={16} /> Suggested Directions
          </h3>
          <div className="bg-[var(--color-navy-card)] border border-[var(--color-navy-border)] rounded-3xl overflow-hidden shadow-xl max-h-[400px] overflow-y-auto custom-scrollbar">
            {routeInfo.steps.map((step, idx) => (
              <div 
                key={idx} 
                className={cn(
                  "p-5 flex gap-5 items-start transition-colors border-b border-white/5 last:border-0",
                  "hover:bg-white/[0.02]"
                )}
              >
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700">
                  <span className="text-[10px] font-black text-[var(--color-accent-blue)]">{idx + 1}</span>
                </div>
                <div className="flex-1 space-y-1">
                  <p 
                    className="text-white text-xs font-semibold leading-relaxed directions-html"
                    dangerouslySetInnerHTML={{ __html: step.instructions }}
                  />
                  <div className="flex items-center gap-3 text-[10px] text-slate-500 font-bold uppercase">
                    <span>{step.distance.text}</span>
                    <span className="text-[#3b82f6]/40">•</span>
                    <span>{step.duration.text}</span>
                  </div>
                </div>
                <ChevronRight size={14} className="text-slate-700 mt-1 shrink-0" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Host Specific Suggestion Card */}
      <div className="bg-[var(--color-navy-card)]/50 border border-white/5 p-6 rounded-3xl flex items-center gap-5 backdrop-blur-md">
        <div className="w-14 h-14 rounded-full bg-[var(--color-accent-blue)] flex items-center justify-center border-4 border-white/10 shrink-0">
          <NavigationIcon size={24} className="text-white" />
        </div>
        <div>
          <h4 className="text-[10px] font-black text-[#60a5fa] uppercase tracking-widest mb-1.5">Official Recommendation</h4>
          <p className="text-xs text-slate-300 font-medium leading-relaxed italic">"{venueLocation.suggestion || "Follow the optimized match-day route for fastest entry."}"</p>
        </div>
      </div>
    </div>
  );
}
