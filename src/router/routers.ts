// 页面所有的路由

// 对外暴露配置路由(常量路由)
export const constantRouter = [
    // 登录页面
    {
        path: '/login',
        name: 'login',// 命名路由
        component: () => import('../views/login/index.vue'),
        meta: {
            title: '登录',// 菜单显示的标题
            hidden: true,// 是否显示在菜单中
            icon: 'Userfilled',// 菜单图标,使用了element-plus的图标
        }
    },
    // 登陆成功后的首页
    {
        path: '/',// 根路径
        name: 'layout',
        component: () => import(('../layout/index.vue' as any)),
        redirect: '/home',// 重定向,当访问根路径时,自动跳转到其子页面home页面
        meta: {
            title: 'layout',
            hidden: false,// 是否在菜单中隐藏
            icon: 'House',
        },
        // 子路由   
        children: [
            {
                // 首页
                path: '/home',
                name: 'home',
                component: () => import('../views/home/index.vue'),
                meta: {
                    title: '首页',// 菜单显示的标题
                    hidden: false,
                    icon: 'House',
                }
            },
        ]
    },
    // 404页面
    {
        path: '/404',
        name: '404',
        component: () => import('../views/404/index.vue'),
        meta: {
            title: '404',
            hidden: true,
            icon: 'QuestionFilled',
        }
    },
    // 大屏页面
    {
        path: '/screen',
        name: 'screen',
        component: () => import('../views/screen/index.vue'),
        meta: {
            title: '数据大屏',
            hidden: false,
            icon: 'DataBoard',
        }
    },
    // 权限管理菜单页面
    {
        path: '/acl',
        name: 'acl',
        component: () => import(('../layout/index.vue' as any)),
        redirect: '/acl/user',
        meta: {
            title: '权限管理',
            hidden: false,
            icon: 'Lock',
        },
        children: [
            // 用户管理页面
            {
                path: '/acl/user',
                name: 'user',
                component: () => import('../views/acl/user/index.vue'),
                meta: {
                    title: '用户管理',
                    hidden: false,
                    icon: 'User',
                }
            },
            // 角色管理页面
            {
                path: '/acl/role',
                name: 'role',
                component: () => import('../views/acl/role/index.vue'),
                meta: {
                    title: '角色管理',
                    hidden: false,
                    icon: 'Avatar',
                }
            },
            // 菜单管理页面
            {
                path: '/acl/permission',
                name: 'permission',
                component: () => import('../views/acl/permission/index.vue'),
                meta: {
                    title: '菜单管理',
                    hidden: false,
                    icon: 'Operation',
                }
            },

        ]
    },
    // 商品管理菜单页面
    {
        path: '/product',
        name: 'product',
        component: () => import(('../layout/index.vue' as any)),
        redirect: '/product/trademark',
        meta: {
            title: '商品管理',
            hidden: false,
            icon: 'Goods',
        },
        children: [
            // 品牌管理页面
            {
                path: '/product/trademark',
                name: 'trademark',
                component: () => import('../views/product/trademark/index.vue'),
                meta: {
                    title: '品牌管理',
                    hidden: false,
                    icon: 'ShoppingTrolley',
                },
            },
            // 属性管理页面
            {
                path: '/product/attr',
                name: 'attr',
                component: () => import('../views/product/attr/index.vue'),
                meta: {
                    title: '属性管理',
                    hidden: false,
                    icon: 'Files',
                },
            },
            // SUP管理页面
            {
                path: '/product/spu',
                name: 'spu',
                component: () => import('../views/product/spu/index.vue'),
                meta: {
                    title: 'SUP管理',
                    hidden: false,
                    icon: 'Calendar',
                },
            },
            // SKU管理页面
            {
                path: '/product/sku',
                name: 'sku',
                component: () => import('../views/product/sku/index.vue'),
                meta: {
                    title: 'SKU管理',
                    hidden: false,
                    icon: 'Orange',
                },
            }
        ]
    },
    // 其他情况任意路由
    {

        path: '/:pathMatch(.*)*',
        // 路由重定向
        redirect: '/404',
        name: 'any',
        meta: {
            title: '任意路由',
            hidden: true,
            icon: 'QuestionFilled',
        }
    },

]