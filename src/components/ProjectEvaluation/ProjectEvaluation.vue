<template>
  <div class="project-evaluation">
    <!-- 主标题区域 -->
    <div class="title-section">
      <div class="main-title-wrapper">
        <div class="title-decoration"></div>
        <h2 class="main-title">项目评价管理</h2>
      </div>
    </div>
    
    <!-- 评价概览卡片 -->
    <div class="evaluation-overview">
      <!-- 评价总数 -->
      <div class="overview-card">
        <div class="card-header">
          <div class="card-icon">
            <span class="icon-text">📋</span>
          </div>
          <span class="card-title">评价总数</span>
        </div>
        <div class="card-content">
          <div class="overview-value">
            <span class="value-number">{{ evaluationData.totalCount }}</span>
            <span class="value-unit">项</span>
          </div>
          <div class="overview-trend">
            <span class="trend-label">本月新增:</span>
            <span class="trend-value positive">+{{ evaluationData.monthlyNew }}项</span>
          </div>
        </div>
      </div>

      <!-- 已完成评价 -->
      <div class="overview-card">
        <div class="card-header">
          <div class="card-icon">
            <span class="icon-text">✅</span>
          </div>
          <span class="card-title">已完成评价</span>
        </div>
        <div class="card-content">
          <div class="overview-value">
            <span class="value-number">{{ evaluationData.completedCount }}</span>
            <span class="value-unit">项</span>
          </div>
          <div class="completion-rate">
            <span class="rate-label">完成率:</span>
            <span class="rate-value">{{ evaluationData.completionRate }}%</span>
          </div>
        </div>
      </div>

      <!-- 进行中评价 -->
      <div class="overview-card">
        <div class="card-header">
          <div class="card-icon">
            <span class="icon-text">🔄</span>
          </div>
          <span class="card-title">进行中评价</span>
        </div>
        <div class="card-content">
          <div class="overview-value">
            <span class="value-number">{{ evaluationData.ongoingCount }}</span>
            <span class="value-unit">项</span>
          </div>
          <div class="ongoing-status">
            <span class="status-label">状态:</span>
            <span class="status-value ongoing">评价中</span>
          </div>
        </div>
      </div>

      <!-- 平均评分 -->
      <div class="overview-card">
        <div class="card-header">
          <div class="card-icon">
            <span class="icon-text">⭐</span>
          </div>
          <span class="card-title">平均评分</span>
        </div>
        <div class="card-content">
          <div class="overview-value">
            <span class="value-number">{{ evaluationData.averageScore }}</span>
            <span class="value-unit">分</span>
          </div>
          <div class="score-level">
            <span class="level-label">等级:</span>
            <span class="level-value" :class="getScoreLevelClass(evaluationData.averageScore)">
              {{ getScoreLevel(evaluationData.averageScore) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 评价分类统计 -->
    <div class="evaluation-stats">
      <div class="stats-header">
        <h3 class="stats-title">评价分类统计</h3>
        <div class="stats-filter">
          <span class="filter-label">时间范围:</span>
          <select v-model="selectedPeriod" class="filter-select">
            <option value="month">本月</option>
            <option value="quarter">本季度</option>
            <option value="year">本年度</option>
          </select>
        </div>
      </div>
      
      <div class="stats-content">
        <div class="category-chart">
          <div class="chart-title">评价类型分布</div>
          <div class="chart-placeholder">
            <div class="placeholder-text">评价类型分布图表</div>
            <div class="placeholder-hint">各类型项目评价数量统计</div>
          </div>
        </div>
        
        <div class="score-distribution">
          <div class="distribution-title">评分分布</div>
          <div class="score-bars">
            <div class="score-bar" v-for="score in scoreDistribution" :key="score.range">
              <div class="score-label">{{ score.range }}</div>
              <div class="score-bar-container">
                <div class="score-bar-fill" :style="{ width: score.percentage + '%' }"></div>
              </div>
              <div class="score-count">{{ score.count }}项</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 评价列表 -->
    <div class="evaluation-list">
      <div class="list-header">
        <h3 class="list-title">评价项目列表</h3>
        <div class="list-actions">
          <button class="action-btn primary">+ 新建评价</button>
          <button class="action-btn">导出数据</button>
        </div>
      </div>
      
      <div class="list-filters">
        <div class="filter-group">
          <label>评价状态:</label>
          <select v-model="selectedStatus" class="filter-select">
            <option value="">全部状态</option>
            <option value="completed">已完成</option>
            <option value="ongoing">进行中</option>
            <option value="pending">待开始</option>
          </select>
        </div>
        
        <div class="filter-group">
          <label>项目类型:</label>
          <select v-model="selectedType" class="filter-select">
            <option value="">全部类型</option>
            <option value="energy">能源开发</option>
            <option value="infrastructure">基础设施</option>
            <option value="technology">技术改造</option>
          </select>
        </div>
        
        <div class="filter-group">
          <label>评分范围:</label>
          <select v-model="selectedScore" class="filter-select">
            <option value="">全部评分</option>
            <option value="high">优秀(90-100)</option>
            <option value="good">良好(80-89)</option>
            <option value="average">一般(70-79)</option>
            <option value="poor">较差(70以下)</option>
          </select>
        </div>
      </div>
      
      <div class="evaluation-table">
        <div class="table-header">
          <div class="header-cell">项目名称</div>
          <div class="header-cell">项目类型</div>
          <div class="header-cell">评价状态</div>
          <div class="header-cell">评分</div>
          <div class="header-cell">评价人</div>
          <div class="header-cell">评价时间</div>
          <div class="header-cell">操作</div>
        </div>
        
        <div class="table-row" v-for="item in filteredEvaluations" :key="item.id">
          <div class="table-cell">{{ item.projectName }}</div>
          <div class="table-cell">{{ item.projectType }}</div>
          <div class="table-cell">
            <span class="status-badge" :class="item.status">{{ item.statusText }}</span>
          </div>
          <div class="table-cell">
            <span class="score-value" :class="getScoreClass(item.score)">{{ item.score }}分</span>
          </div>
          <div class="table-cell">{{ item.evaluator }}</div>
          <div class="table-cell">{{ item.evaluationDate }}</div>
          <div class="table-cell">
            <button class="action-btn small">查看</button>
            <button class="action-btn small">编辑</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// 评价数据
const evaluationData = ref({
  totalCount: 156,
  monthlyNew: 12,
  completedCount: 134,
  completionRate: 85.9,
  ongoingCount: 22,
  averageScore: 87.5
})

// 评分分布数据
const scoreDistribution = ref([
  { range: '90-100', count: 45, percentage: 28.8 },
  { range: '80-89', count: 68, percentage: 43.6 },
  { range: '70-79', count: 32, percentage: 20.5 },
  { range: '60-69', count: 8, percentage: 5.1 },
  { range: '60以下', count: 3, percentage: 1.9 }
])

// 评价列表数据
const evaluations = ref([
  {
    id: 1,
    projectName: '页岩气开发项目A',
    projectType: '能源开发',
    status: 'completed',
    statusText: '已完成',
    score: 92,
    evaluator: '张三',
    evaluationDate: '2024-01-15'
  },
  {
    id: 2,
    projectName: '新能源发电站B',
    projectType: '新能源',
    status: 'ongoing',
    statusText: '进行中',
    score: 0,
    evaluator: '李四',
    evaluationDate: '2024-01-20'
  },
  {
    id: 3,
    projectName: '石油管道维护C',
    projectType: '基础设施',
    status: 'completed',
    statusText: '已完成',
    score: 88,
    evaluator: '王五',
    evaluationDate: '2024-01-18'
  }
])

// 筛选条件
const selectedPeriod = ref('month')
const selectedStatus = ref('')
const selectedType = ref('')
const selectedScore = ref('')

// 计算筛选后的评价列表
const filteredEvaluations = computed(() => {
  let filtered = evaluations.value
  
  if (selectedStatus.value) {
    filtered = filtered.filter(item => item.status === selectedStatus.value)
  }
  
  if (selectedType.value) {
    filtered = filtered.filter(item => item.projectType === selectedType.value)
  }
  
  if (selectedScore.value) {
    filtered = filtered.filter(item => {
      const score = item.score
      switch (selectedScore.value) {
        case 'high': return score >= 90
        case 'good': return score >= 80 && score < 90
        case 'average': return score >= 70 && score < 80
        case 'poor': return score < 70
        default: return true
      }
    })
  }
  
  return filtered
})

// 获取评分等级
const getScoreLevel = (score) => {
  if (score >= 90) return '优秀'
  if (score >= 80) return '良好'
  if (score >= 70) return '一般'
  if (score >= 60) return '及格'
  return '不及格'
}

// 获取评分等级样式类
const getScoreLevelClass = (score) => {
  if (score >= 90) return 'excellent'
  if (score >= 80) return 'good'
  if (score >= 70) return 'average'
  if (score >= 60) return 'pass'
  return 'fail'
}

// 获取评分样式类
const getScoreClass = (score) => {
  if (score >= 90) return 'excellent'
  if (score >= 80) return 'good'
  if (score >= 70) return 'average'
  if (score >= 60) return 'pass'
  return 'fail'
}

onMounted(() => {
  console.log('项目评价管理页面已加载')
})
</script>

<style scoped>
.project-evaluation {
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

.evaluation-overview {
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

.overview-trend, .completion-rate, .ongoing-status, .score-level {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8vw;
}

.trend-label, .rate-label, .status-label, .level-label {
  color: #666;
}

.trend-value.positive {
  color: #52c41a;
}

.rate-value, .status-value.ongoing {
  color: #2470FF;
  font-weight: bold;
}

.level-value.excellent {
  color: #52c41a;
}

.level-value.good {
  color: #1890ff;
}

.level-value.average {
  color: #fa8c16;
}

.level-value.pass {
  color: #722ed1;
}

.level-value.fail {
  color: #ff4d4f;
}

.evaluation-stats {
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

.stats-filter {
  display: flex;
  align-items: center;
  gap: 0.8vw;
}

.filter-label {
  color: #666;
  font-size: 0.8vw;
}

.filter-select {
  padding: 0.3vh 0.5vw;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 0.8vw;
  background: white;
}

.stats-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2vw;
  min-height: 25vh;
}

.category-chart, .score-distribution {
  display: flex;
  flex-direction: column;
}

.chart-title, .distribution-title {
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

.score-bars {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1vh;
}

.score-bar {
  display: flex;
  align-items: center;
  gap: 1vw;
}

.score-label {
  color: #333;
  font-size: 0.8vw;
  min-width: 4vw;
}

.score-bar-container {
  flex: 1;
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}

.score-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #2470FF, #6da0ff);
  transition: width 0.3s ease;
}

.score-count {
  color: #666;
  font-size: 0.8vw;
  min-width: 3vw;
  text-align: right;
}

.evaluation-list {
  flex: 1;
  background: white;
  border-radius: 8px;
  padding: 2vh 1.5vw;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2vh;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 1vh;
}

.list-title {
  color: #333;
  font-size: 1vw;
  font-weight: bold;
  margin: 0;
}

.list-actions {
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

.action-btn.small {
  padding: 0.3vh 0.6vw;
  font-size: 0.7vw;
  margin: 0 0.2vw;
}

.list-filters {
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

.evaluation-table {
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1.5fr 1.5fr;
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
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1.5fr 1.5fr;
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

.status-badge {
  padding: 0.3vh 0.8vw;
  border-radius: 12px;
  font-size: 0.7vw;
  font-weight: bold;
}

.status-badge.completed {
  background: #f6ffed;
  color: #52c41a;
}

.status-badge.ongoing {
  background: #e6f7ff;
  color: #1890ff;
}

.status-badge.pending {
  background: #fff7e6;
  color: #fa8c16;
}

.score-value {
  font-weight: bold;
}

.score-value.excellent {
  color: #52c41a;
}

.score-value.good {
  color: #1890ff;
}

.score-value.average {
  color: #fa8c16;
}

.score-value.pass {
  color: #722ed1;
}

.score-value.fail {
  color: #ff4d4f;
}
</style>
