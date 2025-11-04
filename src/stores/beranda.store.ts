import { defineStore } from 'pinia';
import { BerandaService } from '@/services/beranda.service';
import type { Beranda } from '@/interfaces/beranda.interface';
import { toast } from 'vue-sonner';
import { isAxiosError } from 'axios';

interface BerandaState {
  stats: Beranda | null;
  loading: boolean;
  error: string | null;
}

export const useBerandaStore = defineStore('beranda', {
  state: (): BerandaState => ({
    stats: null,
    loading: false,
    error: null,
  }),
  actions: {
    async fetchBerandaStats() {
      this.loading = true;
      this.error = null; 
      
      try {
        this.stats = await BerandaService.getBerandaStats();
      } catch (e: unknown) { 

        if (isAxiosError(e)) {
          this.error = e.response?.data?.message || 'Failed to fetch statistics due to a server error.';
        } else if (e instanceof Error) {
          this.error = e.message;
        } else {
          this.error = 'An unexpected error occurred.';
        }

        if (this.error) {
          toast.error(this.error);
        }

      } finally {
        this.loading = false;
      }
    },
  },
});