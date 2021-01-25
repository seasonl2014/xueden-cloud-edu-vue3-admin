<template>
  <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :title="modelRef.titleVideo"
      width="700px"
      :model-value="visible"
      @close="onCancel"
  >
    <template #footer>
      <el-button key="back" type="primary" @click="() => onCancel()">关闭</el-button>
    </template>

    <div id="J_prismPlayer" class="prism-player"/>

  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive, ref } from "vue";
import {  ElMessage } from "element-plus";

interface VideoPreviewSetupData {
  modelRef: object;
  player: object; // 视频播放器对象
}
export default defineComponent({
      name: "VideoPreview",
      props: {
          visible: {
            type: Boolean,
            required: true
          },
          values: {
            type: Object,
            required: true
          },
          onCancel: {
            type: Function,
            required: true
          }

      },
      setup(props): VideoPreviewSetupData{
        // 表单值
        const modelRef = reactive({
          videoSourceId: props.values.videoSourceId ,
          isFree: props.values.isFree | 0,
          sort: props.values.sort | 1,
          fileKey: props.values.fileKey ,
          titleVideo: props.values.titleVideo ,
          playAuth: props.values.playAuth,
        });

        const player = ref<any>()

       /*const creatAliplayer =()=> {

        }*/


        // ElMessage.success('视频源ID！'+modelRef.titleVideo);
        return {
          modelRef,
          player: player as unknown as object,
        }

      }
})
</script>

<style scoped>

</style>
