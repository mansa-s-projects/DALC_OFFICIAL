import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Hook this into a production error tracking service.
    console.error('UI crash captured by ErrorBoundary', { error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[40vh] flex items-center justify-center px-4">
          <div className="glass-panel border border-luxury-gold/20 p-8 rounded-sm text-center max-w-xl">
            <h3 className="text-white font-display text-2xl mb-2">Unexpected UI error</h3>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              Please refresh the page. If this keeps happening, contact concierge support.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-3 text-xs uppercase tracking-widest font-bold border border-luxury-gold/40 text-luxury-gold hover:bg-luxury-gold hover:text-black transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
