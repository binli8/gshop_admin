<template>
  <!-- 添加spu按钮 -->
  <el-button type="primary" :icon="Plus" @click="showAddSpu">添加SPU</el-button>

  <!-- 表格 -->
  <el-table
    row-key="id"
    v-loading="loading"
    :data="spuInfoList"
    stripe
    style="width: 100%"
    border
  >
    <el-table-column type="index" label="序号" width="80" align="center">
      <template v-slot="{ $index }">{{
        pageSize * (current - 1) + $index + 1
      }}</template>
    </el-table-column>
    <el-table-column prop="spuName" label="SPU名称" />
    <el-table-column prop="description" label="SPU描述" />
    <el-table-column label="操作">
      <template v-slot="{ row }">
        <el-button
          size="small"
          type="primary"
          :icon="Plus"
          title="添加SKU"
          @click="showAddSku(row)"
        ></el-button>
        <el-button
          size="small"
          type="primary"
          :icon="Edit"
          title="修改SPU"
          @click="showUpAddSpu(row)"
        ></el-button>
        <el-button
          size="small"
          type="info"
          :icon="InfoFilled"
          title="查看SKU"
          @click="clickToViewSku(row)"
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
    :background="background"
    layout="prev, pager, next, jumper,->,sizes,total,"
    :total="total"
    @size-change="getSpuInfoList(1, val)"
    @current-change="getSpuInfoList(val, pageSize)"
    style="margin-top: 20px"
  />

  <!-- 对话框 -->
  <el-dialog v-model="dialogVisible" :title="`${spuInfo?.spuName}===>SKU列表`">
    <el-table :data="skuInfoList">
      <el-table-column property="skuName" label="名称" />
      <el-table-column property="price" label="价格(元)" />
      <el-table-column property="weight" label="重量(千克)" />
      <el-table-column property="address" label="默认图片">
        <template v-slot="{ row }">
          <img :src="row.skuDefaultImg" style="width: 100px; height: 100px" />
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
// 引入icon图标
import { Plus, Delete, InfoFilled, Edit } from "@element-plus/icons-vue";
// 引入ref,watch
import { ref, watch } from "vue";
// 引入仓库
import useCategoryStore from "@/stores/category";
// 引入spu的相关接口类型
import type { SpuModel, SpuListModel } from "@/api/product/model/spuModel";
// 引入spu的相关接口函数
import { getProductApi } from "@/api/product/spu";
// 引入sku的相关接口类型
import type { SkuInfoListModel } from "@/api/product/model/skuModel";
// 引入sku的相关接口函数
import { findBySpuIdApi } from "@/api/product/sku";
// 引入显示或隐藏页面的枚举类型
import { ShowOrHide } from "../types";
// 接收父组件传递过来的自定义事件
const emits = defineEmits(["setCurrentShowStatus", "setCurrentSpuInfo"]);

// 创建分类的仓库
const categoryStore = useCategoryStore();
//定页码
const current = ref<number>(1);
// 定义每页的条数
const pageSize = ref<number>(3);
// 定义总条数
const total = ref<number>(0);
// spu对象
const spuInfo = ref<SpuModel>();
// 定义spuInfo数组列表数据
const spuInfoList = ref<SpuListModel>([]);
// 定义加载效果
const loading = ref<boolean>(false);
// 定义点击查看按钮是否弹出对话框
const dialogVisible = ref(false);
// 定义sku列表数据
const skuInfoList = ref<SkuInfoListModel>([]);

// 获取spu对象列表数据
const getSpuInfoList = async (
  page: number = current.value,
  limit: number = pageSize.value
) => {
  // 开启加载效果
  loading.value = true;
  // 刷新页面的数据
  current.value = page;
  pageSize.value = limit;
  // 调用接口返回数据
  const result = await getProductApi({
    page,
    limit,
    category3Id: categoryStore.getCategory3Id as number,
  });
  // 关闭加载效果
  loading.value = false;
  //  赋值
  spuInfoList.value = result.records;
  total.value = result.total;
};

// 监视三级分类的id,如果三级分类的id发生变化就调用 getSpuInfoList()
watch(
  // 监视对象
  () => categoryStore.category3Id,
  (category3Id) => {
    // 判断,如果不是三级分类的id
    if (!category3Id) {
      // 重置
      current.value = 1; //页码
      pageSize.value = 3; //没页的条数
      total.value = 0; //总条数
      spuInfoList.value = []; //spu列表数据
      return; //返回
    }
    getSpuInfoList();
  },
  { immediate: true }
);

// 点击查看sku按钮的事件回调
const clickToViewSku = async (row: SpuModel) => {
  // 显示对话框
  dialogVisible.value = true;
  // 保存spu对象的数据
  spuInfo.value = row;
  // 调用接口,获取数据
  skuInfoList.value = await findBySpuIdApi(row.id as number);
};
// 点击显示SpuForm组件
const showAddSpu = () => {
  emits("setCurrentShowStatus", ShowOrHide.SPU_ADD);
};
// 点击显示SkuForm组件
const showAddSku = (row: SpuModel) => {
  emits("setCurrentShowStatus", ShowOrHide.SKU_ADD);
};
// 点击显示SpiList组件
const showUpAddSpu = (row: SpuModel) => {
  emits("setCurrentShowStatus", ShowOrHide.SPU_ADD);
  // 分发父组件传递过来的自定义事件
  emits("setCurrentSpuInfo", {
    ...row,
    spuImageList: [],
    spuSaleAttrlist: [],
  });
};
</script>
<style scoped>
</style>