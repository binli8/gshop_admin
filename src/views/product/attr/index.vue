<template>
  <el-card shadow="always" style="margin-bottom: 10px">
    <CategirySelector :isDisabled="!isShowEditAttr"/>
  </el-card>

  <el-card shadow="always">
    <!--按钮和表格-->
    <div v-if="isShowEditAttr">
      <!--按钮-->
      <el-button :icon="Plus" type="primary" @click="showAddAttr"
        >添加属性</el-button
      >
      <!--表格-->
      <el-table
        row-key="id"
        v-loading="loading"
        :data="attrList"
        stripe
        style="width: 100%"
        border
      >
        <el-table-column type="index" label="序号" width="80" align="center" />
        <el-table-column prop="attrName" label="属性名称" width="150">
        </el-table-column>
        <el-table-column label="属性值列表">
          <template v-slot="{ row }">
            <el-tag
              type="success"
              v-for="attr in row.attrValueList"
              :key="attr.id"
              >{{ attr.valueName }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button
              size="small"
              type="primary"
              :icon="Edit"
              @click="showUpdateAttr(row)"
            ></el-button>
            <el-popconfirm :title="`您确认要删除${row.attrName}`" @click="deleteAttr(row)">
              <template #reference>
                <el-button size="small" type="danger" icon="Delete"></el-button>
              </template>
            </el-popconfirm>
            <el-button
              size="small"
              type="danger"
              :icon="Delete"
              @click="deleteAttributes"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div v-else>
      <el-form inline>
        <el-form-item label="属性名">
          <el-input
            type="text"
            placeholder="请输入属性名字"
            v-model="attr.attrName"
          ></el-input>
        </el-form-item>
      </el-form>
      <!--两个按钮-->
      <div style="margin-bottom: 20px">
        <el-button type="primary" :icon="Plus" @click="addAttValue" :disabled="!attr.attrName">添加属性值</el-button>
        <el-button @click="isShowEditAttr = true">取消</el-button>
      </div>
      <!--表格-->
      <el-table
        row-key="id"
        :data="attr.attrValueList"
        stripe
        style="width: 100%; margin-bottom: 20px"
        border
      >
        <el-table-column type="index" label="序号" width="80" align="center" />
        <el-table-column label="属性值名称">
          <template v-slot="{ row, $index }">
            <el-input
              :ref="(input) => (inputRefs[$index] = input)"
              v-if="row.isShowEdit"
              @blur="toSpanShow(row, $index)"
              size="small"
              v-model="row.valueName"
              type="text"
              placeholder="请输入属性值名字"
            ></el-input>
            <span
              v-else
              @click="toInputEdit(row, $index)"
              style="width: 100%; display: inline-block"
              >{{ row.valueName }}</span
            >
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button size="small" type="danger" :icon="Delete" ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--两个按钮-->
      <div>
        <el-button type="primary" :disabled="!attr.attrName || attr.attrValueList.length">保存</el-button>
        <el-button @click="isShowEditAttr = true">取消</el-button>
      </div>
    </div>
  </el-card>
</template>
<script lang="ts">
export default {
  name: "Attr",
};
</script>
<script lang="ts" setup>
// 引入三级分类组件
import CategirySelector from "@/components/CategirySelector/index.vue";
// 引入icon图标
import { Plus, Edit, Delete } from "@element-plus/icons-vue";
import { reactive, ref, watch, nextTick } from "vue";
// 引入平台属性值对象数组接口类型
import type {
  AttrListModel,
  AttrModel,
  AttrValueModel,
} from "@/api/product/model/attrModel";
// 引入pinia仓库
import { useCategoryStore } from "@/stores/category";
// 引入三级分类的id获取对应的平台属性对象数组的接口函数
import { getAttrInfoListApi, deleteAttrApi } from "@/api/product/attr";
// 引入深拷贝的方法
import cloneDeep from "lodash/cloneDeep";
import { ElMessage } from "element-plus";

// 表格加载的效果标识
const loading = ref<boolean>(false);
// 定义平台属性对象数组列表数据
const attrList = ref<AttrListModel>([]);
const categoryStore = useCategoryStore();
// 用来控制添加或者修改平台属性界面显示或者隐藏的标识
const isShowEditAttr = ref<boolean>(true);
// 定义一个数组,用来收集
const inputRefs = ref<HTMLInputElement[]>([]);
// 定义一个attr对象 --- 平台属性对象
const attr = reactive<AttrModel>({
  id: undefined, //id
  attrName: "", //名字
  categoryI: -1, //分类的id
  categoryLevel: 0, //分类的级别
  attrValueList: [], //平台属性值对象数组
});

// 获取三级分类的id,调用接口,获取平台属性列表数组
const getAttrList = async () => {
  attrList.value = await getAttrInfoListApi({
    category1Id: categoryStore.getCategory1Id,
    category2Id: categoryStore.getCategory2Id,
    category3Id: categoryStore.getCategory3Id,
  });
};
// 三级分类id有了之后再调用上面的方法
watch(
  () => categoryStore.category3Id,
  (category3Id) => {
    if (!category3Id) return;
    getAttrList();
  },
  { immediate: true }
);

// 点击添加平台属性按钮的回调函数
const showAddAttr = () => {
  // 清空平台属性对象中的数据
  Object.assign(attr, {
    id: undefined, //id
    attrName: "", //名字
    categoryI: categoryStore.getCategory3Id, //分类的id
    categoryLevel: 3, //分类的级别
    attrValueList: [], //平台属性值对象数组
  });
  // 显示平台属性界面显示
  isShowEditAttr.value = false;
};

// 点击修改平台属性按钮的回调函数
const showUpdateAttr = (row: AttrModel) => {
  // 深拷贝
  Object.assign(attr, cloneDeep(row));
  // 显示平台属性界面显示
  isShowEditAttr.value = false;
};

// 切换查看模式
const toSpanShow = (row: AttrValueModel, index: number) => {
  // 判断当前这一行中的内容是否存在,如果不存在,则移除
  if (!row.valueName.length) {
    attr.attrValueList.splice(index, 1);
  }
  row.isShowEdit = false;
};

// 切换编辑模式
const toInputEdit = (row: AttrValueModel, index: number) => {
  // 先设置文本框显示出来
  row.isShowEdit = true;
  // 设置文本框获取焦点
  nextTick(() => {
    inputRefs.value[index].focus();
  });
};

// 添加平台属性
const addAttValue = () => {
  attr.attrValueList.push({
    valueName: "",
    attrId: attr.id as number,
    isShowEdit: true,
  });
  nextTick(() => {
    // 表格中绑定的数组数据的长度
    inputRefs.value[attr.attrValueList.length - 1].focus();
  });
};

// 删除平台属性
const deleteAttributes = async (row: AttrModel) => {
  try {
    await deleteAttrApi(row.id as number);
    ElMessage.success("操作成功");
    getAttrList();
  } catch (error) {
    ElMessage.error(error as any | "操作失败");
  }
};
</script>
<style scoped>
</style>