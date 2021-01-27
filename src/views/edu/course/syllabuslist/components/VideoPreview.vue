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
      <div  class="prism-player" id="J_prismPlayer"></div>
      <el-button key="back" type="primary" @click="() => onCancel()">关闭</el-button>
    </template>




  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, onMounted , reactive, ref } from "vue";
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
      components: {
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
        // console.log('modelRef.playAuth---:',modelRef.playAuth)
       const creatAliplayer =()=> {
           player.value = new window.Aliplayer({
                  id: "J_prismPlayer",
                  autoplay: true,
                  width: "100%",
                  vid: modelRef.videoSourceId,
                  playauth: modelRef.playAuth,
                  cover:'http://java.goodym.cn/moyuplaylogo.png'
                }, function(player: any) {
                  console.log('播放器创建好了。')
                });
        }

        onMounted(() => {
          creatAliplayer()

        })
        return {
          modelRef,
          player: player as unknown as object,
        }

      }
})
</script>

<style scoped>

</style>
