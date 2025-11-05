import { defineStore } from 'pinia';
import { BookingService } from '@/services/booking.service';
import type { Booking } from '@/interfaces/booking.interface';
import { toast } from 'vue-sonner';
import { isAxiosError } from 'axios';

interface BookingState {
  bookings: Booking[];
  loading: boolean;
  error: string | null;
}

export const useBookingStore = defineStore('booking', {
  state: (): BookingState => ({
    bookings: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchBookings() {
      this.loading = true;
      this.error = null;
      try {
        this.bookings = await BookingService.getAllBookings();
      } catch (e: unknown) { 
        if (isAxiosError(e)) {
          this.error = e.response?.data?.message || 'Failed to fetch bookings.';
        } else {
          this.error = 'An unexpected error occurred.';
        }
        if (this.error) toast.error(this.error);
      } finally {
        this.loading = false;
      }
    },
  },
});