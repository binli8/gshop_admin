<template>
  <el-form
    ref="ruleFormRef"
    :model="ruleForm"
    :rules="rules"
    label-width="120px"
    class="demo-ruleForm"
    :size="formSize"
    status-icon
  >
    <!-- SPU名称 -->
    <el-form-item label="SPU名称" prop="name"> 嘿嘿嘿 </el-form-item>

    <!-- SKU名称 -->
    <el-form-item label="SKU名称" prop="name">
      <el-input placeholder="请输入SPU名称" />
    </el-form-item>

    <!-- 价格(元) -->
    <el-form-item label="价格(元)" prop="name">
      <el-input type="number" placeholder="0" />
    </el-form-item>

    <!-- 重量(千克) -->
    <el-form-item label="重量(千克)" prop="name">
      <el-input placeholder="0" />
    </el-form-item>

    <!-- 规格描述 -->
    <el-form-item label="规格描述" prop="description">
      <el-input
        type="textarea"
        rows="4"
        placeholder="请输入SKU规格描述"
      ></el-input>
    </el-form-item>

    <!-- 平台属性 -->
    <el-form-item label="平台属性">
      <el-form inline>
        <el-form-item label="分类" style="margin-bottom: 10px">
          <el-select placeholder="请选择">
            <el-option label="Zone one" value="shanghai" />
            <el-option label="Zone two" value="beijing" />
          </el-select>
        </el-form-item>
        <el-form-item label="分类" style="margin-bottom: 10px">
          <el-select placeholder="请选择">
            <el-option label="Zone one" value="shanghai" />
            <el-option label="Zone two" value="beijing" />
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>

    <!-- 销售属性 -->
    <el-form-item label="销售属性">
      <el-form inline>
        <el-form-item label="版型" style="margin-bottom: 10px">
          <el-select placeholder="请选择">
            <el-option label="标准型" value="1" />
            <el-option label="修身型" value="2" />
            <el-option label="宽松型" value="3" />
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>

    <!-- 图片列表 -->
    <el-form-item label="图片列表">
      <el-table
        row-key="id"
        :data="[{ name: 'xxx', url: '111.jpg' }]"
        style="width: 100%"
        stripe
        border
      >
        <el-table-column type="selection" width="55" />
        <el-table-column label="图片" prop="" />
        <el-table-column label="名称" prop="" />
        <el-table-column label="操作">
          <template #default="{ row, $index }">
            <el-button size="small" type="primary">按钮</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <!-- 两个按钮 -->
    <el-form-item>
      <el-button type="primary">保存</el-button>
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
// 引入显示或者隐藏的界面的枚举类型
import { ShowStatus } from "../types";
// 引入icon
import { Plus, Delete } from "@element-plus/icons-vue";
</script>
<style scoped>
</style>


