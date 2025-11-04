import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import PropertyView from '@/views/PropertyView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/properties',
      name: 'properties',
      component: PropertyView,
    },
    // Tambahkan rute placeholder ini untuk menghilangkan warning
    {
      path: '/bookings',
      name: 'bookings',
      // Komponennya bisa dibuat nanti
      component: () => import('@/views/PropertyView.vue'), // Sementara arahkan ke halaman yang ada
    },
    {
      path: '/statistic',
      name: 'statistic',
      // Komponennya bisa dibuat nanti
      component: () => import('@/views/PropertyView.vue'), // Sementara arahkan ke halaman yang ada
    },
  ],
});

export default router;