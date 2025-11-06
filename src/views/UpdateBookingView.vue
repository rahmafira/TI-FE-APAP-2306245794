<script setup lang="ts">
import { reactive, onMounted, computed, watch, ref, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useBookingStore } from '@/stores/booking.store';
import VButton from '@/components/common/VButton.vue';
import type { UpdateBookingPayload } from '@/interfaces/booking.interface';

const props = defineProps<{ id: string }>();
const router = useRouter();
const bookingStore = useBookingStore();

const form = reactive<Partial<UpdateBookingPayload>>({});
const selectionData = computed(() => bookingStore.updateFormData?.selectionData);

const isLoading = ref(true);
const selectedPropertyId = ref<string | null>(null);
const selectedRoomTypeId = ref<string | null>(null);

const roomTypesForSelectedProperty = computed(() => {
    const prop = selectionData.value?.properties.find(p => p.id === selectedPropertyId.value);
    return prop ? prop.roomTypes : [];
});
const roomsForSelectedRoomType = computed(() => {
    const rt = roomTypesForSelectedProperty.value.find(rt => rt.id === selectedRoomTypeId.value);
    return rt ? rt.rooms : [];
});
const selectedRoomCapacity = computed(() => {
    const room = roomsForSelectedRoomType.value.find(r => r.id === form.roomId);
    return room ? room.capacity : 1;
});

watch(() => bookingStore.updateFormData, (data) => {
    if (data) {
        const booking = data.currentBooking;

        let foundPropertyId: string | null = null;
        let foundRoomTypeId: string | null = null;

        for (const prop of data.selectionData.properties) {
            for (const rt of prop.roomTypes) {
                if (rt.rooms.some(r => r.id === booking.roomId)) {
                    foundRoomTypeId = rt.id;
                    foundPropertyId = prop.id;
                    break;
                }
            }
            if (foundPropertyId) break;
        }

        selectedPropertyId.value = foundPropertyId;

        nextTick(() => {
            selectedRoomTypeId.value = foundRoomTypeId;
            
            nextTick(() => {
                Object.assign(form, {
                    bookingId: booking.bookingId,
                    roomId: booking.roomId,
                    checkInDate: booking.checkInDate.split('T')[0],
                    checkOutDate: booking.checkOutDate.split('T')[0],
                    customerId: booking.customerId,
                    customerName: booking.customerName,
                    customerEmail: booking.customerEmail,
                    customerPhone: booking.customerPhone,
                    isBreakfast: booking.isBreakfast,
                    capacity: booking.capacity,
                });
                isLoading.value = false;
            });
        });
    }
}, { deep: true, immediate: true });

watch(selectedPropertyId, (newVal, oldVal) => { 
    if (!isLoading.value && newVal !== oldVal) { 
        selectedRoomTypeId.value = null; 
        form.roomId = ''; 
    }
});
watch(selectedRoomTypeId, (newVal, oldVal) => { 
    if (!isLoading.value && newVal !== oldVal) { 
        form.roomId = ''; 
    }
});
watch(() => form.roomId, () => { if (form.roomId) form.capacity = selectedRoomCapacity.value; });

const handleSubmit = async () => {
    await bookingStore.updateBooking(form as UpdateBookingPayload);
};

onMounted(() => {
    bookingStore.fetchBookingForUpdate(props.id);
});

const formInputClass = "w-full p-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
const formLabelClass = "block text-sm font-medium text-gray-500 mb-1";
</script>

<template>
  <main class="min-h-screen bg-blue-50 pt-28 pb-10 px-4 flex items-center justify-center">
    <div class="container mx-auto bg-white p-8 rounded-2xl shadow-xl max-w-3xl">
      <h1 class="text-2xl font-bold text-blue-700 mb-8">Update Booking</h1>
      <div v-if="bookingStore.loadingDetail">Loading form...</div>
      <div v-else class="space-y-4">
        <div class="grid grid-cols-2 gap-x-6 gap-y-5">
            <div><label :class="formLabelClass">Property</label><select v-model="selectedPropertyId" :class="formInputClass"><option v-for="p in selectionData?.properties" :key="p.id" :value="p.id">{{p.name}}</option></select></div>
            <div><label :class="formLabelClass">Room Type</label><select v-model="selectedRoomTypeId" :disabled="!selectedPropertyId" :class="formInputClass"><option v-for="rt in roomTypesForSelectedProperty" :key="rt.id" :value="rt.id">{{rt.name}}</option></select></div>
            <div><label :class="formLabelClass">Room Name</label><select v-model="form.roomId" :disabled="!selectedRoomTypeId" :class="formInputClass"><option v-for="r in roomsForSelectedRoomType" :key="r.id" :value="r.id">{{r.name}}</option></select></div>
            <div><label :class="formLabelClass">Capacity</label><input v-model.number="form.capacity" type="number" :max="selectedRoomCapacity" min="1" :class="formInputClass"></div>
            <div><label :class="formLabelClass">Check-in Date</label><input v-model="form.checkInDate" type="date" :class="formInputClass"></div>
            <div><label :class="formLabelClass">Check-out Date</label><input v-model="form.checkOutDate" type="date" :class="formInputClass"></div>
        </div>
        <div class="grid grid-cols-2 gap-x-6 gap-y-5 pt-4 border-t">
            <div><label :class="formLabelClass">Customer ID</label><input v-model="form.customerId" type="text" :class="formInputClass"></div>
            <div><label :class="formLabelClass">Customer Name</label><input v-model="form.customerName" type="text" :class="formInputClass"></div>
            <div><label :class="formLabelClass">Customer Email</label><input v-model="form.customerEmail" type="email" :class="formInputClass"></div>
            <div><label :class="formLabelClass">Customer Phone</label><input v-model="form.customerPhone" type="text" :class="formInputClass"></div>
            <div><label :class="formLabelClass">Breakfast (+Rp 50.000)</label><select v-model="form.isBreakfast" :class="formInputClass"><option :value="true">Yes</option><option :value="false">No</option></select></div>
        </div>
      </div>
      <div class="mt-8 pt-6 border-t flex justify-between">
          <VButton @click="router.back()" class="bg-gray-600 hover:bg-gray-700 rounded-md text-sm">Back</VButton>
          <VButton @click="handleSubmit" type="button" class="rounded-md text-sm">Save</VButton>
      </div>
    </div>
  </main>
</template>