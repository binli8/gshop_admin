<template>
  <!-- 三级分类 -->
  <el-card shadow="always">
    <CategorySelector />
  </el-card>
  <el-card shadow="always" style="margin-top: 10px">
    <SpuList
      v-if="showStatus === ShowStatus.SPU_LIST"
      @setCurrentShowStatus="setCurrentShowStatus"
      @setCurrentSpuInfo="setCurrentSpuInfo"
    />
    <SpuFrom
      v-else-if="showStatus === ShowStatus.SPU_ADD"
      @setCurrentShowStatus="setCurrentShowStatus"
      :currentSpu="currentSpuInfo"
    />
    <SkuForm
      v-else-if="showStatus === ShowStatus.SKU_ADD"
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
// 引入三级分类组件
import CategorySelector from "@/components/CategorySelector/index.vue";
// 引入表单组件
import SkuForm from "./components/SkuForm.vue";
import SpuFrom from "./components/SpuFrom.vue";
import SpuList from "./components/SpuList.vue";
// 引入ref
import { ref } from "vue";
// 引入枚举类型
import { ShowStatus } from "./types";
import { SpuModel } from "@/api/product/model/spuModel";
// 定义ShowStatus的类型
const showStatus = ref<ShowStatus>(ShowStatus.SPU_LIST);

// 定义修改或隐藏的标识
const setCurrentShowStatus = (val: ShowStatus) => [(showStatus.value = val)];

//  父组件把修改后的数据传入spuList中
const initSpuInfo = () => ({
  tmId: undefined, //品牌的id
  spuName: "", //spu的名字
  description: "", //spu的描述
  spuSaleAttrList: [], //spu的销售属性对象数组
  spuImageList: [], //spu的图片对象数组
});
// 定义一个对象用来存在spuInfo对象的初始值
const currentSpuInfo = ref<SpuModel>(initSpuInfo());
// 定义一个个方法,用来修改spuInfo 对象数据
const setCurrentSpuInfo = (val: SpuModel = initSpuInfo()) => {
  currentSpuInfo.value = val;
};
</script>
<style scoped>
</style>

