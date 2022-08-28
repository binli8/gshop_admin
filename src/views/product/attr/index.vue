<template>
  <el-card>
    <CategorySelector />
  </el-card>
</template>
<script lang="ts">
export default {
  name: "Attr",
};
</script>
<script lang="ts" setup>
import CategorySelector from "@/components/CategorySelector/index.vue";
</script>
<style scoped>
</style>