import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import PropertyView from '@/views/PropertyView.vue';
import DetailPropertyView from '@/views/DetailPropertyView.vue';
import CreatePropertyView from '@/views/CreatePropertyView.vue';
import UpdatePropertyView from '@/views/UpdatePropertyView.vue';

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
    {
      path: '/properties/:id', 
      name: 'detail-property',
      component: DetailPropertyView,
    },
    {
      path: '/properties/create', // <-- Tambahkan rute ini
      name: 'create-property',
      component: CreatePropertyView,
    },
    {
      path: '/properties/update/:id', // <-- Tambahkan rute ini
      name: 'update-property',
      component: UpdatePropertyView,
    },
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