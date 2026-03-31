import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useQueryClient } from '@tanstack/react-query';
import { useAdminForm } from '../hooks';
import type { TransportService } from '../../types/transport';

// Generate a UUID v4 using crypto API
function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for older browsers (still better than Math.random() for UUID v4)
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = crypto.getRandomValues(new Uint8Array(1))[0] % 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

const EMPTY_FORM = {
  name: '',
  category: 'transport' as const,
  subcategory: 'cars',
  sub_subcategory: 'luxury-sedans',
  pricing_model: 'hourly' as any,
  price_from: 0,
  price_currency: 'AED',
  price_display: '',
  availability_type: 'on_demand' as any,
  available_days: 'Mon,Tue,Wed,Thu,Fri,Sat,Sun',
  max_capacity: 4,
  min_booking_hours: 4,
  advance_booking_hours: 4,
  location: 'Dubai',
  area: '',
  hero_image: '',
  gallery_images: '',
  description_short: '',
  description_long: '',
  highlights: '',
  pickup_locations: '',
  status: 'published' as 'draft' | 'published' | 'archived',
  is_featured: false,
};

export default function AdminTransportForm() {
  const params = useParams();
  const id = params?.id as string | undefined;
  const router = useRouter();
  const navigate = (path: string) => router.push(path);
  const queryClient = useQueryClient();
  const isNew = !id || id === 'new';
  const { form, setForm, update } = useAdminForm(EMPTY_FORM);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isNew) return;

    (async () => {
      if (!supabase) return;
      const { data, error: err } = await supabase
        .from('transport_services')
        .select('*')
        .eq('id', id)
        .single();

      if (err || !data) {
        setError('Transport service not found.');
        setLoading(false);
        return;
      }

      const v = data as TransportService;
      setForm({
        name: v.name,
        category: 'transport',
        subcategory: v.subcategory || 'cars',
        sub_subcategory: v.sub_subcategory || '',
        pricing_model: v.pricing_model || 'hourly',
        price_from: v.price_from || 0,
        price_currency: v.price_currency || 'AED',
        price_display: v.price_display || '',
        availability_type: v.availability_type || 'on_demand',
        available_days: (v.available_days ?? []).join(','),
        max_capacity: v.max_capacity || 4,
        min_booking_hours: v.min_booking_hours || 4,
        advance_booking_hours: v.advance_booking_hours || 4,
        location: v.location || 'Dubai',
        area: v.area || '',
        hero_image: v.hero_image || '',
        gallery_images: (v.gallery_images ?? []).join('\n'),
        description_short: v.description_short || '',
        description_long: v.description_long || '',
        highlights: (v.highlights ?? []).join('\n'),
        pickup_locations: (v.pickup_locations ?? []).join('\n'),
        status: v.status || 'published',
        is_featured: v.is_featured || false,
      });
      setLoading(false);
    })();
  }, [id, isNew]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      name: form.name,
      slug: form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
      category: 'transport',
      subcategory: form.subcategory,
      sub_subcategory: form.sub_subcategory,
      pricing_model: form.pricing_model,
      price_from: form.price_from,
      price_currency: form.price_currency,
      price_display: form.price_display,
      availability_type: form.availability_type,
      available_days: form.available_days.split(',').map((s) => s.trim()).filter(Boolean),
      max_capacity: form.max_capacity,
      min_booking_hours: form.min_booking_hours,
      advance_booking_hours: form.advance_booking_hours,
      location: form.location,
      area: form.area,
      hero_image: form.hero_image,
      gallery_images: form.gallery_images.split('\n').map((s) => s.trim()).filter(Boolean),
      description_short: form.description_short,
      description_long: form.description_long,
      highlights: form.highlights.split('\n').map((s) => s.trim()).filter(Boolean),
      pickup_locations: form.pickup_locations.split('\n').map((s) => s.trim()).filter(Boolean),
      status: form.status,
      is_featured: form.is_featured,
    };

    try {
      if (!supabase) throw new Error('Database not available');
      if (isNew) {
        const newId = generateUUID();
        const { error: err } = await supabase
          .from('transport_services')
          .insert({ id: newId, ...payload });
        if (err) throw err;
      } else {
        const { error: err } = await supabase
          .from('transport_services')
          .update(payload)
          .eq('id', id);
        if (err) throw err;
      }

      queryClient.invalidateQueries({ queryKey: ['admin', 'transport'] });
      queryClient.invalidateQueries({ queryKey: ['transport'] });
      navigate('/admin/transport');
    } catch (err: any) {
      setError(err.message ?? 'Failed to save transport service.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="space-y-4">{[1, 2, 3].map((i) => <div key={i} className="h-12 bg-white/5 rounded-sm animate-pulse" />)}</div>;
  }

  return (
    <div>
      <button onClick={() => navigate('/admin/transport')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Transport
      </button>

      <h1 className="text-3xl font-display text-white mb-8">
        {isNew ? 'Add Transport Service' : `Edit: ${form.name}`}
      </h1>

      {error && (
        <div className="mb-6 p-4 bg-red-400/10 border border-red-400/20 text-red-300 text-sm rounded-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
        <section className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 border-b border-white/5 pb-2">Basic Info</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label htmlFor="name" className="block text-xs font-bold uppercase text-gray-500 mb-1">Name *</label>
              <input id="name" required value={form.name} onChange={(e) => update('name', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white text-sm focus:border-luxury-gold outline-none" />
            </div>
            <div>
              <label htmlFor="subcategory" className="block text-xs font-bold uppercase text-gray-500 mb-1">Subcategory *</label>
              <select id="subcategory" aria-label="Subcategory" value={form.subcategory} onChange={(e) => update('subcategory', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white text-sm focus:border-luxury-gold outline-none">
                <option value="cars">Cars</option>
                <option value="yachts">Yachts</option>
                <option value="jets">Jets</option>
              </select>
            </div>
            <div>
              <label htmlFor="sub_subcategory" className="block text-xs font-bold uppercase text-gray-500 mb-1">Type (e.g. luxury-sedan)</label>
              <input id="sub_subcategory" value={form.sub_subcategory} onChange={(e) => update('sub_subcategory', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white text-sm focus:border-luxury-gold outline-none" />
            </div>
            <div>
              <label htmlFor="area" className="block text-xs font-bold uppercase text-gray-500 mb-1">Area *</label>
              <input id="area" required value={form.area} onChange={(e) => update('area', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white text-sm focus:border-luxury-gold outline-none" />
            </div>
            <div>
              <label htmlFor="pricing_model" className="block text-xs font-bold uppercase text-gray-500 mb-1">Pricing Model</label>
              <select id="pricing_model" aria-label="Pricing Model" value={form.pricing_model} onChange={(e) => update('pricing_model', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white text-sm focus:border-luxury-gold outline-none">
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="per_trip">Per Trip</option>
                <option value="fixed">Fixed</option>
              </select>
            </div>
            <div>
              <label htmlFor="price_from" className="block text-xs font-bold uppercase text-gray-500 mb-1">Price From</label>
              <input id="price_from" type="number" required value={form.price_from} onChange={(e) => update('price_from', Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white text-sm focus:border-luxury-gold outline-none" />
            </div>
            <div>
              <label htmlFor="price_display" className="block text-xs font-bold uppercase text-gray-500 mb-1">Price Display</label>
              <input id="price_display" value={form.price_display} onChange={(e) => update('price_display', e.target.value)} placeholder="AED 1,200/hour" className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white text-sm focus:border-luxury-gold outline-none" />
            </div>
            <div>
               <label className="flex items-center gap-2 mt-8 cursor-pointer">
                <input type="checkbox" checked={form.is_featured} onChange={(e) => update('is_featured', e.target.checked)} className="appearance-none w-5 h-5 border border-white/20 rounded-sm checked:bg-luxury-gold checked:border-luxury-gold transition-colors flex items-center justify-center shrink-0 after:content-[''] checked:after:block after:hidden after:w-1.5 after:h-2.5 after:border-r-2 after:border-b-2 after:border-black after:rotate-45 after:-translate-y-0.5" />
                <span className="text-sm text-gray-300 select-none">Featured on Homepage</span>
              </label>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 border-b border-white/5 pb-2">Images</h2>
          <div>
            <label htmlFor="hero_image" className="block text-xs font-bold uppercase text-gray-500 mb-1">Hero Image URL</label>
            <input id="hero_image" value={form.hero_image} onChange={(e) => update('hero_image', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white text-sm focus:border-luxury-gold outline-none" />
          </div>
        </section>

        <button type="submit" disabled={saving} className="px-8 py-4 bg-luxury-gold text-black font-bold text-xs uppercase tracking-widest hover:bg-white transition-colors disabled:opacity-50">
          <Save className="w-4 h-4 inline-block mr-2" /> {saving ? 'Saving...' : isNew ? 'Create Service' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
