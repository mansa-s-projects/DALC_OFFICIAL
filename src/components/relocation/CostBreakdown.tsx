import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ChevronUp,
  TrendingUp,
  Calendar,
  Wallet,
  Tag,
  ArrowRight,
  Minus,
} from 'lucide-react';
import type { CostSummary, CostCategory, RelocationCostEstimate } from '../../types/relocation';

// ─── Props Interface ──────────────────────────────────────────────────────────

interface CostBreakdownProps {
  summary: CostSummary | null;
}

// ─── Category Card Component ──────────────────────────────────────────────────

interface CategoryCardProps {
  category: CostCategory;
  index: number;
}

function CategoryCard({ category, index }: CategoryCardProps) {
  const [isExpanded, setIsExpanded] = useState(index === 0);

  const formatAED = (amount: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="border border-white/10 bg-white/[0.02] overflow-hidden"
    >
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-5 hover:bg-white/[0.03] transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 border border-luxury-gold/30 bg-luxury-gold/10 flex items-center justify-center">
            <Tag className="w-5 h-5 text-luxury-gold" />
          </div>
          <div className="text-left">
            <h4 className="text-white font-display text-base">{category.category}</h4>
            <p className="text-gray-500 text-xs">
              {category.items.length} item{category.items.length !== 1 ? 's' : ''}
              {category.hasRecurring && ' • Includes recurring'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-luxury-gold font-medium">
              {formatAED(category.totalMin)} - {formatAED(category.totalMax)}
            </p>
          </div>
          <div className="text-gray-500">
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </div>
      </button>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-white/10"
          >
            <div className="p-5 space-y-3">
              {category.items.map((item) => (
                <CostItemRow key={item.id} item={item} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Cost Item Row Component ──────────────────────────────────────────────────

interface CostItemRowProps {
  item: RelocationCostEstimate;
}

function CostItemRow({ item }: CostItemRowProps) {
  const formatAED = (amount: number | null) => {
    if (amount === null) return 'N/A';
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-gray-300 text-sm">{item.item_name}</p>
          {item.is_recurring && (
            <span className="px-2 py-0.5 bg-white/5 text-gray-500 text-[10px] uppercase tracking-wider">
              {item.recurrence_period}
            </span>
          )}
        </div>
        {item.notes && (
          <p className="text-gray-600 text-xs mt-1">{item.notes}</p>
        )}
      </div>
      <div className="text-right flex-shrink-0 ml-4">
        <p className="text-white text-sm">
          {formatAED(item.estimated_min)} <span className="text-gray-600">-</span> {formatAED(item.estimated_max)}
        </p>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CostBreakdown({ summary }: CostBreakdownProps) {
  if (!summary || summary.categories.length === 0) {
    return (
      <div className="border border-dashed border-white/10 p-12 text-center">
        <Wallet className="w-12 h-12 text-gray-600 mx-auto mb-4" />
        <h3 className="text-white font-display text-lg mb-2">No Cost Estimates Yet</h3>
        <p className="text-gray-500 text-sm max-w-md mx-auto">
          Your cost estimates will appear here once your relocation profile is set up. 
          Add items to start building your budget.
        </p>
      </div>
    );
  }

  const formatAED = (amount: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-4">
      {/* Summary Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="border border-luxury-gold/20 bg-luxury-gold/5 p-5"
        >
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-luxury-gold" />
            <span className="text-gray-400 text-xs uppercase tracking-widest">Total Range</span>
          </div>
          <p className="text-2xl font-display text-luxury-gold">
            {formatAED(summary.grandTotalMin)} -
          </p>
          <p className="text-2xl font-display text-luxury-gold">
            {formatAED(summary.grandTotalMax)}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="border border-white/10 bg-white/[0.02] p-5"
        >
          <div className="flex items-center gap-3 mb-2">
            <ArrowRight className="w-5 h-5 text-gray-500" />
            <span className="text-gray-400 text-xs uppercase tracking-widest">One-time</span>
          </div>
          <p className="text-xl font-display text-white">
            {formatAED(summary.oneTimeMin)} -
          </p>
          <p className="text-xl font-display text-white">
            {formatAED(summary.oneTimeMax)}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="border border-white/10 bg-white/[0.02] p-5"
        >
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-5 h-5 text-gray-500" />
            <span className="text-gray-400 text-xs uppercase tracking-widest">Recurring</span>
          </div>
          <p className="text-xl font-display text-white">
            {formatAED(summary.recurringMin)} -
          </p>
          <p className="text-xl font-display text-white">
            {formatAED(summary.recurringMax)}
          </p>
        </motion.div>
      </div>

      {/* Categories */}
      <div className="space-y-3">
        {summary.categories.map((category, index) => (
          <CategoryCard key={category.category} category={category} index={index} />
        ))}
      </div>

      {/* Footer Note */}
      <div className="flex items-start gap-3 p-4 border border-white/10 bg-white/[0.02] mt-6">
        <Minus className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
        <p className="text-gray-500 text-xs leading-relaxed">
          All costs are estimates in {summary.currency} and are subject to change based on 
          market conditions, provider rates, and your specific requirements. We recommend 
          adding a 10-15% buffer for unexpected expenses.
        </p>
      </div>
    </div>
  );
}
