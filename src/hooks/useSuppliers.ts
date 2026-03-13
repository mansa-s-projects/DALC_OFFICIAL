import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, isMockMode } from '../lib/supabase';
import type { Supplier } from '../types';

const MOCK_SUPPLIERS: Supplier[] = [];

async function fetchSuppliers(): Promise<Supplier[]> {
  if (isMockMode || !supabase) return MOCK_SUPPLIERS;
  const { data, error } = await supabase.from('suppliers').select('*').order('name');
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
      if (isMockMode || !supabase) return { ...input, id: crypto.randomUUID() } as Supplier;
      const { data, error } = await supabase.from('suppliers').insert(input).select().single();
      if (error) throw error;
      return data as Supplier;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['suppliers'] }),
  });

  const updateSupplier = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Omit<Supplier, 'id' | 'created_at' | 'updated_at'>> }) => {
      if (isMockMode || !supabase) return { id, ...updates } as Supplier;
      const { data, error } = await supabase.from('suppliers').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data as Supplier;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['suppliers'] }),
  });

  const deleteSupplier = useMutation({
    mutationFn: async (id: string) => {
      if (isMockMode || !supabase) return;
      const { error } = await supabase.from('suppliers').delete().eq('id', id);
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
