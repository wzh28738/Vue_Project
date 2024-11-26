// 品牌管理模块的接口
import request from '../../../utils/request'
import type { TradeMarkResponseData,TradeMark } from './type'
enum API {
    // 品牌列表接口 /admin/product/baseTrademark/{page}/{limit}
    TRADEMARK_URL = '/admin/product/baseTrademark/',
    // 添加品牌接口 /admin/product/baseTrademark/save
    ADDTRADEMARK_URL = '/admin/product/baseTrademark/save',
    // 修改品牌接口 /admin/product/baseTrademark/update
    UPDATATRADEMARK_URL = '/admin/product/baseTrademark/update',
    // 删除品牌接口 /admin/product/baseTrademark/remove/{id}
    REMOVETRADEMARK_URL = '/admin/product/baseTrademark/remove/'
}
// 获取已有的接口方法: Page为获取第几页, Limit为每页获取多少条数据
export const reqHasTrademark = (page: number, limit: number) => request.get<any,TradeMarkResponseData>(API.TRADEMARK_URL + `${page}/${limit}`)
// 添加品牌接口方法: trademark为品牌对象
export const reqAddTrademark = ( trademarkData:TradeMark) => request.post<any,any>(API.ADDTRADEMARK_URL,trademarkData)
// 修改品牌接口方法: id为品牌id, BaseTrademark为品牌对象
export const reqUpdateTrademark = ( trademarkData:TradeMark) => request.put<any,any>(API.UPDATATRADEMARK_URL,trademarkData)
// 删除品牌接口方法: id为品牌id
export const reqRemoveTrademark = ( id: number ) => request.delete<any,any>(API.REMOVETRADEMARK_URL + id)
