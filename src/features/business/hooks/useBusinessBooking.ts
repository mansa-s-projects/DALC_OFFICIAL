import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createBusinessBooking, getUserBusinessBookings } from '../../../lib/business';
import type { BusinessBookingInput } from '../types';

export function useCreateBusinessBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: BusinessBookingInput) => createBusinessBooking(input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['business-bookings', data.user_id] });
    },
  });
}

export function useUserBusinessBookings(userId: string | undefined) {
  return useQuery({
    queryKey: ['business-bookings', userId],
    enabled: Boolean(userId),
    queryFn: () => getUserBusinessBookings(userId!),
  });
}
