// 账号信息的类型

// 共有ts类型
export interface ResponseData {
    code: number,
    message: string,
    ok: boolean,
}
// 一个账号的ts类型
export interface User {
    id?: number,
    createTime?: string,
    updateTime?: string,
    username: string,
    password?: string,
    name: string,
    phone?: string,
    roleName?: string,
}
// 全部的用户信息数据的ts类型
export type Records = User[]
// 获取全部用户信息数据的全部ts类型
export interface UserResponseData extends ResponseData {
    data: {
        records: Records,
        total: number,
        size: number,
        current: number,
        pages: number,
    }
}
// 根据用户id获取用户信息返回的ts类型
export interface UserByIdResponseData extends ResponseData {
    data: User
}

// 一个职位的ts类型 
export interface RoleData {
    id?: number,
    createTime?: string,
    updateTime?: string,
    roleName: string,
    remark?: null,
}
// 全部职位信息的ts类型
export type AllRoles = RoleData[]
// 获取全部职位信息返回的ts类型
export interface AllRolesResponseData extends ResponseData {
    data: {
        assignRoles: AllRoles,
        allRolesList: AllRoles,
    }
}

// 给用户分配角色接口需要的data参数ts类型
export interface AssignRolesData {
    userId: number,
    roleIdList: number[]
}
