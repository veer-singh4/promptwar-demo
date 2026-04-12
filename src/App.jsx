import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { VenueProvider } from './context/VenueContext';
import { AuthProvider } from './context/AuthContext';
import MobileLayout from './components/MobileLayout';
import Login from './screens/Login';

export default function App() {
  return (
    <AuthProvider>
      <VenueProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/*" element={<MobileLayout />} />
          </Routes>
        </BrowserRouter>
      </VenueProvider>
    </AuthProvider>
  );
}
