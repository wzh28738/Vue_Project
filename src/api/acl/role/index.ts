// 角色管理接口

import request from '../../../utils/request'
import type { roleResponseData, roleObj, permissionResponse } from './type'

enum API {
    // 获取角色列表:/admin/acl/role/{page}/{limit}
    ROLE_LIST = '/admin/acl/role/',
    // 添加角色:/admin/acl/role/save
    ADD_ROLE = '/admin/acl/role/save',
    // 编辑角色:/admin/acl/role/update
    UPDATE_ROLE = '/admin/acl/role/update',
    // 根据角色id删除单个角色：/admin/acl/role/remove/{id}
    REMOVE_ROLE = '/admin/acl/role/remove/',
    // 根据id给角色分配权限:/admin/acl/permission/doAssign
    ASSIGN_PERMISSION = '/admin/acl/permission/doAssign/?',
    // 根据id获取用户已拥有的权限:/admin/acl/permission/toAssign/{roleId}
    GET_ASSIGNED_PERMISSION = '/admin/acl/permission/toAssign/'

}
// 获取角色列表
export const reqRoleList = (page: number, limit: number,roleName:string) => request.get<any, roleResponseData>(API.ROLE_LIST + `${page}/${limit}/?roleName=${roleName}`)
// 添加角色
export const reqAddRole = (data: roleObj) => request.post<any, any>(API.ADD_ROLE, data)
// 编辑角色
export const reqUpdateRole = (data: roleObj) => request.put<any, any>(API.UPDATE_ROLE, data)
// 根据角色id删除单个角色
export const reqRemoveRole = (id: number) => request.delete<any, any>(API.REMOVE_ROLE + id)
// 根据id给角色分配权限
export const reqAssignPermission = (roleId:number, permissionIdList:number[]) => request.post<any, any>(API.ASSIGN_PERMISSION+`roleId=${roleId}&permissionId=${permissionIdList}`)
// 根据id获取用户已拥有的权限
export const reqGetAssignedPermission = (roleId: number) => request.get<any, permissionResponse>(API.GET_ASSIGNED_PERMISSION + roleId)
