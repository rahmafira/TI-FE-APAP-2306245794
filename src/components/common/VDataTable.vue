<script setup lang="ts">
import type { PropType } from 'vue';

interface Header {
    text: string;
    value: string;
}

defineProps({
    headers: {
        type: Array as PropType<Header[]>,
        required: true,
    },
    items: {
        type: Array as PropType<Record<string, unknown>[]>,
        required: true,
    }
})
</script>

<template>
    <div class="overflow-x-auto border border-gray-200 rounded-lg">
        <table class="min-w-full bg-white">
            <thead class="bg-gray-100">
                <tr>
                    <th v-for="header in headers" :key="header.value" scope="col" class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        {{ header.text }}
                    </th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
                <tr v-if="items.length === 0">
                    <td :colspan="headers.length" class="px-6 py-10 text-center text-gray-500">No data available to display.</td>
                </tr>
                <tr v-for="item in items" :key="(item.bookingId || item.propertyId || item.id) as string" class="hover:bg-blue-50/50 transition-colors">
                    <td v-for="header in headers" :key="header.value" class="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        <slot :name="`item.${header.value}`" :item="item">
                            {{ item[header.value] }}
                        </slot>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>