<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePropertyStore } from '@/stores/property.store';
import VButton from '@/components/common/VButton.vue';
import VConfirmationModal from '@/components/common/VConfirmationModal.vue';

const route = useRoute();
const router = useRouter();
const propertyStore = usePropertyStore();

const checkInDate = ref('');
const checkOutDate = ref('');

const property = computed(() => propertyStore.currentProperty);

const getPropertyType = (type: number): string => {
    if (type === 1) return 'Hotel';
    if (type === 2) return 'Villa';
    if (type === 3) return 'Apartment';
    return 'Unknown';
};

const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

const formatCurrency = (value?: number) => {
    if (value === undefined) return 'N/A';
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
}

onMounted(() => {
    const propertyId = route.params.id as string;
    if (propertyId) {
        propertyStore.fetchPropertyDetail(propertyId);
    }
});

const showDeleteModal = ref(false);

const handleDelete = () => {
    if (property.value) {
        propertyStore.deleteProperty(property.value.propertyId);
    }
    showDeleteModal.value = false;
};

</script>

<template>
  <main class="min-h-screen bg-blue-50/30 pt-28 pb-10 px-4 sm:px-6 lg:px-8">
    <div class="container mx-auto">
      <div v-if="propertyStore.loadingDetail" class="text-center py-20 text-gray-500">Loading Property Details...</div>
      <div v-else-if="propertyStore.error" class="text-center py-20 text-red-500">{{ propertyStore.error }}</div>
      
      <div v-else-if="property" class="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-200 space-y-8">
        <div>
          <div class="flex justify-between items-start">
            <h1 class="text-2xl font-bold text-gray-800">
              Property Details {{ property.propertyId }}
            </h1>
            <div v-if="property.activeStatus === 1" class="flex gap-2 flex-shrink-0">
                <RouterLink :to="`/properties/updateroom/${property.propertyId}`">
                    <VButton class="bg-green-600 hover:bg-green-700">Add Room</VButton>
                </RouterLink>
                <RouterLink :to="`/properties/update/${property.propertyId}`">
                    <VButton class="text-sm py-2 px-4 bg-yellow-500 hover:bg-yellow-600">Update Property</VButton>
                </RouterLink>
                <VButton @click="showDeleteModal = true" class="bg-red-600 hover:bg-red-700">Delete Property</VButton>
            </div>
          </div>
          <span v-if="property.activeStatus === 1" class="mt-1 inline-block bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Active</span>
          <span v-else class="mt-1 inline-block bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Non-Active</span>
        </div>

        <div class="border-t border-gray-200 pt-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                <div>
                    <p class="text-2xl font-bold">{{ property.propertyName }}</p>
                    <div class="mt-4 space-y-3 text-sm">
                        <div><p class="text-xs text-gray-500">Income</p><p class="font-semibold">{{ formatCurrency(property.income) }}</p></div>
                        <div><p class="text-xs text-gray-500">Type</p><p class="font-semibold">{{ getPropertyType(property.type) }}</p></div>
                        <div><p class="text-xs text-gray-500">Province</p><p class="font-semibold">DKI Jakarta</p></div>
                    </div>
                </div>
                <div>
                    <div class="space-y-3 text-sm">
                        <div><p class="text-xs text-gray-500">Total Room</p><p class="font-semibold">{{ property.totalRoom }}</p></div>
                        <div><p class="text-xs text-gray-500">Address</p><p class="font-semibold">{{ property.address }}</p></div>
                        <div><p class="text-xs text-gray-500">Owner Name</p><p class="font-semibold">{{ property.ownerName }}</p></div>
                        <div><p class="text-xs text-gray-500">Owner ID</p><p class="font-semibold">{{ property.ownerId }}</p></div>
                    </div>
                </div>
                 <div>
                    <p class="text-xs text-gray-500">Created Date</p>
                    <p class="font-semibold text-sm">{{ formatDate(property.createdDate) }}</p>
                </div>
                 <div>
                    <p class="text-xs text-gray-500">Updated Date</p>
                    <p class="font-semibold text-sm">{{ formatDate(property.updatedDate) }}</p>
                </div>
            </div>
        </div>

        <div class="border-t border-gray-200 pt-6 flex items-end gap-4">
            <div>
                <label class="block text-xs font-medium text-gray-500">Check In</label>
                <input type="date" v-model="checkInDate" class="mt-1 w-full border-gray-300 rounded-md p-2 shadow-sm text-sm">
            </div>
            <div>
                <label class="block text-xs font-medium text-gray-500">Check Out</label>
                <input type="date" v-model="checkOutDate" class="mt-1 w-full border-gray-300 rounded-md p-2 shadow-sm text-sm">
            </div>
            <VButton class="text-sm py-2 px-4">Apply Filter</VButton>
        </div>

        <div class="border-t border-gray-200 pt-6">
            <h2 class="text-xl font-semibold mb-4 text-gray-800">Room Types</h2>
            <div class="space-y-6">
                <div v-for="roomType in property.listRoomType" :key="roomType.roomTypeId" class="bg-blue-50/60 p-4 rounded-lg">
                    <div>
                        <h3 class="text-lg font-bold">{{ roomType.name }}</h3>
                        <p class="text-sm text-gray-600">{{ roomType.description }}</p>
                        <p class="font-semibold text-blue-600">{{ formatCurrency(roomType.price) }}</p>
                    </div>
                    <table class="min-w-full mt-3">
                        <thead class="text-xs text-gray-500 uppercase">
                            <tr>
                                <th class="py-2 px-3 text-left">Room</th>
                                <th class="py-2 px-3 text-left">Status</th>
                                <th class="py-2 px-3 text-left">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="room in roomType.listRoom" :key="room.roomId" class="border-t border-blue-200/50">
                                <td class="py-2 px-3 font-mono text-sm">{{ room.name }}</td>
                                <td class="py-2 px-3 text-sm">
                                    <span :class="room.availabilityStatus === 1 ? 'text-green-600' : 'text-red-600 font-semibold'">
                                        {{ room.availabilityStatus === 1 ? 'Available' : 'Not available' }}
                                    </span>
                                </td>
                                <td class="py-2 px-3 flex gap-2">
                                    <VButton class="text-xs py-1.5 px-4" :disabled="room.availabilityStatus !== 1">Book</VButton>
                                    <VButton class="text-xs py-1.5 px-4 bg-yellow-500 hover:bg-yellow-600" :disabled="room.availabilityStatus !== 1">Maintenance</VButton>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div class="text-left pt-6 border-t border-gray-200">
             <VButton @click="router.back()" class="bg-gray-600 hover:bg-gray-700 text-sm py-2 px-4">Back</VButton>
        </div>
      </div>
    </div>
    <VConfirmationModal 
      :show="showDeleteModal" 
      title="Delete Property?" 
      message="This action cannot be undone."
      @confirm="handleDelete" 
      @cancel="showDeleteModal = false" 
    />
  </main>
</template>