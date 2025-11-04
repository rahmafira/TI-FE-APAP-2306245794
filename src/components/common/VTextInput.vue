<script setup lang="ts">
const model = defineModel<string | number>();
defineProps<{
    label: string;
    disabled?: boolean;
}>();
</script>

<template>
    <div>
        <label class="block text-xs font-medium text-gray-600 mb-1">{{ label }}</label>
        <input 
            :value="model"
            @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
            :disabled="disabled"
            type="text"
            class="w-full p-2 border border-gray-300 rounded-md shadow-sm bg-white focus:ring-blue-500 focus:border-blue-500 text-sm disabled:bg-gray-100 disabled:text-gray-500"
        />
    </div>
</template>