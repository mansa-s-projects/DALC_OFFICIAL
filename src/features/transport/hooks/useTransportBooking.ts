import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createTransportBooking, getUserTransportBookings } from '../../../lib/transport';
import type { TransportBookingInput } from '../types';

export function useCreateTransportBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: TransportBookingInput) => createTransportBooking(input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['transport-bookings', data.user_id] });
    },
  });
}

export function useUserTransportBookings(userId: string | undefined) {
  return useQuery({
    queryKey: ['transport-bookings', userId],
    enabled: Boolean(userId),
    queryFn: () => getUserTransportBookings(userId!),
  });
}
