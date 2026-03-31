import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useQueryClient } from '@tanstack/react-query';
import { useAdminForm } from '../hooks';
import type { ExperienceService } from '../../types/experiences';

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
  category: 'experiences' as const,
  subcategory: 'adventure',
  pricing_model: 'per_person' as any,
  price_from: 0,
  price_currency: 'AED',
  price_display: '',
  availability_type: 'scheduled' as any,
  max_capacity: 10,
  duration_minutes: 120,
  location: 'Dubai',
  area: '',
  hero_image: '',
  gallery_images: '',
  description_short: '',
  description_long: '',
  highlights: '',
  status: 'published' as 'draft' | 'published' | 'archived' | 'sold_out',
  is_featured: false,
};

export default function AdminExperienceForm() {
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
        .from('experience_services')
        .select('*')
        .eq('id', id)
        .single();

      if (err || !data) {
        setError('Experience service not found.');
        setLoading(false);
        return;
      }

      const v = data as ExperienceService;
      setForm({
        name: v.name,
        category: 'experiences',
        subcategory: v.subcategory || 'adventure',
        pricing_model: v.pricing_model || 'per_person',
        price_from: v.price_from || 0,
        price_currency: v.price_currency || 'AED',
        price_display: v.price_display || '',
        availability_type: v.availability_type || 'scheduled',
        max_capacity: v.max_capacity || 10,
        duration_minutes: v.duration_minutes || 120,
        location: v.location || 'Dubai',
        area: v.area || '',
        hero_image: v.hero_image || '',
        gallery_images: (v.gallery_images ?? []).join('\n'),
        description_short: v.description_short || '',
        description_long: v.description_long || '',
        highlights: (v.highlights ?? []).join('\n'),
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
      category: 'experiences',
      subcategory: form.subcategory,
      pricing_model: form.pricing_model,
      price_from: form.price_from,
      price_currency: form.price_currency,
      price_display: form.price_display,
      availability_type: form.availability_type,
      max_capacity: form.max_capacity,
      duration_minutes: form.duration_minutes,
      location: form.location,
      area: form.area,
      hero_image: form.hero_image,
      gallery_images: form.gallery_images.split('\n').map((s) => s.trim()).filter(Boolean),
      description_short: form.description_short,
      description_long: form.description_long,
      highlights: form.highlights.split('\n').map((s) => s.trim()).filter(Boolean),
      status: form.status,
      is_featured: form.is_featured,
    };

    try {
      if (!supabase) throw new Error('Database not available');
      if (isNew) {
        const newId = generateUUID();
        const { error: err } = await supabase
          .from('experience_services')
          .insert({ id: newId, ...payload });
        if (err) throw err;
      } else {
        const { error: err } = await supabase
          .from('experience_services')
          .update(payload)
          .eq('id', id);
        if (err) throw err;
      }

      queryClient.invalidateQueries({ queryKey: ['admin', 'experiences'] });
      queryClient.invalidateQueries({ queryKey: ['experiences'] });
      navigate('/admin/experiences');
    } catch (err: any) {
      setError(err.message ?? 'Failed to save experience.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="space-y-4">{[1, 2, 3].map((i) => <div key={i} className="h-12 bg-white/5 rounded-sm animate-pulse" />)}</div>;
  }

  return (
    <div>
      <button onClick={() => navigate('/admin/experiences')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Experiences
      </button>

      <h1 className="text-3xl font-display text-white mb-8">
        {isNew ? 'Add Experience Service' : `Edit: ${form.name}`}
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
              <input id="subcategory" required value={form.subcategory} onChange={(e) => update('subcategory', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white text-sm focus:border-luxury-gold outline-none" />
            </div>
            <div>
              <label htmlFor="area" className="block text-xs font-bold uppercase text-gray-500 mb-1">Area *</label>
              <input id="area" required value={form.area} onChange={(e) => update('area', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white text-sm focus:border-luxury-gold outline-none" />
            </div>
            <div>
              <label htmlFor="pricing_model" className="block text-xs font-bold uppercase text-gray-500 mb-1">Pricing Model</label>
              <select id="pricing_model" aria-label="Pricing Model" value={form.pricing_model} onChange={(e) => update('pricing_model', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white text-sm focus:border-luxury-gold outline-none">
                <option value="per_person">Per Person</option>
                <option value="per_group">Per Group</option>
                <option value="fixed">Fixed</option>
                <option value="tiered">Tiered</option>
              </select>
            </div>
            <div>
              <label htmlFor="price_from" className="block text-xs font-bold uppercase text-gray-500 mb-1">Price From</label>
              <input id="price_from" type="number" required value={form.price_from} onChange={(e) => update('price_from', Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white text-sm focus:border-luxury-gold outline-none" />
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
