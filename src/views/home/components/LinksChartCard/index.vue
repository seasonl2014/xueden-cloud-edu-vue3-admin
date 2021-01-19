<template>
      <el-card shadow="never" class="cus-card homeBoxCard" v-loading="loading">
          <template #header>
            <span>{{t('page.home.linkschartcard.card-title')}}</span>
            <el-tag type="warning" class="float-right">{{t('page.home.text-day')}}</el-tag>
          </template>
          <div class="height440" ref="linksChartRef" />
          <el-divider />
          <el-row>
            <el-col :span="12"></el-col>
            <el-col class="text-align-right" :span="12">

            </el-col>
          </el-row>
      </el-card>
</template>
<script lang="ts">
import { computed, defineComponent, onMounted, Ref, ref, watch } from "vue";
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";
import { EChartOption } from 'echarts';
import useEcharts from '@/composables/useEcharts';
import { StateType as HomeStateType } from "../../store";
import { ChartDataType } from "../../data";

const linksChartOption: EChartOption = {
  tooltip: {
    show: true,
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
  },
  grid: {
    left: '40px',
    right: '0',
    top: '40px',
    bottom: '20px',
  },
  xAxis: {
    type: 'category',
    show: true,
    data: [
      /* '2019-04', '2019-05', '2019-06','2019-07', '2019-08', '2019-09', '2019-10', '2019-11', '2019-12', '2020-01', '2020-02', '2020-03' */
    ],
  },
  yAxis: {
    type: 'value',
    show: true,
  },
  series: [
    {
      name: '日流量',
      type: 'bar',
      data: [
        /* 5888, 3838, 15880, 12888, 18888, 16888,5888, 3838, 15880, 12888, 18888, 16888 */
      ],
      markPoint : {
        data : [
          {type : 'max', name: '最大值'},
          {type : 'min', name: '最小值'}
        ]
      }
    },
  ],
};

interface LinksChartCardSetupData {
    t: Function;
    loading: boolean;
    linksChartRef: Ref;
}

export default defineComponent({
    name: 'LinksChartCard',
    setup(): LinksChartCardSetupData {
        const store = useStore<{ Home: HomeStateType}>();
        const { t } = useI18n();

        // chart Data
        const chartData: ChartDataType = store.state.Home.linksChartData.chart
        // echarts 图表
        const linksChartRef = ref<HTMLDivElement>();
        const echarts = useEcharts(linksChartRef, linksChartOption);
        watch([echarts, chartData],()=> {
          if(echarts.value) {
              const option: EChartOption = {
                xAxis: {
                  type: 'category',
                  // data: ["03-01", "03-01", "03-01", "03-01", "03-01", "03-01", "03-01"]
                  data: chartData.day,
                },
                series: [
                  {
                    name: '新增',
                    // data: [3, 1, 1, 2, 2, 2, 2]
                    data: chartData.num,
                  },
                ],
              };
              echarts.value.setOption(option);
          }
        });


        // 读取数据 func
        const loading = ref<boolean>(true);
        const getData = async () => {
            loading.value = true;
            await store.dispatch('Home/queryLinksChartData');
            loading.value = false;
        };

        onMounted(()=> {
           getData();
        });
        return {
            t,
            loading: loading as unknown as boolean,
            linksChartRef,
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
  .height440 {
    height: 440px;
  }
}
</style>

