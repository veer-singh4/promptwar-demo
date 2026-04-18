import React, { Suspense, lazy } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation, Navigate, Routes, Route } from 'react-router-dom';
import { 
  Home as HomeIcon, Map as MapIcon, Info,
  LayoutDashboard, AlertOctagon, LogOut, Navigation as NavigationIcon
} from 'lucide-react';
import { cn } from '../lib/utils';
import ErrorBoundary from './ErrorBoundary';

// Lazy load screens for performance
const Home = lazy(() => import('../screens/Home'));
const CrowdMap = lazy(() => import('../screens/CrowdMap'));
const WaitTimes = lazy(() => import('../screens/WaitTimes'));
const MyPlan = lazy(() => import('../screens/MyPlan'));
const Help = lazy(() => import('../screens/Help'));
const Assistant = lazy(() => import('../screens/Assistant'));
const LocationScreen = lazy(() => import('../screens/Location'));
const HostDashboard = lazy(() => import('../screens/HostDashboard'));
const HostMetrics = lazy(() => import('../screens/HostMetrics'));
const HostAlerts = lazy(() => import('../screens/HostAlerts'));

export default function MobileLayout() {
  const { role, logout } = useAuth();
  const location = useLocation();

  if (!role) return <Navigate to="/login" replace />;

  const attendeeNav = [
    { name: 'Home', path: '/', icon: HomeIcon },
    { name: 'Map', path: '/map', icon: MapIcon },
    { name: 'Travel', path: '/location', icon: NavigationIcon },
    { name: 'Help', path: '/help', icon: Info },
  ];

  const hostNav = [
    { name: 'Command', path: '/', icon: LayoutDashboard },
    { name: 'Sys Map', path: '/map', icon: MapIcon },
    { name: 'Travel', path: '/location', icon: NavigationIcon },
    { name: 'Alerts', path: '/host-alerts', icon: AlertOctagon },
  ];

  const currentNav = role === 'HOST' ? hostNav : attendeeNav;

  return (
    <div className="flex flex-col h-screen h-[100dvh] overflow-hidden font-sans bg-[var(--color-navy-base)] text-slate-50 relative">
      
      {/* Top micro-bar showing auth state */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-[var(--color-navy-border)] z-[100]">
        <div className={cn("h-full transition-all duration-1000", role === 'HOST' ? "bg-[var(--color-status-amber)]" : "bg-[var(--color-accent-blue)]")} style={{width: '100%'}}></div>
      </div>

      {/* Logout bubble */}
      <button 
        onClick={logout} 
        className="fixed top-4 right-4 z-[100] bg-[var(--color-navy-card)]/80 backdrop-blur-md border border-[var(--color-navy-border)] w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:border-white transition-all cursor-pointer shadow-lg active:scale-95" 
        title="Log Out"
      >
        <LogOut size={16} />
      </button>

      <main id="main-content" className="flex-1 overflow-y-auto z-10 p-4 pb-24 pt-4" role="main">
        <div className="max-w-md mx-auto h-full pt-12">
          <ErrorBoundary>
            <Suspense fallback={
              <div className="flex items-center justify-center h-full">
                <div className="w-8 h-8 border-4 border-[var(--color-accent-blue)] border-t-transparent rounded-full animate-spin"></div>
              </div>
            }>
              <Routes>
                {/* Common Routes */}
                <Route path="/map" element={<CrowdMap />} />
                <Route path="/assistant" element={<Assistant />} />
                <Route path="/location" element={<LocationScreen />} />
                <Route path="/wait-times" element={<WaitTimes />} />
                <Route path="/plan" element={<MyPlan />} />

                {role === 'HOST' ? (
                  <>
                    <Route path="/" element={<HostDashboard />} />
                    <Route path="/metrics" element={<HostMetrics />} />
                    <Route path="/host-alerts" element={<HostAlerts />} />
                    <Route path="*" element={<Navigate to="/" />} />
                  </>
                ) : (
                  <>
                    <Route path="/" element={<Home />} />
                    <Route path="/help" element={<Help />} />
                    <Route path="*" element={<Navigate to="/" />} />
                  </>
                )}
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </div>
      </main>

      {/* Bottom Nav - Ensured high z-index and pointer interaction */}
      <nav className="fixed bottom-0 w-full bg-[var(--color-navy-card)] border-t border-[var(--color-navy-border)] z-[200] left-0 shadow-[0_-10px_40px_rgba(0,0,0,0.6)]" role="navigation">
        <div className="grid grid-cols-4 items-center h-16 pb-safe max-w-md mx-auto px-2">
          {currentNav.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            const accentCls = role === 'HOST' ? "text-[var(--color-status-amber)]" : "text-[var(--color-accent-blue)]";
            
            return (
              <Link 
                key={item.name} 
                to={item.path} 
                className={cn(
                  "flex flex-col items-center justify-center h-full space-y-1 group relative transition-all cursor-pointer",
                  isActive ? accentCls : "text-slate-400 hover:text-slate-200"
                )}
              >
                <div className={cn(
                  "p-1.5 rounded-xl transition-all",
                  isActive ? "bg-white/5" : "group-hover:bg-white/5"
                )}>
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className="text-[9px] font-black tracking-tighter uppercase">{item.name}</span>
                {isActive && <div className={cn("absolute bottom-0 w-8 h-1 rounded-t-full", role === 'HOST' ? "bg-[var(--color-status-amber)]" : "bg-[var(--color-accent-blue)]")}></div>}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
