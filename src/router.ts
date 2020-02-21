import Router from 'vue-router';
import { RouteItem } from '@/type/route';
export const route = [
    {
      path: '/',
        name: 'user-login',
        component: () => import( './views/login/Index.vue'),
    },
    {
      path: '/login',
      name: 'user-login',
      component: () => import( './views/login/Index.vue'),
    },
  ];

export const getRouter = (allMenus: RouteItem[]) => {
  const router = new Router({
      mode: 'history',
      base: '/user-login-cas-web/',
      routes: route,
  });
  return router;
};

