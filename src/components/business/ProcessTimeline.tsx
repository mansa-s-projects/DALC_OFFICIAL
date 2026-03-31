import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Circle, Loader2 } from 'lucide-react';
import type { WorkflowStep } from '../../types/business';

interface ProcessTimelineProps {
  steps: WorkflowStep[];
  currentStep?: number;
  title?: string;
}

export default function ProcessTimeline({
  steps,
  currentStep = 0,
  title = 'Process Timeline',
}: ProcessTimelineProps) {
  const totalDays = steps.reduce((sum, s) => sum + (s.duration_days ?? 0), 0);

  return (
    <div>
      {/* Header */}
      <div className="flex items-baseline justify-between mb-6">
        <h3 className="text-white font-display text-base">{title}</h3>
        {totalDays > 0 && (
          <span className="text-gray-500 text-xs uppercase tracking-widest">
            Est. {totalDays} business days
          </span>
        )}
      </div>

      {/* Steps */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-5 top-5 bottom-5 w-px bg-white/10" />

        <ol className="space-y-0">
          {steps.map((step, idx) => {
            const isDone = currentStep > step.step;
            const isActive = currentStep === step.step;

            return (
              <motion.li
                key={step.step}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.07, duration: 0.4 }}
                className="relative flex gap-5 pb-8 last:pb-0"
              >
                {/* Node */}
                <div className="relative z-10 flex-shrink-0 w-10 h-10 flex items-center justify-center">
                  <div
                    className={`w-10 h-10 border flex items-center justify-center transition-all duration-500 ${
                      isDone
                        ? 'border-luxury-gold bg-luxury-gold/20'
                        : isActive
                        ? 'border-luxury-gold bg-luxury-gold/10'
                        : 'border-white/20 bg-white/5'
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-luxury-gold" />
                    ) : isActive ? (
                      <Loader2 className="w-5 h-5 text-luxury-gold animate-spin" />
                    ) : (
                      <span className={`text-xs font-bold ${isActive ? 'text-luxury-gold' : 'text-gray-500'}`}>
                        {step.step}
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 pt-1.5 pb-2">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <p
                        className={`font-medium text-sm leading-snug mb-1 ${
                          isDone
                            ? 'text-luxury-gold'
                            : isActive
                            ? 'text-white'
                            : 'text-gray-300'
                        }`}
                      >
                        {step.title}
                      </p>
                      <p className="text-gray-500 text-xs leading-relaxed">{step.description}</p>
                    </div>

                    {/* Meta */}
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      {step.duration_days != null && (
                        <span className="text-[10px] text-gray-600 uppercase tracking-widest whitespace-nowrap">
                          {step.duration_days === 1 ? '1 day' : `${step.duration_days} days`}
                        </span>
                      )}
                      {step.responsible_party && (
                        <span className="text-[10px] text-luxury-gold/50 uppercase tracking-widest whitespace-nowrap">
                          {step.responsible_party}
                        </span>
                      )}
                    </div>
                  </div>

                  {isActive && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="inline-block mt-2 text-[10px] text-luxury-gold border border-luxury-gold/30 px-2 py-0.5 uppercase tracking-widest"
                    >
                      In Progress
                    </motion.span>
                  )}
                </div>
              </motion.li>
            );
          })}
        </ol>
      </div>

      {steps.length === 0 && (
        <p className="text-gray-600 text-sm text-center py-6 italic">No workflow steps defined.</p>
      )}
    </div>
  );
}
