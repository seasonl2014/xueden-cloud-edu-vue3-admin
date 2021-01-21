<template>

      <el-card shadow="never" class="cus-card homeBoxCard" v-loading="loading">
          <template #header>
            <span>{{t('page.home.mapchartcard.card-title')}}</span>
            <el-tag type="success" class="float-right">{{t('page.home.text-day')}}</el-tag>
          </template>
          <div class="height340" ref="worksChartRef" />
          <el-divider />
      </el-card>

</template>
<script lang="ts">
import { computed, defineComponent, onMounted, Ref, ref, watch } from "vue";
import { useStore } from 'vuex';
import { useI18n } from "vue-i18n";
import echarts, { EChartOption } from 'echarts';
import 'echarts/map/js/china.js'
import useEcharts from '@/composables/useEcharts';
import { StateType as HomeStateType } from "../../store";
import { MapChartDataType } from '../../data';
import 'echarts/map/js/china'
const mapChartOption = {
  backgroundColor: '', //背景颜色
  title: {
    text: '你好啊中国',
    subtext: '我来自中国',
    color: '#fff',
    fontSize:'14px',
    // sublink: 'http://www.pm25.in',
    x:'left',
  },
  //是视觉映射组件，用于进行『视觉编码』，也就是将数据映射到视觉元素（视觉通道）。
  visualMap: {
    orient: 'horizontal',
    text:['低','高'],
    min: 0, //最小值
    max: 600, //最大值
    calculable: false, //是否显示拖拽用的手柄（手柄能拖拽调整选中范围）。
    inRange: {
      color: ['#0F9D90', '#39B1A6', '#95DCD7', '#AEE7E4', '#D7FBFA'] //颜色
    },
    textStyle: {
      color: '#000'
    },
  },
  // 提示框，鼠标移入
  tooltip:{
    show:true, //鼠标移入是否触发数据
    trigger: 'item', //出发方式
    formatter:'{b}-销售数量：{c}'
  },
  //配置地图的数据，并且显示
  series:[
    {
      name:'地图',
      type: 'map',  //地图种类
      map: 'china', //地图类型。
      data:[
        {name: '北京',value: Math.round(Math.random()*500)},
        {name: '天津',value: Math.round(Math.random()*500)},
        {name: '上海',value: Math.round(Math.random()*500)},
        {name: '重庆',value: Math.round(Math.random()*500)},
        {name: '河北',value: Math.round(Math.random()*500)},
        {name: '河南',value: Math.round(Math.random()*500)},
        {name: '云南',value: Math.round(Math.random()*500)},
        {name: '辽宁',value: Math.round(Math.random()*500)},
        {name: '黑龙江',value: Math.round(Math.random()*500)},
        {name: '湖南',value: Math.round(Math.random()*500)},
        {name: '安徽',value: Math.round(Math.random()*500)},
        {name: '山东',value: Math.round(Math.random()*500)},
        {name: '新疆',value: Math.round(Math.random()*500)},
        {name: '江苏',value: Math.round(Math.random()*500)},
        {name: '浙江',value: Math.round(Math.random()*500)},
        {name: '江西',value: Math.round(Math.random()*500)},
        {name: '湖北',value: Math.round(Math.random()*500)},
        {name: '广西',value: Math.round(Math.random()*500)},
        {name: '甘肃',value: Math.round(Math.random()*500)},
        {name: '山西',value: Math.round(Math.random()*500)},
        {name: '内蒙古',value: Math.round(Math.random()*500)},
        {name: '陕西',value: Math.round(Math.random()*500)},
        {name: '吉林',value: Math.round(Math.random()*500)},
        {name: '福建',value: Math.round(Math.random()*500)},
        {name: '贵州',value: Math.round(Math.random()*500)},
        {name: '广东',value: Math.round(Math.random()*500)},
        {name: '青海',value: Math.round(Math.random()*500)},
        {name: '西藏',value: Math.round(Math.random()*500)},
        {name: '四川',value: Math.round(Math.random()*500)},
        {name: '宁夏',value: Math.round(Math.random()*500)},
        {name: '海南',value: Math.round(Math.random()*500)},
        {name: '台湾',value: Math.round(Math.random()*500)},
        {name: '香港',value: Math.round(Math.random()*500)},
        {name: '澳门',value: Math.round(Math.random()*500)},
        {name: '南海诸岛',value: Math.round(Math.random()*500)}
      ],
      itemStyle: { //地图区域的多边形 图形样式。
        emphasis:{ //高亮状态下的样试
          label:{
            show:true,
          }
        }
      },
      zoom:1,//放大比例
      label: {  //图形上的文本标签，可用于说明图形的一些数据信息
        show:true,
      },
    },
    {
      type:'scatter',
      showEffectOn: 'render',//配置什么时候显示特效
      coordinateSystem:'geo',//该系列使用的坐标系
      symbolSize:10,//标记的大小
      data:[
        {name: '宜昌', value: [111.3,30.7,130]},
      ],
      zlevel:99999
    },
  ],
};
interface WorksChartCardSetupData {
    t: Function;
    loading: boolean;
    worksChartRef: Ref;
}

export default defineComponent({
    name: 'MapChartCard',
    setup(): WorksChartCardSetupData {
        const store = useStore<{ Home: HomeStateType}>();
        const { t } = useI18n();



        // chart Data
       /* const chartData = computed<object[]>(()=> store.state.Home.mapChartData.pv);
        console.info("地图chartData：",chartData.value)*/
        // echarts 图表
        const worksChartRef = ref<HTMLDivElement>();
        const mapChart = useEcharts(worksChartRef, mapChartOption as any);

        if(mapChart.value){
          console.info("mapChart:",mapChart)
          mapChart.value.setOption(mapChartOption as any)
        }else{
          console.info("mapChart.value:",mapChart.value)
        }


        /*watch([echarts, chartData],()=> {
          if(echarts.value) {
              const option: EChartOption = {
                series: [
                  {
                    data: chartData.value,
                  },
                ],
              };
              echarts.value.setOption(option);
          }
        });
*/
        // 读取数据 func
        const loading = ref<boolean>(false);
        const getData = async () => {
            loading.value = true;
            await store.dispatch('Home/queryMapChartData');
            loading.value = false;
        };

        onMounted(()=> {
           // getData();
        });


        return {
            t,
            loading: loading as unknown as boolean,
            worksChartRef,
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
