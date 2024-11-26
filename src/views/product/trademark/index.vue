<template>
  <div>
    <!--展示卡片-->
    <el-card style="max-width: 100%;max-height: 100%;">
      <el-button @click="showDialog('添加品牌')" type="primary" icon="Plus">添加品牌 </el-button>
      <!--表格-->
      <el-table border :data="brandData" stripe style="width: 100%;margin-top: 20px">
        <!--表格列-->
        <el-table-column class="column" label="序号" type="index" width="50px" />
        <el-table-column label="品牌" prop="tmName" />
        <!--图片展示-->
        <el-table-column label="图标">
          <template #default="scope">
            <el-image style="width: 100px; height: 100px" :src="scope.row.logoUrl" alt="加载失败"></el-image>
          </template>
        </el-table-column>
        <!--操作按钮-->
        <el-table-column label="操作">
          <template #default="scope">
            <el-button @click="showDialog('编辑品牌', scope.row)" size="small" type="primary" icon="Edit">
              编辑
            </el-button>
            <el-button @click="deleteTrademark(scope.row)" size="small" type="danger" icon="Delete">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!--分页器-->
    <el-pagination class="pagination" v-model:current-page="pageNum" v-model:page-size="limit"
      layout="->,total, prev, pager, next, jumper" :total="total" @change="handleCurrentChange" background />
    <!--添加修改对话框--> <!--isDialogVisible为true时显示对话框-->
    <el-dialog v-model="isDialogVisible" :title="title" width="50%" center>
      <!--表单--> <!--ref获取表单实例，rules绑定表单验证规则-->
      <el-form ref="formRef" :model="trademark" :rules="rules" class="dialog_form">
        <!--输入框-->
        <el-form-item label="品牌名称" prop="tmName">
          <el-input style="width: 80%;" v-model="trademark.tmName" placeholder="请输入品牌名称" />
        </el-form-item>
        <!--上传组件-->
        <el-form-item label="品牌logo" prop="logoUrl">
          <!--
            action:文件上传的地址,需带有/api前缀
            show-file-list:是否显示已上传的文件列表
            on-success:上传成功后的回调函数
            before-upload:上传前的回调函数，参数为上传的文件，可用于约束上传文件的类型或者大小等
          -->
          <el-upload class="avatar-uploader" action="/api/admin/product/fileUpload" :show-file-list="false"
            :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <!--如果trademark中存在logoUrl，则显示logoUrl，否则显示上传图标-->
            <img v-if="trademark.logoUrl" :src="trademark.logoUrl" />
            <el-icon v-else>
              <Upload />
            </el-icon>
          </el-upload>
        </el-form-item>
        <!--取消和提交按钮-->
        <el-form-item>
          <el-button @click="isDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm()">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--删除品牌数据对话框-->
    <el-dialog class="deleteDialog" v-model="deleteDialogVisible" title="提示" width="20%" center>
      <h1>确认删除吗？</h1>
      <el-button @click="deleteDialogVisible = false" icon="Close">取消</el-button>
      <el-button type="danger" @click="deleteTrademark()" icon="Delete">确定</el-button>
    </el-dialog>
  </div>
</template>

<script setup lang='ts' name='trademark'>
import { onMounted, reactive, ref, nextTick } from 'vue';
import { reqHasTrademark, reqAddTrademark, reqUpdateTrademark, reqRemoveTrademark } from '../../../api/product/trademark';
import type { Records, TradeMarkResponseData, TradeMark } from '../../../api/product/trademark/type';
import { Upload } from '@element-plus/icons-vue';
import type { UploadProps } from 'element-plus';
import { ElMessage } from 'element-plus';

// 当前页码
let pageNum = ref<number>(1)
// 每页展示的数据条数
let limit = ref<number>(1)
// 存储品牌总条数
let total = ref<number>(0)
// 存储品牌数据数组
let brandData = ref<Records>([])
let isDialogVisible = ref(false)
// 添加品牌数据容器
let trademark = reactive<TradeMark>({
  logoUrl: '',
  tmName: ''
})
// 对话框标题
let title = ref<string>('')
// 删除品牌数据对话框是否显示
let deleteDialogVisible = ref<boolean>(false)
// 存储要删除的品牌的id，用于二次确认删除时，告诉服务器要删除的是哪一条数据
let deleteId = ref<number | undefined>()
// 获取表单实例
let formRef = ref()

// 验证品牌名称的方法，定义验证规则
const validatorTmName = (rule: any, value: any, callback: any) => {
  // 如果品牌名称为空,则提示用户输入品牌名称
  if (!value) {
    callback(new Error('品牌名称不能为空'))
  } else {
    callback()
  }
}
// 验证品牌logo的方法，定义验证规则
const validatorLogoUrl = (rule: any, value: any, callback: any) => {
  // 
  if (value) {
    callback()
  } else {
    callback(new Error('品牌logo不能为空'))
  }
}
// 表单验证规则
const rules = reactive({
  tmName: [
    { required: true, trigger: 'blur', validator: validatorTmName },
  ],
  // 校验品牌logo时,无法使用trigger触发，故在submitForm()中手动调用validate方法进行校验
  logoUrl: [
    { required: true, validator: validatorLogoUrl },
  ]
})
// 封装一个获取品牌数据的函数
const getTrademark = async () => {
  // 发送请求，获取商标信息
  let result: TradeMarkResponseData = await reqHasTrademark(pageNum.value, limit.value)
  // 如果请求成功
  // @ts-ignore
  if (result.code == 200) {
    // 将总条数赋值给total
    total.value = result.data.total
    // 将商标信息赋值给brandData
    brandData.value = result.data.records
  }
}
// 挂载完毕时请求一次数据，获取品牌数据
onMounted(() => {
  getTrademark()
})
// 当分页器页码发生改变时，调用该函数，重新获取数据
const handleCurrentChange = () => {
  // 调用getTrademark函数，获取商标信息
  getTrademark()
}
// 显示对话框，当点击的是添加品牌按钮时，row值不用传，当点击的是编辑按钮时，需要传row值
const showDialog = (dialogTitle: string, row?: TradeMark) => {
  // 显示对话框之前，清空表单验证信息
  // -->由于对话框是懒加载的，所以需要使用nextTick函数，在对话框显示出来之后，再清空表单验证信息
  nextTick(() => {
    formRef.value.clearValidate('tmName')// 清空表单验证信息
    formRef.value.clearValidate('logoUrl')// 清空表单验证信息
  })
  // 将对话框标题赋值给title
  title.value = dialogTitle
  // 显示对话框
  isDialogVisible.value = true
  // 清空trademark中的数据，防止添加品牌时，残留上一次的数据
  trademark.id = undefined
  trademark.logoUrl = ''
  trademark.tmName = ''
  // 如果row存在，说明点击的是修改按钮，需要将row中的数据赋值给trademark，用于展示修改前的值
  // 同时需要传入id值，用于向服务器发送修改请求时，告诉服务器要修改的是哪一条数据
  if (row) {
    Object.assign(trademark, row)// 将row中的数据赋值给trademark，用于展示修改前的值
    /* 上述ES6代码等价于下代码 */
    // trademark.id = row.id
    // trademark.logoUrl = row.logoUrl
    // trademark.tmName = row.tmName

  }
}
// 提交表单
const submitForm = async () => {
  // 提交表达时，调用formRef.value.validate()方法，验证表单数据是否合法
  // -->validate方法会自动调用表单中定义的所有验证规则，返回一个promise对象
  // -->awit formRef.value.validate()会等待promise对象的状态变为fulfilled，即验证通过,才会继续执行后面的代码
  await formRef.value.validate()
  // 当数据中有id，说明是修改品牌信息,否则是添加品牌信息
  if (trademark.id) {
    // 发送请求，修改品牌信息
    let result: TradeMarkResponseData = await reqUpdateTrademark(trademark)
    // 如果请求成功
    if (result.code == 200) {
      // 提示用户修改成功
      ElMessage({
        type: 'success',
        message: '修改成功'
      })
      // 关闭对话框
      isDialogVisible.value = false
      // 重新获取品牌数据，刷新页面，使修改后的品牌信息显示在页面上
      getTrademark()
      // 修改失败时
    } else {
      // 提示用户修改失败
      ElMessage({
        type: 'error',
        message: '修改失败'
      })
    }
  }
  // 如果trademark中不存在id，说明是添加品牌信息
  else {
    // 发送请求，添加品牌信息
    let result: TradeMarkResponseData = await reqAddTrademark(trademark)
    // 如果请求成功
    if (result.code == 200) {
      // 提示用户添加成功
      ElMessage({
        type: 'success',
        message: '添加成功'
      })
      // 关闭对话框
      isDialogVisible.value = false
      // 重新获取品牌数据，刷新页面，使添加后的品牌信息显示在页面上
      getTrademark()
      // 添加失败时
    } else {
      // 提示用户添加失败
      ElMessage({
        type: 'error',
        message: '添加失败'
      })
    }
  }
}
// 上传前的回调函数，参数为上传的文件，可用于约束上传文件的类型或者大小等
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  // 限制文件类型，只能上传图片,如果上传的不是图片，则返回false，上传失败
  // rawFile.type:获取上传文件的类型
  if (rawFile.type == 'image/jpeg' || rawFile.type == 'image/png' || rawFile.type == 'image/gif') {
    // 限制文件大小，最大为5MB
    if (rawFile.size / 1024 / 1024 < 5) {
      return true
    } else {
      ElMessage.error('文件大小不能超过5MB')
      return false
    }
  } else {
    // 如果上传的不是图片，则返回false，上传失败
    ElMessage.error('只能上传图片')
    return false
  }
}
// 上传成功的回调函数，参数为上传成功的文件信息
const handleAvatarSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
  // response:上传成功的文件路径等信息
  // uploadFile:上传的文件信息

  // 将上传成功的文件信息中的url赋值给trademark.logoUrl
  trademark.logoUrl = response.data
  // 上传成功时，清除表单中logoUrl的验证信息
  formRef.value.clearValidate('logoUrl')
}
// 删除品牌(包含第一次确认删除和二次确认删除)
//  --> 将第一次删除和二次确认写在一个方法内，通过是否有row参数判断是第一次删除还是二次确认删除
const deleteTrademark = async (row?: TradeMark) => {
  // 如果传来了row，说明点击的是删除按钮，需要将row中的id赋值给deleteId
  if (row) {
    // 设置deleteId的值为undefined,防止残留上一次的值
    deleteId.value = undefined
    // 将row中的id赋值给deleteId
    deleteId.value = row.id
    // 显示删除对话框
    deleteDialogVisible.value = true
  }
  // 如果没有row，说明点击的是二次确认按钮，需要将deleteId.value传给服务器，告诉服务器要删除的是哪一条数据
  else {
    // 发送请求，删除品牌
    let result = await reqRemoveTrademark(deleteId.value as number)
    if (result.code == 200) {
      // 删除成功时
      // 提示用户删除成功
      ElMessage({
        type: 'success',
        message: '删除成功'
      })
      // 关闭删除对话框
      deleteDialogVisible.value = false
      // 重新获取品牌数据，刷新页面，使删除后的品牌信息显示在页面上
      getTrademark()
      // 删除失败时
    } else {
      // 提示用户删除失败
      ElMessage({
        type: 'error',
        message: '删除失败'
      })
    }
  }
}

</script>

<style lang='scss'>
.pagination {
  margin-top: 20px;
  margin-right: 20px;
}

.dialog_form {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.deleteDialog {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  h1 {
    margin-left: 35px;
    margin-bottom: 20px;
  }


}
</style>