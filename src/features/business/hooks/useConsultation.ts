import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  scheduleConsultation,
  getUserConsultations,
  getAvailableSlots,
} from '../../../lib/business';
import type { ConsultationInput } from '../types';

export function useScheduleConsultation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ConsultationInput) => scheduleConsultation(input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['consultations', data.user_id] });
    },
  });
}

export function useUserConsultations(userId: string | undefined) {
  return useQuery({
    queryKey: ['consultations', userId],
    enabled: Boolean(userId),
    queryFn: () => getUserConsultations(userId!),
  });
}

export function useAvailableSlots(serviceId: string | undefined, date: string | undefined) {
  return useQuery({
    queryKey: ['available-slots', serviceId, date],
    enabled: Boolean(serviceId) && Boolean(date),
    queryFn: () => getAvailableSlots(serviceId!, date!),
  });
}
