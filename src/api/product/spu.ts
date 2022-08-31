// 引入request
import request from '@/utils/request'
// 引入接口类型
import type {SpuSaleAttrValueModel,SpuSaleAttrValueListModel,SpuSaleAttrModel,SpuSaleAttrListModel,SpuImageModel,SpuImageListModel,SpuModel,SpuListModel,BaseSaleAttrModel,BaseSaleAttrListModel,SpupageListParamsModel,SpuPageParamsCategoryIdModel} from './model/spuModel'
// 定义枚举类型的地址
enum Api{
    // 获取基础的销售属性数组数据的接口类型
    GetBaseSaleAttrList ='/admin/product/baseSaleAttrList',
    // 根据id删除对应的spu对象的接口地址
    DeleteSpuInfoById = '/admin/product/deleteSpu',
    // 根据关键字获取spu对象数组数据的接口地址
    GetSpuInfoListByKeywoed = '/admin/product/findSpuInfoByKeyword',
    // 根据id获取spu的对象数据的接口地址
    GetSpuInfoByid='/admin/product/getSpuInfo',
    // 根据id的数组获取对应的sou对象数组数据的接口地址
    GetSpuInfoListByIds= '/admin/product/inner/findSpuInfoBySpuIdList',
    // 添加spu的接口地址
    AddSpuInfo = '/admin/product/saveSpuInfo',
    // 修改spu的接口地址
    updateSpuInfo = '/admin/product/updateSpuInfo',
    // 根据页码和每页的条数以及三级分类id获取spu对象数组数据的接口地址
    GetSpuInfoList = '/admin/product',
    // 根据spu的id获取对应的图片列表数据的接口地址
    GetSpuImageListBySpuId = '/admin/product/spuImageList',
    // 根据spu的id获取对应的销售属性列表数据的接口地址,
    GetSpuSaleAttrListBySpuId = '/admin/product/spuSaleAttrList'
}
 // 获取基础的销售属性数组数据的接口函数
 export const  getBaseSaleAttrListApi = () => request.get<any,BaseSaleAttrListModel>(Api.GetBaseSaleAttrList)
// 根据id删除对应的spu对象的接口函数
 export const  deleteSpuInfoByIdApi = (spuId:number) => request.delete<any,null>(Api.DeleteSpuInfoById+`/${spuId}`)
 // 根据关键字获取spu对象数组数据的接口函数
 export const GetSpuInfoListByKeywoed = () => request.get<any,>(Api.)



// DELETE /admin/product/deleteSpu

// GET /admin/product/findSpuInfoByKeyword/{keyword}


// GET /admin/product/getSpuInfo/{spuId}


// POST /admin/product/inner/findSpuInfoBySpuIdList


// POST /admin/product/saveSpuInfo


// POST /admin/product/updateSpuInfo


// GET /admin/product/{page}/{limit}

// GET /admin/product/spuImageList/{spuId}

// GET /admin/product/spuSaleAttrList/{spuId}


