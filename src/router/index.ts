import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import PropertyView from '@/views/property/PropertyView.vue';
import DetailPropertyView from '@/views/property/DetailPropertyView.vue';
import CreatePropertyView from '@/views/property/CreatePropertyView.vue';
import UpdatePropertyView from '@/views/property/UpdatePropertyView.vue';
import AddRoomView from '@/views/AddRoomView.vue'; 
import BookingView from '@/views/BookingView.vue';
import DetailBookingView from '@/views/DetailBookingView.vue';
import CreateBookingView from '@/views/CreateBookingView.vue';
import UpdateBookingView from '@/views/UpdateBookingView.vue';

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
      component: BookingView,
    },
    {
      path: '/bookings/:id', 
      name: 'detail-booking',
      component: DetailBookingView,
    },
    {
      path: '/bookings/create/:idRoom?',
      name: 'create-booking',
      component: CreateBookingView,
      props: true
    },
    {
    path: '/bookings/update/:id',
    name: 'update-booking',
    component: UpdateBookingView,
    props: true,
    },
    {
      path: '/statistic',
      name: 'statistic',
      component: () => import('@/views/property/PropertyView.vue'), 
    },
  ],
});

export default router;