// 属性管理模块的接口
import request from '../../../utils/request'
// 导入接口的返回值类型
import type { CategoryResponseData,AttrResponseData,Attr } from './type'

enum API {
    // 一级分类接口 '/admin/product/getCategory1'
    GETCATEGORY1_URL = '/admin/product/getCategory1',
    // 二级分类接口 '/admin/product/getCategory2/{category1Id}'
    GETCATEGORY2_URL = '/admin/product/getCategory2/',
    // 三级分类接口 '/admin/product/getCategory3/{category2Id}'
    GETCATEGORY3_URL = '/admin/product/getCategory3/',
    // 获取属性列表接口 /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
    GETATTRINFOLIST_URL = '/admin/product/attrInfoList',
    // 添加或者更新属性接口 /admin/product/saveAttrInfo
    ADDORUPDATAATTTR_URL = '/admin/product/saveAttrInfo',
    // 删除属性接口 /admin/product/deleteAttr/{attrId}
    DELETEATTR_URL = '/admin/product/deleteAttr/'
}


export const reqCategory1 = () => request.get<any, CategoryResponseData>(API.GETCATEGORY1_URL)
export const reqCategory2 = (category1Id: number | string) => request.get<any, CategoryResponseData>(API.GETCATEGORY2_URL + category1Id)
export const reqCategory3 = (category2Id: number | string) => request.get<any, CategoryResponseData>(API.GETCATEGORY3_URL + category2Id)
// 获取对应分类下已有的属性列表
export const reqAttrInfoList = (category1Id: number | string, category2Id: number | string, category3Id: number | string) => request.get<any, AttrResponseData>(API.GETATTRINFOLIST_URL + `/${category1Id}/${category2Id}/${category3Id}`)
export const reqAddOrUpdataAttr = (data: Attr) => request.post<any, any>(API.ADDORUPDATAATTTR_URL, data)
export const reqDeleteAttr = (attrId: number | string) => request.delete<any, any>(API.DELETEATTR_URL + attrId)
