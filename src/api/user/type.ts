// 登录接口需要携带的参数ts类型
export interface loginForm {
    username: string,
    password: string
}

interface dataType {    
    token?: string,
    message?: string
}
// 登录接口返回的数据ts类型
export interface loginResponseData {
    code: number,
    data: dataType
}


interface userInfo {
    userId: number,
    avatar: string,
    username: string,
    password: string,
    desc: string,
    roles: string[],
    buttons: string[],
    routes: string[],
    token: string
}
interface user {
    checkUser:userInfo
}
// 定义服务器返回用户信息的ts类型
export interface userResponseData {
    code: number,
    data: user
}