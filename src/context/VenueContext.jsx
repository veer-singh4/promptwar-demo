import React, { createContext, useContext, useState, useEffect } from 'react';

const initialGates = [
  { id: "G1", label: "Gate 1", pct: 88, status: "avoid", pos: "top-4 left-1/2 -translate-x-1/2" },
  { id: "G3", label: "Gate 3", pct: 42, status: "busy", pos: "top-1/2 right-4 -translate-y-1/2" },
  { id: "G6", label: "Gate 6", pct: 21, status: "clear", pos: "bottom-4 left-1/2 -translate-x-1/2" },
  { id: "G8", label: "Gate 8", pct: 67, status: "busy", pos: "top-1/2 left-4 -translate-y-1/2" }
];

const initialParking = [
  { id: "P1", label: "Car Park A", pct: 80, pos: "top-4 left-4" },
  { id: "P2", label: "Car Park B", pct: 35, pos: "bottom-4 right-4" },
  { id: "P3", label: "VIP Auto", pct: 95, pos: "bottom-4 left-4" }
];

const initialFacilities = [
  { id: 'f1', type: "food",     label: "Food Court A",     wait: 13 },
  { id: 'f2', type: "food",     label: "Food Court B",     wait: 5  },
  { id: 'f3', type: "food",     label: "Food Court C",     wait: 4  },
  { id: 'r1', type: "restroom", label: "Restroom Block C", wait: 2  },
  { id: 'r2', type: "restroom", label: "Restroom Block F", wait: 9  },
  { id: 'm1', type: "merch",    label: "Merch Stand 1",    wait: 11 }
];

const initialAlerts = [
  { id: 'a1', type: "warn",    text: "Gate 1 at 88% — use Gate 6 instead." },
  { id: 'a2', type: "info",    text: "Metro every 6 min from Gate 7 post-match." },
  { id: 'a3', type: "success", text: "Food Court C dropped to 4 min wait." }
];

const VenueContext = createContext();

export const VenueProvider = ({ children }) => {
  const [gates, setGates] = useState(initialGates);
  const [parking, setParking] = useState(initialParking);
  const [facilities, setFacilities] = useState(initialFacilities);
  const [alerts, setAlerts] = useState(initialAlerts);
  const [helpRequests, setHelpRequests] = useState([]);

  const raiseEmergency = (type, location, details) => {
    const newRequest = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      location: location || "Unknown Location",
      details,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'active'
    };
    setHelpRequests(prev => [newRequest, ...prev]);
  };

  const resolveEmergency = (id) => {
    setHelpRequests(prev => prev.filter(req => req.id !== id));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setGates(prev => prev.map(g => {
        const diff = Math.floor(Math.random() * 7) - 3;
        let newPct = Math.max(0, Math.min(100, g.pct + diff));
        return { ...g, pct: newPct, status: newPct >= 71 ? 'avoid' : newPct >= 41 ? 'busy' : 'clear' };
      }));
      setParking(prev => prev.map(p => {
        const diff = Math.floor(Math.random() * 5) - 2;
        return { ...p, pct: Math.max(0, Math.min(100, p.pct + diff)) };
      }));
      setFacilities(prev => prev.map(fac => {
        const diff = Math.floor(Math.random() * 3) - 1;
        return { ...fac, wait: Math.max(0, fac.wait + diff) };
      }));
    }, 25000);
    return () => clearInterval(interval);
  }, []);

  return (
    <VenueContext.Provider value={{ gates, parking, facilities, alerts, helpRequests, setAlerts, raiseEmergency, resolveEmergency }}>
      {children}
    </VenueContext.Provider>
  );
};

export const useVenue = () => useContext(VenueContext);
