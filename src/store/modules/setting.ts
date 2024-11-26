// 小仓库，layout组件的设置
import { defineStore } from 'pinia'

export const useLayoutSettingStore = defineStore('SettingStore', {
    state: () => {
        return {
            isfold: false, // 是否折叠
            refresh: false, // 控制页面刷新
            isSettingDrawerShow: false // 控制设置抽屉的显示与隐藏
        }
    },
    actions: {
        // 修改折叠状态
        changeIcon() {
            this.isfold = !this.isfold
        },
        // 刷新页面
        refreshPage() {
            // 当点击刷新时，将layoutSettingStore中的refresh值取反，从而触发页面刷新
            this.refresh = !this.refresh
        },
        // 控制设置抽屉的显示与隐藏
        changeSettingDrawerShow() {
            console.log(this.isSettingDrawerShow)
            this.isSettingDrawerShow = !this.isSettingDrawerShow
        }
    }
})