import type { Beranda } from '@/interfaces/beranda.interface';
import type { CommonResponseInterface } from '@/interfaces/common.response.interface';
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://2306245794-be.hafizmuh.site',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const BerandaService = {
  getBerandaStats: async (): Promise<Beranda> => {
    const response = await apiClient.get<CommonResponseInterface<Beranda>>('/');
    return response.data.data;
  },
};