import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSupplierRegistry } from '../../shared/hooks/useSupplierRegistry';
import SupplierRegistryForm from '../../shared/components/SupplierRegistryForm';
import {
  normalizeSupplierForm,
  validateSupplierForm,
  type SupplierFormValues,
} from '../../shared/utils/supplier';

const EMPTY_FORM: SupplierFormValues = {
  name: '',
  contact_person: '',
  email: '',
  phone: '',
  whatsapp: '',
  categories: '',
  commission_rate: 10,
  notes: '',
  status: 'active' as 'active' | 'inactive' | 'pending',
  venue_ids: '',
};

export default function AdminSupplierForm() {
  const params = useParams();
  const id = params?.id as string | undefined;
  const router = useRouter();
  const isNew = !id || id === 'new';
  const { suppliers, createSupplier, updateSupplier } = useSupplierRegistry();
  const [form, setForm] = useState<SupplierFormValues>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const update = <K extends keyof SupplierFormValues>(field: K, value: SupplierFormValues[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

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
        venue_ids: existing.venue_ids.join(', '),
      });
    }
  }, [id, isNew, suppliers]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateSupplierForm(form);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    setError('');

    const normalized = normalizeSupplierForm(form);
    const payload = {
      name: normalized.name,
      contact_person: normalized.contact_person,
      email: normalized.email,
      phone: normalized.phone,
      whatsapp: normalized.whatsapp,
      categories: normalized.categories,
      commission_rate: normalized.commission_rate,
      notes: normalized.notes,
      status: normalized.status,
    };

    try {
      if (isNew) {
        await createSupplier.mutateAsync({ input: payload, venueIds: normalized.venue_ids });
      } else {
        const previous = suppliers.find((s) => s.id === id);
        await updateSupplier.mutateAsync({
          id: id!,
          updates: payload,
          venueIds: normalized.venue_ids,
          previous,
        });
      }
      router.push('/admin/suppliers');
    } catch (err: any) {
      setError(err.message ?? 'Failed to save supplier.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SupplierRegistryForm
      title={isNew ? 'Add Supplier' : `Edit: ${form.name}`}
      values={form}
      onChange={update}
      onSubmit={handleSubmit}
      onBack={() => router.push('/admin/suppliers')}
      submitLabel={isNew ? 'Create Supplier' : 'Save Changes'}
      saving={saving}
      error={error}
    />
  );
}
