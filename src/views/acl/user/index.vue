<template>
    <div>
        <!-- 顶部卡片 -->
        <el-card style="height: 80px;">
            <el-form :inline="true">
                <el-form-item label="用户名：">
                    <el-input v-model="searchUsername" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button :disabled="!searchUsername" style="margin-left: 10px;" type="primary"
                        @click="searchUser">搜索</el-button>
                    <el-button @click="reset">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <!-- 用户列表卡片 -->
        <el-card style="margin-top: 20px;">
            <el-button type="primary" @click="addOrEditUser(1)">添加用户</el-button>
            <el-popconfirm title="确定要删除这些用户吗？" @confirm="batchRemove">
                <template #reference>
                    <el-button :disabled="batchRemoveUserList.length < 1" type="danger">批量删除</el-button>
                </template>
            </el-popconfirm>

            <!--用户信息--><!-- @selection-change：当选择状态发生变化时触发-->
            <el-table @selection-change="handleSelectionChange" :data="userList" border style="margin-top: 20px;">
                <el-table-column type="selection" width="80" align="center"></el-table-column>
                <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
                <el-table-column prop="id" label="id" width="80"></el-table-column>
                <el-table-column prop="username" label="用户名" width="150"></el-table-column>
                <el-table-column prop="name" label="用户名称" width="150"></el-table-column>
                <el-table-column prop="role" label="用户角色" width="150"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
                <el-table-column prop="updateTime" label="更新时间" width="180"></el-table-column>
                <el-table-column label="操作" width="200" align="center">
                    <template #default="{ row }">
                        <el-button type="primary" size="small" @click="assignRole(row)">分配角色</el-button>
                        <el-button type="warning" size="small" @click="addOrEditUser(0, row)">编辑</el-button>
                        <el-popconfirm title="确定要删除该用户吗？" @confirm="removeUser(row)">
                            <template #reference>
                                <el-button type="danger" size="small">删除</el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页器-->
            <el-pagination @change="getUserInfo()" background v-model:current-page="pageNo"
                layout="->,prev, pager, next, jumper, total" :total="total" :page-size="pageSize"
                style="margin: 10px;" />
        </el-card>
        <!--添加或编辑用户信息对话框-->
        <el-dialog :title="addOrEdit ? '添加用户' : '编辑用户'" v-model="isAddUserInfoDialogVisible" width="50%" center>
            <!--form-->
            <el-form ref="UserInfoFormRef" :model="UserInfo" :rules="rules" label-width="100px">
                <el-form-item label="用户姓名" prop="username">
                    <el-input v-model="UserInfo.username"></el-input>
                </el-form-item>
                <el-form-item label="用户昵称" prop="name">
                    <el-input v-model="UserInfo.name"></el-input>
                </el-form-item>
                <el-form-item v-if="addOrEdit" label="用户密码" prop="password">
                    <el-input v-model="UserInfo.password"></el-input>
                </el-form-item>
            </el-form>
            <!--按钮-->
            <template #footer>
                <span>
                    <el-button @click="isAddUserInfoDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="confirm">确 定</el-button>
                </span>
            </template>
        </el-dialog>
        <!--分配角色对话框-->
        <el-dialog title="分配角色" v-model="isAssignRoleDialogVisible" width="50%" center>
            <!--form-->
            <el-form label-width="100px">
                <el-form-item label="用户姓名：">
                    <el-input v-model="UserInfo.username" disabled style="width: 85%;"></el-input>
                </el-form-item>
                <el-form-item label="用户角色：">
                    <!--checkbox-group中，v-model需要绑定一个数组，该数组的每个值都是checkbox中选中的一个value-->
                    <el-checkbox-group v-model="assignRoleList">
                        <!--checkbox中，:value为选中的一个值，该值会被存至checkbox-group中v-model绑定的一个数组-->
                        <el-checkbox v-for="(role, index) in allRolesList" :key="index" :value="role.id">
                            {{ role.roleName }}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
            <!--按钮-->
            <template #footer>
                <span>
                    <el-button @click="isAssignRoleDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="confirmAssignRole">确 定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue';
// 网络请求接口
import {
    reqUserInfo, reqAddUser, reqUpdateUser, reqGetUserById, reqGetRoleById,
    reqAssignRole, reqRemoveUserById, reqBatchRemoveUserById
} from '../../../api/acl/user'
import { UserResponseData, Records, User, AllRolesResponseData, AllRoles, AssignRolesData } from '../../../api/acl/user/type';
import { ElMessage } from 'element-plus';

let pageNo = ref<number>(1);
let pageSize = ref<number>(5);
let total = ref<number>(0);
// 全部用户信息列表容器
let userList = ref<Records>([])

// 搜索用户名容器
let searchUsername = ref<string>('')

// 添加或编辑用户信息对话框显示状态
let isAddUserInfoDialogVisible = ref<boolean>(false)
// 添加或编辑用户信息对话框标题：1-添加 2-编辑
let addOrEdit = ref<number>(1)
// 添加或编辑用户信息容器
let UserInfo = reactive<User>({
    username: '',
    name: '',
    // 编辑用户时不需要密码，操作时需要去除
    password: ''
})

// 分配角色对话框显示状态
let isAssignRoleDialogVisible = ref<boolean>(false)
// 已有角色列表容器
let assignRoleList = ref<number[]>([])
// 全部角色列表容器
let allRolesList = ref<AllRoles>([])

// 批量删除用户ID列表容器
let batchRemoveUserList = ref<User[]>([])

// 获取Form表单组件实例：以使用其validate方法，进行表单验证
const UserInfoFormRef = ref()
// 自定义验证规则函数
const validateUsername = (rule: any, value: string, callback: any) => {
    // 用户名字和昵称至少为5位
    if (value.trim().length < 5) {
        callback(new Error('用户名至少为5位'))
    } else {
        callback()
    }
}
const validateName = (rule: any, value: string, callback: any) => {
    // 用户名字和昵称至少为5位
    if (value.trim().length < 5) {
        callback(new Error('昵称至少为5位'))
    } else {
        callback()
    }
}
const validatePassword = (rule: any, value: string, callback: any) => {
    // 用户密码至少为5位
    if (value.trim().length < 5) {
        callback(new Error('密码至少为5位'))
    } else {
        callback()
    }
}
// 自定义验证规则
const rules = reactive({
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { required: true, validator: validateUsername, trigger: 'blur' }
    ],
    name: [
        { required: true, message: '请输入用户昵称', trigger: 'blur' },
        { required: true, validator: validateName, trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入用户密码', trigger: 'blur' },
        { required: true, validator: validatePassword, trigger: 'blur' }
    ],
})

// 搜索按钮
const searchUser = () => {
    // elmessage用于告诉getUserInfo()，当前是搜索行为，需要提示搜索成功或者失败
    let elmessage = 1
    getUserInfo(elmessage)
}
// 重置按钮
const reset = () => {
    let elmessage = 2
    searchUsername.value = ''
    getUserInfo(elmessage)
}
// 获取用户信息列表
const getUserInfo = async (elmessage?: number) => {
    let result: UserResponseData = await reqUserInfo(pageNo.value, pageSize.value, searchUsername.value)
    // 请求成功时
    if (result.code == 200) {
        // 获取数据
        userList.value = result.data.records
        total.value = result.data.total
        // 根据elmessage判断是否是搜索行为还是重置行为
        if (elmessage === 1) {
            if (userList.value.length == 0) {
                ElMessage({
                    message: '没有该用户',
                    type: 'warning'
                })
            } else {
                ElMessage({
                    message: '搜索成功',
                    type: 'success'
                })
            }
        }
        if (elmessage === 2) ElMessage({message: '重置成功',type: 'success'})
    } else {// 请求失败时
        if (elmessage === 1) ElMessage({message: '搜索失败',type: 'error'})
        if (elmessage === 2) ElMessage({message: '重置失败',type: 'error'})
    }
}
// 添加或编辑用户按钮
const addOrEditUser = async (flag: number, row?: User) => {
    // 根据flag判断是添加还是编辑
    addOrEdit.value = flag
    nextTick(() => {
        // 清空上一次的表单验证提示信息
        UserInfoFormRef.value.clearValidate()
    })

    if (flag == 1) {
        // 是添加用户，先清空UserInfo，再显示对话框
        UserInfo.id = 0
        UserInfo.username = ''
        UserInfo.name = ''
        UserInfo.password = ''
    } else {
        // 是编辑用户，先获取用户信息，再显示对话框
        let result: any = await reqGetUserById(row?.id as number)
        if (result.code == 200) {
            UserInfo.username = result.data.username
            UserInfo.name = result.data.name
            // 将row和UserInfo进行合并，得到修改时需要的参数
            Object.assign(UserInfo, row)
        }
    }
    // 显示对话框
    isAddUserInfoDialogVisible.value = true
}
// 添加或编辑确认按钮
const confirm = async () => {
    // 验证表单是否全部通过，全部通过才可以提交
    await UserInfoFormRef.value.validate()

    // 添加用户: 账号昵称要复杂一点，不然添加失败
    if (addOrEdit.value) {
        let result: any = await reqAddUser(UserInfo)
        if (result.code == 200) {
            isAddUserInfoDialogVisible.value = false
            ElMessage({
                message: '添加成功',
                type: 'success'
            })
            // 刷新数据
            getUserInfo()
        } else {
            ElMessage({
                message: '添加失败',
                type: 'error'
            })
        }

    } else {// 编辑用户
        let result: any = await reqUpdateUser(UserInfo)
        if (result.code == 200) {
            isAddUserInfoDialogVisible.value = false
            ElMessage({
                message: '编辑成功',
                type: 'success'
            })
            // 刷新数据
            getUserInfo()
            // 刷新页面：如果编辑的是当前用户，需要重新登录，reload方法会触发路由守卫，路由守卫会查询到修改前的用户信息不存在了，所以会跳转到登录页面
            window.location.reload()
        } else {
            ElMessage({
                message: '添加失败',
                type: 'error'
            })
        }
    }
}
// 分配角色按钮
const assignRole = async (row: User) => {
    // 清空上一次的信息
    UserInfo.id = 0
    UserInfo.username = ''
    assignRoleList.value = []
    allRolesList.value = []

    isAssignRoleDialogVisible.value = true
    // 根据用户id获取用户角色信息
    let result: AllRolesResponseData = await reqGetRoleById(row.id as number)
    if (result.code == 200) {
        // 用户id
        UserInfo.id = row.id
        // 用户名字
        UserInfo.username = row.name
        // 获取用户已有的角色：由于checkbox中的v-model需要绑定一个数组，这里将所有的已有角色id存入一个数组中
        result.data.assignRoles.forEach((item: any) => {
            // 将角色id存入数组中
            assignRoleList.value.push(item.id)
        })
        // 获取所有角色列表
        allRolesList.value = result.data.allRolesList
    } else {
        ElMessage({
            message: '获取角色列表失败',
            type: 'error'
        })
    }
}
// 分配角色确认按钮
const confirmAssignRole = async () => {
    // 将用户id和已选择的角色id整理为接口参数需要的格式
    let data: AssignRolesData = {
        roleIdList: assignRoleList.value,
        userId: UserInfo.id as number
    }
    // 获取所有角色列表
    let result: any = await reqAssignRole(data)
    if (result.code == 200) {
        isAssignRoleDialogVisible.value = false
        ElMessage({
            message: '分配角色成功',
            type: 'success'
        })
        // 刷新数据
        getUserInfo()
    } else {
        ElMessage({
            message: '分配角色失败',
            type: 'error'
        })
    }
}
// 删除用户按钮
const removeUser = async (row: User) => {
    let result = await reqRemoveUserById(row.id as number)
    if (result.code == 200) {
        ElMessage({
            message: '删除成功',
            type: 'success'
        })
        // 刷新数据
        getUserInfo()
    } else {
        ElMessage({
            message: '删除失败',
            type: 'error'
        })
    }
}
// el-table的@selection-change事件：当选择项发生变化时会触发该事件的方法，且会自动传入所有选中的数据（value）
const handleSelectionChange = async (value: User[]) => {
    // 将选中的数据存入数组中
    batchRemoveUserList.value = value
}
// 批量删除用户按钮
const batchRemove = async () => {
    // 将batchRemoveUserList中的id取出，存入一个数组中，作为批量删除的参数
    let UserIdList: number[] = []
    batchRemoveUserList.value.forEach((item: User) => {
        UserIdList.push(item.id as number)
    })

    let result = await reqBatchRemoveUserById(UserIdList)
    if (result.code == 200) {
        ElMessage({
            message: '批量删除成功',
            type: 'success'
        })
        // 刷新数据
        getUserInfo()
    } else {
        ElMessage({
            message: '批量删除失败',
            type: 'error'
        })
    }
}

// 挂载全部时获取用户信息
onMounted(() => {
    getUserInfo()
})
</script>

<style scoped lang="scss">
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
</style>