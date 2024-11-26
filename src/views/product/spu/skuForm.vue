<template>
    <el-dialog title="添加SKU" v-model="isDialogVisible" width="85%" center>
        <el-form label-width="80px">
            <!--SKU名称-->
            <el-form-item label="SKU名称" class="form_item">
                <el-input v-model="skuPramas.skuName" placeholder="请输入SKU名称"></el-input>
            </el-form-item>
            <!--价格-->
            <el-form-item label="价格(元)" class="form_item">
                <el-input v-model="skuPramas.price" type="number" placeholder="请输入SKU名称"></el-input>
            </el-form-item>
            <!--重量(克)-->
            <el-form-item label="重量(克)">
                <el-input v-model="skuPramas.weight" type="number" placeholder="重量(克)"></el-input>
            </el-form-item>
            <!--SKU描述-->
            <el-form-item label="SKU描述">
                <el-input v-model="skuPramas.skuDesc" type="textarea" placeholder="请输入SPU描述"></el-input>
            </el-form-item>
            <!--平台属性-->
            <el-form-item label="平台属性">
                <el-form :inline="true" label-width="80px">
                    <el-form-item v-for="(item, index) in attrArr" :key="index" :label="item.attrName">
                        <!--将用户选择的值存入attrArr中-->
                        <el-select v-model="item.attrIdAndValueId" class="select" placeholder="请选择">
                            <el-option v-for="(attrValue, index1) in item.attrValueList" :key="index1"
                                :label="attrValue.valueName" :value="`${item.id}:${attrValue.id}`">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-form-item>
            <!--销售属性-->
            <el-form-item label="销售属性">
                <el-form-item v-for="(item, index) in saleAttrArr" :key="index" :label="item.saleAttrName">
                    <!--将用户选择的值存入saleAttrArr中-->
                    <el-select v-model="item.saleIdAndValueId" class="select" placeholder="请选择">
                        <el-option v-for="(saleAttrValue, index1) in item.spuSaleAttrValueList" :key="index1"
                            :label="saleAttrValue.saleAttrValueName" :value="`${item.id}:${saleAttrValue.id}`">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form-item>
            <!--图片名称-->
            <el-form-item label="图片名称">
                <el-table ref="tableRef" border stripe :data="imgArr">
                    <el-table-column selectable type="selection" min-width="55" align="center" />
                    <el-table-column label="图片">
                        <template #default="{ row }">
                            <img :src="row.imgUrl" style="width: 100px; height: 100px;">
                        </template>
                    </el-table-column>
                    <el-table-column prop="imgName" label="名称"></el-table-column>
                    <el-table-column label="操作">
                        <template #default="{ row }">
                            <el-button @click="setDefaultImg(row)" type="primary" size="small">设为默认</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
            <!--保存&取消-->
            <el-form-item>
                <el-button @click="save" type="primary">保存</el-button>
                <el-button @click="isDialogVisible = false">取消</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script setup lang='ts' name=''>
import { ref, defineExpose, reactive } from 'vue'
import { reqAttrInfoList } from '../../../api/product/arrt'
import { reqSpuImageList, reqBaseSaleAttrList, reqAddSku } from '../../../api/product/spu'
import type { SkuData } from '../../../api/product/spu/type'
import { ElMessage } from 'element-plus';
// 控制对话框的显示与隐藏
let isDialogVisible = ref(false)
// 平台属性
let attrArr = ref<any>([])
// 销售属性
let saleAttrArr = ref<any>([])
// 图片
let imgArr = ref<any>([])
// 收集当前的spu信息:用于保存时发送
let skuPramas = reactive<SkuData>({
    // 下面三个数据由父组件传来
    category3Id: '',// 三级分类id
    spuId: '',// 已有的spuId
    tmId: '',// SPU品牌id

    // 下面数据由用户输入   
    skuName: '',// sku名称 
    price: '',// 价格
    weight: '',// 重量
    skuDesc: '',// 描述

    // 平台属性
    skuAttrValueList: [
        {
            attrId: '',
            valueId: '',
        }
    ],
    skuDefaultImg: '',// SKU图片地址
    // 销售属性
    skuSaleAttrValueList: [
        {
            saleAttrId: '',
            saleAttrValueId: '',
        }
    ],
})
// 获取table的实例
let tableRef = ref<any>()
// 初始化spu数据
const initSpuData = async (c1Id: number | string, c2Id: number | string, spu: any) => {
    // 获取平台属性列表
    let result1 = await reqAttrInfoList(c1Id, c2Id, spu.category3Id)
    // 获取图片列表
    let result2 = await reqSpuImageList(spu.id)
    // 获取销售属性列表
    let result3 = await reqBaseSaleAttrList(spu.id)

    // 将数据收集起来，展示在页面中
    attrArr.value = result1.data
    imgArr.value = result2.data
    saleAttrArr.value = result3.data

    // 展示对话框
    isDialogVisible.value = true

    // 收集spu信息：将所有的spu信息保存起来，用于保存sku时发送（用户输入的参数由input收集）
    // 父亲传送的参数
    skuPramas.category3Id = spu.category3Id
    skuPramas.spuId = spu.id
    skuPramas.tmId = spu.tmId

}
// 设置默认图片
const setDefaultImg = (row: any) => {
    // 1.清空所有选中状态
    tableRef.value.clearSelection()
    // 2.设置当前图片选中状态
    tableRef.value.toggleRowSelection(row, true)

    // 将当前图片的url赋值给skuDefaultImg
    skuPramas.skuDefaultImg = row.imgUrl
}
// 保存按钮
const save = async () => {
    // 1.整理参数
    // reduce用于将attrArr数组中的元素进行遍历，将attrId和ValueId属性添加到prev数组中
    skuPramas.skuAttrValueList = attrArr.value.reduce((prev: any, next: any) => {
        // 如果next元素中有attrIdAndValueId属性，则将attrId和ValueId属性添加到prev数组中
        if (next.attrIdAndValueId) {
            // 将attrId和ValueId属性取出，添加到prev对象中
            let [attrId, valueId] = next.attrIdAndValueId.split(':')
            prev.push({
                attrId,
                valueId
            })
        }
        // 返回prev数组，使得skuAttrValueList获得prev对象
        return prev
    }, [])
    skuPramas.skuSaleAttrValueList = saleAttrArr.value.reduce((prev: any, next: any) => {
        // 如果next元素中有attrIdAndValueId属性，则将attrId和ValueId属性添加到prev数组中
        if (next.saleIdAndValueId) {
            // 将attrId和ValueId属性取出，添加到prev对象中  
            let [saleAttrId, saleAttrValueId] = next.saleIdAndValueId.split(':')
            prev.push({
                saleAttrId,
                saleAttrValueId
            })
        }
        // 返回prev数组，使得skuSaleAttrValueList获得prev对象
        return prev
    }, [])
    // 2.发送请求
    let result = await reqAddSku(skuPramas)
    if (result.code == 200) {
        ElMessage({
            type: 'success',
            message: '保存成功'
        })
    } else {
        ElMessage({
            type: 'error',
            message: '保存失败'
        })
    }
    // 3.关闭对话框
    isDialogVisible.value = false
    // 4.清空容器数据
    skuPramas = {
        category3Id: '',
        spuId: '',
        tmId: '',
        skuName: '',
        price: '',
        weight: '',
        skuDesc: '',
        skuAttrValueList: [
            {
                attrId: '',
                valueId: '',
            }
        ],
        skuDefaultImg: '',
        skuSaleAttrValueList: [
            {
                saleAttrId: '',
                saleAttrValueId: '',
            }
        ],
    }
}

defineExpose({
    initSpuData,
})
</script>

<style scoped lang='scss'>
.select {
    width: 150px;
    margin-bottom: 10px;
}
</style>