<template>
    <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      title="课程详情"
      width="1024px"
      :model-value="visible"
      @close="onCancel"
    >
        <template #footer>
            <el-button key="back" @click="() => onCancel()">取消</el-button>
            <el-button key="submit" type="primary" :loading="onSubmitLoading" @click="onFinish">保存并下一步</el-button>
        </template>

      <el-steps :active="2" process-status="wait" align-center style="margin-bottom: 40px;">
        <el-step title="填写课程基本信息"/>
        <el-step title="完善课程详情"/>
        <el-step title="创建课程大纲"/>
        <el-step title="提交审核"/>
      </el-steps>
      <el-form :model="modelRef" :rules="rulesRef" ref="formRef" label-width="80px">
              <div class="indexlayout-main-conent">
                <el-card shadow="never" class="cus-card">
                  <template #header>
                    课程详情:
                  </template>
                  <CKEditor v-model="modelRef.remarks" />
                </el-card>
              </div>
      </el-form>
    </el-dialog>
</template>
<script lang="ts">
import { defineComponent, PropType, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import { ElForm, ElMessage } from "element-plus";
import { TableListItem } from "../data.d";
import CKEditor from "@/components/CKEditor/index.vue";

interface RemarksFormSetupData {
    modelRef: TableListItem;
    rulesRef: any;
    formRef: typeof ElForm;
    resetFields: () => void;
    onFinish: () => Promise<void>;
}

export default defineComponent({
    name: 'RemarksForm',
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
      CKEditor
    },
    setup(props): RemarksFormSetupData {

        const { t } = useI18n();
        // 表单值
        const modelRef = reactive<TableListItem>({
            id: props.values.id || 0,
            remarks: props.values.remarks || '',
        });

        console.info("课程详情编辑课程ID:",props.values.id)
        console.info("课程详情remarks:",props.values.remarks)
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
