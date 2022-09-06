<template>
  <el-card shadow="always" style="margin-bottom: 10px">
    <CategorySelector :isDisabled="!isShowEditAttr" />
  </el-card>
  <el-card shadow="always">
    <!--按钮和表格-->
    <div v-if="isShowEditAttr">
      <!--按钮-->
      <el-button
        :icon="Plus"
        type="primary"
        @click="showAddAttr"
        :disabled="!categoryStore.category3Id"
        >添加属性</el-button
      >
      <!--表格-->
      <el-table
        v-has="'btn.Attr.add'"
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

            <el-popconfirm
              @confirm="deleteData(row)"
              :title="`您确认删除吗${row.attrName}?`"
            >
              <template #reference>
                <el-button
                  size="small"
                  type="danger"
                  :icon="Delete"
                ></el-button>
              </template>
            </el-popconfirm>
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
        <el-button
          type="primary"
          :icon="Plus"
          @click="addAttValue"
          :disabled="!attr.attrName"
          >添加属性值</el-button
        >
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
          <template #default="{ row, $index }">
            <el-popconfirm :title="`您确认删除吗${row.valueName}?`">
              <template #reference>
                <el-button
                  size="small"
                  type="danger"
                  :icon="Delete"
                  @confirm="attr.attrValueList.splice($index - 1)"
                ></el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <!--两个按钮-->
      <div>
        <el-button
          type="primary"
          @click="save"
          :disabled="!attr.attrName || !attr.attrValueList.length"
          >保存</el-button
        >
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
import { reactive, ref, watch, nextTick, onBeforeUnmount } from "vue";
// 引入三级分类组件
import CategorySelector from "@/components/CategorySelector/index.vue";
// 引入icon
import { Plus, Delete, Edit } from "@element-plus/icons-vue";
// 引入深拷贝的方法
import cloneDeep from "lodash/cloneDeep";
// 引入平台属性值对象数组接口类型
import type {
  AttrValueModel,
  AttrListModel,
  AttrModel,
} from "@/api/product/model/attrModel";
// 引入仓库
import { useCategoryStore } from "@/stores/category";
// 引入-根据三级分类的id获取对应的平台属性对象数组的接口函数
import {
  getAttrInfoListApi,
  addOrUpdateAttrApi,
  deleteAttrByIdApi,
} from "@/api/product/attr";
import { ElMessage } from "element-plus";
// 表格加载标识
const loading = ref<boolean>(false);
// 定义平台属性对象数组列表数据
const attrList = ref<AttrListModel>([]);
const categoryStore = useCategoryStore();
// 用来控制添加或者修改平台属性界面显示或者隐藏的标识
const isShowEditAttr = ref<boolean>(true);
// 定义一个attr对象----平台属性对象
const attr = reactive<AttrModel>({
  attrName: "", //名字
  categoryId: -1, //分类的id
  categoryLevel: 3, //分类的级别
  attrValueList: [], //平台属性值对象数组
});
// 定义一个数组,用来收集所需要的ref的dom对象
const inputRefs = ref<HTMLInputElement[]>([]);
// 获取三级分类的id,调用接口,获取平台属性列表数据
// 获取平台属性列表数据的方法
const getAttrList = async () => {
  attrList.value = await getAttrInfoListApi({
    category1Id: categoryStore.category1Id,
    category2Id: categoryStore.category2Id,
    category3Id: categoryStore.category3Id,
  });
};
// 监视
watch(
  () => categoryStore.category3Id,
  (category3Id) => {
    if (!category3Id) {
      attrList.value = [];
      return;
    }
    getAttrList();
  },
  { immediate: true }
);

// 点击添加平台属性按钮的回调函数
const showAddAttr = () => {
  // 清空平台属性对象中的数据
  Object.assign(attr, {
    attrName: "", //名字
    categoryId: categoryStore.getCategory3Id, //分类的id
    categoryLevel: 3, //分类的级别
    attrValueList: [], //平台属性值对象数组
  });
  isShowEditAttr.value = false;
};

// 点击修改平台属性按钮的回调函数
const showUpdateAttr = (row: AttrModel) => {
  // 浅拷贝操作
  // Object.assign(attr,row)
  // 深拷贝操作
  Object.assign(attr, cloneDeep(row));
  isShowEditAttr.value = false;
};
// 查看切换模式
const toSpanShow = (row: AttrValueModel, index: number) => {
  // 判断当前这一行中的内容是否存在,如如果不存在,则移除
  if (!row.valueName.length) {
    attr.attrValueList.splice(index, 1);
  }
  row.isShowEdit = false;
};
// 切换编辑模式
const toInputEdit = (row: AttrValueModel, index: number) => {
  // 先设置文本框显示出来
  row.isShowEdit = true;
  nextTick(() => {
    inputRefs.value[index].focus();
  });
};

// 点击按钮 添加属性值按钮 添加数据
const addAttValue = () => {
  attr.attrValueList.push({
    valueName: "", //属性值的名字
    attrId: attr.categoryId as number, //所对应的平台属性对象的id
    isShowEdit: true,
  });
};

// 点击保存按钮
const save = async () => {
  // 更新三级分类的id
  attr.categoryId = categoryStore.getCategory3Id as number;
  // 判断平台属性值数组是否有数据,如果没有数据提示
  if (attr.attrValueList.length === 0) {
    ElMessage.warning("请输入数据");
    return;
  }
  // 过滤没有值的数据以及干掉isShowEdit属性
  attr.attrValueList.filter((item) => {
    if (!item.valueName) return false;
    // 有数据
    delete item.isShowEdit;
  });
  try {
    // 调用接口发送请求
    await addOrUpdateAttrApi(attr);
    // 提示成功
    ElMessage.success("操作成功了");
    // 关闭当前页面
    isShowEditAttr.value = true;
  } catch (error) {
    ElMessage.error((error as any) || "操作失败");
  }
};

// 删除按钮的回调
const deleteData = async (row: AttrModel) => {
  try {
    // 发送请求删除数据
    await deleteAttrByIdApi(row.id as number);
    // 提示成功信息
    ElMessage.success("操作成功");
    // 刷新
    getAttrList();
  } catch (error) {
    // 提示失败信息
    ElMessage.error((error as any) || "操作失败");
  }
};

// 组件卸载之前,清空数据
onBeforeUnmount(() => {
  categoryStore.$state = {
    category1Id: undefined, //一级分类的id
    category2Id: undefined, //二级分类的id
    category3Id: undefined, //三级分类的id
    category1list: [], //一级分类的列表数据
    category2list: [], //二级分类的列表数据
    category3list: [], // 三级分类的列表数据
  };
});
</script>
<style scoped>
</style>