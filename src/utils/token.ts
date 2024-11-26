// 封装本地存储数据与读取数据方法

// 保存token到本地存储中
export const SET_TOKEN = (token: string) => {
    // 将token保存到本地存储中，保证刷新页面后，token不会丢失
    localStorage.setItem('TOKEN', token)
}

// 获取本地存储中的token
export const GET_TOKEN = () => {
     // localStorage.getItem('TOKEN')可以获取到本地存储中的token，保证刷新页面后，token不会丢失
    return localStorage.getItem('TOKEN')
}

// 清除本地存储中的token
export const REMOVE_TOKEN = () => {
    // localStorage.removeItem('TOKEN')可以清除本地存储中的token
}