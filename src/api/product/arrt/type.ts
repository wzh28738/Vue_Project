// 分类数据的ts类型

// 各个分类返回的相同数据类型
export interface ResponseData {
    code: number,
    message: string,
    ok: boolean,
}

// 各分类的数据类型
export interface CategoryData {
    id: number | string,
    name: string,
    // 二级分类需要的数据类型
    category1Id?: number,
    // 三级分类需要的数据类型
    category2Id?: number,
}

// 分类返回数据的全部类型
export interface CategoryResponseData extends ResponseData {
    data: CategoryData[]
}


export interface Attrvalue {
    id?: number,
    valueName: string,
    attrId?: number
}
export type AttrValueList = Attrvalue[];
export interface Attr{
    id?: number,
    attrName: string,
    categoryId: number | string,
    categoryLevel: number,
    attrValueList: AttrValueList
}
export type AttrList = Attr[];
// 属性返回数据的全部类型
export interface AttrResponseData extends ResponseData {
    data: Attr[]
}