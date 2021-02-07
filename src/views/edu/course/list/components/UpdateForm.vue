<template>
    <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      title="编辑"
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
                  <el-option
                      v-for="item in courseTypeOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="选择讲师" prop="teacherId">
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
              <el-form-item label="课程难易">
                <el-select v-model="modelRef.difficulty" placeholder="请选择课程难易">
                  <el-option
                      v-for="item in difficultyOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                  ></el-option>
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
                :limit="1"
                :on-change="handleChange"
                :on-remove="handleRemove"
                accept="image/*"
                :on-success="handleSuccess"
                ref="upload"
                :on-preview="handlePictureCardPreview"
                :file-list="imgFilesList"
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
import { ElForm, ElMessage } from "element-plus";
import { TableListItem } from "../data.d";


interface UpdateFormSetupData {
    modelRef: TableListItem;
    rulesRef: any;
    formRef: typeof ElForm;
    resetFields: () => void;
    onFinish: () => Promise<void>;
    pKeys: any[];
    difficultyOptions: object[];
    courseTypeOptions: object[];
    imgFilesList: object[];
    uploadApi: string;
    handleSuccess: (response: any, file: any, fileList: any) => void;
}

export default defineComponent({
    name: 'UpdateForm',
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
      // 父节点数组
      const pKeys = ref<any[]>([]);

      // 课程难易程度
      const difficultyOptions = ref<object[]>([
        {
          value: 0,
          label: '入门'
        }, {
          value: 1,
          label: '初级'
        }, {
          value: 2,
          label: '中级'
        }, {
          value: 3,
          label: '高级'
        }
      ]);


      // 课程类型
      const courseTypeOptions = ref<object[]>([
        {
          value: 0,
          label: '新手入门'
        }, {
          value: 1,
          label: '免费好课'
        }, {
          value: 2,
          label: '技能提高'
        }, {
          value: 3,
          label: '实战开发'
        }
      ]);

      // 封面图片
      const imgFilesList = ref<object[]>([]);
      imgFilesList.value.push({
                url: props.values.cover,
                name: props.values.title,
                id: props.values.id
      });

      // 表单值
        const modelRef = reactive<TableListItem>({
            id: props.values.id || 0,
            title: props.values.title || '',
            shortTitle: props.values.shortTitle || '',
            courseType: props.values.courseType || 0,
            difficulty: props.values.difficulty || 0,
            price: props.values.price || 0,
            lessonNum: props.values.lessonNum || 0,
            cover: props.values.cover || '',
            teacherId: props.values.teacherId || 0,
            subjectId: props.values.subjectId || 0,
            remarks: props.values.remarks || '',
        });
        pKeys.value = [props.values.subjectParentId,props.values.subjectId]

       /* console.info("编辑课程ID:",props.values.id)*/

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
            remarks: []
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

        // 上传封面图片完成后
      const handleSuccess = (response: any, file: any, fileList: any) =>{
       /* console.info("上传图片返回信息",response)*/
        modelRef.cover = response.data.urlPath;
      }

        return {
            modelRef,
            rulesRef,
            formRef: formRef as unknown as typeof ElForm,
            resetFields,
            onFinish,
            handleSuccess,
            pKeys: pKeys as unknown as any[],
            difficultyOptions: difficultyOptions as unknown as object[],
            courseTypeOptions: courseTypeOptions as unknown as object[],
            imgFilesList: imgFilesList as unknown as object[],
            uploadApi: process.env.VUE_APP_APIHOST+'edu/oss/upload',
        }

    }
})
</script>
