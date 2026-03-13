import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import type { ComplianceItem } from '../../types/business';

interface ComplianceChecklistProps {
  items: ComplianceItem[];
  editable?: boolean;
  onToggle?: (item: ComplianceItem, completed: boolean) => void;
  title?: string;
}

export default function ComplianceChecklist({
  items,
  editable = false,
  onToggle,
  title = 'Compliance Checklist',
}: ComplianceChecklistProps) {
  const completedCount = items.filter(i => i.completed).length;
  const totalCount = items.length;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="bg-white/[0.03] border border-white/10 p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-white font-display text-base mb-1">{title}</h3>
          <p className="text-gray-500 text-xs uppercase tracking-widest">
            {completedCount} of {totalCount} complete
          </p>
        </div>
        <div className="text-right">
          <span className="text-luxury-gold font-bold text-xl">{progressPct}%</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-px bg-white/10 mb-5 relative overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 h-full bg-luxury-gold"
          initial={{ width: 0 }}
          animate={{ width: `${progressPct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>

      {/* Items */}
      <ul className="space-y-3">
        <AnimatePresence>
          {items.map((item, idx) => (
            <motion.li
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`flex items-start gap-3 p-3 border transition-all duration-300 ${
                item.completed
                  ? 'border-luxury-gold/20 bg-luxury-gold/5'
                  : 'border-white/5 bg-white/[0.02]'
              } ${editable ? 'cursor-pointer hover:border-luxury-gold/30' : ''}`}
              onClick={() => {
                if (editable && onToggle) onToggle(item, !item.completed);
              }}
            >
              {/* Icon */}
              <div className="flex-shrink-0 mt-0.5">
                {item.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-luxury-gold" />
                ) : item.required ? (
                  <AlertCircle className="w-5 h-5 text-gray-500" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-600" />
                )}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-medium leading-snug ${
                    item.completed ? 'text-luxury-gold' : 'text-gray-300'
                  }`}
                >
                  {item.label}
                  {item.required && !item.completed && (
                    <span className="ml-2 text-[10px] text-red-400/70 uppercase tracking-widest font-normal">
                      Required
                    </span>
                  )}
                </p>
                {item.description && (
                  <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">{item.description}</p>
                )}
                {item.completed && item.completed_at && (
                  <p className="text-gray-600 text-[10px] mt-1">
                    Completed {new Date(item.completed_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                )}
              </div>

              {/* Toggle indicator */}
              {editable && (
                <div className="flex-shrink-0 text-gray-600 text-xs uppercase tracking-widest">
                  {item.completed ? 'Undo' : 'Mark'}
                </div>
              )}
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      {items.length === 0 && (
        <p className="text-gray-600 text-sm text-center py-4 italic">No compliance items defined.</p>
      )}
    </div>
  );
}
