<template>

  <el-row :gutter="24">

    <!--课程分类-->
    <el-col :xs="24" :sm="24" :md="4" :lg="4" :xl="3">
      <el-card class="box-card" shadow="never">
          <template #header>
            <el-tooltip class="item" effect="dark" content="选择指定课程分类" placement="top">
              <span class="role-span">课程分类</span>
            </el-tooltip>
          </template>
          <el-tree
            :ref="setCourseTypeRef"
            :data="subjectTreeData"
            :props="{children: 'children',label: 'name'}"
            default-expand-all
            node-key="id"
            @node-click="handleCheckChange"
        />

      </el-card>
    </el-col>
    <!--课程管理-->
    <el-col :xs="24" :sm="24" :md="20" :lg="20" :xl="20" style="margin-bottom: 10px">
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
                            <el-button v-permission="'edu:course:add'" type="primary" @click="() => setCreateFormVisible(true)">新增</el-button>
                        </el-col>
                        <el-col :span="16" class="text-align-right">
                            <el-input v-model="searchVal" style="width:200px;margin-left: 16px;" placeholder="请输入课程标题">
                                <template #suffix>
                                    <i class="el-input__icon el-icon-search cursor-pointer" @click="searchSubmit"></i>
                                </template>
                            </el-input>
                          <el-button style="margin-left: 8px"  @click="() => searchDrawerVisible = true">高级搜索</el-button>
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
              <el-popover effect="light" trigger="hover" placement="right">
                <template #default>
                  <img :src="scope.row.cover"
                       style="height: 200px;width: 360px"/>

                </template>
                <template #reference>
                  <img :src="scope.row.cover" style="height: 38px;width: 58px;cursor: pointer"/>
                </template>
              </el-popover>

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
              <el-tooltip class="item" effect="dark" content="创建课程大纲" placement="top">
                <a @click="() => syllabusData(scope.row.id)">
                <el-tag type="success"  size="mini" closable v-text="scope.row.lessonNum"></el-tag>
                </a>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
              label="付费学员"
              prop="buyCount"
              width="100"
              align="center">
            <template #default="{row}">
              <el-tooltip class="item" effect="dark" content="付款购买课程的用户" placement="top">
                <a :href="row.href">
                  <el-tag type="success"> {{ row.buyCount }}人</el-tag>
                </a>
              </el-tooltip>
            </template>
          </el-table-column>

            <el-table-column
                label="vip学员"
                prop="vipCount"
                width="100"
                align="center">
                <template #default="{row}">
                  <el-tooltip class="item" effect="dark" content="加入VIP免费观看课程的用户" placement="top">
                    <el-tag  type="warning">{{ row.vipCount }}人</el-tag>
                  </el-tooltip>
                </template>
            </el-table-column>

          <el-table-column prop="status" label="课程状态" width="100" align="center" >
            <template #default="scope">
              <el-tooltip :content="scope.row.status === 'Draft' ? '未发布' : '已发布'" placement="top">
                <el-switch
                    v-model="scope.row.status"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    active-value="Normal"
                    inactive-value="Draft"
                    @change="updateStatus(scope.row.id,scope.row.status)">
                </el-switch>
              </el-tooltip>
            </template>
          </el-table-column>

            <el-table-column
                label="操作"
                prop="action"
                width="150">
                <template #default="{row}">
                    <el-button v-permission="'edu:course:edit'"  type="text" @click="() => detailUpdateData(row.id)" :loading="detailUpdateLoading.includes(row.id)" icon="el-icon-edit">编辑</el-button>
                    <el-button v-permission="'edu:course:delete'"  type="text"  @click="() => deleteTableData(row.id)" :loading="deleteLoading.includes(row.id)" icon="el-icon-delete">删除</el-button>
                    <el-button v-permission="'edu:course:upload'"   title="上传课程资源"  :loading="detailUploadLoading.includes(row.id)"  type="text"  size="mini" icon="el-icon-upload" @click="uploadResourceById(row.id)">上传</el-button>
                    <el-button v-permission="'edu:course:download'"  type="text"  @click="() => downloadTableData(row.id)" :loading="downloadLoading.includes(row.id)" icon="el-icon-download">下载</el-button>
                </template>
            </el-table-column>


        </screen-table>

        <!--添加弹出框-->
        <create-form
            :headerToken="headerToken"
            :subjectTreeData="subjectTreeData"
            :teachers="teachers"
            :visible="createFormVisible"
            :onCancel="() => setCreateFormVisible(false)"
            :onSubmitLoading="createSubmitLoading"
            :onSubmit="createSubmit"
        />

        <!--完善课程详情弹出框-->
        <remarks-form
            v-if="remarksFormVisible===true"
            :visible="remarksFormVisible"
            :values="updateData"
            :onCancel="() => updataFormCancel()"
            :onSubmitLoading="updateSubmitLoading"
            :onSubmit="updateRemarksSubmit"
        />

        <!--编辑弹出框-->
        <update-form
            :headerToken="headerToken"
            :subjectTreeData="subjectTreeData"
            :teachers="teachers"
            v-if="updateFormVisible===true"
            :visible="updateFormVisible"
            :values="updateData"
            :onCancel="() => updataFormCancel()"
            :onSubmitLoading="updateSubmitLoading"
            :onSubmit="updateSubmit"
        />

        <!--课时弹出框-->
        <Syllabus
            :values="updateData"
            :visible="syllabusVisible"
            :onCancel="() => syllabusCancel()"
            :onSubmitLoading="updateSubmitLoading"
            :onSubmit="syllabusSubmit"
        />

        <!--高级搜索弹出框-->
        <search-drawer
            :visible="searchDrawerVisible"
            :onClose="() => searchDrawerClose()"
            :onSubmit="searchDrawerSubmit"
        />

        <!--上传课程小节视频-->
        <upload-resource-form
            v-if="uploadResourceFormVisible===true"
            :visible="uploadResourceFormVisible"
            :values="updateData"
            :headerToken="headerToken"
            :onCancel="() => uploadResourceFormCancel()"
            :getPercent="getUploadPercent"
        />

      </el-card>
    </el-col>
  </el-row>
</template>
<script lang="ts">
import { computed, defineComponent, onMounted, ref,reactive } from 'vue';
import { useStore } from 'vuex';
import { ElMessageBox, ElMessage } from 'element-plus';
import ScreenTable from '@/components/ScreenTable/index.vue';
import CreateForm from './components/CreateForm.vue';
import UpdateForm from './components/UpdateForm.vue';
import RemarksForm from './components/RemarksForm.vue';
import Syllabus from './components/Syllabus.vue';
import SearchDrawer from './components/SearchDrawer.vue';
import UploadResourceForm from './components/UploadResourceForm.vue';
import { StateType as ListStateType } from "./store";
import { PaginationConfig, TableListItem } from './data.d';
import {ResponseData} from "@/utils/request";
import vPermission from '@/directives/permission';
import {getToken} from "@/utils/localToken";
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
    detailUploadLoading: number[];
    detailUpdateData: (id: number) => Promise<void>;
    syllabusData: (id: number) => Promise<void>;
    updateData: Partial<TableListItem>;
    updateFormVisible: boolean;
    syllabusVisible: boolean;
    remarksFormVisible: boolean;
    updataFormCancel:  () => void;
    syllabusCancel: () => void;
    updateSubmitLoading: boolean;
    updateSubmit:  (values: TableListItem, resetFields: () => void) => Promise<void>;
    updateRemarksSubmit:  (values: TableListItem, resetFields: () => void) => Promise<void>;
    syllabusSubmit: (values: TableListItem, resetFields: () => void) => Promise<void>;
    deleteLoading: number[];
    deleteTableData:  (id: number) => void;
    downloadLoading: number[];
    downloadTableData:  (id: number) => void;
    tabVal: string;
    searchVal: string;
    subjectTreeData: object[];
    teachers: object[];
    searchSubmit: () => Promise<void>;
    getParentCategoryList: () => Promise<void>;
    getAllTeacherList: () => Promise<void>;
    setCourseTypeRef: (val: object) => void;
    headerToken: string | null;
    courseId: number;
    handleCheckChange: (data: any, checked: any, indeterminate: any) => void;
    subjectId: number;
    searchDrawerVisible: boolean;
    searchDrawerClose: () => void;
    searchDrawerSubmit: (values: Omit<TableListItem, 'id'>) => Promise<void>;
    uploadResourceById: (id: number) => Promise<void>;
    uploadResourceFormVisible: boolean;
    uploadResourceFormCancel:  () => void;
    getUploadPercent: (fileKey: string) => Promise<number>;
    updateStatus: (id: number,status: string) => void;
}

export default defineComponent({
    name: 'ListCourseTablePage',
    components: {
        ScreenTable,
        CreateForm,
        UpdateForm,
        RemarksForm,
        Syllabus,
        SearchDrawer,
        UploadResourceForm
    },
    directives: {
      permission: vPermission
    },
    setup(): ListCourseTablePageSetupData {

       // 定义搜索关键词
        const searchVal = ref<string>('');
        const store = useStore<{ ListCourseTable: ListStateType}>();

      // 表单值
      let modelRef = reactive<Omit<TableListItem, 'id'>>({
        title: '',
        shortTitle: '',
        courseType: null,
        difficulty: null
      });

      const subjectId=ref<number>();

      //  拿到树形组件dom对象(课程分类)
      let courseTypeRef: any;
      const setCourseTypeRef = (el: object) => {
        courseTypeRef = el;
      }

      // 编辑弹框 - visible
      const syllabusVisible = ref<boolean>(false);
      // 赋值表单
      const setSyllabusVisible = (val: boolean) => {
        syllabusVisible.value = val;
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
                title: searchVal.value,
                courseType: modelRef.courseType,
                difficulty: modelRef.difficulty,
                subjectId:subjectId.value
            });
            loading.value = false;
        }

      // 新增或修改获取token数据
      const headerToken = ref<string|null>();
      const getHeaderToken = async () => {
        const token = await getToken();
        headerToken.value = 'Bearer '+token;
      }

      // 课程详情弹框 - visible
      const remarksFormVisible = ref<boolean>(false);
      // 赋值表单
      const setRemarksFormVisible = (val: boolean) => {
        remarksFormVisible.value = val;
      }



      // 新增或修改获取课程分类树形数据
        const subjectTreeData = ref<object[]>([]);
        const getParentCategoryList = async () => {
          const res: object[] = await store.dispatch('ListSubjectTable/getParentCategoryList');
          // console.info("获取课程分类树形数据：",res)
          if(res.length>0) {
            subjectTreeData.value=res
          }else {
            subjectTreeData.value = [];
          }

        }

        // 新增或修改获取讲师列表数据
      const teachers = ref<object[]>([]);
      const getAllTeacherList = async ()=>{
        const res: object[] = await store.dispatch('ListTeacherTable/getAllTeacherList');
        // console.info("获取讲师数据：",res)
        if(res.length>0) {
          teachers.value=res
        }else {
          teachers.value = [];
        }
      }

        // 新增弹框 - visible
        const createFormVisible = ref<boolean>(false);
        const setCreateFormVisible = (val: boolean) => {
          getAllTeacherList()
          getHeaderToken()
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
                setRemarksFormVisible(true);
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
            getAllTeacherList()
            getHeaderToken()
            updateFormVisible.value = val;
        }

        // 编辑弹框 data
        const updateData = computed<Partial<TableListItem>>(() => store.state.ListCourseTable.updateData);

        const detailUpdateLoading = ref<number[]>([]);
        const detailUpdateData = async (id: number) => {
            detailUpdateLoading.value = [id];
            const res: boolean = await store.dispatch('ListCourseTable/queryUpdateData',id);
            // console.info("index页面获取需要更新的数据res：",res)
            if(res===true) {
                 setUpdateFormVisible(true);
            }

            detailUpdateLoading.value = [];
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
          const res: boolean = await store.dispatch('ListCourseTable/queryUpdateData',values.id);
          if(res===true) {
            setRemarksFormVisible(true);
          }
        }
        updateSubmitLoading.value = false;
      }

      // 提交课程详情
      const updateRemarksSubmit = async (values: TableListItem, resetFields: () => void) => {
        updateSubmitLoading.value = true;
        const res: boolean = await store.dispatch('ListCourseTable/updateTableData',values);
        if(res === true) {
          updataFormCancel();
          ElMessage.success('完善课程详情成功！');
          const res: boolean = await store.dispatch('ListCourseTable/queryUpdateData',values.id);
          if(res===true) {
            setRemarksFormVisible(false);
            setSyllabusVisible(true);
          }
        }
        updateSubmitLoading.value = false;
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
                    await getList(pagination.value.current);
                }
                deleteLoading.value = [];
            }).catch((error: any) =>{
                console.log(error)
            });

        }

      // 下载 loading
      const downloadLoading = ref<number[]>([]);
      // 下载
      const downloadTableData = (id: number) => {

        ElMessageBox.confirm('确定下载吗？', '下载资料',{
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(async () => {
          downloadLoading.value = [id];
          const res: boolean = await store.dispatch('ListCourseTable/downloadTableData',id);
          if (res === true) {
            ElMessage.success('正在下载，请耐心等待......');
            window.location.href = process.env.VUE_APP_APIHOST+"edu/oss/downFileFromOss?fileName="+updateData.value.downloadLink;

            console.info("待下载数据：",updateData.value.downloadLink)

            //ElMessage.success('下载成功！');
            //await getList(pagination.value.current);
          }
          downloadLoading.value = [];
        }).catch((error: any) =>{
          console.log(error)
        });

      }


      // 取课时列表
      const syllabusCancel = () => {
        setSyllabusVisible(false);
        store.commit('ListCourseTable/setUpdateData',{});
        //console.info("关闭课时列表")
      }

      // 课时弹框 - 提交
      const syllabusSubmit = async (values: TableListItem, resetFields: () => void) => {
        syllabusCancel()
        ElMessage.success("提交课程大纲成功")
      }


      // 编辑课时
      const courseId = ref<number>(0);
      const syllabusData = async (id: number) => {
        const res: boolean = await store.dispatch('ListCourseTable/queryUpdateData',id);
        if(res===true) {
          setSyllabusVisible(true)
        }

      }

      // 上传课程资料
      const detailUploadLoading = ref<number[]>([]);
      const uploadResourceFormVisible = ref<boolean>(false);
      const setUploadResourceFormVisible = (val: boolean) => {
        uploadResourceFormVisible.value = val;
      }
      // 上传课程资料弹框
      const uploadResourceById = async (id: number) => {
        detailUploadLoading.value = [id];
        const res: boolean = await store.dispatch('ListCourseTable/queryUpdateData',id);
        if(res===true) {
          setUploadResourceFormVisible(true);
        }
        detailUploadLoading.value = [];
      }

      // 取消上传课程小节视频 弹框
      const uploadResourceFormCancel = () => {
        setUploadResourceFormVisible(false);
        store.commit('ListCourseTable/setUpdateData',{});
        getList(pagination.value.current);
      }

      // 获取上传进度条
      const getUploadPercent = async(fileKey: string) => {
        console.info("index组件获取fileKey:",fileKey)
        const response: ResponseData  = await store.dispatch('ListCourseTable/getUploadPercentData',fileKey);
        //console.info("index组件获取进度条response:",response.data.percent)
        return response.data.percent;
      }

      // 更新课程状态
      const updateStatus = async (id: number,status: string) => {

        // console.info("更新课程状态:",id,status)
        if(id!=undefined ){
          const res: boolean = await store.dispatch('ListCourseTable/updateStatusData',{
            id:id,
            status:status
          });
          if(res===true) {
            await getList(pagination.value.current);
          }
        }

      }

        const tabVal = ref<string>('all');


        // 搜索
        const searchSubmit = async () => {
          await getList(1);

        }

        // 选择分类
     const handleCheckChange=(data: any)=> {
        //console.log("选择分类",data, checked, indeterminate);
       subjectId.value = data.id
       //subjectIds.value = courseTypeRef.getCheckedKeys()
       console.log("选择的分类ID:",subjectId.value)
       searchSubmit()
      }

      // 搜索
      const searchDrawerVisible = ref<boolean>(false);
      const searchDrawerClose = () => {
        searchDrawerVisible.value = false;
      }
      const searchDrawerSubmit = async (values: Omit<TableListItem, 'id'>) => {
        modelRef=values
        console.log('search', values);
        await searchSubmit()
        searchDrawerClose();
      }

        onMounted(()=> {
           getList(1);
           getParentCategoryList();
            getHeaderToken();
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
            detailUploadLoading: detailUploadLoading as unknown as number[],
            detailUpdateData,
            syllabusData,
            uploadResourceById,
            updateData: updateData as Partial<TableListItem>,
            updateFormVisible: updateFormVisible as unknown as boolean,
            remarksFormVisible: remarksFormVisible as unknown as boolean,
            syllabusVisible: syllabusVisible as unknown as boolean,
            updataFormCancel,
            syllabusCancel,
            updateSubmitLoading: updateSubmitLoading as unknown as boolean,
            updateSubmit,
            syllabusSubmit,
            updateRemarksSubmit,
            deleteLoading: deleteLoading as unknown as number[],
            deleteTableData,
            downloadLoading: downloadLoading as unknown as number[],
            downloadTableData,
            tabVal: tabVal as unknown as string,
            searchVal: searchVal as unknown as string,
            subjectTreeData:subjectTreeData as unknown as object[],
            teachers:teachers as unknown as object[],
            searchSubmit,
            getParentCategoryList,
            setCourseTypeRef,
            getAllTeacherList,
            headerToken:headerToken as unknown as string,
            courseId: courseId as unknown as number,
            handleCheckChange,
            subjectId: subjectId as unknown as number,
            searchDrawerVisible: searchDrawerVisible as unknown as boolean,
            searchDrawerClose,
            searchDrawerSubmit,
            uploadResourceFormVisible: uploadResourceFormVisible as unknown as boolean,
            uploadResourceFormCancel,
            getUploadPercent,
            updateStatus,
        }

    }
})
</script>
