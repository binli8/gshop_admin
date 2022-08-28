// 定义平台属性值对象接口类型
export interface AttrValueModel{
    id?:number 
    valueName:string
    attrId:number
    isShowEdit?:boolean
}
// 定义平台属性值对象数组接口类型
export type AttrValueListModel = AttrValueModel[]
// 定义平台属性对象接口类型
export interface AttrModel{
    id?:number 
    attrName:string
    categoryId:number
    categoryLevel:number
    attrValueList:AttrValueListModel
}
// 定义平台属性对象数组接口类型
export type AttrListModel =AttrModel[ ]