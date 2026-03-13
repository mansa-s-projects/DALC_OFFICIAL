import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { supabase, isMockMode } from '../../lib/supabase';
import { useQueryClient } from '@tanstack/react-query';
import { Category, Venue } from '../../types';
import { useAdminForm } from '../hooks';

const CATEGORIES: Category[] = [
  'dining', 'nightlife', 'beach-clubs', 'dining-entertainment',
  'yachts', 'travel', 'car-rental', 'experiences',
  'wellness', 'shopping', 'business', 'events', 'sports',
];

const EMPTY_FORM = {
  name: '',
  category: 'dining' as Category,
  subcategory: 'Curated Venue',
  location: 'Dubai',
  area: '',
  vibe_tags: '',
  price_tier: 2,
  hero_image: '',
  gallery_images: '',
  description_short: '',
  description_long: '',
  highlights: '',
  opening_hours: '',
  dress_code: 'Smart Casual',
  booking_policy: 'Reservation required',
  cuisine: '',
  best_time: '',
  who_its_for: '',
  insider_tip: '',
  status: 'published' as 'draft' | 'published' | 'archived',
};

export default function AdminVenueForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isNew = !id || id === 'new';
  const { form, setForm, update } = useAdminForm(EMPTY_FORM);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isNew || isMockMode || !supabase) return;

    (async () => {
      const { data, error: err } = await supabase
        .from('venues')
        .select('*')
        .eq('id', id)
        .single();

      if (err || !data) {
        setError('Venue not found.');
        setLoading(false);
        return;
      }

      const v = data as Venue;
      setForm({
        name: v.name,
        category: v.category,
        subcategory: v.subcategory || 'Curated Venue',
        location: v.location || 'Dubai',
        area: v.area || '',
        vibe_tags: (v.vibe_tags ?? []).join(', '),
        price_tier: v.price_tier,
        hero_image: v.hero_image || '',
        gallery_images: (v.gallery_images ?? []).join('\n'),
        description_short: v.description_short || '',
        description_long: v.description_long || '',
        highlights: (v.highlights ?? []).join('\n'),
        opening_hours: v.opening_hours || '',
        dress_code: v.dress_code || 'Smart Casual',
        booking_policy: v.booking_policy || 'Reservation required',
        cuisine: v.cuisine || '',
        best_time: v.best_time || '',
        who_its_for: v.who_its_for || '',
        insider_tip: v.insider_tip || '',
        status: (v.status as 'draft' | 'published' | 'archived') ?? 'published',
      });
      setLoading(false);
    })();
  }, [id, isNew]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isMockMode || !supabase) return;

    setSaving(true);
    setError('');

    const payload = {
      name: form.name,
      category: form.category,
      subcategory: form.subcategory,
      location: form.location,
      area: form.area,
      vibe_tags: form.vibe_tags.split(',').map((s) => s.trim()).filter(Boolean),
      price_tier: form.price_tier,
      hero_image: form.hero_image,
      gallery_images: form.gallery_images.split('\n').map((s) => s.trim()).filter(Boolean),
      description_short: form.description_short,
      description_long: form.description_long,
      highlights: form.highlights.split('\n').map((s) => s.trim()).filter(Boolean),
      opening_hours: form.opening_hours,
      dress_code: form.dress_code,
      booking_policy: form.booking_policy,
      cuisine: form.cuisine || null,
      best_time: form.best_time || null,
      who_its_for: form.who_its_for || null,
      insider_tip: form.insider_tip || null,
      status: form.status,
    };

    try {
      if (isNew) {
        const venueId = form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const { error: err } = await supabase
          .from('venues')
          .insert({ id: venueId, ...payload });
        if (err) throw err;
      } else {
        const { error: err } = await supabase
          .from('venues')
          .update(payload)
          .eq('id', id);
        if (err) throw err;
      }

      queryClient.invalidateQueries({ queryKey: ['admin', 'venues'] });
      queryClient.invalidateQueries({ queryKey: ['venues'] });
      navigate('/admin/venues');
    } catch (err: any) {
      setError(err.message ?? 'Failed to save venue.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="space-y-4">{[1, 2, 3].map((i) => <div key={i} className="h-12 bg-white/5 rounded-sm animate-pulse" />)}</div>;
  }

  return (
    <div>
      <button onClick={() => navigate('/admin/venues')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Venues
      </button>

      <h1 className="text-3xl font-display text-white mb-8">
        {isNew ? 'Add Venue' : `Edit: ${form.name}`}
      </h1>

      {error && (
        <div className="mb-6 p-4 bg-red-400/10 border border-red-400/20 text-red-300 text-sm rounded-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
        {/* Basic Info */}
        <section className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 border-b border-white/5 pb-2">Basic Info</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Name *</label>
              <input required value={form.name} onChange={(e) => update('name', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white text-sm focus:border-luxury-gold outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Category *</label>
              <select value={form.category} onChange={(e) => update('category', e.target.value as Category)} className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white text-sm focus:border-luxury-gold outline-none">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c.replace('-', ' ')}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Subcategory</label>
              <input value={form.subcategory} onChange={(e) => update('subcategory', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white text-sm focus:border-luxury-gold outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Area *</label>
              <input required value={form.area} onChange={(e) => update('area', e.target.value)} placeholder="e.g. DIFC, JBR, Downtown" className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white text-sm focus:border-luxury-gold outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Price Tier</label>
              <select value={form.price_tier} onChange={(e) => update('price_tier', Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white text-sm focus:border-luxury-gold outline-none">
                <option value={1}>$ (Budget)</option>
                <option value={2}>$$ (Moderate)</option>
                <option value={3}>$$$ (Premium)</option>
                <option value={4}>$$$$ (Ultra Luxury)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Status</label>
              <select value={form.status} onChange={(e) => update('status', e.target.value as 'draft' | 'published' | 'archived')} className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white text-sm focus:border-luxury-gold outline-none">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Vibe Tags (comma-separated)</label>
              <input value={form.vibe_tags} onChange={(e) => update('vibe_tags', e.target.value)} placeholder="Elegant, Rooftop, Vibrant" className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white text-sm focus:border-luxury-gold outline-none" />
            </div>
          </div>
        </section>

        {/* Images */}
        <section className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 border-b border-white/5 pb-2">Images</h2>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Hero Image URL</label>
            <input value={form.hero_image} onChange={(e) => update('hero_image', e.target.value)} placeholder="https://..." className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white text-sm focus:border-luxury-gold outline-none" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Gallery Image URLs (one per line)</label>
            <textarea value={form.gallery_images} onChange={(e) => update('gallery_images', e.target.value)} rows={4} className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white text-sm focus:border-luxury-gold outline-none resize-none" />
          </div>
        </section>

        {/* Descriptions */}
        <section className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 border-b border-white/5 pb-2">Descriptions</h2>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Short Description</label>
            <input value={form.description_short} onChange={(e) => update('description_short', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white text-sm focus:border-luxury-gold outline-none" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Long Description</label>
            <textarea value={form.description_long} onChange={(e) => update('description_long', e.target.value)} rows={5} className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white text-sm focus:border-luxury-gold outline-none resize-none" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Highlights (one per line)</label>
            <textarea value={form.highlights} onChange={(e) => update('highlights', e.target.value)} rows={4} className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white text-sm focus:border-luxury-gold outline-none resize-none" />
          </div>
        </section>

        {/* Details */}
        <section className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 border-b border-white/5 pb-2">Venue Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Opening Hours</label>
              <input value={form.opening_hours} onChange={(e) => update('opening_hours', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white text-sm focus:border-luxury-gold outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Dress Code</label>
              <input value={form.dress_code} onChange={(e) => update('dress_code', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white text-sm focus:border-luxury-gold outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Cuisine</label>
              <input value={form.cuisine} onChange={(e) => update('cuisine', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white text-sm focus:border-luxury-gold outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Best Time</label>
              <input value={form.best_time} onChange={(e) => update('best_time', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white text-sm focus:border-luxury-gold outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Who It's For</label>
              <input value={form.who_its_for} onChange={(e) => update('who_its_for', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white text-sm focus:border-luxury-gold outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Booking Policy</label>
              <input value={form.booking_policy} onChange={(e) => update('booking_policy', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white text-sm focus:border-luxury-gold outline-none" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Insider Tip</label>
              <textarea value={form.insider_tip} onChange={(e) => update('insider_tip', e.target.value)} rows={2} className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white text-sm focus:border-luxury-gold outline-none resize-none" />
            </div>
          </div>
        </section>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-8 py-4 bg-luxury-gold text-black font-bold text-xs uppercase tracking-widest hover:bg-white transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" /> {saving ? 'Saving...' : isNew ? 'Create Venue' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
