'use client';

import { motion, AnimatePresence } from 'motion/react';
import { X, Check, X as XIcon } from 'lucide-react';
import type { PricingTier } from '../types';

interface TierComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  tiers: PricingTier[];
  experienceName: string;
}

const COMPARISON_FEATURES = [
  { key: 'private_guide', label: 'Private Guide', tiers: [false, false, true] },
  { key: 'transport_included', label: 'Transport Included', tiers: [false, true, true] },
  { key: 'champagne', label: 'Champagne Reception', tiers: [false, false, true] },
  { key: 'photography', label: 'Photography Session', tiers: [false, true, true] },
  { key: 'vip_access', label: 'VIP Access', tiers: [false, true, true] },
  { key: 'priority_booking', label: 'Priority Booking', tiers: [false, false, true] },
];

export default function TierComparisonModal({ 
  isOpen, 
  onClose, 
  tiers,
  experienceName 
}: TierComparisonModalProps) {
  // Map tiers to Silver/Gold/Platinum if we have exactly 3, otherwise use actual tier names
  const displayTiers = tiers.length === 3 
    ? [
        { name: 'Silver', color: 'from-gray-400 to-gray-500', tier: tiers[0] },
        { name: 'Gold', color: 'from-amber-400 to-yellow-500', tier: tiers[1] },
        { name: 'Platinum', color: 'from-purple-400 to-pink-500', tier: tiers[2] },
      ]
    : tiers.map((t, i) => ({
        name: t.tier,
        color: i === 0 ? 'from-gray-400 to-gray-500' : i === 1 ? 'from-amber-400 to-yellow-500' : 'from-purple-400 to-pink-500',
        tier: t,
      }));

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-3xl rounded-2xl border border-luxury-gold/30 bg-[#0E1012] overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative p-6 bg-gradient-to-b from-luxury-gold/10 to-transparent border-b border-white/10">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1 rounded-full text-white/40 hover:text-white/80 hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <h2 className="text-2xl font-display text-white mb-1">Compare Tiers</h2>
              <p className="text-white/50 text-sm">{experienceName}</p>
            </div>

            {/* Comparison Table */}
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left py-4 px-2 text-white/40 text-xs uppercase tracking-wider font-normal">Feature</th>
                      {displayTiers.map((t, i) => (
                        <th key={i} className="text-center py-4 px-4 min-w-[140px]">
                          <div className={`inline-block px-4 py-2 rounded-lg bg-gradient-to-r ${t.color}`}>
                            <span className="text-black font-bold text-sm">{t.name}</span>
                          </div>
                          <div className="mt-2 text-luxury-gold font-display text-lg">
                            AED {t.tier.price?.toLocaleString() || '—'}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {COMPARISON_FEATURES.map((feature, idx) => (
                      <tr key={feature.key} className={idx % 2 === 0 ? 'bg-white/[0.02]' : ''}>
                        <td className="py-3 px-2 text-white/70 text-sm">{feature.label}</td>
                        {feature.tiers.map((included, i) => (
                          <td key={i} className="text-center py-3 px-4">
                            {included ? (
                              <Check className="w-5 h-5 text-emerald-400 mx-auto" />
                            ) : (
                              <XIcon className="w-5 h-5 text-white/20 mx-auto" />
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                    {/* What's Included Row */}
                    <tr className="border-t border-white/10">
                      <td className="py-4 px-2 text-white/70 text-sm align-top">What's Included</td>
                      {displayTiers.map((t, i) => (
                        <td key={i} className="py-4 px-4 align-top">
                          <ul className="text-xs text-white/50 space-y-1">
                            {t.tier.includes?.map((item, j) => (
                              <li key={j} className="flex items-start gap-1.5">
                                <Check className="w-3 h-3 text-luxury-gold flex-shrink-0 mt-0.5" />
                                <span>{item}</span>
                              </li>
                            )) || <li className="text-white/30">Basic inclusions</li>}
                          </ul>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="text-xs text-white/30 text-center mt-6">
                Features may vary by experience. Contact concierge for custom packages.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
