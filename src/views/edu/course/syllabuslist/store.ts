import { Mutation, Action } from 'vuex';
import { StoreModuleType } from "@/utils/store";
import { ResponseData } from '@/utils/request';
import { TableDataType, TableListItem, TableListQueryParams } from './data.d';
import {
  queryList,
  removeData,
  createData,
  detailData,
  updateData,
  getPlayAuthData,
  createVideoTableData,
  removeVideoData,
  detailVideoData,
  updateVideoData,
  getUploadPercentData   ,
} from './service';


export interface StateType {
    tableData: TableDataType;
    updateData: Partial<TableListItem>;
    updateVideoData: Partial<TableListItem>;
    playAuth: string;
    uploadPercent: number;
}

export interface ModuleType extends StoreModuleType<StateType> {
    state: StateType;
    mutations: {
        setTableData: Mutation<StateType>;
        setUpdateData: Mutation<StateType>;
        setPlayAuth: Mutation<StateType>;
        setUpdateVideoData: Mutation<StateType>;
        setUploadPercent: Mutation<StateType>;
    };
    actions: {
        queryTableData: Action<StateType, StateType>;
        deleteTableData: Action<StateType, StateType>;
        createTableData: Action<StateType, StateType>;
        queryUpdateData: Action<StateType, StateType>;
        updateTableData: Action<StateType, StateType>;
        getPlayAuthData: Action<StateType, StateType>;
        createVideoTableData: Action<StateType, StateType>;
        deleteVideoTableData: Action<StateType, StateType>;
        queryVideoUpdateData: Action<StateType, StateType>;
        updateVideoTableData: Action<StateType, StateType>;
        getUploadPercentData: Action<StateType, StateType>;
    };
}
const initState: StateType = {
    tableData: {
      list: [],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 5,
        showSizeChanger: true,
        showQuickJumper: true,
      },
    },
    updateData: {},
    updateVideoData: {},
    playAuth: '',
    uploadPercent: 0,
};

const StoreModel: ModuleType = {
    namespaced: true,
    name: 'ListChapterTable',
    state: {
        ...initState
    },
    mutations: {
        setTableData(state, payload) {
            state.tableData = payload;
        },
        setUpdateData(state, payload) {
            state.updateData = payload;
        },
        setPlayAuth(state, payload) {
            state.playAuth = payload.playAuth;
        },
        setUpdateVideoData(state, payload) {

            state.updateVideoData = payload;
            console.info("state.updateVideoData:",state.updateVideoData)
        },
        setUploadPercent(state, payload) {
            state.uploadPercent = payload.uploadPercent;
        },
    },
    actions: {
        async queryTableData({ commit }, payload: TableListQueryParams ) {
            try {
                const response: ResponseData = await queryList(payload);
                const { data } = response;
                commit('setTableData',{
                    ...initState.tableData,
                    list: data.rows || [],
                    pagination: {
                      ...initState.tableData.pagination,
                      current: payload.page,
                      total: data.total || 0,
                    },
                });
                return true;
            } catch (error) {
                return false;
            }
        },
        async deleteTableData({ commit }, payload: number ) {
            try {
                await removeData(payload);
                return true;
            } catch (error) {
                return false;
            }
        },
        async createTableData({ commit }, payload: Pick<TableListItem, "title" | "sort" | "courseId"> ) {
            try {
                await createData(payload);
                return true;
            } catch (error) {
                return false;
            }
        },
        async queryUpdateData({ commit }, payload: number ) {
            try {
                const response: ResponseData = await detailData(payload);
                const { data } = response;
                commit('setUpdateData',{
                    ...initState.updateData,
                    ...data,
                });
                return true;

            } catch (error) {
                return false;
            }
        },
        async updateTableData({ commit }, payload: TableListItem ) {
            try {
                const { id, ...params } = payload;
                await updateData(id, { ...params });
                return true;
            } catch (error) {
                return false;
            }
        },
        async getPlayAuthData({ commit }, payload: string ) {
            try {
                const response: ResponseData = await getPlayAuthData(payload);
                const { data,success } = response;
                console.log('success---:',success)
                if(success){
                    commit('setPlayAuth',{
                        ...data
                    });
                    return true;
                }else {
                    return false;
                }

            } catch (error) {
                return false;
            }
        },
        async createVideoTableData({ commit }, payload: Pick<TableListItem, "title" | "sort" | "courseId"> ) {
            try {
                await createVideoTableData(payload);
                return true;
            } catch (error) {
                return false;
            }
        },
        async deleteVideoTableData({ commit }, payload: number ) {
            try {
                await removeVideoData(payload);
                return true;
            } catch (error) {
                return false;
            }
        },
        async queryVideoUpdateData({ commit }, payload: number ) {
            try {
                const response: ResponseData = await detailVideoData(payload);
                const { data } = response;
                commit('setUpdateVideoData',{
                    ...initState.updateVideoData,
                    ...data,
                });
                return true;

            } catch (error) {
                return false;
            }
        },
        async updateVideoTableData({ commit }, payload: TableListItem ) {
            try {
                const { id, ...params } = payload;
                await updateVideoData(id, { ...params });
                return true;
            } catch (error) {
                return false;
            }
        },
        async getUploadPercentData({ commit }, payload: string ) {
            try {
                const response: ResponseData = await getUploadPercentData(payload);
                const { data,success } = response;
                console.log('success---:',success)
                if(success){
                    commit('setUploadPercent',{
                        ...data
                    });
                    return response;
                }else {
                    return null;
                }

            } catch (error) {
                return false;
            }
        },
    }
};

export default StoreModel;
