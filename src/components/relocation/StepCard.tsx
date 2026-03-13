import React from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Circle,
  Loader2,
  Lock,
  ChevronRight,
  Calendar,
  Tag,
  Edit3,
} from 'lucide-react';
import type { UserWorkflowStep, StepStatus } from '../../types/relocation';
import { STEP_STATUS_LABELS } from '../../types/relocation';
import { useUpdateWorkflowStep } from '../../hooks/useRelocation';

// ─── Props Interface ──────────────────────────────────────────────────────────

interface StepCardProps {
  step: UserWorkflowStep;
  compact?: boolean;
  onStatusChange?: (status: StepStatus) => void;
}

// ─── Status Config ────────────────────────────────────────────────────────────

interface StatusStyle {
  bg: string;
  border: string;
  icon: React.ReactNode;
  labelColor: string;
}

function getStatusStyle(status: StepStatus): StatusStyle {
  switch (status) {
    case 'completed':
      return {
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/30',
        icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
        labelColor: 'text-emerald-500',
      };
    case 'in_progress':
      return {
        bg: 'bg-luxury-gold/10',
        border: 'border-luxury-gold/30',
        icon: <Loader2 className="w-5 h-5 text-luxury-gold animate-spin" />,
        labelColor: 'text-luxury-gold',
      };
    case 'blocked':
      return {
        bg: 'bg-red-500/5',
        border: 'border-red-500/20',
        icon: <Lock className="w-5 h-5 text-red-400" />,
        labelColor: 'text-red-400',
      };
    case 'skipped':
      return {
        bg: 'bg-gray-500/5',
        border: 'border-gray-500/20',
        icon: <Circle className="w-5 h-5 text-gray-500" />,
        labelColor: 'text-gray-500',
      };
    default:
      return {
        bg: 'bg-white/[0.02]',
        border: 'border-white/10',
        icon: <Circle className="w-5 h-5 text-gray-400" />,
        labelColor: 'text-gray-400',
      };
  }
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function StepCard({ step, compact = false, onStatusChange }: StepCardProps) {
  const updateStep = useUpdateWorkflowStep();
  const style = getStatusStyle(step.status);

  const handleStatusChange = async (newStatus: StepStatus) => {
    await updateStep.mutateAsync({
      stepId: step.id,
      status: newStatus,
      workflowId: step.workflow_id,
    });
    onStatusChange?.(newStatus);
  };

  // Status action buttons based on current status
  const getActionButtons = () => {
    switch (step.status) {
      case 'pending':
        return (
          <button
            onClick={() => handleStatusChange('in_progress')}
            disabled={updateStep.isPending}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-luxury-gold text-luxury-black text-xs font-bold uppercase tracking-wider hover:bg-luxury-gold/90 transition-colors disabled:opacity-50"
          >
            {updateStep.isPending ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Edit3 className="w-3 h-3" />
            )}
            Start
          </button>
        );
      case 'in_progress':
        return (
          <div className="flex gap-2">
            <button
              onClick={() => handleStatusChange('completed')}
              disabled={updateStep.isPending}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold uppercase tracking-wider hover:bg-emerald-500/30 transition-colors disabled:opacity-50"
            >
              <CheckCircle2 className="w-3 h-3" />
              Complete
            </button>
            <button
              onClick={() => handleStatusChange('blocked')}
              disabled={updateStep.isPending}
              className="px-3 py-1.5 border border-red-500/40 text-red-400 text-xs font-bold uppercase tracking-wider hover:bg-red-500/10 transition-colors disabled:opacity-50"
            >
              Block
            </button>
          </div>
        );
      case 'completed':
        return (
          <button
            onClick={() => handleStatusChange('in_progress')}
            disabled={updateStep.isPending}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-white/20 text-gray-400 text-xs uppercase tracking-wider hover:border-luxury-gold/50 hover:text-luxury-gold transition-colors disabled:opacity-50"
          >
            <Edit3 className="w-3 h-3" />
            Reopen
          </button>
        );
      default:
        return null;
    }
  };

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex items-center gap-4 p-4 border ${style.border} ${style.bg} transition-all hover:border-luxury-gold/30`}
      >
        <div className="flex-shrink-0">{style.icon}</div>
        <div className="flex-1 min-w-0">
          <p className={`font-medium text-sm truncate ${style.labelColor}`}>
            {step.step_number}. {step.title}
          </p>
          <p className="text-gray-500 text-xs truncate">{step.description}</p>
        </div>
        <span className={`text-[10px] uppercase tracking-widest ${style.labelColor}`}>
          {STEP_STATUS_LABELS[step.status]}
        </span>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden border ${style.border} ${style.bg} p-6`}
    >
      {/* Step Number Badge */}
      <div className="absolute top-4 right-4 w-8 h-8 border border-current opacity-30 flex items-center justify-center">
        <span className={`text-sm font-display font-bold ${style.labelColor}`}>
          {step.step_number}
        </span>
      </div>

      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="flex-shrink-0 mt-1">{style.icon}</div>

        {/* Content */}
        <div className="flex-1 pr-8">
          {/* Header */}
          <div className="mb-3">
            <h3 className={`font-display text-lg mb-1 ${style.labelColor}`}>
              {step.title}
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              {step.description}
            </p>
          </div>

          {/* Meta Row */}
          <div className="flex flex-wrap items-center gap-4 mb-4">
            {step.category && (
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Tag className="w-3.5 h-3.5 text-luxury-gold/50" />
                <span className="uppercase tracking-wider">{step.category}</span>
              </div>
            )}
            {step.due_date && (
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Calendar className="w-3.5 h-3.5 text-luxury-gold/50" />
                <span>Due {new Date(step.due_date).toLocaleDateString()}</span>
              </div>
            )}
            <span className={`text-xs uppercase tracking-widest ${style.labelColor}`}>
              {STEP_STATUS_LABELS[step.status]}
            </span>
          </div>

          {/* Status Badge & Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getActionButtons()}
            </div>

            {step.status === 'pending' && (
              <ChevronRight className="w-5 h-5 text-gray-600" />
            )}
          </div>

          {/* Notes */}
          {step.notes && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-xs text-gray-500 italic">
                <span className="text-luxury-gold/70">Note:</span> {step.notes}
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
