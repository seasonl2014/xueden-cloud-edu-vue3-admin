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
                        <el-button v-permission="'sys:menu:add'" type="primary" @click="createFormGetMenuData">新增</el-button>
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
            label="名称"
            prop="name">
            <template #default="{row}">
                <a :href="row.href" target="_blank">{{row.name}}</a>
            </template>
        </el-table-column>

        <el-table-column
            label="权限标识"
            prop="permission">
        </el-table-column>

      <el-table-column
          label="组件名称"
          prop="componentName">
      </el-table-column>

      <el-table-column
          label="组件路径"
          prop="component">
      </el-table-column>

        <el-table-column
            label="路由地址"
            prop="path">
        </el-table-column>

        <el-table-column
            label="图标"
            prop="svgIcon">
          <template #default="scope">
            <IconSvg :type="scope.row.svgIcon" />
          </template>
        </el-table-column>

        <el-table-column
            label="排序"
            prop="sort">
        </el-table-column>

        <el-table-column
            label="类型"
            prop="type">
            <template #default="{row}">
                <el-tag v-if="-1===row.isMenu" type="success">目录</el-tag>
                <el-tag v-else-if="1===row.isMenu" type="warning">按钮</el-tag>
                <el-tag v-else type="danger">菜单</el-tag>
            </template>
        </el-table-column>

        <el-table-column
            label="操作"
            prop="action"
            width="150">
            <template #default="{row}">
                <el-button v-permission="'sys:menu:edit'" type="text" @click="() => detailUpdateData(row.id)" :loading="detailUpdateLoading.includes(row.id)">编辑</el-button>
                <el-button v-permission="'sys:menu:delete'" type="text"  @click="() => deleteTableData(row.id)" :loading="deleteLoading.includes(row.id)">删除</el-button>
            </template>
        </el-table-column>


    </screen-table>


    <create-form
        v-if="createFormVisible===true"
        :visible="createFormVisible"
        :onCancel="() => setCreateFormVisible(false)"
        :onSubmitLoading="createSubmitLoading"
        :values="menusData"
        :onSubmit="createSubmit"
    />

    <update-form
        v-if="updateFormVisible===true"
        :visible="updateFormVisible"
        :values="updateData"
        :menusData="menusData"
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
import { computed, defineComponent, onMounted, ref,nextTick } from "vue";
import { useStore } from "vuex";
import { ElMessageBox, ElMessage } from "element-plus";
import ScreenTable from '@/components/ScreenTable/index.vue';
import CreateForm from './components/CreateForm.vue';
import UpdateForm from './components/UpdateForm.vue';
import SearchDrawer from './components/SearchDrawer.vue';
import IconSvg from '@/components/IconSvg';
import { StateType as ListStateType } from "./store";
import { PaginationConfig, TableListItem } from './data.d';
import vPermission from '@/directives/permission';
interface MenuListTableSetupData {
    list: TableListItem[];
    menusData: TableListItem[];
    pagination: PaginationConfig;
    loading: boolean;
    getList:  (current: number) => Promise<void>;
    createFormVisible: boolean;
    setCreateFormVisible:  (val: boolean) => void;
    createSubmitLoading: boolean;
    createSubmit: (values: Omit<TableListItem, 'id'>, resetFields: () => void) => Promise<void>;
    detailUpdateLoading: number[];
    detailUpdateData: (id: number) => Promise<void>;
    createFormGetMenuData: () => Promise<void>;
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
}

export default defineComponent({
    name: 'MenuListTable',
    components: {
        ScreenTable,
        CreateForm,
        UpdateForm,
        SearchDrawer,
        IconSvg
    },
    directives: {
      permission: vPermission
    },
    setup(): MenuListTableSetupData {

        const store = useStore<{ MenuListTable: ListStateType}>();

      // 列表分页
      const pagination = computed<PaginationConfig>(() => store.state.MenuListTable.tableData.pagination);

        // 获取数据
        const loading = ref<boolean>(true);
        const getList = async (current: number): Promise<void> => {
            loading.value = true;
            await store.dispatch('MenuListTable/queryTableData', {
                per: pagination.value.pageSize,
                page: current,
            });
            loading.value = false;
        }
      // 列表数据
      const list = computed<TableListItem[]>(() => store.state.MenuListTable.tableData.list);
      // 树形菜单数据
       const menusData = computed<TableListItem[]>(() => store.state.MenuListTable.menuData.menuList);
       // console.info("menusData：",menusData.value)
        // 新增弹框 - visible
        const createFormVisible = ref<boolean>(false);
        const setCreateFormVisible = (val: boolean) => {
            createFormVisible.value = val;
        };

        // 获取菜单
      const createFormGetMenuData = async () => {
        const res: boolean = await store.dispatch('MenuListTable/queryMenuTableData',null);
        if(res===true) {
          setCreateFormVisible(true);
        }
      }


        // 新增弹框 - 提交 loading
        const createSubmitLoading = ref<boolean>(false);
        // 新增弹框 - 提交
        const createSubmit = async (values: Omit<TableListItem, 'id'>, resetFields: () => void) => {
            createSubmitLoading.value = true;
            const res: boolean = await store.dispatch('MenuListTable/createTableData',values);
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
            store.commit('MenuListTable/setUpdateData',{});
        }
        // 编辑弹框 - 提交 loading
        const updateSubmitLoading = ref<boolean>(false);
        // 编辑弹框 - 提交
        const updateSubmit = async (values: TableListItem, resetFields: () => void) => {
            updateSubmitLoading.value = true;
            const res: boolean = await store.dispatch('MenuListTable/updateTableData',values);
            if(res === true) {
                updataFormCancel();
                ElMessage.success('编辑成功！');
                await getList(pagination.value.current);
            }
            updateSubmitLoading.value = false;
        }

        // 编辑弹框 data
        const updateData = computed<Partial<TableListItem>>(() => store.state.MenuListTable.updateData);
        // console.info("获取需要更新的数据updateData：",updateData.value)
        const detailUpdateLoading = ref<number[]>([]);
        const detailUpdateData = async (id: number) => {
            detailUpdateLoading.value = [id];
            const res: boolean = await store.dispatch('MenuListTable/queryUpdateData',id);
            const menuRes: boolean = await store.dispatch('MenuListTable/queryMenuTableData',null);
            if(res===true && menuRes) {
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
                const res: boolean = await store.dispatch('MenuListTable/deleteTableData',id);
                if (res === true) {
                    ElMessage.success('删除成功！');
                    getList(pagination.value.current);
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

        onMounted(()=> {
           getList(1);
        })
        return {
            list: list as unknown as TableListItem[],
            menusData:menusData as unknown as TableListItem[],
            pagination: pagination as unknown as PaginationConfig,
            loading: loading as unknown as boolean,
            getList,
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
            searchDrawerSubmit,
            createFormGetMenuData,

        }

    }
})
</script>
