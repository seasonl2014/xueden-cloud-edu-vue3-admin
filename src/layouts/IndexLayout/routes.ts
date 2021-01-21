import { RoutesDataItem } from "@/utils/routes";



const IndexLayoutRoutes: Array<RoutesDataItem> = [
  {
    icon: 'home',
    title: 'index-layout.menu.home',
    path: '/home',
    redirect: '/home/workplace',
    component: ()=> import('@/layouts/BlankLayout.vue'),
    children: [
      {
        icon: 'control',
        title: 'index-layout.menu.home.workplace',
        path: 'workplace',
        component: ()=> import('@/views/home/index.vue')
      },
      {
        icon: 'map',
        title: 'index-layout.menu.home.map',
        path: 'map',
        component: ()=> import('@/views/home/components/MapChartCard/index.vue')
      },
      {
        icon: 'video',
        title: 'index-layout.menu.home.video',
        path: 'http://java.goodym.cn/html/1610442125958.html',
        belongTopMenu: '/home',
        redirect: ''
      },
    ],
  },

/*  {
    icon: 'page',
    title: 'index-layout.menu.system',
    path: '/system',
    redirect: '/system/user',
    component: ()=> import('@/layouts/BlankLayout.vue'),
    children: [
          {
            title: 'index-layout.menu.system.list.user',
            path: 'user',
            component: ()=> import('@/views/system/user/list/index2.vue'),
          },
          {
            title: 'index-layout.menu.system.list.role',
            path: 'role',
            component: ()=> import('@/views/system/role/list/index2.vue'),
          },
          {
            title: 'index-layout.menu.system.list.menu',
            path: 'menu',
            component: ()=> import('@/views/system/menu/list/index2.vue'),
          },
          {
            title: 'index-layout.menu.system.list.log',
            path: 'log',
            component: ()=> import('@/views/system/log/list/index2.vue'),
          },

    ],
  },*/



];

export default IndexLayoutRoutes;
