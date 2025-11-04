<script setup lang="ts">
const props = defineProps<{
    show: boolean;
    title?: string;
    message?: string;
}>();

const emit = defineEmits(['confirm', 'cancel']);
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
            <!-- 
              PERUBAHAN KRITIS DI SINI:
              Semua kelas background (bg-black, bg-gray-900, bg-opacity-*) DIHAPUS.
              Div ini sekarang hanya berfungsi sebagai container transparan untuk memusatkan modal.
            -->
            <div v-if="props.show" class="fixed inset-0 z-50 flex items-center justify-center">
                <transition
                    enter-active-class="transition ease-out duration-300"
                    enter-from-class="opacity-0 translate-y-4 sm:scale-95"
                    enter-to-class="opacity-100 translate-y-0 sm:scale-100"
                    leave-active-class="transition ease-in duration-200"
                    leave-from-class="opacity-100 translate-y-0 sm:scale-100"
                    leave-to-class="opacity-0 translate-y-4 sm:scale-95"
                >
                    <!-- Kotak dialog modalnya saja, dengan shadow agar menonjol -->
                    <div v-if="props.show" class="bg-white rounded-lg shadow-2xl max-w-sm w-full p-6 text-center mx-4 border">
                        <h3 class="text-lg font-bold text-gray-800">
                            {{ props.title || 'Delete Property?' }}
                        </h3>
                        <div class="mt-2">
                            <p class="text-sm text-gray-500">
                                {{ props.message || 'This action cannot be undone.' }}
                            </p>
                        </div>
                        <div class="mt-6 flex justify-center gap-4">
                            <button @click="emit('confirm')" type="button" class="w-full inline-flex justify-center rounded-lg border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700">
                                Yes
                            </button>
                            <button @click="emit('cancel')" type="button" class="w-full inline-flex justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50">
                                No
                            </button>
                        </div>
                    </div>
                </transition>
            </div>
        </transition>
    </teleport>
</template>