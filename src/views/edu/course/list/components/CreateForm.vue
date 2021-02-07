<template>
    <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="onCancel"
      title="新增"
      width="800px"
      :model-value="visible"
      @close="onCancel"
    >
        <template #footer>
            <el-button key="back" @click="() => onCancel()">取消</el-button>
            <el-button key="submit" type="primary" :loading="onSubmitLoading" @click="onFinish">保存并下一步</el-button>
        </template>

      <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px;">
        <el-step title="填写课程基本信息"/>
        <el-step title="完善课程详情"/>
        <el-step title="创建课程大纲"/>
        <el-step title="提交审核"/>
      </el-steps>

        <el-form :model="modelRef" :rules="rulesRef" ref="formRef" label-width="80px">
            <el-form-item label="长标题" prop="title" >
                <el-input v-model="modelRef.title" placeholder="课程长标题" />
            </el-form-item>

          <el-form-item label="短标题" prop="shortTitle" >
            <el-input v-model="modelRef.shortTitle" placeholder="课程短标题" />
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item label="课程分类" prop="subjectId">
                <el-cascader
                    @change="selectParentChange"
                    :change-on-select="true"
                    :options="subjectTreeData"
                    filterable
                    style="width:100%"
                    :props="{ expandTrigger: 'hover', value: 'id',label: 'name',children: 'children' }"
                    v-model="pKeys"
                ></el-cascader>
              </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="课程类型">
                  <el-select v-model="modelRef.courseType" placeholder="请选择课程类型">
                    <el-option label="新手入门" value="0"></el-option>
                    <el-option label="免费好课" value="1"></el-option>
                    <el-option label="技能提高" value="2"></el-option>
                    <el-option label="实战开发" value="3"></el-option>
                  </el-select>
                </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="选择讲师">
                <el-select v-model="modelRef.teacherId" placeholder="请选择讲师">
                  <el-option
                      v-for="teacher in teachers"
                      :key="teacher.id"
                      :label="teacher.name"
                      :value="teacher.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="课程难度">
                  <el-select v-model="modelRef.difficulty" placeholder="请选择课程难度">
                    <el-option label="入门" value="0"></el-option>
                    <el-option label="初级" value="1"></el-option>
                    <el-option label="中级" value="2"></el-option>
                    <el-option label="高级" value="3"></el-option>
                  </el-select>
                </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="课程封面" prop="cover">
            <!-- 图片上传部分 -->
            <el-upload
                :headers="{Authorization:headerToken}"
                :action="uploadApi"
                :class="{ disabled: uploadDisabled }"
                list-type="picture-card"
                :limit="limitcount"
                :on-change="handleChange"
                :on-remove="handleRemove"
                accept="image/*"
                :on-success="handleSuccess"
                ref="upload"
                :on-preview="handlePictureCardPreview"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>

          <el-row>
            <el-col :span="12">
              <el-form-item label="价格" prop="sort" >
                <el-input-number v-model="modelRef.price" :min="0" :max="500" label="价格"></el-input-number>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="课时" prop="sort" >
                <el-input-number v-model="modelRef.lessonNum" :min="1" :max="1000" label="课时"></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="课程描述">
            <el-input type="textarea" v-model="modelRef.courseDesc"></el-input>
          </el-form-item>
        </el-form>


    </el-dialog>
</template>
<script lang="ts">
import { defineComponent, PropType, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import { TableListItem } from "../data.d";
import { ElForm, ElMessage } from "element-plus";

interface CreateFormSetupData {
    modelRef: Omit<TableListItem, 'id'>;
    rulesRef: any;
    formRef: typeof ElForm;
    resetFields: () => void;
    onFinish: () => Promise<void>;
    pKeys: number[];
    selectParentChange: () => void;
    uploadApi: string;
    handleSuccess: (response: any, file: any, fileList: any) => void;
}

export default defineComponent({
    name: 'CreateForm',
    props: {
      headerToken: {
        type: String,
        required: true
      },
      subjectTreeData: {
          type: Object,
          required: true
        },
        teachers: {
          type: Array,
          required: true
        },
        visible: {
            type: Boolean,
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
            type: Function as PropType<(values: Omit<TableListItem, 'id'>, resetFields: () => void) => void>,
            required: true
        }
    },
    components: {

    },
    setup(props): CreateFormSetupData {

        const { t } = useI18n();

        // 父节点数组
      const pKeys = ref<number[]>([]);

        // 表单值
        const modelRef = reactive<Omit<TableListItem, 'id'>>({
          title: '',
          shortTitle: '',
          price: 0,
          lessonNum: 0

        });
        // 表单验证
        const rulesRef = reactive({
          title: [
                {
                    required: true,
                    validator: async (rule: any, value: string) => {
                        if (value === '' || !value) {
                            throw new Error('请输入名称');
                        } else if (value.length > 105) {
                            throw new Error('长度不能大于105个字');
                        }
                    }
                },
            ],
          shortTitle: [
            {
              required: true,
              validator: async (rule: any, value: string) => {
                if (value === '' || !value) {
                  throw new Error('请输入名称');
                } else if (value.length > 35) {
                  throw new Error('长度不能大于35个字');
                }
              }
            },
          ],
          teacherId: [{required: true}],
          subjectId: [{required: true}],
          courseType: [{required: true}],
          difficulty: [{required: true}],
          lessonNum: [{required: true}],
          price: [{required: true}]
        });
        // form
        const formRef = ref<typeof ElForm>();
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
      //父级分类中改变
      const selectParentChange = ()=> {
        const len = pKeys.value.length;
        if (len > 0) {
          modelRef.subjectParentId = pKeys.value[0];
          modelRef.subjectId = pKeys.value[len - 1];
        }else{
          modelRef.subjectId=0;
          modelRef.subjectParentId=0;
        }
      }
      const handleSuccess = (response: any, file: any, fileList: any) =>{
        // console.info("上传图片返回信息",response)
        modelRef.cover = response.data.urlPath;
      }

        return {
            modelRef,
            rulesRef,
            formRef: formRef as unknown as typeof ElForm,
            resetFields,
            onFinish,
            selectParentChange,
            handleSuccess,
             pKeys: pKeys as unknown as number[],
             uploadApi: process.env.VUE_APP_APIHOST+'edu/oss/upload',
        }

    }
})
</script>
