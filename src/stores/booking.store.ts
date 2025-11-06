import { defineStore } from 'pinia';
import { BookingService } from '@/services/booking.service';
import type { Booking } from '@/interfaces/booking.interface';
import type { BookingDetail } from '@/interfaces/booking.interface';
import type { CreateBookingPayload, PrefilledBookingData, BookingSelectionData } from '@/interfaces/booking.interface';
import type { UpdateBookingPayload, UpdateBookingForm } from '@/interfaces/booking.interface';
import { toast } from 'vue-sonner';
import { isAxiosError } from 'axios';

interface BookingState {
  bookings: Booking[];
  currentBooking: BookingDetail | null;
  prefilledData: PrefilledBookingData | null;
  selectionData: BookingSelectionData | null;
  updateFormData: UpdateBookingForm | null;
  loading: boolean;
  loadingDetail: boolean;
  error: string | null;
}

export const useBookingStore = defineStore('booking', {
  state: (): BookingState => ({
    bookings: [], 
    currentBooking: null, 
    prefilledData: null, 
    selectionData: null,
    updateFormData: null,
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
    async fetchPrefilledData(idRoom: string) {
      this.loadingDetail = true;
      try {
        this.prefilledData = await BookingService.getPrefilledData(idRoom);
      } catch (e: unknown) {
        if (isAxiosError(e)) toast.error(e.response?.data?.message);
      } finally {
        this.loadingDetail = false;
      }
    },
    async fetchSelectionData() {
      this.loading = true;
      try {
        this.selectionData = await BookingService.getSelectionData();
      } catch (e: unknown) {
        if (isAxiosError(e)) toast.error(e.response?.data?.message);
      } finally {
        this.loading = false;
      }
    },
    async createBooking(payload: CreateBookingPayload) {
      const router = (await import('@/router')).default;
      this.loading = true;
      try {
        await BookingService.createBooking(payload);
        toast.success("Booking created successfully!");
        await router.push('/bookings');
      } catch (e: unknown) {
        const message = isAxiosError(e) ? (e.response?.data?.message || "Failed to create booking.") : "An unexpected error occurred.";
        toast.error(message);
      } finally {
        this.loading = false;
      }
    },
    async fetchBookingForUpdate(id: string) {
      this.loadingDetail = true;
      this.error = null;
      try {
        this.updateFormData = await BookingService.getBookingForUpdate(id);
      } catch (e: unknown) {
        if (isAxiosError(e)) {
            this.error = e.response?.data?.message || 'Failed to fetch data for update.';
        } else {
            this.error = 'An unexpected error occurred.';
        }
        if (this.error) toast.error(this.error);
      } finally {
        this.loadingDetail = false;
      }
    },

    async updateBooking(payload: UpdateBookingPayload) {
      const router = (await import('@/router')).default;
      this.loading = true;
      this.error = null;
      try {
        await BookingService.updateBooking(payload);
        toast.success("Booking updated successfully!");
        router.push(`/bookings/${payload.bookingId}`);
      } catch (e: unknown) {
        if (isAxiosError(e)) {
            this.error = e.response?.data?.message || 'Failed to update booking.';
        } else {
            this.error = 'An unexpected error occurred.';
        }
        if (this.error) toast.error(this.error);
      } finally {
        this.loading = false;
      }
    },
    async confirmPayment(bookingId: string) {
      this.loading = true; // Opsional: tampilkan loading spinner
      this.error = null;
      try {
        await BookingService.confirmPayment(bookingId);
        toast.success("Payment confirmed!");
        await this.fetchBookingDetail(bookingId);
      } catch (e: unknown) {
        if (isAxiosError(e)) {
          this.error = e.response?.data?.message || 'Failed to confirm payment.';
        } else {
          this.error = 'An unexpected error occurred.';
        }
        if (this.error) toast.error(this.error);
      } finally {
        this.loading = false; 
      }
    },

    async cancelBooking(bookingId: string) {
      this.loading = true;
      this.error = null;
      try {
        await BookingService.cancelBooking(bookingId);
        toast.success("Booking cancelled!");
        await this.fetchBookingDetail(bookingId);
      } catch (e: unknown) {
        if (isAxiosError(e)) {
          this.error = e.response?.data?.message || 'Failed to cancel booking.';
        } else {
          this.error = 'An unexpected error occurred.';
        }
        if (this.error) toast.error(this.error);
      } finally {
        this.loading = false;
      }
    },

    async processRefund(bookingId: string) {
      this.loading = true;
      this.error = null;
      try {
        await BookingService.processRefund(bookingId);
        toast.success("Refund processed!");
        await this.fetchBookingDetail(bookingId);
      } catch (e: unknown) {
        if (isAxiosError(e)) {
          this.error = e.response?.data?.message || 'Failed to process refund.';
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