import React from 'react';
import type { TransportService, TransportSubcategory } from '../../types/transport';
import { CAR_SPEC_LABELS, YACHT_SPEC_LABELS, JET_SPEC_LABELS } from '../../types/transport';

interface SpecTableProps {
  service: TransportService;
}

export default function SpecTable({ service }: SpecTableProps) {
  const { subcategory, specifications } = service;

  const getSpecLabels = (): Record<string, string> => {
    switch (subcategory) {
      case 'cars':
        return CAR_SPEC_LABELS;
      case 'yachts':
        return YACHT_SPEC_LABELS;
      case 'jets':
        return JET_SPEC_LABELS;
      default:
        return {};
    }
  };

  const specLabels = getSpecLabels();
  
  // Filter to only show specs that exist and have labels
  const specsToShow = Object.entries(specifications).filter(
    ([key, value]) => specLabels[key] && value !== undefined && value !== null && value !== ''
  );

  if (specsToShow.length === 0) {
    return null;
  }

  // Get icon based on subcategory
  const getIcon = () => {
    switch (subcategory) {
      case 'cars':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        );
      case 'yachts':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case 'jets':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        );
    }
  };

  return (
    <div className="border border-white/10 bg-white/[0.02]">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-white/10">
        <div className="text-luxury-gold">{getIcon()}</div>
        <h3 className="text-white font-display text-lg">Specifications</h3>
      </div>
      
      <div className="divide-y divide-white/10">
        {specsToShow.map(([key, value]) => (
          <div key={key} className="flex items-center justify-between px-6 py-3">
            <span className="text-gray-500 text-sm">{specLabels[key]}</span>
            <span className="text-white text-sm font-medium">
              {typeof value === 'number' ? value.toLocaleString() : String(value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
