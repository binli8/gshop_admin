<template>
  <el-card shadow="hover">
    <template #header>
      <!-- 按钮 -->
      <el-button type="primary" :icon="Plus" @click="showAdd">添加</el-button>
    </template>
    <!-- 表格 -->
    <el-table
      v-loading="loading"
      :data="trademarkList"
      style="width: 100%"
      stripe
      border
    >
      <el-table-column type="index" width="80" label="序号" align="center" />
      <el-table-column prop="tmName" label="品牌名称" />
      <el-table-column label="品牌LOGO">
        <template v-slot="{ row }">
          <img :src="row.logoUrl" alt="" width="100" height="60" />
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作">
        <template #default="{ row }">
          <el-button size="small" type="warning" :icon="Edit" @click="showUpdate(row)"> </el-button>
          <el-button size="small" type="danger" :icon="Delete"> </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->    
    <el-pagination
      v-model:currentPage="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[3,6,9]"
      :small="small"
      background
      layout="prev, pager, next, jumper,->,sizes,total,"
      :total="total"
      style="margin-top: 20px"
    />

<!-- 对话框 -->
<el-dialog v-model="dialogVisible" :title="trademark.id?'修改品牌':'添加品牌'">
    <el-form :model="trademark">
      <el-form-item label="品牌名称" :label-width="formLabelWidth">
        <el-input v-model="trademark.tmName" autocomplete="off"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确认</el-button>
      </span>
    </template>
  </el-dialog>

  </el-card>
</template>
<script lang="ts">
export default {
  name: "Trademark",
};
</script>
<script lang="ts" setup>
// 引入icon图标
import { Plus ,Edit,Delete} from "@element-plus/icons-vue";
// 引入品牌相关的数据的接口类型
import type {
  TrademarkModel,
  TrademarkListModel,
  TrademarkPageListModel,
} from "@/api/product/model/TrademarkModel";
// 引入ref
import { onMounted, reactive, ref } from "vue";
// 引入品牌相关的数据的接口类型
import { getTrademarkListApi } from "@/api/product/trademark";
// 定义数组,用来收集品牌列表的数组数据信息
const trademarkList = ref<TrademarkListModel>([]);
const current = ref<number>(1); //页码数
const pageSize = ref<number>(3); //每页的条数
const total = ref<number>(0); //总页数
// 定义加载效果的标识
const loading = ref<boolean>(false);
// 定义一个标识,用来控制对话框是否显示
const dialogVisible = ref(false)
// 定义品牌对象,并设置内部的名称和logo地址为空
const trademark = reactive<TrademarkModel>({
  tmName:'',//品牌的名字
  logoUrl:'',//品牌的地址
})
// 定义一个函数,用来获取品牌列表的数据
const getTrademarkList = async (
  page: number = current.value,
  limit: number = pageSize.value
) => {
  // 更新页码和每页条数的数据
  current.value = page;
  pageSize.value = limit;
  // 开启加载标识
  loading.value = true;
  // 调用接口
  const result = await getTrademarkListApi(page, limit);
  // 关闭加载标识
  loading.value = false;
  // 更新数据
  trademarkList.value = result.records;
  total.value = result.total;
};
// 定义添加按钮,显示对话框
const showAdd = () =>{
  // 清空原有的数据
  trademark.tmName = ''
  trademark.logoUrl = ''
  dialogVisible.value = true
}
// 点击修改对话框
const showUpdate = (row:TrademarkModel) =>{
  //  把当前点击的一行品牌对象的数据拷贝一份,保存到trademar对象中
  Object.assign(trademark,row)
  dialogVisible.value = true
}
// 页面加载后的钩子
onMounted(() => {
  getTrademarkList();
});
</script>
<style scoped>
</style>