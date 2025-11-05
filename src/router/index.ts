import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import PropertyView from '@/views/PropertyView.vue';
import DetailPropertyView from '@/views/DetailPropertyView.vue';
import CreatePropertyView from '@/views/CreatePropertyView.vue';
import UpdatePropertyView from '@/views/UpdatePropertyView.vue';
import AddRoomView from '@/views/AddRoomView.vue'; 

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
      path: '/properties/create', 
      name: 'create-property',
      component: CreatePropertyView,
    },
    {
      path: '/properties/update/:id',
      name: 'update-property',
      component: UpdatePropertyView,
    },
    {
      path: '/properties/updateroom/:id', 
      name: 'add-room',
      component: AddRoomView,
    },
    {
      path: '/bookings',
      name: 'bookings',
      component: () => import('@/views/PropertyView.vue'), 
    },
    {
      path: '/statistic',
      name: 'statistic',
      component: () => import('@/views/PropertyView.vue'), 
    },
  ],
});

export default router;