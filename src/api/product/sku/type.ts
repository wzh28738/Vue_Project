export interface ResponseData {
    code: number;
    message: string;
    ok: boolean;
}

// 获取sku信息返回的数据中的data类型
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
            valueName?: string,// 平台属性值名称
            attrId: number | string,
            valueId: number | string,
        }
    ],
    skuDefaultImg: string,// SKU图片地址
    skuDesc: string,
    // 销售属性
    skuSaleAttrValueList?: [
        {
            saleAttrValueName?: string,// 销售属性值名称
            saleAttrId: number | string,
            saleAttrValueId: number | string,
        }
    ],
    id?: number | string
    skuImageList?: [
        { 
            imgUrl: string, 
        }
    ]


}

// 获取SKU返回的数据类型
export interface SkuResponseData extends ResponseData {
    data: {
        records: SkuData[],
        total: number,
        size: number | string,
        current: number | string,
        pages: number | string,
        orders: [],
        optimizeCountSql: boolean,
        hitCount: boolean,
        searchCount: boolean,
        countId: null,
        maxLimit: null,
    }
}

// 根据skuId获取sku信息返回的数据类型
export interface SkuByIdResponseData extends ResponseData {
    data: SkuData
}
