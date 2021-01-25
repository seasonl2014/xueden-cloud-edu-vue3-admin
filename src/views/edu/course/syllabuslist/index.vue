<template>
    <div class="indexlayout-main-conent">
        <el-card shadow="never" class="cus-card">
          <template #header>
              <el-row>
                    <el-col :span="8">
                        <el-button type="primary" @click="() => setCreateFormVisible(true)">添加章</el-button>
                    </el-col>
            </el-row>
          </template>

            <el-table
                row-key="id"
                border
                :data="list"
                v-loading="loading"
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
                  label="章节名称"
                  prop="title">
              </el-table-column>

                <el-table-column
                    label="所属章节"
                    prop="lev"
                    width="80">
                    <template #default="scope">
                      <el-tag v-if="scope.row.lev===1">大章</el-tag>
                      <el-tag type="success" v-else>小节</el-tag>
                    </template>
                </el-table-column>

              <el-table-column
                  label="播放次数"
                  width="100"
                  prop="playCount">
              </el-table-column>

                <el-table-column
                    label="免费"
                    prop="isFree"
                    width="80">
                  <template #default="scope">
                    <el-tag v-if="scope.row.isFree===0">免费</el-tag>
                    <el-tag type="success" v-else>收费</el-tag>
                  </template>
                </el-table-column>

                <el-table-column
                    label="时长"
                    prop="type"
                    width="100">
                    <template #default="scope">
                      <el-tag type="success" v-if="scope.row.duration!=0">{{ durationFormatDate(scope.row.duration*1000)}}</el-tag>
                    </template>
                </el-table-column>

              <el-table-column
                  label="视频源"
                  prop="videoSourceId"
                  width="80">
                <template #default="scope">
                  <el-tag v-if="scope.row.lev!=1&&scope.row.videoSourceId!=null"  @click="playVideoByVideoId(scope.row.videoSourceId)"  effect="dark" type="success" style="cursor: pointer;">播放</el-tag>
                  <el-tag v-if="scope.row.videoSourceId===null&&scope.row.lev!=1" effect="plain"  type="warning">未上传</el-tag>
                </template>
              </el-table-column>

                <el-table-column
                    label="操作"
                    prop="action"
                    width="150">
                    <template #default="{row}">
                        <el-button type="text" @click="() => detailUpdateData(row.id)" :loading="detailUpdateLoading.includes(row.id)">编辑</el-button>
                        <el-button type="text"  @click="() => deleteTableData(row.id)" :loading="deleteLoading.includes(row.id)">删除</el-button>
                    </template>
                </el-table-column>

            </el-table>

            <div class="padding-t10 text-align-right">
                <el-pagination
                    background
                    layout="total,prev, pager, next"
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
                :onCancel="() => updataFormCancel()"
                :onSubmitLoading="updateSubmitLoading"
                :onSubmit="updateSubmit"
            />


        </el-card>
    </div>
</template>
<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref } from "vue";
import { useStore } from "vuex";
import { ElMessageBox, ElMessage, ElForm } from "element-plus";
import CreateForm from './components/CreateForm.vue';
import UpdateForm from './components/UpdateForm.vue';
import { StateType as ListStateType } from "./store";
import { PaginationConfig, TableListItem } from './data.d';
import {formatDate} from '@/utils/filters'
interface ListChapterTablePageSetupData {
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
    searchOpen: boolean;
    setSearchOpen: () => void;
    searchModelRef: Omit<TableListItem, 'id'>;
    searchFormRef: typeof ElForm;
    searchResetFields: () => void;
    searchFormSubmit: () => Promise<void>;
    playVideoByVideoId: (videoId: number) => Promise<void>;
    durationFormatDate: (number: number) => any;
}

export default defineComponent({
    name: 'SyllabusTable',
    components: {
        CreateForm,
        UpdateForm
    },
  filters: {
    formatDate(time: any){
      const data = new Date(time);
      return formatDate(data,'hh:mm:ss');
    }
  },
    setup(): ListChapterTablePageSetupData {

        const store = useStore<{ ListChapterTable: ListStateType;ListCourseTable: ListStateType}>();
      // 编辑弹框 data
      const courseData = computed<Partial<TableListItem>>(() => store.state.ListCourseTable.updateData);
      console.info("课程courseData：",courseData.value.id);

        // 列表数据
        const list = computed<TableListItem[]>(() => store.state.ListChapterTable.tableData.list);

        // 列表分页
        const pagination = computed<PaginationConfig>(() => store.state.ListChapterTable.tableData.pagination);

        // 获取数据
        const loading = ref<boolean>(true);
        const getList = async (current: number): Promise<void> => {
            loading.value = true;
            await store.dispatch('ListChapterTable/queryTableData', {
                per: pagination.value.pageSize,
                page: current,
                courseId:courseData.value.id,
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
            const res: boolean = await store.dispatch('ListChapterTable/createTableData',values);
            if(res === true) {
                resetFields();
                setCreateFormVisible(false);
                ElMessage.success('新增成功！');
                getList(1);
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
            store.commit('ListChapterTable/setUpdateData',{});
        }
        // 编辑弹框 - 提交 loading
        const updateSubmitLoading = ref<boolean>(false);
        // 编辑弹框 - 提交
        const updateSubmit = async (values: TableListItem, resetFields: () => void) => {
            updateSubmitLoading.value = true;
            const res: boolean = await store.dispatch('ListChapterTable/updateTableData',values);
            if(res === true) {
                updataFormCancel();
                ElMessage.success('编辑成功！');
                getList(pagination.value.current);
            }
            updateSubmitLoading.value = false;
        }

        // 编辑弹框 data
        const updateData = computed<Partial<TableListItem>>(() => store.state.ListChapterTable.updateData);
        const detailUpdateLoading = ref<number[]>([]);
        const detailUpdateData = async (id: number) => {
            detailUpdateLoading.value = [id];
            const res: boolean = await store.dispatch('ListChapterTable/queryUpdateData',id);
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
                const res: boolean = await store.dispatch('ListChapterTable/deleteTableData',id);
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
        const searchOpen = ref<boolean>(false);
        const setSearchOpen = (): void => {
            searchOpen.value = !searchOpen.value;
        }
        // 表单值
        const searchModelRef = reactive<Omit<TableListItem, 'id'>>({
            name: '',
            desc: '',
            href: '',
            type: ''
        });
        // search form
        const searchFormRef = ref<typeof ElForm>();
        // 重置
        const searchResetFields = () => {
            searchFormRef.value?.resetFields();
            searchModelRef.name = '';
            searchModelRef.desc = '';
            searchModelRef.href = '';
            searchModelRef.type = '';
        }
        // 搜索
        const searchFormSubmit = async () => {
            try {
                console.log('search', searchModelRef);
                ElMessage.warning('进行了搜索!');
            } catch (error) {
                ElMessage.warning(error);
            }
        }

       const durationFormatDate = (time: any)=> {
         const data = new Date(time);
         return formatDate(data,'hh:mm:ss');
       }

      const playVideoByVideoId = async (videId: number)=>{
        ElMessage.success('视频店铺！'+videId);
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
            searchOpen: searchOpen as unknown as boolean,
            setSearchOpen,
            searchModelRef,
            searchFormRef: searchFormRef as unknown as typeof ElForm,
            searchResetFields,
            searchFormSubmit,
            durationFormatDate,
            playVideoByVideoId
        }

    }
})
</script>
