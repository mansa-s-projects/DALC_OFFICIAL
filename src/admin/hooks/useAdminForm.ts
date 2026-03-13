import { useState } from 'react';

export function useAdminForm<T extends Record<string, unknown>>(initialValue: T) {
  const [form, setForm] = useState<T>(initialValue);

  const update = <K extends keyof T>(field: K, value: T[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const patch = (updates: Partial<T>) => {
    setForm((prev) => ({ ...prev, ...updates }));
  };

  const reset = () => setForm(initialValue);

  return {
    form,
    setForm,
    update,
    patch,
    reset,
  };
}
