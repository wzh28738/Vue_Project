// 用户管理接口
import request from '../../..//utils/request'
import type { UserResponseData, User,UserByIdResponseData,AllRolesResponseData, AssignRolesData } from './type'

enum API {
    // 获取已有的用户信息：/admin/acl/user/{page}/{limit}
    GET_USERS_URL = '/admin/acl/user/',
    // 添加用户信息：/admin/acl/user/save
    ADD_USER_URL = '/admin/acl/user/save',
    // 编辑用户信息：/admin/acl/user/update
    UPDATE_USER_URL = '/admin/acl/user/update',
    // 根据用户id获取用户信息：/admin/acl/user/get/{id}
    GET_USER_BYID_URL = '/admin/acl/user/get/',
    // 根据用户id获取角色信息：/admin/acl/user/toAssign/{adminId}
    GET_ROLE_BYID_URL = '/admin/acl/user/toAssign/',
    // 根据用户id给用户分配角色：/admin/acl/user/doAssignRole
    ASSIGNROLE_URL = '/admin/acl/user/doAssignRole',
    // 根据用户id删除单个用户信息：/admin/acl/user/remove/{id}
    REMOVE_USER_BYID_URL = '/admin/acl/user/remove/',
    // 根据用户id批量删除用户信息：/admin/acl/user/batchRemove
    BATCH_REMOVE_USER_BYID_URL = '/admin/acl/user/batchRemove'
}

// 获取已有的用户信息接口
export const reqUserInfo = (page: number, limit: number,username:string) => request.get<any, UserResponseData>(API.GET_USERS_URL + `${page}/${limit}/?username=${username}`)
// 添加用户信息接口
export const reqAddUser = (data: User) => request.post<any, any>(API.ADD_USER_URL, data)
// 编辑用户信息接口
export const reqUpdateUser = (data: User) => request.put<any, any>(API.UPDATE_USER_URL, data)
// 根据用户id获取用户信息接口
export const reqGetUserById = (id: number) => request.get<any, UserByIdResponseData>(API.GET_USER_BYID_URL + id)
// 根据用户id获取角色信息接口
export const reqGetRoleById = (id: number) => request.get<any, AllRolesResponseData>(API.GET_ROLE_BYID_URL + id)
// 根据用户id给用户分配角色接口 
export const reqAssignRole = (data: AssignRolesData) => request.post<any, any>(API.ASSIGNROLE_URL, data)
// 根据用户id删除用户信息接口
export const reqRemoveUserById = (id: number) => request.delete<any, any>(API.REMOVE_USER_BYID_URL + id)
// 根据用户id批量删除用户信息接口
export const reqBatchRemoveUserById = (ids: number[]) => request.delete<any, any>(API.BATCH_REMOVE_USER_BYID_URL, {data: ids})


