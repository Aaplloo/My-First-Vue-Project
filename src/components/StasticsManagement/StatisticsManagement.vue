<template>
  <div class="statistics-management">
    <!-- 主标题区域 -->
    <div class="title-section">
      <div class="main-title-wrapper">
        <div class="title-decoration"></div>
        <h2 class="main-title">统计管理</h2>
      </div>
    </div>
    
    <!-- 统计概览卡片 -->
    <div class="stats-overview">
      <!-- 总项目数 -->
      <div class="overview-card">
        <div class="card-header">
          <div class="card-icon">
            <span class="icon-text">📊</span>
          </div>
          <span class="card-title">总项目数</span>
        </div>
        <div class="card-content">
          <div class="overview-value">
            <span class="value-number">{{ statsData.totalProjects }}</span>
            <span class="value-unit">项</span>
          </div>
          <div class="overview-trend">
            <span class="trend-label">较上月:</span>
            <span class="trend-value" :class="statsData.projectTrend > 0 ? 'positive' : 'negative'">
              {{ statsData.projectTrend > 0 ? '+' : '' }}{{ statsData.projectTrend }}%
            </span>
          </div>
        </div>
      </div>

      <!-- 总投资额 -->
      <div class="overview-card">
        <div class="card-header">
          <div class="card-icon">
            <span class="icon-text">💰</span>
          </div>
          <span class="card-title">总投资额</span>
        </div>
        <div class="card-content">
          <div class="overview-value">
            <span class="value-number">{{ statsData.totalInvestment }}</span>
            <span class="value-unit">万元</span>
          </div>
          <div class="investment-progress">
            <span class="progress-label">执行率:</span>
            <span class="progress-value">{{ statsData.investmentProgress }}%</span>
          </div>
        </div>
      </div>

      <!-- 完成项目数 -->
      <div class="overview-card">
        <div class="card-header">
          <div class="card-icon">
            <span class="icon-text">✅</span>
          </div>
          <span class="card-title">完成项目数</span>
        </div>
        <div class="card-content">
          <div class="overview-value">
            <span class="value-number">{{ statsData.completedProjects }}</span>
            <span class="value-unit">项</span>
          </div>
          <div class="completion-rate">
            <span class="rate-label">完成率:</span>
            <span class="rate-value">{{ statsData.completionRate }}%</span>
          </div>
        </div>
      </div>

      <!-- 平均工期 -->
      <div class="overview-card">
        <div class="card-header">
          <div class="card-icon">
            <span class="icon-text">⏱️</span>
          </div>
          <span class="card-title">平均工期</span>
        </div>
        <div class="card-content">
          <div class="overview-value">
            <span class="value-number">{{ statsData.averageDuration }}</span>
            <span class="value-unit">天</span>
          </div>
          <div class="duration-trend">
            <span class="trend-label">较计划:</span>
            <span class="trend-value" :class="statsData.durationTrend < 0 ? 'positive' : 'negative'">
              {{ statsData.durationTrend > 0 ? '+' : '' }}{{ statsData.durationTrend }}天
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 统计图表区域 -->
    <div class="charts-section">
      <div class="section-header">
        <h3 class="section-title">数据统计图表</h3>
        <div class="chart-controls">
          <span class="control-label">图表类型:</span>
          <select v-model="selectedChartType" class="chart-select">
            <option value="trend">趋势图</option>
            <option value="distribution">分布图</option>
            <option value="comparison">对比图</option>
          </select>
        </div>
      </div>
      
      <div class="charts-grid">
        <!-- 项目趋势图 -->
        <div class="chart-container">
          <div class="chart-title">项目数量趋势</div>
          <div class="chart-placeholder">
            <div class="placeholder-text">项目数量趋势图</div>
            <div class="placeholder-hint">月度项目数量变化趋势</div>
          </div>
        </div>
        
        <!-- 投资分布图 -->
        <div class="chart-container">
          <div class="chart-title">投资分布</div>
          <div class="chart-placeholder">
            <div class="placeholder-text">投资分布图</div>
            <div class="placeholder-hint">各类型项目投资分布</div>
          </div>
        </div>
        
        <!-- 地区统计图 -->
        <div class="chart-container">
          <div class="chart-title">地区统计</div>
          <div class="chart-placeholder">
            <div class="placeholder-text">地区统计图</div>
            <div class="placeholder-hint">各地区项目分布统计</div>
          </div>
        </div>
        
        <!-- 完成情况图 -->
        <div class="chart-container">
          <div class="chart-title">完成情况</div>
          <div class="chart-placeholder">
            <div class="placeholder-text">完成情况图</div>
            <div class="placeholder-hint">项目完成情况统计</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 详细统计表格 -->
    <div class="detailed-stats">
      <div class="table-header">
        <h3 class="table-title">详细统计数据</h3>
        <div class="table-actions">
          <button class="action-btn primary">生成报告</button>
          <button class="action-btn">导出Excel</button>
        </div>
      </div>
      
      <div class="table-filters">
        <div class="filter-group">
          <label>统计维度:</label>
          <select v-model="selectedDimension" class="filter-select">
            <option value="time">按时间</option>
            <option value="type">按类型</option>
            <option value="region">按地区</option>
            <option value="status">按状态</option>
          </select>
        </div>
        
        <div class="filter-group">
          <label>时间范围:</label>
          <select v-model="selectedTimeRange" class="filter-select">
            <option value="month">本月</option>
            <option value="quarter">本季度</option>
            <option value="year">本年度</option>
            <option value="custom">自定义</option>
          </select>
        </div>
        
        <div class="filter-group">
          <label>排序方式:</label>
          <select v-model="selectedSortBy" class="filter-select">
            <option value="count">按数量</option>
            <option value="amount">按金额</option>
            <option value="duration">按工期</option>
            <option value="progress">按进度</option>
          </select>
        </div>
      </div>
      
      <div class="stats-table">
        <div class="table-header-row">
          <div class="header-cell">统计项</div>
          <div class="header-cell">项目数量</div>
          <div class="header-cell">投资金额(万元)</div>
          <div class="header-cell">平均工期(天)</div>
          <div class="header-cell">完成率(%)</div>
          <div class="header-cell">趋势</div>
        </div>
        
        <div class="table-row" v-for="item in filteredStatsData" :key="item.name">
          <div class="table-cell">{{ item.name }}</div>
          <div class="table-cell">{{ item.projectCount }}</div>
          <div class="table-cell">{{ item.investmentAmount }}</div>
          <div class="table-cell">{{ item.averageDuration }}</div>
          <div class="table-cell">{{ item.completionRate }}</div>
          <div class="table-cell">
            <span class="trend-indicator" :class="item.trend > 0 ? 'up' : 'down'">
              {{ item.trend > 0 ? '↗' : '↘' }} {{ Math.abs(item.trend) }}%
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// 统计数据
const statsData = ref({
  totalProjects: 1256,
  projectTrend: 8.5,
  totalInvestment: 156800,
  investmentProgress: 78.5,
  completedProjects: 1089,
  completionRate: 86.7,
  averageDuration: 245,
  durationTrend: -12
})

// 详细统计数据
const detailedStatsData = ref([
  {
    name: '页岩气开发',
    projectCount: 456,
    investmentAmount: 78900,
    averageDuration: 280,
    completionRate: 89.2,
    trend: 12.5
  },
  {
    name: '新能源项目',
    projectCount: 234,
    investmentAmount: 45600,
    averageDuration: 210,
    completionRate: 82.1,
    trend: 8.7
  },
  {
    name: '基础设施',
    projectCount: 345,
    investmentAmount: 23400,
    averageDuration: 180,
    completionRate: 91.5,
    trend: -3.2
  },
  {
    name: '技术改造',
    projectCount: 221,
    investmentAmount: 8900,
    averageDuration: 120,
    completionRate: 76.8,
    trend: 15.3
  }
])

// 筛选条件
const selectedChartType = ref('trend')
const selectedDimension = ref('time')
const selectedTimeRange = ref('month')
const selectedSortBy = ref('count')

// 计算筛选后的统计数据
const filteredStatsData = computed(() => {
  let filtered = [...detailedStatsData.value]
  
  // 根据排序方式排序
  switch (selectedSortBy.value) {
    case 'count':
      filtered.sort((a, b) => b.projectCount - a.projectCount)
      break
    case 'amount':
      filtered.sort((a, b) => b.investmentAmount - a.investmentAmount)
      break
    case 'duration':
      filtered.sort((a, b) => b.averageDuration - a.averageDuration)
      break
    case 'progress':
      filtered.sort((a, b) => b.completionRate - a.completionRate)
      break
  }
  
  return filtered
})

onMounted(() => {
  console.log('统计管理页面已加载')
})
</script>

<style scoped>
.statistics-management {
  width: 100%;
  height: 100%;
  padding: 1.5vh 1vw;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
  gap: 2vh;
}

.title-section {
  display: flex;
  align-items: center;
  margin-bottom: 1vh;
}

.main-title-wrapper {
  background: linear-gradient(to right, #ECF3FF 0%, rgba(36, 112, 255, 0) 100%);
  padding: 0.5vh 1vw 0.5vh 0;
  display: flex;
  align-items: center;
}

.title-decoration {
  width: 0.5vw;
  height: 2.5vh;
  background: #2470FF;
  margin-right: 1vw;
}

.main-title {
  color: #2470FF;
  font-size: 1.2vw;
  font-weight: bold;
  margin: 0;
}

.stats-overview {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5vw;
  margin-bottom: 2vh;
}

.overview-card {
  background: white;
  border-radius: 8px;
  padding: 1.5vh 1vw;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.overview-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.8vw;
  margin-bottom: 1vh;
}

.card-icon {
  width: 2.5vw;
  height: 2.5vw;
  background: #f0f8ff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-text {
  font-size: 1.2vw;
}

.card-title {
  color: #333;
  font-size: 0.9vw;
  font-weight: bold;
}

.card-content {
  padding-top: 1vh;
}

.overview-value {
  display: flex;
  align-items: baseline;
  gap: 0.5vw;
  margin-bottom: 0.8vh;
}

.value-number {
  color: #2470FF;
  font-size: 1.5vw;
  font-weight: bold;
}

.value-unit {
  color: #666;
  font-size: 0.8vw;
}

.overview-trend, .investment-progress, .completion-rate, .duration-trend {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8vw;
}

.trend-label, .progress-label, .rate-label {
  color: #666;
}

.trend-value.positive {
  color: #52c41a;
}

.trend-value.negative {
  color: #ff4d4f;
}

.progress-value, .rate-value {
  color: #2470FF;
  font-weight: bold;
}

.charts-section {
  background: white;
  border-radius: 8px;
  padding: 2vh 1.5vw;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-bottom: 2vh;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2vh;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 1vh;
}

.section-title {
  color: #333;
  font-size: 1vw;
  font-weight: bold;
  margin: 0;
}

.chart-controls {
  display: flex;
  align-items: center;
  gap: 0.8vw;
}

.control-label {
  color: #666;
  font-size: 0.8vw;
}

.chart-select {
  padding: 0.3vh 0.5vw;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 0.8vw;
  background: white;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2vw;
  min-height: 30vh;
}

.chart-container {
  display: flex;
  flex-direction: column;
}

.chart-title {
  color: #333;
  font-size: 0.9vw;
  font-weight: bold;
  margin-bottom: 1vh;
}

.chart-placeholder {
  flex: 1;
  background: #f8f9fa;
  border: 2px dashed #dee2e6;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #6c757d;
}

.placeholder-text {
  font-size: 1vw;
  font-weight: bold;
  margin-bottom: 0.5vh;
}

.placeholder-hint {
  font-size: 0.7vw;
  color: #adb5bd;
}

.detailed-stats {
  flex: 1;
  background: white;
  border-radius: 8px;
  padding: 2vh 1.5vw;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2vh;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 1vh;
}

.table-title {
  color: #333;
  font-size: 1vw;
  font-weight: bold;
  margin: 0;
}

.table-actions {
  display: flex;
  gap: 1vw;
}

.action-btn {
  padding: 0.5vh 1vw;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background: white;
  color: #666;
  font-size: 0.8vw;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn:hover {
  border-color: #2470FF;
  color: #2470FF;
}

.action-btn.primary {
  background: #2470FF;
  color: white;
  border-color: #2470FF;
}

.action-btn.primary:hover {
  background: #1e5fd9;
  border-color: #1e5fd9;
}

.table-filters {
  display: flex;
  gap: 2vw;
  margin-bottom: 2vh;
  padding: 1vh 0;
  border-bottom: 1px solid #f0f0f0;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.5vw;
}

.filter-group label {
  color: #666;
  font-size: 0.8vw;
  white-space: nowrap;
}

.filter-select {
  padding: 0.3vh 0.5vw;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 0.8vw;
  background: white;
}

.stats-table {
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  overflow: hidden;
}

.table-header-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1.5fr 1.5fr 1fr 1fr;
  background: #fafafa;
  border-bottom: 1px solid #f0f0f0;
}

.header-cell {
  padding: 1vh 0.8vw;
  font-weight: bold;
  color: #333;
  font-size: 0.8vw;
  text-align: center;
}

.table-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1.5fr 1.5fr 1fr 1fr;
  border-bottom: 1px solid #f5f5f5;
  transition: background-color 0.3s ease;
}

.table-row:hover {
  background-color: #f9f9f9;
}

.table-cell {
  padding: 1vh 0.8vw;
  font-size: 0.8vw;
  color: #666;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.trend-indicator {
  font-weight: bold;
  font-size: 0.7vw;
}

.trend-indicator.up {
  color: #52c41a;
}

.trend-indicator.down {
  color: #ff4d4f;
}
</style>
