<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { usePropertyStore } from '@/stores/property.store';
import type { Property } from '@/interfaces/property.interface';
import VButton from '@/components/common/VButton.vue';
import VDataTable from '@/components/common/VDataTable.vue';
import VDropdown from '@/components/common/VDropdown.vue';
import VInput from '@/components/common/VInput.vue';

const propertyStore = usePropertyStore();

const headers = [
    { text: 'ID', value: 'propertyId' },
    { text: 'Name', value: 'propertyName' },
    { text: 'Type', value: 'type' },
    { text: 'Status', value: 'activeStatus' },
    { text: 'Total Rooms', value: 'totalRoom' },
    { text: 'Action', value: 'action' },
];

const searchTerm = ref('');
const selectedType = ref('All Types');
const selectedStatus = ref('All Status');

const typeOptions = ['All Types', 'Hotel', 'Villa', 'Apartment'];
const statusOptions = ['All Status', 'Active', 'Non-Active'];

const getPropertyType = (type: number): string => {
    if (type === 1) return 'Hotel';
    if (type === 2) return 'Villa';
    if (type === 3) return 'Apartment';
    return 'Unknown';
};

const filteredProperties = computed(() => {
    return propertyStore.properties.filter((property: Property) => {
        const typeAsString = getPropertyType(property.type);
        const statusAsString = property.activeStatus === 1 ? 'Active' : 'Non-Active';

        const matchesSearch = property.propertyName.toLowerCase().includes(searchTerm.value.toLowerCase());
        const matchesType = selectedType.value === 'All Types' || typeAsString === selectedType.value;
        const matchesStatus = selectedStatus.value === 'All Status' || statusAsString === selectedStatus.value;
        
        return matchesSearch && matchesType && matchesStatus;
    });
});

onMounted(() => {
    propertyStore.fetchProperties();
});
</script>

<template>
  <main class="min-h-screen bg-blue-50/30 pt-28 pb-10 px-4 sm:px-6 lg:px-8">
    <div class="container mx-auto bg-white/90 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-200">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div class="flex items-center gap-4 flex-wrap">
          <VButton>Add Property</VButton>
          <VDropdown :button-text="selectedType">
            <a v-for="type in typeOptions" :key="type" @click.prevent="selectedType = type" href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">{{ type }}</a>
          </VDropdown>
           <VDropdown :button-text="selectedStatus">
            <a v-for="status in statusOptions" :key="status" @click.prevent="selectedStatus = status" href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">{{ status }}</a>
          </VDropdown>
        </div>
        <div class="w-full md:w-auto md:max-w-xs">
            <VInput v-model="searchTerm" placeholder="Search properties..." />
        </div>
      </div>

      <div v-if="propertyStore.loading" class="text-center py-10 text-gray-500">Loading Properties...</div>
      <div v-else-if="propertyStore.error" class="text-center py-10 text-red-500">{{ propertyStore.error }}</div>
      <VDataTable v-else :headers="headers" :items="filteredProperties">
        <template #item.type="{ item }">
            <span>{{ getPropertyType(item.type) }}</span>
        </template>
        
        <template #item.activeStatus="{ item }">
            <span :class="[
                item.activeStatus === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800',
                'px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full'
            ]">
                {{ item.activeStatus === 1 ? 'Active' : 'Non-Active' }}
            </span>
        </template>

        <template #item.action>
            <VButton class="py-1.5 px-4 text-sm">Detail</VButton>
        </template>
      </VDataTable>
    </div>
  </main>
</template>