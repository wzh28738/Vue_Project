<template>
    <el-dialog :title="showTitle" v-model="isDialogVisible" width="85%" center>
        <el-form label-width="80px">
            <el-form-item label="SPU名称" class="form_item">
                <el-input v-model="spuParams.spuName" placeholder="请输入SPU名称"></el-input>
            </el-form-item>
            <el-form-item label="SPU品牌" class="form_item">
                <el-select v-model="spuParams.tmId" placeholder="请选择品牌">
                    <el-option v-for="item in AllTrademark" :key="item.id" :label="item.tmName"
                        :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="SPU描述">
                <el-input v-model="spuParams.description" type="textarea" placeholder="请输入SPU描述"></el-input>
            </el-form-item>
            <el-form-item label="SPU图片">
                <!--v-model:fileList用于展示默认图片
                    action上传图片的接口地址
                    list-type="picture-card"展示图片的样式
                    :on-preview="handlePictureCardPreview"点击已上传图片的回调
                    :on-remove="handleRemove"删除图片的回调
                -->
                <el-upload v-model:fileList="imageList" action="/api/admin/product/fileUpload" list-type="picture-card"
                    :on-preview="handlePictureCardPreview" :on-remove="handleRemove">
                    <el-icon>
                        <Plus />
                    </el-icon>
                </el-upload>
                <el-dialog title="预览" v-model="imgDialogVisible" center>
                    <el-image :src="dialogImageUrl" alt="" width="100%" />
                </el-dialog>
            </el-form-item>
            <el-form-item label="销售属性">
                <div class="form_saleAttr_item_">
                    <el-select v-model="saleAttrIdAndValueName" :placeholder="`还有${unSelectedSaleAttr.length}个未选择`">
                        <el-option :value="`${item.id}:${item.name}`" v-for="(item, index) in unSelectedSaleAttr"
                            :key="item.id" :label="item.name">
                        </el-option>
                    </el-select>
                    <el-button @click="addSaleAttr()" :disabled="!saleAttrIdAndValueName" type="primary"
                        icon="Plus">添加销售属性</el-button>
                </div>
                <!-- 展示销售属性 -->
                <el-table border :data="saleAttr">
                    <el-table-column label="序号" width="80" type="index"></el-table-column>
                    <el-table-column prop="saleAttrName" label="属性名" width="120"></el-table-column>
                    <el-table-column label="属性值列表">
                        <template #default="scope">
                            <!-- v-model="scope.row.inputVisible"：双向绑定input的显示与隐藏
                                v-if="scope.row.inputVisible"：当inputVisible为true时，展示input
                                v-else：当inputVisible为false时，展示按钮
                                @close="scope.row.spuSaleAttrValueList.splice(index, 1)"：点击关闭按钮，删除当前属性值

                            -->
                            <el-tag @close="scope.row.spuSaleAttrValueList.splice(index, 1)" style="margin: 0px 5px"
                                v-for="(item, index) in scope.row.spuSaleAttrValueList" :key="item.id" closable>
                                {{ item.saleAttrValueName }}
                            </el-tag>
                            <!--@blur="toLook()"：失去焦点时，将flag变为false，即显示添加按钮
                                v-model="scope.row.newSaleAttrValue"：双向绑定新添加的属性值  
                                v-if="scope.row.flag"：当前属性值有flag为true时，展示input  
                            -->
                            <el-input @blur="toLook(scope.row)" style="width: 100px;"
                                v-model="scope.row.newSaleAttrValue" size="small" placeholder="请输入属性值"
                                v-if="scope.row.flag">
                            </el-input>
                            <el-button @click="toEdit(scope.row)" v-else type="primary" size="small"
                                icon="Plus"></el-button>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="120">
                        <template #default="scope">
                            <el-button @click="saleAttr.splice(scope.$index, 1)" type="danger" size="small"
                                icon="Delete">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
            <el-form-item>
                <el-button @click="save" type="primary">保存</el-button>
                <el-button @click="isDialogVisible = false">取消</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script setup lang='ts' name='spuForm'>
import { ref, defineExpose, computed, defineEmits, } from 'vue'
import type { SpuImage, SpuData, Trademark, SaleAttrObj, SaleAttr } from '../../../api/product/spu/type';
import { reqAllTrademark, reqSpuImageList, reqBaseSaleAttrList, reqAllSaleAttrList, reqUpdateSpu, reqAddSpu } from '../../../api/product/spu'
import { ElMessage } from 'element-plus';

// 使用defineEmits接收父组件传递过来的change-page事件，改事件用于切换页码
let $emit = defineEmits(['change-page'])
// 控制添加&修改对话框显示隐藏
let isDialogVisible = ref(false)
// 添加&修改对话框标题
let showTitle = ref('')
let dialogImageUrl = ref('')

// 控制图片对话框显示隐藏   
let imgDialogVisible = ref(false)

// 存储已有的SPU数据
let AllTrademark = ref<Trademark[]>([])
// 商品图片
let imageList = ref<SpuImage[]>([])
// 已有的销售属性列表
let saleAttr = ref<SaleAttrObj[]>([])
// 所有的销售属性列表
let allSaleAttr = ref<SaleAttr[]>([])
// 储存父组件传递的spu对象
let spuParams = ref<SpuData>({
    category3Id: '',
    description: '',
    spuName: '',
    tmId: 0,
    spuImageList: [],
    spuSaleAttrList: []
})
// 将来收集还未选择的销售属性的ID和属性名称
let saleAttrIdAndValueName = ref('')

// 获取SPU列表数据方法
const getSpuList = async (spu: SpuData,title?: string) => {
    // 显示对话框前，先清空图片列表，使动画效果更流畅
    imageList.value = []
    // spu：父组件传递的spu对象
    spuParams.value = spu

    // 显示对话框
    showDialog(title)
    
    // 1.获取全部品牌列表数据
    let result1 = await reqAllTrademark()
    // 2.获取已有的销售属性列表数据
    let result2 = await reqBaseSaleAttrList((spu.id as number))
    // 3.获取spu图片列表数据
    let result3 = await reqSpuImageList((spu.id as number))
    // 4.获取全部spu销售属性列表数据
    let result4 = await reqAllSaleAttrList()
    
    // 5.将数据存储到响应式数据中
    AllTrademark.value = result1.data

    
    // map()方法：对数组中的每一项执行回调函数，返回一个新的数组，用于将result3.data中的数据格式化为el-upload组件需要的格式
    imageList.value = result3.data.map(item => {
        return {
            id: item.id,
            imgName: item.imgName,
            imgUrl: item.imgUrl,
            spuId: item.spuId,
            createTime: item.createTime,
            updateTime: item.updateTime,
            // 以上数据为原格式，以下数据为el-upload组件需要的格式
            name: item.imgName,
            url: item.imgUrl
        }
    })
    saleAttr.value = result2.data
    allSaleAttr.value = result4.data
}
// 展示对话框方法
const showDialog = (title?: string) => {
    isDialogVisible.value = true
    // 根据父组件传递的title参数，设置对话框标题
    title == '修改SPU' ? showTitle.value = title : showTitle.value = '添加SPU'
}
// 预览图片
const handlePictureCardPreview = (file: any) => {
    // file：当前点击的图片对象地址

    // 显示图片对话框
    imgDialogVisible.value = true
    // 设置图片对话框中的图片地址
    dialogImageUrl.value = file.url
}
// 删除图片
const handleRemove = (file: any) => {
    // 1.获取图片的索引
    let index = imageList.value.findIndex(item => item.name == file.name)
    // 2.根据索引删除图片
    imageList.value.splice(index, 1)
}
// 计算出未选中的销售属性
let unSelectedSaleAttr = computed(() => {
    // filter()方法：过滤出未选中的销售属性，返回一个新的数组，用于展示在未选中销售属性列表中
    let unSelectedAttr = allSaleAttr.value.filter(item => {
        return saleAttr.value.every(item1 => {
            // @ts-ignore
            return item.name != item1.saleAttrName
        })
    })
    return unSelectedAttr
})
// 添加销售属性
const addSaleAttr = () => {
    const [baseSaleAttrId, saleAttrName] = saleAttrIdAndValueName.value.split(':')
    // 1.创建新的销售属性对象
    let newSaleAttr: SaleAttrObj = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: []
    }
    // 2.将新的销售属性对象添加到已有的销售属性列表中
    saleAttr.value.push(newSaleAttr)
    // 3.清空saleAttrIdAndValueName.value
    saleAttrIdAndValueName.value = ''
}
// 切换至编辑状态
const toEdit = (row: SaleAttrObj) => {
    // 为当前点击属性值添加flag属性，用于控制编辑状态
    row.flag = true
    // 为当前点击属性值添加newSaleAttrValue属性，用于收集新的销售属性值
    row.newSaleAttrValue = ''
}
// 失去焦点切换至查看状态：同时保存新的销售属性值
const toLook = (row: SaleAttrObj) => {
    // 1.获取新的销售属性id和名字
    let { baseSaleAttrId, newSaleAttrValue } = row
    // 2.创建新的销售属性值对象
    let newValue: SaleAttr = {
        baseSaleAttrId,
        saleAttrValueName: (newSaleAttrValue as string),
    }

    // 3.判断新的销售属性值是否为空
    if ((newSaleAttrValue as string).trim() == '') {
        ElMessage({
            type: 'error',
            message: '属性值不能为空'
        })
        // 非法：清空newSaleAttrValue，切换至查看状态
        row.newSaleAttrValue = ''
        row.flag = false
        return
    }
    // 4.判断新的销售属性值是否重复
    let isRepeat = row.spuSaleAttrValueList.some(item => {
        return item.saleAttrValueName == (newSaleAttrValue as string)
    })
    if (isRepeat) {
        ElMessage({
            type: 'error',
            message: '属性值不能重复'
        })
        // 非法：清空newSaleAttrValue，切换至查看状态
        row.newSaleAttrValue = ''
        row.flag = false
        return
    }

    // 5.将新的销售属性值对象添加到当前点击属性值的spuSaleAttrValueList数组中
    row.spuSaleAttrValueList.push(newValue)
    // 6.切换至查看状态
    row.flag = false
}
// 保存添加或修改的数据
const save = async () => {
    // 1.收集spu图片：将imageList.value中的数据转换为服务器需要的格式再保存
    spuParams.value.spuImageList = imageList.value.map((item: any) => {
        return {
            // 图片名称
            imgName: item.name,
            // 地址，当item.response && item.response.data存在时，代表是新增的图片，否则使用已有的图片item.url
            imgUrl: (item.response && item.response.data) || item.url
        }
    }
    )
    // 2.收集销售属性
    spuParams.value.spuSaleAttrList = saleAttr.value

    let result:any = {}
    // 3.发送请求
    //   有id时，修改SPU
    if (spuParams.value.id) result = await reqUpdateSpu(spuParams.value)
    //   无id时，添加SPU
    if (!spuParams.value.id) result = await reqAddSpu(spuParams.value)
    // 4.处理响应结果
    if (result.code == 200) {
        ElMessage({
            type: 'success',
            // 有id时，修改成功；无id时，添加成功
            message: spuParams.value.id ? '修改成功' : '添加成功'
        })
    } else {
        ElMessage({
            type: 'error',
            // 有id时，修改失败；无id时，添加失败
            message: spuParams.value.id ? '修改失败' : '添加失败'
        })
    }
    // 4.关闭对话框
    isDialogVisible.value = false
    // 5.添加成功后，使用父组件的change-page函数，跳转到第一页
    if (!spuParams.value.id) $emit('change-page',1) 
    
}
// 添加SPU方法
const addSpu = async (c3Id: number | string, title?: string) => {
    // 开始前清空容器的数据，防止上次添加的数据影响
    // 清空imageList
     imageList.value = []
    // 清空spuParams
    Object.assign(spuParams.value, {
        spuName: '',
        description: '',
        tmId: '',
        category3Id: '',
        spuImageList: [],
        spuSaleAttrList: []
    })
    // 清空saleAttr
    saleAttr.value = []
    // 清空saleAttrIdAndValueName
    saleAttrIdAndValueName.value = ''

    // 显示对话框
    showDialog(title)

    // 存储三级分类id
    spuParams.value.category3Id = c3Id
    // 获取全部品牌和销售属性
    let result1 = await reqAllTrademark()
    let result2 = await reqAllSaleAttrList()

    AllTrademark.value = result1.data
    allSaleAttr.value = result2.data

    
}


defineExpose({
    // 暴露showDialog方法，在父组件中调用，打开对话框
    showDialog,
    // 暴露getSpuList方法，在父组件中调用，修改时先获取SPU列表数据
    getSpuList,
    // addSpu方法，在父组件中调用，添加SPU
    addSpu
})
</script>

<style scoped lang='scss'>
.form_item {
    width: 40%;
}

.form_saleAttr_item_ {
    display: flex;
    width: 100%;
    margin-bottom: 15px;

    .el-select {
        width: 40%;
        margin-right: 15px;
    }
}
</style>