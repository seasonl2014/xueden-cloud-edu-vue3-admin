<template>
    <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      title="新增"
      width="500px"
      :model-value="visible"
      @close="onCancel"
    >
        <template #footer>
            <el-button key="back" @click="() => onCancel()">取消</el-button>
            <el-button key="submit" type="primary" :loading="onSubmitLoading" @click="onFinish">提交</el-button>
        </template>

        <el-form :model="modelRef" :rules="rulesRef" ref="formRef" label-width="80px">
            <el-form-item label="会员名称" prop="name" >
                <el-input v-model="modelRef.name" placeholder="请输入会员名称" />
            </el-form-item>
            <el-form-item label="会员价格" prop="vipMoney" >
              <el-input-number v-model="modelRef.vipMoney"></el-input-number>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>
<script lang="ts">
import { defineComponent, PropType, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import TypeSelect from './TypeSelect.vue';
import { TableListItem } from "../data.d";
import { ElForm, ElMessage } from "element-plus";

interface CreateFormSetupData {
    modelRef: Omit<TableListItem, 'id'>;
    rulesRef: any;
    formRef: typeof ElForm;
    resetFields: () => void;
    onFinish: () => Promise<void>;
}

export default defineComponent({
    name: 'CreateForm',
    props: {
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
        TypeSelect
    },
    setup(props): CreateFormSetupData {

        const { t } = useI18n();

        // 表单值
        const modelRef = reactive<Omit<TableListItem, 'id'>>({
            name: '',
           vipMoney: 0,

        });
        // 表单验证
        const rulesRef = reactive({
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
            vipMoney: [
                {
                    required: true,
                    validator: async (rule: any, value: string) => {
                        if ( !value) {
                            throw new Error('请输入会员价格');
                        } else if (!/^([0]|[1-9][0-9]*)$/.test(value)) {
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
