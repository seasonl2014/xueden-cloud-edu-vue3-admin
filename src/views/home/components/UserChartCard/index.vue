<template>
      <el-card shadow="never" class="cus-card homeBoxCard" v-loading="loading">
          <template #header>
            <span>{{t('page.home.userechartcard.card-title')}}</span>
            <el-tag class="float-right">{{t('page.home.text-immediate')}}</el-tag>
          </template>
          <div class="num">{{visitData.count.toLocaleString()}}</div>
          <div class="height40">
            <div class="UserText">
                <span>

                </span>
                <span class="margin-l10">

                </span>
            </div>
          </div>
          <el-divider />
          <el-row>
            <el-col :span="12">{{t('page.home.text-total')}}</el-col>
            <el-col class="text-align-right" :span="12">
                {{visitData.count.toLocaleString()}}
            </el-col>
          </el-row>
      </el-card>
</template>
<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";
import { UserChartDataType } from "../../data.d";
import { StateType as HomeStateType } from "../../store";

interface UserChartCardSetupData {
    t: Function;
    loading: boolean;
    visitData: UserChartDataType;
}

export default defineComponent({
    name: 'UserChartCard',
    setup(): UserChartCardSetupData {
        const store = useStore<{ Home: HomeStateType}>();
        const { t } = useI18n();

        // 数据
        const visitData = computed<UserChartDataType>(()=> store.state.Home.userChartData);
        // 读取数据 func
        const loading = ref<boolean>(true);
        const getData = async () => {
            loading.value = true;
            await store.dispatch('Home/queryUserChartData');
            loading.value = false;
        }

        onMounted(()=> {
           getData();
        })

        return {
            t,
            loading: loading as unknown as boolean,
            visitData: visitData as unknown as UserChartDataType
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
  .UserText {
    padding-top: 20px;
  }
  .color19be6b {
    color: #19be6b;
  }
  .colored4014 {
    color: #ed4014;
  }
}
</style>
