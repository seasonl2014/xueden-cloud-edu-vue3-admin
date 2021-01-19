/**
 * 自定义指令 权限验证
 * @author LiQingSong
 * 使用Demo：
 *      import permission from '@/directives/permission';
 *      import { defineComponent } from "vue";
 *      export default defineComponent({
 *          directives: {
 *              permission
 *          }
 *      })
 *      <a href="#" v-permission="'test'">删除</a>
 *      <a href="#" v-permission="['admin','test']">删除</a>
 */
import { Directive } from "vue";
import UserModel from "@/store/user";
import { hasPermissionRouteMenu } from "@/utils/routes";

const permission: Directive = (el, binding, vnode, prevVNode) => {
    const { value } = binding;
    if(value) {
        //const userRoles = UserModel.state.currentUser.roles;
        // 获取用户所具有的菜单权限标志
        const userPermissions = UserModel.state.currentUser.permissions;
        // console.info("用户所具有的菜单权限标志",userPermissions)
        if(!hasPermissionRouteMenu(userPermissions, value)){
            el.parentNode && el.parentNode.removeChild(el);
        }
    } else {
        throw new Error(`need roles! Like v-permission="['admin','test']" or v-permission="'test'"`);
    }
}

export default permission;
