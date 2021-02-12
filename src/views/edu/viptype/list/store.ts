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
    assignData, assignTableData,
} from './service';


export interface StateType {
    tableData: TableDataType;
    updateData: Partial<TableListItem>;
    assignData: Partial<TableListItem>;
}

export interface ModuleType extends StoreModuleType<StateType> {
    state: StateType;
    mutations: {
        setTableData: Mutation<StateType>;
        setUpdateData: Mutation<StateType>;
        setAssignData: Mutation<StateType>;
    };
    actions: {
        queryTableData: Action<StateType, StateType>;
        deleteTableData: Action<StateType, StateType>;
        createTableData: Action<StateType, StateType>;
        queryUpdateData: Action<StateType, StateType>;
        updateTableData: Action<StateType, StateType>;
        queryAssignData: Action<StateType, StateType>;
        assignTableData: Action<StateType, StateType>;
    };
}
const initState: StateType = {
    tableData: {
      list: [],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
      },
    },
    updateData: {},
    assignData: {},
};

const StoreModel: ModuleType = {
    namespaced: true,
    name: 'VipTypeListTable',
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
        setAssignData(state, payload) {
            state.assignData = payload;
        },
    },
    actions: {
        async queryTableData({ commit }, payload: TableListQueryParams ) {
            try {
                const response: ResponseData = await queryList(payload);
                const { data,count } = response;
                commit('setTableData',{
                    ...initState.tableData,
                    list: data || [],
                    pagination: {
                      ...initState.tableData.pagination,
                      current: payload.page,
                      total: count || 0,
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
        async createTableData({ commit }, payload: Pick<TableListItem, "name" | "vipMoney" > ) {
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
        async queryAssignData({ commit }, payload: number ) {
            try {
                const response: ResponseData = await assignData(payload);
                const { data } = response;
                console.info("返回值",data)
                commit('setAssignData',{
                    ...initState.assignData,
                    ...data,
                });
                return true;
            } catch (error) {
                return false;
            }
        },
        async assignTableData({ commit }, payload: TableListItem ) {
            try {
                const { id, ...params } = payload;
                await assignTableData(id, { ...params });
                return true;
            } catch (error) {
                return false;
            }
        },
    }
};

export default StoreModel;
