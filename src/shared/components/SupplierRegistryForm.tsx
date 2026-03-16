import { Save } from 'lucide-react';
import type { SupplierFormValues } from '../utils/supplier';

interface SupplierRegistryFormProps {
  title: string;
  values: SupplierFormValues;
  onChange: <K extends keyof SupplierFormValues>(key: K, value: SupplierFormValues[K]) => void;
  onSubmit: (event: React.FormEvent) => void;
  onBack: () => void;
  submitLabel: string;
  saving: boolean;
  error?: string;
}

export default function SupplierRegistryForm({
  title,
  values,
  onChange,
  onSubmit,
  onBack,
  submitLabel,
  saving,
  error,
}: SupplierRegistryFormProps) {
  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
        Back to Suppliers
      </button>

      <h1 className="text-3xl font-display text-white mb-8">{title}</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-400/10 border border-red-400/20 text-red-300 text-sm rounded-sm">
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-6 max-w-3xl">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Supplier Name *</label>
            <input
              required
              value={values.name}
              onChange={(e) => onChange('name', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white text-sm focus:border-luxury-gold outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Contact Person</label>
            <input
              value={values.contact_person}
              onChange={(e) => onChange('contact_person', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white text-sm focus:border-luxury-gold outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Email</label>
            <input
              type="email"
              value={values.email}
              onChange={(e) => onChange('email', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white text-sm focus:border-luxury-gold outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Phone</label>
            <input
              value={values.phone}
              onChange={(e) => onChange('phone', e.target.value)}
              placeholder="+971..."
              className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white text-sm focus:border-luxury-gold outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">WhatsApp</label>
            <input
              value={values.whatsapp}
              onChange={(e) => onChange('whatsapp', e.target.value)}
              placeholder="+971..."
              className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white text-sm focus:border-luxury-gold outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Category or Categories</label>
            <input
              value={values.categories}
              onChange={(e) => onChange('categories', e.target.value)}
              placeholder="dining, nightlife, beach-clubs"
              className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white text-sm focus:border-luxury-gold outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Optional Commission Rate (%)</label>
            <input
              type="number"
              min={0}
              max={100}
              step={0.5}
              value={values.commission_rate}
              onChange={(e) => onChange('commission_rate', Number(e.target.value))}
              className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white text-sm focus:border-luxury-gold outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Status</label>
            <select
              value={values.status}
              onChange={(e) => onChange('status', e.target.value as SupplierFormValues['status'])}
              className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white text-sm focus:border-luxury-gold outline-none"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          <div className="col-span-2">
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Which Venues Belong To This Supplier (venue IDs, comma-separated)</label>
            <textarea
              value={values.venue_ids}
              onChange={(e) => onChange('venue_ids', e.target.value)}
              rows={3}
              placeholder="nc-nyx, r-ling-ling"
              className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white text-sm focus:border-luxury-gold outline-none resize-none"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Notes</label>
            <textarea
              value={values.notes}
              onChange={(e) => onChange('notes', e.target.value)}
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white text-sm focus:border-luxury-gold outline-none resize-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-8 py-4 bg-luxury-gold text-black font-bold text-xs uppercase tracking-widest hover:bg-white transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" /> {saving ? 'Saving...' : submitLabel}
        </button>
      </form>
    </div>
  );
}
