<template>
      <el-card shadow="never" class="cus-card homeBoxCard" v-loading="loading">
          <template #header>
            <span>{{t('page.home.logschartcard.card-title')}}</span>
            <el-tag type="warning" class="float-right">{{t('page.home.text-immediate')}}</el-tag>
          </template>
          <div class="num">{{total.toLocaleString()}}</div>
          <div class="height40" />
          <el-divider />
          <el-row>
            <el-col :span="12">{{t('page.home.text-total')}}</el-col>
            <el-col class="text-align-right" :span="12">
              {{total.toLocaleString()}}
            </el-col>
          </el-row>
      </el-card>
</template>
<script lang="ts">
import { computed, defineComponent, onMounted, Ref, ref, watch } from "vue";
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";
import { StateType as HomeStateType } from "../../store";
import { ChartDataType } from "../../data";


interface LogsChartCardSetupData {
    t: Function;
    loading: boolean;
    total: number;
}

export default defineComponent({
    name: 'LogsChartCard',
    setup(): LogsChartCardSetupData {
        const store = useStore<{ Home: HomeStateType}>();
        const { t } = useI18n();

        // 总数
        const total = computed<number>(() => store.state.Home.logsChartData.count);

        // 读取数据 func
        const loading = ref<boolean>(true);
        const getData = async () => {
            loading.value = true;
            await store.dispatch('Home/queryLogsChartData');
            loading.value = false;
        };

        onMounted(()=> {
            getData();
        });


        return {
            t,
            loading: loading as unknown as boolean,
            total: total as unknown as number,
        }
    }
})
</script>
<style lang="scss" scoped>
.homeBoxCard {
  margin-bottom: 24px;
  ::v-deep(.el-card__header) {
    padding-left: 12px;
    padding-right: 12px;
  }
  ::v-deep(.el-card__body) {
    padding: 12px;
    font-size: 14px;
    line-height: 1.5715;
  }
  ::v-deep(.el-divider) {
    margin: 8px 0;
  }
  .num {
    font-size: 30px;
    color: #515a6e;
  }
  .height40 {
    height: 40px;
  }
}
</style>
