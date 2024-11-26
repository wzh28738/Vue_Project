// 该函数执行时返回一个数组，数组中包含两个用户信息
function createUserList() {
    return [
        {
            userId: 1,
            avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
            username: 'admin',
            password: '111111',
            desc: '平台管理员',
            roles: ['平台管理员'],
            buttons: ['cuser.detail'],
            routes: ['home'],
            token: ['Admin Token'],
        },
        {
            userId: 2,
            avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
            username: 'system',
            password: '111111',
            desc: '系统管理员',
            roles: ['系统管理员'],
            buttons: ['cuser.detail', 'cuser.user'],
            routes: ['home'],
            token: ['Admin Token'],
        }
    ]
}

//暴露一个数组，数组中包含两个接口，登录接口和获取用户信息接口
export default [
    //用户登录接口
    {
        url: '/api/user/login',//请求地址
        method: 'post',//请求方式
        response: ({ body }) => {
            //获取请求体中的用户名和密码
            const { username, password } = body;
            //根据用户名和密码查询用户信息
            const userList = createUserList();
            const checkUser = userList.find(item => item.username === username && item.password === password);
            //如果没有查询到用户信息返回错误信息
            if (!checkUser) {
                return { code: 201, data: { message: '用户名或密码错误' } }
            }
            //如果查询到用户信息返回用户信息
            const { token } = checkUser
            return { code: 200, data: { token } }
        }
    },

    //获取用户信息接口
    {
        url: '/api/user/info',
        method: 'get',
        response: (request) => {
            //获取请求参数中的token
            const token = request.headers.token;
            //根据token查询用户信息
            const userList = createUserList();
            const checkUser = userList.find(item => item.token == token);
            //如果没有，返回错误信息
            if (!checkUser) {
                return { code: 201, data: { message: '账号或密码错误' } }
            }
            //如果有返回成功信息
            return { code: 200, data: { checkUser } }
        }
    }
]