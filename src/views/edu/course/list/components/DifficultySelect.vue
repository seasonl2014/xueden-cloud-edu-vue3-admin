<template>
    <el-select v-model="value" clearable>
         <el-option label="请选择" :value="-1" disabled></el-option>
        <el-option label="入门" :value="0"></el-option>
        <el-option label="初级" :value="1"></el-option>
        <el-option label="中级" :value="2"></el-option>
        <el-option label="高级" :value="3"></el-option>
    </el-select>
</template>
<script lang="ts">
import { computed, defineComponent } from "vue";

interface TypeSelectSetupData {
    value: number;
}

export default defineComponent({
    name: 'DifficultySelect',
    props: {
        modelValue: {
            type: Number,
            default: 0
        },
    },
    setup(props, { emit }): TypeSelectSetupData {

        // 数据值
        const value = computed<number>({
            get: () => props.modelValue,
            set: val => {
                emit('update:modelValue', val || 0);
            }
        });

        console.info("value:",value.value)
        return {
            value: value as unknown as number
        }



    }
})
</script>
