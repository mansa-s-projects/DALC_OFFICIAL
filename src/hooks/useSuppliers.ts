import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { Supplier } from '../types';

async function fetchSuppliers(): Promise<Supplier[]> {
  const { data, error } = await supabase
    .from('suppliers')
    .select('id, name, contact_person, email, phone, whatsapp, categories, commission_rate, notes, status, created_at, updated_at')
    .order('name');
  if (error) throw error;
  return data ?? [];
}

export function useSuppliers() {
  const qc = useQueryClient();

  const { data: suppliers = [], isLoading } = useQuery({
    queryKey: ['suppliers'],
    queryFn: fetchSuppliers,
    staleTime: 5 * 60 * 1000,
  });

  const createSupplier = useMutation({
    mutationFn: async (input: Omit<Supplier, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('suppliers')
        .insert(input)
        .select('id, name, contact_person, email, phone, whatsapp, categories, commission_rate, notes, status, created_at, updated_at')
        .single();
      if (error) throw error;
      return data as Supplier;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['suppliers'] }),
  });

  const updateSupplier = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Omit<Supplier, 'id' | 'created_at' | 'updated_at'>> }) => {
      const { data, error } = await supabase
        .from('suppliers')
        .update(updates)
        .eq('id', id)
        .select('id, name, contact_person, email, phone, whatsapp, categories, commission_rate, notes, status, created_at, updated_at')
        .single();
      if (error) throw error;
      return data as Supplier;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['suppliers'] }),
  });

  const deleteSupplier = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('suppliers').delete().eq('id', id).select('id');
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['suppliers'] }),
  });

  return {
    suppliers,
    isLoading,
    createSupplier,
    updateSupplier,
    deleteSupplier,
  };
}
