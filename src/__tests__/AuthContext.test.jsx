import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AuthProvider, useAuth } from '../context/AuthContext';

// Helper component to test context
const TestComponent = () => {
  const { role, user, login, logout } = useAuth();
  return (
    <div>
      <div data-testid="role">{role || 'none'}</div>
      <div data-testid="user">{user || 'none'}</div>
      <button onClick={() => login('HostAdmin')}>Login Host</button>
      <button onClick={() => login('TX-123')}>Login Fan</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  it('should start with no user or role', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    expect(screen.getByTestId('role')).toHaveTextContent('none');
    expect(screen.getByTestId('user')).toHaveTextContent('none');
  });

  it('should identify Host login correctly', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    act(() => {
      screen.getByText('Login Host').click();
    });

    expect(screen.getByTestId('role')).toHaveTextContent('HOST');
    expect(screen.getByTestId('user')).toHaveTextContent('HostAdmin');
  });

  it('should identify Attendee login correctly', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    act(() => {
      screen.getByText('Login Fan').click();
    });

    expect(screen.getByTestId('role')).toHaveTextContent('ATTENDEE');
  });

  it('should logout correctly', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    act(() => {
      screen.getByText('Login Fan').click();
    });
    expect(screen.getByTestId('role')).not.toHaveTextContent('none');

    act(() => {
      screen.getByText('Logout').click();
    });
    expect(screen.getByTestId('role')).toHaveTextContent('none');
  });
});
