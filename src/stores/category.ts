// 引入分类相关的接口函数
import { getCategory1Api, getCategory2Api, getCategory3Api } from '@/api/product/category'
// 引入分类相关的数据接口类型
import type { CategoryModel, CategoryListModel, CategoryIdModel, Numberable } from '@/api/product/model/categoryModel'
import { defineStore } from 'pinia'
// 定义一个接口类型,限制state中数据的类型
export interface CategoryStateModel extends CategoryIdModel {
    category1list: CategoryListModel
    category2list: CategoryListModel
    category3list: CategoryListModel
}
// 创建仓库
export const useCategoryStore = defineStore({
    id: 'category',
    // 状态数据
    state: (): CategoryStateModel => ({
        category1Id: undefined,         //一级分类的id
        category2Id: undefined,         //二级分类的id
        category3Id: undefined,         //三级分类的id
        category1list: [],              //一级分类的列表数据
        category2list: [],              //二级分类的列表数据
        category3list: [],              // 三级分类的列表数据
    }),
    actions: {
        // 调用接口发送请求,获取一级分类列表数据
        async getCategory1List() {
            this.category1list = await getCategory1Api()
        },
        // 调用接口发送请求,获取二级分类列表数据
        async getCategory2List(category1Id: number) {
            // 先存储一级分类的id
            this.category1Id = category1Id
            this.category2list = await getCategory2Api(category1Id)
            // 干掉二级分类的id和三级分类的id及三级分类的列表数据
            this.category2Id = undefined
            this.category3Id = undefined
            this.category3list = []
        },
        // 调用接口发送请求,获取三级分类列表数据
        async getCategory3List(category2Id: number) {
            // 先存储二级分类的id
            this.category2Id = category2Id
            this.category3list = await getCategory3Api(category2Id)
            // 干掉三级分类的id
            this.category3Id = undefined
        }
    },
    // 计算属性
    getters: {
        getCategory1Id(): Numberable { return this.category1Id as number },
        getCategory2Id(): Numberable { return this.category2Id as number },
        getCategory3Id(): Numberable { return this.category3Id as number },
        getCategoryList1(): CategoryListModel { return this.category1list },
        getCategoryList2(): CategoryListModel { return this.category2list },
        getCategoryList3(): CategoryListModel { return this.category3list },
    }
})
// 暴露出去
export default useCategoryStore