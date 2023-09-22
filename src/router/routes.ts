import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    //component: () => import('layouts/Login.vue'),
    children: [{ path: '', component: () => import('src/pages/LoginPage.vue') }],
  },
  {
    path: '/home',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/DashBoardPage.vue') }],
  },
  {
    path: '/usuarios',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/UsuariosPage.vue') }],
  },
  {
    path: '/empleados',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/EmpleadosPage.vue') }],
  },
  {
    path: '/productos',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/ProductosPage.vue') }],
  },
  {
    path: '/store',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/StorePage.vue') }],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
