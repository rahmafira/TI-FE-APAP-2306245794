import { defineStore } from 'pinia';
import { PropertyService } from '@/services/property.service';
import type { Property } from '@/interfaces/property.interface';
import { toast } from 'vue-sonner';
import { isAxiosError } from 'axios';

interface PropertyState {
  properties: Property[];
  loading: boolean;
  error: string | null;
}

export const usePropertyStore = defineStore('property', {
  state: (): PropertyState => ({
    properties: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchProperties() {
      this.loading = true;
      this.error = null;
      try {
        this.properties = await PropertyService.getAllProperties();
      } catch (e: unknown) {
        if (isAxiosError(e)) {
          this.error = e.response?.data?.message || 'Failed to fetch properties.';
        } else if (e instanceof Error) {
          this.error = e.message;
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