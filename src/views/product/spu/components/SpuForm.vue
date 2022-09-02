<template>
  <el-form label-width="120px">
    <!--SPU名称  -->
    <el-form-item label="SPU名称">
      <el-input
        type="text"
        placeholder="请输入SPU名称"
        v-model="spuInfo.spuName"
      ></el-input>
    </el-form-item>

    <!--SPU品牌  -->
    <el-form-item label="SPU品牌">
      <el-select placeholder="SPU品牌" v-model="spuInfo.tmId">
        <el-option
          v-for="(tm, index) in trademarkList"
          :key="index"
          :label="tm.tmName"
          :value="tm.id"
        />
      </el-select>
    </el-form-item>

    <!-- SPU描述 -->
    <el-form-item label="SPU描述">
      <el-input
        type="textarea"
        rows="4"
        placeholder="请输入SPU描述"
        v-model="spuInfo.description"
      ></el-input>
    </el-form-item>

    <!-- SPU图片 -->
    <el-form-item label="SPU图片">
      <el-upload
        v-model:file-list="spuInfo.SpuImageList"
        multiple
        :action="`${BASE_URL}/admin/product/fileUpload`"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
        list-type="picture-card"
      >
        <el-icon><Plus /></el-icon>
      </el-upload>
      <v-dialog v-model="dialogVisible">
        <el-image :src="dialogImageUrl" :fit="fit" />
      </v-dialog>
    </el-form-item>

    <!-- 销售属性 -->
    <el-form-item label="销售属性">
      <el-select placeholder="请选择销售属性" v-model="saleAttrIdName">
        <el-option
          v-for="(attr, index) in baseSaleAttrList"
          :key="index"
          :label="attr.Name"
          :value="attr.name"
        />
      </el-select>
      <el-button icon="Plus" type="primary">添加销售属性</el-button>
    </el-form-item>

    <!-- 表格 -->
    <el-form-item>
      <el-table
        row-key="id"
        :data="spuInfo.spuSaleAttrList"
        border
        stripe
        style="width: 100%"
      >
        <el-table-column type="index" aligin="center" label="序号" width="80" />
        <el-table-column prop="saleAttrName" label="属性名" width="150" />
        <el-table-column prop="spuSaleAttrValueList" label="属性值名称列表">
          <template #default="{ row }">
            <!-- 显示内容 -->
            <el-tag
              v-for="(attr, index) in row.spuSaleAttrValueList"
              :key="attr.id"
              closable
              :disable-transitions="false"
              @click="row.spuSaleAttrValueList.splice(index, 1)"
              style="margin-right: 5px"
              type="success"
              >{{ attr.saleAttrValueName }}</el-tag
            >
            <!-- 收集数据 -->
            <el-input
              v-if="row.isShowEdit"
              :ref="(input) => (inputRefs[$index] = input)"
              v-model="saleAttrValueName"
              size="samll"
              @keyup.enter="toView(row)"
              @blur="toView(row)"
              style="width: 100px"
            />
            <!-- 添加 -->
            <el-button
              v-else
              size="small"
              @click="toEdit(row, $index)"
              :icon="Plus"
            ></el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template v-slot="{ $index }">
            <el-button
              size="small"
              type="danger"
              :icon="Delete"
              title="删除SPU"
              @click="spuInfo.spuSaleAttrList.splice($index, 1)"
            />
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>

    <!-- 两个按钮 -->
    <el-button type="primary">保存</el-button>
    <el-button @click="$emit('setCurrentShowStatus', ShowOrHide.SPU_LIST)"
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
// 引入ref
import { onMounted, reactive, ref, nextTick } from "vue";
// 引入element组件库
import { ElMessage } from "element-plus";
import { Plus, Delete } from "@element-plus/icons-vue";
import type {
  UploadProps,
  UploadUserFile,
  UploadFile,
  UploadFiles,
} from "element-plus";
// 引入枚举类型标识
import { ShowOrHide } from "../types";
// 引入spu接口类型
import type { SpuModel } from "@/api/product/model/spuModel";
// 引入品牌对象数组的类型
import type { TrademarkListModel } from "@/api/product/model/trademarkModel";
// 引入基础销售属性数组的类型和spu图片数组接口函数和spu销售属性数组接口函数
import type {
  BaseSaleAttrListModel,
  SpuImageListModel,
  SpuSaleAttrValueListModel,
  SpuSaleAttrModel,
} from "@/api/product/model/spuModel";
// 引入获取所有品牌的接口类型
import { getTrademarkListAllApi } from "@/api/product/trademark";
//引入获取基础销售属性的接口函数和spu图片数组接口函数和spu销售属性数组接口函数
import {
  getBaseSaleAttrListApi,
  getSpuImageListApi,
  getSpuSaleAttrListApi,
} from "@/api/product/spu";
import { log } from 'console';

// 定义图片预览效果
const dialogImageUrl = ref("");
const dialogVisible = ref(false);
// 接收父组件传递过来的自定义事件
const emits = defineEmits(["setCurrentShowStatus"]);
// 接收父级组件传递过来的spu对象数据
const props = defineProps<{ currentSpuInfo: SpuModel }>();
// 定义spuInfo对象
const spuInfo = reactive<SpuModel>(props.currentSpuInfo);
// 对话框图片的根路径地址
const BASE_URL = import.meta.env.VITE_API_URL;
const imageUrl = ref("");
//定义品牌对象数组
const trademarkList = ref<TrademarkListModel>([]);
// 定义用来接收所有的基础销售对象的数组
const baseSaleAttrList = ref<BaseSaleAttrListModel>([]);
// 定义用来收集文本框输入的销售属性值数据
const saleAttrValueName = ref<string>();
// 定义用来编辑模式的时候产生的文本框对象
const inputRefs = ref<HTMLInputElement[]>([]);

// 获取所有的品牌数据
onMounted(async () => {
  trademarkList.value = await getTrademarkListAllApi();
});
// 获取所有的基础销售数据数据
onMounted(async () => {
  baseSaleAttrList.value = await getBaseSaleAttrListApi();
});
// 获取spu对象下所有的销售属性数据
onMounted(async () => {
  // 获取spu对象下的id数据,并且判断数据是否有意义
  const id = spuInfo.id as number;
  if (!id) {
    spuInfo.spuSaleAttrList = await getSpuSaleAttrListApi(id);
  }
});
// 获取spu对象下所有的图片数据
onMounted(async () => {
  // 获取spu对象下的id数据,并且判断数据是否有意义
  const id = spuInfo.id as number;
  if (!id) {
    const spuImageList = await getSpuImageListApi(id);
    console.log('@@@@',spuImageList);
    
    // 需要把图片对象的数据进行添加(name,url)
    spuInfo.spuImgeList = spuImageList.map((item) => ({
      ...item,
      name: item.imgUrl,
      url: item.imgUrl,
    }));
  }
});
// 上传图片的回调
const fileList = ref<UploadUserFile[]>([
  {
    name: "food.jpeg",
    url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
  },
]);
// 移除图片的回调
const handleRemove: UploadProps["onRemove"] = (
  uploadFile: UploadFile,
  uploadFiles: UploadFiles
) => {
  spuInfo.spuImgeList = uploadFiles as any;
};
// 预览照片的回调
const handlePictureCardPreview = (file: UploadFile) => {
  // 存储预览的图片的地址
  dialogImageUrl.value = file.url!;
  // 开启预览
  dialogVisible.value = true;
};
// 上传照片所需要的回调函数
const handleSuccess: UploadProps["onSuccess"] = (
  res: any,
  uploadFile: UploadFile,
  uploadFiles: UploadFiles
) => {
  //   当图片上传成功,要把新上传的图片保存
  spuInfo.spuImgeList = uploadFiles as any;
  // 清理掉图片的验证信息
};
// 编辑模式,文本框出现,自动的获取焦点
const toEdit = (row: SpuSaleAttrModel, index: number) => {
  row.isShowEdit = true;
  nextTick(() => {
    // 文本框获取焦点
    inputRefs.value[index].focus();
  });
};
// 查看模式,失去焦点
const toView = (row: SpuSaleAttrModel) => {
  // 判断文本框收集的数据是否存在
  if (!saleAttrValueName.value || !saleAttrValueName.value.trim()) {
    ElMessage.warning("请输入有效数据");
    saleAttrValueName.value = "";
    row.isShowEdit = false;
    return;
  }
  // 判断输入的数据和之前属性数组中数据是否医院
  const isRepeat = row.spuSaleAttrValueList.some(
    (item) => item.saleAttrValueName === saleAttrValueName.value
  );
  if (isRepeat) {
    ElMessage.warning("有重复的数据");
  } else {
    row.spuSaleAttrValueList.push({
      baseSaleAttrId: row.baseSaleAttrId,
      saleAttrValueName: saleAttrValueName.value,
    });
  }
  // 清空文本框中的数据
  saleAttrValueName.value = "";
  row.isShowEdit = false;
};
</script>
