import React from 'react';
import { motion } from 'motion/react';
import { Users, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import type { CapacityResult } from '../../types/experiences';

interface CapacityBadgeProps {
  capacity: CapacityResult | undefined;
  isLoading?: boolean;
  showDetails?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function CapacityBadge({
  capacity,
  isLoading = false,
  showDetails = true,
  size = 'md',
}: CapacityBadgeProps) {
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 animate-pulse">
        <div className="bg-white/10 rounded-full" />
        <div className="h-4 w-20 bg-white/10 rounded" />
      </div>
    );
  }

  if (!capacity) return null;

  const { available, remaining, is_filling_up, percent_full } = capacity;

  const sizeClasses = {
    sm: {
      icon: 'w-3.5 h-3.5',
      container: 'px-2 py-1 text-[10px]',
      dot: 'w-2 h-2',
    },
    md: {
      icon: 'w-4 h-4',
      container: 'px-3 py-1.5 text-xs',
      dot: 'w-2.5 h-2.5',
    },
    lg: {
      icon: 'w-5 h-5',
      container: 'px-4 py-2 text-sm',
      dot: 'w-3 h-3',
    },
  };

  const getStatusConfig = () => {
    if (!available) {
      return {
        bg: 'bg-red-500/10 border-red-500/30',
        text: 'text-red-400',
        icon: XCircle,
        label: 'Sold Out',
        dot: 'bg-red-500',
      };
    }
    if (is_filling_up) {
      return {
        bg: 'bg-amber-500/10 border-amber-500/30',
        text: 'text-amber-400',
        icon: AlertCircle,
        label: 'Filling Up',
        dot: 'bg-amber-500 animate-pulse',
      };
    }
    return {
      bg: 'bg-emerald-500/10 border-emerald-500/30',
      text: 'text-emerald-400',
      icon: CheckCircle2,
      label: 'Available',
      dot: 'bg-emerald-500',
    };
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center gap-2 border ${config.bg} ${config.text} ${sizeClasses[size].container}`}
    >
      <div className={`${config.dot} ${sizeClasses[size].dot} rounded-full flex-shrink-0`} />
      <Icon className={`${sizeClasses[size].icon} flex-shrink-0`} />
      <span className="font-medium whitespace-nowrap">{config.label}</span>
      
      {showDetails && available && (
        <span className="text-gray-400 ml-1">
          • {remaining} spots left
        </span>
      )}
      
      {showDetails && available && (
        <div className="ml-2 w-16 h-1 bg-white/10 rounded-full overflow-hidden hidden sm:block">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percent_full}%` }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`h-full ${
              is_filling_up ? 'bg-amber-500' : 'bg-emerald-500'
            }`}
          />
        </div>
      )}
    </motion.div>
  );
}

// Compact variant for cards
export function CapacityIndicator({
  capacity,
  isLoading,
}: {
  capacity: CapacityResult | undefined;
  isLoading?: boolean;
}) {
  if (isLoading) {
    return <div className="h-4 w-16 bg-white/10 animate-pulse rounded" />;
  }

  if (!capacity) return null;

  const { available, remaining, is_filling_up } = capacity;

  if (!available) {
    return (
      <span className="text-red-400 text-xs font-medium flex items-center gap-1">
        <XCircle className="w-3 h-3" /> Sold Out
      </span>
    );
  }

  if (is_filling_up) {
    return (
      <span className="text-amber-400 text-xs font-medium flex items-center gap-1">
        <AlertCircle className="w-3 h-3" /> Only {remaining} left
      </span>
    );
  }

  return (
    <span className="text-emerald-400 text-xs font-medium flex items-center gap-1">
      <Users className="w-3 h-3" /> {remaining} available
    </span>
  );
}
