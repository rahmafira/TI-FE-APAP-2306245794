import type { ScheduleMaintenancePayload } from '@/interfaces/booking.interface';
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://2306245794-be.hafizmuh.site',
  headers: { 'Content-Type': 'application/json' },
});

export const RoomService = {
  scheduleMaintenance: async (payload: ScheduleMaintenancePayload): Promise<void> => {
    await apiClient.post('/api/rooms/maintenance/add', payload);
  },
};