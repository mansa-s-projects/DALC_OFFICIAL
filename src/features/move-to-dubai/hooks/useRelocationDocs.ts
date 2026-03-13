import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getUserDocuments,
  uploadDocument,
  updateDocumentStatus,
} from '../../../lib/relocation';
import type { CreateDocumentInput, UserDocument } from '../types';

export function useUserDocuments(userId: string | undefined) {
  return useQuery({
    queryKey: ['user_documents', userId],
    enabled: Boolean(userId),
    staleTime: 2 * 60 * 1000,
    queryFn: async () => {
      if (!userId) return [];
      return getUserDocuments(userId);
    },
  });
}

export function useUploadDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateDocumentInput) => uploadDocument(input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['user_documents', data.user_id] });
    },
  });
}

export function useUpdateDocumentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      docId,
      status,
    }: {
      docId: string;
      status: UserDocument['status'];
      userId: string;
    }) => updateDocumentStatus(docId, status),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['user_documents', variables.userId] });
    },
  });
}
