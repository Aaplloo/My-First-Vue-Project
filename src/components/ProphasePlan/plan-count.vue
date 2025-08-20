<template>
  <div class="plan-count">
    <!-- 主标题区域 -->
    <div class="title-section">
      <div class="main-title-wrapper">
        <div class="title-decoration"></div>
        <h2 class="main-title">计划统计</h2>
      </div>
      <div class="tabs-section">
        <div 
          class="tab" 
          :class="{ active: activeTab === 'projectType' }"
          @click="switchTab('projectType')"
        >项目类型</div>
        <div 
          class="tab" 
          :class="{ active: activeTab === 'projectCategory' }"
          @click="switchTab('projectCategory')"
        >项目分类</div>
        <div 
          class="tab" 
          :class="{ active: activeTab === 'fundChannel' }"
          @click="switchTab('fundChannel')"
        >资金渠道</div>
        <div 
          class="tab" 
          :class="{ active: activeTab === 'constructionType' }"
          @click="switchTab('constructionType')"
        >建设类型</div>
      </div>
    </div>
    
    <!-- 图表区域 -->
    <div class="chart-section">
      <!-- 项目类型 - 环形图 -->
      <div v-if="activeTab === 'projectType'" class="chart-container">
        <div ref="chartRef" class="echarts-donut" @click="expandMap"></div>
      </div>
      
      <!-- 项目分类 - 柱状图 -->
      <div v-else-if="activeTab === 'projectCategory'" class="chart-container">
        <div ref="categoryChartRef" class="echarts-chart"></div>
      </div>
      
      <!-- 资金渠道 - 折线图 -->
      <div v-else-if="activeTab === 'fundChannel'" class="chart-container">
        <div ref="fundChartRef" class="echarts-chart"></div>
      </div>
      
      <!-- 建设类型 - 雷达图 -->
      <div v-else-if="activeTab === 'constructionType'" class="chart-container">
        <div ref="constructionChartRef" class="echarts-chart"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch, computed } from 'vue'
import * as echarts from 'echarts'

const chartRef = ref(null)
const categoryChartRef = ref(null)
const fundChartRef = ref(null) // 新增资金渠道图表引用
const constructionChartRef = ref(null) // 新增建设类型图表引用
let chartInstance = null
let categoryChartInstance = null
let fundChartInstance = null // 新增资金渠道图表实例
let constructionChartInstance = null // 新增建设类型图表实例

// 当前激活的tab
const activeTab = ref('projectType')

// 展开地图
const expandMap = () => {
  // 触发自定义事件，通知父组件展开地图
  const event = new CustomEvent('expandMap', {
    detail: { component: 'plan-count' }
  })
  window.dispatchEvent(event)
}

// 切换tab的方法
const switchTab = (tabName) => {
  activeTab.value = tabName
  
  // 如果切换到项目类型tab，需要重新初始化图表
  if (tabName === 'projectType') {
    nextTick(() => {
      setTimeout(() => {
        initChart()
      }, 100)
    })
  }
  // 如果切换到项目分类tab，需要初始化分类图表
  else if (tabName === 'projectCategory') {
    nextTick(() => {
      setTimeout(() => {
        initCategoryChart()
      }, 100)
    })
  }
  // 如果切换到资金渠道tab，需要初始化资金渠道图表
  else if (tabName === 'fundChannel') {
    nextTick(() => {
      setTimeout(() => {
        initFundChart()
      }, 100)
    })
  }
  // 如果切换到建设类型tab，需要初始化建设类型图表
  else if (tabName === 'constructionType') {
    nextTick(() => {
      setTimeout(() => {
        initConstructionChart()
      }, 100)
    })
  }
}

// 监听activeTab变化，当切换到非图表tab时销毁图表实例
watch(activeTab, (newTab) => {
  if (newTab !== 'projectType' && chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
  if (newTab !== 'projectCategory' && categoryChartInstance) {
    categoryChartInstance.dispose()
    categoryChartInstance = null
  }
  if (newTab !== 'fundChannel' && fundChartInstance) {
    fundChartInstance.dispose()
    fundChartInstance = null
  }
  if (newTab !== 'constructionType' && constructionChartInstance) {
    constructionChartInstance.dispose()
    constructionChartInstance = null
  }
})

// 数据存储
const dataValues = ref({
  // 各项目数量
  exploration: 0,    // 勘探项目
  development: 0,   // 开发项目
  pipeline: 0,       // 管道项目
  newEnergy: 0,     // 新能源项目
  
  // 总计金额
  totalAmount: 0,     // 总金额（万元）
  
  // 标题文字
  centerTitle: '0万元',
  centerSubtitle: '下达上市资金计划'
})

// 从CSV文件读取数据
const loadDataFromCSV = async () => {
  try {
    const response = await fetch('/plan-count-data.csv')
    const csvText = await response.text()
    const lines = csvText.trim().split('\n')
    const headers = lines[0].split(',')
    
    // 解析CSV数据
    const csvData = {}
    lines.slice(1).forEach((line) => {
      const values = line.split(',')
      const projectType = values[1]
      const projectCount = parseInt(values[2])
      const fundingAmount = parseInt(values[3])
      
      // 根据项目类型映射到对应的key
      let key = ''
      switch (projectType) {
        case '勘探项目':
          key = 'exploration'
          break
        case '开发项目':
          key = 'development'
          break
        case '管道项目':
          key = 'pipeline'
          break
        case '新能源项目':
          key = 'newEnergy'
          break
        case '检测项目':
          key = 'detection'
          break
        case '培训项目':
          key = 'training'
          break
        case '技术项目':
          key = 'technology'
          break
        case '综合项目':
          key = 'comprehensive'
          break
      }
      
      if (key) {
        csvData[key] = { projectCount, fundingAmount }
      }
    })
    
    // 更新数据
    if (Object.keys(csvData).length >= 4) {
      dataValues.value.exploration = csvData.exploration?.projectCount || 0
      dataValues.value.development = csvData.development?.projectCount || 0
      dataValues.value.pipeline = csvData.pipeline?.projectCount || 0
      dataValues.value.newEnergy = csvData.newEnergy?.projectCount || 0
      
      // 计算总金额
      const totalFunding = Object.values(csvData).reduce((sum, item) => sum + (item?.fundingAmount || 0), 0)
      dataValues.value.totalAmount = totalFunding
      dataValues.value.centerTitle = `${totalFunding}万元`
      
      console.log('CSV数据加载成功:', csvData)
      console.log('总金额更新为:', totalFunding)
      
      // 数据加载完成后，如果当前是项目类型tab，重新初始化图表
      if (activeTab.value === 'projectType') {
        nextTick(() => {
          initChart()
        })
      }
    } else {
      console.warn('CSV数据不完整，保持默认数据')
    }
  } catch (error) {
    console.error('加载CSV数据失败:', error)
    console.log('使用默认数据')
  }
}

// 计算属性 - 使用ref的响应式值
const totalProjects = computed(() => 
  dataValues.value.exploration + dataValues.value.development + dataValues.value.pipeline + dataValues.value.newEnergy
)

// 图表数据 - 使用computed确保响应式更新
const chartData = computed(() => [
  { value: dataValues.value.exploration, name: '勘探项目', itemStyle: { color: '#1246E1' } },
  { value: dataValues.value.development, name: '开发项目', itemStyle: { color: '#285BF4' } },
  { value: dataValues.value.pipeline, name: '管道项目', itemStyle: { color: '#65A2FF' } },
  { value: dataValues.value.newEnergy, name: '新能源项目', itemStyle: { color: '#ADD5FF' } }
])

// 暴露数据供外部使用（可选）
defineExpose({
  dataValues,
  totalProjects,
  chartData,
  activeTab,
  switchTab,
  loadDataFromCSV
})

// 生命周期钩子
onMounted(async () => {
  // 先加载CSV数据
  await loadDataFromCSV()
  
  // 数据加载完成后再初始化图表
  nextTick(() => {
    if (activeTab.value === 'projectType') {
      initChart()
    }
  })
  
  // 添加窗口大小改变监听器
  window.addEventListener('resize', handleResize)
})

// 初始化图表
const initChart = () => {
  console.log('开始初始化图表')
  console.log('chartRef.value:', chartRef.value)
  console.log('echarts对象:', echarts)
  console.log('当前数据值:', dataValues.value)
  console.log('图表数据:', chartData.value)
  
  if (chartRef.value) {
    try {
      chartInstance = echarts.init(chartRef.value)
      console.log('图表实例创建成功:', chartInstance)
      
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c}项 ({d}%)'
        },
        series: [{
          name: '项目统计',
          type: 'pie',
          radius: ['32%', '50%'],
          center: ['50%', '55%'],
          avoidLabelOverlap: false,
          label: {
            show: true,
            position: 'outside',
            formatter: function(params) {
              return `${params.name}\n${params.value}项 (${params.percent}%)`;
            },
            fontSize: 11,
            color: '#333',
            lineHeight: 14,
            distanceToLabelLine: 5
          },
          labelLine: {
            show: true,
            length: 17,
            length2: 12,
            smooth: 0.2
          },
          data: chartData.value,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }],
        // 添加中心文字
        graphic: [{
          type: 'group',
          left: 'center',
          top: '50%',
          children: [{
            type: 'text',
            style: {
              text: dataValues.value.centerTitle,
              textAlign: 'center',
              fill: '#333',
              fontSize: 15,
              fontWeight: 'bold',
              x: 0,
              y: -10
            }
          }, {
            type: 'text',
            style: {
              text: dataValues.value.centerSubtitle,
              textAlign: 'center',
              fill: '#666',
              fontSize: 10,
              x: 0,
              y: 7
            }
          }]
        }]
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

// 初始化分类图表
const initCategoryChart = () => {
  console.log('开始初始化分类图表')
  console.log('categoryChartRef.value:', categoryChartRef.value)
  console.log('echarts对象:', echarts)

  if (categoryChartRef.value) {
    try {
      categoryChartInstance = echarts.init(categoryChartRef.value)
      console.log('分类图表实例创建成功:', categoryChartInstance)

      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: ['勘探项目', '开发项目', '管道项目', '新能源项目'],
          axisTick: {
            alignWithLabel: true
          },
          axisLabel: {
            fontSize: 10,
            color: '#666',
            interval: 0,
            rotate: 0,
            formatter: function(value) {
              // 如果文字太长，进行换行处理
              if (value.length > 5) {
                return value.substring(0, 4) + '\n' + value.substring(4)
              }
              return value
            }
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            fontSize: 10,
            color: '#666'
          }
        },
        series: [{
          name: '项目数量',
          type: 'bar',
          barWidth: '60%',
          data: [dataValues.value.exploration, dataValues.value.development, dataValues.value.pipeline, dataValues.value.newEnergy],
          itemStyle: {
            color: '#2470FF'
          },
          label: {
            show: true,
            position: 'top',
            fontSize: 10,
            color: '#666'
          }
        }]
      }

      categoryChartInstance.setOption(option)
      console.log('分类图表配置已设置，option:', option)
    } catch (error) {
      console.error('初始化分类图表时出错:', error)
    }
  } else {
    console.error('categoryChartRef.value 为空，DOM元素未找到')
  }
}

// 初始化资金渠道图表
const initFundChart = () => {
  console.log('开始初始化资金渠道图表')
  console.log('fundChartRef.value:', fundChartRef.value)
  console.log('echarts对象:', echarts)

  if (fundChartRef.value) {
    try {
      fundChartInstance = echarts.init(fundChartRef.value)
      console.log('资金渠道图表实例创建成功:', fundChartInstance)

      const option = {
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: ['1月', '2月', '3月', '4月', '5月', '6月'],
          axisLabel: {
            fontSize: 10,
            color: '#666'
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            fontSize: 10,
            color: '#666'
          }
        },
        series: [{
          name: '资金金额',
          type: 'line',
          smooth: true,
          data: [120, 200, 150, 80, 70, 110],
          itemStyle: {
            color: '#2470FF'
          },
          lineStyle: {
            color: '#2470FF'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: 'rgba(36, 112, 255, 0.3)'
            }, {
              offset: 1,
              color: 'rgba(36, 112, 255, 0)'
            }])
          },
          label: {
            show: true,
            position: 'top',
            fontSize: 10,
            color: '#666'
          }
        }]
      }

      fundChartInstance.setOption(option)
      console.log('资金渠道图表配置已设置，option:', option)
    } catch (error) {
      console.error('初始化资金渠道图表时出错:', error)
    }
  } else {
    console.error('fundChartRef.value 为空，DOM元素未找到')
  }
}

// 初始化建设类型图表
const initConstructionChart = () => {
  console.log('开始初始化建设类型图表')
  console.log('constructionChartRef.value:', constructionChartRef.value)
  console.log('echarts对象:', echarts)

  if (constructionChartRef.value) {
    try {
      constructionChartInstance = echarts.init(constructionChartRef.value)
      console.log('建设类型图表实例创建成功:', constructionChartInstance)

      // 计算数据最大值，用于设置雷达图范围
      const maxValue = Math.max(dataValues.value.exploration, dataValues.value.development, dataValues.value.pipeline, dataValues.value.newEnergy)
      const chartMax = Math.ceil(maxValue * 1.2) // 最大值增加20%的缓冲

      const option = {
        tooltip: {
          trigger: 'axis'
        },
        radar: {
          indicator: [
            { name: '勘探项目', max: chartMax },
            { name: '开发项目', max: chartMax },
            { name: '管道项目', max: chartMax },
            { name: '新能源项目', max: chartMax }
          ],
          radius: '50%',
          center: ['50%', '55%'],
          name: {
            textStyle: {
              color: '#000000'
            }
          },
          splitArea: {
            areaStyle: {
              color: ['#F8F8F8', '#F8F8F8']
            }
          },
          splitLine: {
            lineStyle: {
              color: '#E0E0E0'
            }
          },
          axisLine: {
            lineStyle: {
              color: '#E0E0E0'
            }
          }
        },
        series: [{
          type: 'radar',
          data: [{
            value: [dataValues.value.exploration, dataValues.value.development, dataValues.value.pipeline, dataValues.value.newEnergy],
            name: '项目数量',
            itemStyle: {
              color: '#2470FF'
            },
            areaStyle: {
              color: 'rgba(36, 112, 255, 0.2)'
            }
          }]
        }]
      }

      constructionChartInstance.setOption(option)
      console.log('建设类型图表配置已设置，option:', option)
    } catch (error) {
      console.error('初始化建设类型图表时出错:', error)
    }
  } else {
    console.error('constructionChartRef.value 为空，DOM元素未找到')
  }
}

// 窗口大小改变时重新调整图表
const handleResize = () => {
  if (chartInstance && activeTab.value === 'projectType') {
    chartInstance.resize()
  }
  if (categoryChartInstance && activeTab.value === 'projectCategory') {
    categoryChartInstance.resize()
  }
  if (fundChartInstance && activeTab.value === 'fundChannel') {
    fundChartInstance.resize()
  }
  if (constructionChartInstance && activeTab.value === 'constructionType') {
    constructionChartInstance.resize()
  }
}

// 添加窗口大小改变监听器
window.addEventListener('resize', handleResize)

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.dispose()
  }
  if (categoryChartInstance) {
    categoryChartInstance.dispose()
  }
  if (fundChartInstance) {
    fundChartInstance.dispose()
  }
  if (constructionChartInstance) {
    constructionChartInstance.dispose()
  }
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.plan-count {
  background: white;
  border-radius: 0.417vw;
  padding: 1vh 0.571vw 1.389vh 0.571vw;
  box-shadow: 0 0.185vh 0.417vw rgba(0, 0, 0, 0.1);
  width: 25.52vw;
  height: 26.778vh;
  position: fixed;
  left: 0.521vw;
  top: 41.574vh;
  overflow: hidden;
}

.title-section {
  display: flex;
  align-items: center;
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

.chart-section {
  display: flex;
  height: calc(100% - 7.407vh);
  justify-content: center;
  align-items: center;
  padding: 1.389vh 1.042vw;
  position: relative;
  z-index: 1;
}

.chart-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.echarts-donut {
  width: 22vw;
  height: 26vh;
  min-width: 300px;
  min-height: 260px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.echarts-chart {
  width: 18vw;
  height: 22vh;
  min-width: 250px;
  min-height: 200px;
}

.empty-chart {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #F8F9FA;
  border-radius: 0.417vw;
  border: 0.052vw solid #E9ECEF;
}

.empty-content {
  text-align: center;
}

.empty-text {
  font-size: 1.042vw;
  color: #6C757D;
  font-weight: bold;
  margin-bottom: 0.417vw;
}

.empty-hint {
  font-size: 0.625vw;
  color: #999;
}


</style> 