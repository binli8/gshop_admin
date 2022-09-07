<template>
  <common-card title="今日订单" :value="numberFormat(orderToday)">
    <div style="width: 100%; height: 100%" ref="chartRef"></div>
    <template #bottom>
      <span>昨天订单量</span>
      <span class="number">{{ moneyFormat(orderLastDay) }}</span>
    </template>
  </common-card>
</template>
<script lang="ts">
export default {
  name: "TodayOrders",
};
</script>
<script lang="ts" setup>
import { computed, ref, onMounted, watch } from "vue";
import useFormat from "@/hooks/useFormat";
import { useDataStore } from "@/stores/reportData";
// 引入 echarts
import { $echarts } from "@/plugins/echarts";
// echarts 实例对象
import type { EChartsType } from "echarts";

// 创建仓库对象
const dataStore = useDataStore();
// 引入数据类型
const { numberFormat, moneyFormat } = useFormat();

// 今天订单
const orderToday = computed(() => dataStore.reportData.orderToday);
// 昨日订单
const orderLastDay = computed(() => dataStore.reportData.orderLastDay);
// 实时订单量数据
const orderTrend = computed(() => dataStore.reportData.orderTrend || []);
// 实时订单量的横轴数据
const orderTrendAxis = computed(
  () => dataStore.reportData.orderTrendAxis || []
);

// 用来收集div图表容器对象
const chartRef = ref();
// 创建echarts对象实例
let chart: EChartsType;
const getOption = () => {
  return {
    // 横轴
    xAxis: {
      // x轴需要的数据
      data: orderTrendAxis.value,
      // 坐标轴两边留白
      boundaryGap: false,
    },
    // 纵轴
    yAxis: {
      // 是否显示 y 轴
      show: false,
    },
    // 系列组件
    series: [
      {
        // 用于tooltip的显示
        name: "实时订单量",
        // 线形图
        type: "line",
        // y轴需要的数据
        data: orderTrend.value,
        // 区域颜色
        areaStyle: { color: "purple" },
        //  线条样式,设置为透明
        lineStyle: { opacity: 0 },
        // 折现拐点样式,设置为透明
        itemStyle: { opacity: 0 },
        // 平滑曲线显示
        smooth: true,
      },
    ],
    // 提示框组件
    tooltip: {
      // 触发的时机和限制提示框在图表中
      trigger: "axis",
      confirm: true,
    },
    // 四周的距离
    grid: { left: 0, top: 0, right: 0, bottom: 0 },
  };
};

// 界面挂载完毕
onMounted(() => {
  chart = $echarts.init(chartRef.value);
  chart.setOption(getOption());

  // 页面挂载完毕,绑定一个窗口大小改变的事件
  window.addEventListener("resize", () => {
    chart && chart.resize();
  });
});

// 监视数据
watch(orderToday, () => {
  // 如果数据发生变化了,重新绘制图表
  chart.setOption(getOption());
});
</script>
<style lang="scss" scoped>
</style>