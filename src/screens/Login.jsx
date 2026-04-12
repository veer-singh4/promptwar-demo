import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Ticket } from 'lucide-react';

import { useNavigate, Navigate } from 'react-router-dom';

export default function Login() {
  const { login, role } = useAuth();
  const [ticketId, setTicketId] = useState('');
  const navigate = useNavigate();

  if (role) {
    return <Navigate to="/" replace />;
  }

  const submit = (e) => {
    e.preventDefault();
    if (ticketId.trim()) {
      login(ticketId);
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[var(--color-navy-base)] text-slate-50 relative overflow-hidden">
      <div className="absolute top-20 right-10 w-64 h-64 bg-[var(--color-accent-blue)] opacity-10 rounded-full blur-3xl mix-blend-screen"></div>
      
      <div className="w-full max-w-sm space-y-8 relative z-10">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-[var(--color-accent-blue)] rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(30,144,255,0.4)]">
            <ShieldAlert size={32} className="text-white" />
          </div>
          <h1 className="text-4xl font-black tracking-tight">VenueIQ</h1>
          <p className="text-slate-400">Intelligent event experience.</p>
        </div>

        <form onSubmit={submit} className="bg-[var(--color-navy-card)] border border-[var(--color-navy-border)] p-6 rounded-2xl shadow-xl space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Registration ID</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Ticket className="h-5 w-5 text-slate-500" />
              </div>
              <input 
                type="text" 
                value={ticketId} 
                onChange={e => setTicketId(e.target.value)}
                className="w-full bg-[#08111a] border border-[var(--color-navy-border)] rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[var(--color-accent-blue)] transition-colors"
                placeholder="e.g. TX-4112 or HostAdmin1"
                required
              />
            </div>
          </div>
          <button type="submit" className="w-full bg-[var(--color-accent-blue)] hover:bg-blue-600 active:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors min-h-[48px]">
            Enter Venue
          </button>
        </form>
        
        <div className="text-center text-xs text-slate-500 bg-[#0D1B2A] p-4 rounded-xl border border-[var(--color-navy-border)] mt-8">
          <p className="mb-1"><span className="font-bold text-slate-300">Tip:</span> To access the Host/Manager dashboard,</p>
          <p>Login with an ID containing "Host" or "Manager".</p>
          <p className="mt-2">Try "TX-123" for Attendee or "HostAdmin" for Manager.</p>
        </div>
      </div>
    </div>
  );
}
