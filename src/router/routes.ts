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
  {
    path: '/periodos',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/PeriodosPage.vue') }],
  },
  {
    path: '/horas',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/HorasPage.vue') }],
  },
  {
    path: '/comisiones',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/ComisionesPage.vue') }],
  },
  {
    path: '/bonificaciones',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/BonificacionesPage.vue') }],
  },
  {
    path: '/dias',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/ReporteDiasPage.vue') }],
  },
  {
    path: '/aportes',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/AportesPage.vue') }],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
