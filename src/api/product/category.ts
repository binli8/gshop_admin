// 引入request
import request from '@/utils/request'
// 引入三级分类对象接口的类型,三级分类对象数组的接口类型
import type { CategoryModel, CategoryListModel } from './model/categoryModel'
// 定义枚举类型的接口地址
enum Api {
    // 获取一级分类列表数据的地址
    GetCategory1 = '/admin/product/getCategory1',
    // 获取二级分类列表数据的地址
    GetCategory2 = '/admin/product/getCategory2',
    // 获取三级分类列表数据的地址
    GetCategory3 = '/admin/product/getCategory3'
}
// 定义接口函数
// 获取一级分类列表数据的接口函数
export const getCategory1Api = () => request.get<any, CategoryListModel>(Api.GetCategory1)
// 获取二级分类列表数据的接口函数
export const getCategory2Api = (category1Id: number) => request.get<any, CategoryListModel>(Api.GetCategory2 + `/${category1Id}`)
// 获取三级分类列表数据的接口函数
export const getCategory3Api = (category2Id: number) => request.get<any, CategoryListModel>(Api.GetCategory3 + `/${category2Id}`)


