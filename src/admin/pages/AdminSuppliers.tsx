import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useSuppliers } from '../../hooks/useSuppliers';
import { AdminEmptyState, AdminPageHeader, AdminSearchInput, AdminSelectFilter } from '../components';
import { useAdminFilters } from '../hooks';

export default function AdminSuppliers() {
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
          <Link
            to="/admin/suppliers/new"
            className="flex items-center gap-2 px-5 py-3 bg-luxury-gold text-black font-bold text-xs uppercase tracking-widest hover:bg-white transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Supplier
          </Link>
        }
      />

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
                  <div>{supplier.contact_person || '—'}</div>
                  <div className="text-gray-500 text-xs">{supplier.email || supplier.phone || ''}</div>
                </td>
                <td className="p-4 text-gray-400 text-sm">
                  {supplier.categories.length > 0
                    ? supplier.categories.slice(0, 3).join(', ')
                    : '—'}
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
                      to={`/admin/suppliers/${supplier.id}`}
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
    </div>
  );
}
