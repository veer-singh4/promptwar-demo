import React, { Suspense, lazy } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation, Navigate, Routes, Route } from 'react-router-dom';
import { 
  Home as HomeIcon, Map as MapIcon, Clock as ClockIcon, ClipboardList, Info,
  LayoutDashboard, BarChart2, AlertOctagon, LogOut, Sparkles
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
    { name: 'AI Assistant', path: '/assistant', icon: Sparkles },
    { name: 'Waits', path: '/wait-times', icon: ClockIcon },
    { name: 'Help', path: '/help', icon: Info },
  ];

  const hostNav = [
    { name: 'Command', path: '/', icon: LayoutDashboard },
    { name: 'Sys Map', path: '/map', icon: MapIcon },
    { name: 'AI Insights', path: '/assistant', icon: Sparkles },
    { name: 'Metrics', path: '/wait-times', icon: BarChart2 },
    { name: 'Alerts', path: '/host-alerts', icon: AlertOctagon },
  ];

  const currentNav = role === 'HOST' ? hostNav : attendeeNav;

  return (
    <div className="flex flex-col h-screen h-[100dvh] overflow-hidden font-sans bg-[var(--color-navy-base)] text-slate-50 relative p-4 pb-20">
      
      {/* Accessibility: Skip Navigation */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-[var(--color-accent-blue)] focus:text-white focus:p-4 focus:rounded-xl">
        Skip to content
      </a>

      {/* Top micro-bar showing auth state */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-[var(--color-navy-border)] z-50">
        <div className={cn("h-full transition-all duration-1000", role === 'HOST' ? "bg-[var(--color-status-amber)]" : "bg-[var(--color-accent-blue)]")} style={{width: '100%'}}></div>
      </div>

      {/* Logout bubble */}
      <button 
        onClick={logout} 
        className="absolute top-4 right-4 z-50 bg-[var(--color-navy-card)] border border-[var(--color-navy-border)] w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:border-white transition-all cursor-pointer shadow-lg outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-blue)]" 
        title="Log Out"
        aria-label="Log Out"
      >
        <LogOut size={16} />
      </button>

      <main id="main-content" className="flex-1 overflow-y-auto" role="main">
        <div className="max-w-md mx-auto h-full pt-12 pb-6">
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

                {role === 'HOST' ? (
                  <>
                    <Route path="/" element={<HostDashboard />} />
                    <Route path="/wait-times" element={<HostMetrics />} />
                    <Route path="/host-alerts" element={<HostAlerts />} />
                    <Route path="*" element={<Navigate to="/" />} />
                  </>
                ) : (
                  <>
                    <Route path="/" element={<Home />} />
                    <Route path="/wait-times" element={<WaitTimes />} />
                    <Route path="/plan" element={<MyPlan />} />
                    <Route path="/help" element={<Help />} />
                    <Route path="*" element={<Navigate to="/" />} />
                  </>
                )}
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </div>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 w-full bg-[var(--color-navy-card)] border-t border-[var(--color-navy-border)] z-50 left-0" role="navigation" aria-label="Main Navigation">
        <div className="flex justify-around items-center h-16 pb-safe max-w-md mx-auto">
          {currentNav.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            const accentCls = role === 'HOST' ? "text-[var(--color-status-amber)]" : "text-[var(--color-accent-blue)]";
            return (
              <Link 
                key={item.name} 
                to={item.path} 
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  "flex flex-col items-center justify-center w-full h-full space-y-1 transition-all touch-manipulation min-h-[44px] group outline-none",
                  isActive ? accentCls : "text-slate-400 hover:text-slate-200"
                )}
              >
                <div className={cn(
                  "p-1.5 rounded-xl transition-all",
                  isActive ? "bg-white/5" : "group-hover:bg-white/5"
                )}>
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className="text-[10px] font-bold tracking-tight uppercase">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
