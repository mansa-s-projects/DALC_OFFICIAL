import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getRelocationProfile,
  createRelocationProfile,
  updateRelocationProfile,
  getUserWorkflows,
  getWorkflowSteps,
  updateWorkflowStep,
} from '../../../lib/relocation';
import type {
  CreateRelocationProfileInput,
  UpdateRelocationProfileInput,
  UserWorkflowStep,
} from '../types';

// ─── Profile Hooks ────────────────────────────────────────────────────────────

export function useRelocationProfile(userId: string | undefined) {
  return useQuery({
    queryKey: ['relocation_profile', userId],
    enabled: Boolean(userId),
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      if (!userId) return null;
      return getRelocationProfile(userId);
    },
  });
}

export function useCreateRelocationProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateRelocationProfileInput) => createRelocationProfile(input),
    onSuccess: (data) => {
      queryClient.setQueryData(['relocation_profile', data.user_id], data);
      queryClient.invalidateQueries({ queryKey: ['relocation_profile', data.user_id] });
      queryClient.invalidateQueries({ queryKey: ['user_workflows', data.user_id] });
    },
  });
}

export function useUpdateRelocationProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UpdateRelocationProfileInput }) =>
      updateRelocationProfile(id, updates),
    onSuccess: (data) => {
      queryClient.setQueryData(['relocation_profile', data.user_id], data);
      queryClient.invalidateQueries({ queryKey: ['relocation_profile', data.user_id] });
    },
  });
}

// ─── Workflow Hooks ───────────────────────────────────────────────────────────

export function useUserWorkflows(userId: string | undefined) {
  return useQuery({
    queryKey: ['user_workflows', userId],
    enabled: Boolean(userId),
    staleTime: 2 * 60 * 1000,
    queryFn: async () => {
      if (!userId) return [];
      return getUserWorkflows(userId);
    },
  });
}

export function useWorkflowSteps(workflowId: string | undefined) {
  return useQuery({
    queryKey: ['workflow_steps', workflowId],
    enabled: Boolean(workflowId),
    staleTime: 2 * 60 * 1000,
    queryFn: async () => {
      if (!workflowId) return [];
      return getWorkflowSteps(workflowId);
    },
  });
}

export function useUpdateWorkflowStep() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      stepId,
      status,
    }: {
      stepId: string;
      status: UserWorkflowStep['status'];
      workflowId: string;
    }) => updateWorkflowStep(stepId, status),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['workflow_steps', variables.workflowId],
      });
      queryClient.invalidateQueries({ queryKey: ['user_workflows'] });
    },
  });
}
