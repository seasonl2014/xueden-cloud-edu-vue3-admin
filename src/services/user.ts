import request from '@/utils/request';

// 获取当前用户信息
export async function queryCurrent(): Promise<any> {
    return request({
        url: '/system/user/getUserInfo',
        method: 'get'
    });
}

// 获取当前用户所具有的菜单
export async function queryCurrentUserMenu(): Promise<any> {
    return request({
        url: '/system/user/queryCurrentUserMenu',
        method: 'get'
    });
}

export function buildMenus() {
    return request({
        url: '/system/user/queryCurrentUserMenu',
        method: 'get'
    })
}



export async function queryMessage(): Promise<any> {
    return request({
        url: '/user/message'
    });
}
