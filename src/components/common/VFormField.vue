<script setup lang="ts">
defineProps<{
    label: string;
    required?: boolean;
}>();
</script>

<template>
    <div>
        <label class="text-sm font-medium text-gray-700">
            {{ label }}
            <span v-if="required" class="text-red-500">*</span>
        </label>
        <div class="mt-1">
            <slot></slot>
        </div>
    </div>
</template>