<template>
  <el-card shadow="hover">
    <!-- 添加按钮 -->
    <template #header>
      <el-button type="primary" :icon="Plus" @click="showAdd">添加</el-button>
    </template>

    <!-- 表格 -->
    <el-table
      v-loading="loading"
      :data="trademarkList"
      stripe
      style="width: 100%"
      border
    >
      <el-table-column type="index" label="序号" width="80" align="center" />
      <el-table-column prop="tmName" label="品牌名称" />
      <el-table-column label="品牌LOGO">
        <template v-slot="{ row }">
          <img :src="row.logoUrl" alt="" width="100" height="60" />
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作">
        <template v-slot="{ row }">
          <el-button
            size="small"
            type="warning"
            :icon="Edit"
            @click="showUPdate(row)"
          ></el-button>
          <el-button size="small" type="danger" :icon="Delete"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->

    <el-pagination
      v-model:currentPage="current"
      v-model:page-size="pageSize"
      :page-sizes="[3, 6, 9]"
      :small="small"
      :disabled="disabled"
      :background="background"
      layout="prev, pager, next, jumper,->,sizes,total,"
      :total="total"
      @size-change="getTrademarkList(1, val)"
      @current-change="getTrademarkList(val, pageSize)"
      style="margin-top: 20px"
    />
    <!-- 对话框 -->

    <el-dialog
      v-model="dialogFormVisible"
      draggable="Dialog"
      :title="trademark.id ? '修改品牌' : '添加品牌'"
    >
      <el-form :model="trademark" style="width: 80%" label-width="100px">
        <el-form-item label="品牌名称">
          <el-input v-model="trademark.tmName" autocomplete="off" />
        </el-form-item>
        <!-- 上传图片的一项 -->
        <el-form-item label="品牌LOGO">
          <el-upload
            class="avatar-uploader"
            :action="`${BASE_URL}/admin/product/fileUpload`"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <!-- 显示加载的效果 -->
            <el-icon v-if="uploadLoading" class="avatar-uploader-icon">
              <Loading />
            </el-icon>
            <!-- 显示图片 -->
            <img
              v-else-if="trademark.logoUrl"
              :src="trademark.logoUrl"
              class="avatar"
            />
            <!-- 显示加号 -->
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            <!-- 一句话 -->
            <template #tip>
              <div class="el-upload__tip">
                只能上传jpeg/png格式的图片,且不超过50kb
              </div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="dialogFormVisible = false"
            >确认</el-button
          >
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
// 引入UI组件库图标
import { Plus, Edit, Delete, Loading } from "@element-plus/icons-vue";
import { ElMessage, UploadProps } from "element-plus";

// 引入品牌相关的数据的接口类型
import type {
  TrademarkListModel,
  TrademarkModel,
} from "@/api/product/model/trademarkModel";
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
const loading = ref<Boolean>(false);
// 定义一个标识,用来控制对话框是否显示的
const dialogFormVisible = ref(false);
// 定义品牌对象,并设置内部的名称和logo地址为空
const trademark = reactive<TrademarkModel>({
  tmName: "", //品牌的名字
  logoUrl: "", //品牌的地址
});
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
  // 调用接口函数
  const result = await getTrademarkListApi(page, limit);
  // console.log(result);
  // 关闭加载标识
  loading.value = false;
  // 更新数据
  trademarkList.value = result.records;
  total.value = result.total;
};

// // 分页器
// const handleSizeChange = (val: number) => {
//   console.log(`${val} items per page`)
// }
// const handleCurrentChange = (val: number) => {
//   console.log(`current page: ${val}`)
// }

// 点击添加按钮,显示对话框
const showAdd = () => {
  // 清空原有的数据
  trademark.tmName = "";
  trademark.logoUrl = "";
  dialogFormVisible.value = true;
  trademark.id = undefined;
};
// 点击修改按键,显示对话框
const showUPdate = (row: TrademarkModel) => {
  // 把当前点击的这一行品牌对象的数据拷贝一份,保存到trademark对象中
  Object.assign(trademark, row);
  dialogFormVisible.value = true;
};
// 对话框图片的根路径地址
const BASE_URL = import.meta.env.VITE_API_URL;
// 页码加载后的钩子
onMounted(() => {
  getTrademarkList();
});
</script>
<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>