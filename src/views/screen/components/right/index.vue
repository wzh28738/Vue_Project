<template>
    <!--数据大屏右侧-->
    <div class="container">
        <!--顶部-->
        <div class="top">
            <span class="time">当前时间2023年10月11号</span>
            <span class="topBtn">统计报告</span>
        </div>
        <!--内容1-->
        <div class="content_one">
            <div class="content_one_top">
                <span class="travelers">热门景区排行</span>
            </div>
            <div class="content_one_bottom">
                <div class="title">
                    <span>排名</span>
                    <span>景区</span>
                    <span style="margin-left: 80px;">预约数量</span>
                </div>
                <!--排行图表-->
                <div class="number_box">
                    <div class="propress_box" ref="progressRef"></div>
                    <span>8.00w</span>
                </div>
            </div>
        </div>
        <!--内容2-->
        <div class="content_two">
            <div class="content_tow_top">
                <span class="persons">年度客流量对比</span>
            </div>
            <div class="content_one_bottom" ref="annualRef">

            </div>
        </div>
        <!--内容3-->
        <div class="content_three">
            <div class="content_three_top">
                <span class="age">预约渠道数据统计</span>
            </div>
            <div class="platformData" ref="platformDataRef"></div>
        </div>
    </div>
</template>

<script setup lang='ts' name='top'>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
// 进度条实例与配置
let progressRef = ref()
let progressOptions = {
    xAxis: {
        type: 'value',
        show: false,
        // 进度条的最大值与最小值
        min: 0,
        max: 100
    },
    yAxis: {
        type: 'category',
        data: [['NO.1', '故宫'], '长城', '天坛', '颐和园', '明十三陵'],
        axisLine: {
            show: false
        },
        axisTick: {
            show: false
        },
        axisLabel: {
            color: '#fff',
            fontSize: 12,
            margin: 20,// y轴文本距离y轴的距离
        },

    },
    series: {
        type: 'bar',
        data: [10, 20, 30, 40, 50],
        // 柱状图的文本
        label: {
            show: true,
            position: 'insideRight',
            formatter: '{c}%',
            color: '#fff',
        },
        showBackground: true,// 是否显示柱状图的背景
        backgroundStyle: {// 柱状图的背景样式
            color: 'rgba(0,0,0,0)',// 背景颜色
            borderRadius: 20,// 背景的圆角
            borderWidth: 2,// 背景的边框宽度
            borderColor: 'rgba(0,108,237,1)',// 背景的边框颜色
        },
        itemStyle: {// 柱状图样式
            borderRadius: 20,// 柱状图的圆角
            color: function (params: any) {// 柱状图颜色
                let colorList = ['#00c6ff', '#006ced', '#ffe000', '#ffa800', '#ff5b00', '#ff3000']
                return colorList[params.dataIndex]
            },
        },
        barWidth: 20,// 柱状图的宽度
    },
    grid: {
        left: 140,
        right: 30,
        top: 30,
        bottom: 30
    },
    tooltip: {// 提示框
    }
}
// 年度客流量对比实例与配置
let annualRef = ref()
let annualOptions = {
    xAxis: {
        type: 'category',
        data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        axisLabel: {
            color: '#fff',
            fontSize: 12,
        }
    },
    yAxis: {
        type: 'value',
        splitLine: {
            show: false
        },
        axisLabel: {
            color: '#fff',
            fontSize: 12,
        }
    },
    series: [
        // line1
        {
            name: '2022年',
            type: 'line',
            data: [12, 200, 150, 80, 70, 110, 130, 100, 90, 70, 60, 50],
            smooth: true,// 是否平滑曲线
            areaStyle: { // 填充颜色
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                        {
                            offset: 0,
                            color: 'orange' // 0% 处的颜色
                        },
                        {
                            offset: 1,
                            color: 'rgba(255,255,255,0)', // 100% 处的颜色
                        }
                    ],
                    global: false // 缺省为 false
                }
            },
            itemStyle: {
                color: 'orange' // 折线颜色
            },
        },
        // line2
        {
            name: '2023年',
            type: 'line',
            data: [89, 90, 100, 8, 56, 24, 57, 99, 143, 545, 678, 234],
            smooth: true,
            areaStyle: { // 填充颜色
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                        {
                            offset: 0,
                            color: '#00c6ff' // 0% 处的颜色
                        },
                        {
                            offset: 1,
                            color: 'rgba(255,255,255,0)', // 100% 处的颜色
                        }
                    ],
                    global: false // 缺省为 false
                }
            },
            itemStyle: {
                color: '#00c6ff' // 折线颜色
            },
        },
        // line3
        {
            name: '2024年',
            type: 'line',
            data: [23, 454, 67, 89, 12, 34, 56, 78, 90, 332, 34, 445],
            smooth: true,
            areaStyle: { // 填充颜色
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                        {
                            offset: 0,
                            color: '#ff006a' // 0% 处的颜色
                        },
                        {
                            offset: 1,
                            color: 'rgba(255,255,255,0)', // 100% 处的颜色
                        }
                    ],
                    global: false // 缺省为 false
                }
            },
            itemStyle: {
                color: '#ff006a' // 折线颜色
            },
        },
    ],
    legend: {
        data: [
            {
                name: '2022年',
                // 强制设置图形为圆。
                icon: 'circle',
                // 设置文本为红色
                textStyle: {
                    color: 'white'
                }
            },
            {
                name: '2023年',
                // 强制设置图形为圆。
                icon: 'circle',
                // 设置文本为红色
                textStyle: {
                    color: 'white'
                }
            },
            {
                name: '2024年',
                // 强制设置图形为圆。
                icon: 'circle',
                // 设置文本为红色
                textStyle: {
                    color: 'white'
                }
            }
        ],
        top: 20,
        width: 400,
    },
    tooltip: {// 提示框
        trigger: 'axis',
        axisPointer: {
            type: 'cross',
            label: {
                backgroundColor: '#6a7985'
            }
        }
    },
    grid: {
        left: 50,
        right: 40,
        top: 80,
        bottom: 30
    },
}
// 预约渠道数据统计实例与配置
let platformDataRef = ref()
let platformDataOptions = {
    tooltip: {
        trigger: 'item'
    },
    legend: {
        top: '5%',
        left: 'center',
        textStyle: {
            color: 'white', // 设置图例文字颜色
        }
    },
    series: [
        {
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            padAngle: 5,
            itemStyle: {
                borderRadius: 10
            },
            label: {
                show: false,
                position: 'center'
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: 40,
                    fontWeight: 'bold'
                }
            },
            labelLine: {
                show: false
            },
            data: [
                { value: 1048, name: '美团' },
                { value: 735, name: '携程' },
                { value: 580, name: '飞猪' },
                { value: 484, name: '去哪儿' },
                { value: 300, name: '其他' }
            ]
        }],
    
}
onMounted(() => {
    // 初始化进度条
    let progressChart = echarts.init(progressRef.value)
    progressChart.setOption(progressOptions)
    // 初始化年度客流量对比
    let annualChart2 = echarts.init(annualRef.value)
    annualChart2.setOption(annualOptions)
    // 初始化预约渠道数据统计
    let platformChart = echarts.init(platformDataRef.value)
    platformChart.setOption(platformDataOptions)
})


</script>

<style scoped lang='scss'>
.container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .top {
        background: url('../../../../assets/images/dataScreen-header-right-bg.png') no-repeat;
        background-size: cover;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #27fcff;

        .time {
            padding-left: 10px;
            font-size: 25px;
        }

        .topBtn {
            background: url('../../../../assets/images/dataScreen-header-btn-bg-r.png') no-repeat;
            background-size: cover;
            width: 250px;
            height: 75px;
            font-size: 40px;
            display: flex;
            justify-content: center;
            line-height: 60px;
        }
    }

    .content_one {
        flex: 1;
        background: url('../../../../assets/images/dataScreen-main-lt.png') no-repeat;
        background-size: 90%;
        background-position: left top;
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
            padding-top: 15px;
            width: 90%;
            height: 87%;

            .title {
                height: 20%;
                font-size: 22px;
                display: flex;
                align-items: center;
                color: orange;
                background: url('../../../../assets/images/rankingChart-bg.png') no-repeat;
                background-size: 95%;
                background-position: center;

                span {
                    margin: 0px 10px 0px 30px;
                }
            }

            .number_box {
                width: 100%;
                height: 80%;
                color: white;

                .propress_box {
                    width: 100%;
                    height: 100%;
                    color: white;
                    font-size: 20px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-left: 30px;
                    padding-right: 30px;
                }
            }
        }
    }

    .content_two {
        flex: 1;
        background: url('../../../../assets/images/dataScreen-main-lt.png') no-repeat;
        background-size: cover;
        background-size: 90%;
        background-position: left top;
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
            width: 90%;
            height: 85%;
            display: flex;
            justify-content: center;

        }

    }

    .content_three {
        flex: 1;
        background: url('../../../../assets/images/dataScreen-main-lt.png') no-repeat;
        background-size: cover;
        background-size: 90%;
        background-position: left top;
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

        .platformData {
            width: 90%;
            height: 60%;
        }
    }
}

.form_item {
    width: 500px;
}

.propress {
    width: 200px;
    max-width: 200px;
    font-size: 5px;
}
</style>