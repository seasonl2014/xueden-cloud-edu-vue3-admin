import {RoutesDataItem} from "@/utils/routes";

/**
 * 站点配置
 * @author LiQingSong
 */
export interface SettingsType {
    /**
     * 站点名称
     */
    siteTitle: string;

    /**
     * 顶部菜单开启
     */
    topNavEnable: boolean;

    /**
     * 头部固定开启
     */
    headFixed: boolean;

    /**
     * 站点本地存储Token 的 Key值
     */
    siteTokenKey: string;

    /**
     * Ajax请求头发送Token 的 Key值
     */
    ajaxHeadersTokenKey: string;

    /**
     * Ajax返回值不参加统一验证的api地址
     */
    ajaxResponseNoVerifyUrl: string[];

    /**
     * iconfont.cn 项目在线生成的 js 地址
     */
    iconfontUrl: string[];

    /**
     * 用户树形菜单存储的 Key值
     */
    userMenusKey: string;

    /**
     * 当前用户所具有的树形菜单
     */
    userMenusTree: RoutesDataItem[];

}

const settings: SettingsType = {
    siteTitle: '后台管理系统',
    topNavEnable: true,
    headFixed: true,
    siteTokenKey: 'admin_element_vue_token',
    ajaxHeadersTokenKey: 'Authorization',
    ajaxResponseNoVerifyUrl: [
        '/user/login', // 用户登录
        '/user/info', // 获取用户信息
        '/code', // 获取验证码
    ],
    iconfontUrl: [],
    userMenusKey: 'user_menu_vue_token',
    userMenusTree: [],
};

export default settings;
