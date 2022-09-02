<template>
  <el-card shadow="always">
    <!-- 三级分类 -->
    <CategorySelector />
  </el-card>
  <el-card shadow="always" style="margin-top: 10px">
    <SpuList v-if="showOrHide === ShowStatus.SPU_LIST" @alterShowOrHide="alterShowOrHide"/>
    <SpuForm v-else-if="showOrHide === ShowStatus.SPU_ADD" @alterShowOrHide="alterShowOrHide"/>
    <SkuForm v-else-if="showOrHide === ShowStatus.SKU_ADD" @alterShowOrHide="alterShowOrHide"/>
  </el-card>
</template>
<script lang="ts">
export default {
  name: "Spu",
};
</script>
<script lang="ts" setup>
import { ref } from "vue";
import CategorySelector from "@/components/CategorySelector/index.vue";
// 引入spulist组件,展示spu对象数组列表数据
import SpuList from "./components/SpuList.vue";
// 引入spuform组件,添加或者修改spu
import SpuForm from "./components/SpuForm.vue";
// 引入skuform组件,添加sku
import SkuForm from "./components/SkuForm.vue";
// 引入枚举类型
import { ShowStatus } from "./types";
const showOrHide = ref<ShowStatus>(ShowStatus.SPU_LIST);
// 修改显示或者隐藏标识
const alterShowOrHide = (val:ShowStatus)=>{
    showOrHide.value = val 
}
</script>
<style scoped>
</style>