<template>
  <common-card title="累计用户数" :value="numberFormat(usersTotal)">
    <v-chart :option="getOption()" autoresize></v-chart>
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

const getOption = () => {
  return {
    // 横轴
    xAxis: {
      show: false,
      min: 0,
      max: usersTotal.value,
    },
    // 纵轴
    yAxis: {
      show: false,
      type: "category",
    },
    //系列组件
    series: [
      {
        name: "累计用户数",
        type: "bar",
        data: [(usersTotal.value as number) - (usersLastMonth.value as number)],
        // 柱条的宽度
        barWidth: 10,
        // 开始背景色
        showBackground: true,
        // 柱条的颜色
        color: "yellowgreen",
        // 文本内容
        label: {
          // 显示文本
          show: true,
          // 文本内容
          formatter: "|",
          // 显示位置
          position: "right",
          // 文本颜色
          color: "yellowgreen",
        },
      },
    ],
    // 四周距离
    grid: { left: 0, top: 0, right: 0, bottom: 0 },
    // 提示框
    tooltip: { trigger: "axis" ,confirm: true,},
  };
};
</script>
<style lang="scss" scoped>
.compare-wrap {
  display: flex;
  font-size: 12px;
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