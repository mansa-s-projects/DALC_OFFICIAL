export type SupplierStatus = 'active' | 'inactive' | 'pending';

export interface SupplierFormValues {
  name: string;
  contact_person: string;
  email: string;
  phone: string;
  whatsapp: string;
  categories: string;
  commission_rate: number;
  notes: string;
  status: SupplierStatus;
  venue_ids: string;
}

export function parseCommaSeparated(value: string): string[] {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

export function normalizeSupplierForm(values: SupplierFormValues) {
  return {
    name: values.name.trim(),
    contact_person: values.contact_person.trim() || undefined,
    email: values.email.trim() || undefined,
    phone: values.phone.trim() || undefined,
    whatsapp: values.whatsapp.trim() || undefined,
    categories: parseCommaSeparated(values.categories),
    commission_rate: Number(values.commission_rate) || 0,
    notes: values.notes.trim() || undefined,
    status: values.status,
    venue_ids: parseCommaSeparated(values.venue_ids),
  };
}

export function validateSupplierForm(values: SupplierFormValues): string | null {
  if (!values.name.trim()) return 'Company name is required.';
  if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    return 'Please enter a valid email address.';
  }
  if (Number(values.commission_rate) < 0 || Number(values.commission_rate) > 100) {
    return 'Commission rate must be between 0 and 100.';
  }
  return null;
}
