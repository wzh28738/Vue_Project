// SKU接口
import request from '../../../utils/request'
import { SkuResponseData,SkuByIdResponseData } from './type'

enum API {
    // 获取已有SKU数据：/admin/product/list/{page}/{limit}
    GETSKU_URL = '/admin/product/list/',
    // 上架接口：/admin/product/onSale/{skuId}
    ONSALE_URL = '/admin/product/onSale/',
    // 下架接口：/admin/product/cancelSale/{skuId}
    CANCELSALE_URL = '/admin/product/cancelSale/',
    // 根据skuId获取sku信息：/admin/product/getSkuInfo/{skuId}
    GETSKUINFO_URL = '/admin/product/getSkuInfo/',
    // 删除接口：/admin/product/deleteSku/{skuId}
    REMOVESKU_URL = '/admin/product/deleteSku/'
}

// 获取已有SKU数据
export const reqSkuList = (page: number, limit: number) => request.get<any,SkuResponseData>(API.GETSKU_URL + page + '/' + limit)
// 上架接口
export const reqOnSale = (skuId: number) => request.get<any,any>(API.ONSALE_URL + skuId)
// 下架接口
export const reqCancelSale = (skuId: number) => request.get<any,any>(API.CANCELSALE_URL + skuId)
// 根据skuId获取sku信息
export const reqSkuInfo = (skuId: number) => request.get<any,SkuByIdResponseData>(API.GETSKUINFO_URL + skuId)
// 删除接口
export const reqRemoveSku = (skuId: number) => request.delete<any,any>(API.REMOVESKU_URL + skuId)


