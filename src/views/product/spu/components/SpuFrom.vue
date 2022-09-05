<template>
  <el-form label-width="120px" :model="spuInfo" ref="formRef" :rules="rules">
    <!-- spu名称 -->
    <el-form-item label="SPU名称" prop="spuName">
      <el-input
        type="text"
        placeholder="请输入SPU名称"
        v-model="spuInfo.spuName"
      ></el-input>
    </el-form-item>

    <!-- spu品牌 -->
    <el-form-item label="SPU品牌" prop="tmId">
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
    <el-form-item label="SPU描述" prop="description">
      <el-input
        type="textarea"
        rows="4"
        placeholder="请输入SPU描述"
        v-model="spuInfo.description"
      ></el-input>
    </el-form-item>

    <!-- spu图片 -->
    <el-form-item label="SPU图片" prop="spuImageList">
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
    <el-form-item label="SPU销售属性" prop="spuSaleAttrList">
      <el-select
        type="text"
        :placeholder="saleAttrText"
        v-model="baseSaleIdOrName"
      >
        <el-option
          v-for="attr in unSelectedSaleAttrList"
          :key="attr.id"
          :value="attr.id + '_' + attr.name"
          :label="attr.name"
        ></el-option>
      </el-select>
      <el-button type="primary" :icon="plus" @click="addSalesAttributes"
        >添加销售属性</el-button
      >
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
              {{ attr.saleAttrValueName }}
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
          <template v-slot="{ $index }">
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
      <el-button type="primary" @click="saveSpuInfo">保存</el-button>
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
import { onMounted, reactive, ref, nextTick, computed } from "vue";

// 引入显示或者隐藏的界面的枚举类型
import { ShowStatus } from "../types";
// 引入icon
import { Plus, Delete } from "@element-plus/icons-vue";
import {
  UploadProps,
  UploadUserFile,
  UploadFile,
  UploadFiles,
  ElMessage,
} from "element-plus";
import type { FormInstance, FormRules } from "element-plus";
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
  addOrUpdateSpuInfo,
} from "@/api/product/spu";
// 引入三级分类的仓库
import {useCategoryStore} from '@/stores/category'

// 接收三级分类的仓库
const categoryStore = useCategoryStore()
// 接收父组件传递过来的自定义事件
const emit = defineEmits(["setCurrentShowStatus"]);
// 接收父组件传递过来的spu对象数据
const Props = defineProps<{ currentSpu: SpuModel }>();
// 定义spuInfo对象
const spuInfo = reactive<SpuModel>(Props.currentSpu);
// 图片的根路径地址
const BASE_URL = import.meta.env.VITE_API_URL;
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
// 定义图片的类型
const dialogImageUrl = ref("");
// 定义预览是否开启
const dialogVisible = ref(false);
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


// 移除图片的事件回调
const handleRemove: UploadProps["onRemove"] = (
  uploadFile: UploadFile,
  uploadFiles: UploadFiles
) => {
  spuInfo.spuImageList = uploadFiles as any;
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
  spuInfo.spuImageList = uploadFiles as any;
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
    ElMessage.warning("请输入有效数据");
    saleAttrValueName.value = "";
    row.isShowEdit = false;
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
    // console.log(saleAttrValueName.value);
  }
  // 清空文本框中的数据
  saleAttrValueName.value = "";
  row.isShowEdit = false;
};

//计算剩余销售属性对象数组数据
const unSelectedSaleAttrList = computed(() => {
  return baseSaleAttrList.value.filter(
    (item1) =>
      !spuInfo.spuSaleAttrList.some(
        (item2) => item2.saleAttrName === item1.name
      )
  );
});

// 计算选择器中的提示信息
const saleAttrText = computed(() => {
  const { length } = unSelectedSaleAttrList.value;
  return length > 0 ? `还有${length}个选择` : "没有了";
});

// 点击添加销售属性的回调
const addSalesAttributes = () => {
  // 判断,如果没选中数据,直接返回
  if (!baseSaleIdOrName.value) return;
  const [id, name] = baseSaleIdOrName.value.split("_");
  // 当前选择的销售属性数据添加到spu对象的销售属性对象数组中
  spuInfo.spuSaleAttrList.push({
    saleAttrName: name, //销售属性对象的名字
    baseSaleAttrId: +id, //销售属性对象的id
    spuSaleAttrValueList: [],
  });
  // 清空已经选中的内容
  baseSaleIdOrName.value = "";
};

// 表单验证
// 获取form标签对象
const formRef = ref<FormInstance>();
// 定义验证的规则
const rules = reactive<FormRules>({
  // spu名称的
  spuName: [{ required: true, message: "必须输入SPU名称", trigger: "blur" }],
  // spu的品牌
  tmId: [{ required: true, message: "请选择SPU品牌", trigger: "change" }],
  // spu的描述
  description: [
    { required: true, message: "必须输入SPU描述信息", trigger: "blur" },
  ],
  // spu的图片数组
  spuImageList: [
    {
      type: "array",
      required: true,
      message: "必须上传至少一个图片",
      trigger: "change",
    },
  ],
  // 添加的销售属性数据
  spuSaleAttrList: [
    {
      type: "array",
      required: true,
      message: "必须输入SPU名称",
      trigger: "change",
    },
  ],
});
// 保存spu对象
const saveSpuInfo = () => {
  // 表单验证
  formRef.value?.validate(async (vaild) => {
    if (!vaild) return false;
    // 过滤销售属性对象数组中的数据
    spuInfo.spuSaleAttrList = spuInfo.spuSaleAttrList.filter((item) => {
      // 属性值数组的数据是否存在
      if (item.spuSaleAttrValueList.length === 0) return false;
      // 此时有数据,删除标识
      delete item.isShowEdit;
      return true;
    });
    // 过滤图片数组
    spuInfo.spuImageList = spuInfo.spuImageList.map((item) => ({
      spuId: spuInfo.id, //spu的id
      imgName: item.name as string, //图片的名字
      imgUrl: item.response ? item.response.data : item.url, //图片的地址
    })) as any;
    // 二次过滤销售属性对象的数组
    if (spuInfo.spuSaleAttrList.length === 0) return false;
    //准备三级分类的id
    spuInfo.category3Id = categoryStore.getCategory3Id
   
    
    // 调用接口
    try {
      await addOrUpdateSpuInfo(spuInfo);
      ElMessage.success("保存成功");
      emit("setCurrentShowStatus", ShowStatus.SPU_LIST);
    } catch (error) {
      ElMessage.error((error as any) || "保存失败");
    }
  });
};
</script>
<style scoped>
</style>