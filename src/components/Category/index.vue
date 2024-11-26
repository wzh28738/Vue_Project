<template>
    <div>
        <el-card class="top_card">
            <!--各级分类的表单-->
            <el-form :inline="true" class="top_card_form">
                <!--一级分类-->
                <el-form-item label="一级分类">
                    <!--v-model="c1Id" 收集选中项的数据-->
                    <el-select @change="changeC1" v-model="categoryStore.c1Id" placeholder="Select" style="width: 240px;">
                        <!--label为显示的文本，value为下拉菜单选中项的数据-->
                        <el-option 
                            v-for="(c, index) in categoryStore.Category1List" 
                            :key="index" 
                            :label="c.name"
                            :value="c.id" 
                        />
                    </el-select>
                </el-form-item>
                <!--二级分类-->
                <el-form-item label="二级分类">
                    <el-select @change="changeC2" v-model="categoryStore.c2Id" placeholder="Select" style="width: 240px">
                        <el-option 
                            v-for="(c, index) in categoryStore.Category2List" 
                            :key="index" 
                            :label="c.name"
                            :value="c.id" 
                        />
                    </el-select>
                </el-form-item>
                <!--三级分类-->
                <el-form-item label="三级分类">
                    <el-select v-model="categoryStore.c3Id" placeholder="Select" style="width: 240px">
                        <el-option 
                            v-for="(c, index) in categoryStore.Category3List" 
                            :key="index" 
                            :label="c.name"
                            :value="c.id" 
                        />
                    </el-select>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script setup lang='ts' name='category'>
import { onMounted, ref} from 'vue';
import { useCategoryStore } from '../../store/modules/category';


const categoryStore = useCategoryStore();

// 挂载完毕时，获取一级分类的数据
onMounted(() => {
    categoryStore.getCategory1();
});
// 一级分类选中项改变时，获取二级分类的数据
const changeC1 = () => {
    // 获取二级分类的数据
    categoryStore.getCategory2();
};
// 二级分类选中项改变时，获取三级分类的数据
const changeC2 = () => {
    // 获取三级分类的数据
    categoryStore.getCategory3();
};
</script>

<style scoped lang='scss'>
.top_card_form {
    display: flex;
    justify-content: space-between;
    width: 100%;
}
</style>