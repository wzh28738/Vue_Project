// 统一管理用户相关的接口

/* 一.以下使用的是mock假数据
import request from "../../utils/request";
import type { loginForm, loginResponseData, userResponseData } from "./type";
// 接口
enum API {
    LOGIN_URL = "/user/login",
    USERINFO_URL = "/user/info",
}
// 登录接口方法
const reqLogin = (data: loginForm) => request.post<any, loginResponseData>(API.LOGIN_URL, data);
// 获取用户信息接口方法
const reqUserInfo = () => request.get<any, userResponseData>(API.USERINFO_URL);

export { reqLogin, reqUserInfo };*/


// 二.以下使用的是真实接口
import request from "../../utils/request";
// 用户相关接口
enum API {
    LOGIN_URL = "/admin/acl/index/login",
    USERINFO_URL = "/admin/acl/index/info",
    LOGOUT_URL = "/admin/acl/index/logout"
}

// 登录接口方法
export const reqLogin = (data: any) => request.post<any, any>(API.LOGIN_URL, data);
// 获取用户信息接口方法
export const reqUserInfo = () => request.get<any, any>(API.USERINFO_URL);
// 退出登录接口方法
export const reqLogout = () => request.post<any, any>(API.LOGOUT_URL);