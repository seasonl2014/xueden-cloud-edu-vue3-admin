<template>
  <div class="indexlayout-main-conent">
    <div  class="prism-player" id="J_prismPlayer"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
export default defineComponent({
  setup(){
    onMounted(() => {
      const player = new window.Aliplayer({
        id: 'J_prismPlayer',
        width: '100%',
        autoplay: true,
        //支持播放地址播放,此播放优先级最高
        source: 'http://imgoss.goodym.cn/goodymimgupload/201903/1551922178521.mp4',
      }, function () {
        console.log('播放器创建好了。')
      });
    })
  }
})
</script>

<style scoped>

</style>
