// 引入发送请求的函数对象
import request from '@/utils/request'
// 引入响应返回值的数据类型
import type { TrademarkModel, TrademarkListModel, TrademarkPageListModel } from './model/TrademarkModel'
// 定义请求地址的枚举
enum Api {
    // 根据关键字获取品牌列表数组数据的接口地址
    GetTrademarkListBykeyword = '/admin/product/baseTrademark/findBaseTrademarkByKeyword/',
    // 根据品牌的id获取品牌对象的接口地址
    GetTrademarkById = '/admin/product/baseTrademark/get/',
    // 获取所有的品牌列表数据的接口地址
    GetTrademarkAll = '/admin/product/baseTrademark/getTrademarkList',
    // 根据id的数组获取品牌列表数据的接口地址
    GetTrademarkListByIds = '/admin/product/baseTrademark/inner/findBaseTrademarkByTrademarkIdList',
    // 根据品牌的id删除品牌对象的接口地址
    DeleteTrademarkById = '/admin/product/baseTrademark/remove/',
    // 新增品牌的接口地址
    AddTrademark = '/admin/product/baseTrademark/save',
    // 修改品牌的接口地址
    UpdateTrademark = '/admin/product/baseTrademark/update',
    // 根据页码和每页的条数获取品牌对象数据列表数据的接口
    GetTrademarkList = '/admin/product/baseTrademark/'

}
// 封装接口函数
// 根据关键字获取品牌列表数组数据的接口函数
export const getTrademarkListBykeywordApi = (keyword: string) => request.get<any, TrademarkListModel>(Api.GetTrademarkListBykeyword + `${keyword}`)
// 根据品牌的id获取品牌对象的接口函数
export const getTrademarkByIdApi = (id: number) => request.get<any, TrademarkModel>(Api.GetTrademarkById + `${id}`)
// 获取所有的品牌列表数据的接口函数
export const getTrademarkAllApi = () => request.get<any, TrademarkListModel>(Api.GetTrademarkAll)
// 根据id的数组获取品牌列表数据的接口函数
export const getTrademarkListByIdsApi = (ids: number[]) => request.post<any, TrademarkListModel>(Api.GetTrademarkListByIds, ids)
// 根据品牌的id删除品牌对象的接口函数
export const deleteTrademarkByIdApi = (id: number) => request.delete<any, null>(Api.DeleteTrademarkById + `${id}`)
// 新增品牌的接口地址的接口函数
export const addTrademarkApi = (trademark: TrademarkModel) => request.post<any, null>(Api.AddTrademark, trademark)
// 修改品牌的接口地址的接口函数
export const updateTrademarkApi = (trademark: TrademarkModel) => request.put<any, null>(Api.UpdateTrademark, trademark)
// 根据页码和每页的条数获取品牌对象数组数据的接口函数
export const getTrademarkListApi = (page: number, limit: number) => request.get<any, TrademarkPageListModel>(Api.GetTrademarkList + `${page}/${limit}`)

// 新增或者修改品牌对象
export const addOrUpdateTrademarkApi = (trademark: TrademarkModel) => {
    if (trademark.id) {     //修改
        return request.put<any, null>(Api.UpdateTrademark, trademark)
    } else {        //新增
        return request.post<any, null>(Api.AddTrademark, trademark)
    }

}