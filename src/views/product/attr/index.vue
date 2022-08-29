<template>
  <el-card shadow="always" style="margin-botton: 10px">
    <CategorySelector />
  </el-card>

  <el-card shadow="always">
    <!--按钮和表格 -->
    <div>
      <!-- 按钮 -->
      <el-button type="primary" :icon="Plus">添加属性</el-button>
      <!-- 表格 -->
      <el-table
        v-loading="id"
        :data="attrList"
        stripe
        border
        style="width: 100%"
      >
        <el-table-column type="index" label="序号" width="80" align="center" />
        <el-table-column prop="tmName" label="属性名称" width="150" />
        <el-table-column label="属性值列表"></el-table-column>
        <el-table-column prop="address" label="操作" width="150">
          <template v-slot="{ row }">
            <el-button size="small" type="primary" :icon="Edit"></el-button>
            <el-button size="small" type="danger" :icon="Delete"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-card>
</template>
<script lang="ts">
export default {
  name: "Attr",
};
</script>
<script lang="ts" setup>
import { ref } from "vue";
// 引入三级分类组件
import CategorySelector from "@/components/CategorySelector/index.vue";
// 引入icon
import { Plus } from "@element-plus/icons-vue";
// 引入平台属性值对象数组接口类型
import type { AttrValueListModel } from "@/api/product/model/attrModel";
// 引入仓库
import { useCategoryStore } from "@/stores/category";
// 引入-根据三级分类的id获取对应的平台属性对象数组的接口函数
import { getAttrInfoListApi } from "@/api/product/attr";
// 表格加载标识
const loading = ref<boolean>(false);
// 定义平台属性对象数组列表数据
const attrList = ref<AttrValueListModel>([]);
const categoryStore = useCategoryStore();
// 获取三级分类的id,调用接口,获取平台属性列表数据
// 获取平台属性列表数据的方法
const getAttrList = async () => {
  await getAttrInfoListApi({
    category1Id: categoryStore.category1Id,
    category2Id: categoryStore.category2Id,
    category3Id: categoryStore.category3Id,
  });
  console.log(attrList.value);
};
</script>
<style scoped>
</style>