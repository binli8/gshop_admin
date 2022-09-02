<template>
    <div>SkuForm
         <el-button @click="$emit('setCurrentShowStatus',ShowStatus.SPU_LIST)">取消</el-button>
    </div>
</template>
<script lang="ts">
export default {
    name:'SkuForm'
}
</script>
<script lang="ts" setup>
// 引入显示或者隐藏的界面的枚举类型
import { ShowStatus } from "../types";
// 引入icon
import {Plus,Delete}from '@element-plus/icons-vue'
</script>
<style scoped>
</style>


