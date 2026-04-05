import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Edit2, Trash2, Upload, CheckCircle, AlertCircle, Eye } from 'lucide-react';
import { useSuppliers } from '../../hooks/useSuppliers';
import { useSupplierRegistry } from '../../shared/hooks/useSupplierRegistry';
import { lookupVenueIds } from '../../data/venues/venueAliasMap';
import { AdminEmptyState, AdminPageHeader, AdminSearchInput, AdminSelectFilter } from '../components';
import { useAdminFilters } from '../hooks';
import type { BulkImportRow } from '../../platform/requests/suppliers';

// â”€â”€ Bulk import tab â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

interface ParsedPreviewRow extends BulkImportRow {
  resolvedVenueIds: string[];
}

function parseBulkJson(raw: string): ParsedPreviewRow[] {
  const data = JSON.parse(raw);
  // Accept: raw array  OR  { venues: [...] }  OR  { data: [...] }
  const rows: BulkImportRow[] = Array.isArray(data)
    ? data
    : (data.venues ?? data.data ?? []);

  return rows.map((row) => ({
    ...row,
    // Run alias lookup to enrich any rows that came without venue_ids
    resolvedVenueIds:
      row.venue_ids && row.venue_ids.length > 0
        ? row.venue_ids
        : lookupVenueIds(row.name),
  }));
}

function BulkImportTab() {
  const { bulkImport } = useSupplierRegistry();
  const [raw, setRaw] = useState('');
  const [preview, setPreview] = useState<ParsedPreviewRow[] | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [result, setResult] = useState<{ created: number; updated: number; errors: Array<{ name: string; error: string }> } | null>(null);

  function handleParse() {
    setParseError(null);
    setResult(null);
    try {
      const rows = parseBulkJson(raw.trim());
      if (rows.length === 0) throw new Error('No rows found in the pasted JSON.');
      setPreview(rows);
    } catch (e) {
      setParseError((e as Error).message);
      setPreview(null);
    }
  }

  async function handleImport() {
    if (!preview) return;
    const importRows: BulkImportRow[] = preview.map((row) => ({
      ...row,
      venue_ids: row.resolvedVenueIds,
    }));
    const res = await bulkImport.mutateAsync(importRows);
    setResult(res);
    setPreview(null);
    setRaw('');
  }

  if (result) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center">
        <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
        <h3 className="text-white text-xl font-display mb-2">Import Complete</h3>
        <div className="flex justify-center gap-8 mt-6 mb-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-luxury-gold">{result.created}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">Created</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400">{result.updated}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">Updated</div>
          </div>
          {result.errors.length > 0 && (
            <div className="text-center">
              <div className="text-3xl font-bold text-red-400">{result.errors.length}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">Errors</div>
            </div>
          )}
        </div>
        {result.errors.length > 0 && (
          <div className="text-left border border-red-400/20 rounded-sm p-4 mb-6 space-y-1">
            {result.errors.map((e) => (
              <div key={e.name} className="text-red-400 text-xs">
                <span className="font-bold">{e.name}</span>: {e.error}
              </div>
            ))}
          </div>
        )}
        <button
          onClick={() => setResult(null)}
          className="px-6 py-2 border border-white/10 text-gray-400 text-xs uppercase tracking-wider hover:text-white transition-colors"
        >
          Import More
        </button>
      </div>
    );
  }

  if (preview) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-white font-display text-lg">Preview â€” {preview.length} rows</h3>
            <p className="text-gray-500 text-xs mt-1">Review the data below, then click Import to apply.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setPreview(null)}
              className="px-4 py-2 border border-white/10 text-gray-400 text-xs uppercase tracking-wider hover:text-white transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleImport}
              disabled={bulkImport.isPending}
              className="flex items-center gap-2 px-5 py-2 bg-luxury-gold text-black font-bold text-xs uppercase tracking-widest hover:bg-white transition-colors disabled:opacity-50"
            >
              {bulkImport.isPending ? 'Importingâ€¦' : `Import ${preview.length} suppliers`}
            </button>
          </div>
        </div>

        <div className="border border-white/5 rounded-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="text-left p-3 text-xs font-bold uppercase tracking-wider text-gray-500">Name</th>
                <th className="text-left p-3 text-xs font-bold uppercase tracking-wider text-gray-500">Category</th>
                <th className="text-left p-3 text-xs font-bold uppercase tracking-wider text-gray-500">Location</th>
                <th className="text-left p-3 text-xs font-bold uppercase tracking-wider text-gray-500">Venue IDs</th>
                <th className="text-left p-3 text-xs font-bold uppercase tracking-wider text-gray-500">Match</th>
              </tr>
            </thead>
            <tbody>
              {preview.map((row, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="p-3 text-white font-medium">{row.name}</td>
                  <td className="p-3 text-gray-400">{row.categories.join(', ')}</td>
                  <td className="p-3 text-gray-500 text-xs">{row.location || 'â€”'}</td>
                  <td className="p-3 text-gray-400 text-xs font-mono">
                    {row.resolvedVenueIds.length > 0 ? row.resolvedVenueIds.join(', ') : 'â€”'}
                  </td>
                  <td className="p-3">
                    {row.resolvedVenueIds.length > 0 ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <span className="text-xs text-yellow-400 uppercase tracking-wider">New</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <p className="text-gray-400 text-sm mb-1">
        Run <code className="text-luxury-gold bg-black/30 px-1 py-0.5 rounded text-xs">node scripts/parseSeoFiles.mjs</code> to
        generate <code className="text-luxury-gold bg-black/30 px-1 py-0.5 rounded text-xs">scripts/output/parsedSuppliers.json</code>.
      </p>
      <p className="text-gray-500 text-xs mb-6">
        Then copy the <strong className="text-gray-400">venues</strong> array (or the full JSON file) and paste below.
      </p>

      <textarea
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
        placeholder='[{ "name": "Soho Garden", "categories": ["nightlife"], "venue_ids": [] }, ...]'
        rows={14}
        className="w-full bg-black/30 border border-white/10 rounded-sm p-4 text-gray-300 text-xs font-mono placeholder-gray-600 focus:outline-none focus:border-luxury-gold/50 resize-y"
      />

      {parseError && (
        <div className="flex items-center gap-2 mt-3 text-red-400 text-xs">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {parseError}
        </div>
      )}

      <div className="flex gap-3 mt-4">
        <button
          onClick={handleParse}
          disabled={!raw.trim()}
          className="flex items-center gap-2 px-5 py-3 bg-luxury-gold text-black font-bold text-xs uppercase tracking-widest hover:bg-white transition-colors disabled:opacity-40"
        >
          <Eye className="w-4 h-4" /> Preview
        </button>
      </div>
    </div>
  );
}

// â”€â”€ Main page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export default function AdminSuppliers() {
  const [activeTab, setActiveTab] = useState<'list' | 'import'>('list');
  const { suppliers, deleteSupplier } = useSuppliers();
  const { search, setSearch, status: filterStatus, setStatus: setFilterStatus, filtered } = useAdminFilters(suppliers, {
    statusAccessor: (item) => item.status,
    searchAccessor: (item) => `${item.name} ${item.contact_person ?? ''} ${item.email ?? ''}`,
  });

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this supplier?')) return;
    deleteSupplier.mutate(id);
  };

  return (
    <div>
      <AdminPageHeader
        title="Suppliers"
        actions={
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab(activeTab === 'import' ? 'list' : 'import')}
              className={`flex items-center gap-2 px-4 py-3 border text-xs uppercase tracking-widest font-bold transition-colors ${
                activeTab === 'import'
                  ? 'border-luxury-gold text-luxury-gold'
                  : 'border-white/10 text-gray-400 hover:text-white hover:border-white/30'
              }`}
            >
              <Upload className="w-4 h-4" /> Bulk Import
            </button>
            <Link
              href="/admin/suppliers/new"
              className="flex items-center gap-2 px-5 py-3 bg-luxury-gold text-black font-bold text-xs uppercase tracking-widest hover:bg-white transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Supplier
            </Link>
          </div>
        }
      />

      {/* Tab content */}
      <AnimatePresence mode="wait">
        {activeTab === 'import' ? (
          <motion.div
            key="import"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <BulkImportTab />
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {/* Filters */}
            <div className="flex gap-4 mb-8">
              <AdminSearchInput
                value={search}
                onChange={setSearch}
                placeholder="Search suppliers..."
              />
              <AdminSelectFilter
                value={filterStatus}
                onChange={setFilterStatus}
                options={[
                  { value: 'all', label: 'All Status' },
                  { value: 'active', label: 'Active' },
                  { value: 'inactive', label: 'Inactive' },
                  { value: 'pending', label: 'Pending' },
                ]}
              />
            </div>

            {/* Supplier Table */}
            <div className="border border-white/5 rounded-sm overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.02]">
                    <th className="text-left p-4 text-xs font-bold uppercase tracking-wider text-gray-500">Name</th>
                    <th className="text-left p-4 text-xs font-bold uppercase tracking-wider text-gray-500">Contact</th>
                    <th className="text-left p-4 text-xs font-bold uppercase tracking-wider text-gray-500">Categories</th>
                    <th className="text-left p-4 text-xs font-bold uppercase tracking-wider text-gray-500">Commission</th>
                    <th className="text-left p-4 text-xs font-bold uppercase tracking-wider text-gray-500">Status</th>
                    <th className="text-right p-4 text-xs font-bold uppercase tracking-wider text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((supplier) => (
                    <motion.tr
                      key={supplier.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="p-4">
                        <span className="text-white font-medium">{supplier.name}</span>
                      </td>
                      <td className="p-4 text-gray-400 text-sm">
                        <div>{supplier.contact_person || 'â€”'}</div>
                        <div className="text-gray-500 text-xs">{supplier.email || supplier.phone || ''}</div>
                      </td>
                      <td className="p-4 text-gray-400 text-sm">
                        {supplier.categories.length > 0
                          ? supplier.categories.slice(0, 3).join(', ')
                          : 'â€”'}
                      </td>
                      <td className="p-4 text-luxury-gold text-sm">
                        {supplier.commission_rate}%
                      </td>
                      <td className="p-4">
                        <span className={`text-xs font-bold uppercase tracking-wider ${
                          supplier.status === 'active' ? 'text-green-400' :
                          supplier.status === 'pending' ? 'text-yellow-400' : 'text-gray-500'
                        }`}>
                          {supplier.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/admin/suppliers/${supplier.id}`}
                            className="p-2 text-gray-500 hover:text-luxury-gold transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(supplier.id)}
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
              {filtered.length === 0 && <AdminEmptyState message="No suppliers found." />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

