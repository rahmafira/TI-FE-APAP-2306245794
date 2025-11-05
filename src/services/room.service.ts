import type { ScheduleMaintenancePayload } from '@/interfaces/property.interface';
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const RoomService = {
  scheduleMaintenance: async (payload: ScheduleMaintenancePayload): Promise<void> => {
    await apiClient.post('/api/rooms/maintenance/add', payload);
  },
};