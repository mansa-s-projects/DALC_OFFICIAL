import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  LayoutDashboard,
  FileText,
  Calculator,
  ChevronRight,
  Loader2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import Navbar from '../../../components/navigation/Navbar';
import Footer from '../../../components/navigation/Footer';
import WorkflowTimeline from '../../../components/relocation/WorkflowTimeline';
import StepCard from '../../../components/relocation/StepCard';
import { useRelocationProfile, useUserWorkflows, useWorkflowSteps } from '../hooks/useRelocation';
import { useUser } from '../../../hooks/useUser';

// ─── Progress Ring Component ──────────────────────────────────────────────────

interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
}

function ProgressRing({ progress, size = 120, strokeWidth = 8 }: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Background circle */}
      <svg className="transform -rotate-90 w-full h-full">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#D4AF37"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{
            strokeDasharray: circumference,
          }}
        />
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-display text-luxury-gold font-bold">{progress}%</span>
        <span className="text-[10px] text-gray-500 uppercase tracking-widest">Complete</span>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Dashboard() {
  const { data: userData } = useUser();
  const userId = userData?.session?.user?.id ?? '';

  const { data: profile, isLoading: profileLoading } = useRelocationProfile(userId);
  const { data: workflows, isLoading: workflowsLoading } = useUserWorkflows(userId);
  
  const activeWorkflow = workflows?.[0];
  const { data: steps, isLoading: stepsLoading } = useWorkflowSteps(activeWorkflow?.id);

  const isLoading = profileLoading || workflowsLoading || stepsLoading;

  // Calculate progress
  const totalSteps = activeWorkflow?.total_steps ?? 0;
  const completedSteps = activeWorkflow?.completed_steps ?? 0;
  const progress = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  // Get next incomplete step
  const nextStep = steps?.find((s) => s.status === 'pending' || s.status === 'in_progress');

  return (
    <div className="min-h-screen bg-luxury-black">
      <Navbar />

      {/* ── Header ───────────────────────────────────────────────────────────── */}
      <section className="pt-28 pb-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 border border-luxury-gold/30 bg-luxury-gold/10 flex items-center justify-center">
                <LayoutDashboard className="w-6 h-6 text-luxury-gold" />
              </div>
              <div>
                <p className="text-luxury-gold text-xs font-bold uppercase tracking-[0.3em]">
                  Relocation Dashboard
                </p>
                <h1 className="text-3xl font-display text-white">
                  Your Progress
                </h1>
              </div>
            </div>

            {profile && (
              <div className="text-right">
                <p className="text-gray-400 text-sm">Moving from</p>
                <p className="text-white font-medium">{profile.current_country || 'Not specified'}</p>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* ── Main Content ─────────────────────────────────────────────────────── */}
      <section className="px-4 md:px-8 pb-24">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-luxury-gold animate-spin" />
            </div>
          ) : !profile ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20 border border-white/10 bg-white/[0.02]"
            >
              <Sparkles className="w-12 h-12 text-luxury-gold mx-auto mb-4 opacity-60" />
              <h2 className="text-2xl font-display text-white mb-3">
                Start Your Relocation Journey
              </h2>
              <p className="text-gray-400 max-w-md mx-auto mb-6">
                Complete our intake form to receive your personalised relocation roadmap 
                and begin tracking your progress.
              </p>
              <Link
                href="/move-to-dubai/intake"
                className="inline-flex items-center gap-2 px-6 py-3 bg-luxury-gold text-luxury-black text-sm font-bold uppercase tracking-widest hover:bg-luxury-gold/90 transition-all duration-300"
              >
                Get Started
                <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* ── Left Column: Progress & Stats ───────────────────────────── */}
              <div className="space-y-6">
                {/* Progress Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="border border-white/10 bg-white/[0.02] p-8"
                >
                  <h3 className="text-white font-display text-lg mb-6">Overall Progress</h3>
                  <div className="flex justify-center mb-6">
                    <ProgressRing progress={progress} />
                  </div>
                  <div className="text-center">
                    <p className="text-gray-400 text-sm">
                      {completedSteps} of {totalSteps} steps completed
                    </p>
                  </div>
                </motion.div>

                {/* Quick Links */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="border border-white/10 bg-white/[0.02] p-6"
                >
                  <h3 className="text-white font-display text-base mb-4">Quick Access</h3>
                  <div className="space-y-3">
                    <Link
                      href="/move-to-dubai/documents"
                      className="flex items-center gap-3 p-3 border border-white/10 hover:border-luxury-gold/40 hover:bg-white/[0.03] transition-all group"
                    >
                      <FileText className="w-5 h-5 text-luxury-gold/70 group-hover:text-luxury-gold" />
                      <span className="text-gray-300 text-sm group-hover:text-white transition-colors">
                        Documents
                      </span>
                      <ChevronRight className="w-4 h-4 text-gray-600 ml-auto group-hover:text-luxury-gold" />
                    </Link>
                    <Link
                      href="/move-to-dubai/cost"
                      className="flex items-center gap-3 p-3 border border-white/10 hover:border-luxury-gold/40 hover:bg-white/[0.03] transition-all group"
                    >
                      <Calculator className="w-5 h-5 text-luxury-gold/70 group-hover:text-luxury-gold" />
                      <span className="text-gray-300 text-sm group-hover:text-white transition-colors">
                        Cost Estimator
                      </span>
                      <ChevronRight className="w-4 h-4 text-gray-600 ml-auto group-hover:text-luxury-gold" />
                    </Link>
                  </div>
                </motion.div>

                {/* Profile Summary */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="border border-white/10 bg-white/[0.02] p-6"
                >
                  <h3 className="text-white font-display text-base mb-4">Your Profile</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Purpose</span>
                      <span className="text-gray-300 capitalize">{profile.purpose || 'Not set'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Family Size</span>
                      <span className="text-gray-300">{profile.family_size} people</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Target Date</span>
                      <span className="text-gray-300">
                        {profile.target_move_date 
                          ? new Date(profile.target_move_date).toLocaleDateString() 
                          : 'Not set'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Visa Status</span>
                      <span className="text-gray-300 capitalize">{profile.visa_status.replace('_', ' ')}</span>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* ── Right Column: Workflow & Steps ──────────────────────────── */}
              <div className="lg:col-span-2 space-y-6">
                {/* Active Workflow */}
                {activeWorkflow && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="border border-white/10 bg-white/[0.02] p-8"
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h2 className="text-2xl font-display text-white mb-2">
                          {activeWorkflow.title}
                        </h2>
                        <p className="text-gray-400">{activeWorkflow.description}</p>
                      </div>
                      <span className="px-3 py-1 border border-luxury-gold/30 text-luxury-gold text-xs uppercase tracking-widest">
                        {activeWorkflow.status}
                      </span>
                    </div>

                    {steps && steps.length > 0 && (
                      <WorkflowTimeline steps={steps} />
                    )}
                  </motion.div>
                )}

                {/* Next Step Card */}
                {nextStep && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <h3 className="text-white font-display text-lg mb-4">Next Step</h3>
                    <StepCard step={nextStep} />
                  </motion.div>
                )}

                {/* Remaining Steps */}
                {steps && steps.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <h3 className="text-white font-display text-lg mb-4">Your Steps</h3>
                    <div className="space-y-4">
                      {steps.map((step) => (
                        <StepCard key={step.id} step={step} compact />
                      ))}
                    </div>
                  </motion.div>
                )}

                {!activeWorkflow && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-luxury-gold/20 bg-luxury-gold/5 p-8 text-center"
                  >
                    <AlertCircle className="w-10 h-10 text-luxury-gold mx-auto mb-4" />
                    <h3 className="text-white font-display text-lg mb-2">
                      Workflow Pending
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Your personalised workflow will be generated once you complete the intake form.
                    </p>
                  </motion.div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
