// 引入request
import request from '@/utils/request'
// 引入 接口类型
import type { SkuInfoModel, SkuInfoListModel, SkuPageListParamsModel } from './model/skuModel'
// 定义枚举
enum Api {
    // 上架的接口地址
    OnSale = '/admin/product/onSale',
    // 下架的接口地址
    CancelSale = '/admin/product/cancelSale',
    // 根据id删除sku对象的接口地址
    DeleteSkuInfoById = '/admin/product/deleteSku',
    // 根据spu的id获取spu对象的数组列表数据的接口
    GetSkuInfoListBySpuId = '/admin/product/findBySpuId',
    // 根据sku的id获取对应的sku对象的接口地址
    GetSkuInfoById = '/admin/product/getSkuInfo',
    // 根据关键字获取sku对象数组列表数据的接口地址
    GetSkuInfoListByKeyword = '/admin/product/inner/findSkuInfoByKeyword',
    // 根据id数组获取sku对象数组列表数据的接口地址
    GetSkuInfoListBySkuIds = '/admin/product/inner/findSkuInfoBySkuIdList',
    // 分页的方式获取sku列表数据的接口地址
    GetSkuInfoList = '/admin/product/list',
    // 添加sku对象的接口地址
    AddSkuInfo = '/admin/product/saveSkuInfo',
    // 修改sku对象的接口地址
    UpdateSkuInfo = '/admin/product/updateSkuInfo'
}

// 定义接口函数
// 上架的接口函数
export const onSaleApi = (skuId: number) => request.get<any, null>(Api.OnSale + `/${skuId}`)
// 下架的接口函数
export const cancelSaleApi = (skuId: number) => request.get<any, null>(Api.CancelSale + `/${skuId}`)
// 根据id删除sku对象的接口函数
export const deleteSkuInfoByIdApi = (skuId: number) => request.delete<any, null>(Api.DeleteSkuInfoById + `/${skuId}`)
// 根据spu的id获取spu对象的数组列表数据的函数
export const getSkuInfoListBySpuIdApi = (skuId: number) => request.get<any, SkuInfoListModel>(Api.GetSkuInfoListBySpuId + `/${skuId}`)
// 根据sku的id获取对应的sku对象的接口函数
export const getSkuInfoByIdApi = (skuId: number) => request.get<any, SkuInfoModel>(Api.GetSkuInfoById + `/${skuId}`)
// 根据关键字获取sku对象数组列表数据的接口函数
export const getSkuInfoListByKeywordApi = (keyword: string) => request.get<any, SkuInfoListModel>(Api.GetSkuInfoListByKeyword + `/${keyword}`)
// 根据id数组获取sku对象数组列表数据的接口函数
export const getSkuInfoListBySkuIdsApi = (ids: number[]) => request.post<any, null>(Api.GetSkuInfoListBySkuIds, ids)
// 分页的方式获取sku列表数据的接口函数
export const getSkuInfoListApi = (page: number, limit: number) => request.get<any, SkuPageListParamsModel>(Api.GetSkuInfoList + `/${page}/${limit}`)
// 添加sku对象的接口函数
export const addSkuInfoApi = (skuInfo: SkuInfoModel) => request.post<any, null>(Api.AddSkuInfo, skuInfo)
// 修改sku对象的接口函数
export const updateSkuInfoApi = (skuInfo: SkuInfoModel) => request.post<any, null>(Api.UpdateSkuInfo, skuInfo)
// 修改或添加sku数据的接口函数
export const addOrUpdateSkuInfoApi= (skuInfo: SkuInfoModel) => skuInfo.id ? updateSkuInfoApi(skuInfo) : addSkuInfoApi(skuInfo)

