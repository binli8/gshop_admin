// 引入request
import request from '@/utils/request'
// 引入接口类型
import type { SkuInfoListModel,SkuInfoModel,SpuPageListParamsModel } from './model/skuModel'
// 定义枚举接口路径
enum Api {
    // 上架的接口地址
    GetonSale = '/admin/product/onSale',
    // 下架的接口地址
    GetcancelSale = '/admin/product/cancelSale',
    // 根据id删除sku对象的接口地址
    DeleteSku = '/admin/product/deleteSku',
    // 根据spu的id获取sku对象的接口地址
    FindBySpuId = '/admin/product/findBySpuId',
    // 根据sku的id获取对应的sku对象的接口地址
    GetSkuInfo = '/admin/product/getSkuInfo',
    // 根据关键字获取sku对象数组列表数据的接口地址
    FindSkuInfoByKeyword = '/admin/product/inner/findSkuInfoByKeyword',
    // 根据id数组获取sku对象数组列表数据的接口地址
    FindSkuInfoBySkuIdList = '/admin/product/inner/findSkuInfoBySkuIdList',
    // 分页的方式获取sku列表数据的接口地址
    GetSkuInfoList = '/admin/product/list',
    // 添加sku对象的接口地址
    SaveSkuInfo = '/admin/product/saveSkuInfo',
    // 修改sku对象的接口地址
    PdateSkuInfo = '/admin/product/updateSkuInfo'
}
// 定义接口函数
// 上架的接口地址
export const getonSaleApi = (skuId:number) => request.get<any,null>(Api.GetonSale+`/${skuId}`)
  // 下架的接口地址
export const getcancelSaleApi = (skuId:number) => request.get<any,null>(Api.GetcancelSale+`/${skuId}`)
// 根据id删除sku对象的接口地址
export const deleteSkuApi = (skuId:number) => request.delete<any,null>(Api.DeleteSku+`/${skuId}`)
// 根据spu的id获取sku对象的接口地址
export const findBySpuIdApi = (skuId:number) => request.get<any,SkuInfoListModel>(Api.FindBySpuId+`/${skuId}`)
// 根据sku的id获取对应的sku对象的接口地址
export const getSkuInfoApi = (skuId:number) => request.get<any,SkuInfoModel>(Api.GetSkuInfo+`/${skuId}`)
// 根据关键字获取sku对象数组列表数据的接口地址
export const findSkuInfoByKeywordApi = (keyword:string) => request.get<any,SkuInfoListModel>(Api.FindSkuInfoByKeyword+`/${keyword}`)
// 根据id数组获取sku对象数组列表数据的接口地址
export const findSkuInfoBySkuIdListApi = (ids:number[]) => request.post<any,SkuInfoListModel>(Api.FindSkuInfoBySkuIdList,ids)
// 分页的方式获取sku列表数据的接口地址
export const getSkuInfoListApi = (page:number,limit:number) => request.get<any,SpuPageListParamsModel>(Api.GetSkuInfoList+`/${page}/${limit}`)
// 添加sku对象的接口地址
export const saveSkuInfoApi = (skuInfo:SkuInfoModel) => request.post<any,null>(Api.SaveSkuInfo,skuInfo)
 // 修改sku对象的接口地址
export const pdateSkuInfoApi = (skuInfo:SkuInfoModel) => request.post<any,null>(Api.PdateSkuInfo,skuInfo)
// 添加或者修改sku数据的接口函数
export const addOrUpdateSkuInfo = (skuInfo:SkuInfoModel) => skuInfo.id ? pdateSkuInfoApi(skuInfo) :pdateSkuInfoApi(skuInfo)
