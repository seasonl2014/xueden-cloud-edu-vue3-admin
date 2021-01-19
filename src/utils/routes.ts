/**
 * Route utils
 * @author LiQingSong
 */
import { Component } from 'vue';
import { RouteLocation, RouteLocationRaw, RouteRecordRaw} from 'vue-router';
import { isExternal } from './validate';
import BlankLayout from '@/layouts/BlankLayout.vue';
/**
 * 路由类型
 */
export interface BreadcrumbType {
  // 标题，路由在菜单、浏览器title 或 面包屑中展示的文字，目前可以使用locales
  title: string;
  // 路由地址或外链
  path: string;
}
interface RoutesDataItemCore {
  // 菜单中是否隐藏
  hidden?: boolean;
  // 图标的名称，显示在菜单标题前
  icon?: string;
  // 权限控制，页面角色(您可以设置多个角色)
  roles?: string[];
  // 标题，路由在菜单、浏览器title 或 面包屑中展示的文字，目前可以使用locales
  title: string;
  // 路由地址或外链
  path: string;
  // 父节点
  pid?: number;
  // 子集
  children?: RoutesDataItem[];
  /**
   * 面包屑自定义内容：
   *     1、默认不配置按照路由自动读取；
   *     2、设置为 false , 按照路由自动读取并不读当前自己；
   *     3、配置对应的面包屑格式如下：
   */
  breadcrumb?: BreadcrumbType[] | false;
  /**
   * 左侧菜单选中，如果设置路径，侧栏将突出显示你设置的路径对应的侧栏导航
   *   1、（默认 route.path），此参数是为了满足特殊页面特殊需求，
   *   2、如：详情页等选中侧栏导航或在模块A下面的页面，想选模块B为导航选中状态
   */
  selectLeftMenu?: string;
  /**
   * 所属顶级菜单,当顶级菜单存在时，用于选中顶部菜单，与侧栏菜单切换
   *   1、三级路由此参数的作用是选中顶级菜单
   *   2、二级路由此参数的作用是所属某个顶级菜单的下面，两个层级的必须同时填写一致，如果path设置的是外链，此参数必填
   *   3、(默认不设置 path.split('/')[0])，此参数是为了满足特殊页面特殊需求
   */
  belongTopMenu?: string;
}
interface RoutesDataItemComponent extends RoutesDataItemCore {
  // 跳转地址
  redirect?: RouteLocationRaw | ((to: RouteLocation) => RouteLocationRaw);
  // 组件页面
  component: Component | Promise<Component>;
}
interface RoutesDataItemRedirect extends RoutesDataItemCore{
  // 跳转地址
  redirect: RouteLocationRaw | ((to: RouteLocation) => RouteLocationRaw);
  // 组件页面
  component?: Component | Promise<Component>;
}
export type RoutesDataItem = RoutesDataItemComponent | RoutesDataItemRedirect ;


/**
 * 返回子组件
 * @param view
 */
export const loadView = (view: string) => {
  return () => import('@/views/system/user/list/index.vue')
  //return () => import(`@/views/${view}`)
}

/**
 * 返回BlankLayout组件
 * @param view
 */
export const loadBlankLayoutView = () => {
  return () => import(`@/layouts/BlankLayout.vue`)
}

/**
 * 获取 route
 * @param pathname path
 * @param routesData routes
 */
export const getRouteItem = (pathname: string, routesData: RoutesDataItem[]): RoutesDataItem => {
  let item: RoutesDataItem = { title: '', path: '', redirect: '', roles: [] };
  for (let index = 0, len = routesData.length; index < len; index += 1) {
    const element = routesData[index];
    if (element.path === pathname) {
      item = element;
      break;
    }

    if (element.children) {
      item = getRouteItem(pathname, element.children);
      if (item.path !== '') {
        break;
      }
    }
  }

  return item;
};

/**
 * 根据 hidden 判断是否有数据子集
 * @param children RoutesDataItem[]
 */
export const hasChildRoute = (children: RoutesDataItem[]): boolean => {
  const showChildren = children.filter(item => {
    if (item.hidden) {
      return false;
    }
    return true;
  });
  if (showChildren.length > 0) {
    return true;
  }
  return false;
};

/**
 * 根据路由 path 格式化 - 获取 父path
 * @param pathname path
 * @param separator 路由分割符- 默认 /
 */
export const formatRoutePathTheParents = (pathname: string, separator = '/'): string[] => {
  const arr: string[] = [];
  if (!pathname || pathname === '') {
    return arr;
  }

  const pathArr = pathname.split(separator);
  for (let index = 1, len = pathArr.length - 1; index < len; index += 1) {
    arr.push(pathArr.slice(0, index + 1).join(separator));
  }

  return arr;
};

/**
 * 根据父path 设置当前项 path
 * @param pathname path
 * @param parentPath 父path - 默认 /
 * @param headStart 路由起始头 - 默认 /
 */
export const setRoutePathForParent = (pathname: string, parentPath = '/', headStart = '/'): string => {
  if (isExternal(pathname)) {
    return pathname;
  }

  return pathname.substr(0, headStart.length) === headStart
      ? pathname
      : `${parentPath}/${pathname}`;
};

/**
 * 根据路由 pathname 数组 - 返回对应的 route 数组
 * @param pathname path[]
 * @param routesData routes
 */
export const getPathsTheRoutes = ( pathname: string[], routesData: RoutesDataItem[]): RoutesDataItem[] => {
  const routeItem: RoutesDataItem[] = [];

  for (let index = 0, len = pathname.length; index < len; index += 1) {
    const element = pathname[index];
    const item = getRouteItem(element, routesData);
    if (item.path !== '') {
      routeItem.push(item);
    }
  }

  return routeItem;
};


/**
 * 获取面包屑对应的 route 数组
 * @param route route 当前routeItem
 * @param pathname path[]
 * @param routesData routes
 */
export const getBreadcrumbRoutes = (route: RoutesDataItem, pathname: string[], routesData: RoutesDataItem[]): BreadcrumbType[] => {
  if (!route.breadcrumb) {
    const routePaths = getPathsTheRoutes(pathname, routesData);

    return route.breadcrumb === false ? routePaths : [...routePaths, route];
  }

  return route.breadcrumb;
};


/**
 * 获取当前路由选中的侧边栏菜单path
 * @param route route
 */
export const getSelectLeftMenuPath = (route: RoutesDataItem): string => {
  return route.selectLeftMenu || route.path;
};

/**
 * 获取当前路由对应的顶部菜单path
 * @param route route
 */
export const getRouteBelongTopMenu = (route: RoutesDataItem): string => {
  if (route.belongTopMenu) {
    return route.belongTopMenu;
  }
  return `/${route.path.split('/')[1]}`;
};


/**
 * 格式化返回 vue 路由, 主要处理特殊情况
 * @param routesData routes
 * @param parentPath 父path - 默认 /
 * @param headStart 路由起始头 - 默认 /
 */
export const vueRoutes = (routesData: RoutesDataItem[], parentPath = '/', headStart = '/'): RoutesDataItem[] => {
  return routesData.map(item => {
    const { children, ...other } = item;
    const itemChildren = children || [];
    const newItem: RoutesDataItem = { ...other };
    newItem.path = setRoutePathForParent(newItem.path, parentPath, headStart);

    if (item.children) {
      newItem.children = [
        ...vueRoutes(itemChildren, newItem.path, headStart),
      ];
    }
    return newItem;
  });
};


/**
 * 根据 自定义传入权限名 判断当前用户是否有权限
 * @param userPermissions 用户的菜单权限
 * @param permissions 自定义菜单权限名
 */
export const hasPermissionRouteMenu = (userPermissions: string[], permissions?: string | string[]): boolean => {

  // 不设置权限，直接放行
  if(typeof permissions === 'undefined') {
    return true;
  }

  // 自定义的是字符串
  if (typeof permissions === 'string') {
    return userPermissions.includes(permissions);
  }

  // 自定义的是字符串
  if(permissions instanceof Array && permissions.length > 0) {
    return permissions.some(permission => userPermissions.includes(permission));
  }

  return false;
};


/**
 * 根据 自定义传入权限名 判断当前用户是否有权限
 * @param userRoles 用户的权限
 * @param roles 自定义权限名
 */
export const hasPermissionRouteRoles = (userRoles: string[], roles?: string | string[]): boolean => {
  if (userRoles.includes('admin')) {
    return true;
  }

  if(typeof roles === 'undefined') {
    return true;
  }

  if (typeof roles === 'string') {
    return userRoles.includes(roles);
  }

  if(roles instanceof Array && roles.length > 0) {
    return roles.some(role => userRoles.includes(role));
  }

  return false;
};

/**
 * 根据 route.role 判断当前用户是否有权限
 * @param roles 用户的权限
 * @param route 当前路由
 */
export const hasPermission = (roles: string[], route: RoutesDataItem): boolean => {
  if (roles.includes('admin')) {
    return true;
  }

  if (route.roles) {
    return route.roles.some(role => roles.includes(role));
    //return role.some(role => route.role?.includes(role));
  }

  return true;
};

/**
 * 根据用户权限 获取 对应权限菜单
 * @param roles 用户的权限
 * @param routes 框架对应路由
 */
export const getPermissionMenuData = ( roles: string[], routes: RoutesDataItem[]): RoutesDataItem[] => {
  const menu: RoutesDataItem[] = [];
  for (let index = 0, len = routes.length; index < len; index += 1) {
    const element = {...routes[index]};
    if (hasPermission(roles, element)) {
      if (element.children) {
        element.children = getPermissionMenuData(roles, element.children);
      }
      menu.push(element);
    }
  }

  return menu;
};


