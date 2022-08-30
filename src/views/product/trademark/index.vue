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
          <el-button
            size="small"
            type="danger"
            :icon="Delete"
            @click="deleteOperation(row)"
          >
          </el-button>
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
      <el-form
        ref="formRef"
        :rules="rules"
        :model="trademark"
        style="width: 80%"
        label-width="100px"
      >
        <el-form-item label="品牌名称" prop="tmName">
          <el-input v-model="trademark.tmName" autocomplete="off" />
        </el-form-item>
        <!-- 上传图片的一项 -->
        <el-form-item label="品牌LOGO" prop="logoUrl">
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
          <el-button type="primary" @click="addOrUpdate">确认</el-button>
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
import {
  ElMessage,
  uploadContentProps,
  UploadProps,
  FormInstance,
  FormRules,
  ElMessageBox,
} from "element-plus";
// 引入品牌相关的数据的接口类型
import type {
  TrademarkListModel,
  TrademarkModel,
} from "@/api/product/model/trademarkModel";
// 引入 ref
import { onMounted, reactive, ref, nextTick } from "vue";
// 引入品牌相关的接口函数
import {
  getTrademarkListApi,
  addOrUpdateTrademarkApi,
  deleteTrademarkByIdApi
} from "@/api/product/trademark";
import { get } from 'http';

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
const initTrademark = () => ({ tmName: "", logoUrl: "", id: undefined });
const trademark = reactive<TrademarkModel>(initTrademark());
// const trademark = reactive<TrademarkModel>({
//   tmName: "", //品牌的名字
//   logoUrl: "", //品牌的地址
// });

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
  // trademark.tmName = "";
  // trademark.logoUrl = "";
  // trademark.id = undefined;
  Object.assign(trademark, initTrademark());
  dialogFormVisible.value = true;
  //清理所有的表单验证信息
  nextTick(() => {
    formRef.value?.clearValidate(); //清理
    // formRef.value?.resetFields(); //重置
  });
};

// 点击修改按键,显示对话框
const showUPdate = (row: TrademarkModel) => {
  formRef.value?.clearValidate();
  // 把当前点击的这一行品牌对象的数据拷贝一份,保存到trademark对象中
  Object.assign(trademark, row);
  dialogFormVisible.value = true;
};
// 图片加载的效果标识
const uploadLoading = ref<boolean>(false);

// 对话框图片的根路径地址
const BASE_URL = import.meta.env.VITE_API_URL;

// 存储照片
const handleAvatarSuccess: UploadProps["onSuccess"] = (res) => {
  // 存储上传成功的图片和地址
  trademark.logoUrl = res.data;
  // 关闭加载的效果
  uploadLoading.value = false;
  // 清理掉图片的验证信息
  formRef.value?.clearValidate("logoUrl");
};

// 表单验证:
// 1.定义用来收集表单的form对象
const formRef = ref<FormInstance>();
// 2.验证品牌名称
const validateTmName = (rule: any, value: any, callback: any) => {
  if (value.length < 2 || value.length > 10) {
    callback("品牌名必须在2-10个字之间");
  } else {
    callback();
  }
};
// 3.验证品牌LOGO
const beforeAvatarUpload: UploadProps["beforeUpload"] = (file) => {
  // 限制两种图片的类型
  const isJpeOrPeng = ["image/jpeg", "image/png"].includes(file.type);
  //  限制图片的大小
  const isImageSize = file.size / 1024 < 50;
  // 判断图片的类型
  if (!isJpeOrPeng) {
    ElMessage.error("必须上传jpg或者png格式的图片");
    return false;
  }
  // 判断图片的大小
  if (!isImageSize) {
    ElMessage.error("上传的图片必须小于50k");
    return false;
  }
  // 开启图片加载效果
  uploadLoading.value = true;
};
// 验证规则
const rules = reactive<FormRules>({
  // 针对品牌命成的验证规则
  tmName: [
    { required: true, message: "必须输入品牌名称", trigger: "blur" },
    { validator: validateTmName, trigger: "blue" },
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

// 表单验证 添加或者修改品牌操作
const addOrUpdate = () => {
  formRef.value?.validate(async (valid) => {
    // 表单验证不通过,什么也不做
    if (!valid) return;
    // 表单验证通过
    try {
      // 调用接口
      await addOrUpdateTrademarkApi(trademark);
      // 提示信息
      ElMessage.success("操作成功");
      // 刷新
      getTrademarkList(trademark.id ? current.value : 1);
      // 关闭对话框
      dialogFormVisible.value = false;
    } catch (error: any) {
      ElMessage.error("操作失败", error);
    }
  });
} 

// 删除操作
const deleteOperation = (row: TrademarkModel) => {
  ElMessageBox.confirm(`您确认删除${row.tmName}吗?`,'提示',{
    confirmButtonText:'确认',
    confirmButtonClass:'取消',
    type:'warning'
  })
    .then(async() => {
      // 发送请求删除
      await deleteTrademarkByIdApi(row.id as number)
      // 提示信息
      ElMessage.success('操作成功')
      // 如果此时当前这一页是第一页,那么删除数据以后,直接刷新就行了,如果不是第一页,且数据只剩下一条了,如果
      // 删除应该回到上一页,进行刷新操作
      if (trademarkList.value.length === 1 && current.value > 1) {
        current.value -= 1
      }
      // 刷新
      getTrademarkList()
    })
    .catch(() => {});
};

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