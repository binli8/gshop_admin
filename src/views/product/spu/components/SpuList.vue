<template>
  <!-- 按钮 -->
  <el-button type="primary" :icon="Plus" @click="clickAddSpu">添加SPU</el-button>
  <!-- 表格 -->
  <el-table
    v-loading="loading"
    row-key="id"
    :data="spuInfoList"
    stripe
    style="width: 100%"
    border
  >
    <el-table-column type="index" label="序号" width="80" align="center" />
    <el-table-column prop="spuName" label="SPU名称" />
    <el-table-column prop="description" label="SPU描述" />
    <el-table-column label="操作">
      <template v-slot="{ row }">
        <el-button
          size="small"
          type="primary"
          :icon="Plus"
          title="添加SKU"
          @click="clickAddSku(row)"
        ></el-button>
        <el-button
          size="small"
          type="primary"
          :icon="Edit"
          title="添加SPU"
          @click="AddUpSpu(row)"
        ></el-button>
        <el-button
          size="small"
          type="info"
          :icon="InfoFilled"
          title="查看SKU"
          @click="showSkuInfoList(row)"
        ></el-button>
        <el-button size="small" type="danger" :icon="Delete" title="删除SPU">
        </el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- 分页 -->
    <el-pagination
      v-model:currentPage="current"
      v-model:page-size="pageSize"
      :page-sizes="[3, 6, 9]"
      :small="small"
      :disabled="disabled"
      background
      layout="prev, pager, next, jumper,->,sizes,total,"
      :total="total"
      @size-change="getSpuInfoList(1, val)"
      @current-change="getSpuInfoList(val, pageSize)"
      style="margin-top: 20px"
    />
  <!-- sku列表的对话框 -->
    <el-dialog v-model="dialogVisible" :title="`${spuInfo?.spuName}==>列表`">
    <el-table :data="skuInfoList">
      <el-table-column property="skuName" label="名称" width="150" />
      <el-table-column property="price" label="价格(元)" width="200" />
      <el-table-column property="weight" label="重量(千克)" />
      <el-table-column label="默认图片">
        <template v-slot="{row}">
         <el-image :src="row.skuDefaultImg" style="width:100px,height:100px" />
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>
<script lang="ts">
export default {
  name: "SpuList",
};
</script>
<script lang="ts" setup>
import { Plus, Delete, Edit, InfoFilled } from "@element-plus/icons-vue";
// 引入ref
import { ref, watch } from "vue";
// 引入spu相关的接口类型
import type { SpuListModel, SpuModel } from "@/api/product/model/spuModel";
// 引入spu相关的接口函数
import { getSpuInfoListApi } from "@/api/product/spu";
// 引入分类仓库
import { useCategoryStore } from "@/stores/category";
// 引入sku相关的接口类型
import type{SkuInfoListModel} from '@/api/product/model/skuModel'
// 引入sku相关的接口函数
import {getSkuInfoListBySpuIdApi} from '@/api/product/sku'
import { ShowStatus } from '../types';

// 接收父组件传递过来的自定义事件
const emits = defineEmits(['alterShowOrHide'])
// 定义分类仓库
const categoryStore = useCategoryStore();
// 定义页码
const current = ref<number>(1);
// 定义每条页数
const pageSize = ref<number>(3);
// 定义总条数
const total = ref<number>(0);
// 定义spuinfo数组列表数据
const spuInfoList = ref<SpuListModel>([]);
// 定义加载效果
const loading = ref<boolean>(false);
// 定义是否显示sku对话框
const dialogVisible = ref<boolean>(false)
// 定义spu对象
const spuInfo = ref<SpuModel>()
// 定义skuInfo的列表数据
const skuInfoList = ref<SkuInfoListModel>([])
// 获取spu对象列表数据
const getSpuInfoList = async (
  page: number = current.value,
  limit: number = pageSize.value
) => {
  loading.value = true;
  current.value = page;
  pageSize.value = limit;
  const result = await getSpuInfoListApi({
    page,
    limit,
    category3Id: categoryStore.category3Id as number,
  });
  //   关闭加载效果
  loading.value = false;
  spuInfoList.value = result.records;
  total.value = result.total;
};
// 三级分类id一变化就是开始调用上面的方法
watch(
  () => categoryStore.category3Id,
  (category3Id) => {
    if (!category3Id) {
      current.value = 1;
      pageSize.value = 3;
      total.value = 0;
      spuInfoList.value = [];
      return;
    }
    getSpuInfoList()
  },
  { immediate: true }
);

// 点击查看sku按钮的回调函数
const showSkuInfoList = async(row:SpuModel) => {
    // 显示对话框
    dialogVisible.value = true
    // 保存spu对象的数据
    spuInfo.value = row
    // 调用接口请求数据
    skuInfoList.value = await getSkuInfoListBySpuIdApi(row.id as number)
}

// 点击按钮添加spu的回调
const clickAddSpu = () =>{
    // 显示spuForm组件界面
    emits('alterShowOrHide',ShowStatus.SPU_ADD)
}
// 点击添加SPu按钮的回调
const clickAddSku = (row:SpuModel) =>{
    // 显示skuForm组件界面
    emits('alterShowOrHide',ShowStatus.SPU_ADD)
}
// 点击修改Spu按钮的回调
const AddUpSpu = (row:SpuModel) =>{
    // 显示spuList组件
    emits('alterShowOrHide',ShowStatus.SPU_ADD)
}
</script>
<style scoped>
</style>