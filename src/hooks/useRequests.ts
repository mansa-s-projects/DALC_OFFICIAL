import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Request, RequestStatus } from '../types';
import { supabase, isMockMode } from '../lib/supabase';
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
    onSuccess: async (created: Request) => {
      // Write the initial status log entry so the timeline has a starting point
      if (!isMockMode && supabase) {
        await supabase.from('request_status_log').insert({
          request_id: created.id,
          old_status: null,
          new_status: 'submitted',
          changed_by: userId ?? null,
          notes: null,
        });
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

export function useRequestDetail(requestId?: string, userId?: string, initialRequest?: Request | null) {
  return useQuery({
    queryKey: ['requests', 'detail', requestId, userId ?? 'anonymous'],
    enabled: Boolean(requestId),
    queryFn: async (): Promise<RequestDetailResult> => {
      if (!requestId) {
        return { request: null, statusLog: [] };
      }

      if (isMockMode) {
        const mockRequest = initialRequest ?? null;
        const mockLog = mockRequest?.created_at
          ? [{
              id: `mock-log-${mockRequest.id}`,
              request_id: mockRequest.id,
              new_status: mockRequest.status,
              created_at: mockRequest.created_at,
              notes: mockRequest.notes,
            }]
          : [];

        return {
          request: mockRequest,
          statusLog: mockLog,
        };
      }

      let requestQuery = supabase!
        .from('requests')
        .select('*')
        .eq('id', requestId);

      if (userId) {
        requestQuery = requestQuery.eq('user_id', userId);
      }

      const [{ data: requestData, error: requestError }, { data: logData, error: logError }] = await Promise.all([
        requestQuery.single(),
        supabase!
          .from('request_status_log')
          .select('*')
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
      if (isMockMode) return { id, status } as Request;

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
