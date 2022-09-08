<template>
  <common-card title="今日交易用户数量" :value="numberFormat(orderUser)">
    <v-chart :option="getOption()" autoresize></v-chart>
    <template #bottom>
      <span>退货率</span>
      <span class="number">{{ returnRate }}%</span>
    </template>
  </common-card>
</template>
<script lang="ts">
export default {
  name: "TodayUsers",
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

// 今日交易用户数量
const orderUser = computed(() => dataStore.reportData.orderUser);
// 退货率
const returnRate = computed(() => dataStore.reportData.returnRate);
// y轴数据
const orderUserTrend = computed(
  () => dataStore.reportData.orderUserTrend || []
);
// x轴数据
const orderUserTrendAxis = computed(
  () => dataStore.reportData.orderUserTrendAxis || []
);

const getOption = () => {
  return {
    // x轴
    xAxis: {
      data: orderUserTrendAxis.value,
    },
    // y轴
    yAxis: { show: false },
    // 系列组件
    series: {
      name: "实时交易量",
      type: "bar",
      data: orderUserTrend.value,
      barWidth: "60%",
    },
    // 四周距离
    grid: {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
    },
    // 提示框
    tooltip: {
      trigger: "axis",
      // 计算提示框显示的位置
      position: function (
        point: any,
        params: any,
        dom: any,
        rect: any,
        size: any
      ) {
        // 固定在顶部
        let x = 0     //自己要计算的鼠标的横坐标
        let pointX = point[0]   //可以获取的鼠标的横坐标
        let boxWidth = size.contentSize[0] //dom的宽度
        x = boxWidth > pointX ? 5 :pointX-boxWidth
        return [x, -40];
      },
    },
    // 颜色
    color: "#3398db",
  };
};
</script>
<style lang="scss" scoped>
</style>