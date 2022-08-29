<template>
  <el-form inline>
    <el-card>
      <el-form-item label="一级分类" type="primary">
        <el-select v-model="category1Id" placeholder="请选择">
          <el-option
            v-for="c1 in categoryStore.category1List"
            :key="c1.id"
            :label="c1.name"
            :value="c1.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="二级分类">
        <el-select v-model="category2Id" placeholder="请选择">
          <el-option
            v-for="c2 in categoryStore.category2List"
            :key="c2.id"
            :label="c2.name"
            :value="c2.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="三级分类">
        <el-select v-model="categoryStore.category3Id" placeholder="请选择">
          <el-option
            v-for="c3 in categoryStore.category3List"
            :key="c3.id"
            :label="c3.name"
            :value="c3.id"
          />
        </el-select>
      </el-form-item>
    </el-card>
  </el-form>
</template>

<script lang="ts">
export default {
  name: "CategirySelector",
};
</script>

<script lang="ts" setup>
// 引入仓库
import { useCategoryStore } from "@/stores/category";
import { onMounted, computed } from "vue";
// 获取分类仓库对象
const categoryStore = useCategoryStore();
// 页面加载完毕后,调用获取一级分类列表数据的函数
onMounted(() => {
  categoryStore.getCategory1List1();
});
// 计算属性一级分类的id
const category1Id = computed({
  get() {
    return categoryStore.getCategory1Id as number;
  },
  set(val: number) {
    // 直接获取二级分类的数据
    categoryStore.getCategory2List2(val);
  },
});
// 计算属性二级分类的id
const category2Id = computed({
  get() {
    return categoryStore.getCategory2Id as number;
  },
  set(val: number) {
    // 直接获取二级分类的数据
    categoryStore.getCategory3List3(val);
  },
});
</script>


<style scoped>
</style>