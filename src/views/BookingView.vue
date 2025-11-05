<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useBookingStore } from '@/stores/booking.store';
import VButton from '@/components/common/VButton.vue';
import VDataTable from '@/components/common/VDataTable.vue';
import VDropdown from '@/components/common/VDropdown.vue';
import VInput from '@/components/common/VInput.vue';
import { RouterLink } from 'vue-router'; 

const bookingStore = useBookingStore();

const headers = [
    { text: 'Booking ID', value: 'bookingId' },
    { text: 'Property Name', value: 'propertyName' },
    { text: 'Room Name', value: 'roomName' },
    { text: 'Check-In', value: 'checkIn' },
    { text: 'Check-Out', value: 'checkOut' },
    { text: 'Total Price', value: 'totalPrice' },
    { text: 'Status', value: 'status' },
    { text: 'Action', value: 'action' },
];

const searchTerm = ref('');
const selectedStatus = ref('All Status');

const statusOptions = ['All Status', 'Waiting for Payment', 'Payment Confirmed', 'Cancelled', 'Request Refund', 'Done'];
const statusMap: Record<number, { text: string; color: string }> = {
    0: { text: 'Waiting for Payment', color: 'bg-yellow-100 text-yellow-800' },
    1: { text: 'Payment Confirmed', color: 'bg-blue-100 text-blue-800' },
    2: { text: 'Cancelled', color: 'bg-red-100 text-red-800' },
    3: { text: 'Request Refund', color: 'bg-purple-100 text-purple-800' },
    4: { text: 'Done', color: 'bg-green-100 text-green-800' },
};

const getStatusInfo = (status: number) => {
    return statusMap[status] || { text: 'Unknown', color: 'bg-gray-100 text-gray-800' };
};

const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' });
};

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
};

const filteredBookings = computed(() => {
    if (!bookingStore.bookings || !Array.isArray(bookingStore.bookings)) {
        return [];
    }

    return bookingStore.bookings
        .filter(booking => booking) 
        .filter(booking => {
            const matchesSearch = 
                (booking.propertyName || '').toLowerCase().includes(searchTerm.value.toLowerCase()) ||
                (booking.roomName || '').toLowerCase().includes(searchTerm.value.toLowerCase());
            
            const statusText = getStatusInfo(booking.status).text;
            const matchesStatus = selectedStatus.value === 'All Status' || statusText === selectedStatus.value;
            
            return matchesSearch && matchesStatus;
        });
});

onMounted(() => {
    bookingStore.fetchBookings();
});
</script>

<template>
  <main class="min-h-screen bg-blue-50/30 pt-28 pb-10 px-4 sm:px-6 lg:px-8">
    <div class="container mx-auto bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-200">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div class="flex items-center gap-4 flex-wrap">
          <VButton>Add Booking</VButton>
          <VDropdown :button-text="selectedStatus">
            <a v-for="status in statusOptions" :key="status" @click.prevent="selectedStatus = status" href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">{{ status }}</a>
          </VDropdown>
        </div>
        <div class="w-full md:w-auto md:max-w-xs">
            <VInput v-model="searchTerm" placeholder="Search property/room..." />
        </div>
      </div>

      <div v-if="bookingStore.loading" class="text-center py-10 text-gray-500">Loading Bookings...</div>
      <div v-else-if="bookingStore.error" class="text-center py-10 text-red-500">{{ bookingStore.error }}</div>
      <VDataTable v-else :headers="headers" :items="filteredBookings">
        <template v-slot:item.checkIn="{ item }"><span>{{ formatDate(item.checkIn as string) }}</span></template>
        <template v-slot:item.checkOut="{ item }"><span>{{ formatDate(item.checkOut as string) }}</span></template>
        <template v-slot:item.totalPrice="{ item }"><span>{{ formatCurrency(item.totalPrice as number) }}</span></template>
        <template v-slot:item.status="{ item }">
            <span :class="[getStatusInfo(item.status as number).color, 'px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full']">
                {{ getStatusInfo(item.status as number).text }}
            </span>
        </template>
        <template v-slot:item.action="{ item }">
            <RouterLink :to="`/bookings/${item.bookingId}`">
                <VButton class="py-1.5 px-4 text-sm">Detail</VButton>
            </RouterLink>
        </template>
      </VDataTable>
    </div>
  </main>
</template>