<template>
    <div>SpuForm</div>
    <el-button @click="$emit('setCurrentShowStatus',ShowOrHide.SPU_LIST)">取消</el-button>
</template>
<script lang="ts">
export default {
    name:'SpuForm'
}
</script>
<script lang="ts" setup>
import {ShowOrHide} from '../types'
const emits = defineEmits(['setCurrentShowStatus'])
</script>
<style scoped>
</style>