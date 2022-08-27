<template>
  <el-card shadow="hover">
    <template #header>
      <!-- 添加按钮 -->
      <div>
        <el-button type="primary" :icon="Plus">添加</el-button>
      </div>
    </template>
    <!-- 表格 -->
    <el-table :data="trademarkList" stripe border style="width: 100%">
      <el-table-column type="index" label="序号" width="80" align="center" />
      <el-table-column prop="tmName" label="品牌名称" />
      <el-table-column label="品牌LOGO">
        <template v-slot="{ row }">
          <img :src="row.logoUrl" alt="" width="100" height="60" />
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作">
        <template v-slot="scope">
          <el-button size="small" type="warning" :icon="Edit"></el-button>
          <el-button size="small" type="danger" :icon="Delete"
            ></el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <!-- 对话框 -->
  </el-card>
</template>
<script lang="ts">
export default {
  name: "Trademark",
};
</script>
<script lang="ts" setup>
// 引入图标
import { Plus, Edit, Delete } from "@element-plus/icons-vue";
// 引入品牌相关的数据的接口类型
import {
  TrademarkModel,
  TrademarkListModel,
  TrademarkPageListModel,
} from "@/api/product/model/trademarkModel";
// 引入ref
import { ref, onMounted } from "vue";
// 引入品牌相关的接口函数
import { getTrademarkListAllApi,getTrademarkListApi } from "@/api/product/trademark";
// 定义数组,用来收集品牌列表的数组数据信息
const trademarkList = ref<TrademarkListModel>([]);
const current = ref<number>(1); //页码数
const pageSize = ref<number>(3); //每条的页数
const total = ref<number>(0); //总页数
// 定义一个函数,用来获取品牌列表的数据
const getTrademarkList = async (
  page: number = current.value, //页码数
  limit: number = pageSize.value //每页显示的条数
) => {
    // 更新页码和每页条数的数据
    current.value = page
    pageSize.value = limit
    // 调用接口函数
  const result = await getTrademarkListApi(page, limit);
    //   更新数据
    console.log(result);
    
    trademarkList.value = result.records
    total.value = result.total
};
onMounted(() => {
  getTrademarkList();
});
</script>
<style scoped>
</style>