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
          <el-button
            size="small"
            type="warning"
            :icon="Edit"
            @click="showUpdate(row)"
          >
          </el-button>
          <el-button size="small" type="danger" :icon="Delete"> </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      v-model:currentPage="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[3, 6, 9]"
      :small="small"
      background
      layout="prev, pager, next, jumper,->,sizes,total,"
      :total="total"
      style="margin-top: 20px"
      @size-change="getTrademarkList(1, value)"
      @current-change="getTrademarkList(val, pageSize)"
    />

    <!-- 对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="trademark.id ? '修改品牌' : '添加品牌'"
    >
      <el-form ref="formRef" :rules="rules" :model="trademark" style="width: 80%" label-width="100px">
        <!-- 品牌名称 -->
        <el-form-item label="品牌名称" prop="tmName">
          <el-input v-model="trademark.tmName" autocomplete="off" />
        </el-form-item>

        <el-form-item label="品牌LOGO" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            :action="`${BASE_URL}/admin/product/fileUpload`"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <!-- 显示加载的效果 -->
            <el-icon v-if="uploadloading" class="avatar-uploader-icon">
              <Loading
            /></el-icon>
            <!-- 显示图片 -->
            <img
              v-else-if="trademark.logoUrl"
              :src="trademark.logoUrl"
              class="avatar"
            />
            <!-- 显示加号 -->
            <el-icon v-else class="avatar-uploader-icon"> <Plus /> </el-icon>
            <template #tip>
              <div class="el-upload__tip">只能上传jpg/png文件,且不超过50kb</div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="dialogVisible = false"
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
// 引入icon图标
import { Plus, Edit, Delete, Loading } from "@element-plus/icons-vue";
import type { UploadProps,FormInstance,FormRules } from "element-plus";
import { ElMessage } from "element-plus";
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
const dialogVisible = ref(false);
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
  // 调用接口
  const result = await getTrademarkListApi(page, limit);
  // 关闭加载标识
  loading.value = false;
  // 更新数据
  trademarkList.value = result.records;
  total.value = result.total;
};
// 定义添加按钮,显示对话框
const showAdd = () => {
  // 清空原有的数据
  trademark.tmName = "";
  trademark.logoUrl = "";
  dialogVisible.value = true;
};
// 点击修改对话框
const showUpdate = (row: TrademarkModel) => {
  //  把当前点击的一行品牌对象的数据拷贝一份,保存到trademar对象中
  Object.assign(trademark, row);
  dialogVisible.value = true;
};
// 图片的加载效果的标识
const uploadloading = ref<boolean>(false)
// 图片的跟根路径地址
const BASE_URL = import.meta.env.VITE_API_URL
// 存储图片
const handleAvatarSuccess : UploadProps['onSuccess'] = (res) =>{
  // 存储上传成功的图片地址
  trademark.logoUrl = res.data
  // 关闭加载的效果
  uploadloading.value = false
}
const beforeAvatarUpload:UploadProps['beforeUpload'] = (file) =>{
// 限制两种图片的类型
const isJpegOrPng = ['image/jpeg','image/png'].includes(file.type)
// 限制图片的大小
const isSize50k = file.size / 1024< 50
// 判断图片的类型
if (!isJpegOrPng) {
  ElMessage.error('必须上传jpeg或者png格式的照片')
  return false
}
if (!isSize50k) {
  ElMessage.error('上传的图片必须小于50kb')
  return false
}
// 开启图片加载效果
uploadloading.value = false
return true
}
// 定义用来收集表单form对象的
const formRef = ref<FormInstance>()
//  验证规则
const rules = reactive<FormRules>({
  
})
// 页面加载后的钩子
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