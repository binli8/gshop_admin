// sku的平台属性对象接口类型
export interface SkuAttrValueModel{
    id?:number          //id
    skuId?:number       //sku的id
    attrName?:string    //平台属性名字
    valueName?:string   //平台属性值名字
    attrId:number       //平台属性的id
    valueId:number      //平台属性值的id
}
// sku的平台属性对象数组接口类型
export type SkuAttrValueListModel = SkuAttrValueModel[]

// sku的图片对象接口类型
export interface SkuImageModel {
    id?:number          //id
    skuId?:number       //sku的id
    spuImgId:number     //spu的图片的id
    imgName:string      //图片名字
    imgUrl:string       //图片地址
    isDefault?:number    //是否默认的标识
}
// sku的图片对象数组接口定义
export type SkuImageListModel = SkuImageModel[]

// sku的销售属性对象接口类型
export interface SkuSaleAttrValueModel{
    id?:number                      //id
    saleAttrId?:number              //销售属性的id
    skuId?:number                   //sku的id
    spuId?:number                   //spu的id
    saleAttrName?:string            //销售属性名字
    saleAttrValueName?:string       //销售属性值名字
    saleAttrValueId:number          //销售属性值id
    isDefault?:number
}
// sku的销售属性对象数组接口类型
export type SkuSaleAttrValueListModel =SkuSaleAttrValueModel[]
// sku对象的接口类型
export interface SkuInfoModel{  
    id?:number                  //id
    isSale?:number              //上下架标识
    category3Id?:number         //三级分类的id
    spuId?:number               //spu的id
    price:number                //价格
    tmId?:number                 //品牌的id
    skuDefaultImg:string        //默认图片的地址
    skuDesc:string              //描述
    weight:string               //重量
    skuName:string              //名字
    skuAttrValueList:SkuAttrValueListModel      //平台属性数组
    skuImageList:SkuImageListModel              //图片数组
    skuSaleAttrValueList:SkuSaleAttrValueListModel      //销售属性数组
}
// sku对象数组的接口类型
export type SkuInfoListModel = SkuInfoModel[]
// sku列表分页的对象类型
export interface SpuPageListParamsModel{
    records:SkuInfoListModel
    total:number
}
