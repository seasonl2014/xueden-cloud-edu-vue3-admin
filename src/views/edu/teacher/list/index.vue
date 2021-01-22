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
                        <el-button v-permission="'edu:teacher:add'" type="primary" @click="() => setCreateFormVisible(true)">新增</el-button>
                    </el-col>
                    <el-col :span="16" class="text-align-right">
                        <el-input v-model="searchVal" style="width:200px;margin-left: 16px;" placeholder="请输入讲师姓名">
                            <template #suffix>
                                <i class="el-input__icon el-icon-search cursor-pointer" @click="searchSubmit"></i>
                            </template>
                        </el-input>
                    </el-col>
            </el-row>
        </template>

        <el-table-column type="expand">
          <template #default="props">

            <el-space>
              <el-row>
                <el-col :span="24"><div class="grid-content bg-purple-dark"><el-tag type="success">资历：</el-tag>{{ props.row.intro }}</div></el-col>
              </el-row>
              <el-divider></el-divider>
            <el-row>
              <el-col :span="24"><div class="grid-content bg-purple-dark"><el-tag>简介：</el-tag>{{ props.row.remarks }}</div></el-col>
            </el-row>
            </el-space>
          </template>
        </el-table-column>

        <el-table-column
            type="index"
            label="序号"
            :index="(index) => {
                return (pagination.current - 1) * pagination.pageSize + index + 1;
            }"
            width="80">
        </el-table-column>

        <el-table-column
            label="讲师头像"
            prop="avatar">
          <template #default="{row}">
            <img class="avatar" :src="row.avatar" alt="row.name" width="150px">
          </template>
        </el-table-column>

        <el-table-column
            label="讲师名称"
            prop="name"
            width="80">
        </el-table-column>

      <el-table-column label="头衔" width="120">
        <template #default="scope">
          <el-tag v-if="scope.row.level===1" type="success">高级讲师</el-tag>
          <el-tag v-else type="warning">首席讲师</el-tag>
        </template>
      </el-table-column>

      <el-table-column
          label="排序"
          prop="sort">
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
                <el-button v-permission="'sys:user:edit'" type="text" @click="() => detailUpdateData(row.id)" :loading="detailUpdateLoading.includes(row.id)">编辑</el-button>
                <el-button v-permission="'sys:user:delete'" type="text"  @click="() => deleteTableData(row.id)" :loading="deleteLoading.includes(row.id)">删除</el-button>
            </template>
        </el-table-column>


    </screen-table>


    <create-form
        :headerToken="headerToken"
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


</template>
<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import { ElMessageBox, ElMessage } from 'element-plus';
import ScreenTable from '@/components/ScreenTable/index.vue';
import CreateForm from './components/CreateForm.vue';
import UpdateForm from './components/UpdateForm.vue';
import { StateType as ListStateType } from "./store";
import { PaginationConfig, TableListItem } from './data.d';
import {ResponseData} from "@/utils/request";
import vPermission from '@/directives/permission';
import {getToken} from "@/utils/localToken";
interface ListTeacherTablePageSetupData {
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
    headerToken: string | null;
    searchSubmit: () => Promise<void>;
}

export default defineComponent({
    name: 'ListTeacherTablePage',
    components: {
        ScreenTable,
        CreateForm,
        UpdateForm
    },
    directives: {
      permission: vPermission
    },
    setup(): ListTeacherTablePageSetupData {

       // 定义搜索关键词
        const searchVal = ref<string>('');
        const store = useStore<{ ListTeacherTable: ListStateType}>();


        // 列表数据
        const list = computed<TableListItem[]>(() => store.state.ListTeacherTable.tableData.list);

        // 列表分页
        const pagination = computed<PaginationConfig>(() => store.state.ListTeacherTable.tableData.pagination);

        // 获取数据
        const loading = ref<boolean>(true);
        const getList = async (current: number): Promise<void> => {
            loading.value = true;
            await store.dispatch('ListTeacherTable/queryTableData', {
                per: pagination.value.pageSize,
                page: current,
                s_key: searchVal.value
            });
            loading.value = false;
        }

      // 角色穿梭框数据
      const getAllRoles = async (rolesData: any[]) => {
        const data: any = [];
        for (const role of rolesData) {
          data.push({
            key: role.id,
            label: `${ role.name }`
          });

        }
        return data;
      };
        // 新增或修改获取token数据
        const headerToken = ref<string|null>();
        const getHeaderToken = async () => {
          const token = await getToken();
          headerToken.value = 'Bearer '+token;
        }



        // 新增弹框 - visible
        const createFormVisible = ref<boolean>(false);
        const setCreateFormVisible = (val: boolean) => {
          if(val)getHeaderToken()
          createFormVisible.value = val;
        };
        // 新增弹框 - 提交 loading
        const createSubmitLoading = ref<boolean>(false);
        // 新增弹框 - 提交
        const createSubmit = async (values: Omit<TableListItem, 'id'>, resetFields: () => void) => {
            createSubmitLoading.value = true;
            const response: ResponseData  = await store.dispatch('ListTeacherTable/createTableData',values);
            console.info("保存用户数据返回值：",response)
            const { code ,success,message} = response;
            console.log('index页面组件接收的返回值success:', success);
            if(success === true) {
                resetFields();
                setCreateFormVisible(false);
                ElMessage.success(message);
                await getList(1);
            }else {
              ElMessage.error(message);
            }
            createSubmitLoading.value = false;
        }


        // 编辑弹框 - visible
        const updateFormVisible = ref<boolean>(false);
        // 赋值表单
        const setUpdateFormVisible = (val: boolean) => {
            updateFormVisible.value = val;
        }
        // 取消编辑表单
        const updataFormCancel = () => {
            setUpdateFormVisible(false);
            store.commit('ListTeacherTable/setUpdateData',{});
        }
        // 编辑弹框 - 提交 loading
        const updateSubmitLoading = ref<boolean>(false);
        // 编辑弹框 - 提交
        const updateSubmit = async (values: TableListItem, resetFields: () => void) => {
            updateSubmitLoading.value = true;
            const res: boolean = await store.dispatch('ListTeacherTable/updateTableData',values);
            if(res === true) {
                updataFormCancel();
                ElMessage.success('编辑成功！');
                getList(pagination.value.current);
            }
            updateSubmitLoading.value = false;
        }

        // 编辑弹框 data
        const updateData = computed<Partial<TableListItem>>(() => store.state.ListTeacherTable.updateData);

        const detailUpdateLoading = ref<number[]>([]);
        const detailUpdateData = async (id: number) => {
            detailUpdateLoading.value = [id];
            const res: boolean = await store.dispatch('ListTeacherTable/queryUpdateData',id);
            if(res===true) {
                setUpdateFormVisible(true);
            }
            console.info("index页面获取用户所具有的角色数据：",updateData)
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
                const res: boolean = await store.dispatch('ListTeacherTable/deleteTableData',id);
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
            headerToken:headerToken as unknown as string,
            searchSubmit
        }

    }
})
</script>
<style scoped>

.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  font-weight: 800;
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}

.avatar {
  width: 32px;
  height: 32px;
  overflow: hidden;
  border-radius:50%;
  -webkit-border-radius:50%;
  -moz-border-radius:50%;
}
</style>
