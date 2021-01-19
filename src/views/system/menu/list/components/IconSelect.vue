<template>
  <div class="icon-body">
    <el-input v-model="name" style="position: relative;" clearable placeholder="请输入图标名称">
      <template #suffix>
        <i  class="el-icon-search el-input__icon" />
      </template>

    </el-input>
    <div class="icon-list">
      <div v-for="(item) in svgIcons" class="list" :key="item" @click="selectedIcon(item)">
        <icon-svg :type="item"  style="height: 30px;width: 16px;"  />
        <span>{{item}}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent,ref } from "vue";
import { useI18n } from "vue-i18n";
import IconSvg from "@/components/IconSvg";

const requireAll = (requireContext: __WebpackModuleApi.RequireContext) =>
    requireContext.keys();
const svgIcons = requireAll(
    require.context('../../../../../assets/iconsvg', false, /\.svg$/),
).map(i => {
  const item = i.match(/\.\/(.*)\.svg/);
  return item && item[1];
});

export default defineComponent({
  components: {
    IconSvg
  },
  setup(props, { emit }) {
    const { t } = useI18n();
    // 选择图标事件
   const selectedIcon = (name: string)=>{
      // console.info("您选择的图标是：",name)
      emit('selected', name)
   }

    return {
      t,
      svgIcons,
      selectedIcon
    }
  }
})
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.icon-body {
  width: 100%;
  padding: 10px;
  .icon-list {
    height: 200px;
    overflow-y: scroll;
    div {
      height: 30px;
      line-height: 30px;
      margin-bottom: -5px;
      cursor: pointer;
      width: 33%;
      float: left;
    }
    span {
      display: inline-block;
      vertical-align: -0.15em;
      fill: currentColor;
      overflow: hidden;
      font-size: 14px;
      padding-left: 6px;
    }
  }
}
</style>
