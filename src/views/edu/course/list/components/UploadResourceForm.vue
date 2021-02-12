<template>
    <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :title="modelRef.title"
      width="400px"
      :model-value="visible"
      @close="onCancel"
    >
        <template #footer>
            <el-button key="back" type="primary" @click="() => onCancel()">关闭</el-button>
        </template>

        <el-form :model="modelRef" :rules="rulesRef" ref="formRef" label-width="80px">
          <el-upload
              ref="videoUpload"
              :headers="{Authorization:headerToken}"
              :action="uploadApi"
              :data="modelRef"
              :before-upload="handleProgress"
              :on-progress="fileOnProgress"
              :limit="1"
              class="upload-demo"
              drag
              :show-file-list="false"
              :on-success="FileOnSuccess"
              multiple>
            <i class="el-icon-upload"/>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div  class="el-upload__tip">只能上传zip、rar文件，且不超过500mb</div>
          </el-upload>
          <!--进度条-->
          <el-progress v-show="showProgress" :text-inside="true" :stroke-width="24" :percentage="uploadPercent" status="success"></el-progress>

        </el-form>
    </el-dialog>
</template>
<script lang="ts">
import { defineComponent, PropType, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import { ElForm, ElMessage } from "element-plus";
import {Md5} from 'ts-md5/dist/md5';
import { TableListItem } from "../data.d";
import {ResponseData} from "@/utils/request";


interface UpdateVideoFormSetupData {
    modelRef: TableListItem;
    rulesRef: any;
    formRef: typeof ElForm;
    resetFields: () => void;
    uploadApi: string;
    handleProgress: (file: any) => void;
    showProgress: boolean; // 是否显示进度条
    FileOnSuccess: (response: any, file: any, fileList: any) => void;
    uploadPercent: number;//上传视频进度比
    fileOnProgress: (event: any, file: any, fileList: any) => void;
}

export default defineComponent({
    name: 'UpdateVideoForm',
    props: {
        headerToken: {
          type: String,
          required: true
        },
        visible: {
            type: Boolean,
            required: true
        },
        values: {
            type: Object as PropType<Partial<TableListItem>>,
            required: true
        },
        onCancel: {
            type: Function,
            required: true
        },
        getPercent: {
          type: Function as PropType<(values: string) => number>,
          required: true
        }
    },
    components: {

    },
    setup(props): UpdateVideoFormSetupData {

        const { t } = useI18n();

        const showProgress = ref<boolean>(false);

        const uploadPercent = ref<number>(0);

      /**
       * 定时查询上传进度 1秒查一次
       */
          // 定时器
      let intervalId: any = null

        // 表单值
        const modelRef = reactive<TableListItem>({
            id: props.values.id || 0,
            title: props.values.title || '',
        });

      /**
       * 获取进度条
       */
     const getUploadPercent= async ()=>{
        const fileKey: string = modelRef.fileKey===undefined?"":modelRef.fileKey
        //console.log("传参fileKey：",fileKey)
        const response: number = await props.getPercent(fileKey)
        // console.log("返回值111：",response)
        if(response >= 100){
          clearInterval(intervalId)
          uploadPercent.value = 100
        }else {
          uploadPercent.value = response
        }
      }


     const showStatus=()=> {
        intervalId =  setInterval(getUploadPercent, 1000)
      }
       //控制上传中状态
        const i = ref<number>(0)
      /**
       * 上传视频进度条
       */
     const handleProgress=(file: any)=> {
        // 文件标志
        const fileDetails = file.name+file.size+file.type+file.lastModifiedDate;
        //使用当前文件的信息用md5加密生成一个key 这个加密是根据文件的信息来加密的  如果相同的文件 加的密还是一样的
        const key = Md5.hashStr(fileDetails);
        //console.info(key);
        modelRef.fileKey = key.toString()
        if (i.value === 0) { // 控制上传中状态只执行一次上传
          showStatus()
          showProgress.value = true
          i.value = 1
        }
      }

      //文件上传时
     const fileOnProgress=(event: any, file: any, fileList: any)=>{
       // console.log("文件上传时file----------------",file)
        //console.log("文件上传时fileList----------------",fileList)
      // console.log("文件上传时event----------------",event)

      }

      // 文件上传成功
     const FileOnSuccess=(response: any, file: any, fileList: any)=>{
       //console.info("文件上传成功后：",response)
        // 进度条隐藏
        showProgress.value = false
        // 重置uploadPercent上传进度条
        //this.resetPercent()
       ElMessage.success(response.message);
       clearInterval(intervalId);

      }

        // 表单验证
        const rulesRef = reactive({
            id: [],
            name: [
                {
                    required: true,
                    validator: async (rule: any, value: string) => {
                        if (value === '' || !value) {
                            throw new Error('请输入名称');
                        } else if (value.length > 15) {
                            throw new Error('长度不能大于15个字');
                        }
                    }
                },
            ],
            desc: [],
            href: [
                {
                    required: true,
                    validator: async (rule: any, value: string) => {
                        if (value === '' || !value) {
                            throw new Error('请输入网址');
                        } else if (!/^(https?:)/.test(value)) {
                            throw new Error('请输入正确的网址');
                        }
                    },
                },
            ],
            type: [
                {
                    required: true,
                    message: '请选择'
                }
            ]
        });
        // form
        const formRef = ref<typeof ElForm>();
        // 重置
        const resetFields = () => {
            formRef.value?.resetFields();
        }


        return {
            modelRef,
            rulesRef,
            formRef: formRef as unknown as typeof ElForm,
            resetFields,
            uploadApi: process.env.VUE_APP_APIHOST+'edu/oss/uploadCourseResource',
            handleProgress,
            showProgress: showProgress as unknown as boolean,
            FileOnSuccess,
            fileOnProgress,
            uploadPercent: uploadPercent as unknown as number,
        }

    }
})
</script>
