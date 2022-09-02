<template>
  <el-form label-width="120px">
    <!-- spu名称 -->
    <el-form-item label="spu名称">
      <el-input
        type="text"
        placeholder="请输入spu名称"
        v-model="spuInfo.spuName"
      ></el-input>
    </el-form-item>

    <!--SPU品牌-->
    <el-form-item label="SPU品牌">
      <el-select placeholder="请输入SPU品牌" v-model="spuInfo.tmId">
        <el-option
          v-for="(tm, index) in trademarkList"
          :key="index"
          :label="tm.tmName"
          :value="tm.id"
        ></el-option>
      </el-select>
    </el-form-item>

    <!-- SPU描述 -->
    <el-form-item label="请输入SPU描述">
      <el-input
        type="textarea"
        rows="4"
        placeholder="请输入SPU描述"
        v-model="spuInfo.description"
      >
      </el-input>
    </el-form-item>

    <!-- SPU图片  -->
    <el-form-item label="SPU图片">
      <el-upload
        v-model:file-list="spuInfo.spuImageList"
        :action="`${BASE_URL}/admin/product/fileUpload`"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :on-success="handleAvatarSuccess"
      >
        <el-icon><Plus /></el-icon>
      </el-upload>
      <el-dialog v-model="dialogVisible">
        <el-image :src="dialogImageUrl" fit="fit"></el-image>
      </el-dialog>
    </el-form-item>

    <!-- 销售属性 -->
    <el-form-item label="SPU销售属性">
      <el-select
        type="text"
        placeholder="请选择属性"
        v-model="baseSaleIdOrName"
      >
        <el-option
          v-for="(tm, index) in baseSaleAttrList"
          :key="index"
          :value="tm.id"
          :label="tm.name"
        ></el-option>
      </el-select>
      <el-button type="primary" :icon="Plus">添加销售属性</el-button>
    </el-form-item>

    <!-- 表格 -->
    <el-form-item>
      <el-table
        row-key="id"
        :data="spuInfo.spuSaleAttrList"
        style="width: 100%"
        stripe
        border
      >
        <el-table-column type="index" label="序号" width="80" align="center" />
        <el-table-column prop="saleAttrName" label="属性名" width="150" />
        <el-table-column prop="spuSaleAttrValueList" label="属性值名称列表">
          <template v-slot="{ row, $index }">
            <!-- 显示内容 -->
            <el-tag
              v-for="(attr, index) in row.spuSaleAttrValueList"
              :key="index"
              closable
              :disable-transitions="false"
              @click="row.spuSaleAttrValueList.splice(index, 1)"
              type="success"
              style="margin-right: 5px"
            >
              {{ attr.saleAttrName }}
            </el-tag>
            <!-- 收集内容 -->
            <el-input
              v-if="row.isShowEdit"
              :ref="(input) => (inputRefs[$index] = input)"
              v-model="saleAttrValueName"
              size="samll"
              style="width: 100px"
              @keyup.enter="toView(row)"
              @blur="toView(row)"
            >
            </el-input>

            <!-- 添加内容 -->
            <el-button
              v-else
              @click="toEdit(row, $index)"
              size="small"
              :icon="Plus"
            >
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template v-slot="{$index}">
            <el-button
              size="small"
              type="danger"
              :icon="Delete"
              title="删除SPU"
              @click="spuInfo.spuSaleAttrList.splice($index,1)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>

    <!-- 两个按钮 -->
    <el-button type="primary">保存</el-button>
    <el-button @click="$emit('alterShowOrHide', ShowStatus.SPU_LIST)"
      >取消</el-button
    >
  </el-form>
</template>
<script lang="ts">
export default {
  name: "SpuForm",
};
</script>
<script lang="ts" setup>
import { onMounted, reactive, ref ,nextTick} from "vue";
// 引入icon
import { Plus, Delete } from "@element-plus/icons-vue";
import { ElMessage, UploadProps, UploadUserFile } from "element-plus";
// 引入显示或隐藏的界面的枚举类型
import { ShowStatus } from "../types";
// 引入品牌对象数组的类型
import type { TrademarkListModel } from "@/api/product/model/TrademarkModel";
// 引入品牌对象数据的接口函数
import { getTrademarkAllApi } from "@/api/product/trademark";
// 引入基础销售属性数组的类型和spu图片类型和spu销售属性数组类型
import type {
  SpuModel,
  BaseSaleAttrListModel,
  SpuSaleAttrListModel,
  SpuImageListModel,
  SpuSaleAttrModel,
} from "@/api/product/model/spuModel";
// 引入基础销售属性数组的接口函数和spu图片的接口函数和spu销售属性数组接口函数
import {
  getSpuImageListBySpuIdApi,
  getBaseSaleAttrListApi,
  getSpuSaleAttrListBySpuIdApi,
} from "@/api/product/spu";
import Item from "@/layout/components/Sidebar/Item";

// 接收父组件传递进来的自定义事件
const emits = defineEmits(["alterShowOrHide"]);
// 接收父组件传递过来的spu对象数据
const props = defineProps<{ currentSpu: SpuModel }>();
// 定义spuInfo
const spuInfo = reactive<SpuModel>(props.currentSpu);
// 定义品牌对象数组
const trademarkList = ref<TrademarkListModel>([]);
// 定义基础销售对象的数组
const baseSaleAttrList = ref<BaseSaleAttrListModel>([]);
// 定义存储选择的基础销售属性数据
const baseSaleIdOrName = ref<string>();
// 用来收集文本框中输入的销售属性值数据
const saleAttrValueName = ref<string>();
// 用来收集编辑模式的
const inputRefs = ref<HTMLInputElement[]>([]);
// 定义图片的回调需要的数据
const dialogImageUrl = ref("");
// 定义预览是否开启
const dialogVisible = ref(false);
// 图片的跟根路径地址
const BASE_URL = import.meta.env.VITE_API_URL;
// 获取所有的品牌数据
onMounted(async () => {
  trademarkList.value = await getTrademarkAllApi();
  // console.log( trademarkList.value);
});
// 获取所有的基础销售属性数据
onMounted(async () => {
  baseSaleAttrList.value = await getBaseSaleAttrListApi();
  // console.log(baseSaleAttrList.value);
});
// 获取spu对象下所有的基础属性数据
onMounted(async () => {
  const id = spuInfo.id as number;
  if (!id) return;
  spuInfo.spuSaleAttrList = await getSpuSaleAttrListBySpuIdApi(id);
});
// 获取spu对象所以图片数据
onMounted(async () => {
  const id = spuInfo.id as number;
  if (!id) return;
  const spuImageList = await getSpuImageListBySpuIdApi(id);
  // 把需要的图片对象数组进行添加(name和url)
  spuInfo.spuImageList = spuImageList.map((item) => ({
    ...item,
    name: item.imgName,
    url: item.imgUrl,
  }));
});
// 定义图片传入必须要的name和url
const fileList = ref<UploadUserFile[]>([
  {
    name: "food.jpeg",
    url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
  },
]);
// 定义移除图片的回调
const handleRemove: UploadProps["onRemove"] = (uploadFile, uploadFiles) => {
  console.log(uploadFile, uploadFiles);
};
// 定义增加图片的回调
const handlePictureCardPreview: UploadProps["onPreview"] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!;
  dialogVisible.value = true;
};
// 定义预览图片的回调
const handleAvatarSuccess: UploadProps["onSuccess"] = (
  response,
  uploadFile
) => {};

// 编辑模式
const toEdit = (row: SpuSaleAttrModel, index: number) => {
  row.isShowEdit = true;
  nextTick(() => {
    inputRefs.value[index].focus();
  });
};
// 查看模式
const toView = (row: SpuSaleAttrModel) => {
  if (!saleAttrValueName.value || !saleAttrValueName.value.trim()) {
    ElMessage.warning("请输入有效数据");
    saleAttrValueName.value = "";
    row.isShowEdit = false;
    return;
  }
  const isRepeat = row.spuSaleAttrValueList.some(
    (item) => item.saleAttrValueName === saleAttrValueName.value
  );
  if (isRepeat) {
    ElMessage.warning("重复数据");
  } else {
    row.spuSaleAttrValueList.push({
      baseSaleAttrId: row.baseSaleAttrId as number,
      saleAttrValueName: saleAttrValueName.value,
    });
  }
  // 清除文本框
  saleAttrValueName.value = "";
  row.isShowEdit = false;
};
</script>
<style scoped>
</style>