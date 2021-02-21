<template>
     <el-table
        row-key="id"
        header-row-class-name="custom-table-header"
        v-loading="TableLoading"
        :data="TableData"
    >
        <el-table-column
            label="参数名称"
            prop="name">
            <template #default="{row}">
                <el-input v-if="row.edit" v-model="row.name" placeholder="参数名称" />
                <span v-else >{{row.name}}</span>
            </template>
        </el-table-column>
        <el-table-column
            label="参数值"
            prop="value">
            <template #default="{row}">
                <el-input v-if="row.edit" v-model="row.value" placeholder="参数值" />
                <span v-else >{{row.value}}</span>
            </template>
        </el-table-column>
        <el-table-column
            label="操作"
            prop="action"
            width="200">
            <template #default="{row}">
                <template v-if="row.edit">
                    <span v-if="row.isNew">
                        <el-button type="text" @click="saveRow(row)">添加</el-button>
                        <el-popconfirm title="是否要删除此行？" @confirm="remove(row.key)">
                            <template #reference>
                                <el-button type="text">删除</el-button>
                            </template>
                        </el-popconfirm>
                    </span>
                    <span v-else>
                        <el-button type="text" @click="saveRow(row)">保存</el-button>
                        <el-button type="text" @click="cancel(row.key)">取消</el-button>
                    </span>
                </template>
                <span v-else>
                    <el-button type="text" @click="toggle(row.id)">编辑</el-button>
                    <el-popconfirm title="是否要删除此行？" @confirm="remove(row.id)">
                        <template #reference>
                            <el-button type="text">删除</el-button>
                        </template>
                    </el-popconfirm>
                </span>
            </template>
        </el-table-column>


    </el-table>


    <el-button style="width: 100%;margin-top: 16px; border-style: dashed;" @click="newTableData" >
        <i class="el-icon-plus"></i>
        新增环境参数
    </el-button>
</template>
<script lang="ts">
import { defineComponent, PropType, ref, toRefs, watch } from "vue";
import { ElMessage } from "element-plus";
import { TableFormDataType } from '../../data';


interface TableFormSetupData {
    TableData: TableFormDataType;
    TableLoading: boolean;
    newTableData:  () => void;
    saveRow: (record: TableFormDataType) => void;
    remove: (key: number) => void;
    cancel: (key: number) => void;
    toggle: (key: number) => void;
}

export default defineComponent({
    name: 'TableForm',
    props: {
        modelValue: {
            type: Array as PropType<TableFormDataType[]>,
            required: true
        },
      courseId: {
          type: Number,
          required: true
      }
    },
    setup(props, { emit }): TableFormSetupData {

        const { modelValue,courseId } = toRefs(props);
        console.info("传过来modelValue:",modelValue.value.length)

        const TableData = ref<TableFormDataType[]>(props.modelValue);
        const TableLoading = ref<boolean>(false);

        // 新增内容
        const newIndex = ref<number>(modelValue.value.length);
        const newTableData = () => {

            const newData = TableData.value.map(item => ({ ...item }));

            newData.push({
                id: newIndex.value,
                value: '',
                name: '',
                edit: true,
                isNew: true,
                courseId: courseId.value,
            });

            newIndex.value ++;
            TableData.value = newData;
        }

        // 添加、保存
        const saveRow = (record: TableFormDataType) => {
            TableLoading.value = true;
            const { id, name, value } = record
            if (!name || !value) {
                TableLoading.value = false;
                ElMessage.error('请填写完整环境信息。')
                return
            }

            const target: any = TableData.value.find(item => item.id === id);
            if (target) {
                target.edit = false;
                target.isNew = false;
                target._originalData = undefined;
            }
            TableLoading.value = false;

            const newData = TableData.value.map(item => ({ ...item }));

            emit('update:modelValue', newData);
        }

        // 删除
        const remove = (key: number) => {
            const newData = TableData.value.filter(item => item.id !== key);
            TableData.value = newData;
            emit('update:modelValue', newData);
        }

        // 取消编辑
        const cancel = (key: number) => {
            const target: any = TableData.value.find(item => item.id === key);
            if(target) {
                Object.keys(target).forEach(key => { target[key] = target._originalData[key] });
                target._originalData = undefined;
            }
        }

        // 编辑显示
        const toggle = (key: number) => {
            const target: any = TableData.value.find(item => item.id === key);
            target._originalData = { ...target };
            target.edit = !target.edit;
        }

        watch(modelValue,()=> {
            const newData = modelValue.value.map(item => ({ ...item }));
            TableData.value = newData;
        })


        return {
            TableData: TableData as unknown as TableFormDataType,
            TableLoading: TableLoading as unknown as boolean,
            newTableData,
            saveRow,
            remove,
            cancel,
            toggle
        }


    }
})
</script>
