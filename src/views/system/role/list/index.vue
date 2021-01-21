<template>
    <div class="indexlayout-main-conent">

      <el-row :gutter="15">
        <!--角色管理-->
        <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="17" style="margin-bottom: 10px">
        <el-card shadow="never" class="cus-card">
          <template #header>
              <el-row>
                    <el-col :span="8">
                        <el-button v-permission="'sys:role:add'" type="primary" @click="() => setCreateFormVisible(true)">新增</el-button>
                    </el-col>
                    <el-col :span="16" class="text-align-right">
                        <el-input v-model="searchVal" style="width:200px;margin-left: 16px;" placeholder="请输入角色名称">
                            <template #suffix>
                                <i class="el-input__icon el-icon-search cursor-pointer" @click="searchSubmit"></i>
                            </template>
                        </el-input>
                    </el-col>
            </el-row>
          </template>


            <el-table
                row-key="id"
                :data="list"
                v-loading="loading"
                @current-change="handleCurrentChange"
            >

                <el-table-column
                    type="index"
                    label="序号"
                    :index="(index) => {
                        return (pagination.current - 1) * pagination.pageSize + index + 1;
                    }"
                    width="80">
                </el-table-column>

                <el-table-column
                    label="角色名称"
                    prop="name">
                </el-table-column>

                <el-table-column
                    label="备注"
                    prop="remarks">
                </el-table-column>

              <el-table-column
                  label="状态"
                  prop="createId">
                <template #default="{row}">
                  <el-tag v-if="!row.delFlag" type="success">正常</el-tag>
                  <el-tag v-else type="warning">禁用</el-tag>
                </template>
              </el-table-column>

              <el-table-column
                  label="创建时间"
                  prop="createDate">
              </el-table-column>

              <el-table-column
                  label="更新时间"
                  prop="updateDate">
              </el-table-column>

                <el-table-column
                    label="操作"
                    prop="action"
                    width="150">
                    <template #default="{row}">
                        <el-button v-permission="'sys:role:edit'" type="text" @click="() => detailUpdateData(row.id)" :loading="detailUpdateLoading.includes(row.id)">编辑</el-button>
                        <el-button v-permission="'sys:role:delete'" type="text"  @click="() => deleteTableData(row.id)" :loading="deleteLoading.includes(row.id)">删除</el-button>
                    </template>
                </el-table-column>

            </el-table>

            <div class="padding-t10 text-align-right">
                <el-pagination
                    background
                    layout="prev, pager, next"
                    v-model:current-page="pagination.current"
                    :page-size="pagination.pageSize"
                    :total="pagination.total"
                    @current-change="(p) => {
                        getList(p || 1);
                    }">
                </el-pagination>
            </div>


            <create-form
                :visible="createFormVisible"
                :onCancel="() => setCreateFormVisible(false)"
                :onSubmitLoading="createSubmitLoading"
                :onSubmit="createSubmit"
            />

            <update-form
                v-if="updateFormVisible===true"
                :visible="updateFormVisible"
                :values="updateData"
                :onCancel="() => updateFormCancel()"
                :onSubmitLoading="updateSubmitLoading"
                :onSubmit="updateSubmit"
            />


        </el-card>
        </el-col>
        <!-- 菜单授权 -->
        <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="7">
          <el-card class="box-card" shadow="never">
            <template #header>
              <el-tooltip class="item" effect="dark" content="选择指定角色分配菜单" placement="top">
                <span class="role-span">菜单分配</span>
              </el-tooltip>
              <el-button v-permission="'sys:role:edit'"
                  type="primary"
                  style="float: right; padding: 6px 9px"
                  @click="saveMenuSubmit"
                  :loading="saveMenuSubmitLoading"
                 >保存</el-button>
            </template>
            <el-tree
                :ref="setMenuRef"
                :data="menus"
                :default-expanded-keys="menuIds"
                :default-checked-keys="menuIds"
                check-strictly
                accordion
                show-checkbox
                node-key="id"
            />
          </el-card>
        </el-col>
      </el-row>
    </div>
</template>
<script lang="ts">
import { computed, defineComponent, onMounted, ref,reactive  } from "vue";
import { useStore } from "vuex";
import { ElMessageBox, ElMessage } from "element-plus";
import CreateForm from './components/CreateForm.vue';
import UpdateForm from './components/UpdateForm.vue';
import { StateType as ListStateType } from "./store";
import { PaginationConfig, TableListItem,RoleMenusDataItem } from './data.d';
import {ResponseData} from "@/utils/request";
import vPermission from '@/directives/permission';
interface ListTablePageSetupData {
    list: TableListItem[];
    pagination: PaginationConfig;
    loading: boolean;
    getList:  (current: number) => Promise<void>;
    getMenusList:  () => Promise<void>;
    createFormVisible: boolean;
    setCreateFormVisible:  (val: boolean) => void;
    createSubmitLoading: boolean;
    createSubmit: (values: Omit<TableListItem, 'id'>, resetFields: () => void) => Promise<void>;
    detailUpdateLoading: number[];
    detailUpdateData: (id: number) => Promise<void>;
    updateData: Partial<TableListItem>;
    updateFormVisible: boolean;
    updateFormCancel:  () => void;
    updateSubmitLoading: boolean;
    updateSubmit:  (values: TableListItem, resetFields: () => void) => Promise<void>;
    deleteLoading: number[];
    deleteTableData:  (id: number) => void;
    menus: object[];
    menuIds: string[];
    handleCurrentChange: (val: object) => Promise<void>;
    setMenuRef: (val: object) => void;
    roleId: number;
    saveMenuSubmit: (values: RoleMenusDataItem, resetFields: () => void) => Promise<void>;
    saveMenuSubmitLoading: boolean;
    menuModelRef: RoleMenusDataItem;
    searchSubmit: () => Promise<void>;
    searchVal: string;
}

export default defineComponent({
    name: 'ListTablePage',
    components: {
        CreateForm,
        UpdateForm
    },
    directives: {
      permission: vPermission
    },
    setup(): ListTablePageSetupData {
      // 定义搜索关键词
      const searchVal = ref<string>('');
        const store = useStore<{ ListTable: ListStateType}>();

      const menuModelRef = reactive<RoleMenusDataItem>({
        roleId: 0,
        menuIds: []
      });


        // 列表数据
        const list = computed<TableListItem[]>(() => store.state.ListTable.tableData.list);

        // 列表分页
        const pagination = computed<PaginationConfig>(() => store.state.ListTable.tableData.pagination);

        // 获取数据
        const loading = ref<boolean>(true);
        const getList = async (current: number): Promise<void> => {
            loading.value = true;
            await store.dispatch('ListTable/queryTableData', {
                per: pagination.value.pageSize,
                page: current,
                s_key: searchVal.value
            });
            loading.value = false;
        }

      // 搜索
      const searchSubmit = async () => {
        await getList(1);
      }

        // 获取菜单数据
      const menus = computed<object[]>(() => store.state.ListTable.menusData.menusList);
      console.info("index组件页面获取封装后的菜单数据：",menus.value)
      const getMenusList = async (): Promise<void> => {
        await store.dispatch('ListTable/queryMenusTableData', {});
      }


      // 角色所具有的权限数据
      // 选中角色ID
      const roleId = ref<number>(0);
      const menuIds = computed<string[]>(() => store.state.ListTable.menusData.menuIds);
      // console.info("index组件页面获取封装后的角色具有菜单数据：",menuIds.value)

      //  拿到树形组件dom对象
      let menuRef: any;
      const setMenuRef = (el: object) => {
        menuRef = el;
      }

      // 触发单选事件
     const handleCurrentChange = async (val: any): Promise<void> => {
       // 清空树形菜单的选中
       menuRef.setCheckedKeys([])
       // 保存当前的角色id
       roleId.value = val.id
       // console.info("当前角色ID：",val.id)
       // 根据角色Id获取角色所具有的菜单
       await store.dispatch('ListTable/queryRoleMenusTableData',val.id );
     }
     // 保存角色菜单数据
      // 保存角色菜单数据 - 提交 loading
      const saveMenuSubmitLoading = ref<boolean>(false);
      const saveMenuSubmit = async () => {
        saveMenuSubmitLoading.value = true
        // 获取角色ID
        menuModelRef.roleId = roleId.value
        // 获取选择菜单ID
        menuModelRef.menuIds = menuRef.getCheckedKeys()
        const res: boolean = await store.dispatch('ListTable/saveMenuData',menuModelRef);
        if(res === true) {
          ElMessage.success('角色授权成功！');
        }
        saveMenuSubmitLoading.value = false
      }

        // 新增弹框 - visible
        const createFormVisible = ref<boolean>(false);
        const setCreateFormVisible = (val: boolean) => {
            createFormVisible.value = val;
        };
        // 新增弹框 - 提交 loading
        const createSubmitLoading = ref<boolean>(false);
        // 新增弹框 - 提交
        const createSubmit = async (values: Omit<TableListItem, 'id'>, resetFields: () => void) => {
            createSubmitLoading.value = true;
          const response: ResponseData = await store.dispatch('ListTable/createTableData',values);
          const { code, success, message } = response;
          console.info("新增角色返回数据：",response)
            if(success === true) {
                resetFields();
                setCreateFormVisible(false);
                ElMessage.success('新增成功！');
                await getList(1);
               createSubmitLoading.value = false;
            }else {
              ElMessage.error(message);
            }

        }


        // 编辑弹框 - visible
        const updateFormVisible = ref<boolean>(false);
        const setUpdateFormVisible = (val: boolean) => {
            updateFormVisible.value = val;
        }
        const updateFormCancel = () => {
            setUpdateFormVisible(false);
            store.commit('ListTable/setUpdateData',{});
        }
        // 编辑弹框 - 提交 loading
        const updateSubmitLoading = ref<boolean>(false);
        // 编辑弹框 - 提交
        const updateSubmit = async (values: TableListItem, resetFields: () => void) => {
            updateSubmitLoading.value = true;
            const response: ResponseData = await store.dispatch('ListTable/updateTableData',values);
          const { code, success, message } = response;
            if(success === true) {
                updateFormCancel();
                ElMessage.success('编辑成功！');
                await getList(pagination.value.current);

            }else {
              ElMessage.error(message);
            }
          updateSubmitLoading.value = false;
        }

        // 编辑弹框 data
        const updateData = computed<Partial<TableListItem>>(() => store.state.ListTable.updateData);
        const detailUpdateLoading = ref<number[]>([]);
        const detailUpdateData = async (id: number) => {
            detailUpdateLoading.value = [id];
            const res: boolean = await store.dispatch('ListTable/queryUpdateData',id);
            if(res===true) {
                setUpdateFormVisible(true);
            }
            detailUpdateLoading.value = [];
        }


        // 删除 loading
        const deleteLoading = ref<number[]>([]);
        // 删除
        const deleteTableData = (id: number) => {

            ElMessageBox.confirm('确定删除吗？', '删除',{
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(async () => {
                deleteLoading.value = [id];
                const res: boolean = await store.dispatch('ListTable/deleteTableData',id);
                if (res === true) {
                    ElMessage.success('删除成功！');
                    getList(pagination.value.current);
                }
                deleteLoading.value = [];
            }).catch((error: any) =>{
                console.log(error)
            });

        }



        onMounted(()=> {
           getList(1);
           getMenusList();
        })

        return {
            list: list as unknown as TableListItem[],
            pagination: pagination as unknown as PaginationConfig,
            loading: loading as unknown as boolean,
            getList,
            getMenusList,
            createFormVisible: createFormVisible as unknown as boolean,
            setCreateFormVisible,
            createSubmitLoading: createSubmitLoading as unknown as boolean,
            createSubmit,
            detailUpdateLoading: detailUpdateLoading as unknown as number[],
            detailUpdateData,
            updateData: updateData as Partial<TableListItem>,
            updateFormVisible: updateFormVisible as unknown as boolean,
            updateFormCancel,
            updateSubmitLoading: updateSubmitLoading as unknown as boolean,
            updateSubmit,
            deleteLoading: deleteLoading as unknown as number[],
            deleteTableData,
            menus:menus as unknown as object[],
            menuIds: menuIds as unknown as string[],
            handleCurrentChange,
            setMenuRef,
            roleId: roleId as unknown as number,
            saveMenuSubmit,
            saveMenuSubmitLoading: saveMenuSubmitLoading as unknown as boolean,
            menuModelRef,
            searchVal: searchVal as unknown as string,
            searchSubmit,

        }

    }
})
</script>
