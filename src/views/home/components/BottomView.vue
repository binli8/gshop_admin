<template>
  <div class="bottom-view">
    <!-- 左侧 -->
    <el-card class="view" shadow="hover">
      <template #header>
        <div>关键词搜索</div>
      </template>
      <div class="search-view">
        <!-- 两个小图表 -->
        <div class="chart-wrap">
          <!-- 第一个图标 -->
          <div class="chart">
            <div class="title">搜索用户数</div>
            <div class="count">113,918</div>
            <v-chart :option="getOption('userList', '搜索用户数')"></v-chart>
          </div>
          <div class="chart">
            <div class="title">搜索量</div>
            <div class="count">214,215</div>
            <v-chart :option="getOption('countList', '搜索量')"></v-chart>
          </div>
        </div>
        <!-- 表格分页 -->
        <div class="search-table">
          <!-- 表格 -->
          <el-table :data="tableData" style="margin-top: 20px">
            <el-table-column prop="rankNo" label="排名" />
            <el-table-column prop="word" label="关键字" />
            <el-table-column prop="count" label="搜索数量" />
            <el-table-column prop="user" label="搜索用户数" />
            <el-table-column prop="range" label="搜索占比" />
          </el-table>
          <!-- 分页 -->
          <el-pagination
            v-model:currentPage="current"
            v-model:page-size="pageSize"
            layout="  prev, pager, next"
            :total="tableAllData.length"
            style="margin-top: 10px; fount-weight: 700"
          />
        </div>
      </div>
    </el-card>

    <!-- 右侧 -->
    <el-card class="view" shadow="hover">
      <template #header>
        <div>分类销售排行</div>
        <!-- 两个按钮 -->
        <el-radio-group v-model="selectRadio" size="small">
          <el-radio-button label="品类">品类</el-radio-button>
          <el-radio-button label="商品">商品</el-radio-button>
        </el-radio-group>
      </template>
      <div class="search-view">
        <v-chart :option="getPieOption()" autoresize></v-chart>
      </div>
    </el-card>
  </div>
</template>
<script lang="ts">
export default {
  name: "BottomView",
};
</script>
<script lang="ts" setup>
import { ref, computed } from "vue";
const selectRadio = ref("品类");
import { useDataStore } from "@/stores/reportData";
import useFormat from "@/hooks/useFormat";
const { numberFormat } = useFormat();
const dataStore = useDataStore();
// 关键字搜索 数据
const searchWord = computed(() => dataStore.reportData.searchWord || []);
// 分类销售排行
const saleRank = computed(() => dataStore.reportData.saleRank);

// 计算表格的数据
const tableAllData = computed(() => {
  // 判断数据是否存在
  if (!searchWord.value) return [];
  // 如果数据存在
  return searchWord.value.map((item, index) => ({
    ...item,
    rankNo: index + 1, //排名
    range: ((item.user / item.count) * 100).toFixed(2) + "%", //占比
  }));
});

// 分页数据
const current = ref(1); //页码
const pageSize = ref(5); //每页的条数
// 计算分页的表格数据
const tableData = computed(() => {
  return tableAllData.value.slice(
    (current.value - 1) * pageSize.value,
    current.value * pageSize.value
  );
});
// 计算线性图表数据
const lineData = computed(() => {
  const data = {
    // 关键字数组数据
    wordList: [] as string[],
    // 用户搜索数数据数据
    userList: [] as number[],
    // 搜索量数组数据
    countList: [] as number[],
    // 总的用户数
    totalUsers: 0,
    // 总的搜索量
    totalCount: 0,
  };
  searchWord.value.forEach((item) => {
    data.wordList.push(item.word);
    data.userList.push(item.user);
    data.countList.push(item.count);
    data.totalUsers += item.user;
    data.totalCount += item.count;
  });
  return data;
});
// 两个小图标的配置
const getOption = (listName: "userList" | "countList", name: string) => {
  return {
    xAxis: {
      data: lineData.value.wordList, //横轴是关键字数组数据
      boundaryGap: false, //两边不留白
    },
    yAxis: {
      show: false,
    },
    series: [
      {
        type: "line",
        data: lineData.value[listName],
        smooth: true,
        itemStyle: { opacity: 0 },
        areaStyle: { color: "#c7e7ff" },
        lineStyle: { color: "#5fbbff" },
      },
    ],
    tooltip: {
      trigger: "axis",
    },
    grid: {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
    },
  };
};

// 计算饼状图所需的图表数据
const pieData = computed(() => {
  const data = {
    // 品类数组
    categoryList: [] as any,
    // 品类的总数
    categoryTotal: 0,
    // 商品数组
    goodsList: [] as any,
    // 商品总数
    goodsTotal: 0,
  };
  if (saleRank.value) {
    // 解构出品类和商品的两个对象
    // 再从品类对象category解构出axisX并且改名为axisX1,还解构出data1
    // 继续解构出商品对象goods中的axisX改名为axisX2,还解构出data1并且改名为data2
    const {
      category: { axisX: axisX1, data1 },
      goods: { axisX: axisX2, data1: data2 },
    } = saleRank.value;

    // 计算品类category中的data1数组中的总数据(目的:1为了显示总数,2为了计算占比)
    const total1 = data1.reduce((pre, item) => pre + item, 0);
    data.categoryTotal = total1 as number;
    // 品类的总数计算完毕
    axisX1.forEach((item, index) => {
      const percent = ((data1[index] / total1) * 100).toFixed(2) + "%"; //比例
      data.categoryList.push({
        name: item + "|" + percent,
        value: data1[index],
        percent, //占比
        labelName: item,
      });
    });

    // 计算品类category中的data1数组中的总数据(目的:1为了显示总数,2为了计算占比)
    const total2 = data2.reduce((pre, item) => (pre += item), 0);
    data.goodsTotal = total2 as number;
    // 商品对象的计算
    axisX2.forEach((item, index) => {
      const percent = ((data2[index] / total2) * 100).toFixed(2) + "%"; //比例
      data.goodsList.push({
        name: item + "|" + percent,
        value: data2[index],
        percent, //占比
        labelName: item,
      });
    });
  }
  return data;
});

const getPieOption = () => {
  // 解构出品类和商品的数组数据的品类总数和商品总数
  const { categoryList, categoryTotal, goodsList, goodsTotal } = pieData.value;

  // 获取图标所需的数据
  const lineData = selectRadio.value === "品类" ? categoryList : goodsList;
  // 子标题的内容
  const total = selectRadio.value === "品类" ? categoryTotal : goodsTotal;

  return {
    title: [
      {
        //主标题
        text: `${selectRadio.value}分布`, //标题内容
        textStyle: { fontSize: 14, color: "#666" }, //标题样式
        left: 20, //标题的位置
        top: 20,
      },
      {
        text: "累计订单量", //副标题
        subtext: total, //子标题
        textStyle: { fontSize: 14, color: "#999" }, //副标题样式
        subtextStyle: { fontSize: 28, color: "#333" }, //子标题样式
        left: "34.5%", //标题的位置
        top: "42.5%",
        textAlign: "center",
      },
    ],
    tooltip: {
      //提示框
      trigger: "item",
      formatter: function (params: any) {
        return `${params.seriesName}<br/>
          ${params.marker}${params.data.labelName}<br/>
          ${params.marker}数量:${params.value}<br/>
          ${params.marker}占比:${params.percent}%<br/>
        `;
      },
    },
    legend: {
      //图例组件,就是那些小框
      top: "middle", //图例组件的位置
      right: "left",
      orient: "vertical", //图例组件竖状显示
    },
    series: [
      {
        name: `${selectRadio.value}分布`, //提示的名称
        type: "pie",
         data: lineData, //展示的数据
        radius: ["35%", "50%"],
        center: ["35%", "50%"], //圆心位置
        avoidLabelOverlap: false, //不启用防止标签重叠策略
        itemStyle: {
          //设置饼状图中块的边框样式
          borderRadius: 2,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: true, //显示饼图图形上的文本标签
          position: "outside", //文本标签的位置
          //显示的文字内容
          formatter: function (params: any) {
            return params.data.labelName;
          },
        },
        labelLine: {
          show: true, //显示标签的视觉引导线配置
          length: 7, //第一条线
          length2: 5,
        },
       
      },
    ],
  };
};
</script>
<style lang="scss" scoped>
.bottom-view {
  margin-top: 20px;
  display: flex;
  .view {
    flex: 1;
    &:first-child {
      margin-right: 10px;
    }
    &:last-child {
      margin-left: 10px;
    }

    :deep(.el-card__header) {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 60px;
    }
    .search-view {
      display: flex;
      flex-direction: column;
      height: 450px;
      .chart-wrap {
        display: flex;
        .chart {
          flex: 1;
          &:first-child {
            margin-right: 5px;
          }
          &:last-child {
            margin-left: 5px;
          }
          .title {
            font-size: 14px;
            color: #999;
          }
          .count {
            font-size: 22px;
            color: #333;
            font-weight: 500;
            letter-spacing: 2px;
          }
          .echarts {
            height: 50px;
          }
        }
      }
    }
  }
}
</style>