import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Plus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
import { useAdminVenues } from '../../hooks/useAdmin';
import { supabase } from '../../lib/supabase';
import { useQueryClient } from '@tanstack/react-query';
import { AdminEmptyState, AdminLoadingRows, AdminPageHeader, AdminSearchInput, AdminSelectFilter } from '../components';
import { useAdminFilters } from '../hooks';

export default function AdminVenues() {
  const { data: venues = [], isLoading } = useAdminVenues();
  const [filterCategory, setFilterCategory] = useState('all');
  const queryClient = useQueryClient();

  const categories = [...new Set(venues.map((v) => v.category))].sort();
  const { search, setSearch, filtered: searchFiltered } = useAdminFilters(venues, {
    searchAccessor: (item) => `${item.name} ${item.area}`,
  });

  const filtered = searchFiltered.filter((venue) => {
    if (filterCategory !== 'all' && venue.category !== filterCategory) return false;
    return true;
  });

  const toggleStatus = async (venueId: string, currentStatus: string) => {
    if (!supabase) throw new Error('Database not available');
    const newStatus = currentStatus === 'published' ? 'archived' : 'published';
    await supabase.from('venues').update({ status: newStatus }).eq('id', venueId);
    queryClient.invalidateQueries({ queryKey: ['admin', 'venues'] });
    queryClient.invalidateQueries({ queryKey: ['venues'] });
  };

  const deleteVenue = async (venueId: string) => {
    if (!confirm('Are you sure you want to delete this venue?')) return;
    if (!supabase) throw new Error('Database not available');
    await supabase.from('venues').delete().eq('id', venueId);
    queryClient.invalidateQueries({ queryKey: ['admin', 'venues'] });
    queryClient.invalidateQueries({ queryKey: ['venues'] });
  };

  return (
    <div>
      <AdminPageHeader
        title="Venues"
        actions={
          <Link
            href="/admin/venues/new"
            className="flex items-center gap-2 px-5 py-3 bg-luxury-gold text-black font-bold text-xs uppercase tracking-widest hover:bg-white transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Venue
          </Link>
        }
      />

      {/* Filters */}
      <div className="flex gap-4 mb-8">
        <AdminSearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search venues..."
        />
        <AdminSelectFilter
          value={filterCategory}
          onChange={setFilterCategory}
          options={[
            { value: 'all', label: 'All Categories' },
            ...categories.map((category) => ({ value: category, label: category })),
          ]}
        />
      </div>

      {/* Venue Table */}
      {isLoading ? (
        <AdminLoadingRows />
      ) : (
        <div className="border border-white/5 rounded-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="text-left p-4 text-xs font-bold uppercase tracking-wider text-gray-500">Venue</th>
                <th className="text-left p-4 text-xs font-bold uppercase tracking-wider text-gray-500">Category</th>
                <th className="text-left p-4 text-xs font-bold uppercase tracking-wider text-gray-500">Area</th>
                <th className="text-left p-4 text-xs font-bold uppercase tracking-wider text-gray-500">Price</th>
                <th className="text-left p-4 text-xs font-bold uppercase tracking-wider text-gray-500">Status</th>
                <th className="text-right p-4 text-xs font-bold uppercase tracking-wider text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((venue) => (
                <motion.tr
                  key={venue.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={venue.hero_image || undefined}
                        alt={venue.name}
                        className="w-10 h-10 rounded-sm object-cover"
                      />
                      <span className="text-white font-medium">{venue.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-400 text-sm capitalize">{venue.category.replace('-', ' ')}</td>
                  <td className="p-4 text-gray-400 text-sm">{venue.area}</td>
                  <td className="p-4 text-luxury-gold text-sm">{'$'.repeat(venue.price_tier)}</td>
                  <td className="p-4">
                    <span className={`text-xs font-bold uppercase tracking-wider ${
                      (venue.status ?? 'published') === 'published' ? 'text-green-400' : 'text-gray-500'
                    }`}>
                      {venue.status ?? 'published'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/venues/${venue.id}`}
                        className="p-2 text-gray-500 hover:text-luxury-gold transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => toggleStatus(venue.id, venue.status ?? 'published')}
                        className="p-2 text-gray-500 hover:text-yellow-400 transition-colors"
                        title={venue.status === 'published' ? 'Archive' : 'Publish'}
                      >
                        {venue.status === 'published' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => deleteVenue(venue.id)}
                        className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <AdminEmptyState message="No venues found." />}
        </div>
      )}
    </div>
  );
}
