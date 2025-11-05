import { defineStore } from 'pinia';
import { BookingService } from '@/services/booking.service';
import type { Booking } from '@/interfaces/booking.interface';
import type { BookingDetail } from '@/interfaces/booking.interface';
import { toast } from 'vue-sonner';
import { isAxiosError } from 'axios';

interface BookingState {
  bookings: Booking[];
  currentBooking: BookingDetail | null; 
  loading: boolean;
  loadingDetail: boolean;
  error: string | null;
}

export const useBookingStore = defineStore('booking', {
  state: (): BookingState => ({
    bookings: [],
    currentBooking: null,
    loading: false,
    loadingDetail: false,
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
    async fetchBookingDetail(id: string) {
      this.loadingDetail = true;
      this.error = null;
      this.currentBooking = null;
      try {
        this.currentBooking = await BookingService.getBookingDetail(id);
      } catch (e: unknown) {
        if (isAxiosError(e)) { this.error = e.response?.data?.message || 'Failed to fetch booking detail.'; }
        else { this.error = 'An unexpected error occurred.'; }
        if (this.error) toast.error(this.error);
      } finally {
        this.loadingDetail = false;
      }
    },
  },
});