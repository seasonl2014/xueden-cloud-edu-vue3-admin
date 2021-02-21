<template>
    <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      title="编辑节"
      width="500px"
      :model-value="visible"
      @close="onCancel"
    >
        <template #footer>
            <el-button key="back" @click="() => onCancel()">取消</el-button>
            <el-button key="submit" type="primary" :loading="onSubmitLoading" @click="onFinish">提交</el-button>
        </template>

        <el-form :model="modelRef" :rules="rulesRef" ref="formRef" label-width="80px">
          <el-form-item label="节名称" prop="title">
            <el-input v-model="modelRef.title" placeholder="请输入章名称"></el-input>
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <div class="grid-content bg-purple-light">
                <el-form-item label="排序" prop="sort" >
                  <el-input-number v-model="modelRef.sort" :min="1" :max="100" label="排序"></el-input-number>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content bg-purple-light">
                <el-form-item label="是否免费" prop="isFree">
                  <el-radio v-model="modelRef.isFree" :label="0">免费</el-radio>
                  <el-radio v-model="modelRef.isFree" :label="1">收费</el-radio>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
        </el-form>
    </el-dialog>
</template>
<script lang="ts">
import { defineComponent, PropType, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import { ElForm, ElMessage } from "element-plus";

import { TableListItem } from "../data.d";


interface UpdateVideoFormSetupData {
    modelRef: TableListItem;
    rulesRef: any;
    formRef: typeof ElForm;
    resetFields: () => void;
    onFinish: () => Promise<void>;
}

export default defineComponent({
    name: 'UpdateVideoForm',
    props: {
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
    setup(props): UpdateVideoFormSetupData {

        const { t } = useI18n();

        // 表单值
        const modelRef = reactive<TableListItem>({
            id: props.values.id || 0,
            title: props.values.title || '',
            sort: props.values.sort || 0,
            courseId: props.values.courseId || 0,
            chapterId: props.values.chapterId || 0,
            isFree: props.values.isFree || 0,
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
            modelRef,
            rulesRef,
            formRef: formRef as unknown as typeof ElForm,
            resetFields,
            onFinish
        }

    }
})
</script>
