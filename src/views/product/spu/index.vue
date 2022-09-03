<template>
  <el-card shadow="always">
    <CategirySelector />
  </el-card>

  <el-card shadow="always" style="margin-top: 20px">
    <SpuList
      v-if="showOrHide === ShowOrHide.SPU_LIST"
      @setCurrentShowStatus="setCurrentShowStatus"
      @setCurrentSpuInfo="setCurrentSpuInfo"
    />
    <SpuForm
      v-else-if="showOrHide === ShowOrHide.SPU_ADD"
      @setCurrentShowStatus="setCurrentShowStatus"
      :currentSpuInfo="currentSpuInfo"
    />
    <SkuForm
      v-else-if="showOrHide === ShowOrHide.SKU_ADD"
      @setCurrentShowStatus="setCurrentShowStatus"
      :spu="{id:currentSpuInfo.id,spuName:currentSpuInfo.spuName}"
    />
  </el-card>
</template>
<script lang="ts">
export default {
  name: "Spu",
};
</script>
<script lang="ts" setup>
// 引入公共三级分类组件组件
import CategirySelector from "@/components/CategirySelector/index.vue";
// 展示spu对象数组列表数据
import SpuList from "./components/SpuList.vue";
// 添加或者修改spu
import SpuForm from "./components/SpuForm.vue";
// 添加sku的
import SkuForm from "./components/SkuForm.vue";
// 引入ref
import { ref } from "vue";
// 引入显示或隐藏组件的枚举
import { ShowOrHide } from "./types";
// 引入spu的接口类型
import type { SpuModel } from "@/api/product/model/spuModel";
const showOrHide = ref<ShowOrHide>(ShowOrHide.SPU_LIST);
// 修改显示或者隐藏的标识
const setCurrentShowStatus = (val: ShowOrHide) => {
  showOrHide.value = val;
};
// 定义初始化spu对象传入到spuForm组件中
const initSpuInfo = () => ({
  tmId: undefined, //品牌的id
  spuName: "", //spu的名字
  description: "", //spu 的描述
  spuSaleAttrList: [], //spu销售属性对象数组
  spuImageList: [], //spu的图片对象数组
});
// 定义一个对象用来存储spuInfo对象的初始数据
const currentSpuInfo = ref<SpuModel>(initSpuInfo());
// 定义一个方法,用来修改spuInfo对象数据
const setCurrentSpuInfo = (val: SpuModel = initSpuInfo()) => {
  currentSpuInfo.value = val;
};
</script>
<style scoped>
</style>