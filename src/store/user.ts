import { Mutation, Action } from 'vuex';
import { StoreModuleType } from "@/utils/store";
import { ResponseData } from '@/utils/request';
import { queryCurrent, queryMessage,queryCurrentUserMenu } from "@/services/user";
import { removeToken } from "@/utils/localToken";
import {RoutesDataItem} from "@/utils/routes";

export interface CurrentUser {
  id: number;
  name: string;
  avatar: string;
  roles: string[];
  permissions: string[];
}

export interface StateType {
  currentUser: CurrentUser;
  currentUserMenu: RoutesDataItem[];
  message: number;
}

export interface ModuleType extends StoreModuleType<StateType> {
  state: StateType;
  mutations: {
    saveCurrentUser: Mutation<StateType>;
    saveMessage: Mutation<StateType>;
    saveCurrentUserMenu: Mutation<StateType>;
  };
  actions: {
    fetchCurrent: Action<StateType, StateType>;
    fetchCurrentUserMenu: Action<StateType, StateType>;
    fetchMessage: Action<StateType, StateType>;
    logout: Action<StateType, StateType>;
  };
}

const initState: StateType = {
  currentUser: {
    id: 0,
    name: '',
    avatar: '',
    roles: [],
    permissions: [],
  },
  currentUserMenu: [],
  message: 0,
}

const StoreModel: ModuleType = {
  namespaced: true,
  name: 'user',
  state: {
    ...initState
  },
  mutations: {
    saveCurrentUser(state, payload) {
      state.currentUser = {
        id: payload.userid,
        name: payload.username,
        avatar: payload.sysUser.icon,
        roles: payload.roles,
        permissions: payload.permissions,
      }
    },
    saveCurrentUserMenu(state, payload){
      state.currentUserMenu = payload
    },
    saveMessage(state, payload) {
      state.message = payload;
    }
  },
  actions: {
    async fetchCurrent({ commit }) {
      try {
        const response: ResponseData = await queryCurrent();
        const { data } = response;

        commit('saveCurrentUser', data || {});
        // console.info("保存当前用户信息saveCurrentUser---",data)
        return true;
      } catch (error) {
        console.info("进来这里---",error)
        return false;
      }
    },
    async fetchCurrentUserMenu({ commit }) {
      try {
        const response: ResponseData = await queryCurrentUserMenu();
        const { data } = response;
        commit('saveCurrentUserMenu', data || {});
        return data;
      } catch (error) {
        return null;
      }
    },
    async fetchMessage({ commit }) {
      try {
        const response: ResponseData = await queryMessage();
        const { data } = response;
        commit('saveMessage', data || 0);
        return true;
      } catch (error) {
        return false;
      }
    },
    async logout({ commit }) {
      try {
        await removeToken();
        return true;
      } catch (error) {
        return false;
      }
    }
  }
}



export default StoreModel;
