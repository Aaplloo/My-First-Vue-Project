<template>
  <div class="overview">
    <!-- 主标题区域 -->
    <div class="title-section">
      <div class="main-title-wrapper">
        <div class="title-decoration"></div>
        <h2 class="main-title">平台总览</h2>
      </div>
    </div>
    
    <!-- 关键指标卡片 -->
    <div class="kpi-cards">
      <!-- 总项目数 -->
      <div class="kpi-card">
        <div class="card-header">
          <div class="card-icon">
            <span class="icon-text">📊</span>
          </div>
          <span class="card-title">总项目数</span>
        </div>
        <div class="card-content">
          <div class="kpi-value">
            <span class="value-number">{{ overviewData.totalProjects }}</span>
            <span class="value-unit">项</span>
          </div>
          <div class="kpi-trend">
            <span class="trend-label">较上月:</span>
            <span class="trend-value positive">+{{ overviewData.projectGrowth }}%</span>
          </div>
        </div>
      </div>

      <!-- 总投资额 -->
      <div class="kpi-card">
        <div class="card-header">
          <div class="card-icon">
            <span class="icon-text">💰</span>
          </div>
          <span class="card-title">总投资额</span>
        </div>
        <div class="card-content">
          <div class="kpi-value">
            <span class="value-number">{{ overviewData.totalInvestment }}</span>
            <span class="value-unit">万元</span>
          </div>
          <div class="investment-progress">
            <span class="progress-label">执行率:</span>
            <span class="progress-value">{{ overviewData.investmentProgress }}%</span>
          </div>
        </div>
      </div>

      <!-- 完成项目数 -->
      <div class="kpi-card">
        <div class="card-header">
          <div class="card-icon">
            <span class="icon-text">✅</span>
          </div>
          <span class="card-title">完成项目数</span>
        </div>
        <div class="card-content">
          <div class="kpi-value">
            <span class="value-number">{{ overviewData.completedProjects }}</span>
            <span class="value-unit">项</span>
          </div>
          <div class="completion-rate">
            <span class="rate-label">完成率:</span>
            <span class="rate-value">{{ overviewData.completionRate }}%</span>
          </div>
        </div>
      </div>

      <!-- 进行中项目 -->
      <div class="kpi-card">
        <div class="card-header">
          <div class="card-icon">
            <span class="icon-text">🔄</span>
          </div>
          <span class="card-title">进行中项目</span>
        </div>
        <div class="card-content">
          <div class="kpi-value">
            <span class="value-number">{{ overviewData.ongoingProjects }}</span>
            <span class="value-unit">项</span>
          </div>
          <div class="ongoing-status">
            <span class="status-label">平均进度:</span>
            <span class="status-value">{{ overviewData.averageProgress }}%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 平台概览图表 -->
    <div class="overview-charts">
      <div class="section-header">
        <h3 class="section-title">平台概览</h3>
        <div class="chart-controls">
          <span class="control-label">时间范围:</span>
          <select v-model="selectedTimeRange" class="chart-select">
            <option value="week">本周</option>
            <option value="month">本月</option>
            <option value="quarter">本季度</option>
            <option value="year">本年度</option>
          </select>
        </div>
      </div>
      
      <div class="charts-grid">
        <!-- 项目趋势图 -->
        <div class="chart-container">
          <div class="chart-title">项目趋势</div>
          <div class="chart-placeholder">
            <div class="placeholder-text">项目数量趋势图</div>
            <div class="placeholder-hint">项目数量变化趋势分析</div>
          </div>
        </div>
        
        <!-- 投资分布图 -->
        <div class="chart-container">
          <div class="chart-title">投资分布</div>
          <div class="chart-placeholder">
            <div class="placeholder-text">投资分布饼图</div>
            <div class="placeholder-hint">各类型项目投资占比</div>
          </div>
        </div>
        
        <!-- 地区分布图 -->
        <div class="chart-container">
          <div class="chart-title">地区分布</div>
          <div class="chart-placeholder">
            <div class="placeholder-text">地区分布柱状图</div>
            <div class="placeholder-hint">各地区项目分布情况</div>
          </div>
        </div>
        
        <!-- 完成情况图 -->
        <div class="chart-container">
          <div class="chart-title">完成情况</div>
          <div class="chart-placeholder">
            <div class="placeholder-text">完成情况雷达图</div>
            <div class="placeholder-hint">各维度完成情况评估</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 快速操作区域 -->
    <div class="quick-actions">
      <div class="actions-header">
        <h3 class="actions-title">快速操作</h3>
      </div>
      
      <div class="actions-grid">
        <div class="action-item" v-for="action in quickActions" :key="action.id">
          <div class="action-icon">
            <span class="icon-text">{{ action.icon }}</span>
          </div>
          <div class="action-info">
            <div class="action-name">{{ action.name }}</div>
            <div class="action-desc">{{ action.description }}</div>
          </div>
          <button class="action-btn" @click="handleQuickAction(action)">
            {{ action.buttonText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 总览数据
const overviewData = ref({
  totalProjects: 1256,
  projectGrowth: 8.5,
  totalInvestment: 156800,
  investmentProgress: 78.5,
  completedProjects: 1089,
  completionRate: 86.7,
  ongoingProjects: 167,
  averageProgress: 67.8
})

// 快速操作
const quickActions = ref([
  {
    id: 1,
    name: '新建项目',
    description: '创建新的项目计划',
    icon: '➕',
    buttonText: '创建'
  },
  {
    id: 2,
    name: '项目审批',
    description: '审批待处理的项目',
    icon: '📋',
    buttonText: '审批'
  },
  {
    id: 3,
    name: '数据导出',
    description: '导出项目统计数据',
    icon: '📊',
    buttonText: '导出'
  },
  {
    id: 4,
    name: '系统设置',
    description: '配置系统参数',
    icon: '⚙️',
    buttonText: '设置'
  }
])

// 时间范围选择
const selectedTimeRange = ref('month')

// 处理快速操作
const handleQuickAction = (action) => {
  console.log('执行快速操作:', action.name)
  // 这里可以添加具体的操作逻辑
}

onMounted(() => {
  console.log('总览页面已加载')
})
</script>

<style scoped>
.overview {
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

.kpi-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5vw;
  margin-bottom: 2vh;
}

.kpi-card {
  background: white;
  border-radius: 8px;
  padding: 1.5vh 1vw;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.kpi-card:hover {
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

.kpi-value {
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

.kpi-trend, .investment-progress, .completion-rate, .ongoing-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8vw;
}

.trend-label, .progress-label, .rate-label, .status-label {
  color: #666;
}

.trend-value.positive {
  color: #52c41a;
}

.progress-value, .rate-value, .status-value {
  color: #2470FF;
  font-weight: bold;
}

.overview-charts {
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

.quick-actions {
  flex: 1;
  background: white;
  border-radius: 8px;
  padding: 2vh 1.5vw;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.actions-header {
  margin-bottom: 2vh;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 1vh;
}

.actions-title {
  color: #333;
  font-size: 1vw;
  font-weight: bold;
  margin: 0;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2vw;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 1vw;
  padding: 2vh 1.5vw;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
}

.action-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
  border-color: #2470FF;
}

.action-icon {
  width: 3vw;
  height: 3vw;
  background: #e6f7ff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5vw;
}

.action-info {
  flex: 1;
}

.action-name {
  color: #333;
  font-size: 0.9vw;
  font-weight: bold;
  margin-bottom: 0.3vh;
}

.action-desc {
  color: #666;
  font-size: 0.7vw;
}

.action-btn {
  padding: 0.5vh 1vw;
  background: #2470FF;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.8vw;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.action-btn:hover {
  background: #1e5fd9;
}
</style>
