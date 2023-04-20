// Composables
import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '@/store/users';


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
      {
        path: '/posts/:id/:slug',
        name: 'post-details',
        component: () => import('@/views/PostView.vue'),
      },
      {
        path: '/create-post',
        name: 'create-post',
        component: () => import('@/views/CreatePost.vue'),
        beforeEnter: (to: any, from: any) => {
          const user = useUserStore().user;
          if (!user.isStaff)
            // reject the navigation because the user is NOT logged-in
            return {name: 'home'};
        },
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
        beforeEnter: (to: any, from: any) => {
          const token = useUserStore().token;
          if (token)
            // reject the navigation because the user is logged-in
            return {name: 'profile'};
        },
      },
      {
        path: '/login',
        name: 'login',
        component: () => import('@/views/LogIn.vue'),
        beforeEnter: (to: any, from: any) => {
          const token = useUserStore().token;
          if (token)
            // reject the navigation because the user is logged-in
            return {name: 'profile'};
        },
      },
      {
        path: '/profile',
        name: 'profile',
        component: () => import('@/views/UserProfile.vue'),
        beforeEnter: (to: any, from: any) => {
          const token = useUserStore().token;
          if (token)
            // reject the navigation because the user is NOT logged-in
            return {name: 'home'};
        },
      },
      {
        path: '/reset-password',
        name: 'reset-password',
        component: () => import('@/views/ResetPassword.vue'),
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
