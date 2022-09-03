<template>
  <el-form label-width="120px">
    <!-- SPU名称 -->
    <el-form-item label="SPU名称">{{ spu.spuName }}</el-form-item>

    <!-- SKU名称 -->
    <el-form-item label="SKU名称">
      <el-input
        type="text"
        placeholder="请输入SKU名称"
        v-model="skuInfo.spuName"
      ></el-input>
    </el-form-item>

    <!-- 价格(元) -->
    <el-form-item label="价格(元)">
      <el-input
        type="number"
        placeholder="请输入SKU价格"
        v-model="skuInfo.price"
      ></el-input>
    </el-form-item>

    <!-- 重量(千克) -->
    <el-form-item label="重量(千克)">
      <el-input
        type="number"
        placeholder="请输入SKU重量"
        v-model="skuInfo.weight"
      ></el-input>
    </el-form-item>

    <!-- 规格描述 -->
    <el-form-item label="规格描述">
      <el-input
        type="textarea"
        rows="4"
        placeholder="请输入SKU描述"
        v-model="skuInfo.skuDesc"
      ></el-input>
    </el-form-item>

    <!--平台属性  -->
    <el-form-item label="平台属性">
      <el-form inline>
        <el-form-item
          v-for="attr in attrList"
          :key="attr.id"
          :label="attr.attrName"
          style="margin-bottom: 10px"
        >
          <el-select
            placeholder="请选择"
            v-model="skuInfo.skuAttrValueList[index]"
          >
            <el-option
              v-for="val in attr.attrValueList"
              :key="val.id"
              :value="val.attrId + '_' + attr.id"
              :label="val.valueName"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>

    <!-- 销售属性 -->
    <el-form-item label="销售属性">
      <el-form inline>
        <el-form-item
          v-for="attr in spuSaleAttrList"
          :key="attr.id"
          :label="attr.saleAttrName"
          style="margin-bottom: 10px"
        >
          <el-select
            placeholder="请选择"
            v-model="skuInfo.skuSaleAttrValueList[index]"
          >
            <el-option
              v-for="val in attr.spuSaleAttrValueList"
              :key="val.id"
              :value="val.id"
              :label="val.saleAttrValueName"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>

    <!-- 图片列表 -->
    <el-form-item label="图片列表">
      <el-table
      ref="tableRef"
        row-key="id"
        :data="spuImageList"
        stripe
        style="width: 100%"
        border
          @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column label="图片">
          <template v-slot="{ row }">
            <el-image
              :src="row.imgUrl"
              style="width: 100px; height: 100px"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="imgName" label="名称"> </el-table-column>
        <el-table-column label="操作">
          <template v-slot="row">
            <el-tag type="success" v-if="row.isDefault === 1">默认</el-tag>
            <el-button
              size="small"
              v-else
              type="primary"
              @click="setDefault(row)"
              >设置为默认</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>

    <!-- 两个按钮 -->
    <el-form-item>
      <el-button>保存</el-button>
      <el-button @click="$emit('setCurrentShowStatus', ShowOrHide.SPU_LIST)"
        >返回</el-button
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
import { ref, reactive, onMounted ,nextTick} from "vue";
// 引入枚举类型
import { ShowOrHide } from "../types";
// 引入平台属性对象数组类型
import type { AttrListModel } from "@/api/product/model/attrModel";
// 引入平台属性对象数组类型接口函数
import { getAttrInfoListApi } from "@/api/product/attr";
// 引入销售属性对象数组和图片对象数组的类型
import type {
  SpuSaleAttrListModel,
  SpuImageListModel,
  SpuImageModel,
} from "@/api/product/model/spuModel";
// 引入销售属性对象数组接口函数和图片对象数组的接口函数
import { getSpuSaleAttrListApi, getSpuImageListApi } from "@/api/product/spu";
// 引入仓库的数据
import { useCategoryStore } from "@/stores/category";
import { SkuInfoModel } from "@/api/product/model/skuModel";
import { ElTable } from "element-plus";
const tableRef = ref<InstanceType<typeof ElTable>>();
// 引入父组件传递进来的自定义事件
const emits = defineEmits(["setCurrentShowStatus"]);
// 定义父组件传递数据的接口
interface Props {
  spu: {
    id: number;
    spuName: string;
  };
}
// 定义skuInfo
const skuInfo = reactive<SkuInfoModel>({
  isSale: 1, //上下架标识
  price: 0, //价格
  tmId: undefined, //品牌的id
  skuDefaultImg: "", //默认图片的地址
  skuDesc: "", //描述
  weight: "", //重量
  skuName: "", //名字
  skuAttrValueList: [], //平台属性数组
  skuImageList: [], //图片数组
  skuSaleAttrValueList: [], //销售属性数组
});
// 定义调用仓库的数据
const categoryStore = useCategoryStore();
// 接收父组件传递进来的数据
const props = defineProps<Props>();
// 调用三个接口:获取所有的平台属性数据  /   spu下的销售属性数据   /   spu下的图片列表数据
// 用来接收所有平台属性数据
const attrList = ref<AttrListModel>([]);
// 用来接收spu下所有的销售属性数据
const spuSaleAttrList = ref<SpuSaleAttrListModel>([]);
// 用来接收spu下所有图片列表数据
const spuImageList = ref<SpuImageListModel>([]);
// 页面加载完毕,获取所有的平台数据
onMounted(async () => {
  attrList.value = await getAttrInfoListApi({
    category1Id: categoryStore.getCategory1Id,
    category2Id: categoryStore.getCategory2Id,
    category3Id: categoryStore.getCategory3Id,
  });
});


// 页面加载完毕后,获取spu下所有的销售属性数组数据
onMounted(async () => {
  spuSaleAttrList.value = await getSpuSaleAttrListApi(props.spu.id);
});
// 页面加载完毕后,获取spu所有图片对象数组数据
onMounted(async () => {
  spuImageList.value = await getSpuImageListApi(props.spu.id);
  // 所有的图片都是非默认效果
  spuImageList.value.forEach((item) => {
    item.isDefault = 0;
  });
  // 设置第一张图片是默认的效果
  spuImageList.value[0]?spuImageList.value[0].isDefault =1 :undefined
  nextTick(()=>{
    tableRef.value?.toggleRowSelection(spuImageList.value[0],true)
  })
});

// 设置某张个图片为默认
const setDefault = (row: SpuImageModel) => {
  // 遍历数组,设置每个图片为非默认值状态
  spuImageList.value.forEach((item) => {
    item.isDefault = 0;
    tableRef.value?.toggleRowSelection(item, false);
  });
  // 当前这个图片是默认的
  row.isDefault = 1;
  tableRef.value?.toggleRowSelection(row, true);
};

// 图片选中就执行的回调函数
const handleSelectionChange = (val: SpuImageListModel) => {
  //  存储选择的图片数组
  skuInfo.skuImageList = val as any;
};
</script>
<style scoped>
</style>