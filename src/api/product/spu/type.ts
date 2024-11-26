/* 服务器返回的数据类型 */

export interface ResponseData {
    code: number,
    message: string,
    ok: boolean,
}
// spu数据类型
export interface SpuData {
    id?: number,
    spuName: string,
    description: string,
    category3Id: number | string,
    tmId: number,
    spuSaleAttrList: any,
    spuImageList: any,
}
// 数组：spu数据类型
export type Records = SpuData[]
// 获取已经有的SPU数据的类型
export interface HasSpuResponseData extends ResponseData {
    data: {
        records: Records,
        total: number,
        size: number,
        current: number,
        pages: number,
        searchCount: boolean,
    }
}

// 品牌数据类型
export interface Trademark {
    id: number,
    tmName: string,
    logoUrl: string,
}
// 品牌接口返回的数据类型
export interface AllTRadeMark extends ResponseData {
    data: Trademark[]
}

// 商品图片的数据类型
export interface SpuImage {
    id: number,
    imgName?: string,
    imgUrl?: string,
    spuId: number,
    createTime: string,
    updateTime: string,
    name?: string,
    url?: string
}
// 获取商品图片返回的数据类型
export interface SpuImageResponseData extends ResponseData {
    data: SpuImage[]
}

// 销售属性的数据类型
export interface SaleAttr {
    id?: number,
    saleAttrValueName: string,
    baseSaleAttrId: number | string,
    createTime?: null,
    updateTime?: null,
    spuId?: number,
    saleAttrName?: string,
    isCheck?: null,
}
// 存储已有的销售属性的数据类型数组
export type SpuSaleAttrList = SaleAttr[]
// 销售属性对象的数据类型
export interface SaleAttrObj {
    id?: number,
    baseSaleAttrId: number | string,
    saleAttrName: string,
    spuId?: number,
    spuSaleAttrValueList: SpuSaleAttrList,
    createTime?: null,
    updateTime?: null,
    flag?: boolean,
    newSaleAttrValue?: string,
}
// 获取已有的销售属性返回的数据类型
export interface SaleAttrResponseData extends ResponseData {
    data: SaleAttrObj[]
}


// 获取SKU请求接口reqAddSku需要传入的data类型
export interface SkuData {
    category3Id: number | string,// 三级分类id
    spuId: number | string,// 已有的spuId
    tmId: number | string,// SPU品牌id
    skuName: string,// sku名称 
    price: number | string,// 价格
    weight: number | string
    // 平台属性
    skuAttrValueList?: [
        {
            attrId: number | string,
            valueId: number | string,
        }
    ],
    skuDefaultImg: string,// SKU图片地址
    skuDesc: string,
    // 销售属性
    skuSaleAttrValueList?: [
        {
            saleAttrId: number | string,
            saleAttrValueId: number | string,
        }
    ],

}

// 查看SKU数据reqLookSku接口的返回值
export interface LookSkuResponseData extends ResponseData {
    data:SkuData[]
}