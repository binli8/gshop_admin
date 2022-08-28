<template>
  <el-card shadow="hover">
    <template #header>
      <!-- 添加按钮 -->
      <div>
        <el-button type="primary" :icon="Plus" @click="showAdd">添加</el-button>
      </div>
    </template>
    <!-- 表格 -->
    <el-table
      v-loading="loading"
      :data="trademarkList"
      stripe
      border
      style="width: 100%"
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
            @click="showUpdate(row)"
          ></el-button>
          <el-button size="small" type="danger" :icon="Delete" @click="deleteBrand(row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      v-model:currentPage="current"
      v-model:page-size="pageSize"
      :page-sizes="[3, 6, 9]"
      :small="small"
      background
      layout="  prev, pager, next, jumper,->,sizes,total"
      :total="total"
      @size-change="getTrademarkList(1, value)"
      @current-change="getTrademarkList(value, pageSize)"
      style="margin-top: 20px"
    />
    <!-- 对话框 -->

    <el-dialog
      v-model="dialogFormVisible"
      draggable="boolean"
      :title="trademark.id ? '修改品牌' : '添加品牌'"
    >
      <el-form
        :model="trademark"
        style="width: 80%"
        label-width="100px"
        ref="formRef"
        :rules="rules"
      >
        <el-form-item label="品牌名称" prop="tmName">
          <el-input v-model="trademark.tmName" autocomplete="off" />
        </el-form-item>
        <!-- 上传图片的一项 -->
        <el-form-item label="品牌LOGO" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            :action="`${BASE_URL}//admin/product/fileUpload`"
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
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="addOrUpdate">确定</el-button>
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
// 引入图标
import { Plus, Edit, Delete, Loading } from "@element-plus/icons-vue";
import type { UploadProps, FormInstance, FormRules, } from "element-plus";
import { ElMessage, ElMessageBox } from "element-plus";
// 引入品牌相关的数据的接口类型
import {
  TrademarkModel,
  TrademarkListModel,
} from "@/api/product/model/trademarkModel";
// 引入ref
import { ref, onMounted, reactive,nextTick } from "vue";
// 引入品牌相关的接口函数
import { getTrademarkListApi,addOrUpdateTrademarkApi,deleteTrademarkByIdApi } from "@/api/product/trademark";


// 定义数组,用来收集品牌列表的数组数据信息
const trademarkList = ref<TrademarkListModel>([]);
const current = ref<number>(1); //页码数
const pageSize = ref<number>(3); //每条的页数
const total = ref<number>(0); //总页数
// 定义加载标识
const loading = ref<boolean>(false);
// 定义一个标识,用来控制对话框是否显示的
const dialogFormVisible = ref(false);
// 定义品牌对象,并设置内部的名称和logo地址为空
const initTrademark = () =>({id:undefined,tmName:'',logoUrl:''})
// const trademark = reactive<TrademarkModel>({
//   tmName: "", //品牌的名字
//   logoUrl: "", //品牌的地址
// });
const trademark  = reactive<TrademarkModel>(initTrademark())
// 定义一个函数,用来获取品牌列表的数据
const getTrademarkList = async (
  page: number = current.value, //页码数
  limit: number = pageSize.value //每页显示的条数
) => {
  // 更新页码和每页条数的数据
  current.value = page;
  pageSize.value = limit;
  // 开启加载效果
  loading.value = true;
  // 调用接口函数
  const result = await getTrademarkListApi(page, limit);
  // console.log(result);
  // 关闭加载效果
  loading.value = false;
  //   更新数据
  trademarkList.value = result.records;
  total.value = result.total;
};
onMounted(() => {
  getTrademarkList();
});
// 点击添加按钮,显示对话框
const showAdd = () => {
  // 清空原有的数据
  // trademark.tmName = "";
  // trademark.logoUrl = "";
  // trademark.id = undefined;
  // dialogFormVisible.value = true;
  Object.assign(trademark,initTrademark())
  dialogFormVisible.value = true
  // 清除所有的表单验证信息
  nextTick(() => {
    formRef.value?.clearValidate(); //清理
    // formRef.value?.resetFields()  //重置
  });
};
// 点击按钮,显示对话框
const showUpdate = (row: TrademarkModel) => {
  // 把当前点击的这一行品牌对象的数据拷贝一份,保存到trademark对象中
  Object.assign(trademark, row);
  dialogFormVisible.value = true;
};
// 图片加载的效果标识
const uploadloading = ref<boolean>(false);
// 图片的根路径地址
const BASE_URL = import.meta.env.VITE_API_URL;
//
const handleAvatarSuccess: UploadProps["onSuccess"] = (res) => {
  console.log(res);
  // 存储上传成功的图片的地址
  trademark.logoUrl = res.data;
  // 关闭加载的效果
  uploadloading.value = false;
  // 清理图片的验证信息
  formRef.value?.clearValidate("logoUrl");
};

const beforeAvatarUpload: UploadProps["beforeUpload"] = (file) => {
  console.log(file);
  // 限制两种图片的类型
  const isJpegOrPng = ["image/jpeg", "image/png"].includes(file.type);
  // 限制图片的大小
  const isImageSize = file.size / 1024 < 50;
  // 判断图片的类型
  if (!isJpegOrPng) {
    ElMessage.error("必须上传jpg或png格式的图片");
    return false;
  }
  if (!isImageSize) {
    ElMessage.error("上传的图片大小不能超过50k");
    return false;
  }
  // 开启图片加载效果
  uploadloading.value = true;
};

// 添加或者修改品牌
const addOrUpdate = () => {
  formRef.value?.validate(async(valid) => {
    // 表单验证不通过,什么也不做
    if (!valid) return;
    // 表单验证通过
    try {
      // 调用接口
      await addOrUpdateTrademarkApi(trademark)
      // 提示信息
      ElMessage.success('操作成功')
      // 刷新
      getTrademarkList(trademark.id?current.value:1)
      // 关闭对话框
      dialogFormVisible.value = false
    } catch (error:any) {
      ElMessage.error('操作失败',error)
    }
  });
};

// 定义用来收集表单form对象的
const formRef = ref<FormInstance>();
// 验证品牌名称
const validateTmName = (rule:any,value:any,callback:any) =>{
  if (value.length< 2|| value.length>10) {
    callback('品牌名称必须在2到10个字之间')
  } else{
    callback()
  }
}
// 
//  验证规则
const rules = reactive<FormRules>({
  // 针对品牌名称的验证规则
  tmName: [
    { required: true, message: "必须输入品牌名称",trigger:"blur"},
    {validator:validateTmName,trigger:'blue'}
    // {
    //   min: 2,
    //   max: 10,
    //   message: "品牌的名称必须在2到10个字之间",
    //   trigger: "blur",
    // },
  ],
  logoUrl: [
    {
      required: true,
      message: "必须上传图片",
      trigger: "change",
    },
  ],
});

// 定义删除品牌的回调
const deleteBrand = (row:TrademarkModel)=>{
  ElMessageBox.confirm(`您确认删除${row.tmName}吗`,'提示',{
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async() => {
      await deleteTrademarkByIdApi(row.id as number)
      // 提示信息
      ElMessage.success('操作成功')
      // 如果此时是当前这一页是第一页,那么删除数据后,直接刷新就可以了,如果此时不是第一页,而且,数据只剩下一条
      // 删除后此时应该回到上一页,进行刷新
      if (trademarkList.value.length === 1 && current.value > 1) {
        current.value -= 1
      }
    })
    // 刷新
    getTrademarkList()
    .catch(() => {})
}

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