<template>
    <el-drawer
      size="360px"
      :title="title"
      :model-value="visible"
      @close="onClose"
    >

        <div class="content">
            <el-form :model="modelRef" ref="formRef">
                <el-form-item label="课程类型">
                    <TypeSelect v-model="modelRef.courseType" style="width:100%" />
                </el-form-item>

                <el-form-item label="课程难度" >
                  <DifficultySelect v-model="modelRef.difficulty" style="width:100%" />
                </el-form-item>

            </el-form>
        </div>


        <div :style="{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            borderTop: '1px solid #e8e8e8',
            padding: '10px 16px',
            textAlign: 'right',
            left: 0,
            background: '#fff',
            borderRadius: '0 0 4px 4px',
        }">
            <div class="text-align-right">
                <el-button style="margin-right: 8px" @click="onClose">
                    取消
                </el-button>
                <el-button type="primary" @click="onSearch">
                    搜索
                </el-button>
            </div>
        </div>


    </el-drawer>
</template>
<script lang="ts">
import { defineComponent, PropType, reactive, ref } from "vue";
import { ElForm } from "element-plus";
import TypeSelect from './TypeSelect.vue';
import DifficultySelect from './DifficultySelect.vue';
import { TableListItem } from "../data.d";


export default defineComponent({
    name: 'SearchDrawer',
    props: {
        visible: {
            type: Boolean,
            required: true
        },
        title: {
            type: String,
            default: '高级搜索'
        },
        onClose: {
            type: Function,
            required: true
        },
        onSubmit: {
            type: Function as PropType<(values: Omit<TableListItem, 'id'>) => void>,
            required: true
        }
    },
    components: {
        TypeSelect,
        DifficultySelect
    },
    setup(props) {

        // 表单值
        const modelRef = reactive<Omit<TableListItem, 'id'>>({
          title: '',
          shortTitle: '',
          courseType: 0,
          difficulty: 0
        });


         // form
        const formRef = ref<typeof ElForm>();

        const onSearch = async () => {
             try {
                props.onSubmit(modelRef);
            } catch (error) {
                // console.log('error', error);
            }
        }

        return {
            modelRef,
            formRef,
            onSearch
        }


    }

})
</script>
<style lang="scss" scoped>
.content {
    padding: 20px;
    position:absolute;
    top: 56px;
    left: 0;
    right: 0;
    bottom: 55px;
    overflow: auto;
}
</style>
