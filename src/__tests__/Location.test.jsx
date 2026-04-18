import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Location from '../screens/Location';
import { AuthProvider } from '../context/AuthContext';
import { VenueProvider } from '../context/VenueContext';

// Mock the Google Maps library
vi.mock('@vis.gl/react-google-maps', () => ({
  Map: ({ children }) => <div data-testid="google-map">{children}</div>,
  AdvancedMarker: ({ children }) => <div data-testid="advanced-marker">{children}</div>,
  Pin: () => <div data-testid="pin" />,
  useMap: vi.fn(),
  useMapsLibrary: vi.fn(() => ({
    DirectionsService: vi.fn(),
    DirectionsRenderer: vi.fn(),
    TravelMode: { DRIVING: 'DRIVING', WALKING: 'WALKING', TRANSIT: 'TRANSIT' },
    Autocomplete: vi.fn(),
    Geocoder: vi.fn()
  }))
}));

vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(),
  AuthProvider: ({ children }) => <div>{children}</div>
}));

import { useAuth } from '../context/AuthContext';

describe('Location Navigation Screen', () => {
  
  it('renders Host View correctly with Venue Hub text', async () => {
    useAuth.mockReturnValue({ role: 'HOST' });
    
    // Dynamic import to respect the doMock
    const { default: DynamicLocation } = await import('../screens/Location');
    
    render(
      <VenueProvider>
        <DynamicLocation />
      </VenueProvider>
    );

    expect(screen.getAllByText(/VENUE HUB/i).length).toBeGreaterThan(0);
  });

  it('renders Attendee View correctly with Match Navigation text', async () => {
    useAuth.mockReturnValue({ role: 'ATTENDEE' });
    
    const { default: DynamicLocation } = await import('../screens/Location');
    
    render(
      <VenueProvider>
        <DynamicLocation />
      </VenueProvider>
    );

    expect(screen.getByText(/Match Navigation/i)).toBeInTheDocument();
    expect(screen.getByText(/Starting Point/i)).toBeInTheDocument();
    
    // Check map wrapper rendered
    expect(screen.getByTestId('google-map')).toBeInTheDocument();
  });
});
