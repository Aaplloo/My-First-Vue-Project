<template>
  <div class="plan-distribution">
    <!-- 主标题区域 -->
    <div class="title-section">
      <div class="main-title-wrapper">
        <div class="title-decoration"></div>
        <h2 class="main-title">计划分布</h2>
      </div>
      <div class="tabs-section">
        <div 
          class="tab" 
          :class="{ active: activeTab === 'production' }"
          @click="switchTab('production')"
        >生产</div>
        <div 
          class="tab" 
          :class="{ active: activeTab === 'institute' }"
          @click="switchTab('institute')"
        >院所</div>
        <div 
          class="tab" 
          :class="{ active: activeTab === 'service' }"
          @click="switchTab('service')"
        >后服</div>
      </div>
    </div>
    
    <!-- 图表区域 -->
    <div class="chart-container">
      <!-- 生产 - 当前图表 -->
      <div v-if="activeTab === 'production'" class="echarts-chart" @click="showTableData">
        <div ref="chartRef" class="chart-inner"></div>
        <div class="chart-overlay">
          <div class="click-hint">点击查看详细数据</div>
        </div>
      </div>
      
      <!-- 院所 - 柱状图 -->
      <div v-else-if="activeTab === 'institute'" class="echarts-chart" @click="showTableData">
        <div ref="instituteChartRef" class="chart-inner"></div>
        <div class="chart-overlay">
          <div class="click-hint">点击查看详细数据</div>
        </div>
      </div>
      
      <!-- 后服 - 柱状图 -->
      <div v-else-if="activeTab === 'service'" class="echarts-chart" @click="showTableData">
        <div ref="serviceChartRef" class="chart-inner"></div>
        <div class="chart-overlay">
          <div class="click-hint">点击查看详细数据</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import * as echarts from 'echarts'

const chartRef = ref(null)
let chartInstance = null

// 新增图表引用
const instituteChartRef = ref(null)
const serviceChartRef = ref(null)
let instituteChartInstance = null
let serviceChartInstance = null

// 数据存储
const chartData = ref({
  categories: ['蜀南气矿', '重庆气矿', '川中北部采矿区', '川中油气矿', '川东北气矿', '川西北气矿'],
  projectCounts: [32, 16, 0, 39, 32, 0],     // 项目数量(柱状图)
  fundingPlans: [4.1, 2.5, 0, 0, 0, 2.0]    // 当年资金计划(折线图，万元)
})

// 院所数据
const instituteData = ref({
  categories: ['研究院', '设计院', '工程院', '技术院', '检测院', '培训院'],
  projectCounts: [28, 35, 42, 19, 31, 15],     // 项目数量
  fundingPlans: [3.2, 4.8, 5.6, 2.1, 3.8, 1.5]    // 资金计划(万元)
})

// 后服数据
const serviceData = ref({
  categories: ['后勤部', '安保部', '医疗部', '餐饮部', '运输部', '维修部'],
  projectCounts: [18, 25, 12, 22, 16, 29],     // 项目数量
  fundingPlans: [2.3, 3.1, 1.8, 2.9, 2.2, 3.8]    // 资金计划(万元)
})

// 触发显示表格数据事件
const showTableData = () => {
  // 触发自定义事件，通知父组件显示表格数据
  emit('showTableData', activeTab.value)
}

// 定义事件
const emit = defineEmits(['showTableData'])

// 从CSV文件读取数据
const loadDataFromCSV = async () => {
  try {
    // 加载生产数据
    const productionResponse = await fetch('/plan-distribution-datas/production-data.csv')
    const productionCsvText = await productionResponse.text()
    const productionLines = productionCsvText.trim().split('\n')
    
    const productionData = {
      categories: [],
      projectCounts: [],
      fundingPlans: []
    }
    
    productionLines.slice(1).forEach((line) => {
      const values = line.split(',')
      productionData.categories.push(values[1])
      productionData.projectCounts.push(parseInt(values[2]))
      productionData.fundingPlans.push(parseFloat(values[3]) / 1000) // 转换为万元
    })
    
    chartData.value = productionData
    console.log('生产数据加载成功:', productionData)
    
    // 加载院所数据
    const instituteResponse = await fetch('/plan-distribution-datas/institute-data.csv')
    const instituteCsvText = await instituteResponse.text()
    const instituteLines = instituteCsvText.trim().split('\n')
    
    const instituteDataResult = {
      categories: [],
      projectCounts: [],
      fundingPlans: []
    }
    
    instituteLines.slice(1).forEach((line) => {
      const values = line.split(',')
      instituteDataResult.categories.push(values[1])
      instituteDataResult.projectCounts.push(parseInt(values[2]))
      instituteDataResult.fundingPlans.push(parseFloat(values[3]) / 1000) // 转换为万元
    })
    
    instituteData.value = instituteDataResult
    console.log('院所数据加载成功:', instituteDataResult)
    
    // 加载后服数据
    const serviceResponse = await fetch('/plan-distribution-datas/service-data.csv')
    const serviceCsvText = await serviceResponse.text()
    const serviceLines = serviceCsvText.trim().split('\n')
    
    const serviceDataResult = {
      categories: [],
      projectCounts: [],
      fundingPlans: []
    }
    
    serviceLines.slice(1).forEach((line) => {
      const values = line.split(',')
      serviceDataResult.categories.push(values[1])
      serviceDataResult.projectCounts.push(parseInt(values[2]))
      serviceDataResult.fundingPlans.push(parseFloat(values[3]) / 1000) // 转换为万元
    })
    
    serviceData.value = serviceDataResult
    console.log('后服数据加载成功:', serviceDataResult)
    
  } catch (error) {
    console.error('加载CSV数据失败:', error)
    console.log('使用默认数据')
  }
}

// 当前激活的tab
const activeTab = ref('production')

// 切换tab的方法
const switchTab = (tabName) => {
  activeTab.value = tabName
  
  // 根据不同的tab初始化对应的图表
  nextTick(() => {
    setTimeout(() => {
      if (tabName === 'production') {
        initChart()
      } else if (tabName === 'institute') {
        initInstituteChart()
      } else if (tabName === 'service') {
        initServiceChart()
      }
    }, 100)
  })
}

// 监听activeTab变化，当切换到非图表tab时销毁图表实例
watch(activeTab, (newTab) => {
  // 销毁所有图表实例
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
  if (instituteChartInstance) {
    instituteChartInstance.dispose()
    instituteChartInstance = null
  }
  if (serviceChartInstance) {
    serviceChartInstance.dispose()
    serviceChartInstance = null
  }
})

// 初始化图表
const initChart = () => {
  console.log('开始初始化图表')
  console.log('chartRef.value:', chartRef.value)
  console.log('echarts对象:', echarts)
  
  if (chartRef.value) {
    try {
      chartInstance = echarts.init(chartRef.value)
      console.log('图表实例创建成功:', chartInstance)
      
      // 先用简单配置测试
      const option = {
        tooltip: {
          trigger: 'axis',
          formatter: function(params) {
            let result = params[0].name + '<br/>'
            params.forEach(function(item) {
              if (item.seriesName === '项目数量') {
                result += item.marker + item.seriesName + ': ' + item.value + '项<br/>'
              } else {
                result += item.marker + item.seriesName + ': ' + item.value + '万元<br/>'
              }
            })
            return result
          }
        },
        legend: {
          data: ['项目数量', '当年资金计划'],
          top: 33,
          left: 'center',
          textStyle: {
            fontSize: 11
          },
          itemWidth: 12,
          itemHeight: 8
        },
                 xAxis: {
           type: 'category',
           data: chartData.value.categories,
           axisLabel: {
             interval: 0,
             rotate: 0,
             fontSize: 10,
             formatter: function(value) {
               // 每行最多5个字，超过则换行
               if (value.length > 5) {
                 return value.substring(0, 5) + '\n' + value.substring(5)
               }
               return value
             }
           }
         },
                 yAxis: [
           {
             type: 'value',
             name: '(项)',
             position: 'left',
             min: 0,
             max: 50,
             interval: 10,
             axisLabel: {
               formatter: '{value}',
               align: 'right'
             },
             nameTextStyle: {
               color: '#1246E1',
               align: 'right'
             },
             nameLocation: 'end'
           },
           {
             type: 'value',
             name: '(万元)',
             position: 'right',
             min: 0,
             max: 5,
             interval: 1,
             axisLabel: {
               formatter: '{value}',
               align: 'left'
             },
             nameTextStyle: {
               color: '#7ED321',
               align: 'left'
             },
             nameLocation: 'end'
           }
         ],
        series: [
                     {
             name: '项目数量',
             type: 'bar',
             yAxisIndex: 0,
             data: chartData.value.projectCounts,
             itemStyle: {
               color: '#2470FF'
             },
             barWidth: '30%'
           },
           {
             name: '当年资金计划',
             type: 'bar',
             yAxisIndex: 1,
             data: chartData.value.fundingPlans,
             itemStyle: {
               color: '#2DEF6F'
             },
             barWidth: '30%'
           }
        ]
      }
      
      chartInstance.setOption(option)
      console.log('图表配置已设置，option:', option)
    } catch (error) {
      console.error('初始化图表时出错:', error)
    }
  } else {
    console.error('chartRef.value 为空，DOM元素未找到')
  }
}

// 初始化院所图表
const initInstituteChart = () => {
  if (instituteChartRef.value) {
    try {
      instituteChartInstance = echarts.init(instituteChartRef.value)
      console.log('院所图表实例创建成功:', instituteChartInstance)

      const option = {
        tooltip: {
          trigger: 'axis',
          formatter: function(params) {
            let result = params[0].name + '<br/>'
            params.forEach(function(item) {
              if (item.seriesName === '项目数量') {
                result += item.marker + item.seriesName + ': ' + item.value + '项<br/>'
              } else {
                result += item.marker + item.seriesName + ': ' + item.value + '万元<br/>'
              }
            })
            return result
          }
        },
        legend: {
          data: ['项目数量', '资金计划'],
          top: 33,
          left: 'center',
          textStyle: {
            fontSize: 11
          },
          itemWidth: 12,
          itemHeight: 8
        },
        xAxis: {
          type: 'category',
          data: instituteData.value.categories,
          axisLabel: {
            interval: 0,
            rotate: 0,
            fontSize: 10,
            formatter: function(value) {
              // 每行最多5个字，超过则换行
              if (value.length > 5) {
                return value.substring(0, 5) + '\n' + value.substring(5)
              }
              return value
            }
          }
        },
        yAxis: [
          {
            type: 'value',
            name: '(项)',
            position: 'left',
            min: 0,
            max: 50,
            interval: 10,
            axisLabel: {
              formatter: '{value}',
              align: 'right'
            },
            nameTextStyle: {
              color: '#1246E1',
              align: 'right'
            },
            nameLocation: 'end'
          },
          {
            type: 'value',
            name: '(万元)',
            position: 'right',
            min: 0,
            max: 5,
            interval: 1,
            axisLabel: {
              formatter: '{value}',
              align: 'left'
            },
            nameTextStyle: {
              color: '#7ED321',
              align: 'left'
            },
            nameLocation: 'end'
          }
        ],
        series: [
          {
            name: '项目数量',
            type: 'bar',
            yAxisIndex: 0,
            data: instituteData.value.projectCounts,
            itemStyle: {
              color: '#2470FF'
            },
            barWidth: '30%'
          },
          {
            name: '资金计划',
            type: 'bar',
            yAxisIndex: 1,
            data: instituteData.value.fundingPlans,
            itemStyle: {
              color: '#2DEF6F'
            },
            barWidth: '30%'
          }
        ]
      }
      instituteChartInstance.setOption(option)
      console.log('院所图表配置已设置，option:', option)
    } catch (error) {
      console.error('初始化院所图表时出错:', error)
    }
  } else {
    console.error('instituteChartRef.value 为空，DOM元素未找到')
  }
}

// 初始化后服图表
const initServiceChart = () => {
  if (serviceChartRef.value) {
    try {
      serviceChartInstance = echarts.init(serviceChartRef.value)
      console.log('后服图表实例创建成功:', serviceChartInstance)

      const option = {
        tooltip: {
          trigger: 'axis',
          formatter: function(params) {
            let result = params[0].name + '<br/>'
            params.forEach(function(item) {
              if (item.seriesName === '项目数量') {
                result += item.marker + item.seriesName + ': ' + item.value + '项<br/>'
              } else {
                result += item.marker + item.seriesName + ': ' + item.value + '万元<br/>'
              }
            })
            return result
          }
        },
        legend: {
          data: ['项目数量', '资金计划'],
          top: 33,
          left: 'center',
          textStyle: {
            fontSize: 11
          },
          itemWidth: 12,
          itemHeight: 8
        },
        xAxis: {
          type: 'category',
          data: serviceData.value.categories,
          axisLabel: {
            interval: 0,
            rotate: 0,
            fontSize: 10,
            formatter: function(value) {
              // 每行最多5个字，超过则换行
              if (value.length > 5) {
                return value.substring(0, 5) + '\n' + value.substring(5)
              }
              return value
            }
          }
        },
        yAxis: [
          {
            type: 'value',
            name: '(项)',
            position: 'left',
            min: 0,
            max: 50,
            interval: 10,
            axisLabel: {
              formatter: '{value}',
              align: 'right'
            },
            nameTextStyle: {
              color: '#1246E1',
              align: 'right'
            },
            nameLocation: 'end'
          },
          {
            type: 'value',
            name: '(万元)',
            position: 'right',
            min: 0,
            max: 5,
            interval: 1,
            axisLabel: {
              formatter: '{value}',
              align: 'left'
            },
            nameTextStyle: {
              color: '#7ED321',
              align: 'left'
            },
            nameLocation: 'end'
          }
        ],
        series: [
          {
            name: '项目数量',
            type: 'bar',
            yAxisIndex: 0,
            data: serviceData.value.projectCounts,
            itemStyle: {
              color: '#2470FF'
            },
            barWidth: '30%'
          },
          {
            name: '资金计划',
            type: 'bar',
            yAxisIndex: 1,
            data: serviceData.value.fundingPlans,
            itemStyle: {
              color: '#2DEF6F'
            },
            barWidth: '30%'
          }
        ]
      }
      serviceChartInstance.setOption(option)
      console.log('后服图表配置已设置，option:', option)
    } catch (error) {
      console.error('初始化后服图表时出错:', error)
    }
  } else {
    console.error('serviceChartRef.value 为空，DOM元素未找到')
  }
}

// 窗口大小改变时重新调整图表
const handleResize = () => {
  if (chartInstance && activeTab.value === 'production') {
    chartInstance.resize()
  }
  if (instituteChartInstance && activeTab.value === 'institute') {
    instituteChartInstance.resize()
  }
  if (serviceChartInstance && activeTab.value === 'service') {
    serviceChartInstance.resize()
  }
}

// 强制重新调整图表大小
const forceResize = () => {
  if (chartInstance && activeTab.value === 'production') {
    chartInstance.resize()
  }
  if (instituteChartInstance && activeTab.value === 'institute') {
    instituteChartInstance.resize()
  }
  if (serviceChartInstance && activeTab.value === 'service') {
    serviceChartInstance.resize()
  }
}

// 重新初始化图表
const reinitChart = () => {
  if (chartInstance) {
    chartInstance.dispose()
  }
  setTimeout(() => {
    initChart()
  }, 100)
}

// 手动触发图表重新渲染
const refreshChart = () => {
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
  nextTick(() => {
    setTimeout(() => {
      initChart()
      setTimeout(() => {
        if (chartInstance) {
          chartInstance.resize()
        }
      }, 200)
    }, 100)
  })
}

// 暴露数据供外部使用
defineExpose({
  chartData,
  instituteData,
  serviceData,
  reinitChart,
  forceResize,
  refreshChart,
  activeTab,
  switchTab,
  loadDataFromCSV
})

// 生命周期钩子
onMounted(() => {
  // 延迟加载CSV数据，确保组件先渲染
  setTimeout(() => {
    loadDataFromCSV()
  }, 100)
  
  nextTick(() => {
    setTimeout(() => {
      loadDataFromCSV() // 加载数据
      initChart()
      // 初始化后多次调整大小确保生效
      setTimeout(() => {
        forceResize()
      }, 200)
      setTimeout(() => {
        forceResize()
      }, 500)
      setTimeout(() => {
        forceResize()
      }, 1000)
      // 额外调用刷新方法
      setTimeout(() => {
        refreshChart()
      }, 1500)
    }, 100)
  })
  window.addEventListener('resize', handleResize)
  
  // 监听容器尺寸变化
  const resizeObserver = new ResizeObserver(() => {
    if (chartInstance && activeTab.value === 'production') {
      setTimeout(() => {
        chartInstance.resize()
      }, 100)
    }
  })
  
  if (chartRef.value) {
    resizeObserver.observe(chartRef.value)
  }
  if (instituteChartRef.value) {
    resizeObserver.observe(instituteChartRef.value)
  }
  if (serviceChartRef.value) {
    resizeObserver.observe(serviceChartRef.value)
  }
})

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.dispose()
  }
  if (instituteChartInstance) {
    instituteChartInstance.dispose()
  }
  if (serviceChartInstance) {
    serviceChartInstance.dispose()
  }
  window.removeEventListener('resize', handleResize)
  
  // 清理ResizeObserver
  if (chartRef.value) {
    const resizeObserver = new ResizeObserver(() => {})
    resizeObserver.disconnect()
  }
  if (instituteChartRef.value) {
    const resizeObserver = new ResizeObserver(() => {})
    resizeObserver.disconnect()
  }
  if (serviceChartRef.value) {
    const resizeObserver = new ResizeObserver(() => {})
    resizeObserver.disconnect()
  }
})
</script>

<style scoped>
.plan-distribution {
  background: white;
  border-radius: 0.417vw;
  padding: 1vh 0.571vw 1.389vh 0.571vw;
  box-shadow: 0 0.185vh 0.417vw rgba(0, 0, 0, 0.1);
  width: 25.52vw;
  height: 29.859vh;
  position: fixed;
  left: 0.521vw;
  bottom: 0.926vh;
  overflow: visible;
}

.title-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.main-title-wrapper {
  background: linear-gradient(to right, #ECF3FF 0%, rgba(36, 112, 255, 0) 100%);
  padding: 0.463vh 1.042vw 0.463vh 0;
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.title-decoration {
  width: 0.456vw;
  height: 2.467vh;
  background: #2470FF;
  margin-right: 0.817vw;
}

.main-title {
  color: #2470FF;
  font-size: 1.042vw;
  font-weight: bold;
  margin: 0;
}

.tabs-section {
  display: flex;
  gap: 0.417vw;
  margin-left: auto;
  position: relative;
  z-index: 10;
}

.tab {
  padding: 0.556vh 0.625vw;
  border-radius: 0.208vw;
  font-size: 0.625vw;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #F2F2F2;
  color: #999999;
  border: 0.052vw solid #E9ECEF;
  position: relative;
  z-index: 10;
}

.tab.active {
  background: #2470FF;
  color: white;
  border-color: #2470FF;
}

.tab:hover:not(.active) {
  background: #E9ECEF;
}

.chart-container {
  height: calc(100%);
  padding: 0.926vh 0.26vw;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: visible;
  margin-top: -2.5vh;
  position: relative;
  z-index: 1;
}

.echarts-chart {
  width: 180%;
  height: 180%;
  max-width: 36vw;
  max-height: 31vh;
  min-width: 400px;
  min-height: 200px;
  position: relative;
  cursor: pointer;
}

.chart-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.1);
  opacity: 0;
  transition: opacity 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
}

.echarts-chart:hover .chart-overlay {
  opacity: 1;
}

.click-hint {
  background: rgba(36, 112, 255, 0.9);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
  white-space: nowrap;
}

.chart-inner {
  width: 100%;
  height: 100%;
}

.empty-chart {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #F8F9FA;
  border-radius: 0.417vw;
  border: 0.052vw dashed #E9ECEF;
}

.empty-content {
  text-align: center;
}

.empty-text {
  font-size: 0.833vw;
  color: #6C757D;
  font-weight: bold;
}

.empty-hint {
  font-size: 0.625vw;
  color: #95A5A6;
  margin-top: 0.417vw;
}
</style> 