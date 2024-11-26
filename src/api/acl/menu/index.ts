// 菜单管理接口

import request from '../../../utils/request'
import { menuResponse, addOrUpdateMenuParams } from "./type";

enum API {
    // 获取全部的菜单数据：/admin/acl/permission
    GET_ALL_MENU = '/admin/acl/permission',
    // 添加菜单：/admin/acl/permission/save
    ADD_MENU = '/admin/acl/permission/save',
    // 修改菜单：/admin/acl/permission/update
    UPDATE_MENU = '/admin/acl/permission/update',
    // 删除菜单：/admin/acl/permission/remove/{id}
    REMOVE_MENU = '/admin/acl/permission/remove/'

}
// 获取全部的菜单数据
export const reqALLMenu = () => request.get<any, menuResponse>(API.GET_ALL_MENU)
// 添加或修改菜单
export const reqAddOrUpdateMenu = (menuParams: addOrUpdateMenuParams) => {
    if (menuParams.id) {
        return request.put<any, any>(API.UPDATE_MENU, menuParams)
    } else {
        return request.post<any, any>(API.ADD_MENU, menuParams)
    }

}
// 删除菜单
export const reqRemoveMenu = (id: number) => request.delete<any, any>(API.REMOVE_MENU + id)