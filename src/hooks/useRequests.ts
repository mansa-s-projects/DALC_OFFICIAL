import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Request, RequestStatus } from '../types';
import { supabase } from '../lib/supabase';
import { transitionRequestStatus } from '../platform/requests/lifecycle';

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

export interface RequestDetailResult {
  request: Request | null;
  statusLog: Array<{
    id: string;
    request_id: string;
    old_status?: string;
    new_status: string;
    changed_by?: string;
    notes?: string;
    created_at: string;
  }>;
}

export function useRequests(userId?: string) {
  const queryClient = useQueryClient();

  const listQuery = useQuery({
    queryKey: ['requests', userId ?? 'all'],
    enabled: Boolean(userId),
    queryFn: async () => {
      let query = supabase
        .from('requests')
        .select('id, user_id, venue_id, venue_name, category, request_type, date_time, party_size, status, priority_score, assigned_to, contact_name, contact_info, notes, internal_notes, supplier_response, confirmed_at, completed_at, created_at, updated_at, service_id, category_id, subcategory_id, booking_id, intent_id, priority')
        .order('created_at', { ascending: false });
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
      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          user_id: userId,
        }),
      });

      const body = await response.json();

      if (!response.ok || !body?.success || !body?.request) {
        throw new Error(body?.error ?? 'Failed to create request');
      }

      return body.request as Request;
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
      const { data, error } = await supabase
        .from('requests')
        .update(updates)
        .eq('id', id)
        .select('id, user_id, venue_id, venue_name, category, request_type, date_time, party_size, status, priority_score, assigned_to, contact_name, contact_info, notes, internal_notes, supplier_response, confirmed_at, completed_at, created_at, updated_at, service_id, category_id, subcategory_id, booking_id, intent_id, priority')
        .single();
      if (error) throw error;
      return data as Request;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('requests').delete().eq('id', id).select('id');
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

export function useRequestDetail(requestId?: string, userId?: string) {
  return useQuery({
    queryKey: ['requests', 'detail', requestId, userId ?? 'anonymous'],
    enabled: Boolean(requestId),
    queryFn: async (): Promise<RequestDetailResult> => {
      if (!requestId) {
        return { request: null, statusLog: [] };
      }

      let requestQuery = supabase
        .from('requests')
        .select('id, user_id, venue_id, venue_name, category, request_type, date_time, party_size, status, priority_score, assigned_to, contact_name, contact_info, notes, internal_notes, supplier_response, confirmed_at, completed_at, created_at, updated_at, service_id, category_id, subcategory_id, booking_id, intent_id, priority')
        .eq('id', requestId);

      if (userId) {
        requestQuery = requestQuery.eq('user_id', userId);
      }

      const [{ data: requestData, error: requestError }, { data: logData, error: logError }] = await Promise.all([
        requestQuery.single(),
        supabase
          .from('request_status_log')
          .select('id, request_id, old_status, new_status, changed_by, notes, created_at')
          .eq('request_id', requestId)
          .order('created_at', { ascending: true }),
      ]);

      if (requestError) throw requestError;
      if (logError) throw logError;

      return {
        request: (requestData ?? null) as Request | null,
        statusLog: (logData ?? []) as RequestDetailResult['statusLog'],
      };
    },
  });
}

// Admin: fetch all requests
export function useAllRequests(enabled = true) {
  return useQuery({
    queryKey: ['requests', 'admin-all'],
    enabled: enabled,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('requests')
        .select('id, user_id, venue_id, venue_name, category, request_type, date_time, party_size, status, priority_score, assigned_to, contact_name, contact_info, notes, internal_notes, supplier_response, confirmed_at, completed_at, created_at, updated_at, service_id, category_id, subcategory_id, booking_id, intent_id, priority')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data ?? []) as Request[];
    },
  });
}

export interface UpdateRequestStatusInput {
  id: string;
  status: RequestStatus;
  fromStatus: RequestStatus;
  notes?: string;
  changedBy?: string;
}

// Admin: update request status with lifecycle validation + log entry
export function useUpdateRequestStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status, fromStatus, notes, changedBy }: UpdateRequestStatusInput) => {
      const { request } = await transitionRequestStatus({
        requestId: id,
        fromStatus,
        toStatus: status,
        changedBy,
        notes,
      });
      return request;
    },
    onSuccess: (_data: Request, variables: UpdateRequestStatusInput) => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      queryClient.invalidateQueries({ queryKey: ['requests', 'detail', variables.id] });
    },
  });
}
