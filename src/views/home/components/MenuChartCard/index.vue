<template>

      <el-card shadow="never" class="cus-card homeBoxCard" v-loading="loading">
          <template #header>
            <span>{{t('page.home.menuchartcard.card-title')}}</span>
            <el-tag type="warning" class="float-right">{{t('page.home.text-immediate')}}</el-tag>
          </template>
          <div class="num">{{count.toLocaleString()}}</div>
          <div class="height40" />
          <el-divider />
          <el-row>
            <el-col :span="12">{{t('page.home.text-total')}}</el-col>
            <el-col class="text-align-right" :span="12">
              {{count.toLocaleString()}}
            </el-col>
          </el-row>
      </el-card>

</template>
<script lang="ts">
import { computed, defineComponent, onMounted, Ref, ref, watch } from "vue";
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";

import { StateType as HomeStateType } from "../../store";




interface MenuChartCardSetupData {
    t: Function;
    loading: boolean;
    count: number;
}

export default defineComponent({
    name: 'MenuChartCard',
    setup(): MenuChartCardSetupData {
        const store = useStore<{ Home: HomeStateType}>();
        const { t } = useI18n();

        // 总数
        const count = computed<number>(() => store.state.Home.menuChartData.count);

        // 读取数据 func
        const loading = ref<boolean>(true);
        const getData = async () => {
            loading.value = true;
            await store.dispatch('Home/queryMenuChartData');
            loading.value = false;
        };

        onMounted(()=> {
            getData();
        });

        return {
            t,
            loading: loading as unknown as boolean,
            count: count as unknown as number,
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
