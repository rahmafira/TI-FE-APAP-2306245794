<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { usePropertyStore } from '@/stores/property.store';
import { ExternalService, type Province } from '@/services/external.service';
import VButton from '@/components/common/VButton.vue';
import VFormField from '@/components/common/VFormField.vue'; 
import type { CreatePropertyPayload } from '@/interfaces/property.interface';

const router = useRouter();
const propertyStore = usePropertyStore();

const provinces = ref<Province[]>([]);
const roomTypeOptions = ref<string[]>([]);

const propertyModel = reactive<CreatePropertyPayload>({
    propertyName: '',
    type: 1,
    province: null,
    address: '',
    description: '',
    ownerId: '',
    ownerName: '',
    listRoomType: []
});

const propertyTypes = [ { value: 1, text: 'Hotel' }, { value: 2, text: 'Villa' }, { value: 3, text: 'Apartment' }];
const roomNames: Record<number, string[]> = {
    1: ['Single Room', 'Double Room', 'Deluxe Room', 'Superior Room', 'Suite', 'Family Room', 'Penthouse'],
    2: ['Luxury', 'Beachfront', 'Mountside', 'Eco-friendly', 'Romantic'],
    3: ['Studio', '1BR', '2BR', '3BR']
};

watch(() => propertyModel.type, (newType) => {
    roomTypeOptions.value = newType ? roomNames[newType] || [] : [];
    propertyModel.listRoomType.forEach(rt => rt.name = '');
}, { immediate: true });

const addRoomType = () => {
    propertyModel.listRoomType.push({ name: '', facility: '', capacity: 0, price: 0, floor: 0, numberOfUnits: 0, description: '' });
};

const removeRoomType = (index: number) => {
    propertyModel.listRoomType.splice(index, 1);
};

const handleSubmit = async () => {
    await propertyStore.createProperty(propertyModel);
};

onMounted(async () => {
    provinces.value = await ExternalService.getProvinces();
    if (propertyModel.listRoomType.length === 0) {
        addRoomType();
    }
});

const formInputClass = "w-full p-2 border border-gray-300 rounded-md shadow-sm bg-white focus:ring-blue-500 focus:border-blue-500 text-sm";
</script>

<template>
  <main class="min-h-screen bg-blue-50/30 pt-28 pb-10 px-4">
    <div class="container mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
        <h1 class="text-xl font-bold text-blue-800 mb-6">Add New Property</h1>

        <div class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <VFormField label="Property Name" required>
                    <input v-model="propertyModel.propertyName" type="text" :class="formInputClass">
                </VFormField>
                <VFormField label="Type" required>
                    <select v-model.number="propertyModel.type" :class="formInputClass">
                        <option v-for="pt in propertyTypes" :key="pt.value" :value="pt.value">{{ pt.text }}</option>
                    </select>
                </VFormField>
                <VFormField label="Province" required>
                     <select v-model.number="propertyModel.province" :class="formInputClass">
                        <option :value="null" disabled>Pilih provinsi</option>
                        <option v-for="p in provinces" :key="p.id" :value="Number(p.id)">{{ p.name }}</option>
                    </select>
                </VFormField>
                <div class="md:col-span-2">
                    <VFormField label="Address" required>
                        <textarea v-model="propertyModel.address" rows="3" :class="formInputClass"></textarea>
                    </VFormField>
                </div>
                <div class="md:col-span-2">
                    <VFormField label="Description" required>
                        <textarea v-model="propertyModel.description" rows="3" :class="formInputClass"></textarea>
                    </VFormField>
                </div>
                <VFormField label="Owner ID (UUID)" required>
                    <input v-model="propertyModel.ownerId" type="text" :class="formInputClass">
                </VFormField>
                <VFormField label="Owner Name" required>
                    <input v-model="propertyModel.ownerName" type="text" :class="formInputClass">
                </VFormField>
            </div>

            <div class="mt-8 border-t border-gray-200 pt-6">
                <h2 class="text-lg font-semibold text-gray-800 mb-4">Room Types</h2>
                <div class="space-y-6">
                    <div v-for="(roomType, index) in propertyModel.listRoomType" :key="index" class="bg-blue-50/40 p-4 rounded-lg border border-blue-200/50 relative">
                        <button @click="removeRoomType(index)" class="absolute top-3 right-3 text-red-500 hover:text-red-700 font-medium text-xs">Remove</button>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                            <VFormField label="Name" required><select v-model="roomType.name" :class="formInputClass"><option value="" disabled>Select Room Type</option><option v-for="opt in roomTypeOptions" :key="opt" :value="opt">{{ opt }}</option></select></VFormField>
                            <VFormField label="Facility" required><input v-model="roomType.facility" type="text" :class="formInputClass"></VFormField>
                            <VFormField label="Capacity" required><input v-model.number="roomType.capacity" type="number" min="0" :class="formInputClass"></VFormField>
                            <VFormField label="Price" required><input v-model.number="roomType.price" type="number" min="0" :class="formInputClass"></VFormField>
                            <VFormField label="Floor" required><input v-model.number="roomType.floor" type="number" min="0" :class="formInputClass"></VFormField>
                            <VFormField label="Unit" required><input v-model.number="roomType.numberOfUnits" type="number" min="0" :class="formInputClass"></VFormField>
                            <div class="md:col-span-2"><VFormField label="Description" required><textarea v-model="roomType.description" rows="2" :class="formInputClass"></textarea></VFormField></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="mt-8 pt-6 border-t border-gray-200 flex justify-between">
            <VButton @click="router.back()" class="bg-gray-600 hover:bg-gray-700 text-sm">Back</VButton>
            <div class="flex gap-2">
                <VButton @click="addRoomType" type="button" class="bg-yellow-500 hover:bg-yellow-600 text-sm">+ Add Type</VButton>
                <VButton @click="handleSubmit" type="button" class="text-sm">Save</VButton>
            </div>
        </div>
    </div>
  </main>
</template>