import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { VenueProvider } from './context/VenueContext';
import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy load layout and entry screen
const MobileLayout = lazy(() => import('./components/MobileLayout'));
const Login = lazy(() => import('./screens/Login'));

/**
 * Root Application Component.
 * Wraps the app in necessary providers and handles high-level routing.
 */
export default function App() {
  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
}
