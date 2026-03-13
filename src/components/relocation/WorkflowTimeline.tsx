import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Loader2, Lock, Minus } from 'lucide-react';
import type { UserWorkflowStep, StepStatus } from '../../types/relocation';
import { STEP_STATUS_LABELS } from '../../types/relocation';

// ─── Props Interface ──────────────────────────────────────────────────────────

interface WorkflowTimelineProps {
  steps: UserWorkflowStep[];
  onStepClick?: (step: UserWorkflowStep) => void;
  interactive?: boolean;
}

// ─── Status Config ────────────────────────────────────────────────────────────

interface StatusConfig {
  icon: React.ReactNode;
  lineColor: string;
  textColor: string;
  bgColor: string;
  borderColor: string;
}

function getStatusConfig(status: StepStatus): StatusConfig {
  switch (status) {
    case 'completed':
      return {
        icon: <CheckCircle2 className="w-5 h-5 text-luxury-gold" />,
        lineColor: 'bg-luxury-gold',
        textColor: 'text-luxury-gold',
        bgColor: 'bg-luxury-gold/20',
        borderColor: 'border-luxury-gold',
      };
    case 'in_progress':
      return {
        icon: <Loader2 className="w-5 h-5 text-luxury-gold animate-spin" />,
        lineColor: 'bg-luxury-gold/50',
        textColor: 'text-white',
        bgColor: 'bg-luxury-gold/10',
        borderColor: 'border-luxury-gold',
      };
    case 'blocked':
      return {
        icon: <Lock className="w-4 h-4 text-gray-600" />,
        lineColor: 'bg-white/10',
        textColor: 'text-gray-600',
        bgColor: 'bg-white/5',
        borderColor: 'border-white/10',
      };
    case 'skipped':
      return {
        icon: <Minus className="w-4 h-4 text-gray-500" />,
        lineColor: 'bg-white/10',
        textColor: 'text-gray-500 line-through',
        bgColor: 'bg-transparent',
        borderColor: 'border-white/10',
      };
    default:
      return {
        icon: <Circle className="w-4 h-4 text-gray-500" />,
        lineColor: 'bg-white/10',
        textColor: 'text-gray-400',
        bgColor: 'bg-white/5',
        borderColor: 'border-white/20',
      };
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function WorkflowTimeline({
  steps,
  onStepClick,
  interactive = true,
}: WorkflowTimelineProps) {
  // Sort steps by step_number
  const sortedSteps = [...steps].sort((a, b) => a.step_number - b.step_number);

  return (
    <div className="relative">
      {/* Timeline Line (background) */}
      <div className="absolute left-5 top-4 bottom-4 w-px bg-white/10" />

      {/* Steps */}
      <ol className="relative space-y-0">
        {sortedSteps.map((step, idx) => {
          const config = getStatusConfig(step.status);
          const isLast = idx === sortedSteps.length - 1;
          const isClickable = interactive && (step.status === 'pending' || step.status === 'in_progress');

          return (
            <motion.li
              key={step.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.07, duration: 0.4 }}
              className={`relative flex gap-5 ${isLast ? '' : 'pb-6'}`}
            >
              {/* Connector Line (progress indicator) */}
              {!isLast && step.status === 'completed' && (
                <div className="absolute left-5 top-8 w-px h-[calc(100%-24px)] bg-luxury-gold" />
              )}

              {/* Node */}
              <div className="relative z-10 flex-shrink-0">
                <button
                  onClick={() => isClickable && onStepClick?.(step)}
                  disabled={!isClickable}
                  className={`w-10 h-10 border flex items-center justify-center transition-all duration-300 ${
                    config.bgColor
                  } ${config.borderColor} ${
                    isClickable ? 'cursor-pointer hover:scale-110' : 'cursor-default'
                  }`}
                >
                  {config.icon}
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 pt-1.5 min-w-0">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium text-sm leading-snug mb-1 ${config.textColor}`}>
                      {step.title}
                    </p>
                    <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">
                      {step.description}
                    </p>
                  </div>

                  {/* Meta */}
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    {step.category && (
                      <span className="text-[10px] text-luxury-gold/50 uppercase tracking-widest whitespace-nowrap">
                        {step.category}
                      </span>
                    )}
                    {step.due_date && (
                      <span className="text-[10px] text-gray-600 uppercase tracking-widest whitespace-nowrap">
                        Due {new Date(step.due_date).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Status Badge */}
                <div className="mt-2 flex items-center gap-2">
                  <span
                    className={`inline-block text-[10px] border px-2 py-0.5 uppercase tracking-widest ${
                      step.status === 'completed'
                        ? 'text-luxury-gold border-luxury-gold/30'
                        : step.status === 'in_progress'
                        ? 'text-white border-white/30'
                        : 'text-gray-600 border-gray-700'
                    }`}
                  >
                    {STEP_STATUS_LABELS[step.status]}
                  </span>

                  {step.completed_at && (
                    <span className="text-[10px] text-gray-600">
                      Completed {new Date(step.completed_at).toLocaleDateString()}
                    </span>
                  )}
                </div>

                {/* Notes */}
                {step.notes && (
                  <p className="mt-2 text-xs text-gray-600 italic">
                    Note: {step.notes}
                  </p>
                )}
              </div>
            </motion.li>
          );
        })}
      </ol>

      {steps.length === 0 && (
        <div className="text-center py-12 border border-dashed border-white/10">
          <p className="text-gray-600 text-sm italic">No workflow steps defined.</p>
        </div>
      )}
    </div>
  );
}
