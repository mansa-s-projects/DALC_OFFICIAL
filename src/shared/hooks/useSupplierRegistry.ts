import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  bulkUpsertSuppliers,
  createSupplierWithVenues,
  fetchSuppliersWithVenues,
  type BulkImportResult,
  type BulkImportRow,
  type SupplierUpsertInput,
  type SupplierWithVenues,
  updateSupplierWithVenues,
} from '../../platform/requests/suppliers';
import { notifySupplierLifecycleEvent } from '../../platform/notifications/supplierNotifications';

export function useSupplierRegistry() {
  const qc = useQueryClient();

  const suppliersQuery = useQuery({
    queryKey: ['supplier-registry'],
    queryFn: fetchSuppliersWithVenues,
    staleTime: 5 * 60 * 1000,
  });

  const createSupplier = useMutation({
    mutationFn: async ({ input, venueIds }: { input: SupplierUpsertInput; venueIds: string[] }) => {
      const result = await createSupplierWithVenues(input, venueIds);
      await notifySupplierLifecycleEvent({
        supplierName: result.name,
        supplierId: result.id,
        event: result.status === 'active' ? 'activated' : 'created',
      });
      return result;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['supplier-registry'] });
      qc.invalidateQueries({ queryKey: ['suppliers'] });
      qc.invalidateQueries({ queryKey: ['admin', 'venues'] });
    },
  });

  const updateSupplier = useMutation({
    mutationFn: async ({
      id,
      updates,
      venueIds,
      previous,
    }: {
      id: string;
      updates: Partial<SupplierUpsertInput>;
      venueIds: string[];
      previous?: SupplierWithVenues;
    }) => {
      const result = await updateSupplierWithVenues(id, updates, venueIds);
      const becameActive = previous?.status !== 'active' && result.status === 'active';
      await notifySupplierLifecycleEvent({
        supplierName: result.name,
        supplierId: result.id,
        event: becameActive ? 'activated' : 'updated',
      });
      return result;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['supplier-registry'] });
      qc.invalidateQueries({ queryKey: ['suppliers'] });
      qc.invalidateQueries({ queryKey: ['admin', 'venues'] });
    },
  });

  const bulkImport = useMutation<BulkImportResult, Error, BulkImportRow[]>({
    mutationFn: (rows) => bulkUpsertSuppliers(rows),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['supplier-registry'] });
      qc.invalidateQueries({ queryKey: ['suppliers'] });
      qc.invalidateQueries({ queryKey: ['admin', 'venues'] });
    },
  });

  return {
    suppliers: suppliersQuery.data ?? [],
    suppliersQuery,
    createSupplier,
    updateSupplier,
    bulkImport,
  };
}
