<template>
    <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="onCancel"
      title="编辑"
      width="700px"
      :model-value="visible"
      @close="onCancel"
    >
        <template #footer>
            <el-button key="back" @click="() => onCancel()">取消</el-button>
            <el-button key="submit" type="primary" :loading="onSubmitLoading" @click="onFinish">提交</el-button>
        </template>

      <el-form :inline="true" :model="modelRef" :rules="rulesRef" ref="formRef" label-width="80px">

        <el-form-item label="讲师名称" prop="name" >
          <el-input v-model="modelRef.name" placeholder="请输入讲师名称" />
        </el-form-item>
        <el-form-item label="讲师排序" prop="sort" >
          <el-input-number v-model="modelRef.sort" controls-position="right" :min="0" placeholder="请输入排序"/>
        </el-form-item>

        <el-form-item label="讲师头衔">
          <el-select v-model="modelRef.level" clearable placeholder="请选择">
            <el-option :value="1" label="高级讲师"/>
            <el-option :value="2" label="首席讲师"/>
          </el-select>
        </el-form-item>

        <el-form-item label="讲师资历" prop="intro" >
          <el-input type="textarea" v-model="modelRef.intro" placeholder="请输入讲师资历" style="width: 500px;" />
        </el-form-item>

        <el-form-item label="讲师简介">
          <el-input v-model="modelRef.remarks" :rows="10" type="textarea" style="width: 500px;"/>
        </el-form-item>

        <!-- 讲师头像：TODO -->
        <el-form-item label="讲师头像">

          <el-upload
              class="avatar-uploader"
              :headers="{Authorization:headerToken}"
              :action="BASE_API+'edu/oss/upload'"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
          >
            <img v-if="modelRef.avatar" :src="modelRef.avatar" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>

        </el-form-item>


      </el-form>


    </el-dialog>
</template>
<script lang="ts">
import { defineComponent, PropType, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import { ElForm, ElMessage } from "element-plus";
import { TableListItem } from "../data.d";


interface UpdateFormSetupData {
    modelRef: TableListItem;
    rulesRef: any;
    formRef: typeof ElForm;
    resetFields: () => void;
    onFinish: () => Promise<void>;
    BASE_API: string| undefined;
    handleAvatarSuccess: (res: any, file: any) => void;

}

export default defineComponent({
    name: 'UpdateForm',
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
        onSubmitLoading: {
            type: Boolean,
            required: true
        },
        onSubmit: {
            type: Function as PropType<(values: TableListItem, resetFields: () => void) => void>,
            required: true
        }
    },
    components: {

    },
    setup(props): UpdateFormSetupData {

        const { t } = useI18n();

        // 表单值
        const modelRef = reactive<TableListItem>({
            id: props.values.id || 0,
            level: props.values.level || 1,
            name: props.values.name || '',
            sort: props.values.sort || 0,
            intro: props.values.intro || '',
            remarks: props.values.remarks || '',
            avatar: props.values.avatar || ''
        });
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
          intro: [
            {
              required: true,
              validator: async (rule: any, value: string) => {
                if (value === '' || !value) {
                  throw new Error('请输入昵称');
                } else if (value.length > 15) {
                  throw new Error('长度不能大于15个字');
                }
              }
            },
          ]
        });

        // form
        const formRef = ref<typeof ElForm>();

      const  handleAvatarSuccess = (res: any, file: any) =>{
        console.info("res值：",res.message)
        modelRef.avatar = res.message
      }

        // 重置
        const resetFields = () => {
            formRef.value?.resetFields();
        }
        // 提交
        const onFinish = async () => {
            try {
                const valid: boolean | undefined =  await formRef.value?.validate();
                if(valid === true) {
                    props.onSubmit(modelRef, resetFields);
                }
            } catch (error) {
                // console.log('error', error);
                ElMessage.warning(t('app.global.form.validatefields.catch'));
            }
        };

        return {
            BASE_API: process.env.VUE_APP_APIHOST as unknown as string, // 接口API地址
            modelRef,
            rulesRef,
            formRef: formRef as unknown as typeof ElForm,
            resetFields,
            onFinish,
            handleAvatarSuccess
        }

    }
})
</script>
<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
