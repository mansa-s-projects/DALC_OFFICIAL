import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { ArrowLeft, FileQuestion } from 'lucide-react';
import Footer from '../../../components/navigation/Footer';
import IntakeForm from '../../../components/relocation/IntakeForm';

export default function Intake() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-luxury-black">

      {/* ── Header ───────────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-12 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => router.push('/move-to-dubai')}
            className="flex items-center gap-2 text-gray-400 hover:text-luxury-gold transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm uppercase tracking-widest">Back to Move to Dubai</span>
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 border border-luxury-gold/30 bg-luxury-gold/5 mb-6">
              <FileQuestion className="w-4 h-4 text-luxury-gold" />
              <span className="text-luxury-gold text-xs font-bold uppercase tracking-[0.3em]">
                Intake Form
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-display text-white mb-4">
              Tell Us About Your Move
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Help us understand your situation so we can create a personalised relocation 
              roadmap tailored to your needs, timeline, and budget.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Form ─────────────────────────────────────────────────────────────── */}
      <section className="px-4 md:px-8 pb-24">
        <div className="max-w-3xl mx-auto">
          <IntakeForm />
        </div>
      </section>

      <Footer />
    </div>
  );
}
