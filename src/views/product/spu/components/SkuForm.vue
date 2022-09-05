<template>
  <el-form label-width="120px" :model="skuInfo" ref="formRef" :rules="rules">
    <!-- SPU名称 -->
    <el-form-item label="SPU名称">{{ spu.spuName }}</el-form-item>

    <!-- SKU名称 -->
    <el-form-item label="SKU名称" prop="skuName">
      <el-input
        type="text"
        placeholder="请输入SPU名称"
        v-model="skuInfo.skuName"
      />
    </el-form-item>

    <!-- 价格(元) -->
    <el-form-item label="价格(元)" prop="price">
      <el-input type="number" placeholder="0" v-model="skuInfo.price" />
    </el-form-item>

    <!-- 重量(千克) -->
    <el-form-item label="重量(千克)" prop="weight">
      <el-input
        type="number"
        placeholder="请输入SKU重量"
        v-model="skuInfo.weight"
      />
    </el-form-item>

    <!-- 规格描述 -->
    <el-form-item label="规格描述" prop="skuDesc">
      <el-input
        type="textarea"
        rows="4"
        placeholder="请输入SKU规格描述"
        v-model="skuInfo.skuDesc"
      ></el-input>
    </el-form-item>

    <!-- 平台属性 -->
    <el-form-item label="平台属性" prop="skuAttrValueList">
      <el-form inline>
        <el-form-item
          v-for="(attr, index) in attrList"
          :key="index"
          :label="attr.attrName"
          style="margin-bottom: 10px"
        >
          <el-select
            placeholder="请选择"
            v-model="skuInfo.skuAttrValueList[index]"
          >
            <el-option
              v-for="(val, index) in attr.attrValueList"
              :key="index"
              :label="val.valueName"
              :value="val.id + '_' + attr.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>

    <!-- 销售属性 -->
    <el-form-item label="销售属性" prop="skuSaleAttrValueList">
      <el-form inline>
        <el-form-item
          v-for="(attr, index) in spuSaleAttrList"
          :key="index"
          :label="attr.saleAttrName"
          style="margin-bottom: 10px"
        >
          <el-select
            placeholder="请选择"
            v-model="skuInfo.skuSaleAttrValueList[index]"
          >
            <el-option
              v-for="(val, index) in attr.spuSaleAttrValueList"
              :key="index"
              :label="val.saleAttrValueName"
              :value="val.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>

    <!-- 图片列表 -->
    <el-form-item label="图片列表" prop="skuImageList">
      <el-table
        ref="tableRef"
        row-key="id"
        :data="spuImageList"
        style="width: 100%"
        stripe
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column label="图片">
          <template v-slot="{ row }">
            <el-image
              :src="row.imgUrl"
              style="width: 100px; hight: 100px"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column label="名称" > </el-table-column>
        <el-table-column label="操作">
          <template v-slot="{ row }">
            <el-button
              type="success"
              plain
              size="small"
              v-if="row.isDefault === '1'"
              >默认</el-button
            >
            <el-button
              type="success"
              plain
              size="small"
              v-else
              @click="setDefault(row)"
              >设置为默认</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>

    <!-- 两个按钮 -->
    <el-form-item>
      <el-button type="primary" @click="saveSkuInfo">保存</el-button>
      <el-button @click="$emit('setCurrentShowStatus', ShowStatus.SPU_LIST)"
        >取消</el-button
      >
    </el-form-item>
  </el-form>
</template>
<script lang="ts">
export default {
  name: "SkuForm",
};
</script>
<script lang="ts" setup>
// 引入ref
import { ref, reactive, onMounted, nextTick } from "vue";
// 引入显示或者隐藏的界面的枚举类型
import {ShowOrHide } from "../types";
// 引入icon
import { Plus, Delete } from "@element-plus/icons-vue";
import { ElMessage, ElTable } from "element-plus";
import type { FormInstance, FormRules } from "element-plus";
// 引入spu接口类型
import type { SkuInfoModel } from "@/api/product/model/skuModel";
// 接收父组件传递进来的自定义事件
const emit = defineEmits(["setCurrentShowStatus"]);
// 引入平台属性对象数组类型
import type { AttrListModel } from "@/api/product/model/attrModel";
// 引入获取平台属性对象数组的接口函数
import { getAttrInfoListApi } from "@/api/product/attr";
// 引入获取spu下的销售属性对象数组和spu下的图片对象数组的接口函数
import type {
  SpuImageListModel,
  SpuImageModel,
  SpuSaleAttrListModel,
} from "@/api/product/model/spuModel";
import { addOrUpdateSkuInfoApi } from "@/api/product/sku";
// 引入获取spu下的销售属性对象数组和spu下的图片对象数组的接口函数
import {
  getSpuImageListBySpuIdApi,
  getSpuSaleAttrListBySpuIdApi,
} from "@/api/product/spu";
// 引入仓库
import { useCategoryStore } from "@/stores/category";
import { warn } from "console";
import Item from "@/layout/components/Sidebar/Item";
// 定义一个接口
interface Props {
  spu: {
    id: number;
    spuName: string;
  };
}
// 接收父组件传递进来的数据
const props = defineProps<Props>();
// 定义skuInfo对象
const skuInfo = reactive<SkuInfoModel>({
  isSale: 1, //上下架标识
  tmId: 1, //品牌的id
  price: 0, //价格
  skuDefaultImg: "", //默认图片的地址
  skuDesc: "", //描述
  skuName: "", //名字
  weight: "", //重量
  skuAttrValueList: [], //平台
  skuImageList: [],
  skuSaleAttrValueList: [],
});

// 调用三个接口,获取所有的平台属性数据
const attrList = ref<AttrListModel>([]);
// 用来接收spu下销售属性数据
const spuSaleAttrList = ref<SpuSaleAttrListModel>([]);
// 接收图片
const spuImageList = ref<SpuImageListModel>([]);
// 定义仓库
const categoryStore = useCategoryStore();
// 定义图片是否选中
const tableRef = ref<InstanceType<typeof ElTable>>();

// 页面加载完毕后,获取所有的平台属性数据
onMounted(async () => {
  attrList.value = await getAttrInfoListApi({
    category1Id: categoryStore.getCategory1Id,
    category2Id: categoryStore.getCategory2Id,
    category3Id: categoryStore.getCategory3Id,
  });
});

// 页面加载完毕后,获取spu下所有的销售属性数组数据
onMounted(async () => {
  spuSaleAttrList.value = await getSpuSaleAttrListBySpuIdApi(props.spu.id);
});
// 页面加载完毕后,获取spu下所有的图片对象数组数据
onMounted(async () => {
  spuImageList.value = await getSpuImageListBySpuIdApi(props.spu.id);
  // 所有的图片都是非默认效果
  spuImageList.value.forEach((item) => {
    item.isDefault = " 0";
  });
  // 设置第一张图片是默认的效果
  spuImageList.value[0] ? (spuImageList.value[0].isDefault = "1") : undefined;
  // 设置表格中第一行内容是选中的状态
  nextTick(() => {
    tableRef.value?.toggleRowSelection(spuImageList.value[0], true);
  });
  skuInfo.skuDefaultImg = spuImageList.value[0].imgUrl;
});
// 设置某个图片是默认的
const setDefault = (row: SpuImageModel) => {
  // 遍历数组,设置每个图片为非默认状态
  spuImageList.value.forEach((item) => {
    item.isDefault = "0";
    tableRef.value?.toggleRowSelection(item, false);
  });
  // 当前这个图片是默认的
  row.isDefault = "1";
  tableRef.value?.toggleRowSelection(row, true);
  // 存储当前这个图片的地址
  skuInfo.skuDefaultImg = row.imgUrl;
};

// 图片选中就执行的回调
const handleSelectionChange = (val: SpuImageListModel) => {
  // 存储选中的图片数组
  skuInfo.skuImageList = val as SpuImageListModel;
};

// 表单验证
// 获取form标签对象
const formRef = ref<FormInstance>();
// 定义验证的规则
const rules = reactive<FormRules>({
  // spu名称的名字
  skuName: [{ required: true, message: "必须输入SKU名称", trigger: "blur" }],
  // sku价格
  price: [{ required: true, message: "请选择SKU价格", trigger: "blur" }],
  // sku重量
  weight: [{ required: true, message: "必须输入SKU重量", trigger: "blur" }],
  // sku描述
  skuDesc: [
    {
      required: true,
      message: "必须输入SKU描述",
      trigger: "blur",
    },
  ],
  // sku平台属性
  skuAttrValueList: [
    {
      type: "array",
      required: true,
      message: "必须选择至少一个平台属性",
      trigger: "change",
    },
  ],
  // sku图片数据
  skuImageList: [
    {
      type: "array",
      required: true,
      message: "必须至少设置一个默认照片",
      trigger: "change",
    },
  ],
  //销售属性
  skuSaleAttrValueList: [
    {
      type: "array",
      required: true,
      message: "必须选择至少一个销售属性",
      trigger: "change",
    },
  ],
});

// 保存skuInfo对象
const saveSkuInfo = () => {
  formRef.value?.validate(async (vaild) => {
     
    if (!vaild) return false;
   
    
    await addOrUpdateSkuInfoApi({
      ...skuInfo,
      spuId: props.spu.id,
      category3Id: categoryStore.getCategory3Id,
      // 过滤平台属性数据
      skuAttrValueList: skuInfo.skuAttrValueList.map((item) => {
        const [valueId, attrId] = (item as any).split("_");
        return {
          valueId,
          attrId
        };
      }),
      // 过滤销售属性数据
      skuSaleAttrValueList: skuInfo.skuSaleAttrValueList.map((item) => ({
        saleAttrValueId: +item,
      })),
      skuImageList: skuInfo.skuImageList.map((item) => ({
        imgName: item.imgName,
        imgUrl: item.imgUrl, //图片地址
        isDefault: item.isDefault, //是否是默认的标记
        spuImgId: item.id, //spu的图片的id
      })),
    });
    // 提示信息
    ElMessage.success('操作成功')
    // 关闭页面
    emit('setCurrentShowStatus',ShowStatus.SPU_LIST)
  });
};

</script>
<style scoped>
</style>