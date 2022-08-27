<template>
  <el-card shadow="hover">
       <!-- 添加按钮 -->
    <template #header>
        <el-button type="primary" :icon="Plus">添加</el-button>
    </template>

    <!-- 表格 -->
    <el-table v-loading="loading" :data="trademarkList" stripe style="width: 100%" border>
    <el-table-column type="index" label="序号" width="80" align="center"/>
    <el-table-column prop="tmName" label="品牌名称"  />
    <el-table-column label="品牌LOGO" >
        <template v-slot={row}>
           <img :src="row.logoUrl" alt="" width="100" height="60"/>
        </template>
    </el-table-column>
    <el-table-column prop="address" label="操作" >
        <template v-slot={row}>
             <el-button type="warning" :icon="Edit" />
             <el-button type="danger" :icon="Delete" />
        </template>
    </el-table-column>
  </el-table>

    <!-- 分页 -->

     <el-pagination
      v-model:currentPage="current"
      v-model:page-size="pageSize"
      :page-sizes="[3,6,9]"
      :small="small"
      :disabled="disabled"
      :background="background"
      layout="prev, pager, next, jumper,->,sizes,total,"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />



    <!-- 对话框 -->
  </el-card>
</template>
<script lang="ts">
export default {
  name: "Trademark",
};
</script>
<script lang="ts" setup>
// 引入UI组件库图标
import { Plus,Edit,Delete } from "@element-plus/icons-vue";
// 引入品牌相关的数据的接口类型
import type { TrademarkListModel,TrademarkModel } from "@/api/product/model/trademarkModel";
// 引入 ref
import { onMounted, reactive, ref } from "vue";
// 引入品牌相关的接口函数
import { getTrademarkListApi } from "@/api/product/trademark";
// 定义数组,用来收集品牌列表的数组数据信息
const trademarkList = ref<TrademarkListModel>([]);
const current = ref<number>(1); //页面数
const pageSize = ref<number>(3); // 每页的条数
const total = ref<number>(0); // 总条数
// 定义加载效果的标识
const loading = ref<Boolean>(false)
// 定义品牌对象,并设置内部的名称和logo地址为空
const trademark = reactive<TrademarkModel>({
    tmName:'',  //品牌的名字
    logoUrl:''  //品牌的地址
})
// 定义一个函数,用来获取品牌列表的数据
const getTrademarkList = async (
  page: number = current.value,
  limit: number = pageSize.value
) => {
    // 更新页码和每页条数的数据
    current.value = page
    pageSize.value = limit
    // 开启加载标识
    loading.value = true
    // 调用接口函数
    const result = await getTrademarkListApi(page,limit)
    // console.log(result);
    // 关闭加载标识
    loading.value = false
    // 更新数据
   trademarkList.value = result.records
   total.value = result.total
      
};

// 分页器
const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`)
}
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`)
}
// 页码加载后的钩子
onMounted(()=>{
    getTrademarkList()
})
</script>
<style scoped>
</style>