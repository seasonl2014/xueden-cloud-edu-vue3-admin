<template>
    <div class="indexlayout-main-conent">
        <el-card shadow="never" class="cus-card" style="margin-bottom: 15px" :body-style="{ 'padding-bottom': '0' }">
            <el-form :model="searchModelRef" ref="searchFormRef" label-width="120px">
                <el-row :gutter="16" type="flex" justify="end" class="flex-wrap-wrap">
                    <el-col :xs="24" :sm="24" :md="24" :lg="6" :xl="6">
                        <el-form-item  label="用户账号：">
                            <el-input placeholder="请输入" v-model="searchModelRef.username" />
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="6" :xl="6">
                        <el-form-item  label="行为：">
                            <el-input placeholder="请输入" v-model="searchModelRef.title" />
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="6" :xl="6">
                      <el-form-item  label="操作方式：">
                        <TypeSelect placeholder="请选择" v-model="searchModelRef.type" style="width:100%" />
                      </el-form-item>
                    </el-col>
                    <el-col v-if='searchOpen' :xs="24" :sm="24" :md="24" :lg="6" :xl="6">
                      <el-form-item  label="请求类型：">
                        <RequestSelect :selectValue="[234, 266, 273]" placeholder="请选择" v-model="searchModelRef.href" style="width:100%" />
                      </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="6" :xl="6">
                        <div class="text-align-right" style="padding-bottom: 24px" >
                            <el-button type="primary" @click="searchFormSubmit">查询</el-button>
                            <el-button  @click="searchResetFields">重置</el-button>
                            <el-button type="text" style="margin-left: 8px" @click="setSearchOpen">
                                <template v-if="searchOpen">
                                    收起 <i class="el-icon-arrow-up" ></i>
                                </template>
                                <template v-else>
                                    展开 <i class="el-icon-arrow-down"></i>
                                </template>
                            </el-button>
                        </div>
                    </el-col>
                </el-row>
            </el-form>

        </el-card>

        <el-card shadow="never" class="cus-card">
          <template #header>
              <el-row>
                    <el-col :span="8">
                        <el-button v-permission="'sys:log:delete'" type="danger" @click="() => deleteBatchTableData()">批量删除</el-button>
                    </el-col>
            </el-row>
          </template>


            <el-table
                row-key="id"
                ref="multipleTable"
                :data="list"
                v-loading="loading"
                @selection-change="handleSelectionChange"
            >

                <el-table-column type="expand">
                  <template #default="{row}">
                    <el-form label-position="left" inline class="demo-table-expand">
                      <el-form-item label="请求参数">
                        <span>{{ row.params }}</span>
                      </el-form-item>
                      <el-form-item label="返回值">
                        <span>{{ row.response }}</span>
                      </el-form-item>
                    </el-form>
                  </template>
                </el-table-column>
                <el-table-column type="selection" width="55" />
                <el-table-column
                    type="index"
                    label="序号"
                    :index="(index) => {
                        return (pagination.current - 1) * pagination.pageSize + index + 1;
                    }"
                    width="80">
                </el-table-column>

              <el-table-column
                  label="操作者"
                  prop="username"
                  width="80">
              </el-table-column>

                <el-table-column
                    label="请求类型"
                    prop="type"
                    width="80">
                </el-table-column>

                <el-table-column
                    label="行为"
                    prop="title"
                    width="130">
                </el-table-column>

              <el-table-column
                  label="请求地址"
                  prop="requestUri">
              </el-table-column>

              <el-table-column
                  label="请求方法"
                  prop="classMethod">
              </el-table-column>

              <el-table-column
                  label="来源">
                <template #default="{row}">
                  <el-tag  type="success">{{ row.area }}-{{row.province}}-{{row.city}}-{{row.isp}}</el-tag>
                </template>
              </el-table-column>

                <el-table-column
                    label="操作方式"
                    prop="httpMethod"
                    width="80">
                    <template #default="{row}">
                        <el-tag v-if="row.httpMethod === 'POST'" type="success">{{ row.httpMethod }}</el-tag>
                        <el-tag v-else type="error">{{ row.httpMethod }}</el-tag>
                    </template>
                </el-table-column>

              <el-table-column
                  label="创建时间"
                  prop="createDate"
              width="155">
                <template #default="scope">
                  <i class="el-icon-time"></i>
                  <span style="margin-left: 1px">{{ scope.row.createDate }}</span>
                </template>
              </el-table-column>

                <el-table-column
                    label="操作"
                    prop="action"
                    width="70">
                    <template #default="{row}">
                        <el-button v-permission="'sys:log:delete'" type="danger" plain  @click="() => deleteTableData(row.id)" :loading="deleteLoading.includes(row.id)">删除</el-button>
                    </template>
                </el-table-column>

            </el-table>

            <div class="padding-t10 text-align-right">
                <el-pagination
                    background
                    layout="total,prev, pager, next"
                    v-model:current-page="pagination.current"
                    :page-size="pagination.pageSize"
                    :total="pagination.total"
                    @current-change="(p) => {
                        getList(p || 1);
                    }">
                </el-pagination>
            </div>

        </el-card>
    </div>
</template>
<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref,toRefs } from "vue";
import { useStore } from "vuex";
import { ElMessageBox, ElMessage, ElForm } from "element-plus";
import TypeSelect from './components/TypeSelect.vue';
import RequestSelect from './components/RequestSelect.vue';
import { StateType as ListStateType } from "./store";
import { PaginationConfig, TableListItem } from './data.d';
import vPermission from '@/directives/permission';
interface ListSearchTablePageSetupData {
    list: TableListItem[];
    pagination: PaginationConfig;
    loading: boolean;
    getList:  (current: number) => Promise<void>;
    deleteLoading: number[];
    deleteTableData:  (id: number) => void;
    deleteBatchTableData: () => void;
    tabVal: string;
    searchOpen: boolean;
    setSearchOpen: () => void;
    searchModelRef: Omit<TableListItem, 'id'>;
    searchFormRef: typeof ElForm;
    searchResetFields: () => void;
    searchFormSubmit: () => Promise<void>;
    handleSelectionChange: (val: any) => void;
    ids: string[];
}

export default defineComponent({
    name: 'ListSearchTablePage',
    components: {
        TypeSelect,
        RequestSelect
    },
    directives: {
      permission: vPermission
    },
    setup(): ListSearchTablePageSetupData {

      // 定义基础数据
      const state = reactive({
        typeOptions: [{
          value: 'POST',
          label: 'POST'
        }, {
          value: 'GET',
          label: 'GET'
        }]
      })

        const store = useStore<{ ListSearchTable: ListStateType}>();


        // 列表数据
        const list = computed<TableListItem[]>(() => store.state.ListSearchTable.tableData.list);

        // 列表分页
        const pagination = computed<PaginationConfig>(() => store.state.ListSearchTable.tableData.pagination);

        // 获取数据
        const loading = ref<boolean>(true);
        const getList = async (current: number): Promise<void> => {
            loading.value = true;
            await store.dispatch('ListSearchTable/queryTableData', {
                per: pagination.value.pageSize,
                page: current,
              // eslint-disable-next-line @typescript-eslint/camelcase,@typescript-eslint/no-use-before-define
                s_username: searchModelRef.username,
              // eslint-disable-next-line @typescript-eslint/camelcase, @typescript-eslint/no-use-before-define
                s_method: searchModelRef.type,
              // eslint-disable-next-line @typescript-eslint/camelcase, @typescript-eslint/no-use-before-define
                s_title: searchModelRef.title,
              // eslint-disable-next-line @typescript-eslint/camelcase, @typescript-eslint/no-use-before-define
                s_type: searchModelRef.href
            });
            loading.value = false;
        }

        // 删除 loading
        const deleteLoading = ref<number[]>([]);
        // 删除
        const deleteTableData = (id: number) => {

            ElMessageBox.confirm('确定删除吗？', '删除',{
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(async () => {
                deleteLoading.value = [id];
                const res: boolean = await store.dispatch('ListSearchTable/deleteTableData',id);
                if (res === true) {
                    ElMessage.success('删除成功！');
                    await getList(pagination.value.current);
                }
                deleteLoading.value = [];
            }).catch((error: any) =>{
                console.log(error)
            });

        }

      // 选中表格ID
      const ids = ref<string[]>([]);

        // 获取表格多选数据函数
      const handleSelectionChange = (val: any)=> {
          ids.value=val
      }

        // 批量删除
      const deleteBatchTableData = () => {

        if(ids.value.length===0){
          ElMessageBox.alert("请选择需要删除的行","温馨提示")
          return null;
        }else{
          console.info("ids.value:",ids.value)
          for (const i in ids.value) {
            console.info("log1111:",ids.value[i])
          }

        }

        ElMessageBox.confirm('确定要删除这些数据吗？', '删除',{
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(async () => {



          const res: boolean = await store.dispatch('ListSearchTable/deleteBatchTableData',ids.value);
          if (res === true) {
            ElMessage.success('删除成功！');
            await getList(pagination.value.current);
          }
          deleteLoading.value = [];
        }).catch((error: any) =>{
          console.log(error)
        });

      }


        const tabVal = ref<string>('all');

        // 搜索
        const searchOpen = ref<boolean>(false);
        const setSearchOpen = (): void => {
            searchOpen.value = !searchOpen.value;
        }
        // 表单值
        const searchModelRef = reactive<Omit<TableListItem, 'id'>>({
          username: '',
          title: '',
          href: '',
          type: ''
        });
        // search form
        const searchFormRef = ref<typeof ElForm>();
        // 重置
        const searchResetFields = () => {
            searchFormRef.value?.resetFields();
            searchModelRef.username = '';
            searchModelRef.title = '';
            searchModelRef.href = '';
            searchModelRef.type = '';
        }
        // 搜索
        const searchFormSubmit = async () => {
            try {
              console.log('search', searchModelRef);
              await getList(1);
            } catch (error) {
                ElMessage.warning(error);
            }
        }

        onMounted(()=> {
           getList(1);
        })

        return {
            list: list as unknown as TableListItem[],
            pagination: pagination as unknown as PaginationConfig,
            loading: loading as unknown as boolean,
            getList,
            deleteLoading: deleteLoading as unknown as number[],
            deleteTableData,
            deleteBatchTableData,
            tabVal: tabVal as unknown as string,
            searchOpen: searchOpen as unknown as boolean,
            setSearchOpen,
            searchModelRef,
            ...toRefs(state),
            searchFormRef: searchFormRef as unknown as typeof ElForm,
            searchResetFields,
            searchFormSubmit,
            handleSelectionChange,
           ids: ids as unknown as string[]
        }

    }
})
</script>

<style scoped>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 70px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 100%;
}
.demo-table-expand .el-form-item__content {
  font-size: 12px;
}

.demo-table-expand .el-form-item__label {
  font-weight: 700 !important;
}

</style>
