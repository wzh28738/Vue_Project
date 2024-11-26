// 获取全部菜单的result中的data类型
export interface menuData {
    id: number;
    createTime: null;
    updateTime: null;
    pid: number;
    name: string;
    code: number;
    toCode: null;
    type: number;
    status: null;
    level: number;
    children?: [];
    select: boolean;
}
// 获取全部菜单接口返回的数据类型
export interface menuResponse {
    code: number,
    message: string,
    ok: boolean,
    data: menuData[]
}
// 添加与修改菜单接口传入参数的数据类型
export interface addOrUpdateMenuParams {
    id?: number,// 新增时不需要
    pid: number,// 菜单id
    name: string,// 菜单名称
    code: string,// 权限数值
    level: number,// 几级菜单
}