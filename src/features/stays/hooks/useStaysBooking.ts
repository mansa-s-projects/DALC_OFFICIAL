import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createStaysBooking,
  getAvailability,
  calculatePrice,
  getUserBookings,
} from '../../../lib/stays';
import type { StaysBookingInput } from '../types';

interface AvailabilityParams {
  propertyId: string;
  startDate: string;
  endDate: string;
}

interface PriceParams {
  propertyId: string;
  checkIn: string;
  checkOut: string;
}

export function useCreateStaysBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: StaysBookingInput) => createStaysBooking(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stays-bookings'] });
    },
  });
}

export function usePropertyAvailability(
  propertyId: string | undefined,
  startDate: string | undefined,
  endDate: string | undefined
) {
  return useQuery({
    queryKey: ['stays-availability', propertyId, startDate, endDate],
    enabled: Boolean(propertyId && startDate && endDate),
    queryFn: () =>
      getAvailability(propertyId!, startDate!, endDate!),
  });
}

export function usePriceCalculation(
  propertyId: string | undefined,
  checkIn: string | undefined,
  checkOut: string | undefined
) {
  return useQuery({
    queryKey: ['stays-price', propertyId, checkIn, checkOut],
    enabled: Boolean(propertyId && checkIn && checkOut),
    queryFn: () =>
      calculatePrice(propertyId!, checkIn!, checkOut!),
  });
}

export function useUserStaysBookings(userId: string | undefined) {
  return useQuery({
    queryKey: ['stays-bookings', userId],
    enabled: Boolean(userId),
    queryFn: () => getUserBookings(userId!),
  });
}
