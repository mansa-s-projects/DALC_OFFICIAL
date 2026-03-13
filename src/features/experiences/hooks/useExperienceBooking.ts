import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createExperienceBooking,
  checkCapacity,
  getAvailableSlots,
  getUserExperienceBookings,
} from '../../../lib/experiences';
import type { ExperienceBookingInput } from '../types';

export function useCreateExperienceBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ExperienceBookingInput) => createExperienceBooking(input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['experience-bookings', data.user_id] });
      queryClient.invalidateQueries({ queryKey: ['experience-capacity'] });
    },
  });
}

export function useCheckCapacity(serviceId: string | undefined, date: Date, timeSlot?: string) {
  return useQuery({
    queryKey: ['experience-capacity', serviceId, date.toISOString().split('T')[0], timeSlot],
    enabled: Boolean(serviceId),
    queryFn: () => checkCapacity(serviceId!, date, timeSlot),
  });
}

export function useAvailableSlots(serviceId: string | undefined, date: Date) {
  return useQuery({
    queryKey: ['experience-slots', serviceId, date.toISOString().split('T')[0]],
    enabled: Boolean(serviceId),
    queryFn: () => getAvailableSlots(serviceId!, date),
  });
}

export function useUserExperienceBookings(userId: string | undefined) {
  return useQuery({
    queryKey: ['experience-bookings', userId],
    enabled: Boolean(userId),
    queryFn: () => getUserExperienceBookings(userId!),
  });
}
