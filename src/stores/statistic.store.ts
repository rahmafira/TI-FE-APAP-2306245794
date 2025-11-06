import { defineStore } from 'pinia';
import { BookingService } from '@/services/booking.service';
import type { ChartData } from '@/interfaces/booking.interface';
import { toast } from 'vue-sonner';
import { isAxiosError } from 'axios';

interface StatisticState {
  chartData: ChartData[];
  loading: boolean;
  error: string | null;
}

export const useStatisticStore = defineStore('statistic', {
  state: (): StatisticState => ({
    chartData: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchChartData(month: number, year: number) {
      this.loading = true;
      this.error = null;
      this.chartData = []; // Kosongkan data sebelumnya
      try {
        this.chartData = await BookingService.getChartData(month, year);
      } catch (e: unknown) {
        if (isAxiosError(e)) { this.error = e.response?.data?.message || 'Failed to fetch chart data.'; } 
        else { this.error = 'An unexpected error occurred.'; }
        if (this.error) toast.error(this.error);
      } finally {
        this.loading = false;
      }
    },
  },
});