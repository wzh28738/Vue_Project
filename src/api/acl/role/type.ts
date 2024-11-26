// 角色管理ts类型

// 角色列表共有类型
export interface shareResponseData {
    code: number,
    message: string,
    ok: boolean
}
// 角色列表中records数组中对象的类型
export interface roleObj {
    id?: number,
    createTime?: null,
    updateTime?: null,
    roleName: string,
    remark?: null
}
// 角色列表中records数组类型
export type records = roleObj[]
// 角色列表中data对象类型
export interface dataObj {
    records: records,
    total: number,
    size: number,
    current: number,
    orders: [],
    optimizeCountSql: boolean,
    hitCount: boolean,
    countId: null,
    maxLimit: null,
    searchCount: boolean,
    pages: number
}
// 角色列表返回的全部数据类型
export interface roleResponseData extends shareResponseData {
    data: dataObj
}

// 根据角色id分配菜单权限接口需要的参数类型
export interface assignPermissionParams {
    permissionIdList: number[],
    roleId: number
}

// 根据角色id获取该角色拥有的菜单权限接口返回的data的数据类型
export interface permissionData {
    id: number,
    createTime: null,
    updateTime: null,
    pid: number,
    name: string,
    code: number,
    toCode: null,
    type: number,
    status: null,
    level: number,
    children?: permissionData[],
    select: boolean
}

// 根据角色id获取该角色拥有的菜单权限接口返回的全部数据类型
export interface permissionResponse {
    code: number,
    message: string,
    ok: boolean,
    data: permissionData[]
}
