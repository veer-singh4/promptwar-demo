import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation, Navigate, Routes, Route } from 'react-router-dom';
import { 
  Home as HomeIcon, Map as MapIcon, Clock as ClockIcon, ClipboardList, Info,
  LayoutDashboard, BarChart2, AlertOctagon, LogOut
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Import screens
import Home from '../screens/Home';
import CrowdMap from '../screens/CrowdMap';
import WaitTimes from '../screens/WaitTimes';
import MyPlan from '../screens/MyPlan';
import Help from '../screens/Help';
import HostDashboard from '../screens/HostDashboard';
import HostMetrics from '../screens/HostMetrics';
import HostAlerts from '../screens/HostAlerts';

export function cn(...inputs) { return twMerge(clsx(inputs)); }

export default function MobileLayout() {
  const { role, logout } = useAuth();
  const location = useLocation();

  if (!role) return <Navigate to="/login" replace />;

  const attendeeNav = [
    { name: 'Home', path: '/', icon: HomeIcon },
    { name: 'Map', path: '/map', icon: MapIcon },
    { name: 'Waits', path: '/wait-times', icon: ClockIcon },
    { name: 'Plan', path: '/plan', icon: ClipboardList },
    { name: 'Help', path: '/help', icon: Info },
  ];

  const hostNav = [
    { name: 'Command', path: '/', icon: LayoutDashboard },
    { name: 'Sys Map', path: '/map', icon: MapIcon },
    { name: 'Metrics', path: '/wait-times', icon: BarChart2 },
    { name: 'Alerts', path: '/host-alerts', icon: AlertOctagon },
  ];

  const currentNav = role === 'HOST' ? hostNav : attendeeNav;

  return (
    <div className="flex flex-col h-screen h-[100dvh] overflow-hidden font-sans bg-[var(--color-navy-base)] text-slate-50 relative p-4 pb-20">
      
      {/* Top micro-bar showing auth state */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-[var(--color-navy-border)] z-50">
        <div className={cn("h-full", role === 'HOST' ? "bg-[var(--color-status-amber)]" : "bg-[var(--color-accent-blue)]")} style={{width: '100%'}}></div>
      </div>

      {/* Logout bubble */}
      <button onClick={logout} className="absolute top-4 right-4 z-50 bg-[var(--color-navy-card)] border border-[var(--color-navy-border)] w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer" title="Log Out">
        <LogOut size={16} />
      </button>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-md mx-auto h-full pt-12 pb-6">
           <Routes>
            {role === 'HOST' ? (
              <>
                <Route path="/" element={<HostDashboard />} />
                <Route path="/map" element={<CrowdMap />} />
                <Route path="/wait-times" element={<HostMetrics />} />
                <Route path="/host-alerts" element={<HostAlerts />} />
                <Route path="*" element={<Navigate to="/" />} />
              </>
            ) : (
              <>
                <Route path="/" element={<Home />} />
                <Route path="/map" element={<CrowdMap />} />
                <Route path="/wait-times" element={<WaitTimes />} />
                <Route path="/plan" element={<MyPlan />} />
                <Route path="/help" element={<Help />} />
                <Route path="*" element={<Navigate to="/" />} />
              </>
            )}
          </Routes>
        </div>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 w-full bg-[var(--color-navy-card)] border-t border-[var(--color-navy-border)] z-50 left-0">
        <div className="flex justify-around items-center h-16 pb-safe max-w-md mx-auto">
          {currentNav.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            const accentCls = role === 'HOST' ? "text-[var(--color-status-amber)]" : "text-[var(--color-accent-blue)]";
            return (
              <Link key={item.name} to={item.path} className={cn("flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors touch-manipulation min-h-[44px]", isActive ? accentCls : "text-slate-400 hover:text-slate-200")}>
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
