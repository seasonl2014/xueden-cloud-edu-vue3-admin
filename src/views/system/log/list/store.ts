import { Mutation, Action } from 'vuex';
import { StoreModuleType } from "@/utils/store";
import { ResponseData } from '@/utils/request';
import { TableDataType, TableListItem, TableListQueryParams } from './data.d';
import {
  queryList,
  removeData,
  removeBatchData,
} from './service';


export interface StateType {
    tableData: TableDataType;
}

export interface ModuleType extends StoreModuleType<StateType> {
    state: StateType;
    mutations: {
        setTableData: Mutation<StateType>;
    };
    actions: {
        queryTableData: Action<StateType, StateType>;
        deleteTableData: Action<StateType, StateType>;
        deleteBatchTableData: Action<StateType, StateType>;
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
};

const StoreModel: ModuleType = {
    namespaced: true,
    name: 'ListSearchTable',
    state: {
        ...initState
    },
    mutations: {
        setTableData(state, payload) {
            state.tableData = payload;
        },
    },
    actions: {
        async queryTableData({ commit }, payload: TableListQueryParams ) {
            try {
                const response: ResponseData = await queryList(payload);
                console.info("response:",response)
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
        // 删除单条数据
        async deleteTableData({ commit }, payload: number ) {
            try {
                await removeData(payload);
                return true;
            } catch (error) {
                return false;
            }
        },
        // 批量删除数据
        async deleteBatchTableData({ commit }, payload: Array<string> ) {
            console.info("批量删除日志：",payload)
            try {
                await removeBatchData(payload);
                return true;
            } catch (error) {
                return false;
            }
        },
    }
};

export default StoreModel;
