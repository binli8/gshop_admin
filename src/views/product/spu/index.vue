<template>
  <el-card shadow="always">
    <!-- 三级分类 -->
    <CategorySelector />
  </el-card>
  <el-card shadow="always" style="margin-top: 10px">
    <SpuList
      v-if="showOrHide === ShowStatus.SPU_LIST"
      @alterShowOrHide="alterShowOrHide"
      @setCurrentSpuInfo='setCurrentSpuInfo'
    />
    <SpuForm
      v-else-if="showOrHide === ShowStatus.SPU_ADD"
      @alterShowOrHide="alterShowOrHide"
      :currentSpu = currentSpuInfo
    />
    <SkuForm
      v-else-if="showOrHide === ShowStatus.SKU_ADD"
      @alterShowOrHide="alterShowOrHide"
    />
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
import { SpuModel } from '@/api/product/model/spuModel';
const showOrHide = ref<ShowStatus>(ShowStatus.SPU_LIST);
// 修改显示或者隐藏标识
const alterShowOrHide = (val: ShowStatus) => {
  showOrHide.value = val;
};
// 父组件吧修改后的数据传入到spuForm组价中
const initSpuInfo = () =>({
    tmId: undefined,            //品牌的id
    spuName: ''    ,      //spu的名字
    description: '',      //spu的描述
    spuSaleAttrList: [],       //spu的销售属性对象数组
    spuImageList: []             //spu的图片对象数组
})
// 定义一个对象来存储spuInfo对象的初始数据
const currentSpuInfo = ref<SpuModel>(initSpuInfo())
// 定义一个方法,用来修改spuInfo对象数据
const setCurrentSpuInfo = (val:SpuModel =initSpuInfo())=>{
    currentSpuInfo.value = val
}
</script>
<style scoped>
</style>