<template>
    <div>
        <el-dialog title="SKU列表" v-model="isDialogVisible" width="85%">
            <el-table :data="skuInfoList" border stripe>
                <el-table-column prop="skuName" label="sku名字"></el-table-column>
                <el-table-column prop="price" label="sku价格"></el-table-column>
                <el-table-column prop="weight" label="sku重量"></el-table-column>
                <el-table-column label="sku图片">
                    <template #default="{ row }">
                        <el-image :src="row.skuDefaultImg" style="width:100px;height:100px" />
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>

<script setup lang='ts' name='lookSku'>
import { ref, reactive } from 'vue'
import { reqLookSku } from '../../../api/product/spu'
import type { LookSkuResponseData } from '../../../api/product/spu/type'

// 控制对话框的显示与隐藏
let isDialogVisible = ref(false)
// sku信息列表容器
let skuInfoList = reactive<any>([])

const initSkuData = async (spuId: number) => {
    // 清空上次查看时容器的数据
    skuInfoList.length = 0
    // 显示对话框
    isDialogVisible.value = true
    // 发起请求获取数据
    let result:LookSkuResponseData = await reqLookSku(spuId)
    if (result.code == 200) {
        // 将数据保存到容器中
        result.data.forEach((item: any) => {
            skuInfoList.push({
                skuName: item.skuName,
                price: item.price,
                weight: item.weight,
                skuDefaultImg: item.skuDefaultImg,
            })
        })
    }


}
 defineExpose({
    initSkuData
 })

</script>

<style scoped lang='scss'></style>