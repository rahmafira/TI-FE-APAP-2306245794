import type { Booking } from '@/interfaces/booking.interface';
import type { CommonResponseInterface } from '@/interfaces/common.response.interface';
import type { BookingDetail } from '@/interfaces/booking.interface';
import type { CreateBookingPayload, PrefilledBookingData, BookingSelectionData } from '@/interfaces/booking.interface';
import type { UpdateBookingPayload, UpdateBookingForm } from '@/interfaces/booking.interface';
import type { ChartData } from '@/interfaces/booking.interface';
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://2306245794-be.hafizmuh.site',
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
    getPrefilledData: async (idRoom: string): Promise<PrefilledBookingData> => {
        const response = await apiClient.get<CommonResponseInterface<PrefilledBookingData>>(`/api/bookings/create/${idRoom}`);
        return response.data.data;
    },
    getSelectionData: async (): Promise<BookingSelectionData> => {
        const response = await apiClient.get<CommonResponseInterface<BookingSelectionData>>(`/api/bookings/create`);
        return response.data.data;
    },
    createBooking: async (payload: CreateBookingPayload): Promise<BookingDetail> => {
        const response = await apiClient.post<CommonResponseInterface<BookingDetail>>('/api/bookings/create', payload);
        return response.data.data;
    },
    getBookingForUpdate: async (id: string): Promise<UpdateBookingForm> => {
        const response = await apiClient.get<CommonResponseInterface<UpdateBookingForm>>(`/api/bookings/update/${id}`);
        return response.data.data;
    },
    updateBooking: async (payload: UpdateBookingPayload): Promise<Booking> => {
        const response = await apiClient.put<CommonResponseInterface<Booking>>('/api/bookings/update', payload);
        return response.data.data;
    },
    confirmPayment: async (bookingId: string): Promise<void> => {
        await apiClient.post('/api/bookings/status/pay', { bookingId });
    },
    cancelBooking: async (bookingId: string): Promise<void> => {
        await apiClient.post('/api/bookings/status/cancel', { bookingId });
    },
    processRefund: async (bookingId: string): Promise<void> => {
        await apiClient.post('/api/bookings/status/refund', { bookingId });
    },
    getChartData: async (month: number, year: number): Promise<ChartData[]> => {
        const response = await apiClient.get<CommonResponseInterface<ChartData[]>>(`/api/bookings/chart?month=${month}&year=${year}`);
        return response.data.data;
    },
};