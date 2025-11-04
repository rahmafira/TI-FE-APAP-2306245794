import { defineStore } from 'pinia';
import { PropertyService } from '@/services/property.service';
import type { Property, PropertyDetail } from '@/interfaces/property.interface';
import type { CreatePropertyPayload } from '@/interfaces/property.interface';
import { toast } from 'vue-sonner';
import { isAxiosError } from 'axios';

interface PropertyState {
  properties: Property[];
  currentProperty: PropertyDetail | null; 
  loading: boolean;
  loadingDetail: boolean; 
  error: string | null;
}

export const usePropertyStore = defineStore('property', {
  state: (): PropertyState => ({
    properties: [],
    currentProperty: null,
    loading: false,
    loadingDetail: false,
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
    async fetchPropertyDetail(id: string) {
      this.loadingDetail = true;
      this.error = null;
      this.currentProperty = null;
      try {
        this.currentProperty = await PropertyService.getPropertyDetail(id);
      } catch (e: unknown) {
        if (isAxiosError(e)) {
          this.error = e.response?.data?.message || 'Failed to fetch property detail.';
        } else {
          this.error = 'An unexpected error occurred.';
        }
        if (this.error) toast.error(this.error);
      } finally {
        this.loadingDetail = false;
      }
    },
    async createProperty(payload: CreatePropertyPayload) {
      const router = (await import('@/router')).default;
      this.loading = true;
      this.error = null;
      try {
        await PropertyService.createProperty(payload);
        toast.success("Property created successfully!");
        await router.push('/properties');
        this.fetchProperties();
      } catch (e: unknown) {
        if (isAxiosError(e)) {
          this.error = e.response?.data?.message || 'Failed to create property.';
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