<template>

    <screen-table
        class="indexlayout-main-conent"
        row-key="id"
        :data="list"
        :loading="loading"
        :pagination="{
            ...pagination,
            onChange: (page) => {
                getList(page);
            }
        }"
    >

        <template #header>
            <el-row>
                    <el-col :span="8">
                        <el-button v-permission="'edu:viptype:add'" type="primary" @click="() => setCreateFormVisible(true)">新增</el-button>
                    </el-col>
                    <el-col :span="16" class="text-align-right">
                        <el-input v-model="searchVal" style="width:200px;margin-left: 16px;" placeholder="请输入搜索内容">
                            <template #suffix>
                                <i class="el-input__icon el-icon-search cursor-pointer" @click="searchSubmit"></i>
                            </template>
                        </el-input>
                      <!--  <el-button style="margin-left: 8px"  @click="() => searchDrawerVisible = true">高级搜索</el-button>-->
                    </el-col>
            </el-row>
        </template>


        <el-table-column
            type="index"
            label="序号"
            :index="(index) => {
                return (pagination.current - 1) * pagination.pageSize + index + 1;
            }"
            width="80">
        </el-table-column>

        <el-table-column
            label="会员名称"
            prop="name">
            <template #default="{row}">
                <a :href="row.href" target="_blank">{{row.name}}</a>
            </template>
        </el-table-column>

        <el-table-column
            label="会员价格"
            prop="vipMoney">
          <template #default="scope">
            <el-tag type="success" effect="plain" v-text="'￥'+scope.row.vipMoney" size="mini">
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column
            label="会员人数"
            prop="memberTotal">
            <template #default="scope">
              <el-tag effect="plain" v-text="scope.row.memberTotal+'人'" size="mini">
              </el-tag>
            </template>
        </el-table-column>

        <el-table-column
            label="操作"
            prop="action"
            width="150">
            <template #default="{row}">
                <el-button v-permission="'edu:viptype:edit'" type="text" @click="() => detailUpdateData(row.id)" :loading="detailUpdateLoading.includes(row.id)">编辑</el-button>
                <el-button v-permission="'edu:viptype:delete'" type="text"  @click="() => deleteTableData(row.id)" :loading="deleteLoading.includes(row.id)">删除</el-button>
              <el-tooltip
                  class="item"
                  effect="dark"
                  content="分配权益"
                  placement="top"
                  :enterable="false"
              >
                <el-button
                    v-permission="'edu:viptype:assign'"
                    type="text"
                    size="mini"
                    @click="assignVipTypeDate(row.id)"
                    :loading="assignVipTypeLoading.includes(row.id)"
                >分配</el-button>
              </el-tooltip>
            </template>
        </el-table-column>


    </screen-table>

   <!--创建会员类型-->
    <create-form
        :visible="createFormVisible"
        :onCancel="() => setCreateFormVisible(false)"
        :onSubmitLoading="createSubmitLoading"
        :onSubmit="createSubmit"
    />

   <!--更新会员类型-->
    <update-form
        v-if="updateFormVisible===true"
        :visible="updateFormVisible"
        :values="updateData"
        :onCancel="() => updataFormCancel()"
        :onSubmitLoading="updateSubmitLoading"
        :onSubmit="updateSubmit"
    />

  <!--分配权益-->
    <assign-form
        v-if="assignFormVisible===true"
        :visible="assignFormVisible"
        :values="assignData"
        :onCancel="() => assignFormCancel()"
        :onSubmitLoading="updateSubmitLoading"
        :onSubmit="assignSubmit"
    />

    <search-drawer
        :visible="searchDrawerVisible"
        :onClose="() => searchDrawerClose()"
        :onSubmit="searchDrawerSubmit"
    />



</template>
<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";
import { useStore } from "vuex";
import { ElMessageBox, ElMessage } from "element-plus";
import ScreenTable from '@/components/ScreenTable/index.vue';
import CreateForm from './components/CreateForm.vue';
import UpdateForm from './components/UpdateForm.vue';
import AssignForm from './components/AssignForm.vue';
import SearchDrawer from './components/SearchDrawer.vue';
import { StateType as ListStateType } from "./store";
import { PaginationConfig, TableListItem } from './data.d';
import vPermission from '@/directives/permission';
interface VipTypeListTablePageSetupData {
    list: TableListItem[];
    pagination: PaginationConfig;
    loading: boolean;
    getList:  (current: number) => Promise<void>;
    createFormVisible: boolean;
    setCreateFormVisible:  (val: boolean) => void;
    createSubmitLoading: boolean;
    createSubmit: (values: Omit<TableListItem, 'id'>, resetFields: () => void) => Promise<void>;
    detailUpdateLoading: number[];
    detailUpdateData: (id: number) => Promise<void>;
    assignVipTypeDate: (id: number) => Promise<void>;
    assignVipTypeLoading: number[];
    updateData: Partial<TableListItem>;
    assignData: Partial<TableListItem>;
    updateFormVisible: boolean;
    assignFormVisible: boolean;
    updataFormCancel:  () => void;
    assignFormCancel:  () => void;
    assignSubmitLoading: boolean;
    assignSubmit:  (values: TableListItem, resetFields: () => void) => Promise<void>;
    updateSubmitLoading: boolean;
    updateSubmit:  (values: TableListItem, resetFields: () => void) => Promise<void>;
    deleteLoading: number[];
    deleteTableData:  (id: number) => void;
    tabVal: string;
    searchVal: string;
    searchDrawerVisible: boolean;
    searchDrawerClose: () => void;
    searchDrawerSubmit: (values: Omit<TableListItem, 'id'>) => Promise<void>;
    searchSubmit: () => Promise<void>;
}

export default defineComponent({
    name: 'VipTypeListTablePage',
    components: {
        ScreenTable,
        CreateForm,
        UpdateForm,
        SearchDrawer,
        AssignForm
    },
    directives: {
      permission: vPermission
    },
    setup(): VipTypeListTablePageSetupData {

        const store = useStore<{ VipTypeListTable: ListStateType}>();


        // 列表数据
        const list = computed<TableListItem[]>(() => store.state.VipTypeListTable.tableData.list);

        // 列表分页
        const pagination = computed<PaginationConfig>(() => store.state.VipTypeListTable.tableData.pagination);

        // 获取数据
        const loading = ref<boolean>(true);
        const getList = async (current: number): Promise<void> => {
            loading.value = true;
            await store.dispatch('VipTypeListTable/queryTableData', {
                per: pagination.value.pageSize,
                page: current,
                name: searchVal.value
            });
            loading.value = false;
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
            const res: boolean = await store.dispatch('VipTypeListTable/createTableData',values);
            if(res === true) {
                resetFields();
                setCreateFormVisible(false);
                ElMessage.success('新增成功！');
                await getList(1);
            }
            createSubmitLoading.value = false;
        }


        // 编辑弹框 - visible
        const updateFormVisible = ref<boolean>(false);
        const setUpdateFormVisible = (val: boolean) => {
            updateFormVisible.value = val;
        }
        const updataFormCancel = () => {
            setUpdateFormVisible(false);
            store.commit('VipTypeListTable/setUpdateData',{});
        }
        // 编辑弹框 - 提交 loading
        const updateSubmitLoading = ref<boolean>(false);
        // 编辑弹框 - 提交
        const updateSubmit = async (values: TableListItem, resetFields: () => void) => {
            updateSubmitLoading.value = true;
            const res: boolean = await store.dispatch('VipTypeListTable/updateTableData',values);
            if(res === true) {
                updataFormCancel();
                ElMessage.success('编辑成功！');
                await getList(pagination.value.current);
            }
            updateSubmitLoading.value = false;
        }

        // 编辑弹框 data
        const updateData = computed<Partial<TableListItem>>(() => store.state.VipTypeListTable.updateData);
        const detailUpdateLoading = ref<number[]>([]);
        const detailUpdateData = async (id: number) => {
            detailUpdateLoading.value = [id];
            const res: boolean = await store.dispatch('VipTypeListTable/queryUpdateData',id);
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
                const res: boolean = await store.dispatch('VipTypeListTable/deleteTableData',id);
                if (res === true) {
                    ElMessage.success('删除成功！');
                    getList(pagination.value.current);
                }
                deleteLoading.value = [];
            }).catch((error: any) =>{
                console.log(error)
            });

        }

        // 给会员类型分配权益
      const assignFormVisible = ref<boolean>(false);
      const setAssignFormVisible = (val: boolean) => {
        console.info("返回值val:",val)
        assignFormVisible.value = val;
      }
      const assignFormCancel = () => {
        setAssignFormVisible(false);
        store.commit('VipTypeListTable/setAssignData',{});
      }
      const assignData = computed<Partial<TableListItem>>(() => store.state.VipTypeListTable.assignData);
      const assignVipTypeLoading = ref<number[]>([]);
      const assignVipTypeDate = async (id: number) => {
        assignVipTypeLoading.value = [id];
        const res: boolean = await store.dispatch('VipTypeListTable/queryAssignData',id);

        if(res===true) {
          setAssignFormVisible(true);
        }
        assignVipTypeLoading.value = [];
      }

      // 分配权益弹框 - 提交 loading
      const assignSubmitLoading = ref<boolean>(false);
      // 分配权益弹框 - 提交
      const assignSubmit = async (values: TableListItem, resetFields: () => void) => {
        assignSubmitLoading.value = true;
        const res: boolean = await store.dispatch('VipTypeListTable/assignTableData',values);
        if(res === true) {
          assignFormCancel();
          ElMessage.success('分配权益成功！');
          await getList(pagination.value.current);
        }
        assignSubmitLoading.value = false;
      }


        const tabVal = ref<string>('all');
        const searchVal = ref<string>('');

        // 搜索
        const searchDrawerVisible = ref<boolean>(false);
        const searchDrawerClose = () => {
            searchDrawerVisible.value = false;
        }
        const searchDrawerSubmit = async (values: Omit<TableListItem, 'id'>) => {
            console.log('search', values);
            ElMessage.success('进行了搜索！');
            searchDrawerClose();
        }

      // 搜索
      const searchSubmit = async () => {
        await getList(1);
      }
        onMounted(()=> {
           getList(1);
        })

        return {
            list: list as unknown as TableListItem[],
            pagination: pagination as unknown as PaginationConfig,
            loading: loading as unknown as boolean,
            getList,
            searchSubmit,
            createFormVisible: createFormVisible as unknown as boolean,
            setCreateFormVisible,
            createSubmitLoading: createSubmitLoading as unknown as boolean,
            createSubmit,
            detailUpdateLoading: detailUpdateLoading as unknown as number[],
            detailUpdateData,
            updateData: updateData as Partial<TableListItem>,
            updateFormVisible: updateFormVisible as unknown as boolean,
            updataFormCancel,
            updateSubmitLoading: updateSubmitLoading as unknown as boolean,
            updateSubmit,
            assignVipTypeLoading: assignVipTypeLoading as unknown as number[],
            assignVipTypeDate,
            assignFormCancel,
            assignSubmit,
            assignSubmitLoading: assignSubmitLoading as unknown as boolean,
            assignFormVisible: assignFormVisible as unknown as boolean,
            assignData: assignData as Partial<TableListItem>,
            deleteLoading: deleteLoading as unknown as number[],
            deleteTableData,
            tabVal: tabVal as unknown as string,
            searchVal: searchVal as unknown as string,
            searchDrawerVisible: searchDrawerVisible as unknown as boolean,
            searchDrawerClose,
            searchDrawerSubmit
        }

    }
})
</script>
