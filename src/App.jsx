import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { VenueProvider } from './context/VenueContext';
import { AuthProvider } from './context/AuthContext';
import { APIProvider } from '@vis.gl/react-google-maps';
import ErrorBoundary from './components/ErrorBoundary';
import { initAnalytics } from './services/analyticsService';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

// Lazy load layout and entry screen
const MobileLayout = lazy(() => import('./components/MobileLayout'));
const Login = lazy(() => import('./screens/Login'));

/**
 * Root Application Component.
 * Wraps the app in necessary providers and handles high-level routing.
 */
export default function App() {
  useEffect(() => {
    initAnalytics();
  }, []);

  return (
    <ErrorBoundary>
      <APIProvider apiKey={GOOGLE_MAPS_API_KEY} libraries={['marker', 'routes', 'places']}>
        <AuthProvider>
          <VenueProvider>
            <BrowserRouter>
              <Suspense fallback={null}>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/*" element={<MobileLayout />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </VenueProvider>
        </AuthProvider>
      </APIProvider>
    </ErrorBoundary>
  );
}
