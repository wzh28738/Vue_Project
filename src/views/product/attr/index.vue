<template>
    <div>
        <!--三级分类卡片组件-->
        <Category />
        <!--属性详情卡片-->
        <el-card class="table_card">
            <div class="card_div">
                <!--当useCategoryStore仓库中有c3Id时，才可以添加数据-->
                <el-button @click="isDialogVisible = true; clearDate()" class="card_bt" :disabled="0" icon="Plus"
                    type="primary">
                    添加属性
                </el-button>
                <!--添加属性对话框-->
                <el-dialog class="card_dialog" v-model="isDialogVisible" title="添加属性" width="70%" center>
                    <div class="card_dialog_div">
                        <!--表单-->
                        <el-form class="card_dialog_div_form">
                            <el-form-item label="属性名">
                                <el-input v-model="addAttr.attrName" placeholder="请输入属性名" width="150px"></el-input>
                            </el-form-item>
                            <!--按钮-->
                            <el-form-item>
                                <div class="dialog_form_item_div">
                                    <el-button :disabled="!addAttr.attrName" @click="addAttrList" icon="Plus"
                                        type="primary">
                                        添加属性值
                                    </el-button>
                                    <el-button icon="Close">
                                        取消
                                    </el-button>
                                </div>
                            </el-form-item>
                        </el-form>
                        <!--表格-->
                        <el-table border stripe :data="addAttr.attrValueList">
                            <el-table-column type="index" label="序号"></el-table-column>
                            <el-table-column label="属性值">
                                <template #default="scope">
                                    <el-input v-model="scope.row.valueName" placeholder="请输入属性值"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作">
                                <template #default="scope">
                                    <el-button @click="removeAttrList(scope.$index)" size="small" icon="Delete"
                                        type="danger">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="card_dialog_btdiv">
                            <el-button :disabled="!addAttr.attrName" @click="saveAttr" type="primary"
                                icon="Check">保存</el-button>
                            <el-button @click="isDialogVisible = false" icon="Close">取消</el-button>
                        </div>
                    </div>

                </el-dialog>
            </div>
            <!--属性详情表格-->
            <el-table border stripe :data="attrList" style="width: 100%">
                <el-table-column type="index" label="序号" width="80px" align="center" />
                <el-table-column prop="attrName" label="属性名" width="80px" />
                <!--里面存了tag标签-->
                <el-table-column label="属性值">
                    <!--作用域插槽，scope.row代表当前行的数据-->
                    <template #default="scope">
                        <!--el-tag为小标签组件-->
                        <el-tag style="margin: 5px;" v-for="(item, index) in scope.row.attrValueList" :key="item.id"
                            type="success">
                            {{ item.valueName }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="categoryLevel" label="操作" width="80px">
                    <template #default="scope">
                        <el-button @click="editAttr(scope.row)" size="small" type="primary" icon="Edit">编辑</el-button>
                        <el-popconfirm :title="`确定要删除${scope.row.attrName}吗？`" @confirm="deleteAttr(scope.row.id)">
                            <template #reference>
                                <el-button size="small" type="danger" icon="Delete">
                                    删除
                                </el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script setup lang='ts' name='attr'>
import { useCategoryStore } from '../../../store/modules/category'
import { reqAttrInfoList, reqAddOrUpdataAttr, reqDeleteAttr } from '../../../api/product/arrt/index'
import { reactive, ref, watch, onBeforeUnmount } from 'vue'
import type { AttrResponseData, Attr } from '../../../api/product/arrt/type'
import { ElMessage } from 'element-plus'

const categoryStore = useCategoryStore();
// 定义一个响应式变量attrList，用于存储属性列表
let attrList = ref<Attr[]>([])
// 控制对话框的显示与隐藏
let isDialogVisible = ref(false)
// 用于存储添加的属性值
let addAttr = reactive<Attr>({
    attrName: "",// 新增的属性名
    attrValueList: [],// 新增的属性值列表
    categoryId: '',//三级分类id
    categoryLevel: 3,//三级分类
})

// 监听c3Id的变化，当c3Id发生变化时，发送请求获取数据
watch(() => categoryStore.c3Id, async (newVal) => {
    // 清空attrList数据，防止切换分类时，数据残留
    attrList.value = []
    // 如果newVal存在
    if (newVal) {
        // 从categoryStore中解构出c1Id, c2Id, c3Id
        let { c1Id, c2Id, c3Id } = categoryStore
        // 调用reqAttrInfoList函数，传入c1Id, c2Id, c3Id，并将返回值赋给result
        let result: AttrResponseData = await reqAttrInfoList(c1Id, c2Id, c3Id)
        if (result.code == 200) {
            // 将返回的属性列表赋值给attrList
            attrList.value = result.data
        }
    }
})
// 当页面销毁前，清空仓库中的addAttr数据
onBeforeUnmount(() => {
    // 清空仓库中的addAttr数据
    categoryStore.$reset()
})
// 用于清空数据，防止数据残留
const clearDate = () => {
    // 清空addAttr，防止数据残留
    Object.assign(addAttr, {
        attrName: "",// 新增的属性名
        attrValueList: [ // 新增的属性值列表
        ],
        categoryId: '',//三级分类id
        categoryLevel: 3,//三级分类
    })
}
// 点击添加属性值按钮，增加一行输入框
const addAttrList = () => {
    // 添加属性值按钮，增加一行输入框
    addAttr.attrValueList.push({
        valueName: ''
    })
}
// 点击删除属性值按钮，删除当前行输入框
const removeAttrList = (index: number) => {
    addAttr.attrValueList.splice(index, 1)
}
// 点击保存按钮，保存属性值
const saveAttr = async () => {

    // 收集数据，发送请求
    // 收集id
    addAttr.categoryId = categoryStore.c3Id
    // 发送请求
    let result = await reqAddOrUpdataAttr(addAttr)
    // 添加或者修改成功
    if (result.code == 200) {
        // 关闭对话框
        isDialogVisible.value = false
        ElMessage({
            type: 'success',
            message: addAttr.id ? '修改成功' : '添加成功'
        })
        // 重新获取属性列表
        let { c1Id, c2Id, c3Id } = categoryStore
        let result: AttrResponseData = await reqAttrInfoList(c1Id, c2Id, c3Id)
        if (result.code == 200) {
            // 将返回的属性列表赋值给attrList
            attrList.value = result.data
        }
    } else {
        ElMessage({
            type: 'error',
            message: addAttr.id ? '修改失败' : '添加失败'
        })
    }
}
// 点击编辑按钮，编辑属性值
const editAttr = (row: Attr) => {
    // 打开对话框
    isDialogVisible.value = true
    // 将当前行的数据赋值给addAttr，使用深拷贝JSON.parse(JSON.stringify(row))，防止【修改数据后点击的是取消，没有保存修改的数据时，导致页面数据变化，而数据库中的数据没有变化】
    Object.assign(addAttr, JSON.parse(JSON.stringify(row)))

}
// 删除按钮:删除一个已有属性的属性值
const deleteAttr = async (attrId: number) => {
    // 发送请求
    let result = await reqDeleteAttr(attrId)
    // 删除成功
    if (result.code == 200) {
        ElMessage({
            type: 'success',
            message: '删除成功'
        })
        // 重新获取属性列表
        let { c1Id, c2Id, c3Id } = categoryStore
        let result: AttrResponseData = await reqAttrInfoList(c1Id, c2Id, c3Id)
        if (result.code == 200) {
            // 将返回的属性列表赋值给attrList
            attrList.value = result.data
        }
    } else {
        ElMessage({
            type: 'error',
            message: '删除失败'
        })
    }
}
</script>

<style lang='scss'>
.table_card {
    margin-top: 20px;

    .card_div {
        display: flex;
        justify-content: flex-end;

    }

    .card_bt {
        margin-bottom: 20px;
        margin-right: 20px;
    }

    .card_dialog {
        display: flex;
        flex-direction: column;

        .card_dialog_div {
            width: 100%;

            .card_dialog_div_form {
                width: 30%;
                margin-left: 32%;
            }

            .card_dialog_btdiv {
                width: 100%;
                display: flex;
                justify-content: flex-end;
                margin-top: 15px;
                padding-right: 20px;

            }
        }
    }
}

.dialog_form_item_div {
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding: 0px 50px;
}
</style>