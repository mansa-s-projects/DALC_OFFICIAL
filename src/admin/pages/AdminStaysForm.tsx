import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useQueryClient } from '@tanstack/react-query';
import { useAdminForm } from '../hooks';
import type { StaysProperty } from '../../types/stays';

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
  subcategory: 'hotels' as any,
  pricing_model: 'nightly' as any,
  base_price: 0,
  price_currency: 'AED',
  price_display: '',
  bedrooms: 1,
  bathrooms: 1,
  max_guests: 2,
  square_meters: 50,
  star_rating: 5,
  location: 'Dubai',
  area: '',
  address: '',
  hero_image: '',
  gallery_images: '',
  description_short: '',
  description_long: '',
  amenities: '',
  amenities_highlight: '',
  status: 'published' as any,
  is_featured: false,
};

export default function AdminStaysForm() {
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
        .from('stays_properties')
        .select('*')
        .eq('id', id)
        .single();

      if (err || !data) {
        setError('Property not found.');
        setLoading(false);
        return;
      }

      const p = data as StaysProperty;
      setForm({
        name: p.name,
        subcategory: p.subcategory || 'hotels',
        pricing_model: p.pricing_model || 'nightly',
        base_price: p.base_price || 0,
        price_currency: p.price_currency || 'AED',
        price_display: p.price_display || '',
        bedrooms: p.bedrooms || 1,
        bathrooms: p.bathrooms || 1,
        max_guests: p.max_guests || 2,
        square_meters: p.square_meters || 50,
        star_rating: p.star_rating || 5,
        location: p.location || 'Dubai',
        area: p.area || '',
        address: p.address || '',
        hero_image: p.hero_image || '',
        gallery_images: (p.gallery_images ?? []).join('\n'),
        description_short: p.description_short || '',
        description_long: p.description_long || '',
        amenities: (p.amenities ?? []).join('\n'),
        amenities_highlight: (p.amenities_highlight ?? []).join('\n'),
        status: p.status || 'published',
        is_featured: p.is_featured || false,
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
      subcategory: form.subcategory,
      pricing_model: form.pricing_model,
      base_price: form.base_price,
      price_currency: form.price_currency,
      price_display: form.price_display,
      bedrooms: form.bedrooms,
      bathrooms: form.bathrooms,
      max_guests: form.max_guests,
      square_meters: form.square_meters,
      star_rating: form.star_rating,
      location: form.location,
      area: form.area,
      address: form.address,
      hero_image: form.hero_image,
      gallery_images: form.gallery_images.split('\n').map((s) => s.trim()).filter(Boolean),
      description_short: form.description_short,
      description_long: form.description_long,
      amenities: form.amenities.split('\n').map((s) => s.trim()).filter(Boolean),
      amenities_highlight: form.amenities_highlight.split('\n').map((s) => s.trim()).filter(Boolean),
      status: form.status,
      is_featured: form.is_featured,
    };

    try {
      if (!supabase) throw new Error('Database not available');
      if (isNew) {
        const newId = generateUUID();
        const { error: err } = await supabase
          .from('stays_properties')
          .insert({ id: newId, ...payload });
        if (err) throw err;
      } else {
        const { error: err } = await supabase
          .from('stays_properties')
          .update(payload)
          .eq('id', id);
        if (err) throw err;
      }

      queryClient.invalidateQueries({ queryKey: ['admin', 'stays'] });
      queryClient.invalidateQueries({ queryKey: ['stays'] });
      navigate('/admin/stays');
    } catch (err: any) {
      setError(err.message ?? 'Failed to save property.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="space-y-4">{[1, 2, 3].map((i) => <div key={i} className="h-12 bg-white/5 rounded-sm animate-pulse" />)}</div>;
  }

  return (
    <div>
      <button onClick={() => navigate('/admin/stays')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Stays
      </button>

      <h1 className="text-3xl font-display text-white mb-8">
        {isNew ? 'Add Stay Property' : `Edit: ${form.name}`}
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
                <option value="hotels">Hotel</option>
                <option value="villas">Villa</option>
                <option value="residences">Residence</option>
              </select>
            </div>
            <div>
              <label htmlFor="area" className="block text-xs font-bold uppercase text-gray-500 mb-1">Area *</label>
              <input id="area" required value={form.area} onChange={(e) => update('area', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white text-sm focus:border-luxury-gold outline-none" />
            </div>
            <div>
              <label htmlFor="pricing_model" className="block text-xs font-bold uppercase text-gray-500 mb-1">Pricing Model</label>
              <select id="pricing_model" aria-label="Pricing Model" value={form.pricing_model} onChange={(e) => update('pricing_model', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white text-sm focus:border-luxury-gold outline-none">
                <option value="nightly">Nightly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            <div>
              <label htmlFor="base_price" className="block text-xs font-bold uppercase text-gray-500 mb-1">Base Price / Price From</label>
              <input id="base_price" type="number" required value={form.base_price} onChange={(e) => update('base_price', Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white text-sm focus:border-luxury-gold outline-none" />
            </div>
            <div>
              <label htmlFor="bedrooms" className="block text-xs font-bold uppercase text-gray-500 mb-1">Bedrooms</label>
              <input id="bedrooms" type="number" value={form.bedrooms} onChange={(e) => update('bedrooms', Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white text-sm focus:border-luxury-gold outline-none" />
            </div>
            <div>
              <label htmlFor="max_guests" className="block text-xs font-bold uppercase text-gray-500 mb-1">Max Guests</label>
              <input id="max_guests" type="number" value={form.max_guests} onChange={(e) => update('max_guests', Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white text-sm focus:border-luxury-gold outline-none" />
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
          <Save className="w-4 h-4 inline-block mr-2" /> {saving ? 'Saving...' : isNew ? 'Create Property' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
