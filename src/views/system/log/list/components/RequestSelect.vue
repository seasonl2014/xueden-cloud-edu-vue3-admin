<template>
    <el-select v-model="value" clearable>
        <el-option label="请选择" value="" disabled></el-option>
      <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
      </el-option>

    </el-select>
</template>
<script lang="ts">
import { computed,reactive,toRefs, defineComponent } from "vue";

interface TypeSelectSetupData {
    value: string;
}

export default defineComponent({
    name: 'RequestSelect',
    props: {
        modelValue: {
            type: String,
            default: ''
        }
    },
    setup(props, { emit }): TypeSelectSetupData {
       // console.info("select传过来的值props:",props)
      // 定义基础数据
      const state = reactive({
        options: [{
          value: '普通请求',
          label: '普通请求'
        }, {
          value: 'Ajax请求',
          label: 'Ajax请求'
        }]
      })


        // 数据值
        const value = computed<string>({
            get: () => props.modelValue,
            set: val => {
                emit('update:modelValue', val || '');
            }
        });

        return {
          ...toRefs(state),
           value: value as unknown as string
        }



    }
})
</script>
