<template>
    <el-table :data="menuList" row-key="id" border>
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="code" label="权限值"></el-table-column>
        <el-table-column prop="updateTime" label="修改时间"></el-table-column>
        <el-table-column label="操作">
            <template #default="{ row }">
                <!--level为1是根节点，不能编辑或删除；level为4时没有子节点的，不能添加-->
                <el-button @click="addOrEdit(row, '添加菜单')" v-if="row.level != 4" type="primary"
                    size="small">添加菜单</el-button>
                <el-button @click="addOrEdit(row, '编辑菜单')" v-if="row.level != 1" type="primary"
                    size="small">编辑</el-button>
                <el-popconfirm title="确定删除吗？" @confirm="removeMenu(row.id)" v-if="row.level != 1">
                    <template #reference>
                        <el-button v-if="row.level != 1" type="danger" size="small">删除</el-button>
                    </template>
                </el-popconfirm>
            </template>
        </el-table-column>
    </el-table>
    <!--添加或更新已有的菜单对话框-->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="40%" center>
        <el-form label-width="65px">
            <el-form-item label="名称">
                <el-input v-model="menuParams.name" placeholder="请输入名称"></el-input>
            </el-form-item>
            <el-form-item label="权限值">
                <el-input v-model="menuParams.code" placeholder="请输入权限值"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="dialogConfirm">确定</el-button>
            </span>
        </template>

    </el-dialog>
</template>

<script setup lang='ts' name='perimission'>
import { ref, onMounted, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { reqALLMenu, reqAddOrUpdateMenu, reqRemoveMenu } from '../../../api/acl/menu'
import type { menuResponse, menuData, addOrUpdateMenuParams } from '../../../api/acl/menu/type'

// 初始化时获取全部菜单的容器
let menuList = ref<menuData[]>([])
let dialogVisible = ref<boolean>(false)
// 添加或编辑菜单接口需要的参数
let menuParams = reactive<addOrUpdateMenuParams>({
    pid: 0,
    name: '',
    code: '',
    level: 0,
})
// 对话框标题
let dialogTitle = ref<string>('')


// 获取全部菜单
const getAllMenu = async () => {
    const result: menuResponse = await reqALLMenu()
    if (result.code == 200) {
        menuList.value = result.data
    } else {
        ElMessage.error(result.message)
    }
}
// 添加或编辑菜单按钮
const addOrEdit = (row: menuData, title: string) => {
    // 清空参数
    Object.assign(menuParams, {
        pid: 0,
        name: '',
        code: '',
        level: 0,
    })
    dialogTitle.value = title
    dialogVisible.value = true

    if (title == '添加菜单') {
        // 收集新增的菜单的level值：父节点的level+1，
        menuParams.level = row.level + 1
        // 为谁设置子菜单，就收集谁的id
        menuParams.pid = row.id
    } else {
        Object.assign(menuParams, row)
    }

}
// 对话框确定按钮
const dialogConfirm = async () => {
    let result: any = await reqAddOrUpdateMenu(menuParams)
    if (result.code == 200) {
        dialogVisible.value = false
        ElMessage.success({ type: 'success', message: menuParams.id ? '更新成功' : '添加成功' })
        getAllMenu()
    } else {
        ElMessage.error({ type: 'wanring', message: menuParams.id ? '更新失败' : '添加失败' })
    }
}
// 删除菜单按钮
const removeMenu = async (id: number) => {
    let result: any = await reqRemoveMenu(id)
    console.log(result,id)
    if (result.code == 200) {
        ElMessage.success('删除成功')
        getAllMenu()
    } else {
        ElMessage.error('删除失败')
    }
}
onMounted(async () => {
    // 挂载完毕时，获取所有菜单
    getAllMenu()
})
</script>

<style lang='scss'></style>