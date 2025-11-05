<script setup lang="ts">
import { onMounted, reactive, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePropertyStore } from '@/stores/property.store';
import VButton from '@/components/common/VButton.vue';
import VTextInput from '@/components/common/VTextInput.vue';
import VTextareaInput from '@/components/common/VTextareaInput.vue';
import type { UpdatePropertyPayload } from '@/interfaces/property.interface';

const route = useRoute();
const router = useRouter();
const propertyStore = usePropertyStore();

const form = reactive<UpdatePropertyPayload>({
    propertyId: '',
    propertyName: '',
    address: '',
    description: '',
    listRoomType: [],
});

watch(() => propertyStore.currentProperty, (newProperty) => {
    if (newProperty) {
        form.propertyId = newProperty.propertyId;
        form.propertyName = newProperty.propertyName;
        form.address = newProperty.address;
        form.description = newProperty.description;
        
        form.listRoomType = newProperty.listRoomType.map(rt => ({
            roomTypeId: rt.roomTypeId,
            facility: rt.facility,
            description: rt.description,
            capacity: rt.capacity,
            price: rt.price,
        }));
    }
}, { immediate: true });

const handleSubmit = async () => {
    await propertyStore.updateProperty(form);
};

onMounted(() => {
    const propertyId = route.params.id as string;
    if (propertyId) {
        propertyStore.fetchPropertyDetail(propertyId);
    }
});
</script>

<template>
  <main class="min-h-screen bg-blue-50/30 pt-28 pb-10 px-4">
    <div v-if="propertyStore.loadingDetail" class="text-center">Loading...</div>
    <div v-else-if="propertyStore.currentProperty" class="container mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
        <h1 class="text-xl font-bold text-blue-800 mb-6">
          Update Property – <span class="text-gray-600">{{ propertyStore.currentProperty.propertyName }}</span>
        </h1>

        <div class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <VTextInput label="Property ID" v-model="form.propertyId" disabled />
                <VTextInput label="Property Name" v-model="form.propertyName" />
                <div class="md:col-span-2"><VTextareaInput label="Address" v-model="form.address" /></div>
                <div class="md:col-span-2"><VTextareaInput label="Description" v-model="form.description" /></div>
            </div>

            <div class="mt-8 border-t border-gray-200 pt-6">
                <h2 class="text-lg font-semibold text-gray-800 mb-4">Room Types</h2>
                <div class="space-y-6">
                    <div v-for="rt in form.listRoomType" :key="rt.roomTypeId" class="bg-blue-50/40 p-4 rounded-lg border border-blue-200/50">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                            <VTextInput label="Room Type ID" v-model="rt.roomTypeId" disabled />
                            <VTextInput label="Facility" v-model="rt.facility" />
                            <div class="md:col-span-2"><VTextareaInput label="Description" v-model="rt.description" /></div>
                            <VTextInput label="Capacity" v-model.number="rt.capacity" />
                            <VTextInput label="Price" v-model.number="rt.price" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="mt-8 pt-6 border-t border-gray-200 flex justify-between">
            <VButton @click="router.back()" class="bg-gray-600 hover:bg-gray-700 text-sm">Back</VButton>
            <VButton @click="handleSubmit" type="button" class="text-sm">Update</VButton>
        </div>
    </div>
  </main>
</template>