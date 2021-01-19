import router from "@/config/routes";
import UserModel from "@/store/user";
import {buildMenus} from "@/services/user";
import {RoutesDataItem} from "@/utils/routes";
import {generateLeftAndTopMenusTree} from "@/utils/menudata";
import {getToken} from "@/utils/localToken";
import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import SecurityLayout from "@/layouts/SecurityLayout.vue";
import IndexLayout from "@/layouts/IndexLayout/index.vue";
// 拉取动态路由
export const loadMenus = (next: NavigationGuardNext, to: RouteLocationNormalized, menusList: RoutesDataItem[]) => {
    const asyncRouter = {
        title: 'empty',
        path: '/',
        component: SecurityLayout,
        children: [
            {
                title: 'empty',
                path: '/system',
                redirect: '/system/user',
                component: IndexLayout,
                children: menusList
            },
        ]
    }
    router.addRoute(asyncRouter as any)
    next({ ...to, replace: true })

}

router.beforeEach((to, from, next) => {
    // 获取本地token
    getToken().then(r => {
        // console.info("当前token值是", r)
        if (r === null) {
            if (to.path == '/user/login') { // 防止造成死循环
                next();
            } else {
               // next({path: '/user/login'})
                next(`/user/login?redirect=${to.path}`) // 否则全部重定向到登录页
            }
        } else {
            if (to.path === '/user/login') {
                return next()
            } else {
                if (UserModel.state.currentUserMenu.length === 0) {
                    buildMenus().then((res: { data: unknown[] }) => {
                       /* console.info("能否进入到这里",res)*/
                        const menusList: Array<RoutesDataItem> = generateLeftAndTopMenusTree(res.data)
                        UserModel.state.currentUserMenu = menusList
                        loadMenus(next, to, menusList)
                    })
                } else {
                    next()
                }

            }

        }
    })


})


