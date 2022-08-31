<template>
    <!-- 三级分类 -->
    <el-card shadow="always">
        <CategorySelector/>
    </el-card>
    <el-card shadow="always" style="margin-top:10px">
        <SpuList v-if="showStatus === ShowStatus.SPU_LIST" @setCurrentShowStatus="setCurrentShowStatus"/>
        <SpuFrom v-else-if="showStatus === ShowStatus.SPU_ADD" @setCurrentShowStatus="setCurrentShowStatus"/>
        <SkuForm v-else-if="showStatus === ShowStatus.SKU_ADD" @setCurrentShowStatus="setCurrentShowStatus"/>
    </el-card>
</template>
<script lang="ts">
export default {
    name:'Spu'
}
</script>
<script lang="ts" setup>

// 引入三级分类组件
import CategorySelector from '@/components/CategorySelector/index.vue'
// 引入表单组件
import SkuForm from './components/SkuForm.vue'
import SpuFrom from './components/SpuFrom.vue'
import SpuList from './components/SpuList.vue'
// 引入ref
import {ref} from 'vue'
// 引入枚举类型
import {ShowStatus} from './types'
// 定义ShowStatus的类型
const showStatus = ref<ShowStatus>(ShowStatus.SPU_LIST)

// 定义修改或隐藏的标识
const setCurrentShowStatus = (val:ShowStatus) =>[
    showStatus.value = val
]
</script>
<style scoped>
</style>