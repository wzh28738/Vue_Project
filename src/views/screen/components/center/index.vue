<template>
    <div class="container">
        <div class="top">
            <div class="title">可视化数据大屏展示平台</div>
            <div class="warning">平台高峰预警信息(2条)</div>
        </div>
        <div class="center">
            <div class="text">景区实时客流量</div>
            <div class="map" ref="mapRef"></div>
        </div>
        <div class="bottom">
            <div class="text">未来30天客流量趋势图</div>
            <div class="chart" ref="chartRef"></div>
        </div>
    </div>

</template>

<script setup lang='ts' name='center'>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
// 引入地图json文件
import chinaJson from '../../mapJson/china.json'

// 地图dom
let mapRef = ref()
// 注册地图
echarts.registerMap('chinaMap', chinaJson as any)
// 底部折线图dom
let chartRef = ref()
// 底部折线图配置项
let lineChartOption = {
    title: {
        text: '访问量: w',
        textStyle: {
            color: '#27fcff',
        },
        top: 50,
        left: 20
    },
    xAxis: {
        type: 'category',
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        boundaryGap: false, // 去除X轴两侧留白
        splitLine: {
            show: false // 去除网格线
        },
        // x轴文本
        axisLabel: {
            color: '#27fcff', // 设置x轴文本颜色
            fontSize: 18 // 设置x轴文本大小
        },
    },
    yAxis: {
        type: 'value',
        splitLine: {
            show: false // 去除网格线
        },
        // y轴文本
        axisLabel: {
            color: '#27fcff', // 设置文本颜色
            fontSize: 18 // 设置文本大小
        }
    },
    series: [
        {
            type: 'line',
            data: [120, 200, 150, 80, 70, 110, 130],
            smooth: true, // 平滑曲线
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
        }
    ],
    // 网格位置
    grid: {
        left: 80,
        right: 50,
        top: 100,
        bottom: 50
    }
}
// 地图配置项
let mapOption = {
    geo: {
        map: 'chinaMap',
        roam: true,// 开启缩放效果
        // 地图文字
        label: {
            show: true,// 展示省份文字
            color: '#fff',
            fontSize: 17
        },
        // 地图区域颜色
        itemStyle: {
            // 地图区域颜色
            areaColor: 'rgba(0,0,0,0)',
            // 地图边框颜色
            borderColor: 'rgb(23,199,245)',
            // 地图边框宽度
            borderWidth: 1,
            
        },
        // 鼠标悬停效果
        emphasis: {
            itemStyle: {
                areaColor: 'skyblue',
            },
            label: {
                fontSize: 30,
                color: '#fff'
            }
        },
        zoom: 1.7, // 设置地图的默认展示大小
        center: [105.194, 35.9], // 设置地图的中心点
    },
    series: [
        {
            type: 'lines',// 设置类型为线,用于展示航线
            data: [
                {   // 航线坐标数据，第一个值为起点，第二个值为终点
                    coords: [
                        [116.405285, 39.904989],// 北京
                        [117.283042, 31.86119]// 安徽
                    ],
                },
                {
                    coords: [
                        [113.280637, 23.125178],// 广东
                        [106.504962, 29.533155],// 重庆
                    ],
                },
                {
                    coords: [
                        [117.283042, 31.86119],// 安徽
                        [121.509062, 25.044332],// 台湾
                    ],
                }
            ],
            // 航线样式
            lineStyle: {
                color: 'rgb(252,61,73)',
                width: 1,
                opacity: 0.8,
                curveness: 0.2,// 航线弧度
            },
            // 动画特效
            effect: {
                show: true,// 开启动画
                period: 6,// 动画速度
                symbol: 'arrow',// 箭头样式
                symbolSize: 10,// 箭头大小
                color: 'orange',// 箭头颜色
            }
        }
    ]
}

onMounted(() => {
    // 初始化底部折线图
    let lineChart = echarts.init(chartRef.value)
    lineChart.setOption(lineChartOption)
    // 初始化地图
    let mapChart = echarts.init(mapRef.value)
    mapChart.setOption(mapOption)

})
</script>

<style scoped lang='scss'>
.container {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    padding: 0px 50px;
}

.top {
    flex: .7;
    background: url('../../../../assets/images/dataScreen-header-center-bg.png') no-repeat;
    background-size: 100% 65%;
    display: flex;
    flex-direction: column;
    align-items: center;
    /**与container的padding抵消 */
    margin: 0px -50px;

    .title {
        font-size: 60px;
        color: #27fcff;
        height: 100px;
        line-height: 150px;
    }

    .warning {
        font-size: 20px;
        color: #fff;
        width: 1260px;
        height: 90px;
        margin-top: 50px;
        background: url('../../../../assets/images/dataScreen-header-warn-bg.png') no-repeat;
        background-size: 100% 100%;
        text-align: center;
        line-height: 80px
    }
}

.center {
    flex: 3;
    color: white;

    .map {
        width: 100%;
        height: 95%;
    }
}

.bottom {
    flex: 1.2;
    width: 100%;
    height: 100%;
    background: url('../../../../assets/images/dataScreen-main-cb.png') no-repeat;
    background-size: cover;

    .text {
        height: 50px;
        font-size: 30px;
        color: white;
        background: url('../../../../assets/images/dataScreen-title.png') no-repeat;
        background-position: left bottom;
    }

    .chart {
        height: 100%;
        width: 100%;
    }

}
</style>