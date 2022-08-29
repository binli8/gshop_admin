// 引入request
import request from '@/utils/request'
// 引入(平台属性值对象接口类型,平台属性值对象数组接口类型,平台属性对象接口类型,平台属性值对象数组接口类型)
import type { AttrValueModel, AttrValueListModel, AttrModel, AttrListModel } from './model/attrModel'
// 引入带有三个分类id的接口类型
import type { CategoryIdModel } from './model/categoryModel'
// 定义枚举接口地址
enum Api {
    // 根据三级分类获取平台属性数据的地址
    GetAttrInfoList = '/admin/product/attrInfoList/{category1Id}/',
    // 根据删除id平台属性的接口地址
    DeleteAttr = '/admin/product/deleteAttr/',
    // 根据id获取平台属性值对象数组的接口地址
    GetAttrValueList = '/admin/product/getAttrValueList/',
    // 添加或者修改平台属性的接口地址
    SaveAttrInfo = '/admin/product/saveAttrInfo'
}
// 根据三个分类的id获取对应的平台属性对象数组的接口函数
export const getAttrInfoListApi = ({ category1Id, category2Id, category3Id }: CategoryIdModel) => request.get<any, AttrListModel>(Api.GetAttrInfoList + `${category1Id}/${category2Id}/${category3Id}`)
// 根据id删除指定指定的平台属性对象的接口函数
export const deleteAttrApi = (attrId: number) => request.delete<any, null>(Api.DeleteAttr + `${attrId}`)
// 根据id获取对应的平台属性值对象的数组的接口函数
export const getAttrValueListApi = (attrId: number) => request.get<any, AttrValueListModel>(Api.GetAttrValueList + `${attrId}`)
// 添加或者修改平台属性对象的接口函数
export const saveAttrInfoApi = (arrt: AttrModel) => request.post<any, null>(Api.GetAttrInfoList, arrt)


// GET 
// getAttrValueList

// POST 
// 

