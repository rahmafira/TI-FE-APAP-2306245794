<script setup lang="ts">
import { ref, reactive, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useBookingStore } from '@/stores/booking.store';
import VButton from '@/components/common/VButton.vue';
import type { CreateBookingPayload } from '@/interfaces/booking.interface';

const props = defineProps<{ idRoom?: string }>();
const route = useRoute();
const router = useRouter();
const bookingStore = useBookingStore();

const isWithRoom = computed(() => !!props.idRoom);

const form = reactive<CreateBookingPayload>({
    roomId: props.idRoom || '',
    checkInDate: (route.query.checkIn as string) || '',
    checkOutDate: (route.query.checkOut as string) || '',
    customerId: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    isBreakfast: false,
    capacity: 0,
});

const selectedPropertyId = ref<string | null>(null);
const selectedRoomTypeId = ref<string | null>(null);

const roomTypesForSelectedProperty = computed(() => {
    const prop = bookingStore.selectionData?.properties.find(p => p.id === selectedPropertyId.value);
    return prop ? prop.roomTypes : [];
});

const roomsForSelectedRoomType = computed(() => {
    const rt = roomTypesForSelectedProperty.value.find(rt => rt.id === selectedRoomTypeId.value);
    return rt ? rt.rooms : [];
});

const selectedRoomCapacity = computed(() => {
    if (isWithRoom.value) {
        return 99;
    }
    const room = roomsForSelectedRoomType.value.find(r => r.id === form.roomId);
    return room ? room.capacity : 1;
});

watch(selectedPropertyId, () => { selectedRoomTypeId.value = null; form.roomId = ''; });
watch(selectedRoomTypeId, () => { form.roomId = ''; });
watch(() => form.roomId, (newRoomId) => { if (newRoomId && !isWithRoom.value) form.capacity = selectedRoomCapacity.value; });

const handleSubmit = async () => {
    await bookingStore.createBooking(form);
};

onMounted(() => {
    if (isWithRoom.value) {
        bookingStore.fetchPrefilledData(props.idRoom!);
    } else {
        bookingStore.fetchSelectionData();
    }
});

const formInputClass = "w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-blue-500 focus:border-blue-500 text-sm";
const formLabelClass = "block text-sm font-medium text-gray-500 mb-1";
const disabledInputClass = "bg-blue-100 border-blue-200 cursor-not-allowed text-gray-700";
</script>

<template>
  <main class="min-h-screen bg-blue-50 pt-28 pb-10 px-4 flex items-center justify-center">
    <div class="container mx-auto bg-white p-8 rounded-2xl shadow-xl border border-gray-100 max-w-3xl">
      <h1 class="text-2xl font-bold text-blue-700 mb-8">Add New Booking</h1>
      
      <div v-if="isWithRoom" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
            <div>
                <label :class="formLabelClass">Room ID</label>
                <input :value="bookingStore.prefilledData?.roomId" disabled :class="[formInputClass, disabledInputClass]">
            </div>
            <div>
                <label :class="formLabelClass">Room Name</label>
                <input :value="bookingStore.prefilledData?.roomName" disabled :class="[formInputClass, disabledInputClass]">
            </div>
            <div>
                <label :class="formLabelClass">Check-in Date</label>
                <input v-model="form.checkInDate" type="date" :class="formInputClass">
            </div>
            <div>
                <label :class="formLabelClass">Check-out Date</label>
                <input v-model="form.checkOutDate" type="date" :class="formInputClass">
            </div>
            <div>
                <label :class="formLabelClass">Customer ID</label>
                <input v-model="form.customerId" type="text" :class="formInputClass" placeholder="">
            </div>
            <div>
                <label :class="formLabelClass">Customer Name</label>
                <input v-model="form.customerName" type="text" :class="formInputClass">
            </div>
            <div>
                <label :class="formLabelClass">Customer Email</label>
                <input v-model="form.customerEmail" type="email" :class="formInputClass">
            </div>
            <div>
                <label :class="formLabelClass">Customer Phone</label>
                <input v-model="form.customerPhone" type="text" :class="formInputClass">
            </div>
            <div>
                <label :class="formLabelClass">Capacity</label>
                <input v-model.number="form.capacity" type="number" min="0" :class="formInputClass">
            </div>
            <div>
                <label :class="formLabelClass">Breakfast (+Rp 50.000)</label>
                <select v-model="form.isBreakfast" :class="formInputClass">
                    <option :value="false">No</option>
                    <option :value="true">Yes</option>
                </select>
            </div>
        </div>
      </div>
      
      <div v-else class="space-y-4">
        <div><label :class="formLabelClass">Property Name</label><select v-model="selectedPropertyId" :class="formInputClass"><option :value="null" disabled>Select Property</option><option v-for="p in bookingStore.selectionData?.properties" :key="p.id" :value="p.id">{{p.name}}</option></select></div>
        <div><label :class="formLabelClass">Room Type</label><select v-model="selectedRoomTypeId" :disabled="!selectedPropertyId" :class="formInputClass"><option :value="null" disabled>Select Room Type</option><option v-for="rt in roomTypesForSelectedProperty" :key="rt.id" :value="rt.id">{{rt.name}}</option></select></div>
        <div><label :class="formLabelClass">Room Name</label><select v-model="form.roomId" :disabled="!selectedRoomTypeId" :class="formInputClass"><option value="" disabled>Select Room</option><option v-for="r in roomsForSelectedRoomType" :key="r.id" :value="r.id">{{r.name}}</option></select></div>
        <div class="grid grid-cols-2 gap-x-6 gap-y-5 pt-4 border-t">
            <div><label :class="formLabelClass">Check-in Date</label><input v-model="form.checkInDate" type="date" :class="formInputClass"></div>
            <div><label :class="formLabelClass">Check-out Date</label><input v-model="form.checkOutDate" type="date" :class="formInputClass"></div>
            <div><label :class="formLabelClass">Customer ID</label><input v-model="form.customerId" type="text" :class="formInputClass" placeholder=""></div>
            <div><label :class="formLabelClass">Customer Name</label><input v-model="form.customerName" type="text" :class="formInputClass"></div>
            <div><label :class="formLabelClass">Customer Email</label><input v-model="form.customerEmail" type="email" :class="formInputClass"></div>
            <div><label :class="formLabelClass">Customer Phone</label><input v-model="form.customerPhone" type="text" :class="formInputClass"></div>
            <div><label :class="formLabelClass">Capacity</label><input v-model.number="form.capacity" type="number" :max="selectedRoomCapacity" min="1" :class="formInputClass"></div>
            <div><label :class="formLabelClass">Breakfast (+Rp 50.000)</label><select v-model="form.isBreakfast" :class="formInputClass"><option :value="true">Yes</option><option :value="false">No</option></select></div>
        </div>
      </div>
      
      <div class="mt-8 pt-6 border-t border-gray-200 flex justify-between">
          <VButton @click="router.back()" class="bg-gray-600 hover:bg-gray-700 rounded-md text-sm">Back</VButton>
          <VButton @click="handleSubmit" type="button" class="rounded-md text-sm">Save</VButton>
      </div>
    </div>
  </main>
</template>