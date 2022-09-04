<template>
  <el-card class="sku-list">
    <!-- 表格 -->
    <el-table
      row-key="id"
      v-loading="loading"
      :data="skuInfoList"
      border
      style="width: 100%"
    >
      <el-table-column type="index" label="序号" width="80" align="center" />
      <el-table-column prop="skuName" label="名称" />
      <el-table-column prop="skuDesc" label="描述" />
      <el-table-column prop="skuDefaultImg" label="默认图片" width="150"> 
        <template #default="{row}">
         <el-image :src="row.skuDefaultImg" style="width:80;height:80px"></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量(千克)" />
      <el-table-column prop="price" label="价格(元)" />
      <el-table-column prop="address" label="操作" width="250">
        <template #default="{row}">
           <!-- 四个按钮 -->
        <el-button size="small" type="primary" :icon="Bottom" />
        <el-button size="small" type="primary" :icon="Edit" />
        <el-button size="small" type="primary" :icon="InfoFilled" />
        <el-button size="small" type="primary" :icon="Delete" /> 
        </template>
      
      </el-table-column>
    </el-table>

    <!-- 分页 -->

    <!-- 抽屉 -->
  </el-card>
</template>
<script lang="ts">
export default {
  name: "Sku",
};
</script>
<script lang="ts" setup>
// 引入ui组件
import { Delete, Edit, Bottom, InfoFilled } from "@element-plus/icons-vue";
import { ref, onMounted } from "vue";
// 引入类型
import type { SkuInfoListModel } from "@/api/product/model/skuModel";
// 引入分页的方式获取sku列表数据的接口函数
import { getSkuInfoListApi } from "@/api/product/sku";

// 定义列表
const skuInfoList = ref<SkuInfoListModel>([]);
console.log(skuInfoList);

// 定义分页的数据
const current = ref<number>(1); //页码数
const pageSize = ref<number>(10); //每条的页数
const total = ref<number>(0); //总页数
// 定义加载标识
const loading = ref<boolean>(false);
const getSkuInfoList = async (
  page: number = current.value,
  limit: number = pageSize.value
) => {
  // 开启加载效果
  loading.value = true;
  // 重新赋值
  current.value = page;
  pageSize.value = limit;
  const result = await getSkuInfoListApi(page, limit);
  // 关闭加载效果
  loading.value = false
  skuInfoList.value = result.records;
  total.value = result.total;
};
onMounted(() => {
  getSkuInfoList();
});

// 分页,
</script>
<style scoped>
</style>