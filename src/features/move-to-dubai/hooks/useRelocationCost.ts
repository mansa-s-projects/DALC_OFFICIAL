import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getCostEstimates, addCostEstimate } from '../../../lib/relocation';
import type { AddCostEstimateInput, CostSummary, CostCategory } from '../types';

export function useCostEstimates(profileId: string | undefined) {
  return useQuery({
    queryKey: ['cost_estimates', profileId],
    enabled: Boolean(profileId),
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      if (!profileId) return [];
      return getCostEstimates(profileId);
    },
  });
}

export function useAddCostEstimate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: AddCostEstimateInput) => addCostEstimate(input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['cost_estimates', data.relocation_profile_id],
      });
    },
  });
}

export function useCostSummary(profileId: string | undefined): {
  summary: CostSummary | null;
  isLoading: boolean;
  error: Error | null;
} {
  const { data: estimates = [], isLoading, error } = useCostEstimates(profileId);

  if (isLoading || !estimates.length) {
    return { summary: null, isLoading, error: error as Error | null };
  }

  // Group by category
  const categoryMap = new Map<string, CostCategory>();

  for (const item of estimates) {
    const existing = categoryMap.get(item.category);
    if (existing) {
      existing.items.push(item);
      existing.totalMin += item.estimated_min ?? 0;
      existing.totalMax += item.estimated_max ?? 0;
      if (item.is_recurring) existing.hasRecurring = true;
    } else {
      categoryMap.set(item.category, {
        category: item.category,
        items: [item],
        totalMin: item.estimated_min ?? 0,
        totalMax: item.estimated_max ?? 0,
        hasRecurring: item.is_recurring,
      });
    }
  }

  const categories = Array.from(categoryMap.values()).sort((a, b) =>
    a.category.localeCompare(b.category)
  );

  const oneTimeItems = estimates.filter((e) => !e.is_recurring);
  const recurringItems = estimates.filter((e) => e.is_recurring);

  const summary: CostSummary = {
    categories,
    grandTotalMin: estimates.reduce((sum, e) => sum + (e.estimated_min ?? 0), 0),
    grandTotalMax: estimates.reduce((sum, e) => sum + (e.estimated_max ?? 0), 0),
    oneTimeMin: oneTimeItems.reduce((sum, e) => sum + (e.estimated_min ?? 0), 0),
    oneTimeMax: oneTimeItems.reduce((sum, e) => sum + (e.estimated_max ?? 0), 0),
    recurringMin: recurringItems.reduce((sum, e) => sum + (e.estimated_min ?? 0), 0),
    recurringMax: recurringItems.reduce((sum, e) => sum + (e.estimated_max ?? 0), 0),
    currency: estimates[0]?.currency ?? 'AED',
  };

  return { summary, isLoading: false, error: null };
}
