// 引入 request
import request from '@/utils/request'
// 引入平台属性相关数据的接口类型(平台属性值对象接口类型,属性值对象数组接口类型,平台属性对象接口类型,平台属性对象数组接口类型)
import type { AttrValueModel, AttrValueListModel, AttrModel, AttrListModel } from './model/attrModel'
//引入带有三个分类id的接口类型
import type { CategoryIdModel } from './model/categoryModel'
// 定义枚举类型的接口地址
enum Api {
    // 根据三级分类获取平台属性数据的地址
    GetAttrInfoList = '/admin/product/attrInfoList',
    // 根据id删除平台属性的接口地址
    DeleteAttrById = '/admin/product/deleteAttr',
    // 根据id获取平台属性值对象数组的接口地址
    GetattrValueListByid = '/admin/product/getAttrValueList',
    // 添加或者修改平台属性的接口地址
    AddOrUpdateAttr = '/admin/product/saveAttrInfo'
}
// 定义接口函数
// 根据三级分类的id获取对应的平台属性对象数组的接口函数
export const getAttrInfoListApi = ({ category1Id, category2Id, category3Id }: CategoryIdModel) => request.get<any, AttrListModel>(Api.GetAttrInfoList + `/${category1Id}/${category2Id}/${category3Id}`)
// 根据id删除指定的平台属性对象的接口函数
export const deleteAttrByIdApi = (attrId: number) => request.delete<any, null>(Api.DeleteAttrById + `/${attrId}`)
// 根据id获取对应的平台属性值对象的数组的接口函数
export const getattrValueListByidApi = (attrId: number) => request.get<any, AttrValueListModel>(Api.GetattrValueListByid + `/${attrId}`)
// 添加或者修改平台属性对象的接口函数
export const addOrUpdateAttrApi = (attr: AttrModel) => request.post<any, null>(Api.AddOrUpdateAttr, attr)


