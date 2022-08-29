import { defineStore } from 'pinia'
// 引入分类相关的接口函数(一级分类列表数据的接口函数,二级分类列表数据的接口函数,三级分类列表数据的接口函数)
import { getCategory1ListApi, getCategory2ListApi, getCategory3ListApi } from '@/api/product/category'
// 引入分类相关的数据接口类型
import type { CategoryModel, CategoryListModel, CategoryIdModel, NumberAble } from '@/api/product/model/categoryModel'
// 定义一个接口类型,现在state中数据的类型
export interface CategoryStateModel extends CategoryIdModel {
    category1List: CategoryListModel
    category2List: CategoryListModel
    category3List: CategoryListModel
}
// 创建仓库
export const useCategoryStore = defineStore({
    id: 'category',
    // 状态仓库
    state: (): CategoryStateModel => ({
        category1Id: undefined,      //一级分类的id
        category2Id: undefined,      //二级分类的id
        category3Id: undefined,      //三级分类的id
        category1List: [],           //一级分类的列表数据
        category2List: [],           //一级分类的列表数据
        category3List: [],           //一级分类的列表数据
    }),
    // 计算属性
    getters: ({
        // 获取一级分类的id
        getCategory1Id(): NumberAble { return this.category1Id as number },
        // 获取二级分类的id
        getCategory2Id(): NumberAble { return this.category2Id as number },
        // 获取三级分类的id
        getCategory3Id(): NumberAble { return this.category3Id as number },
        // 获取一级分类的列表数据
        getCategory1List(): CategoryListModel { return this.category1List },
        // 获取二级分类的列表数据
        getCategory2List(): CategoryListModel { return this.category2List },
        // 获取三级分类的列表数据
        getCategory3List(): CategoryListModel { return this.category3List },
    }),
    actions: {
        // 调用接口发送请求,获取一级分类列表数据
        async getCategory1List1() {
            this.category1List = await getCategory1ListApi()
        },
        // 调用接口发送请求,获取二级分类列表数据 
        async getCategory2List2(category1Id: number) {
            // 先存储一级分类的id
            this.category1Id = category1Id
            this.category2List = await getCategory2ListApi(category1Id)
            // 干掉二级分类的id和三级分类的id以及三级分类的数据
            this.category2Id = undefined
            this.category3Id = undefined
            this.category3List = []
        },
        // 调用接口发送请求,获取三级分类列表数据 
        async getCategory3List3(category2Id: number) {
            // 存储二级分类的id
            this.category2Id = category2Id
            this.category3List = await getCategory3ListApi(category2Id)
            // 干掉三级分类的id
            this.category3Id = undefined
        }
    }
})
// 暴露
export default useCategoryStore