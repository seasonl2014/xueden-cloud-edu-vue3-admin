<template>
    <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="onCancel"
      title="编辑"
      width="580px"
      :model-value="visible"
      @close="onCancel"
    >
        <template #footer>
            <el-button key="back" @click="() => onCancel()">取消</el-button>
            <el-button key="submit" type="primary" :loading="onSubmitLoading" @click="onFinish">提交</el-button>
        </template>

        <el-form :model="modelRef" :inline="true" :rules="rulesRef" ref="formRef" label-width="80px">
          <el-form-item label="菜单类型" prop="isMenu">
            <el-radio-group v-model="modelRef.isMenu" size="mini" style="width: 178px">
              <el-radio-button label="-1">目录</el-radio-button>
              <el-radio-button label="0">菜单</el-radio-button>
              <el-radio-button label="1">按钮</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-show="modelRef.isMenu.toString() !== '1'" label="菜单图标" prop="icon">
            <el-popover
                placement="bottom-start"
                :width="450"
                trigger="click"
                v-model:visible="popoverVisible"
            >
              <IconSelect ref="iconSelect" @selected="selected"   style="font-size: 30px"/>
              <template #reference>
                <el-input v-model="modelRef.svgIcon" style="width: 450px;" placeholder="点击选择图标" readonly>
                  <template #prefix>
                    <IconSvg v-if="modelRef.svgIcon" :type="modelRef.svgIcon"  class="el-input__icon" style="height: 32px;width: 16px;" />
                    <i v-else  class="el-input__icon el-icon-search cursor-pointer"></i>
                  </template>
                </el-input>
              </template>


            </el-popover>
          </el-form-item>

          <el-form-item v-show="modelRef.isMenu.toString() !== '1'" label="菜单名称" prop="name" >
            <el-input v-model="modelRef.name" :style=" modelRef.isMenu.toString() === '-1' ? 'width: 450px' : 'width: 178px'" placeholder="请输入名称" />
          </el-form-item>

          <el-form-item v-show="modelRef.isMenu.toString() === '1'" label="按钮名称" prop="name">
            <el-input v-model="modelRef.name" placeholder="按钮名称" style="width: 178px;" />
          </el-form-item>

          <el-form-item v-show="modelRef.isMenu.toString() !== '-1'" label="权限标识" prop="permission">
            <el-input v-model="modelRef.permission"  placeholder="权限标识" style="width: 178px;" />
          </el-form-item>

          <el-form-item label="菜单排序" prop="sort" >
            <el-input-number v-model.number="modelRef.sort" :min="0" :max="999"  controls-position="right" style="width: 178px;" />
          </el-form-item>

          <el-form-item v-show="modelRef.isMenu.toString() === '0'" label="组件名称" prop="componentName">
            <el-input v-model="modelRef.componentName" style="width: 178px;" placeholder="匹配组件内Name字段如：User" />
          </el-form-item>
          <el-form-item v-show="modelRef.isMenu.toString() === '0'" label="组件路径" prop="component">
            <el-input v-model="modelRef.component" style="width: 178px;" placeholder="如：system/user/list/index" />
          </el-form-item>


          <el-form-item v-if="modelRef.isMenu.toString() !== '1'" label="路由地址" prop="path">
            <el-input v-model="modelRef.path" placeholder="路由地址如：user" style="width: 178px;" />
          </el-form-item>


          <el-form-item  v-show="modelRef.isMenu.toString() !== '1'" label="菜单可见" prop="disShow">
            <el-radio-group v-model="modelRef.disShow" size="mini">
              <el-radio-button label="true">是</el-radio-button>
              <el-radio-button label="false">否</el-radio-button>
            </el-radio-group>
          </el-form-item>

          <el-form-item v-show="modelRef.isMenu.toString() !== '-1'" label="上级类目" prop="parentId">
            <el-cascader style="width: 450px;"
                         v-model="pid"
                         :options="menus"
                         :props="{ checkStrictly: true,expandTrigger: 'hover' }"
                         clearable
                         :show-all-levels="false"
                         @change="handleChange"></el-cascader>
          </el-form-item>
        </el-form>


    </el-dialog>
</template>
<script lang="ts">
import { defineComponent, PropType, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import { ElForm, ElMessage } from "element-plus";
import IconSelect from './IconSelect.vue';
import IconSvg from '@/components/IconSvg';
import { TableListItem } from "../data.d";
import {generateMenusTree} from "@/utils/menudata";


interface UpdateFormSetupData {
    modelRef: TableListItem;
    rulesRef: any;
    formRef: typeof ElForm;
    resetFields: () => void;
    onFinish: () => Promise<void>;
    handleChange: (val: any) => void;
    menus: object[];
    pid: any[];
    selected: (name: string) => void;
    popoverVisible: boolean;
}

export default defineComponent({
    name: 'UpdateForm',
    props: {
        menusData: {
          type: Array ,
          default: () => ([]),
          required: false
        },
        visible: {
            type: Boolean,
            required: true
        },
        values: {
            type: Object as PropType<Partial<TableListItem>>,
            required: true
        },
        onCancel: {
            type: Function,
            required: true
        },
        onSubmitLoading: {
            type: Boolean,
            required: true
        },
        onSubmit: {
            type: Function as PropType<(values: TableListItem, resetFields: () => void) => void>,
            required: true
        }
    },
    components: {
      IconSvg,
      IconSelect
    },
    setup(props): UpdateFormSetupData {

        const { t } = useI18n();
       const popoverVisible = ref<boolean>(false);
        // 表单值
        const modelRef = reactive<TableListItem>({
            id: props.values.id || 0,
            name: props.values.name || '',
            svgIcon: props.values.svgIcon || '',
            path: props.values.path || '',
            component: props.values.component || '',
            componentName: props.values.componentName || '',
            isMenu: props.values.isMenu || '',
            sort: props.values.sort || 0,
            permission: props.values.permission || '',
            parentId: props.values.parentId,
        });

        const pid = ref<unknown[]>([])
       // pid.value.push(props.values.parentId)

       console.info("父级栏目",pid.value)

        // 表单验证
        const rulesRef = reactive({
            id: [],
            name: [
                {
                    required: true,
                    validator: async (rule: any, value: string) => {
                        if (value === '' || !value) {
                            throw new Error('请输入名称');
                        } else if (value.length > 15) {
                            throw new Error('长度不能大于15个字');
                        }
                    }
                },
            ],
            desc: [],
            href: [
                {
                    required: true,
                    validator: async (rule: any, value: string) => {
                        if (value === '' || !value) {
                            throw new Error('请输入网址');
                        } else if (!/^(https?:)/.test(value)) {
                            throw new Error('请输入正确的网址');
                        }
                    },
                },
            ],
            type: [
                {
                    required: true,
                    message: '请选择'
                }
            ]
        });
        // form
        const formRef = ref<typeof ElForm>();

      const menus = ref<unknown[]>([])
      if(props.menusData!==undefined){
        menus.value = generateMenusTree(props.menusData)
      }

      // 选择栏目事件
      const handleChange = (val: any) => {
        console.info("选择了",val[val.length-1])
        modelRef.parentId = val[val.length-1]
      }

        // 重置
        const resetFields = () => {
            formRef.value?.resetFields();
        }
        // 提交
        const onFinish = async () => {
            try {
                const valid: boolean | undefined =  await formRef.value?.validate();
                if(valid === true) {
                    props.onSubmit(modelRef, resetFields);
                }
            } catch (error) {
                // console.log('error', error);
                ElMessage.warning(t('app.global.form.validatefields.catch'));
            }
        };

      // 选中图标
      const  selected = (name: string)=> {
        modelRef.svgIcon = name
        popoverVisible.value= false
      }

        return {
            modelRef,
            rulesRef,
            formRef: formRef as unknown as typeof ElForm,
            resetFields,
            onFinish,
            selected,
            popoverVisible: popoverVisible as unknown as boolean,
            handleChange,
            menus: menus as unknown as object[],
            pid: pid as unknown as any[],
        }

    }
})
</script>
