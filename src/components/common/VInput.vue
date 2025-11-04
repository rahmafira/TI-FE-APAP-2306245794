<script setup lang="ts">
const model = defineModel<string>();

defineProps({
    placeholder: {
        type: String,
        default: 'Search...'
    }
})
</script>

<template>
  <input
    v-model="model"
    type="text"
    :placeholder="placeholder"
    class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
  />
</template>