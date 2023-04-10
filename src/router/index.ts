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
      {
        path: '/posts',
        name: 'posts',
        component: () => import('@/views/AllPosts.vue'),
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
        component: () => import('@/views/LogIn.vue'),
      },
      {
        path: '/profile',
        name: 'profile',
        component: () => import('@/views/UserProfile.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: 'active',
});

export default router;
