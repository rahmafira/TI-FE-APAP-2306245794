<script setup lang="ts">
import { ref } from 'vue';
import VButton from './VButton.vue';

const props = defineProps<{
    show: boolean;
    roomName: string;
}>();

const emit = defineEmits(['close', 'save']);

const maintenanceStart = ref('');
const maintenanceEnd = ref('');

const handleSave = () => {
    if (!maintenanceStart.value || !maintenanceEnd.value) {
        alert("Please select both start and end dates.");
        return;
    }

    const startDate = new Date(maintenanceStart.value);
    const endDate = new Date(maintenanceEnd.value);

    if (endDate < startDate) {
        alert("End date cannot be earlier than the start date.");
        return; 
    }

    emit('save', {
        maintenanceStart: startDate.toISOString(),
        maintenanceEnd: endDate.toISOString(),
    });
};
</script>

<template>
 <teleport to="body">
    <transition
        enter-active-class="transition-opacity ease-out duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity ease-in duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
    >
      <div v-if="props.show" class="fixed inset-0 z-50 flex items-center justify-center">
        <transition
            enter-active-class="transition ease-out duration-300"
            enter-from-class="opacity-0 translate-y-4 sm:scale-95"
            enter-to-class="opacity-100 translate-y-0 sm:scale-100"
            leave-active-class="transition ease-in duration-200"
            leave-from-class="opacity-100 translate-y-0 sm:scale-100"
            leave-to-class="opacity-0 translate-y-4 sm:scale-95"
        >
          <div v-if="props.show" class="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 mx-4 border">
            <h3 class="text-lg font-bold text-gray-800">
              Add Maintenance for Room {{ props.roomName }}
            </h3>
            <div class="mt-4 space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Start</label>
                <input v-model="maintenanceStart" type="datetime-local" class="mt-1 w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">End</label>
                <input v-model="maintenanceEnd" type="datetime-local" class="mt-1 w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
              </div>
            </div>
            <div class="mt-6 flex justify-end gap-3">
              <VButton @click="emit('close')" class="bg-gray-200 text-gray-800 hover:bg-gray-300">Cancel</VButton>
              <VButton @click="handleSave">Save</VButton>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </teleport>
</template>