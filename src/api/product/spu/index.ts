// SPU模块接口
import request from '../../../utils/request'
import type {
    HasSpuResponseData,
    AllTRadeMark,
    SpuImageResponseData,
    SaleAttrResponseData,
    SkuData,
    LookSkuResponseData
} from './type'

enum API {
    // 获取SPU信息接口/admin/product/{page}/{limit}
    GETHASSPU_URL = '/admin/product/',
    // 获取全部品牌接口/admin/product/baseTrademark/getTrademarkList
    GETALLTRADEMARK_URL = '/admin/product/baseTrademark/getTrademarkList',
    // 获取SPU图片接口/admin/product/spuImageList/{spuId}
    GETSPUIMAGELIST_URL = '/admin/product/spuImageList/',
    // 获取某一个SPU下的已有销售属性接口/admin/product/spuSaleAttrList/{spuId}
    GETBASESALEATTRLIST_URL = '/admin/product/spuSaleAttrList/',
    // 获取全部销售属性接口【颜色、版本、尺码】 /admin/product/baseSaleAttrList
    GETALLSALEATTRLIST_URL = '/admin/product/baseSaleAttrList',

    // 新增SPU接口'/admin/product/saveSpuInfo'
    ADDSPU_URL = '/admin/product/saveSpuInfo',
    // 更新SPU接口'/admin/product/updateSpuInfo'
    UPDATESPU_URL = '/admin/product/updateSpuInfo',
    // 追加一个新的SKU接口:/admin/product/saveSkuInfo
    ADDSKU_URL = '/admin/product/saveSkuInfo',
    // 获取SKU列表接口:/admin/product/findBySpuId/{spuId}，查看sku详情时需要
    LOOKSKU_URL = '/admin/product/findBySpuId/',
    // 删除SPU接口:DELETE_URL = '/admin/product/deleteSpu/{spuId}'
    REMOVESPU_URL = '/admin/product/deleteSpu/'

}
// 获取SPU信息接口:需要传递参数page,limit,category3Id,page代表当前页数,limit代表每页显示多少条数据,category3Id代表三级分类的id
export const reqHasSpu = (page: number, limit: number, category3Id: number | string) => request.get<any, HasSpuResponseData>(API.GETHASSPU_URL + `${page}/${limit}?category3Id=${category3Id}`)
// 获取全部品牌接口
export const reqAllTrademark = () => request.get<any, AllTRadeMark>(API.GETALLTRADEMARK_URL)
// 获取SPU图片接口:需要传递参数spuId    
export const reqSpuImageList = (spuId: number | string) => request.get<any, SpuImageResponseData>(API.GETSPUIMAGELIST_URL + spuId)
// 获取某个已有的SPU的销售属性接口
export const reqBaseSaleAttrList = (spuId: number | string) => request.get<any, SaleAttrResponseData>(API.GETBASESALEATTRLIST_URL + spuId)
// 获取全部销售属性接口：该处返回类型未定义，直接使用any
export const reqAllSaleAttrList = () => request.get<any, any>(API.GETALLSALEATTRLIST_URL)

// 新增SPU接口
export const reqAddSpu = (data: any) => request.post<any, any>(API.ADDSPU_URL, data)
// 更新SPU接口
export const reqUpdateSpu = (data: any) => request.post<any, any>(API.UPDATESPU_URL, data)
// 追加一个新的SKU接口:保存
export const reqAddSku = (data: SkuData) => request.post<any, any>(API.ADDSKU_URL, data)
// 获取SKU列表接口
export const reqLookSku = (spuId: number | string) => request.get<any, LookSkuResponseData>(API.LOOKSKU_URL + spuId)
// 删除SPU接口
export const reqRemoveSpu = (spuId: number | string) => request.delete<any, any>(API.REMOVESPU_URL + spuId)