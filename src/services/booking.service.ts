import type { Booking } from '@/interfaces/booking.interface';
import type { CommonResponseInterface } from '@/interfaces/common.response.interface';
import type { BookingDetail } from '@/interfaces/booking.interface';
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const BookingService = {
  getAllBookings: async (): Promise<Booking[]> => {
    const response = await apiClient.get<CommonResponseInterface<Booking[]>>('/api/bookings');
    return response.data.data;
  },
  getBookingDetail: async (id: string): Promise<BookingDetail> => {
        const response = await apiClient.get<CommonResponseInterface<BookingDetail>>(`/api/bookings/${id}`);
        return response.data.data;
  },
};