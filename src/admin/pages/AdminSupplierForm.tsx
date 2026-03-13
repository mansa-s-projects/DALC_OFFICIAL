import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { useSuppliers } from '../../hooks/useSuppliers';
import { useAdminForm } from '../hooks';

const EMPTY_FORM = {
  name: '',
  contact_person: '',
  email: '',
  phone: '',
  whatsapp: '',
  categories: '',
  commission_rate: 10,
  notes: '',
  status: 'active' as 'active' | 'inactive' | 'pending',
};

export default function AdminSupplierForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id || id === 'new';
  const { suppliers, createSupplier, updateSupplier } = useSuppliers();
  const { form, setForm, update } = useAdminForm(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isNew) return;
    const existing = suppliers.find((s) => s.id === id);
    if (existing) {
      setForm({
        name: existing.name,
        contact_person: existing.contact_person || '',
        email: existing.email || '',
        phone: existing.phone || '',
        whatsapp: existing.whatsapp || '',
        categories: existing.categories.join(', '),
        commission_rate: existing.commission_rate,
        notes: existing.notes || '',
        status: existing.status,
      });
    }
  }, [id, isNew, suppliers]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      name: form.name,
      contact_person: form.contact_person || undefined,
      email: form.email || undefined,
      phone: form.phone || undefined,
      whatsapp: form.whatsapp || undefined,
      categories: form.categories.split(',').map((s) => s.trim()).filter(Boolean),
      commission_rate: form.commission_rate,
      notes: form.notes || undefined,
      status: form.status,
    };

    try {
      if (isNew) {
        await createSupplier.mutateAsync(payload);
      } else {
        await updateSupplier.mutateAsync({ id: id!, updates: payload });
      }
      navigate('/admin/suppliers');
    } catch (err: any) {
      setError(err.message ?? 'Failed to save supplier.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <button onClick={() => navigate('/admin/suppliers')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Suppliers
      </button>

      <h1 className="text-3xl font-display text-white mb-8">
        {isNew ? 'Add Supplier' : `Edit: ${form.name}`}
      </h1>

      {error && (
        <div className="mb-6 p-4 bg-red-400/10 border border-red-400/20 text-red-300 text-sm rounded-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Company Name *</label>
            <input required value={form.name} onChange={(e) => update('name', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white text-sm focus:border-luxury-gold outline-none" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Contact Person</label>
            <input value={form.contact_person} onChange={(e) => update('contact_person', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white text-sm focus:border-luxury-gold outline-none" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Email</label>
            <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white text-sm focus:border-luxury-gold outline-none" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Phone</label>
            <input value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="+971..." className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white text-sm focus:border-luxury-gold outline-none" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">WhatsApp</label>
            <input value={form.whatsapp} onChange={(e) => update('whatsapp', e.target.value)} placeholder="+971..." className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white text-sm focus:border-luxury-gold outline-none" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Categories (comma-separated)</label>
            <input value={form.categories} onChange={(e) => update('categories', e.target.value)} placeholder="dining, nightlife, beach-clubs" className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white text-sm focus:border-luxury-gold outline-none" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Commission Rate (%)</label>
            <input type="number" min={0} max={100} step={0.5} value={form.commission_rate} onChange={(e) => update('commission_rate', Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white text-sm focus:border-luxury-gold outline-none" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Status</label>
            <select value={form.status} onChange={(e) => update('status', e.target.value as 'active' | 'inactive' | 'pending')} className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white text-sm focus:border-luxury-gold outline-none">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Notes</label>
            <textarea value={form.notes} onChange={(e) => update('notes', e.target.value)} rows={3} className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white text-sm focus:border-luxury-gold outline-none resize-none" />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-8 py-4 bg-luxury-gold text-black font-bold text-xs uppercase tracking-widest hover:bg-white transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" /> {saving ? 'Saving...' : isNew ? 'Create Supplier' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
