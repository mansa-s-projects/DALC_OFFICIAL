import React from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

interface ErrorStateProps {
  message: string;
  retry?: () => void;
}

export default function ErrorState({ message, retry }: ErrorStateProps) {
  return (
    <div className="glass-panel border border-luxury-gold/20 p-8 rounded-sm text-center max-w-xl mx-auto">
      <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-luxury-gold/15 flex items-center justify-center">
        <AlertTriangle className="w-6 h-6 text-luxury-gold" />
      </div>
      <h3 className="text-white font-display text-2xl mb-2">Something went wrong</h3>
      <p className="text-gray-300 text-sm leading-relaxed mb-6">{message}</p>
      {retry && (
        <button
          onClick={retry}
          className="inline-flex items-center gap-2 px-5 py-3 text-xs uppercase tracking-widest font-bold border border-luxury-gold/40 text-luxury-gold hover:bg-luxury-gold hover:text-black transition-colors"
        >
          <RefreshCcw className="w-3.5 h-3.5" /> Retry
        </button>
      )}
    </div>
  );
}
