import type { RouteRecordRaw } from 'vue-router'
import type { CategoryData } from '../../../api/product/arrt/type'

// 定义大仓库数据state类型
export interface RootState {
    user: UserState
    category: CategoryState
}

// 定义小仓库数据state类型
export interface UserState {
    token: string | null
    menuRoutes: RouteRecordRaw[]
    username: string
    avatar: string
}

// 定义category仓库数据state类型
export interface CategoryState {
    Category1List: CategoryData[],
    c1Id: number | string,
    Category2List: CategoryData[],
    c2Id: number | string,
    Category3List: CategoryData[],
    c3Id: number | string,
}