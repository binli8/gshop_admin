<template>
  <common-card title="累计用户数" :value="numberFormat(usersTotal)">
    <!-- <div style="width: 100%; height: 100%" ref="chartRef"></div> -->
    <template #bottom>
      <div class="compare-wrap">
        <div class="compare">
          <span>日同比</span>
          <span class="number">{{ userGrowthLastDay }}%</span>
          <div class="increment"></div>
          <span>月同比</span>
          <span class="number">{{ userGrowthLastMonth }}%</span>
          <div class="decrement"></div>
        </div>
      </div>
    </template>
  </common-card>
</template>
<script lang="ts">
export default {
  name: "TotalUsers",
};
</script>
<script lang="ts" setup>
import { computed, ref, onMounted, watch } from "vue";
import useFormat from "@/hooks/useFormat";
import { useDataStore } from "@/stores/reportData";

// 创建仓库对象
const dataStore = useDataStore();
// 引入数据类型
const { numberFormat, moneyFormat } = useFormat();

// 累计用户数
const usersTotal = computed(() => dataStore.reportData.usersTotal);
// 昨天的用户数
const usersLastDay = computed(() => dataStore.reportData.usersLastDay);
// 上个月的用户数
const usersLastMonth = computed(() => dataStore.reportData.usersLastMonth);
//日同比
const userGrowthLastDay = computed(
  () => dataStore.reportData.userGrowthLastDay
);
// 月同比
const userGrowthLastMonth = computed(
  () => dataStore.reportData.userGrowthLastMonth
);
</script>
<style lang="scss" scoped>
.compare-wrap {
  display: flex;
  font-size: 12px;
  font-weight: 600;
  flex-direction: column;
  height: 100%;
  color: #666;
  margin-right: 10px !important;  
  .compare {
    display: flex;
    flex: 1;
    align-items: center;
    
  }
}
</style>