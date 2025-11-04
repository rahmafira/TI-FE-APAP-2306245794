import type { Property } from '@/interfaces/property.interface';
import type { CommonResponseInterface } from '@/interfaces/common.response.interface';
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const PropertyService = {
  getAllProperties: async (): Promise<Property[]> => {
    const response = await apiClient.get<CommonResponseInterface<Property[]>>('/api/properties');
    return response.data.data;
  },
};