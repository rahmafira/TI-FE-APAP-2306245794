<script setup lang="ts">
const model = defineModel<string>();
defineProps<{
    label: string;
}>();
</script>
<template>
    <div>
        <label class="block text-xs font-medium text-gray-600 mb-1">{{ label }}</label>
        <textarea
            :value="model"
            @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
            rows="3"
            class="w-full p-2 border border-gray-300 rounded-md shadow-sm bg-white focus:ring-blue-500 focus:border-blue-500 text-sm"
        ></textarea>
    </div>
</template>