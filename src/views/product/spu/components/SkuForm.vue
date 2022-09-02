<template>
    <div>SkuForm
        <el-button @click="$emit('alterShowOrHide',ShowStatus.SPU_LIST)">取消</el-button>
    </div>
</template>
<script lang="ts">
export default {
    name:'SkuForm'
}
</script>
<script lang="ts" setup>
import {ShowStatus} from '../types'
// 接收父组件传递过来的自定义事件
const emits = defineEmits(['alterShowOrHide'])
</script>
<style scoped>
</style>