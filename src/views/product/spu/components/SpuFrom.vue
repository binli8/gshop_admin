<template>
  <el-form label-width="120px">
    <!-- spu名称 -->
    <el-form-item label="SPU名称">
      <el-input
        type="text"
        placeholder="请输入SPU名称"
        v-model="spuInfo.spuName"
      ></el-input>
    </el-form-item>

    <!-- spu品牌 -->
    <el-form-item label="SPU品牌">
      <el-select placeholder="请输入SPU品牌" v-model="spuInfo.tmId">
        <el-option
          v-for="trademark in trademarkList"
          :key="trademark.id"
          :label="trademark.tmName"
          :value="trademark.id"
        />
      </el-select>
    </el-form-item>

    <!-- spu描述 -->
    <el-form-item label="SPU描述">
      <el-input
        type="textarea"
        rows="4"
        placeholder="请输入SPU描述"
        v-model="spuInfo.description"
      ></el-input>
    </el-form-item>

    <!-- spu图片 -->
    <el-form-item label="SPU图片">
      <el-upload
        v-model:file-list="spuInfo.spuImageList"
        :action="`${BASE_URL}//admin/product/fileUpload`"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
      >
        <el-icon><Plus /></el-icon>
      </el-upload>
      <el-dialog v-model="dialogVisible">
        <el-image :src="dialogImageUrl" :fit="fit"></el-image>
      </el-dialog>
    </el-form-item>

    <!-- 销售属性 -->
    <el-form-item label="SPU销售属性">
      <el-select type="text" placeholder="请选择" v-model="baseSaleIdOrName">
        <el-option
          v-for="attr in baseSaleAttrList"
          :key="attr.id"
          :value="attr.id"
          :label="attr.name"
        ></el-option>
      </el-select>
      <el-button type="primary" :icon="plus">添加销售属性</el-button>
    </el-form-item>

    <!-- 表格 -->
    <el-form-item>
      <el-table
        row-key="id"
        :data="spuInfo.spuSaleAttrList"
        style="width: 100%; marigin-top: 20px"
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
              type="success"
              @close="row.spuSaleAttrValueList.splice(index, 1)"
              style="margin-right: 5px"
            >
              {{ attr.saleAttrValueName}}
            </el-tag>
            <!-- 收集内容 -->
            <el-input
              v-if="row.isShowEdit"
              :ref="(input) => (inputRefs[$index] = input)"
              v-model="saleAttrValueName"
              size="small"
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
            >
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template v-slot="{ row, $index }">
            <el-button
              size="small"
              type="danger"
              :icon="Delete"
              title="删除SPU"
              @click="spuInfo.spuSaleAttrList.splice($index, 1)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>

    <!-- 两个按钮 -->
    <el-form-item style="margin-top: 20px">
      <el-button type="primary">保存</el-button>
      <el-button @click="$emit('setCurrentShowStatus', ShowStatus.SPU_LIST)"
        >取消</el-button
      >
    </el-form-item>
  </el-form>
</template>
<script lang="ts">
export default {
  name: "SpuFrom",
};
</script>
<script lang="ts" setup>
import { onMounted, reactive, ref, nextTick } from "vue";

// 引入显示或者隐藏的界面的枚举类型
import { ShowStatus } from "../types";
// 引入icon
import { Plus, Delete } from "@element-plus/icons-vue";
// 引入品牌对象数组的类型
import type { TrademarkListModel } from "@/api/product/model/trademarkModel";
// 引入基础销售属性数组的类型和spu图片数组类型和spu销售属性数组类型
import type {
  SpuModel,
  BaseSaleAttrListModel,
  SpuImageListModel,
  SpuSaleAttrListModel,
  SpuSaleAttrModel,
} from "@/api/product/model/spuModel";
// 引入获取所有品牌的接口类型
import { getTrademarkListAllApi } from "@/api/product/trademark";
// 引入基础销售属性数组的接口函数和spu图片数组接口函数和spu销售属性数组接口函数
import {
  getBaseSaleAttrListApi,
  getSpuImageListBySpuIdApi,
  getSpuSaleAttrListBySpuIdApi,
} from "@/api/product/spu";
// 图片的根路径地址
const BASE_URL = import.meta.env.VITE_API_URL;
import {
  UploadProps,
  UploadUserFile,
  UploadFile,
  UploadFiles,
  ElMessage,
} from "element-plus";

// 接收父组件传递过来的自定义事件
const emit = defineEmits(["setCurrentShowStatus"]);
// 接收父组件传递过来的spu对象数据
const Props = defineProps<{ currentSpu: SpuModel }>();
// 定义spuInfo对象
const spuInfo = reactive<SpuModel>(Props.currentSpu);

// 定义品牌对象数组
const trademarkList = ref<TrademarkListModel>([]);
// 定义用来接收所有的基础销售对象的数组
const baseSaleAttrList = ref<BaseSaleAttrListModel>([]);
// 用来存储选择的基础销售属性数据的id的名字
const baseSaleIdOrName = ref<string>();
// 用来收集文本狂中输入的销售属性值数据
const saleAttrValueName = ref<string>();
// 用来收集编辑模式的时间产生的文本框对象
const inputRefs = ref<HTMLInputElement[]>([]);
// 获取所有的品牌数据,onMounted回调可以使用n次
onMounted(async () => {
  trademarkList.value = await getTrademarkListAllApi();
});
// 获取所有的的基础销售属性数据
onMounted(async () => {
  baseSaleAttrList.value = await getBaseSaleAttrListApi();
});
// 获取spu对象下所有的基础属性数据
onMounted(async () => {
  // 获取spu对象下的id数据,并且,判断数据是否有意义
  const id = spuInfo.id as number;
  if (!id) return;
  spuInfo.spuSaleAttrList = await getSpuSaleAttrListBySpuIdApi(id);
  console.log(spuInfo.spuSaleAttrList);
});
// 获取spu对象下所有的图片数据
onMounted(async () => {
  // 获取spu对象下的id数据,并且,判断数据是否有意义
  const id = spuInfo.id as number;
  if (!id) return;
  const spuImageList = await getSpuImageListBySpuIdApi(id);
  // 需要把图片对象的数据进行添加(name/url)
  spuInfo.spuImageList = spuImageList.map((item) => ({
    ...item,
    name: item.imgName,
    url: item.imgUrl,
  }));
});

const fileList = ref<UploadUserFile[]>([
  {
    name: "food.jpeg",
    url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
  },
]);
const dialogImageUrl = ref("");
const dialogVisible = ref(false);
// 移除图片的事件回调
const handleRemove: UploadProps["onRemove"] = (
  uploadFile: UploadFile,
  uploadFiles: UploadFiles
) => {
  spuInfo.spuImageList = uploadFile as any;
};

const handlePictureCardPreview: UploadProps["onPreview"] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!; //存储预览的图片的地址
  dialogVisible.value = true; //开启预览
};
//上传那图片的回调
const handleSuccess: UploadProps["onSuccess"] = (
  res: any,
  uploadFile: UploadFile,
  uploadFiles: UploadFiles
) => {
  spuInfo.spuImageList = uploadFile as any;
};

// 编辑模式,文本框出现,自动的获取焦点
const toEdit = (row: SpuSaleAttrModel, index: number) => {
  row.isShowEdit = true;
  nextTick(() => {
    inputRefs.value[index].focus();
  });
};
// 查看模式,失去焦点
const toView = (row: SpuSaleAttrModel) => {
  // 判断文本框收集的数据是否存在
  if (!saleAttrValueName.value || !saleAttrValueName.value.trim()) {
    ElMessage.warning("请输入有效数据")
    saleAttrValueName.value = ''
    row.isShowEdit = false
    return;
  }
  // 判断输入的数据和之前属性值数组中数据是否一样
  const isRepeat = row.spuSaleAttrValueList.some(
    (item) => item.saleAttrValueName === saleAttrValueName.value
  );
  if (isRepeat) {
    ElMessage.warning("重复数据");
  } else {
    // 数据是有效的
    // 把当前新增的属性值变成一个对象,存储到属性值对象中
    row.spuSaleAttrValueList.push({
      baseSaleAttrId: row.baseSaleAttrId as number,
      saleAttrValueName: saleAttrValueName.value,
    });
    console.log(saleAttrValueName.value);
    
  }
  // 清空文本框中的数据
  saleAttrValueName.value = '';
  row.isShowEdit = false;
};
</script>
<style scoped>
</style>