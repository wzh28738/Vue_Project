<template>
    <!--数据大屏左侧-->
    <div class="container">
        <!--首页-->
        <div class="top">
            <span class="topBtn">首页</span>
        </div>
        <!--实时游客统计-->
        <div class="content_one">
            <div class="content_one_top">
                <span class="travelers">实时游客统计</span>
                <span class="number">可预约总量:10000人</span>
            </div>
            <div class="content_one_bottom">
                <div class="number_box">
                    <div v-for="(item, index) in people" :key="index">{{ item }}</div>
                    <div v-if="people == ''"> 0</div>
                    <div>人</div>
                </div>
                <!--水球图-->
                <div class="circle_box" ref="waterChartsRef"></div>
            </div>
        </div>
        <!--男女比例-->
        <div class="content_two">
            <div class="content_tow_top">
                <span class="persons">男女比例</span>
            </div>
            <div class="content_one_bottom">
                <div class="avatar_box">
                    <div class="man">
                        <div class="man_text">男士</div>
                        <div class="man_avatar"></div>
                    </div>
                    <div class="woman">
                        <div class="woman_text">女士</div>
                        <div class="woman_avatar"></div>
                    </div>
                </div>
                <div class="chart" ref="columChartRef"></div>
            </div>
        </div>
        <!--年龄比例-->
        <div class="content_three">
            <div class="content_three_top">
                <span class="age">年龄比例</span>
            </div>
            <div class="content_three_bottom" ref="ageChartsRef">

            </div>
        </div>
    </div>
</template>

<script setup lang='ts' name='top'>
import { ref, onMounted } from 'vue';
// 引入echarts
import * as echarts from 'echarts';
// 引入echarts的liquidfill插件
import 'echarts-liquidfill';


let people = ref('12345');
let waterChartsRef = ref();
let columChartRef = ref();
let ageChartsRef = ref();
let ageData = ref([
    { name: '18-25', value: 20 },
    { name: '26-35', value: 30 },
    { name: '36-45', value: 40 },
    { name: '46-55', value: 50 },
    { name: '56-65', value: 60 },
    { name: '65+', value: 70 },
])

onMounted(() => {
    // 初始化水球图
    let waterChart = echarts.init(waterChartsRef.value);
    // 设置水球图配置项
    waterChart.setOption({
        // 标题
        title: {
            text: '预约量',
            left: 'center',
            top:15,
            textStyle: {
                color: '#fff',
                fontSize: 30,
            }
        
        },
        // 图例
        series: {
            type: 'liquidFill',// 设置图表类型为水球图
            data: [0.5, 0.6, 0.3],// 设置水球图数据
            redius: '100%',// 设置水球图半径
            label: {
                show: true,
                fontSize: 35,
            },
        },
        // 布局
        grid: {
            left: 0,
            right: 0,
            bottom: 0,
            top: 0
        }
    });

    // 初始化柱状图
    let columChart = echarts.init(columChartRef.value);
    // 设置柱状图配置项
    columChart.setOption({
        // 标题
        title: {
            text: '男女比例',
            textStyle: {
                color: '#fff',
            }
        },
        // x|y轴
        xAxis: { show: false, min: 0, max: 100 },
        yAxis: { show: false, type: 'category' },
        // 图例
        series: [
            {
                type: 'bar',// 设置图表类型为柱状图
                data: [70],// 设置柱状图数据
                barWidth: 20,// 设置柱状图宽度
                barGap: "-100%",// 设置柱状图间距
                z: 100,
                itemStyle: {
                    color: 'skyblue',
                    borderRadius: 10,
                }
            },
            {
                type: 'bar',// 设置图表类型为柱状图
                data: [100],// 设置柱状图数据
                barWidth: 20,// 设置柱状图宽度
                barGap: "-100%",// 设置柱状图间距
                itemStyle: {
                    color: 'pink',
                    borderRadius: 10,
                }
            },
        ],
        // 布局
        grid: {
            left: 0,
            right: 0,
            bottom: 0,
            top: 0
        },
    }
    )

    // 初始化年龄比例图
    let ageChart = echarts.init(ageChartsRef.value);
    // 设置年龄比例图配置项
    ageChart.setOption({
        title: {
            text: '年龄比例',
        },
        series: [
            {
                type: 'pie',
                data: ageData.value,
                radius: ['40%', '70%'],// 设置饼图半径,第一个参数为内半径，第二个参数为外半径
                itemStyle: {
                    borderRadius: 10,
                    borderColor: 'blue',
                    borderWidth: 1
                },
                label: {
                    show: true,
                    position: 'inside',
                    formatter: '{d}%',
                    color: 'white'
                }
            }
        ],
        // 图例组件
        legend: [
            {
                data: ageData.value,
                // 离右侧距离
                right: '10',
                // 离顶部距离
                top: '70',
                orient: 'vertical',// 方向
                textStyle: {
                    color: 'white',
                    fontSize: 15
                }
            }
        ],
        grid: {
            left: 0,
            right: 0,
            bottom: 0,
            top: 0
        }
    })
})

</script>

<style scoped lang='scss'>
.container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .top {
        background: url('../../../../assets/images/dataScreen-header-left-bg.png') no-repeat;
        background-size: cover;
        display: flex;
        justify-content: left;
        align-items: center;

        .topBtn {
            background: url('../../../../assets/images/dataScreen-header-btn-bg-l.png') no-repeat;
            background-size: cover;
            width: 250px;
            height: 75px;
            font-size: 40px;
            color: #27fcff;
            display: flex;
            justify-content: center;
            line-height: 60px;
        }
    }

    .content_one {
        flex: 1;
        background: url('../../../../assets/images/dataScreen-main-lt.png') no-repeat;
        background-size: 90%;
        background-position: right top;
        padding-left: 10%;
        margin-top: 30px;

        .content_one_top {
            display: flex;
            justify-content: space-between;
            height: 50px;

            .travelers {
                font-size: 30px;
                color: white;
                background: url('../../../../assets/images/dataScreen-title.png') no-repeat;
                background-position: left bottom;
            }

            .number {
                font-size: 20px;
                color: white;
                margin-top: 25px;
                margin-right: 5px;
            }
        }

        .content_one_bottom {
            padding-top: 20px;
            height: 300px;

            .number_box {
                height: 60px;
                font-size: 40px;
                color: #27fcff;
                display: flex;
                justify-content: center;

                div {
                    background: url('../../../../assets/images/total.png');
                    background-size: 60px;
                    width: 60px;
                    height: 60px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
            }

            .circle_box {
                width: 100%;
                height: 100%;
            }
        }
    }

    .content_two {
        flex: 1;
        background: url('../../../../assets/images/dataScreen-main-lt.png') no-repeat;
        background-size: cover;
        background-size: 90%;
        background-position: right top;
        padding-left: 10%;
        margin-top: 40px;

        .content_tow_top {
            display: flex;
            justify-content: space-between;
            height: 50px;

            .persons {
                font-size: 30px;
                color: white;
                background: url('../../../../assets/images/dataScreen-title.png') no-repeat;
                background-position: left bottom;
            }
        }

        .content_one_bottom {
            width: 80%;
            height: 70%;
            margin-left: 10%;
            margin-top: 10%;
            display: flex;
            justify-content: space-between;
            flex-direction: column;
            align-items: center;

            .avatar_box {
                width: 80%;
                height: 70%;
                display: flex;
                justify-content: space-between;

                .man {
                    background: url('../../../../assets/images/man-bg.png') no-repeat;
                    background-size: cover;
                    width: 150px;
                    height: 160px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;

                    .man_text {
                        font-size: 20px;
                        color: white;
                        text-align: center;
                    }

                    .man_avatar {
                        margin-top: 20px;
                        width: 100px;
                        height: 100px;
                        background: url('../../../../assets/images/man.png') no-repeat;
                        background-size: cover;
                    }
                }

                .woman {
                    background: url('../../../../assets/images/woman-bg.png') no-repeat;
                    background-size: cover;
                    width: 150px;
                    height: 160px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;

                    .woman_text {
                        font-size: 20px;
                        color: white;
                        text-align: center;
                    }

                    .woman_avatar {
                        margin-top: 20px;
                        width: 100px;
                        height: 100px;
                        background: url('../../../../assets/images/woman.png') no-repeat;
                        background-size: cover;
                    }
                }
            }

            .chart {
                width: 100%;
                height: 80px;
            }
        }

    }

    .content_three {
        flex: 1;
        background: url('../../../../assets/images/dataScreen-main-lt.png') no-repeat;
        background-size: cover;
        background-size: 90%;
        background-position: right top;
        padding-left: 10%;
        margin-top: 40px;

        .content_three_top {
            display: flex;
            justify-content: space-between;
            height: 50px;

            .age {
                font-size: 30px;
                color: white;
                background: url('../../../../assets/images/dataScreen-title.png') no-repeat;
                background-position: left bottom;
            }
        }

        .content_three_bottom {
            width: 100%;
            height: 80%;
            margin-left: -10%;
            margin-top: 5%;

        }
    }
}
</style>