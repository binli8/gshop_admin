<template>
    <div>SkuForm</div>
    <el-button @click="$emit('setCurrentShowStatus',ShowOrHide.SPU_LIST)">返回</el-button>
</template>
<script lang="ts">
export default {
    name:'SkuForm'
}
</script>
<script lang="ts" setup>
import {ShowOrHide} from '../types'
const emits = defineEmits(['setCurrentShowStatus']) 
</script>
<style scoped>
</style>