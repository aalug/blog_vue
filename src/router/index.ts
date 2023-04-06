// Composables
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/Default.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/views/Home.vue'),
      },
    ],
  },
  {
    path: '/',
    component: () => import('@/layouts/Base.vue'),
    children: [
      {
        path: '/sign-up',
        name: 'sign-up',
        component: () => import('@/views/SignUp.vue'),
      },
      {
        path: '/login',
        name: 'login',
        component: () => import('@/views/SignUp.vue'),
      },
    ],
  },


];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
