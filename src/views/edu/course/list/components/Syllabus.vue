<template>
  <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :title="values.title"
      width="1200px"
      :model-value="visible"
      @close="onCancel"
      :destroy-on-close="true"
  >

    <template #footer>
      <el-button key="back" @click="() => onCancel()">取消</el-button>
      <el-button key="submit" type="primary" @click="onFinish">提交</el-button>
    </template>

    <el-steps :active="3" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="完善课程详情"/>
      <el-step title="创建课程大纲"/>
      <el-step title="提交审核"/>
    </el-steps>

    <!-- 表格部分 -->
    <SyllabusTable/>
  </el-dialog>
</template>

<script lang="ts">
import {  defineComponent,PropType,reactive,ref } from "vue";
import { useI18n } from "vue-i18n";
import SyllabusTable from '@/views/edu/course/syllabuslist/index.vue';
import { ElForm, ElMessage } from "element-plus";
import {TableListItem} from "@/views/edu/course/list/data";

interface SyllabusSetupData {
  modelRef: TableListItem;
  resetFields: () => void;
  onFinish: () => Promise<void>;
}

export default defineComponent({
  name: 'Syllabus',
  components: {
    SyllabusTable
  },
  props: {
    values: {
      type: Object as PropType<Partial<TableListItem>>,
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
    onSubmit: {
      type: Function as PropType<(values: TableListItem, resetFields: () => void) => void>,
      required: true
    }
  },
  setup(props): SyllabusSetupData {
    const { t } = useI18n();
    // form
    const formRef = ref<typeof ElForm>();
    // 重置
    const resetFields = () => {
      formRef.value?.resetFields();
    }
    // 表单值
    const modelRef = reactive<TableListItem>({
      id: props.values.id || 0,
      title: props.values.title || '',
    });

  // 提交
    const onFinish = async () => {
      try {
          //ElMessage.success("提交课程大纲审核")
          props.onSubmit(modelRef, resetFields);
      } catch (error) {
        // console.log('error', error);
        ElMessage.warning(t('app.global.form.validatefields.catch'));
      }
    };

    return {
      modelRef,
      resetFields,
      onFinish
    }

  }
})
</script>

<style scoped>

</style>
