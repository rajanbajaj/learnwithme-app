import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/register',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', name: 'Register', component: () => import('pages/Register.vue') }],
  },
  {
    path: '/login',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', name: 'Login',  component: () => import('pages/Login.vue') }],
  },

  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/Index.vue') }],
  },

  {
    path: '/members',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/Members.vue') }],
  },

  {
    path: '/members/:id',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/MemberProfile.vue') }],
  },

  {
    path: '/posts',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/Posts.vue') }],
  },

  {
    path: '/posts/register',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/RegisterPost.vue') }],
  },

  {
    path: '/posts/:id',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/Post.vue') }],
  },

  {
    path: '/media-groups',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/MediaGroup.vue') }],
  },

  {
    path: '/media-groups/register',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/RegisterMediaGroup.vue') }],
  },

  {
    path: '/media-groups/:id',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/Media.vue') }],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue'),
  },
];

export default routes;
