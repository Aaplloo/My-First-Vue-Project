<template>
  <div class="investment-plan">
    <!-- 主标题区域 -->
    <div class="title-section">
      <div class="main-title-wrapper">
        <div class="title-decoration"></div>
        <h2 class="main-title">投资计划管理</h2>
      </div>
    </div>
    
    <!-- 投资概览卡片 -->
    <div class="overview-cards">
      <!-- 总投资额 -->
      <div class="overview-card">
        <div class="card-header">
          <div class="card-icon">
            <span class="icon-text">💰</span>
          </div>
          <span class="card-title">总投资额</span>
        </div>
        <div class="card-content">
          <div class="amount-info">
            <span class="amount-value">{{ investmentData.totalAmount }}</span>
            <span class="amount-unit">万元</span>
          </div>
          <div class="trend-info">
            <span class="trend-label">较去年:</span>
            <span class="trend-value" :class="investmentData.totalTrend > 0 ? 'positive' : 'negative'">
              {{ investmentData.totalTrend > 0 ? '+' : '' }}{{ investmentData.totalTrend }}%
            </span>
          </div>
        </div>
    </div>
    
      <!-- 已完成投资 -->
      <div class="overview-card">
        <div class="card-header">
          <div class="card-icon">
            <span class="icon-text">✅</span>
          </div>
          <span class="card-title">已完成投资</span>
        </div>
        <div class="card-content">
          <div class="amount-info">
            <span class="amount-value">{{ investmentData.completedAmount }}</span>
            <span class="amount-unit">万元</span>
            </div>
          <div class="completion-rate">
            <span class="rate-label">完成率:</span>
            <span class="rate-value">{{ investmentData.completionRate }}%</span>
          </div>
        </div>
      </div>
      
      <!-- 在建项目投资 -->
      <div class="overview-card">
        <div class="card-header">
          <div class="card-icon">
            <span class="icon-text">🏗️</span>
          </div>
          <span class="card-title">在建项目投资</span>
        </div>
        <div class="card-content">
          <div class="amount-info">
            <span class="amount-value">{{ investmentData.ongoingAmount }}</span>
            <span class="amount-unit">万元</span>
            </div>
          <div class="project-count">
            <span class="count-label">项目数:</span>
            <span class="count-value">{{ investmentData.ongoingProjects }}个</span>
          </div>
        </div>
      </div>
      
      <!-- 计划投资 -->
      <div class="overview-card">
        <div class="card-header">
          <div class="card-icon">
            <span class="icon-text">📊</span>
          </div>
          <span class="card-title">计划投资</span>
        </div>
        <div class="card-content">
          <div class="amount-info">
            <span class="amount-value">{{ investmentData.plannedAmount }}</span>
            <span class="amount-unit">万元</span>
            </div>
          <div class="plan-status">
            <span class="status-label">状态:</span>
            <span class="status-value">{{ investmentData.planStatus }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 投资分类统计 -->
    <div class="investment-stats">
      <div class="stats-header">
        <h3 class="stats-title">投资分类统计</h3>
        <div class="stats-tabs">
          <span 
            class="tab-item" 
            :class="{ active: activeTab === 'category' }"
            @click="activeTab = 'category'"
          >按类别</span>
          <span 
            class="tab-item" 
            :class="{ active: activeTab === 'region' }"
            @click="activeTab = 'region'"
          >按地区</span>
        </div>
      </div>
      
      <div class="stats-content">
        <div v-if="activeTab === 'category'" class="category-stats">
          <div class="stat-item" v-for="item in categoryStats" :key="item.name">
            <div class="stat-info">
              <span class="stat-name">{{ item.name }}</span>
              <span class="stat-amount">{{ item.amount }}万元</span>
        </div>
            <div class="stat-bar">
              <div class="bar-fill" :style="{ width: item.percentage + '%' }"></div>
        </div>
            <span class="stat-percentage">{{ item.percentage }}%</span>
        </div>
      </div>
      
        <div v-else-if="activeTab === 'region'" class="region-stats">
          <div class="stat-item" v-for="item in regionStats" :key="item.name">
            <div class="stat-info">
              <span class="stat-name">{{ item.name }}</span>
              <span class="stat-amount">{{ item.amount }}万元</span>
        </div>
            <div class="stat-bar">
              <div class="bar-fill" :style="{ width: item.percentage + '%' }"></div>
            </div>
            <span class="stat-percentage">{{ item.percentage }}%</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 投资趋势图表 -->
      <div class="trend-chart">
      <div class="chart-header">
        <h3 class="chart-title">投资趋势分析</h3>
        <div class="time-range">
          <span class="range-label">时间范围:</span>
          <span class="range-value">2024年1月 - 12月</span>
        </div>
      </div>
      <div class="chart-container">
        <div class="chart-placeholder">
          <div class="placeholder-text">投资趋势图表</div>
          <div class="placeholder-hint">月度投资额变化趋势</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 投资数据
const investmentData = ref({
  totalAmount: 125000,
  totalTrend: 12.5,
  completedAmount: 85000,
  completionRate: 68.0,
  ongoingAmount: 35000,
  ongoingProjects: 28,
  plannedAmount: 5000,
  planStatus: '审批中'
})

// 分类统计数据
const categoryStats = ref([
  { name: '页岩气开发', amount: 45000, percentage: 36.0 },
  { name: '新能源项目', amount: 35000, percentage: 28.0 },
  { name: '基础设施', amount: 25000, percentage: 20.0 },
  { name: '技术改造', amount: 15000, percentage: 12.0 },
  { name: '其他项目', amount: 5000, percentage: 4.0 }
])

// 地区统计数据
const regionStats = ref([
  { name: '四川地区', amount: 60000, percentage: 48.0 },
  { name: '重庆地区', amount: 35000, percentage: 28.0 },
  { name: '云南地区', amount: 20000, percentage: 16.0 },
  { name: '贵州地区', amount: 10000, percentage: 8.0 }
])

// 当前激活的标签页
const activeTab = ref('category')

onMounted(() => {
  console.log('投资计划管理页面已加载')
})
</script>

<style scoped>
.investment-plan {
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

.overview-cards {
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

.amount-info {
  display: flex;
  align-items: baseline;
  gap: 0.5vw;
  margin-bottom: 0.8vh;
}

.amount-value {
  color: #2470FF;
  font-size: 1.5vw;
  font-weight: bold;
}

.amount-unit {
  color: #666;
  font-size: 0.8vw;
}

.trend-info, .completion-rate, .project-count, .plan-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8vw;
}

.trend-label, .rate-label, .count-label, .status-label {
  color: #666;
}

.trend-value.positive {
  color: #52c41a;
}

.trend-value.negative {
  color: #ff4d4f;
}

.rate-value, .count-value, .status-value {
  color: #2470FF;
  font-weight: bold;
}

.investment-stats {
  background: white;
  border-radius: 8px;
  padding: 2vh 1.5vw;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-bottom: 2vh;
}

.stats-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2vh;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 1vh;
}

.stats-title {
  color: #333;
  font-size: 1vw;
  font-weight: bold;
  margin: 0;
}

.stats-tabs {
  display: flex;
  gap: 1vw;
}

.tab-item {
  padding: 0.5vh 1vw;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.8vw;
  color: #666;
}

.tab-item.active {
  background: #2470FF;
  color: white;
}

.tab-item:hover:not(.active) {
  background: #f0f0f0;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 1vw;
  margin-bottom: 1.5vh;
  padding: 1vh 0;
}

.stat-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 40%;
}

.stat-name {
  color: #333;
  font-size: 0.9vw;
  font-weight: bold;
}

.stat-amount {
  color: #2470FF;
  font-size: 0.9vw;
  font-weight: bold;
}

.stat-bar {
  flex: 1;
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #2470FF, #6da0ff);
  transition: width 0.3s ease;
}

.stat-percentage {
  color: #666;
  font-size: 0.8vw;
  min-width: 3vw;
  text-align: right;
}

.trend-chart {
  flex: 1;
  background: white;
  border-radius: 8px;
  padding: 2vh 1.5vw;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2vh;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 1vh;
}

.chart-title {
  color: #333;
  font-size: 1vw;
  font-weight: bold;
  margin: 0;
}

.time-range {
  display: flex;
  align-items: center;
  gap: 0.5vw;
  font-size: 0.8vw;
}

.range-label {
  color: #666;
}

.range-value {
  color: #2470FF;
  font-weight: bold;
}

.chart-container {
  height: calc(100% - 4vh);
}

.chart-placeholder {
  height: 100%;
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
  font-size: 1.2vw;
  font-weight: bold;
  margin-bottom: 0.5vh;
}

.placeholder-hint {
  font-size: 0.8vw;
  color: #adb5bd;
}
</style>
