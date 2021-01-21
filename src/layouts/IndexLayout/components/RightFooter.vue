<template>
    <div class="indexlayout-right-footer">
      <div class="footer-links">
        <a
          href="http://java.goodym.cn"
          target="_blank"
          rel="noreferrer"
        >
          墨鱼课堂
        </a>
        <a
          href="http://www.xueden.cn"
          target="_blank"
          rel="noreferrer"
        >
          学灯网
        </a>
        <a href="http://www.goodym.cn" target="_blank" rel="noreferrer">
          马王天地
        </a>
        <a href="https://space.bilibili.com/315442890" target="_blank" rel="noreferrer">
          B站
        </a>

      </div>
      <div>Copyright © 2021 XUEDEN.CN, All Rights Reserved</div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
    name: 'RightFooter',
    components: {
    }
})
</script>
<style lang="scss" scoped>
.indexlayout-right-footer {
  height: 50px;
  overflow: hidden;
  text-align: center;
  font-size: 14px;
  color: #808695;
  .footer-links {
    margin-bottom: 10px;
    a {
      margin-right: 30px;
      color: #808695;
      text-decoration: none;
      &:last-child {
        margin-right: 0;
      }
      &:hover {
        color: #515a6e;
      }
    }
  }
}
</style>
