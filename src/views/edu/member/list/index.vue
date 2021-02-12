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
                      <!--  <el-button type="primary" @click="() => setCreateFormVisible(true)">新增</el-button>-->
                    </el-col>
                    <el-col :span="16" class="text-align-right">
                        <el-input v-model="searchVal" style="width:200px;margin-left: 16px;" placeholder="请输入搜索内容">
                            <template #suffix>
                                <i class="el-input__icon el-icon-search cursor-pointer" @click="searchSubmit"></i>
                            </template>
                        </el-input>
                       <!-- <el-button style="margin-left: 8px"  @click="() => searchDrawerVisible = true">高级搜索</el-button>-->
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

      <el-table-column  label="头像" sortable width="120">
        <template #default="scope">
          <img class="avatar" :src="scope.row.avatar" alt="scope.row.nickname" width="150px">
        </template>
      </el-table-column>

      <el-table-column prop="vipType" label="会员类型" sortable width="120">
        <template #default="scope">
          <el-tag type="success"  effect="plain" v-text="scope.row.vipType"  size="mini">
          </el-tag>
        </template>
      </el-table-column>

        <el-table-column
            label="手机号"
            prop="mobile">
            <template #default="{row}">
                <a :href="row.mobile" target="_blank">{{row.mobile}}</a>
            </template>
        </el-table-column>

      <el-table-column prop="isTeacher" label="是否讲师" width="120">
        <template #default="scope">
          <el-tag type="success" v-if="scope.row.isTeacher===1" effect="plain"  size="mini">
            是
          </el-tag>
          <el-tag type="info" v-else effect="plain"  size="mini">
            否
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="sex" label="性别" sortable width="80">
        <template #default="scope">
          <el-tag type="success" v-if="scope.row.sex===1" effect="plain"  size="mini">
            女
          </el-tag>
          <el-tag type="info" v-else effect="plain"  size="mini">
            男
          </el-tag>
        </template>
      </el-table-column>

        <el-table-column
            label="会员昵称"
            prop="nickname">
        </el-table-column>

        <el-table-column
            label="状态"
            prop="type">
            <template #default="{row}">
                <el-tag v-if="!row.delFlag" type="success">正常</el-tag>
                <el-tag v-else type="warning">禁用</el-tag>
            </template>
        </el-table-column>

        <el-table-column
            label="操作"
            prop="action"
            width="150">
            <template #default="{row}">
                <!--<el-button type="text" @click="() => detailUpdateData(row.id)" :loading="detailUpdateLoading.includes(row.id)">编辑</el-button>-->
                <el-button type="text"  @click="() => deleteTableData(row.id)" :loading="deleteLoading.includes(row.id)">删除</el-button>
            </template>
        </el-table-column>


    </screen-table>


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
        :onCancel="() => updataFormCancel()"
        :onSubmitLoading="updateSubmitLoading"
        :onSubmit="updateSubmit"
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
import SearchDrawer from './components/SearchDrawer.vue';
import { StateType as ListStateType } from "./store";
import { PaginationConfig, TableListItem } from './data.d';

interface ListMemberTablePageSetupData {
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
    updateData: Partial<TableListItem>;
    updateFormVisible: boolean;
    updataFormCancel:  () => void;
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
    name: 'ListMemberTablePage',
    components: {
        ScreenTable,
        CreateForm,
        UpdateForm,
        SearchDrawer
    },
    setup(): ListMemberTablePageSetupData {

        const store = useStore<{ ListMemberTable: ListStateType}>();


        // 列表数据
        const list = computed<TableListItem[]>(() => store.state.ListMemberTable.tableData.list);

        // 列表分页
        const pagination = computed<PaginationConfig>(() => store.state.ListMemberTable.tableData.pagination);

        // 获取数据
        const loading = ref<boolean>(true);
        const getList = async (current: number): Promise<void> => {
            loading.value = true;
            await store.dispatch('ListMemberTable/queryTableData', {
                per: pagination.value.pageSize,
                page: current,
                mobile: searchVal.value
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
            const res: boolean = await store.dispatch('ListMemberTable/createTableData',values);
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
            store.commit('ListMemberTable/setUpdateData',{});
        }
        // 编辑弹框 - 提交 loading
        const updateSubmitLoading = ref<boolean>(false);
        // 编辑弹框 - 提交
        const updateSubmit = async (values: TableListItem, resetFields: () => void) => {
            updateSubmitLoading.value = true;
            const res: boolean = await store.dispatch('ListMemberTable/updateTableData',values);
            if(res === true) {
                updataFormCancel();
                ElMessage.success('编辑成功！');
                getList(pagination.value.current);
            }
            updateSubmitLoading.value = false;
        }

        // 编辑弹框 data
        const updateData = computed<Partial<TableListItem>>(() => store.state.ListMemberTable.updateData);
        const detailUpdateLoading = ref<number[]>([]);
        const detailUpdateData = async (id: number) => {
            detailUpdateLoading.value = [id];
            const res: boolean = await store.dispatch('ListMemberTable/queryUpdateData',id);
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
                const res: boolean = await store.dispatch('ListMemberTable/deleteTableData',id);
                if (res === true) {
                    ElMessage.success('删除成功！');
                    await getList(pagination.value.current);
                }
                deleteLoading.value = [];
            }).catch((error: any) =>{
                console.log(error)
            });

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
<style scoped>
.avatar {
  width: 32px;
  height: 32px;
  overflow: hidden;
  border-radius:50%;
  -webkit-border-radius:50%;
  -moz-border-radius:50%;
}
</style>
