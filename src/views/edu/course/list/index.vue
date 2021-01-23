<template>

  <el-row :gutter="15">

    <!--课程分类-->
    <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="5">
      <el-card class="box-card" shadow="never">
          <template #header>
            <el-tooltip class="item" effect="dark" content="选择指定课程分类" placement="top">
              <span class="role-span">课程分类</span>
            </el-tooltip>
          </template>
          <el-tree
            :ref="setCourseTypeRef"
            :data="[]"
            :props="{children: 'children',label: 'name'}"
            check-strictly
            accordion
            show-checkbox
            default-expand-all
            node-key="id"
        />

      </el-card>
    </el-col>
    <!--课程管理-->
    <el-col :xs="24" :sm="24" :md="18" :lg="18" :xl="19" style="margin-bottom: 10px">
      <el-card shadow="never" class="cus-card">
        <template #header>
          <el-tooltip class="item" effect="dark" content="课程管理" placement="top">
            <span class="role-span">课程管理</span>
          </el-tooltip>
        </template>
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
                            <el-button v-permission="'sys:user:add'" type="primary" @click="() => setCreateFormVisible(true)">新增</el-button>
                        </el-col>
                        <el-col :span="16" class="text-align-right">
                            <el-input v-model="searchVal" style="width:200px;margin-left: 16px;" placeholder="请输入课程标题">
                                <template #suffix>
                                    <i class="el-input__icon el-icon-search cursor-pointer" @click="searchSubmit"></i>
                                </template>
                            </el-input>
                        </el-col>
                </el-row>
            </template>


            <el-table-column
                type="index"
                label="序号"
                :index="(index) => {
                    return (pagination.current - 1) * pagination.pageSize + index + 1;
                }"
                width="60">
            </el-table-column>

          <el-table-column prop="cover" label="课程封面" align="center" width="100px" padding="0px">
            <template #default="scope">
                <img :src="scope.row.cover"
                     style="height: 38px;width: 58px;cursor: pointer"/>
            </template>
          </el-table-column>

            <el-table-column
                label="课程标题"
                prop="shortTitle"
                align="center">
            </el-table-column>

          <el-table-column
              label="价格"
              prop="price"
              width="100"
              align="center">
            <template #default="scope">
              {{ Number(scope.row.price) === 0 ? '免费' :
                '¥' + scope.row.price.toFixed(2) }}
            </template>
          </el-table-column>

          <el-table-column
              label="课时"
              prop="cateId"
              align="center"
              width="100">
            <template #default="scope">
              <el-tag type="success" size="mini" closable v-text="scope.row.lessonNum"></el-tag>
            </template>
          </el-table-column>
          <el-table-column
              label="付费学员"
              prop="buyCount"
              width="100"
              align="center">
            <template #default="{row}">
              <a :href="row.href">
                <el-tag type="success"> {{ row.buyCount }}人</el-tag>
              </a>
            </template>
          </el-table-column>

            <el-table-column
                label="vip学员"
                prop="vipCount"
                width="100"
                align="center">
                <template #default="{row}">
                    <el-tag  type="warning">{{ row.vipCount }}人</el-tag>
                </template>
            </el-table-column>

          <el-table-column prop="status" label="课程状态" width="100" align="center" >
            <template #default="scope">
              <el-tag :type="scope.row.status === 'Draft' ? 'primary' : 'success'">{{scope.row.status === 'Draft' ? '未发布' : '已发布'}}</el-tag>
            </template>
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
            :subjectTreeData="subjectTreeData"
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
      </el-card>
    </el-col>
  </el-row>
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
interface ListCourseTablePageSetupData {
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
    subjectTreeData: object[];
    searchSubmit: () => Promise<void>;
    getParentCategoryList: () => Promise<void>;
    setCourseTypeRef: (val: object) => void;
}

export default defineComponent({
    name: 'ListCourseTablePage',
    components: {
        ScreenTable,
        CreateForm,
        UpdateForm
    },
    directives: {
      permission: vPermission
    },
    setup(): ListCourseTablePageSetupData {

       // 定义搜索关键词
        const searchVal = ref<string>('');
        const store = useStore<{ ListCourseTable: ListStateType}>();

      //  拿到树形组件dom对象(课程分类)
      let courseTypeRef: any;
      const setCourseTypeRef = (el: object) => {
        courseTypeRef = el;
      }


        // 列表数据
        const list = computed<TableListItem[]>(() => store.state.ListCourseTable.tableData.list);

        // 列表分页
        const pagination = computed<PaginationConfig>(() => store.state.ListCourseTable.tableData.pagination);

        // 获取数据
        const loading = ref<boolean>(true);
        const getList = async (current: number): Promise<void> => {
            loading.value = true;
            await store.dispatch('ListCourseTable/queryTableData', {
                per: pagination.value.pageSize,
                page: current,
                s_key: searchVal.value
            });
            loading.value = false;
        }

        // 新增或修改获取课程分类树形数据
        const subjectTreeData = ref<object[]>([]);
        const getParentCategoryList = async () => {
          const res: object[] = await store.dispatch('ListSubjectTable/getParentCategoryList');
          console.info("获取课程分类树形数据：",res)
          if(res.length>0) {
            subjectTreeData.value=res
          }else {
            subjectTreeData.value = [];
          }

        }



        // 新增弹框 - visible
        const createFormVisible = ref<boolean>(false);
        const setCreateFormVisible = (val: boolean) => {
          if(val)getParentCategoryList()
          createFormVisible.value = val;
        };
        // 新增弹框 - 提交 loading
        const createSubmitLoading = ref<boolean>(false);
        // 新增弹框 - 提交
        const createSubmit = async (values: Omit<TableListItem, 'id'>, resetFields: () => void) => {
            createSubmitLoading.value = true;
            const response: ResponseData  = await store.dispatch('ListCourseTable/createTableData',values);
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
            console.info("弹出编辑框----------------:",val)
            updateFormVisible.value = val;
        }
        // 取消编辑表单
        const updataFormCancel = () => {
            setUpdateFormVisible(false);
            store.commit('ListCourseTable/setUpdateData',{});
        }
        // 编辑弹框 - 提交 loading
        const updateSubmitLoading = ref<boolean>(false);
        // 编辑弹框 - 提交
        const updateSubmit = async (values: TableListItem, resetFields: () => void) => {
            updateSubmitLoading.value = true;
            const res: boolean = await store.dispatch('ListCourseTable/updateTableData',values);
            if(res === true) {
                updataFormCancel();
                ElMessage.success('编辑成功！');
                getList(pagination.value.current);
            }
            updateSubmitLoading.value = false;
        }

        // 编辑弹框 data
        const updateData = computed<Partial<TableListItem>>(() => store.state.ListCourseTable.updateData);

        const detailUpdateLoading = ref<number[]>([]);
        const detailUpdateData = async (id: number) => {
            detailUpdateLoading.value = [id];
            const res: boolean = await store.dispatch('ListCourseTable/queryUpdateData',id);
            console.info("index页面获取需要更新的数据res：",res)
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
                const res: boolean = await store.dispatch('ListCourseTable/deleteTableData',id);
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
            subjectTreeData:subjectTreeData as unknown as object[],
            searchSubmit,
            getParentCategoryList,
            setCourseTypeRef
        }

    }
})
</script>
