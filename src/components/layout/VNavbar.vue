<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<template>
  <nav class="fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-white px-12 py-4 shadow-md border-b border-slate-200">
    <RouterLink to="/" class="text-2xl font-bold text-blue-600">TravelAPAP</RouterLink>

    <div class="flex space-x-8">
      <RouterLink to="/properties" class="text-slate-700 font-medium transition-colors duration-200 hover:text-blue-600" active-class="text-blue-600 font-semibold">
        Property
      </RouterLink>
      <RouterLink to="/bookings" class="text-slate-700 font-medium transition-colors duration-200 hover:text-blue-600" active-class="text-blue-600 font-semibold">
        Bookings
      </RouterLink>
      <RouterLink to="/statistic" class="text-slate-700 font-medium transition-colors duration-200 hover:text-blue-600" active-class="text-blue-600 font-semibold">
        Statistic
      </RouterLink>
    </div>
  </nav>
</template>