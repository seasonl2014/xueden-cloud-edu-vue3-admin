import { Mutation, Action } from 'vuex';
import { StoreModuleType } from "@/utils/store";
import { ResponseData } from '@/utils/request';
import {
    dailynewUsers,
    dailynewRole,
    dailynewMenu,
    annualnewLinks,
    dailynewLogs,
    pvprovinceQueryList
} from './service';
import {
    UserChartDataType,
    RoleChartDataType,
    MenuChartDataType,
    LinksChartDataType,
    MapChartDataType,
    LogsChartDataType,
} from './data.d';

export interface StateType {
  userChartData: UserChartDataType;
  roleChartData: RoleChartDataType;
  menuChartData: MenuChartDataType;
  logsChartData: LogsChartDataType;
  linksChartData: LinksChartDataType;
  mapChartData: MapChartDataType;

}

export interface ModuleType extends StoreModuleType<StateType> {
    state: StateType;
    mutations: {
        setUserChartData: Mutation<StateType>;
        setRoleChartData: Mutation<StateType>;
        setMenuChartData: Mutation<StateType>;
        setLogsChartData: Mutation<StateType>;
        setLinksChartData: Mutation<StateType>;
        setMapChartData: Mutation<StateType>;
    };
    actions: {
        queryUserChartData: Action<StateType, StateType>;
        queryRoleChartData: Action<StateType, StateType>;
        queryMenuChartData: Action<StateType, StateType>;
        queryLogsChartData: Action<StateType, StateType>;
        queryLinksChartData: Action<StateType, StateType>;
        queryMapChartData: Action<StateType, StateType>;
    };
}

const initState: StateType = {
    userChartData: {
       count: 0
    },
    roleChartData: {
      count: 0
    },
    menuChartData: {
      count: 0,
    },
    logsChartData: {
        count: 0,
    },
    linksChartData: {
      chart: {
        day: [],
        num: [],
      },
    },
    mapChartData: {
        pv: []
    },

};

const StoreModel: ModuleType = {
    namespaced: true,
    name: 'Home',
    state: {
        ...initState
    },
    mutations: {
        setUserChartData(state, payload) {
            state.userChartData = payload;
        },
        setRoleChartData(state, payload) {
            state.roleChartData = payload;
        },
        setMenuChartData(state, payload) {
            state.menuChartData = payload;
        },
        setLogsChartData(state, payload) {
            state.logsChartData = payload;
        },
        setLinksChartData(state, payload) {
          /*  console.info("payload------------",payload.chart.pastDaysList)
            console.info("payload------------",payload.chart.pv)*/
                state.linksChartData.chart.day = payload.chart.pastDaysList;
                state.linksChartData.chart.num = payload.chart.pv;
        },
        setMapChartData(state, payload) {
            state.mapChartData = payload;
            //console.info("mapChartData------------",payload.pv)
        },
    },
    actions: {
        async queryUserChartData({ commit }) {
            try {
                const response: ResponseData = await dailynewUsers();
                const { count } = response;
                commit('setUserChartData', {
                    ...initState.userChartData,
                    count,
                });
                return true;
            } catch (error) {
                return false;
            }
        },
        async queryRoleChartData({ commit }) {
            try {
                const response: ResponseData = await dailynewRole();
                const { count } = response;
                commit('setRoleChartData', {
                    ...initState.roleChartData,
                    count,
                });
                return true;
            } catch (error) {
                return false;
            }
        },
        async queryMenuChartData({ commit }) {
            try {
                const response: ResponseData = await dailynewMenu();
                const { data } = response;
                commit('setMenuChartData', {
                    ...initState.menuChartData,
                    count: data.menuCount,
                });
                return true;
            } catch (error) {
                return false;
            }
        },

        async queryLogsChartData({ commit }) {
            try {
                const response: ResponseData = await dailynewLogs();
                const { count } = response;
                commit('setLogsChartData', {
                    ...initState.logsChartData,
                    count:count,
                });
                return true;
            } catch (error) {
                return false;
            }
        },

        async queryLinksChartData({ commit }) {
            try {
                const response: ResponseData = await annualnewLinks();
                const { data } = response;
                commit('setLinksChartData', {
                    ...initState.linksChartData,
                    chart:data,
                });
                return true;
            } catch (error) {
                return false;
            }
        },


        async queryMapChartData({ commit }) {
            try {
                const response: ResponseData = await pvprovinceQueryList();
                const { data } = response;
                commit('setMapChartData',{
                    ...initState.mapChartData,
                    pv: data.pv || [],
                })
                return true;
            } catch (error) {
                return false;
            }
        },



    }
}

export default StoreModel;
