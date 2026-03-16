import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calculator,
  ArrowLeft,
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  Loader2,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import Navbar from '../../../components/navigation/Navbar';
import Footer from '../../../components/navigation/Footer';
import CostBreakdown from '../../../components/relocation/CostBreakdown';
import { useCostSummary, useAddCostEstimate } from '../hooks/useRelocationCost';
import { useRelocationProfile } from '../hooks/useRelocation';
import { useUser } from '../../../hooks/useUser';
import type { AddCostEstimateInput } from '../types';

// ─── Add Cost Form Component ──────────────────────────────────────────────────

interface AddCostFormProps {
  profileId: string;
  onCancel: () => void;
  onSuccess: () => void;
}

function AddCostForm({ profileId, onCancel, onSuccess }: AddCostFormProps) {
  const [formData, setFormData] = useState<Partial<AddCostEstimateInput>>({
    category: 'Housing',
    item_name: '',
    estimated_min: undefined,
    estimated_max: undefined,
    currency: 'AED',
    is_recurring: false,
    recurrence_period: null,
    notes: null,
  });

  const addCost = useAddCostEstimate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.item_name || !formData.estimated_min || !formData.estimated_max) return;

    await addCost.mutateAsync({
      ...formData,
      relocation_profile_id: profileId,
      item_name: formData.item_name,
      estimated_min: formData.estimated_min,
      estimated_max: formData.estimated_max,
      currency: formData.currency || 'AED',
      category: formData.category || 'Other',
      is_recurring: formData.is_recurring || false,
    } as AddCostEstimateInput);

    onSuccess();
  };

  const categories = [
    'Visa & Immigration',
    'Housing',
    'Education',
    'Healthcare',
    'Transportation',
    'Business Setup',
    'Utilities',
    'Other',
  ];

  return (
    <motion.form
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      onSubmit={handleSubmit}
      className="border border-luxury-gold/30 bg-luxury-gold/5 p-6 mb-6"
    >
      <h4 className="text-white font-display text-base mb-4">Add Cost Item</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-gray-500 text-xs uppercase tracking-widest mb-2">
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full bg-white/5 border border-white/20 px-4 py-2.5 text-white text-sm focus:border-luxury-gold focus:outline-none transition-colors"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat} className="bg-luxury-black">
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-500 text-xs uppercase tracking-widest mb-2">
            Item Name
          </label>
          <input
            type="text"
            value={formData.item_name}
            onChange={(e) => setFormData({ ...formData, item_name: e.target.value })}
            placeholder="e.g., Apartment Rent"
            className="w-full bg-white/5 border border-white/20 px-4 py-2.5 text-white text-sm placeholder:text-gray-600 focus:border-luxury-gold focus:outline-none transition-colors"
            required
          />
        </div>

        <div>
          <label className="block text-gray-500 text-xs uppercase tracking-widest mb-2">
            Min Cost (AED)
          </label>
          <input
            type="number"
            value={formData.estimated_min || ''}
            onChange={(e) => setFormData({ ...formData, estimated_min: Number(e.target.value) })}
            placeholder="0"
            className="w-full bg-white/5 border border-white/20 px-4 py-2.5 text-white text-sm placeholder:text-gray-600 focus:border-luxury-gold focus:outline-none transition-colors"
            required
          />
        </div>

        <div>
          <label className="block text-gray-500 text-xs uppercase tracking-widest mb-2">
            Max Cost (AED)
          </label>
          <input
            type="number"
            value={formData.estimated_max || ''}
            onChange={(e) => setFormData({ ...formData, estimated_max: Number(e.target.value) })}
            placeholder="0"
            className="w-full bg-white/5 border border-white/20 px-4 py-2.5 text-white text-sm placeholder:text-gray-600 focus:border-luxury-gold focus:outline-none transition-colors"
            required
          />
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.is_recurring}
            onChange={(e) => setFormData({ 
              ...formData, 
              is_recurring: e.target.checked,
              recurrence_period: e.target.checked ? 'monthly' : null,
            })}
            className="w-4 h-4 accent-luxury-gold"
          />
          <span className="text-gray-400 text-sm">Recurring expense</span>
        </label>

        {formData.is_recurring && (
          <select
            value={formData.recurrence_period || 'monthly'}
            onChange={(e) => setFormData({ ...formData, recurrence_period: e.target.value })}
            className="bg-white/5 border border-white/20 px-3 py-1.5 text-white text-sm focus:border-luxury-gold focus:outline-none"
          >
            <option value="monthly" className="bg-luxury-black">Monthly</option>
            <option value="yearly" className="bg-luxury-black">Yearly</option>
            <option value="quarterly" className="bg-luxury-black">Quarterly</option>
          </select>
        )}
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={addCost.isPending}
          className="flex items-center gap-2 px-4 py-2 bg-luxury-gold text-luxury-black text-sm font-bold uppercase tracking-widest hover:bg-luxury-gold/90 transition-colors disabled:opacity-50"
        >
          {addCost.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Check className="w-4 h-4" />
          )}
          Add Item
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-2 px-4 py-2 border border-white/20 text-gray-400 text-sm uppercase tracking-widest hover:border-luxury-gold/50 hover:text-luxury-gold transition-colors"
        >
          <X className="w-4 h-4" />
          Cancel
        </button>
      </div>
    </motion.form>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CostEstimator() {
  const { data: userData } = useUser();
  const userId = userData?.session?.user?.id ?? '';

  const { data: profile, isLoading: profileLoading } = useRelocationProfile(userId);
  const { summary, isLoading: summaryLoading } = useCostSummary(profile?.id);

  const [showAddForm, setShowAddForm] = useState(false);

  const isLoading = profileLoading || summaryLoading;

  // Format currency
  const formatAED = (amount: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-luxury-black">
      <Navbar />

      {/* ── Header ───────────────────────────────────────────────────────────── */}
      <section className="pt-28 pb-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <Link
            to="/move-to-dubai/dashboard"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-luxury-gold transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm uppercase tracking-widest">Back to Dashboard</span>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 border border-luxury-gold/30 bg-luxury-gold/10 flex items-center justify-center">
                <Calculator className="w-6 h-6 text-luxury-gold" />
              </div>
              <div>
                <p className="text-luxury-gold text-xs font-bold uppercase tracking-[0.3em]">
                  Financial Planning
                </p>
                <h1 className="text-3xl md:text-4xl font-display text-white">
                  Cost Estimator
                </h1>
              </div>
            </div>

            {/* Quick Summary */}
            {!isLoading && summary && (
              <div className="flex gap-6">
                <div className="text-center">
                  <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">One-time</p>
                  <p className="text-xl font-display text-luxury-gold">
                    {formatAED(summary.oneTimeMin)} - {formatAED(summary.oneTimeMax)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">Recurring</p>
                  <p className="text-xl font-display text-white">
                    {formatAED(summary.recurringMin)} - {formatAED(summary.recurringMax)}
                  </p>
                </div>
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
              <Wallet className="w-12 h-12 text-luxury-gold mx-auto mb-4 opacity-60" />
              <h2 className="text-2xl font-display text-white mb-3">
                No Profile Found
              </h2>
              <p className="text-gray-400 max-w-md mx-auto mb-6">
                Complete your intake form first to get a personalised cost estimate 
                based on your specific situation.
              </p>
              <Link
                to="/move-to-dubai/intake"
                className="inline-flex items-center gap-2 px-6 py-3 bg-luxury-gold text-luxury-black text-sm font-bold uppercase tracking-widest hover:bg-luxury-gold/90 transition-all duration-300"
              >
                Start Intake
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* ── Left Column: Cost Breakdown ─────────────────────────────── */}
              <div className="lg:col-span-2 space-y-6">
                {/* Add Cost Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center justify-between"
                >
                  <h3 className="text-white font-display text-lg">Cost Breakdown</h3>
                  <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="flex items-center gap-2 px-4 py-2 border border-luxury-gold/40 text-luxury-gold text-sm uppercase tracking-widest hover:bg-luxury-gold/10 transition-colors"
                  >
                    {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    {showAddForm ? 'Cancel' : 'Add Item'}
                  </button>
                </motion.div>

                {/* Add Cost Form */}
                <AnimatePresence>
                  {showAddForm && profile && (
                    <AddCostForm
                      profileId={profile.id}
                      onCancel={() => setShowAddForm(false)}
                      onSuccess={() => setShowAddForm(false)}
                    />
                  )}
                </AnimatePresence>

                {/* Cost Breakdown Component */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <CostBreakdown summary={summary} />
                </motion.div>
              </div>

              {/* ── Right Column: Summary Cards ─────────────────────────────── */}
              <div className="space-y-6">
                {/* Grand Total Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="border border-luxury-gold/30 bg-luxury-gold/5 p-8 text-center"
                >
                  <TrendingUp className="w-8 h-8 text-luxury-gold mx-auto mb-4" />
                  <p className="text-gray-400 text-xs uppercase tracking-[0.3em] mb-2">
                    Estimated Total
                  </p>
                  {summary ? (
                    <>
                      <p className="text-3xl md:text-4xl font-display text-luxury-gold mb-2">
                        {formatAED(summary.grandTotalMin)} -
                      </p>
                      <p className="text-3xl md:text-4xl font-display text-luxury-gold">
                        {formatAED(summary.grandTotalMax)}
                      </p>
                    </>
                  ) : (
                    <p className="text-2xl font-display text-gray-500">No estimates yet</p>
                  )}
                  <p className="text-gray-500 text-xs mt-4">
                    *Estimates are indicative and subject to change
                  </p>
                </motion.div>

                {/* One-time vs Recurring */}
                {summary && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="border border-white/10 bg-white/[0.02] p-6"
                  >
                    <h3 className="text-white font-display text-base mb-6">Cost Structure</h3>
                    
                    <div className="space-y-6">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-400 text-sm">One-time Costs</span>
                          <span className="text-white text-sm font-medium">
                            {formatAED(summary.oneTimeMin)} - {formatAED(summary.oneTimeMax)}
                          </span>
                        </div>
                        <div className="h-2 bg-white/10 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(summary.oneTimeMax / summary.grandTotalMax) * 100}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="h-full bg-luxury-gold"
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-400 text-sm">Recurring Costs</span>
                          <span className="text-white text-sm font-medium">
                            {formatAED(summary.recurringMin)} - {formatAED(summary.recurringMax)}
                          </span>
                        </div>
                        <div className="h-2 bg-white/10 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(summary.recurringMax / summary.grandTotalMax) * 100}%` }}
                            transition={{ duration: 1, delay: 0.6 }}
                            className="h-full bg-white/40"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-white/10">
                      <p className="text-gray-500 text-xs leading-relaxed">
                        Recurring costs are typically monthly or yearly expenses such as 
                        rent, school fees, and insurance premiums.
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Tips Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="border border-white/10 bg-white/[0.02] p-6"
                >
                  <h3 className="text-white font-display text-base mb-4">Budget Tips</h3>
                  <ul className="space-y-3 text-sm text-gray-400">
                    <li className="flex items-start gap-2">
                      <div className="w-1 h-1 rounded-full bg-luxury-gold mt-2" />
                      <span>Add 10-15% buffer for unexpected expenses</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1 h-1 rounded-full bg-luxury-gold mt-2" />
                      <span>Consider temporary accommodation costs initially</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1 h-1 rounded-full bg-luxury-gold mt-2" />
                      <span>School fees vary significantly by curriculum</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1 h-1 rounded-full bg-luxury-gold mt-2" />
                      <span>DEWA deposits are typically 5% of annual rent</span>
                    </li>
                  </ul>
                </motion.div>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
