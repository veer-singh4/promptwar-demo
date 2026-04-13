import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

/**
 * ErrorBoundary catches JavaScript errors anywhere in their child component tree,
 * logs those errors, and displays a fallback UI instead of the component tree that crashed.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("VenueIQ Caught Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[300px] flex flex-col items-center justify-center p-8 text-center bg-[var(--color-navy-card)] border border-[var(--color-status-red)] rounded-2xl animate-in zoom-in duration-300">
          <div className="w-16 h-16 bg-[var(--color-status-red)]/20 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle className="text-[var(--color-status-red)]" size={32} />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
          <p className="text-slate-400 text-sm mb-6 max-w-xs mx-auto">
            The application encountered an unexpected error. Don't worry, your data is safe.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 bg-[var(--color-accent-blue)] text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-600 transition-colors"
          >
            <RotateCcw size={18} /> Reload Application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
