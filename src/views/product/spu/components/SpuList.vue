<template>
  <!-- 按钮 -->
  <el-button type="primary" :icon="Plus" @click="showaddSpu">添加SPU</el-button>

  <!-- 表格 -->
  <el-table
    row-key="id"
    v-loading="loading"
    :data="spuInfoList"
    stripe
    border
    style="margin-top: 20px"
  >
    <el-table-column type="index" label="序号" width="80" align="center">
      <template v-slot="{ $index }">{{
        pageSize * (current - 1) + $index + 1
      }}</template>
    </el-table-column>
    <el-table-column prop="spuName" label="SPU名称" />
    <el-table-column prop="description" label="SKU描述" />
    <el-table-column label="操作">
      <template v-slot="{ row }">
        <el-button
          size="small"
          type="primary"
          :icon="Plus"
          title="添加SKU"
          @click="showaddSku(row)"
        ></el-button>
        <el-button
          size="small"
          type="primary"
          :icon="Edit"
          title="修改SPU"
          @click="showaddUpdateSpu(row)"
        ></el-button>
        <el-button
          size="small"
          type="info"
          :icon="InfoFilled"
          title="查看SKU"
          @click="clickSkuButton(row)"
        ></el-button>
        <el-button
          size="small"
          type="danger"
          :icon="Delete"
          title="删除SPU"
        ></el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- 分页 -->
  <el-pagination
    v-model:currentPage="current"
    v-model:page-size="pageSize"
    :page-sizes="[3, 6, 9]"
    :small="small"
    background
    layout="  prev, pager, next, jumper,->,sizes,total"
    :total="total"
    style="margin-top: 20px"
    @current-change="getSpuInfoList(val, pageSize)"
  />
  <!-- 点击查看按钮弹出对话框 -->
  <el-dialog v-model="dialogVisible" :title="`${spuInfo?.spuName} => SKU列表`">
    <el-table :data="skuInfoList">
      <el-table-column property="skuName" label="名称" />
      <el-table-column property="price" label="价格(元)" width="200" />
      <el-table-column property="weight" label="重量(千克)" />
      <el-table-column label="默认图片">
        <template v-slot="{ row }">
          <el-image
            style="width: 100px; height: 100px"
            :src="row.skuDefaultImg"
          />
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
import { Plus, Edit, Delete, InfoFilled } from "@element-plus/icons-vue";
// 引入ref
import { ref, reactive, watch } from "vue";
// 引入spu相关的api接口
import { getSpuInfoListApi } from "@/api/product/spu";
import { getSkuInfoListBySpuIdApi } from "@/api/product/sku";
// 引入分类仓库
import { useCategoryStore } from "@/stores/category";
import { SpuListModel, SpuModel } from "@/api/product/model/spuModel";
// 引入类型
import type { SkuInfoListModel } from "@/api/product/model/skuModel";
// 引入显示或隐藏的枚举类型
import { ShowStatus } from "../types";
import {deleteSpuInfoByIdApi} from '@/api/product/spu'
import { ElMessage } from 'element-plus';

// 创建仓库对象
const categoryStore = useCategoryStore();
// 定义页码
const current = ref<number>(1);
// 定义每页的条数
const pageSize = ref<number>(3);
// 定义总条数
const total = ref<number>(0);
// 定义spuInfoList数组列表数据
const spuInfoList = ref<SpuListModel>([]);
// 定义loading加载效果
const loading = ref<boolean>(false);
// 定义对话框展示的效果
const dialogVisible = ref<boolean>(false);
// spu对象
const spuInfo = ref<SpuModel>();
// skuinfo的列表数据
const skuInfoList = ref<SkuInfoListModel>([]);

//定义函数,获取数据
const getSpuInfoList = async (
  page: number = current.value,
  limit: number = pageSize.value
) => {
  // 显示加载效果
  loading.value = true;
  current.value = page;
  pageSize.value = limit;
  // 调用接口获取数据
  const result = await getSpuInfoListApi({
    page,
    limit,
    category3Id: categoryStore.getCategory3Id as number,
  });
  //   关闭加载效果
  loading.value = false;
  // 直接赋值
  spuInfoList.value = result.records;
  total.value = result.total;
};
// 监视三级分类的数据,三级分类一变化就调用上面的方法
watch(
  () => categoryStore.category3Id,
  (category3Id) => {
    if (!category3Id) {
      //重置
      current.value = 1; //页码
      pageSize.value = 3; //每页条数
      total.value = 0; //总条数
      spuInfoList.value = []; //spu列表数据
      return;
    }
    getSpuInfoList();
  },
  { immediate: true }
);

// 点击查看sku按钮点击事件的回调函数
const clickSkuButton = async (row: SpuModel) => {
  // 显示对话框
  dialogVisible.value = true;
  // 保存spu对象的数据
  spuInfo.value = row;
  // 调用接口获取数据
  skuInfoList.value = await getSkuInfoListBySpuIdApi(row.id as number);
};

// 接收父组件传递过来的自定义事件
const emit = defineEmits([
  "setCurrentShowStatus",
  "setCurrentSpuInfo",
]);

// 点击按钮添加spu的回调函数
const showaddSpu = () => {
  // 显示SpuForm组件
  emit("setCurrentShowStatus", ShowStatus.SPU_ADD);
};
// 点击按钮添加sku的回调
const showaddSku = (row: SpuModel) => {
  // 显示SpuForm组件
  emit("setCurrentShowStatus", ShowStatus.SKU_ADD);
  // 把sku的id和名字传递出去
  emit('setCurrentSpuInfo',{
    id:row.id,
    spuName:row.spuName
  })
};
// 点击按钮添加spuList的回调
const showaddUpdateSpu = (row: SpuModel) => {
  // 显示SpuForm组件
  emit("setCurrentShowStatus", ShowStatus.SPU_ADD);
  // 分发父级组件传递过来的自定义事件
  emit("setCurrentSpuInfo", {
    ...row,
    spuSaleAttrList: [],
    spuImageList: [],
  });
};

// 删除spu
const deletsSpuInfo = async(spuId:number)=>{
  await deleteSpuInfoByIdApi(spuId)
  ElMessage.success('删除成功')
  getSpuInfoList()
}
</script>
<style scoped>
</style>