import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Request, RequestStatus } from '../types';
import { supabase, isMockMode } from '../lib/supabase';

export interface CreateRequestInput {
  venue_id?: string;
  venue_name?: string;
  category: Request['category'];
  request_type?: Request['request_type'];
  date_time: string;
  party_size: number;
  contact_name?: string;
  contact_info?: string;
  notes?: string;
}

interface MutationContext {
  previous?: Request[];
  cacheKey: (string | undefined)[];
}

export function useRequests(userId?: string) {
  const queryClient = useQueryClient();

  const listQuery = useQuery({
    queryKey: ['requests', userId ?? 'all'],
    enabled: Boolean(userId),
    queryFn: async () => {
      if (isMockMode) return [] as Request[];

      let query = supabase!.from('requests').select('*').order('created_at', { ascending: false });
      if (userId) {
        query = query.eq('user_id', userId);
      }
      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []) as Request[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (payload: CreateRequestInput) => {
      if (isMockMode) {
        return {
          id: `mock-${Date.now()}`,
          ...payload,
          request_type: payload.request_type ?? 'booking',
          status: 'submitted' as const,
          priority_score: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as Request;
      }

      const { data, error } = await supabase!
        .from('requests')
        .insert({
          ...payload,
          request_type: payload.request_type ?? 'booking',
          user_id: userId,
          status: 'submitted',
          priority_score: 0,
        })
        .select('*')
        .single();

      if (error) throw error;
      return data as Request;
    },
    onMutate: async (payload: CreateRequestInput): Promise<MutationContext> => {
      const cacheKey = ['requests', userId ?? 'all'];
      await queryClient.cancelQueries({ queryKey: cacheKey });
      const previous = queryClient.getQueryData<Request[]>(cacheKey);
      const optimistic: Request = {
        id: `optimistic-${Date.now()}`,
        user_id: userId,
        venue_id: payload.venue_id,
        venue_name: payload.venue_name,
        category: payload.category,
        request_type: payload.request_type ?? 'booking',
        date_time: payload.date_time,
        party_size: payload.party_size,
        contact_name: payload.contact_name,
        contact_info: payload.contact_info,
        status: 'submitted',
        priority_score: 0,
        notes: payload.notes,
      };
      queryClient.setQueryData<Request[]>(cacheKey, (old = []) => [optimistic, ...old]);
      return { previous, cacheKey };
    },
    onError: (_error: unknown, _payload: CreateRequestInput, context: MutationContext | undefined) => {
      if (context?.previous) {
        queryClient.setQueryData(context.cacheKey, context.previous);
      }
    },
    onSettled: (_data: Request | undefined, _error: unknown, _payload: CreateRequestInput, context: MutationContext | undefined) => {
      if (context?.cacheKey) {
        queryClient.invalidateQueries({ queryKey: context.cacheKey });
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Request> }) => {
      if (isMockMode) return { id, ...updates } as Request;

      const { data, error } = await supabase!.from('requests').update(updates).eq('id', id).select('*').single();
      if (error) throw error;
      return data as Request;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (id: string) => {
      if (isMockMode) return id;

      const { error } = await supabase!.from('requests').delete().eq('id', id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
    },
  });

  return {
    requests: listQuery.data ?? [],
    requestsQuery: listQuery,
    createRequest: createMutation,
    updateRequest: updateMutation,
    deleteRequest: removeMutation,
  };
}

// Admin: fetch all requests
export function useAllRequests(enabled = true) {
  return useQuery({
    queryKey: ['requests', 'admin-all'],
    enabled: enabled && !isMockMode,
    queryFn: async () => {
      const { data, error } = await supabase!
        .from('requests')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data ?? []) as Request[];
    },
  });
}

// Admin: update request status
export function useUpdateRequestStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: RequestStatus }) => {
      if (isMockMode) return { id, status } as Request;

      const updates: Record<string, unknown> = { status };
      if (status === 'confirmed') updates.confirmed_at = new Date().toISOString();
      if (status === 'completed') updates.completed_at = new Date().toISOString();

      const { data, error } = await supabase!
        .from('requests')
        .update(updates)
        .eq('id', id)
        .select('*')
        .single();
      if (error) throw error;
      return data as Request;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
    },
  });
}
