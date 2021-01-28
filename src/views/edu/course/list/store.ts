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
  getParentCategoryList,
} from './service';


export interface StateType {
    tableData: TableDataType;
    updateData: Partial<TableListItem>;
}

export interface ModuleType extends StoreModuleType<StateType> {
    state: StateType;
    mutations: {
        setTableData: Mutation<StateType>;
        setUpdateData: Mutation<StateType>;
    };
    actions: {
        queryTableData: Action<StateType, StateType>;
        deleteTableData: Action<StateType, StateType>;
        createTableData: Action<StateType, StateType>;
        queryUpdateData: Action<StateType, StateType>;
        updateTableData: Action<StateType, StateType>;
        getParentCategoryList: Action<StateType, StateType>;
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
};

const StoreModel: ModuleType = {
    namespaced: true,
    name: 'ListCourseTable',
    state: {
        ...initState
    },
    mutations: {
        setTableData(state, payload) {
            state.tableData = payload;
        },
        setUpdateData(state, payload) {
            console.info("关闭课时列表payload:",payload)
            state.updateData = payload;
        },
    },
    actions: {
        // 获取课程列表数据
        async queryTableData({ commit }, payload: TableListQueryParams ) {
            try {
                const response: ResponseData = await queryList(payload);
                const { data,count } = response;
                //console.info("课程管理数据：",data)
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
        // 删除课程数据
        async deleteTableData({ commit }, payload: number ) {
            try {
                await removeData(payload);
                return true;
            } catch (error) {
                return false;
            }
        },
        // 新增课程分类数据
        async createTableData({ commit }, payload: Pick<TableListItem, "title" | "shortTitle" | "courseType" | "difficulty" > ) {
            try {
                const response: ResponseData = await createData(payload);
                return response;
            } catch (error) {
                return null;
            }
        },
        // 获取需要更新的课程数据
        async queryUpdateData({ commit }, payload: number ) {
            try {
                const response: ResponseData = await detailData(payload);
                const { data } = response;



                /*console.info("封装后的角色数据：",roleList)
                console.info("获取课程所具有的角色数据：",data.roleIds)*/

                commit('setUpdateData',{
                    ...initState.updateData,
                    ...data
                });
                return true;
            } catch (error) {
                return false;
            }
        },
        // 更新课程数据
        async updateTableData({ commit }, payload: TableListItem ) {
            try {
                const { id, ...params } = payload;
                await updateData(id, { ...params });
                return true;
            } catch (error) {
                return false;
            }
        },
        // 获取课程分类树形数据
        async getParentCategoryList({ commit }) {
            try {
                const response: ResponseData = await getParentCategoryList();
                const { data } = response;
                return data;
            } catch (error) {
                return null;
            }
        },
    }
};

export default StoreModel;
