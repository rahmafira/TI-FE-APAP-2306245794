<script setup lang="ts">
import { ref, reactive, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePropertyStore } from '@/stores/property.store';
import VButton from '@/components/common/VButton.vue';
import VFormField from '@/components/common/VFormField.vue';
import type { CreateRoomTypePayload } from '@/interfaces/property.interface';

const route = useRoute();
const router = useRouter();
const propertyStore = usePropertyStore();

const roomTypeOptions = ref<string[]>([]);
const newRoomTypes = reactive<CreateRoomTypePayload[]>([]);

const propertyHeader = computed(() => propertyStore.currentPropertyHeader);

const roomNames: Record<number, string[]> = {
    1: ['Single Room', 'Double Room', 'Deluxe Room', 'Superior Room', 'Suite', 'Family Room', 'Penthouse'],
    2: ['Luxury', 'Beachfront', 'Mountside', 'Eco-friendly', 'Romantic'],
    3: ['Studio', '1BR', '2BR', '3BR']
};

watch(() => propertyHeader.value, (header) => {
    if (header) {
        roomTypeOptions.value = roomNames[header.type] || [];
    }
}, { immediate: true });

const addRoomTypeForm = () => {
    newRoomTypes.push({ name: '', facility: '', capacity: 0, price: 0, floor: 0, numberOfUnits: 0, description: '' });
};

const removeRoomTypeForm = (index: number) => {
    newRoomTypes.splice(index, 1);
};

const handleSubmit = async () => {
    if (newRoomTypes.length === 0) {
        alert("Please add at least one room type.");
        return;
    }
    const propertyId = route.params.id as string;
    await propertyStore.addRoomTypes({ propertyId, newRoomTypes });
};

onMounted(() => {
    const propertyId = route.params.id as string;
    propertyStore.fetchPropertyHeader(propertyId);
    if (newRoomTypes.length === 0) {
        addRoomTypeForm();
    }
});

const formInputClass = "w-full p-2 border border-gray-300 rounded-md shadow-sm bg-white focus:ring-blue-500 focus:border-blue-500 text-sm";
</script>

<template>
  <main class="min-h-screen bg-blue-50/30 pt-28 pb-10 px-4">
    <div class="container mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
        <div v-if="propertyStore.loadingDetail">Loading...</div>
        <div v-else-if="propertyHeader">
            <h1 class="text-xl font-bold text-blue-800 mb-6">Add Rooms for Property #{{ propertyHeader.propertyId }}</h1>

            <div class="space-y-6">
                <div v-for="(roomType, index) in newRoomTypes" :key="index" class="bg-blue-50/40 p-4 rounded-lg border border-blue-200/50 relative">
                    <button @click="removeRoomTypeForm(index)" class="absolute top-3 right-3 text-red-500 hover:text-red-700 font-medium text-xs">Remove</button>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                        <VFormField label="Name"><select v-model="roomType.name" :class="formInputClass"><option value="" disabled>Select Room Type</option><option v-for="opt in roomTypeOptions" :key="opt" :value="opt">{{ opt }}</option></select></VFormField>
                        <VFormField label="Facility"><input v-model="roomType.facility" type="text" :class="formInputClass"></VFormField>
                        <VFormField label="Capacity"><input v-model.number="roomType.capacity" type="number" min="0" :class="formInputClass"></VFormField>
                        <VFormField label="Price"><input v-model.number="roomType.price" type="number" min="0" :class="formInputClass"></VFormField>
                        <VFormField label="Floor"><input v-model.number="roomType.floor" type="number" min="0" :class="formInputClass"></VFormField>
                        <VFormField label="Unit"><input v-model.number="roomType.numberOfUnits" type="number" min="0" :class="formInputClass"></VFormField>
                        <div class="md:col-span-2"><VFormField label="Description"><textarea v-model="roomType.description" rows="2" :class="formInputClass"></textarea></VFormField></div>
                    </div>
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="mt-8 pt-6 border-t border-gray-200 flex justify-between">
                <VButton @click="router.back()" class="bg-gray-600 hover:bg-gray-700 text-sm">Back</VButton>
                <div class="flex gap-2">
                    <VButton @click="addRoomTypeForm" type="button" class="bg-yellow-500 hover:bg-yellow-600 text-sm">+ Add Type</VButton>
                    <VButton @click="handleSubmit" type="button" class="text-sm">Save</VButton>
                </div>
            </div>
        </div>
    </div>
  </main>
</template>