import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppStore } from '../../../store/useAppStore';
import {
  submitConciergeRequest,
  getMyConciergeRequests,
  updateConciergeStatus,
} from '../api';
import type { ConciergeRequestInput, ConciergeStatus } from '../types';

// ─── My Requests ─────────────────────────────────────────────────────────────

export function useMyConciergeRequests() {
  const profile = useAppStore((s) => s.profile);

  return useQuery({
    queryKey: ['concierge-requests', profile?.id],
    queryFn: () => getMyConciergeRequests(profile!.id),
    enabled: !!profile?.id,
    staleTime: 2 * 60 * 1000,
  });
}

// ─── Submit Request ───────────────────────────────────────────────────────────

export function useSubmitConciergeRequest() {
  const queryClient = useQueryClient();
  const profile = useAppStore((s) => s.profile);

  return useMutation({
    mutationFn: (input: ConciergeRequestInput) => {
      if (!profile?.id) throw new Error('Must be logged in to submit a request');
      return submitConciergeRequest(profile.id, input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['concierge-requests'] });
    },
  });
}

// ─── Update Status (Admin/Concierge team) ────────────────────────────────────

export function useUpdateConciergeStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      requestId,
      status,
      notes,
    }: {
      requestId: string;
      status: ConciergeStatus;
      notes?: string;
    }) => updateConciergeStatus(requestId, status, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['concierge-requests'] });
    },
  });
}
