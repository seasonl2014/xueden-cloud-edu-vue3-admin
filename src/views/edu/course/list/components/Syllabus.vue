<template>
  <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      title="课程大纲"
      width="1200px"
      :model-value="visible"
      @close="onCancel"
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
import {  defineComponent } from "vue";
import { useI18n } from "vue-i18n";
import SyllabusTable from '@/views/edu/course/syllabuslist/index.vue';
import { ElForm, ElMessage } from "element-plus";

interface SyllabusSetupData {
  onFinish: () => Promise<void>;
}

export default defineComponent({
  name: 'Syllabus',
  components: {
    SyllabusTable
  },
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    onCancel: {
      type: Function,
      required: true
    },
  },
  setup(): SyllabusSetupData {
    const { t } = useI18n();
  // 提交
    const onFinish = async () => {
      try {
        ElMessage.success("提交课程大纲审核")
          //props.onSubmit(modelRef, resetFields);
      } catch (error) {
        // console.log('error', error);
        ElMessage.warning(t('app.global.form.validatefields.catch'));
      }
    };

    return {
      onFinish
    }

  }
})
</script>

<style scoped>

</style>
