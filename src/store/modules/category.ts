/* 分类组件的小仓库 */

import { defineStore } from 'pinia'
// 引入接口
import { reqCategory1, reqCategory2, reqCategory3 } from '../../api/product/arrt'
import type { CategoryResponseData } from '../../api/product/arrt/type'
import type { CategoryState } from './types/type'

export const useCategoryStore = defineStore('category', {
    state: (): CategoryState => {
        return {
            // 分类数据
            Category1List: [],
            // 一级分类的选中项的id
            c1Id: '',
            Category2List: [],
            // 二级分类的选中项的id
            c2Id: '',
            Category3List: [],
            // 三级分类的选中项的id
            c3Id: ''
        }
    },
    actions: {
        // 获取一级分类数据
        async getCategory1() {
            const result: CategoryResponseData = await reqCategory1()
            if (result.code === 200) {
                this.Category1List = result.data
            }
        },
        // 获取二级分类数据
        async getCategory2() {
            // 清空二级分类和三级分类的数据，因为一级分类改变时，二级分类和三级分类应该重新获取
            this.c2Id = '';
            this.c3Id = '';
            this.Category3List = [];
            // 获取二级分类数据
            const result: CategoryResponseData = await reqCategory2(this.c1Id)
            if (result.code === 200) {
                this.Category2List = result.data
            }
        },
        // 获取三级分类数据
        async getCategory3() {
            // 清空三级分类的数据，因为二级分类改变时，三级分类应该重新获取
            this.c3Id = '';
            // 获取三级分类数据
            const result: CategoryResponseData = await reqCategory3(this.c2Id)
            if (result.code === 200) {
                this.Category3List = result.data
            }
        }
    }
})