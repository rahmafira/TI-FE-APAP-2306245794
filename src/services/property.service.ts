import type { CommonResponseInterface } from '@/interfaces/common.response.interface';
import type { Property, PropertyDetail } from '@/interfaces/property.interface';
import type { CreatePropertyPayload } from '@/interfaces/property.interface';

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
  getPropertyDetail: async (id: string): Promise<PropertyDetail> => {
    const response = await apiClient.get<CommonResponseInterface<PropertyDetail>>(`/api/properties/${id}`);
    return response.data.data;
  },
  createProperty: async (payload: CreatePropertyPayload): Promise<Property> => {
    const response = await apiClient.post<CommonResponseInterface<Property>>('/api/properties', payload);
    return response.data.data;
  },
};