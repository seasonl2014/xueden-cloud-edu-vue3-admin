<template>
    <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="onCancel"
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
            <el-form-item label="名称" prop="name" >
                <el-input v-model="modelRef.name" placeholder="请输入名称" />
            </el-form-item>
          <el-form-item label="父分类" prop="parentId">
            <el-cascader
                @change="selectParentChange"
                @clear="clearParent"
                :change-on-select="true"
                :options="subjectTreeData"
                clearable
                filterable
                style="width:100%"
                :props="{ expandTrigger: 'hover', value: 'id',label: 'name',children: 'children',checkStrictly: true }"
                v-model="pKeys"
            ></el-cascader>
          </el-form-item>
            <el-form-item label="排序" prop="sort" >
              <el-input-number v-model="modelRef.sort" :min="1" :max="10" label="排序"></el-input-number>
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
}

export default defineComponent({
    name: 'CreateForm',
    props: {
      subjectTreeData: {
          type: Object,
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
          name: '',
          sort: '',
          parentId: 0
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
            sort: []
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
          modelRef.parentId = pKeys.value[len - 1];
        }else{
          modelRef.parentId=0;
        }
      }


        return {
            modelRef,
            rulesRef,
            formRef: formRef as unknown as typeof ElForm,
            resetFields,
            onFinish,
            selectParentChange,
             pKeys: pKeys as unknown as number[]
        }

    }
})
</script>
