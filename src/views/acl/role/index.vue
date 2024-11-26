<template>
    <!-- 顶部卡片 -->
    <el-card style="height: 80px;">
        <el-form :inline="true">
            <el-form-item label="角色名称：">
                <el-input v-model="searchRole" placeholder="请输入角色名称"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button :disabled="!searchRole" style="margin-left: 10px;" type="primary"
                    @click="search">搜索</el-button>
                <el-button @click="reset">重置</el-button>
            </el-form-item>
        </el-form>
    </el-card>
    <!-- 用户列表卡片 -->
    <el-card style="margin-top: 20px;">
        <el-button type="primary" @click="addOrEditRole('添加职位')">添加职位</el-button>
        <!--用户信息--><!-- @selection-change：当选择状态发生变化时触发-->
        <el-table :data="roleList" border style="margin-top: 20px;">
            <el-table-column type="index" label="序号" width="10" align="center"></el-table-column>
            <el-table-column prop="id" label="id" width="80"></el-table-column>
            <el-table-column prop="roleName" label="职位名称" width="150"></el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
            <el-table-column prop="updateTime" label="更新时间" width="180"></el-table-column>
            <el-table-column label="操作" align="center">
                <template #default="{ row }">
                    <el-button type="primary" size="small" @click="assignAcl(row)">分配权限</el-button>
                    <el-button type="warning" size="small" @click="addOrEditRole('编辑职位', row)">编辑</el-button>
                    <el-popconfirm title="确定要删除该职位吗？" @confirm="removeRole(row.id)">
                        <template #reference>
                            <el-button type="danger" size="small">删除</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <!--分页器-->
        <el-pagination @change="pageChange" background v-model:current-page="pageNo"
            layout="->,prev, pager, next, jumper, total" :total="total" :page-size="pageSize" style="margin: 10px;" />
    </el-card>
    <!-- 分配权限下拉菜单对话框 -->
    <el-drawer class="assign_drawer" title="分配权限" v-model="isAssignDrawerVisible">
        <template #default class="menu_div">
            <el-tree style="max-width: 600px" :data="assignPermissionList" show-checkbox node-key="id"
                default-expanded-all :default-checked-keys="selectedIdList" :props="defaultProps" ref="treeRef" />
        </template>
        <template #footer>
            <el-button @click="isAssignDrawerVisible = false">取 消</el-button>
            <el-button type="primary" @click="confirmAssignPermission">确 定</el-button>
        </template>

    </el-drawer>
    <!-- 添加或修改职位对话框 -->
    <el-dialog :title="dialogTitle" v-model="isAddDialogVisible" width="50%" center>
        <el-form>
            <el-form-item label="职位名称:">
                <el-input v-model="roleAdd.roleName" placeholder="请输入职位名称"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="isAddDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addConfirm">确 定</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup lang='ts' name='role'>
import { ref, reactive, onMounted } from 'vue'
import { reqRoleList, reqAddRole, reqUpdateRole, reqRemoveRole, reqAssignPermission, reqGetAssignedPermission } from '../../../api/acl/role'
import { roleResponseData, records, roleObj, permissionResponse, permissionData } from '../../../api/acl/role/type';
import { ElMessage } from 'element-plus';

let pageNo = ref<number>(1);
let pageSize = ref<number>(5);
let total = ref<number>(0);
// 添加或修改对话框的标题
let dialogTitle = ref<string>('')
// 搜索角色容器
let searchRole = ref<string>('')
// 角色列表容器
let roleList = ref<records>([])
// 分配权限对话框显示状态
let isAssignDrawerVisible = ref<boolean>(false)
// 添加职位对话框显示状态
let isAddDialogVisible = ref<boolean>(false)
// 添加职位容器
let roleAdd = reactive<roleObj>({
    roleName: '',
})
// 树形控件需要展示的数据
const defaultProps = {
    children: 'children',
    label: 'name',
}
// 所有的权限参数容器
let assignPermissionList = ref<permissionData[]>([])
// 存储用户已被分配的权限参数id（只需要存储四级的id，当四级被勾选，它的上一级也会自动勾选）
let selectedIdList = ref<number[]>([])
// 获取树形控件的引用
let treeRef = ref<any>()

// 获取角色列表
const getRoleInfo = async (elMessage?: number) => {
    // 发送请求获取角色列表
    let result: roleResponseData = await reqRoleList(pageNo.value, pageSize.value, searchRole.value)
    // 成功时
    if (result.code == 200) {
        // 保存角色列表数据
        roleList.value = result.data.records
        total.value = result.data.total
        // elMessage为1时，表示搜索按钮被点击
        if (elMessage === 1) {
            if (roleList.value.length < 1) {
                ElMessage({
                    message: '没有该角色',
                    type: 'error',
                })
            } else {
                ElMessage({
                    message: '搜索成功',
                    type: 'success',
                })
            }

        }
        if (elMessage === 2) ElMessage({ message: '重置成功', type: 'success' })
    } else {//失败时
        if (elMessage == 1) ElMessage({ message: '搜索失败', type: 'error', })
        if (elMessage === 2) ElMessage({ message: '重置失败', type: 'success' })
    }
}
// 分页器切换
const pageChange = () => {
    getRoleInfo()
}
// 搜索按钮
const search = () => {
    let elMessage = 1
    getRoleInfo(elMessage)
}
// 重置按钮
const reset = () => {
    let elmessage = 2
    searchRole.value = ''
    getRoleInfo(elmessage)
}
// 添加或编辑职位按钮
const addOrEditRole = (title: string, row?: roleObj) => {
    // 根据title判断是添加还是编辑
    dialogTitle.value = title
    // 如果row存在，说明是编辑，展示对话框时，将row的值赋给roleAdd
    roleAdd.roleName = row ? row.roleName : ''
    roleAdd.id = row ? row.id : 0

    isAddDialogVisible.value = true
}
// 确认添加或编辑职位按钮
const addConfirm = async () => {
    // 有id为编辑，没有id为添加
    if (roleAdd.id) {
        let result1: any = await reqUpdateRole(roleAdd)
        if (result1.code == 200) {
            ElMessage({ message: '编辑成功', type: 'success' })
            // 清空表单
            roleAdd.id = 0
            roleAdd.roleName = ''
            isAddDialogVisible.value = false
            // 重新获取数据
            getRoleInfo()
        } else {
            ElMessage({ message: '编辑失败', type: 'error' })
        }
    } else { // 编辑
        let result2: any = await reqAddRole(roleAdd)
        if (result2.code == 200) {
            ElMessage({ message: '添加成功', type: 'success' })
            // 清空表单
            roleAdd.roleName = ''
            isAddDialogVisible.value = false
            // 重新获取数据
            getRoleInfo()
        } else {
            ElMessage({ message: '添加失败', type: 'error' })
        }
    }

}
// 删除单个职位按钮
const removeRole = async (id: number) => {
    let result: any = await reqRemoveRole(id)
    if (result.code == 200) {
        ElMessage({ message: '删除成功', type: 'success' })
        // 重新获取数据
        getRoleInfo()
    } else {
        ElMessage({ message: '删除失败', type: 'error' })
    }
}
// 过滤出被选中的四级权限id
const filterSelectedId = (needFilterData: permissionData[], idList: number[] = []) => {
    let filterIdList: number[] = idList

    // 递归遍历权限数据，将被选中的四级权限id进行返回
    needFilterData.forEach((item: permissionData) => {
        if (item.children && item.children.length > 0) {
            filterIdList = filterSelectedId(item.children, filterIdList)
        }
        if (item.select && item.level == 4) {
            filterIdList.push(item.id)
        }
    })

    return filterIdList
}
// 分配权限按钮
const assignAcl = async (row: roleObj) => {
    isAssignDrawerVisible.value = true
    // 存储当前职位的id，用于确认时传参
    roleAdd.id = row.id
    // 获取当前职位已被分配的权限
    let result: permissionResponse = await reqGetAssignedPermission(row.id as number)
    if (result.code == 200) {
        // 将返回的权限数据赋值给assignPermissionList
        assignPermissionList.value = result.data
        // 过滤出默认被选中的四级权限id
        selectedIdList.value = filterSelectedId(assignPermissionList.value)
    }
}
// 确认分配权限按钮
const confirmAssignPermission = async () => {
    // 获取当前职位的id
    const roleId = roleAdd.id as number
    // 获取当前职位被选中的权限id（tree组件上的getCheckedKeys方法可以直接拿到已被选择的权限的key,即id）
    const permissionIdList = treeRef.value.getCheckedKeys()
    // 给选中的职位添加权限
    let result: any = await reqAssignPermission(roleId, permissionIdList)
    if (result.code == 200) {
        // 关闭抽屉
        isAssignDrawerVisible.value = false
        ElMessage({ message: '分配权限成功', type: 'success' })
        // 刷新页面，更新权限之后，页面上的权限不会立即更新，需要刷新页面
        setTimeout(() => {
            window.location.reload()
        },800)
    } else {
        ElMessage({ message: '分配权限失败', type: 'error' })
    }
}

// 当组件挂载完毕时，获取数据
onMounted(() => {
    getRoleInfo()
})

</script>

<style lang='scss'>
.user-info {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
}

.user-info span {
    margin-right: 10px;
}

.user-info .el-input {
    width: 200px;
    margin-right: 10px;
}

.assign_drawer {
    .menu_div {
        width: 100%;
    }
}
</style>