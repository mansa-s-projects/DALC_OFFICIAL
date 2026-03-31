'use client';

import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Crown, 
  X, 
  Lock, 
  ArrowRight, 
  Sparkles,
  Plane,
  Building,
  Gem,
  Home
} from 'lucide-react';
import { useTierGate, getTierInfo } from '../hooks/useTierGate';
import type { UserTier } from '../types';

interface TierUpgradePromptProps {
  requiredTier: UserTier;
  featureName: string;
  isOpen: boolean;
  onClose: () => void;
}

const TIER_FEATURES: Record<UserTier, Array<{ icon: typeof Plane; label: string }>> = {
  standard: [
    { icon: Sparkles, label: 'Standard bookings' },
    { icon: Lock, label: 'Basic concierge' },
  ],
  gold: [
    { icon: Sparkles, label: 'Priority bookings' },
    { icon: Lock, label: 'Exclusive venues' },
    { icon: Gem, label: 'Member rates' },
  ],
  platinum: [
    { icon: Plane, label: 'Jet charter access' },
    { icon: Building, label: 'Investment services' },
    { icon: Home, label: 'Private villa bookings' },
    { icon: Sparkles, label: 'All Gold benefits' },
  ],
  black: [
    { icon: Crown, label: 'Dedicated concierge' },
    { icon: Gem, label: 'Black Card exclusives' },
    { icon: Plane, label: 'Priority jet access' },
    { icon: Sparkles, label: 'All Platinum benefits' },
  ],
};

export function TierUpgradePrompt({ 
  requiredTier, 
  featureName, 
  isOpen, 
  onClose 
}: TierUpgradePromptProps) {
  const router = useRouter();
  const { userTier } = useTierGate(requiredTier);
  const requiredInfo = getTierInfo(requiredTier);
  const userInfo = getTierInfo(userTier);

  const handleUpgrade = () => {
    router.push('/membership');
    onClose();
  };

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
            className="w-full max-w-md rounded-2xl border border-[#C8A46B]/30 bg-[#0E1012] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative p-6 bg-gradient-to-b from-[#C8A46B]/10 to-transparent">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1 rounded-full text-white/40 hover:text-white/80 hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-[#C8A46B]/20 flex items-center justify-center">
                  <Lock className="w-8 h-8 text-[#C8A46B]" />
                </div>
              </div>
              
              <h2 className="text-xl font-display text-center text-white mb-1">
                Premium Feature
              </h2>
              <p className="text-center text-white/50 text-sm">
                {featureName} requires {requiredInfo.label} membership
              </p>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Current vs Required */}
              <div className="flex items-center gap-4">
                <div className={`flex-1 p-4 rounded-xl border ${userInfo.borderColor} ${userInfo.bgColor}`}>
                  <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Your Tier</p>
                  <p className={`font-display text-lg ${userInfo.color}`}>{userInfo.label}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-white/20 flex-shrink-0" />
                <div className={`flex-1 p-4 rounded-xl border ${requiredInfo.borderColor} ${requiredInfo.bgColor}`}>
                  <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Required</p>
                  <p className={`font-display text-lg ${requiredInfo.color}`}>{requiredInfo.label}</p>
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-3">
                <p className="text-xs text-white/40 uppercase tracking-wider">
                  What you get with {requiredInfo.label}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {TIER_FEATURES[requiredTier].map((feature, idx) => (
                    <div 
                      key={idx}
                      className="flex items-center gap-2 p-2 rounded-lg bg-white/5"
                    >
                      <feature.icon className="w-4 h-4 text-[#C8A46B]" />
                      <span className="text-sm text-white/70">{feature.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="space-y-3">
                <button
                  onClick={handleUpgrade}
                  className="w-full py-3 px-6 rounded-xl bg-[#C8A46B] text-black font-semibold hover:bg-[#EFD7A4] transition-colors flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Upgrade to {requiredInfo.label}
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-3 px-6 rounded-xl border border-white/10 text-white/50 hover:text-white/80 hover:border-white/20 transition-colors"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Inline tier upgrade card for embedding in pages
 */
export function TierUpgradeCard({ 
  requiredTier, 
  featureName 
}: { 
  requiredTier: UserTier; 
  featureName: string;
}) {
  const router = useRouter();
  const { userTier } = useTierGate(requiredTier);
  const requiredInfo = getTierInfo(requiredTier);
  const userInfo = getTierInfo(userTier);

  return (
    <div className="rounded-2xl border border-[#C8A46B]/20 bg-[#0E1012] p-6">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-[#C8A46B]/10 flex items-center justify-center flex-shrink-0">
          <Lock className="w-6 h-6 text-[#C8A46B]" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-display text-white mb-1">{featureName}</h3>
          <p className="text-sm text-white/50 mb-4">
            This service is available to {requiredInfo.label} members. 
            Upgrade from {userInfo.label} to unlock.
          </p>
          <button
            onClick={() => router.push('/membership')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#C8A46B]/10 border border-[#C8A46B]/30 text-[#EFD7A4] text-sm font-medium hover:bg-[#C8A46B]/20 transition-colors"
          >
            <Crown className="w-4 h-4" />
            Upgrade Membership
          </button>
        </div>
      </div>
    </div>
  );
}
