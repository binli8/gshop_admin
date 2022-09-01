<template>
  <el-card shadow="always">
    <CategirySelector />
  </el-card>

  <el-card shadow="always" style="margin-top: 20px">
    <SpuList
      v-if="showOrHide === ShowOrHide.SPU_LIST"
      @setCurrentShowStatus="setCurrentShowStatus"
    />
    <SpuForm
      v-else-if="showOrHide === ShowOrHide.SPU_ADD"
      @setCurrentShowStatus="setCurrentShowStatus"
    />
    <SkuForm
      v-else-if="showOrHide === ShowOrHide.SKU_ADD"
      @setCurrentShowStatus="setCurrentShowStatus"
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
const showOrHide = ref<ShowOrHide>(ShowOrHide.SPU_LIST);
// 修改显示或者隐藏的标识
const setCurrentShowStatus = (val: ShowOrHide) => {
  showOrHide.value = val;
};
</script>
<style scoped>
</style>