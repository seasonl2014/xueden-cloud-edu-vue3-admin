<template>
  <div class="indexlayout-main-conent">
    <el-card shadow="never" class="cus-card" v-loading="loading">
      <template #header>
        <span>{{t('page.home.mapchartcard.card-title')}}</span>
        <el-tag type="success" class="float-right">{{t('page.home.text-day')}}</el-tag>
      </template>
      <div style="height: 600px;" ref="mapChartRef" />
    </el-card>
  </div>
</template>
<script lang="ts">
import { defineComponent,Ref, ref,onMounted } from "vue";
import useEcharts from '@/composables/useEcharts';
import 'echarts/map/js/china.js';
import {StateType as HomeStateType} from "@/views/home/store";
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import {ChartDataType} from "@/views/home/data";

interface MapChartCardSetupData {
  t: Function;
  loading: boolean;
  mapChartRef: Ref;
}

export default defineComponent({
  setup(): MapChartCardSetupData {
    const store = useStore<{ Home: HomeStateType}>();
    const { t } = useI18n();
    const chartData: object[] = store.state.Home.mapChartData.pv
    console.info("地图chartData：",chartData)

    // echarts 图表
    const mapChartRef = ref<HTMLDivElement>();
    useEcharts(mapChartRef, {
      series: [{
        name: '近30天流量',
        type: 'map',
        map: 'china',
        data: store.state.Home.mapChartData.pv,
        label: {
          show: true, // 显示各个省份名称
          fontSize: 12
        },
        itemStyle: {
          areaColor: '#fff' // 区域的背景颜色
        },
        emphasis: {

        },
        zoom: 1.2 // 控制地图的大小
      }],
      visualMap: [{
        type: 'piecewise',
        show: true,
        splitNumber: 6,
        pieces: [{
          min: 10000
        }, // 不指定 max，表示 max 为无限大（Infinity）。
          {
            min: 1000,
            max: 9999
          },
          {
            min: 100,
            max: 999
          },
          {
            min: 10,
            max: 99
          },
          {
            min: 1,
            max: 9
          },
          {
            min: 0,
            max: 0
          }
        ],
        // align:'right' // 默认是left
        inRange: {
          symbol: 'rect',
          color: ['#fff', '#ffaa85', '#ff7b69', '#cc2929', '#8c0d0d', '#660208']
        },
        itemHeight: 10,
        itemWidth: 20
      }],
      tooltip: {
       /* show:true, //鼠标移入是否触发数据
        trigger: 'item', //出发方式
        formatter:'{b}-销售数量：{c}'*/
      }
    });

    // 读取数据 func
    const loading = ref<boolean>(false);
    const getData = async () => {
      loading.value = true;
      await store.dispatch('Home/queryMapChartData');
      loading.value = false;
    };

    onMounted(()=> {
      getData();
    });

    return {
      t,
      loading: loading as unknown as boolean,
      mapChartRef
    }
  }
})
</script>
