// 引入request
import request from '@/utils/request'
import { UploadAjaxError } from 'element-plus/es/components/upload/src/ajax'
// 引入接口类型
import type { SpuPageParamsCategoryIdModel, SpuSaleAttrListModel, SpuListModel, BaseSaleAttrListModel, SpupagListParamsModel, SpuModel, SpuImageListModel } from './model/spuModel'
// 定义枚举类型的地址
enum Api {
    // 获取基础的销售属性数组数据的接口地址
    GetBaseSaleAttrList = '/admin/product/baseSaleAttrList',
    // 根据id删除Spu对象的地址接口
    DeleteIdSpu = '/admin/product/deleteSpu',
    // 根据关键字获取spu对象数组数据的接口地址
    FindSpuInfoByKeyword = '/admin/product/findSpuInfoByKeyword',
    // 根据id获取spu对象数据的接口地址
    GetIdObtainSpu = '/admin/product/getSpuInfo',
    // 根据id的数组获取对应的spi对象数组数据的接口地址
    FindSpuInfoBySpuIdList ='/admin/product/inner/findSpuInfoBySpuIdList',
    // 添加spu的接口地址
    AddSpuInfo = '/admin/product/saveSpuInfo',
    // 修改spu的接口地址
    UpDateSpuInfo = '/admin/product/updateSpuInfo',
    // 根据页码和每页的条数以及三级分类的id获取spu对象数组数据的接口地址
    GetProduct = '/admin/product',
    // 根据spu的id获取对应的图片列表数据的接口地址
    GetSpuImageList = '/admin/product/spuImageList',
    // 根据spu的id获取对应的销售属性列表数据的接口地址
    GetSpuSaleAttrList = '/admin/product/spuSaleAttrList'
}
// 定义接口函数
// 获取基础的销售属性数组数据的接口函数
export const getBaseSaleAttrListApi = () => request.get<any,BaseSaleAttrListModel>(Api.GetBaseSaleAttrList)
 // 根据id删除Spu对象的地址函数
export const deleteIdSpuApi = (spuId:number) => request.delete<any,null>(Api.DeleteIdSpu+`/${spuId}`)
 // 根据关键字获取spu对象数组数据的接口函数
export const findSpuInfoByKeywordApi = (keyword:string) => request.get<any,SpuListModel>(Api.FindSpuInfoByKeyword+`/${keyword}`)
// 根据id获取spu对象数据的接口函数
export const getIdObtainSpuApi = (spuId:number) => request.get<any,SpuModel>(Api.GetIdObtainSpu+`/${spuId}`)
// 根据id的数组获取对应的spi对象数组数据的接口函数
export const findSpuInfoBySpuIdListApi = (ids:number[]) => request.post<any,SpuModel>(Api.FindSpuInfoBySpuIdList,ids)
 // 添加spu的接口函数
export const  addSpuInfoApi = (spuInfo:SpuModel) => request.post<any,null>(Api.AddSpuInfo,spuInfo)
 // 修改spu的接口函数
export const  upDateSpuInfoApi = (spuInfo:SpuModel) => request.post<any,null>(Api.UpDateSpuInfo,spuInfo)
// 根据页码和每页的条数以及三级分类的id获取spu对象数组数据的接口函数
export const getProductApi = ({page,limit,category3Id}:SpuPageParamsCategoryIdModel) => request.get<any,SpupagListParamsModel>(Api.GetProduct+`/${page}/${limit}`,{params:{category3Id}})
 // 根据spu的id获取对应的图片列表数据的接口函数
export const  getSpuImageListApi = (spuId:number) => request.get<any,SpuImageListModel>(Api.GetSpuImageList+`/${spuId}`)
 // 根据spu的id获取对应的销售属性列表数据的接口函数
export const getSpuSaleAttrListApi = (spuId:number) => request.get<any,SpuSaleAttrListModel>(Api. GetSpuSaleAttrList+`/${spuId}`)
// 添加或者修改spu的接口函数
export const addOrupDateSpuInfoApi = (spuInfo:SpuModel) => spuInfo.id ? upDateSpuInfoApi(spuInfo): addSpuInfoApi(spuInfo)

