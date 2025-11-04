<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import { useBerandaStore } from '@/stores/beranda.store';
import VButton from '@/components/common/VButton.vue';
import IconHome from '@/components/icons/IconHome.vue';
import IconCalendar from '@/components/icons/IconCalendar.vue';

const berandaStore = useBerandaStore();

onMounted(() => {
  berandaStore.fetchBerandaStats();
});
</script>

<template>
  <main class="flex min-h-screen items-center justify-center bg-blue-50/50 pt-20 px-4">
    <div class="w-full max-w-3xl rounded-2xl bg-white p-8 text-center shadow-xl border border-gray-100">
      
      <h1 class="text-3xl font-light text-gray-700">
        Welcome to <span class="font-bold text-blue-600">Accommodation App</span>
      </h1>
      <p class="mt-2 text-sm text-gray-500">
        Let's stay with us! Discover, book, and manage your perfect stay effortlessly!
      </p>

      <div class="mt-10">
        <h2 class="text-xl font-semibold text-gray-800">Platform Statistics</h2>

        <div v-if="berandaStore.loading" class="mt-6 text-gray-500">Loading stats...</div>
        <div v-else-if="berandaStore.error" class="mt-6 text-red-500">{{ berandaStore.error }}</div>

        <div v-else-if="berandaStore.stats" class="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          
          <div class="rounded-xl border border-gray-200 bg-gray-50/70 p-4 text-left">
            <div class="flex items-start justify-between">
              <div>
                <p class="text-sm text-gray-500">Total Properties</p>
                <p class="mt-2 text-4xl font-bold text-gray-900">{{ berandaStore.stats.totalProperties }}</p>
                <p class="text-xs text-gray-500">All registered properties</p>
              </div>
              <div class="rounded-lg bg-gray-200 p-2">
                <IconHome class="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </div>

          <div class="rounded-xl border border-gray-200 bg-gray-50/70 p-4 text-left">
            <div class="flex items-start justify-between">
              <div>
                <p class="text-sm text-gray-500">Total Bookings</p>
                <p class="mt-2 text-4xl font-bold text-gray-900">{{ berandaStore.stats.totalBookings }}</p>
                <p class="text-xs text-gray-500">All recorded bookings</p>
              </div>
              <div class="rounded-lg bg-gray-200 p-2">
                <IconCalendar class="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </div>

        </div>

        <div class="mt-10 flex justify-center gap-4">
          <RouterLink to="/properties">
            <VButton>See Properties</VButton>
          </RouterLink>
          <RouterLink to="/bookings">
            <VButton>See Bookings</VButton>
          </RouterLink>
        </div>
      </div>
    </div>
  </main>
</template>