<template>
    <!--卡片-->
    <el-card>
        <!--表格-->
        <el-table border stripe :data="skuList" height="500">
            <el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
            <el-table-column prop="skuName" label="名称" show-overflow-tooltip width="220"></el-table-column>
            <el-table-column prop="skuDesc" label="描述" show-overflow-tooltip width="220"></el-table-column>
            <el-table-column label="图片" type="index" width="200">
                <template #default="{ row }">
                    <el-image :src="row.skuDefaultImg" style="width: 100px; height: 100px" fit="contain"></el-image>
                </template>
            </el-table-column>
            <el-table-column prop="price" label="价格" width="80"></el-table-column>
            <el-table-column prop="weight" label="重量" width="80"></el-table-column>
            <el-table-column label="操作" fixed="right" width="700">
                <template #default="{ row }">
                    <el-button @click="onSale(row)" v-if="!row.isSale" type="primary" size="small" icon="Top"
                        title="上架"></el-button>
                    <el-button @click="cancelSale(row)" v-else type="info" size="small" icon="Bottom"
                        title="下架"></el-button>
                    <el-button @click="ElMessage.warning('功能暂未开发')" type="warning" size="small" icon="Edit"
                        title="编辑"></el-button>
                    <el-button @click="showInfo(row)" type="info" size="small" icon="InfoFilled"
                        title="查看信息"></el-button>
                    <el-popconfirm title="确定删除吗？" @confirm="removeSku(row)" confirmButtonText="确定" cancelButtonText="取消">
                        <template #reference>
                            <el-button type="danger" size="small" icon="Delete" title="删除"></el-button>
                        </template>
                        
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <!--分页-->
        <el-pagination background v-model:current-page="pageNo" layout="->,prev, pager, next, jumper, total"
            :total="total" :page-size="pageSize" @current-change="getSkuList" style="margin: 10px;" />
    </el-card>
    <!--对话框:展示商品详情-->
    <el-dialog title="商品详情" v-model="isDialogVisible" width="80%" center>
        <el-form label-width="100px">
            <el-form-item label="名称：">{{ skuInfo.skuName }}</el-form-item>
            <el-form-item label="描述：">{{ skuInfo.skuDesc }}</el-form-item>
            <el-form-item label="价格：">{{ skuInfo.price }}</el-form-item>
            <el-form-item label="平台属性：">
                <el-tag v-for="(attr, index) in skuInfo.skuAttrValueList" :key="index" type="success" effect="plain">
                    {{ attr.valueName }}
                </el-tag>
            </el-form-item>
            <el-form-item label="销售属性：">
                <el-tag v-for="(attr, index) in skuInfo.skuSaleAttrValueList" :key="index" type="success" effect="plain">
                    {{ attr.saleAttrValueName }}
                </el-tag>
            </el-form-item>
            <el-form-item label="商品图片：">
            </el-form-item>
            <el-carousel :interval="4000" type="card" height="200px">
                <el-carousel-item v-if="skuInfo.skuImageList?.length" v-for="(item,index) in skuInfo.skuImageList" :key="index">
                    <el-image :src="item.imgUrl" style="width: 100%;height: 100%;"/>
                </el-carousel-item>
                <el-carousel-item v-else>
                    <h1 style="display: flex;justify-content: center;flex-direction: column;align-items: center;height: 100%;">
                        图片暂未添加
                    </h1>
                </el-carousel-item>
            </el-carousel>
        </el-form>
    </el-dialog>
</template>

<script setup lang='ts' name='sku'>
import { ref, onMounted } from 'vue'
import { reqSkuList, reqOnSale, reqCancelSale,reqSkuInfo, reqRemoveSku } from '../../../api/product/sku'
import type { SkuResponseData, SkuData, SkuByIdResponseData } from '../../../api/product/sku/type';
import { ElMessage } from 'element-plus';

// 当前页码
let pageNo = ref(1)
// 每页显示条数
let pageSize = ref(10)
// 总条数
let total = ref<number>()
// sku列表容器
let skuList = ref<SkuData[]>([])
// 是否显示对话框
let isDialogVisible = ref(false)
// 根据skuId获取sku列表容器 
// @ts-ignore
let skuInfo = ref<SkuData>({})

// 获取sku数据
const getSkuList = async () => {
    const result: SkuResponseData = await reqSkuList(pageNo.value, pageSize.value)
    if (result.code == 200) {
        // 获取总条数
        total.value = result.data.total,
            // 获取sku列表
            skuList.value = result.data.records
    }
}
// 上架按钮
const onSale = async (row: SkuData) => {
    let result = await reqOnSale(row.id as number)
    if (result.code == 200) {
        ElMessage({
            type: 'success',
            message: '上架成功'
        })
        getSkuList()
    } else {
        ElMessage({
            type: 'error',
            message: '上架失败'
        })
    }
}
// 下架按钮
const cancelSale = async (row: SkuData) => {
    console.log(row)
    let result: any = await reqCancelSale(row.id as number)
    if (result.code == 200) {
        ElMessage({
            type: 'success',
            message: '下架成功'
        })
        getSkuList()
    } else {
        ElMessage({
            type: 'error',
            message: '下架失败'
        })
    }
}
// 查看按钮
const showInfo = async (row: SkuData) => {
    isDialogVisible.value = true

    let result:SkuByIdResponseData = await reqSkuInfo(row.id as number)
    if (result.code == 200) {
        skuInfo.value = result.data
    }else{
        ElMessage({
            type: 'error',
            message: '获取详情失败'
        })
    }
}
// 删除按钮
const removeSku = async (row: SkuData) => {
    let result = await reqRemoveSku(row.id as number)
    if (result.code == 200) {
        ElMessage({
            type: 'success',
            message: '删除成功'
        })
        // 刷新列表
        getSkuList()
    } else {
        ElMessage({
            type: 'error',
            message: '删除失败'
        })
    }
}

// 组件挂载完毕时，发送请求获取数据
onMounted(async () => {
    getSkuList()
})
</script>

<style scoped lang='scss'>
.el-form-item {
    border-top: 1px solid #ccc;
}
.el-tag{
    margin: 5px 10px 3px 3px;
}
.el-carousel__item h3 {
    color: #475669;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
    text-align: center;
}

.el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
    background-color: #d3dce6;
}
</style>