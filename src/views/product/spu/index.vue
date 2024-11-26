<template>
    <div>
        <!--三级分类---->
        <Category></Category>
        <!--SPU卡片---->
        <el-card style="margin: 10px 0px;">
            <!--展示SPU-->
            <div>
                <div class="card_btndiv">
                    <!--当仓库有三级分类时才可以点击该按钮-->
                    <el-button @click="showD('添加SPU')" :disabled="!categoryStore.c3Id" class="card_div_btn"
                        type="primary" icon="Plus">添加SPU</el-button>
                </div>
                <!--展示 SPU table-->
                <el-table border stripe :data="records">
                    <el-table-column label="序号" type="index" width="80px" align="center"></el-table-column>
                    <el-table-column prop="spuName" label="SPU名称"></el-table-column>
                    <el-table-column prop="description" label="SPU描述"></el-table-column>
                    <!--操作按钮-->
                    <el-table-column label="SPU操作">
                        <template #default="scope">
                            <el-button @click="addSku(scope.row)" type="primary" size="small" icon="Plus"
                                title="添加SKU"></el-button>
                            <el-button @click="showD('修改SPU', scope.row)" type="warning" size="small" icon="Edit"
                                title="编辑SPU"></el-button>
                            <el-button @click="look(scope.row)" type="success" size="small" icon="View"
                                title="查看SKU列表"></el-button>
                            <el-popconfirm title="确定删除吗？" @confirm="removeSpu(scope.row)">
                                <template #reference>
                                    <el-button type="danger" size="small" icon="Delete" title="删除SPU"></el-button>
                                </template>
                            </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>
                <!--分页器-->
                <el-pagination @current-change="changePage" @current-page="getSPUList" v-model:current-page="pageNo"
                    v-model:page-size="pageSize" :total="pageTotal" layout="->, prev, pager, next, jumper, total"
                    style="margin-top: 20px; text-align: center;" background>
                </el-pagination>
            </div>
            <!--添加和修改SPU组件-->
            <!--@change-page="changePage"：为子组件传入changePage方法-->
            <SpuForm @change-page="changePage" ref="spuFormRef"></SpuForm>
            <!--添加SKU组件-->
            <SkuForm ref="skuFormRef"></SkuForm>
            <lookSku ref="lookSkuRef"></lookSku>
        </el-card>

    </div>
</template>

<script setup lang='ts' name='spu'>
import { ref, watch, onBeforeUnmount } from 'vue'
import { useCategoryStore } from '../../../store/modules/category'
import { reqHasSpu, reqRemoveSpu } from '../../../api/product/spu'
import type { HasSpuResponseData, Records, SpuData, SpuImage } from '../../../api/product/spu/type';
import { ElMessage } from 'element-plus'
import SpuForm from './spuForm.vue';
import SkuForm from './skuForm.vue';
import lookSku from './lookSku.vue';

// 获取仓库
const categoryStore = useCategoryStore()
// 分页器默认页码
let pageNo = ref(1)
// 分页器每页数量
let pageSize = ref(3)
// 分页器总数量
let pageTotal = ref(10)
// 收到的spu列表数据
let records = ref<Records>([])
// 获取组件实例
const spuFormRef = ref();
const skuFormRef = ref();
const lookSkuRef = ref();

//监听三级分类变化，获取数据
watch(() => categoryStore.c3Id, () => {
    // 当有三级分类id时，才发请求
    if (categoryStore.c3Id) {
        getSPUList()
    }
})
// 获取三级分类下的全部SPU
const getSPUList = async () => {
    // 定义一个变量result，类型为HasSpuResponseData，并使用await关键字异步获取reqHasSpu函数的返回值
    let result: HasSpuResponseData = await reqHasSpu(pageNo.value, pageSize.value, categoryStore.c3Id)
    // 如果result的code属性等于200，则将result的data属性的total属性赋值给pageTotal，将result的data属性的records属性赋值给records
    if (result.code == 200) {
        pageTotal.value = result.data.total
        records.value = result.data.records
    }
}
// 页面改变时，重新获取数据
const changePage = (page: number) => {
    pageNo.value = page
    getSPUList()
}
// 添加和修改SPU按钮：调用SpuForm组件中的showDialog方法，展示对话框
const showD = (title: string, row?: SpuImage) => {
    /* 注意：
        1.在调用子组件中的方法时，需要使用ref获取组件实例，然后使用.value来调用组件中的方法
        2.不能直接在父组件函数外部使用子组件的方法，需要通过按钮触发，否则会找不到子组件的方法，因为子组件还没有被渲染到页面上
    */
    // title是传递给子组件的参数，用于展示对话框的标题

    // 当有row时，表示是修改SPU，将row传递给子组件，用于展示修改SPU的数据
    if (row) {
        // 调用子组件的方法，获取spu列表数据，row是当前组件获得到的spu数据，给子组件展示，进行修改
        spuFormRef.value.getSpuList(row, title)
    } else {
        // 当没有row时，表示是添加SPU, 将categoryStore.c3Id传递给子组件，用于添加SPU
        spuFormRef.value.addSpu(categoryStore.c3Id, title)
    }

}
// 添加SKU按钮：调用SkuForm组件中的initSpuData方法，展示对话框，初始化数据
const addSku = (row: SpuData) => {
    // 调用子组件的方法，并传递初始值
    skuFormRef.value.initSpuData(categoryStore.c1Id, categoryStore.c2Id, row)
}
// 查看SKU按钮
const look = (row: SpuData) => {
    lookSkuRef.value.initSkuData(row.id)
}
// 删除按钮
const removeSpu = async (row: SpuData) => {
    let result = await reqRemoveSpu((row.id as number))
    if (result.code == 200) {
        ElMessage({
            type: 'success',
            message: '删除成功'
        })
        // 重新获取数据
        getSPUList()
    } else {
        ElMessage({
            type: 'error',
            message: '删除失败'
        })
    }
}
// 当页面销毁前，清空仓库中的addAttr数据
onBeforeUnmount(() => {
    // 清空仓库中的addAttr数据
    categoryStore.$reset()
})
</script>

<style lang='scss'>
.card_btndiv {
    width: 100%;
    display: flex;
    justify-content: end;

    .card_div_btn {
        margin: 10px;
    }
}
</style>