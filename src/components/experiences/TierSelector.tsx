import React from 'react';
import { motion } from 'motion/react';
import { Check, Users, Sparkles } from 'lucide-react';
import type { PricingTier, PricingModel } from '../../types/experiences';

interface TierSelectorProps {
  tiers: PricingTier[];
  pricingModel: PricingModel;
  selectedTier: string;
  onTierChange: (tierName: string) => void;
  partySize?: number;
  currency?: string;
}

export default function TierSelector({
  tiers,
  pricingModel,
  selectedTier,
  onTierChange,
  partySize = 1,
  currency = 'AED',
}: TierSelectorProps) {
  if (!tiers || tiers.length === 0) return null;

  // Single tier pricing
  if (pricingModel !== 'tiered' && tiers.length === 1) {
    const tier = tiers[0];
    const totalPrice = tier.price * partySize;

    return (
      <div className="border border-luxury-gold/30 bg-luxury-gold/5 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-white font-display text-lg">{tier.tier}</h3>
            {tier.description && (
              <p className="text-gray-400 text-sm mt-1">{tier.description}</p>
            )}
          </div>
          <div className="text-right">
            <p className="text-luxury-gold font-display text-2xl">
              {currency} {totalPrice.toLocaleString()}
            </p>
            {partySize > 1 && (
              <p className="text-gray-500 text-xs">
                {currency} {tier.price.toLocaleString()} × {partySize}
              </p>
            )}
          </div>
        </div>

        {tier.includes && tier.includes.length > 0 && (
          <ul className="space-y-2">
            {tier.includes.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-gray-300 text-sm">
                <Check className="w-4 h-4 text-luxury-gold flex-shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  // Tiered pricing selector
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-luxury-gold">
        <Sparkles className="w-5 h-5" />
        <h3 className="font-display text-lg">Select Experience Tier</h3>
      </div>

      <div className="space-y-3">
        {tiers.map((tier, index) => {
          const isSelected = selectedTier === tier.tier;
          const totalPrice = tier.price * partySize;

          return (
            <motion.button
              key={tier.tier}
              whileHover={{ scale: isSelected ? 1 : 1.01 }}
              whileTap={{ scale: isSelected ? 1 : 0.99 }}
              onClick={() => onTierChange(tier.tier)}
              className={`w-full text-left border transition-all duration-300 ${
                isSelected
                  ? 'border-luxury-gold bg-luxury-gold/10'
                  : 'border-white/10 hover:border-luxury-gold/30 bg-white/[0.02]'
              }`}
            >
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={`font-medium ${isSelected ? 'text-luxury-gold' : 'text-white'}`}>
                        {tier.tier}
                      </h4>
                      {isSelected && (
                        <div className="w-5 h-5 bg-luxury-gold rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-luxury-black" />
                        </div>
                      )}
                    </div>
                    {tier.description && (
                      <p className="text-gray-400 text-sm mb-2">{tier.description}</p>
                    )}
                    {tier.max_guests && (
                      <p className="text-gray-500 text-xs flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        Up to {tier.max_guests} guests
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className={`font-display text-xl ${isSelected ? 'text-luxury-gold' : 'text-white'}`}>
                      {currency} {totalPrice.toLocaleString()}
                    </p>
                    {partySize > 1 && (
                      <p className="text-gray-500 text-xs">
                        {currency} {tier.price.toLocaleString()} × {partySize}
                      </p>
                    )}
                  </div>
                </div>

                {/* What's included */}
                {tier.includes && tier.includes.length > 0 && isSelected && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="mt-4 pt-4 border-t border-white/10"
                  >
                    <p className="text-gray-400 text-xs uppercase tracking-widest mb-2">Includes:</p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {tier.includes.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-gray-300 text-sm">
                          <Check className="w-4 h-4 text-luxury-gold flex-shrink-0 mt-0.5" />
                          <span className="text-xs">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
