'use client';

import { useAppStore } from '../store/useAppStore';
import type { UserTier } from '../types';

const TIER_RANK: Record<UserTier, number> = {
  standard: 0,
  gold: 1,
  platinum: 2,
  black: 3,
};

export interface TierGateResult {
  allowed: boolean;
  userTier: UserTier;
  requiredTier: UserTier;
  canUpgrade: boolean;
}

/**
 * Hook to check if user has required tier access
 * @param requiredTier - Minimum tier required
 * @returns TierGateResult with allowed status and upgrade info
 */
export function useTierGate(requiredTier: UserTier): TierGateResult {
  const profile = useAppStore((s) => s.profile);
  const userTier = profile?.tier ?? 'standard';
  
  const userRank = TIER_RANK[userTier];
  const requiredRank = TIER_RANK[requiredTier];
  
  return {
    allowed: userRank >= requiredRank,
    userTier,
    requiredTier,
    canUpgrade: userRank < requiredRank,
  };
}

/**
 * Check tier access without hook (for non-component usage)
 */
export function checkTierAccess(
  userTier: UserTier | undefined,
  requiredTier: UserTier
): boolean {
  const userRank = TIER_RANK[userTier ?? 'standard'];
  const requiredRank = TIER_RANK[requiredTier];
  return userRank >= requiredRank;
}

/**
 * Get next tier in the ladder
 */
export function getNextTier(currentTier: UserTier): UserTier | null {
  const tiers: UserTier[] = ['standard', 'gold', 'platinum', 'black'];
  const currentIndex = tiers.indexOf(currentTier);
  return tiers[currentIndex + 1] ?? null;
}

/**
 * Get tier display info
 */
export function getTierInfo(tier: UserTier) {
  const configs: Record<UserTier, { 
    label: string; 
    color: string; 
    bgColor: string;
    borderColor: string;
    description: string;
  }> = {
    standard: {
      label: 'Standard',
      color: 'text-white/60',
      bgColor: 'bg-white/5',
      borderColor: 'border-white/20',
      description: 'Basic access to experiences and bookings',
    },
    gold: {
      label: 'Gold',
      color: 'text-[#EFD7A4]',
      bgColor: 'bg-[#C8A46B]/10',
      borderColor: 'border-[#C8A46B]/50',
      description: 'Priority bookings and exclusive venue access',
    },
    platinum: {
      label: 'Platinum',
      color: 'text-[#D0D8E8]',
      bgColor: 'bg-[#A8B8D0]/10',
      borderColor: 'border-[#A8B8D0]/50',
      description: 'Jet charters, private villas, and investment services',
    },
    black: {
      label: 'Black',
      color: 'text-white',
      bgColor: 'bg-black/40',
      borderColor: 'border-white/40',
      description: 'Dedicated concierge and exclusive Black Card experiences',
    },
  };
  
  return configs[tier];
}
