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
                    <el-tag type="success" v-else-if="scope.row.isFree===1">收费</el-tag>
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
                  <el-tag v-if="scope.row.lev!=1&&scope.row.videoSourceId!=null"  @click="playVideoByVideoId(scope.row.videoSourceId,scope.row.title)"  effect="dark" type="success" style="cursor: pointer;">播放</el-tag>
                  <el-tag v-if="scope.row.videoSourceId===null&&scope.row.lev!=1" effect="plain"  type="warning">未上传</el-tag>
                </template>
              </el-table-column>

                <el-table-column
                    label="操作"
                    prop="action">
                    <template #default="scope">
                      <el-button v-if="scope.row.lev===1" title="添加课程小节" type="primary"  size="mini" icon="el-icon-circle-plus" @click="openAddVideo(scope.row.id)"></el-button>
                      <el-button v-if="scope.row.lev!=1" plain title="上传视频"  :loading="detailUpdateVideoLoading.includes(scope.row.id)"  type="primary"  size="mini" icon="el-icon-upload" @click="uploadVideoById(scope.row.id)"></el-button>
                      <el-button v-if="scope.row.lev===1" title="编辑章" :loading="detailUpdateLoading.includes(scope.row.id)"  type="primary"  size="mini" icon="el-icon-edit" @click="openEditChapter(scope.row.id)"></el-button>
                      <el-button v-if="scope.row.lev!=1" plain title="编辑节" :loading="detailUpdateVideoLoading.includes(scope.row.id)"   type="success"  size="mini" icon="el-icon-edit" @click="openEditVideo(scope.row.id)"></el-button>
                      <el-button v-if="scope.row.lev===1" title="删除章"  type="danger"  size="mini" icon="el-icon-delete" @click="delChapter(scope.row.id)"></el-button>
                      <el-button v-if="scope.row.lev!=1" plain title="删除节"  type="danger"  size="mini" icon="el-icon-delete" @click="delVideo(scope.row.id)"></el-button>
                      <el-button v-if="scope.row.lev===1" title="批量上传视频" :loading="detailBatchUploadLoading.includes(scope.row.id)"  type="primary"  size="mini" icon="el-icon-upload" @click="batchUploadVideoById(scope.row.id)"></el-button>
                      <!-- <el-button type="text" @click="() => detailUpdateData(row.id)" :loading="detailUpdateLoading.includes(row.id)">编辑</el-button>
                        <el-button type="text"  @click="() => deleteTableData(row.id)" :loading="deleteLoading.includes(row.id)">删除</el-button>-->
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


          <!--添加章-->
            <create-form
                :visible="createFormVisible"
                :onCancel="() => setCreateFormVisible(false)"
                :onSubmitLoading="createSubmitLoading"
                :onSubmit="createSubmit"
            />

          <!--编辑章-->
            <update-form
                v-if="updateFormVisible===true"
                :visible="updateFormVisible"
                :values="updateData"
                :onCancel="() => updataFormCancel()"
                :onSubmitLoading="updateSubmitLoading"
                :onSubmit="updateSubmit"
            />

          <!--添加小节-->
          <create-video-form
              :visible="createVideoFormVisible"
              :onCancel="() => setCreateVideoFormVisible(false)"
              :onSubmitLoading="createVideoSubmitLoading"
              :onSubmit="createVideoSubmit"
          />

          <!--编辑课程小节-->
          <update-video-form
              v-if="updateVideoFormVisible===true"
              :visible="updateVideoFormVisible"
              :values="updateVideoData"
              :onCancel="() => updateVideoFormCancel()"
              :onSubmitLoading="updateVideoSubmitLoading"
              :onSubmit="updateVideoSubmit"
          />

          <!--上传课程小节视频-->
          <upload-video-form
              v-if="uploadVideoFormVisible===true"
              :visible="uploadVideoFormVisible"
              :values="updateVideoData"
              :headerToken="headerToken"
              :onCancel="() => uploadVideoFormCancel()"
              :onSubmitLoading="updateVideoSubmitLoading"
              :onSubmit="updateVideoSubmit"
              :getPercent="() => getUploadPercent()"
          />

          <!--批量上传课程小节视频-->
          <batch-upload-video-form
              v-if="batchUploadVideoFormVisible===true"
              :visible="batchUploadVideoFormVisible"
              :values="updateData"
              :headerToken="headerToken"
              :onCancel="() => batchUploadVideoFormCancel()"
              :onSubmitLoading="updateVideoSubmitLoading"
              :onSubmit="updateVideoSubmit"
              :getPercent="getBatchUploadPercent"
          />

          <!--预览视频-->
          <video-preview
              v-if="dialogVideoVisible===true"
              :visible="dialogVideoVisible"
              :values="video"
              :onCancel="() => videoPreviewCancel()"
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
import CreateVideoForm from './components/CreateVideoForm.vue';
import UpdateVideoForm from './components/UpdateVideoForm.vue';
import UploadVideoForm from './components/UploadVideoForm.vue';
import BatchUploadVideoForm from './components/BatchUploadVideoForm.vue';
import VideoPreview from './components/VideoPreview.vue';
import { StateType as ListStateType } from "./store";
import { PaginationConfig, TableListItem } from './data.d';
import {formatDate} from '@/utils/filters'
import {getToken} from "@/utils/localToken";
import {ResponseData} from "@/utils/request";

interface ListChapterTablePageSetupData {
    list: TableListItem[];
    pagination: PaginationConfig;
    loading: boolean;
    getList:  (current: number) => Promise<void>;
    createFormVisible: boolean;
    createVideoFormVisible: boolean;
    setCreateFormVisible:  (val: boolean) => void;
    setCreateVideoFormVisible:  (val: boolean) => void;
    createSubmitLoading: boolean;
    createVideoSubmitLoading: boolean;
    createSubmit: (values: Omit<TableListItem, 'id'>, resetFields: () => void) => Promise<void>;
    createVideoSubmit: (values: Omit<TableListItem, 'id'>, resetFields: () => void) => Promise<void>;
    detailUpdateLoading: number[];
    detailBatchUploadLoading: number[];
    detailUpdateVideoLoading: number[];
    openEditChapter: (id: number) => Promise<void>;
    openAddVideo: (id: number) => Promise<void>;
    openEditVideo: (id: number) => Promise<void>;
    uploadVideoById: (id: number) => Promise<void>;
    batchUploadVideoById: (id: number) => Promise<void>;
    updateData: Partial<TableListItem>;
    updateVideoData: Partial<TableListItem>;
    updateFormVisible: boolean;
    updateVideoFormVisible: boolean;
    uploadVideoFormVisible: boolean;
    batchUploadVideoFormVisible: boolean;
    updataFormCancel:  () => void;
    updateVideoFormCancel:  () => void;
    uploadVideoFormCancel:  () => void;
    batchUploadVideoFormCancel:  () => void;
    updateSubmitLoading: boolean;
    updateVideoSubmitLoading: boolean;
    updateSubmit:  (values: TableListItem, resetFields: () => void) => Promise<void>;
    updateVideoSubmit:  (values: TableListItem, resetFields: () => void) => Promise<void>;
    deleteLoading: number[];
    delChapter:  (id: number) => void;
    delVideo:  (id: number) => void;
    tabVal: string;
    searchOpen: boolean;
    setSearchOpen: () => void;
    searchModelRef: Omit<TableListItem, 'id'>;
    searchFormRef: typeof ElForm;
    searchResetFields: () => void;
    searchFormSubmit: () => Promise<void>;
    playVideoByVideoId: (videoId: string,titleVideo: string) => Promise<void>;
    durationFormatDate: (number: number) => any;
    video: object;
    dialogVideoVisible: boolean;
    videoPreviewCancel:  () => void;
    headerToken: string | null;
    getUploadPercent: () => void;
    getBatchUploadPercent: (values: TableListItem) => Promise<number>;
}

export default defineComponent({
    name: 'SyllabusTable',
    components: {
        CreateForm,
        UpdateForm,
        VideoPreview,
        CreateVideoForm,
        UpdateVideoForm,
        UploadVideoForm,
        BatchUploadVideoForm
    },
    setup(): ListChapterTablePageSetupData {

        const store = useStore<{ ListChapterTable: ListStateType;ListCourseTable: ListStateType}>();
      // 课程章节ID
        const chapterId = ref<number>();
      // 编辑弹框 data
      const courseData = computed<Partial<TableListItem>>(() => store.state.ListCourseTable.updateData);
      console.info("课程courseData：",courseData.value.id);
      // 上传视频获取token数据
      const headerToken = ref<string|null>();
      const getHeaderToken = async () => {
        const token = await getToken();
        headerToken.value = 'Bearer '+token;
      }
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
            if(courseData.value.id!==undefined){
              values.courseId = courseData.value.id
            }

            // console.info("保存章时课程ID是：",courseData.value.id)
            const res: boolean = await store.dispatch('ListChapterTable/createTableData',values);
            if(res === true) {
                resetFields();
                setCreateFormVisible(false);
                ElMessage.success('新增成功！');
                await getList(pagination.value.current);
            }
            createSubmitLoading.value = false;
        }

      // 新增小节弹框 - visible
      const createVideoFormVisible = ref<boolean>(false);
      const setCreateVideoFormVisible = (val: boolean) => {
        createVideoFormVisible.value = val;
      };
      // 新增弹框 - 提交 loading
      const createVideoSubmitLoading = ref<boolean>(false);
      // 新增小节弹框 - 提交
      const createVideoSubmit = async (values: Omit<TableListItem, 'id'>, resetFields: () => void) => {
        createVideoSubmitLoading.value = true;
        if(courseData.value.id!==undefined){
          values.courseId = courseData.value.id
        }
        if(chapterId.value!==undefined){
          values.chapterId = chapterId.value
        }

        console.info("保存小节时课程ID是：",courseData.value.id)
        console.info("保存小节时章节ID是：",values.chapterId)
        const res: boolean = await store.dispatch('ListChapterTable/createVideoTableData',values);
        if(res === true) {
          resetFields();
          setCreateVideoFormVisible(false);
          ElMessage.success('新增成功！');
          await getList(pagination.value.current);
        }
        createVideoSubmitLoading.value = false;
      }
      // 新增小节弹框
      const openAddVideo = async (id: number) => {
        chapterId.value = id;
        const res: boolean = await store.dispatch('ListChapterTable/queryUpdateData',id);
        if(res===true) {
          setCreateVideoFormVisible(true);
        }else{
          chapterId.value = 0;
        }

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
                await getList(pagination.value.current);
            }
            updateSubmitLoading.value = false;
        }

        // 编辑弹框 data
        const updateData = computed<Partial<TableListItem>>(() => store.state.ListChapterTable.updateData);
        const detailUpdateLoading = ref<number[]>([]);
        const openEditChapter = async (id: number) => {
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
        const delChapter = (id: number) => {

            ElMessageBox.confirm('确定删除吗？', '删除',{
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(async () => {
                deleteLoading.value = [id];
                const res: boolean = await store.dispatch('ListChapterTable/deleteTableData',id);
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

      // 删除课程小节 loading
      const deleteVideoLoading = ref<number[]>([]);
      // 删除课程小节
      const delVideo = (id: number) => {

        ElMessageBox.confirm('确定删除该课程小节吗？', '删除',{
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(async () => {
          deleteVideoLoading.value = [id];
          const res: boolean = await store.dispatch('ListChapterTable/deleteVideoTableData',id);
          if (res === true) {
            ElMessage.success('删除成功！');
            await getList(pagination.value.current);
          }
          deleteVideoLoading.value = [];
        }).catch((error: any) =>{
          console.log(error)
        });

      }

      // 编辑课程小节
      const updateVideoFormVisible = ref<boolean>(false);
      const setUpdateVideoFormVisible = (val: boolean) => {
        updateVideoFormVisible.value = val;
      }
      // 编辑课程小节弹框 data
      const updateVideoData = computed<Partial<TableListItem>>(() => store.state.ListChapterTable.updateVideoData);
      console.info("课程小节updateVideoData：",updateVideoData.value);
      const detailUpdateVideoLoading = ref<number[]>([]);
      const openEditVideo = async (id: number) => {
        detailUpdateVideoLoading.value = [id];
        const res: boolean = await store.dispatch('ListChapterTable/queryVideoUpdateData',id);
        console.info("编辑小节返回值res:",res)
        if(res===true) {
          setUpdateVideoFormVisible(true);
        }
        detailUpdateVideoLoading.value = [];
      }
      // 取消编辑课程小节 弹框
      const updateVideoFormCancel = () => {
        setUpdateVideoFormVisible(false);
        store.commit('ListChapterTable/setUpdateVideoData',{});
      }
      // 编辑课程小节弹框 - 提交 loading
      const updateVideoSubmitLoading = ref<boolean>(false);
      // 编辑课程小节弹框 - 提交
      const updateVideoSubmit = async (values: TableListItem, resetFields: () => void) => {
        updateVideoSubmitLoading.value = true;
        const res: boolean = await store.dispatch('ListChapterTable/updateVideoTableData',values);
        if(res === true) {
          updateVideoFormCancel();
          ElMessage.success('编辑成功！');
          await getList(pagination.value.current);
        }
        updateVideoSubmitLoading.value = false;
      }

      // 上传课程小节视频
      const uploadVideoFormVisible = ref<boolean>(false);
      const setUploadVideoFormVisible = (val: boolean) => {
        uploadVideoFormVisible.value = val;
      }
      // 上传视频弹框
      const uploadVideoById = async (id: number) => {
        detailUpdateVideoLoading.value = [id];
        const res: boolean = await store.dispatch('ListChapterTable/queryVideoUpdateData',id);
        console.info("编辑小节返回值res:",res)
        if(res===true) {
          setUploadVideoFormVisible(true);
        }
        detailUpdateVideoLoading.value = [];
      }

      // 取消上传课程小节视频 弹框
      const uploadVideoFormCancel = () => {
        setUploadVideoFormVisible(false);
        store.commit('ListChapterTable/setUpdateVideoData',{});
         getList(pagination.value.current);
      }

      // 获取上传进度条
      const getUploadPercent = async() =>{
        const response: ResponseData  = await store.dispatch('ListChapterTable/getUploadPercentData',updateVideoData.value.id);
        //console.info("index组件获取进度条response:",response.data.percent)
        return response.data.percent;
      }

      // 批量上传小节视频
      const batchUploadVideoFormVisible = ref<boolean>(false);
      const detailBatchUploadLoading = ref<number[]>([]);
      const setBatchUploadVideoFormVisible = (val: boolean) => {
        batchUploadVideoFormVisible.value = val;
      }
      // 批量上传视频弹框
      const batchUploadVideoById = async (id: number) => {
        detailBatchUploadLoading.value = [id];
        const res: boolean = await store.dispatch('ListChapterTable/queryUpdateData',id);
        console.info("批量上传小节视频返回值res:",res)
        if(res===true) {
          setBatchUploadVideoFormVisible(true);
        }
        detailBatchUploadLoading.value = [];
      }
      // 取消批量上传课程小节视频 弹框
      const batchUploadVideoFormCancel = () => {
        setBatchUploadVideoFormVisible(false);
        store.commit('ListChapterTable/setUpdateData',{});
        getList(pagination.value.current);
      }

      // 批量获取上传进度条
      const getBatchUploadPercent = async(values: TableListItem) =>{
        console.info("批量上传返回的参数值:",values)
        const response: ResponseData  = await store.dispatch('ListChapterTable/getBatchUploadPercentData',values);
        //console.info("index组件获取进度条response:",response.data.percent)
        return response.data.percent;
      }

        // 搜索
        const searchOpen = ref<boolean>(false);
        const setSearchOpen = (): void => {
            searchOpen.value = !searchOpen.value;
        }
        // 表单值
        const searchModelRef = reactive<Omit<TableListItem, 'id'>>({
          title: '',
          sort: 0,
          courseId: 0
        });
        // search form
        const searchFormRef = ref<typeof ElForm>();
        // 重置
        const searchResetFields = () => {
            searchFormRef.value?.resetFields();
            searchModelRef.title = '';
            searchModelRef.sort = 0;
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

      // 视频对象
      const video = reactive({
        videoSourceId: '',
        isFree: 0,
        sort: 1,
        fileKey: '',
        titleVideo: '添加课时',
        playAuth: ''
      });
      const playAuth = computed<string>(() => store.state.ListChapterTable.playAuth);
      const dialogVideoVisible = ref<boolean>(false);
      const playVideoByVideoId = async (videId: string,titleVideo: string)=>{
        // ElMessage.success('视频店铺！'+videId);
        video.videoSourceId = videId;
        video.titleVideo = titleVideo;
        const res: boolean = await store.dispatch('ListChapterTable/getPlayAuthData',videId);
        console.log('res---:',res)
        if(res){
          video.playAuth = playAuth.value
          dialogVideoVisible.value = true
        }else {
          ElMessage.success('播放失败，视频不存在');
        }

      }

      const videoPreviewCancel = () => {
        dialogVideoVisible.value = false;
        video.videoSourceId = '';
      }

        onMounted(()=> {
           getList(1);
           getHeaderToken()
        })

        return {
            list: list as unknown as TableListItem[],
            pagination: pagination as unknown as PaginationConfig,
            loading: loading as unknown as boolean,
            getList,
            createFormVisible: createFormVisible as unknown as boolean,
            createVideoFormVisible: createVideoFormVisible as unknown as boolean,
            setCreateFormVisible,
            setCreateVideoFormVisible,
            createSubmitLoading: createSubmitLoading as unknown as boolean,
            createVideoSubmitLoading: createVideoSubmitLoading as unknown as boolean,
            createSubmit,
            createVideoSubmit,
            detailUpdateLoading: detailUpdateLoading as unknown as number[],
            detailUpdateVideoLoading: detailUpdateVideoLoading as unknown as number[],
            openEditChapter,
            openAddVideo,
            openEditVideo,
            uploadVideoById,
            batchUploadVideoById,
            updateData: updateData as Partial<TableListItem>,
            updateVideoData: updateVideoData as Partial<TableListItem>,
            updateFormVisible: updateFormVisible as unknown as boolean,
            updateVideoFormVisible: updateVideoFormVisible as unknown as boolean,
            uploadVideoFormVisible: uploadVideoFormVisible as unknown as boolean,
            batchUploadVideoFormVisible: batchUploadVideoFormVisible as unknown as boolean,
            updataFormCancel,
            updateVideoFormCancel,
            uploadVideoFormCancel,
            batchUploadVideoFormCancel,
            updateSubmitLoading: updateSubmitLoading as unknown as boolean,
            updateVideoSubmitLoading: updateVideoSubmitLoading as unknown as boolean,
            updateSubmit,
            updateVideoSubmit,
            deleteLoading: deleteLoading as unknown as number[],
            delChapter,
            delVideo,
            tabVal: tabVal as unknown as string,
            searchOpen: searchOpen as unknown as boolean,
            setSearchOpen,
            searchModelRef,
            searchFormRef: searchFormRef as unknown as typeof ElForm,
            searchResetFields,
            searchFormSubmit,
            durationFormatDate,
            playVideoByVideoId,
            video,
            dialogVideoVisible: dialogVideoVisible as unknown as boolean,
            videoPreviewCancel,
            headerToken:headerToken as unknown as string,
            getUploadPercent,
            getBatchUploadPercent,
            detailBatchUploadLoading: detailBatchUploadLoading as unknown as number[],
        }

    }
})
</script>
