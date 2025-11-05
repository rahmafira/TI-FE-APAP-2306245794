import { defineStore } from 'pinia';
import { PropertyService, type AddRoomTypesPayload } from '@/services/property.service';
import { RoomService } from '@/services/room.service';
import type { ScheduleMaintenancePayload } from '@/interfaces/property.interface';
import type { 
    Property, 
    PropertyDetail, 
    CreatePropertyPayload, 
    UpdatePropertyPayload, 
    PropertyHeader 
} from '@/interfaces/property.interface';
import { toast } from 'vue-sonner';
import { isAxiosError } from 'axios';

interface PropertyState {
  properties: Property[];
  currentProperty: PropertyDetail | null;
  currentPropertyHeader: PropertyHeader | null;
  loading: boolean;
  loadingDetail: boolean;
  error: string | null;
}

export const usePropertyStore = defineStore('property', {
  state: (): PropertyState => ({
    properties: [],
    currentProperty: null,
    currentPropertyHeader: null, 
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
        if (isAxiosError(e)) { this.error = e.response?.data?.message || 'Failed to fetch properties.'; } 
        else if (e instanceof Error) { this.error = e.message; }
        else { this.error = 'An unexpected error occurred.'; }
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
        if (isAxiosError(e)) { this.error = e.response?.data?.message || 'Failed to fetch property detail.'; }
        else { this.error = 'An unexpected error occurred.'; }
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
        if (isAxiosError(e)) { this.error = e.response?.data?.message || 'Failed to create property.'; }
        else { this.error = 'An unexpected error occurred.'; }
        if (this.error) toast.error(this.error);
      } finally {
        this.loading = false;
      }
    },
    async updateProperty(payload: UpdatePropertyPayload) {
      const router = (await import('@/router')).default;
      this.loading = true;
      this.error = null;
      try {
        await PropertyService.updateProperty(payload);
        toast.success("Property updated successfully!");
        router.push(`/properties/${payload.propertyId}`);
      } catch (e: unknown) {
        if (isAxiosError(e)) { this.error = e.response?.data?.message || 'Failed to update property.'; }
        else { this.error = 'An unexpected error occurred.'; }
        if (this.error) toast.error(this.error);
      } finally {
        this.loading = false;
      }
    },
    async deleteProperty(id: string) {
      this.error = null;
      try {
        await PropertyService.deleteProperty(id);
        toast.success("Property has been deactivated.");
        await this.fetchPropertyDetail(id);
      } catch (e: unknown) {
        if (isAxiosError(e)) { this.error = e.response?.data?.message || 'Failed to deactivate property.'; }
        else { this.error = 'An unexpected error occurred.'; }
        if (this.error) toast.error(this.error);
      }
    },
    async fetchPropertyHeader(id: string) {
      this.loadingDetail = true;
      this.currentPropertyHeader = null;
      this.error = null;
      try {
        this.currentPropertyHeader = await PropertyService.getPropertyHeader(id);
      } catch (e: unknown) { 
        if (isAxiosError(e)) {
          this.error = e.response?.data?.message || 'Failed to fetch property header.';
        } else {
          this.error = 'An unexpected error occurred.';
        }
        if (this.error) toast.error(this.error);
      } finally {
        this.loadingDetail = false;
      }
    },
    async addRoomTypes(payload: AddRoomTypesPayload) {
      const router = (await import('@/router')).default; 
      this.loading = true;
      this.error = null;
      try {
        await PropertyService.addRoomTypes(payload);
        toast.success("Room types added successfully!");
        router.push(`/properties/${payload.propertyId}`); 
      } catch (e: unknown) { 
        if (isAxiosError(e)) {
          this.error = e.response?.data?.message || 'Failed to add room types.';
        } else {
          this.error = 'An unexpected error occurred.';
        }
        if (this.error) toast.error(this.error);
      } finally {
        this.loading = false;
      }
    },
    async scheduleMaintenance(payload: ScheduleMaintenancePayload) {
      this.loading = true;
      this.error = null;
      try {
        await RoomService.scheduleMaintenance(payload);
        toast.success("Maintenance schedule added successfully!");
        if (this.currentProperty) {
            await this.fetchPropertyDetail(this.currentProperty.propertyId);
        }
      } catch (e: unknown) { 
        if (isAxiosError(e)) {
          this.error = e.response?.data?.message || 'Failed to add maintenance schedule.';
        } else {
          this.error = 'An unexpected error occurred while scheduling maintenance.';
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