<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useBookingStore } from '@/stores/booking.store';
import VButton from '@/components/common/VButton.vue';

const route = useRoute();
const router = useRouter();
const bookingStore = useBookingStore();

const booking = computed(() => bookingStore.currentBooking);

const statusMap: Record<number, { text: string; color: string }> = {
    0: { text: 'Waiting for Payment', color: 'bg-yellow-100 text-yellow-800' },
    1: { text: 'Payment Confirmed', color: 'bg-blue-100 text-blue-800' },
    2: { text: 'Cancelled', color: 'bg-red-100 text-red-800' },
    3: { text: 'Request Refund', color: 'bg-purple-100 text-purple-800' },
    4: { text: 'Done', color: 'bg-green-100 text-green-800' },
};
const getStatusInfo = (status: number) => statusMap[status] || { text: 'Unknown', color: 'bg-gray-100 text-gray-800' };

const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true,
    }).replace(',', '');
};
const formatCurrency = (value?: number) => {
    if (value === undefined || value === null) return 'N/A';
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 2 }).format(value);
};

const canPay = computed(() => booking.value?.status === 0 || (booking.value?.extraPay ?? 0) > 0);
const canUpdate = computed(() => (booking.value?.status === 0 && (booking.value?.extraPay ?? 0) === 0) || booking.value?.status === 1);
const canRefund = computed(() => booking.value?.status === 3);
const canCancel = computed(() => [0, 1, 3].includes(booking.value?.status ?? -1));

onMounted(() => {
    const bookingId = route.params.id as string;
    bookingStore.fetchBookingDetail(bookingId);
});
</script>

<template>
  <main class="min-h-screen bg-blue-50/30 pt-28 pb-10 px-4">
    <div class="container mx-auto">
      <div v-if="bookingStore.loadingDetail" class="text-center">Loading booking details...</div>
      <div v-else-if="bookingStore.error" class="text-center text-red-500">{{ bookingStore.error }}</div>
      <div v-else-if="booking" class="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
        <div class="flex justify-between items-start border-b border-gray-200 pb-4">
            <div>
                <h1 class="text-xl font-bold text-gray-800">Booking Details {{ booking.bookingId }}</h1>
                <span :class="[getStatusInfo(booking.status).color, 'mt-2 px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full']">
                    {{ getStatusInfo(booking.status).text }}
                </span>
            </div>
            <div class="flex gap-2">
                <VButton v-if="canPay" class="bg-green-600 hover:bg-green-700">Pay</VButton>
                <VButton v-if="canUpdate" class="bg-yellow-500 hover:bg-yellow-600">Update</VButton>
                <VButton v-if="canRefund" class="bg-blue-600 hover:bg-blue-700">Refund</VButton>
                <VButton v-if="canCancel" class="bg-red-600 hover:bg-red-700">Cancel</VButton>
            </div>
        </div>
        <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 text-sm">
            <div class="space-y-4">
                <div><p class="text-xs text-gray-500">Property Name</p><p class="font-semibold">{{ booking.propertyName }}</p></div>
                <div><p class="text-xs text-gray-500">Customer ID</p><p class="font-semibold">{{ booking.customerId }}</p></div>
                <div><p class="text-xs text-gray-500">Customer Email</p><p class="font-semibold">{{ booking.customerEmail }}</p></div>
                <div><p class="text-xs text-gray-500">Check-In</p><p class="font-semibold">{{ formatDate(booking.checkInDate) }}</p></div>
                <div><p class="text-xs text-gray-500">Total Days</p><p class="font-semibold">{{ booking.totalDays }}</p></div>
                <div><p class="text-xs text-gray-500">Breakfast</p><p class="font-semibold">{{ booking.isBreakfast ? 'Included' : 'Not Included' }}</p></div>
                <div v-if="booking.refund > 0 || booking.status === 3">
                    <p class="text-xs text-gray-500">Refund</p>
                    <p class="font-semibold text-green-600">{{ formatCurrency(booking.refund) }}</p>
                </div>
                <div><p class="text-xs text-gray-500">Updated Date</p><p class="font-semibold">{{ formatDate(booking.updatedAt) }}</p></div>
            </div>
            <div class="space-y-4">
                <div><p class="text-xs text-gray-500">Room Name</p><p class="font-semibold">{{ booking.roomName }}</p></div>
                <div><p class="text-xs text-gray-500">Customer Name</p><p class="font-semibold">{{ booking.customerName }}</p></div>
                <div><p class="text-xs text-gray-500">Customer Phone</p><p class="font-semibold">{{ booking.customerPhone }}</p></div>
                <div><p class="text-xs text-gray-500">Check-Out</p><p class="font-semibold">{{ formatDate(booking.checkOutDate) }}</p></div>
                <div><p class="text-xs text-gray-500">Total Days</p><p class="font-semibold">{{ booking.totalDays }}</p></div>
                <div>
                    <p class="text-xs text-gray-500">Total Price</p>
                    <p class="font-semibold text-blue-600">{{ formatCurrency(booking.totalPrice) }}</p>
                </div>
                <div v-if="booking.extraPay > 0">
                    <p class="text-xs text-gray-500">Extra Payment</p>
                    <p class="font-semibold text-red-600">{{ formatCurrency(booking.extraPay) }}</p>
                </div>
                <div><p class="text-xs text-gray-500">Created Date</p><p class="font-semibold">{{ formatDate(booking.createdDate) }}</p></div>
            </div>
        </div>
        <div class="mt-8 pt-6 border-t border-gray-200">
             <VButton @click="router.back()" class="bg-gray-600 hover:bg-gray-700">Back</VButton>
        </div>
      </div>
    </div>
  </main>
</template>