<template>
  <div class="indexlayout-main-conent">
    <el-row :gutter="24">
      <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="6">
        <UserChartCard />
      </el-col>
      <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="6">
        <RoleChartCard />
      </el-col>
      <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="6">
        <MenuChartCard />
      </el-col>
      <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="6">
        <LogsChartCard />
      </el-col>
    </el-row>

    <el-row :gutter="24">
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <LinksChartCard />
      </el-col>
    </el-row>

   <!-- <el-row :gutter="24">
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <MapChartCard />
      </el-col>
    </el-row>-->
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent, defineComponent } from "vue";

import PageLoading from './components/PageLoading/index.vue';
const UserChartCard = defineAsyncComponent({
  loader: () => import('./components/UserChartCard/index.vue'),
  loadingComponent: PageLoading
});
const RoleChartCard = defineAsyncComponent({
  loader:  () => import('./components/RoleChartCard/index.vue'),
  loadingComponent: PageLoading
});
const MenuChartCard = defineAsyncComponent({
  loader:  () => import('./components/MenuChartCard/index.vue'),
  loadingComponent: PageLoading
});

const LogsChartCard = defineAsyncComponent({
  loader:  () => import('./components/LogsChartCard/index.vue'),
  loadingComponent: PageLoading
});

const LinksChartCard = defineAsyncComponent({
  loader:  () => import('./components/LinksChartCard/index.vue'),
  loadingComponent: PageLoading
});

const MapChartCard = defineAsyncComponent({
  loader:  () => import('./components/MapChartCard/index2.vue'),
  loadingComponent: PageLoading
});



export default defineComponent({
  name: 'Home',
  components: {
    UserChartCard,
    RoleChartCard,
    MenuChartCard,
    LogsChartCard,
    LinksChartCard

  }

});
</script>
