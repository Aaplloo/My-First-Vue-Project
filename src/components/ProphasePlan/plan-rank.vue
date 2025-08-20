<template>
  <div class="plan-rank">
    <!-- 主标题区域 -->
    <div class="title-section">
      <div class="main-title-wrapper">
        <div class="title-decoration"></div>
        <h2 class="main-title">前期计划排名</h2>
      </div>
      <div class="controls">
      <div class="date-filter">
        <span class="filter-label">截止至:</span>
          <div class="dropdown" @click="toggleMonthDropdown">
            {{ selectedMonth }}月
            <div class="dropdown-arrow">▼</div>
          </div>
          <!-- 月份选择下拉菜单 -->
          <div v-if="showMonthDropdown" class="month-dropdown">
            <div 
              v-for="month in 12" 
              :key="month"
              class="month-option"
              :class="{ active: month === selectedMonth }"
              @click="selectMonth(month)"
            >
              {{ month }}月
            </div>
          </div>
        </div>
        <button class="export-btn" @click="exportToCSV">导出CSV</button>
      </div>
    </div>
    
    <!-- 表格区域 -->
    <div class="table-container">
      <!-- 表头 -->
      <div class="table-header">
        <div class="header-cell rank">排名</div>
        <div class="header-cell unit">单位名称</div>
        <div class="header-cell rate">完成率(%)</div>
        <div class="header-cell planned">计划完成</div>
        <div class="header-cell actual">实际完成</div>
      </div>
      
      <!-- 表格内容 -->
      <div class="table-body">
        <div 
          v-for="(item, index) in sortedRankData" 
          :key="item.id"
          class="table-row"
        >
          <div class="cell rank">{{ index + 1 }}</div>
          <div class="cell unit">{{ item.unitName }}</div>
          <div class="cell rate">{{ item.completionRate }}%</div>
          <div class="cell planned">{{ formatNumber(item.plannedAmount) }}</div>
          <div class="cell actual">{{ formatNumber(item.actualAmount) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

// 月份选择相关状态
const selectedMonth = ref(7) // 默认选择7月
const showMonthDropdown = ref(false)

// 切换月份下拉菜单显示状态
const toggleMonthDropdown = () => {
  showMonthDropdown.value = !showMonthDropdown.value
}

// 选择月份
const selectMonth = (month) => {
  selectedMonth.value = month
  showMonthDropdown.value = false
  // 根据选择的月份筛选数据
  console.log(`选择了${month}月的数据`)
}

// 点击外部关闭下拉菜单
const closeDropdown = (event) => {
  if (!event.target.closest('.date-filter')) {
    showMonthDropdown.value = false
  }
}

// 从CSV文件读取数据
const loadDataFromCSV = async () => {
  try {
    const response = await fetch('/plan-rank-data.csv')
    const csvText = await response.text()
    const lines = csvText.trim().split('\n')
    const headers = lines[0].split(',')
    
    const data = lines.slice(1).map((line, index) => {
      const values = line.split(',')
      return {
        id: parseInt(values[0]),
        unitName: values[1],
        plannedAmount: parseInt(values[2]),
        actualAmount: parseInt(values[3]),
        month: parseInt(values[4])
      }
    })
    
    rankData.value = data
    console.log('CSV数据加载成功:', data)
  } catch (error) {
    console.error('加载CSV数据失败:', error)
    // 如果CSV加载失败，使用默认数据
    loadDefaultData()
  }
}

// 加载默认数据（作为备用）
const loadDefaultData = () => {
  rankData.value = [
    {
      id: 1,
      unitName: '南充北油田',
      plannedAmount: 133245,
      actualAmount: 123214,
      month: 1
    },
    {
      id: 2,
      unitName: '合川南部油田',
      plannedAmount: 73712,
      actualAmount: 123214,
      month: 2
    },
    {
      id: 3,
      unitName: '江油油田',
      plannedAmount: 226266,
      actualAmount: 123214,
      month: 3
    },
    {
      id: 4,
      unitName: '梓潼油田',
      plannedAmount: 146212,
      actualAmount: 123214,
      month: 4
    },
    {
      id: 5,
      unitName: '蓬安油田',
      plannedAmount: 5987,
      actualAmount: 1232,
      month: 5
    },
    {
      id: 6,
      unitName: '阆中油田',
      plannedAmount: 15800,
      actualAmount: 14062,
      month: 6
    },
    {
      id: 7,
      unitName: '仪陇油田',
      plannedAmount: 12500,
      actualAmount: 9500,
      month: 7
    },
    {
      id: 8,
      unitName: '南部油田',
      plannedAmount: 9800,
      actualAmount: 9016,
      month: 8
    }
  ]
}

// 导出数据到CSV文件
const exportToCSV = () => {
  const headers = ['排名', '单位名称', '完成率(%)', '计划完成', '实际完成', '月份']
  const csvContent = [
    headers.join(','),
    ...sortedRankData.value.map((item, index) => [
      index + 1,
      item.unitName,
      item.completionRate + '%',
      item.plannedAmount,
      item.actualAmount,
      item.month + '月'
    ].join(','))
  ].join('\n')
  
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `前期计划排名_${selectedMonth.value}月.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
  
  console.log('CSV文件导出成功')
}

// 排行榜数据
const rankData = ref([])

// 根据选择的月份筛选数据
const filteredRankData = computed(() => {
  return rankData.value.filter(item => item.month <= selectedMonth.value)
})

// 计算完成率的计算属性
const rankDataWithCompletionRate = computed(() => {
  return filteredRankData.value.map(item => ({
    ...item,
    completionRate: calculateCompletionRate(item.actualAmount, item.plannedAmount)
  }))
})

// 计算完成率的函数
const calculateCompletionRate = (actual, planned) => {
  if (planned === 0) return 0
  const rate = (actual / planned) * 100
  return Math.min(parseFloat(rate.toFixed(1)), 999) // 保留1位小数，限制最大值为999
}

// 按照完成率排序的计算属性
const sortedRankData = computed(() => {
  return [...rankDataWithCompletionRate.value].sort((a, b) => {
    // 首先按完成率降序排列
    if (b.completionRate !== a.completionRate) {
      return b.completionRate - a.completionRate
    }
    // 完成率相同时，按计划完成金额降序排列
    return b.plannedAmount - a.plannedAmount
  })
})

// 数字格式化方法
const formatNumber = (num) => {
  return num.toLocaleString()
}

// 生命周期钩子
onMounted(() => {
  document.addEventListener('click', closeDropdown)
  // 加载CSV数据
  loadDataFromCSV()
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown)
})

// 暴露数据供外部使用
defineExpose({
  rankData,
  filteredRankData,
  rankDataWithCompletionRate,
  sortedRankData,
  formatNumber,
  selectedMonth,
  selectMonth,
  calculateCompletionRate,
  exportToCSV,
  loadDataFromCSV
})
</script>

<style scoped>
.plan-rank {
  background: white;
  border-radius: 0.417vw;
  padding: 1vh 0.571vw 1.389vh 0.571vw;
  box-shadow: 0 0.185vh 0.417vw rgba(0, 0, 0, 0.1);
  width: 25.52vw;
  height: 32.381vh;
  position: fixed;
  right: 0.521vw;
  bottom: 0.926vh;
  overflow: hidden;
}

.title-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
}

.main-title-wrapper {
  background: linear-gradient(to right, #ECF3FF 0%, rgba(36, 112, 255, 0) 100%);
  padding: 0.463vh 1.042vw 0.463vh 0;
  display: inline-flex;
  align-items: center;
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

.controls {
  display: flex;
  align-items: center;
  gap: 0.417vw;
}

.date-filter {
  display: flex;
  align-items: center;
  gap: 0.417vw;
  position: relative;
}

.filter-label {
  font-size: 0.625vw;
  color: #6C757D;
}

.dropdown {
  padding: 0.37vh 0.417vw;
  background: #F8F9FA;
  border: 0.052vw solid #E9ECEF;
  border-radius: 0.208vw;
  font-size: 0.625vw;
  color: #2C3E50;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.208vw;
}

.dropdown-arrow {
  font-size: 0.521vw;
  color: #6C757D;
}

.month-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  background: #F8F9FA;
  border: 0.052vw solid #E9ECEF;
  border-radius: 0.208vw;
  box-shadow: 0 0.185vh 0.417vw rgba(0, 0, 0, 0.1);
  z-index: 10;
  width: 100%;
  max-height: 15vh; /* Adjust as needed */
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.month-option {
  padding: 0.37vh 0.417vw;
  font-size: 0.625vw;
  color: #2C3E50;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.month-option:hover {
  background-color: #E9ECEF;
}

.month-option.active {
  background-color: #2470FF;
  color: white;
  font-weight: bold;
}

.export-btn {
  padding: 0.37vh 0.741vw;
  background: #2470FF;
  color: white;
  border: none;
  border-radius: 0.208vw;
  font-size: 0.625vw;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.export-btn:hover {
  background: #1A60D2;
}

.table-container {
  height: calc(100% - 4.63vh);
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 2.5vw 1.5fr 4.167vw 5.208vw 5.208vw;
  gap: 0.521vw;
  background: #F8F9FA;
  padding: 0.926vh 0.521vw;
  border-radius: 0.313vw;
  margin-bottom: 0.741vh;
  font-size: 0.625vw;
  font-weight: 600;
  color: #2C3E50;
}

.header-cell {
  text-align: center;
}

.header-cell.unit {
  text-align: left;
}

.table-body {
  display: flex;
  flex-direction: column;
  gap: 0.37vh;
  height: calc(100% - 4.63vh);
  overflow-y: auto;
}

.table-row {
  display: grid;
  grid-template-columns: 2.5vw 1.5fr 4.167vw 5.208vw 5.208vw;
  gap: 0.521vw;
  padding: 0.741vh 0.521vw;
  border-radius: 0.208vw;
  font-size: 0.573vw;
  transition: all 0.3s ease;
  cursor: pointer;
}

.table-row:hover {
  background: linear-gradient(90deg, #FFF3E0 0%, #FFF8E1 100%);
  position: relative;
}

.table-row:hover::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 0.208vw;
  background: #FF9800;
  border-radius: 0.104vw;
}

.cell {
  display: flex;
  align-items: center;
  justify-content: center;
}

.cell.rank {
  font-weight: 600;
  color: #2C3E50;
}

.cell.unit {
  justify-content: flex-start;
  color: #2C3E50;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cell.rate {
  font-weight: 600;
  color: #2C3E50;
}

.cell.planned {
  color: #4CAF50;
  font-weight: 600;
}

.cell.actual {
  color: #FF5722;
  font-weight: 600;
}

/* 滚动条样式 */
.table-body::-webkit-scrollbar {
  width: 0.208vw;
}

.table-body::-webkit-scrollbar-track {
  background: #F1F1F1;
  border-radius: 0.104vw;
}

.table-body::-webkit-scrollbar-thumb {
  background: #C1C1C1;
  border-radius: 0.104vw;
}

.table-body::-webkit-scrollbar-thumb:hover {
  background: #A8A8A8;
}
</style> 