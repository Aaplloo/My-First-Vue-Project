<template>
  <div class="prophase-management">
    <!-- 主标题区域 -->
    <div class="title-section">
      <div class="main-title-wrapper">
        <div class="title-decoration"></div>
        <h2 class="main-title">前期管理</h2>
      </div>
    </div>
    
    <!-- 管理概览卡片 -->
    <div class="management-overview">
      <!-- 总项目数 -->
      <div class="overview-card">
        <div class="card-header">
          <div class="card-icon">
            <span class="icon-text">📋</span>
          </div>
          <span class="card-title">总项目数</span>
        </div>
        <div class="card-content">
          <div class="overview-value">
            <span class="value-number">{{ managementData.totalProjects }}</span>
            <span class="value-unit">项</span>
          </div>
          <div class="overview-trend">
            <span class="trend-label">较上月:</span>
            <span class="trend-value positive">+{{ managementData.monthlyGrowth }}项</span>
          </div>
        </div>
      </div>

      <!-- 进行中项目 -->
      <div class="overview-card">
        <div class="card-header">
          <div class="card-icon">
            <span class="icon-text">🔄</span>
          </div>
          <span class="card-title">进行中项目</span>
        </div>
        <div class="card-content">
          <div class="overview-value">
            <span class="value-number">{{ managementData.ongoingProjects }}</span>
            <span class="value-unit">项</span>
          </div>
          <div class="ongoing-progress">
            <span class="progress-label">平均进度:</span>
            <span class="progress-value">{{ managementData.averageProgress }}%</span>
          </div>
        </div>
      </div>

      <!-- 已完成项目 -->
      <div class="overview-card">
        <div class="card-header">
          <div class="card-icon">
            <span class="icon-text">✅</span>
          </div>
          <span class="card-title">已完成项目</span>
        </div>
        <div class="card-content">
          <div class="overview-value">
            <span class="value-number">{{ managementData.completedProjects }}</span>
            <span class="value-unit">项</span>
          </div>
          <div class="completion-rate">
            <span class="rate-label">完成率:</span>
            <span class="rate-value">{{ managementData.completionRate }}%</span>
          </div>
        </div>
      </div>

      <!-- 风险项目 -->
      <div class="overview-card">
        <div class="card-header">
          <div class="card-icon">
            <span class="icon-text">⚠️</span>
          </div>
          <span class="card-title">风险项目</span>
        </div>
        <div class="card-content">
          <div class="overview-value">
            <span class="value-number">{{ managementData.riskProjects }}</span>
            <span class="value-unit">项</span>
          </div>
          <div class="risk-level">
            <span class="level-label">风险等级:</span>
            <span class="level-value high">高风险</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 管理流程监控 -->
    <div class="process-monitoring">
      <div class="section-header">
        <h3 class="section-title">管理流程监控</h3>
        <div class="monitoring-tabs">
          <span 
            class="tab-item" 
            :class="{ active: activeTab === 'workflow' }"
            @click="activeTab = 'workflow'"
          >工作流</span>
          <span 
            class="tab-item" 
            :class="{ active: activeTab === 'timeline' }"
            @click="activeTab = 'timeline'"
          >时间线</span>
        </div>
      </div>
      
      <div class="monitoring-content">
        <div v-if="activeTab === 'workflow'" class="workflow-view">
          <div class="workflow-steps">
            <div class="workflow-step" v-for="step in workflowSteps" :key="step.id">
              <div class="step-icon" :class="step.status">
                <span class="icon-text">{{ step.icon }}</span>
              </div>
              <div class="step-info">
                <div class="step-name">{{ step.name }}</div>
                <div class="step-count">{{ step.count }}项</div>
                <div class="step-status">{{ step.statusText }}</div>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else-if="activeTab === 'timeline'" class="timeline-view">
          <div class="timeline-chart">
            <div class="chart-placeholder">
              <div class="placeholder-text">项目时间线图表</div>
              <div class="placeholder-hint">项目各阶段时间安排和进度</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 项目列表 -->
    <div class="project-list">
      <div class="list-header">
        <h3 class="list-title">项目列表</h3>
        <div class="list-actions">
          <button class="action-btn primary">+ 新建项目</button>
          <button class="action-btn">批量操作</button>
        </div>
      </div>
      
      <div class="list-filters">
        <div class="filter-group">
          <label>项目状态:</label>
          <select v-model="selectedStatus" class="filter-select">
            <option value="">全部状态</option>
            <option value="planning">规划中</option>
            <option value="designing">设计中</option>
            <option value="reviewing">审核中</option>
            <option value="approved">已批准</option>
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
          <label>优先级:</label>
          <select v-model="selectedPriority" class="filter-select">
            <option value="">全部优先级</option>
            <option value="high">高</option>
            <option value="medium">中</option>
            <option value="low">低</option>
          </select>
        </div>
      </div>
      
      <div class="project-table">
        <div class="table-header">
          <div class="header-cell">项目名称</div>
          <div class="header-cell">项目类型</div>
          <div class="header-cell">当前阶段</div>
          <div class="header-cell">进度</div>
          <div class="header-cell">负责人</div>
          <div class="header-cell">预计完成</div>
          <div class="header-cell">操作</div>
        </div>
        
        <div class="table-row" v-for="item in filteredProjects" :key="item.id">
          <div class="table-cell">{{ item.projectName }}</div>
          <div class="table-cell">{{ item.projectType }}</div>
          <div class="table-cell">
            <span class="stage-badge" :class="item.stage">{{ item.stageText }}</span>
          </div>
          <div class="table-cell">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: item.progress + '%' }"></div>
            </div>
            <span class="progress-text">{{ item.progress }}%</span>
          </div>
          <div class="table-cell">{{ item.manager }}</div>
          <div class="table-cell">{{ item.expectedDate }}</div>
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

// 管理数据
const managementData = ref({
  totalProjects: 89,
  monthlyGrowth: 12,
  ongoingProjects: 45,
  averageProgress: 67.8,
  completedProjects: 32,
  completionRate: 36.0,
  riskProjects: 8
})

// 工作流步骤
const workflowSteps = ref([
  {
    id: 1,
    name: '项目立项',
    icon: '📋',
    count: 15,
    status: 'completed',
    statusText: '已完成'
  },
  {
    id: 2,
    name: '可行性研究',
    icon: '🔍',
    count: 23,
    status: 'ongoing',
    statusText: '进行中'
  },
  {
    id: 3,
    name: '方案设计',
    icon: '✏️',
    count: 18,
    status: 'pending',
    statusText: '待开始'
  },
  {
    id: 4,
    name: '专家评审',
    icon: '👥',
    count: 12,
    status: 'pending',
    statusText: '待开始'
  },
  {
    id: 5,
    name: '项目批准',
    icon: '✅',
    count: 21,
    status: 'completed',
    statusText: '已完成'
  }
])

// 项目列表数据
const projects = ref([
  {
    id: 1,
    projectName: '页岩气开发项目A',
    projectType: '能源开发',
    stage: 'planning',
    stageText: '规划中',
    progress: 25,
    manager: '张三',
    expectedDate: '2024-06-30'
  },
  {
    id: 2,
    projectName: '新能源发电站B',
    projectType: '新能源',
    stage: 'designing',
    stageText: '设计中',
    progress: 65,
    manager: '李四',
    expectedDate: '2024-08-15'
  },
  {
    id: 3,
    projectName: '石油管道维护C',
    projectType: '基础设施',
    stage: 'reviewing',
    stageText: '审核中',
    progress: 85,
    manager: '王五',
    expectedDate: '2024-05-20'
  }
])

// 筛选条件
const selectedStatus = ref('')
const selectedType = ref('')
const selectedPriority = ref('')
const activeTab = ref('workflow')

// 计算筛选后的项目列表
const filteredProjects = computed(() => {
  let filtered = projects.value
  
  if (selectedStatus.value) {
    filtered = filtered.filter(item => item.stage === selectedStatus.value)
  }
  
  if (selectedType.value) {
    filtered = filtered.filter(item => item.projectType === selectedType.value)
  }
  
  return filtered
})

onMounted(() => {
  console.log('前期管理页面已加载')
})
</script>

<style scoped>
.prophase-management {
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

.management-overview {
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

.overview-trend, .ongoing-progress, .completion-rate, .risk-level {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8vw;
}

.trend-label, .progress-label, .rate-label, .level-label {
  color: #666;
}

.trend-value.positive {
  color: #52c41a;
}

.progress-value, .rate-value {
  color: #2470FF;
  font-weight: bold;
}

.level-value.high {
  color: #ff4d4f;
  font-weight: bold;
}

.process-monitoring {
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

.monitoring-tabs {
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

.monitoring-content {
  min-height: 25vh;
}

.workflow-steps {
  display: flex;
  justify-content: space-between;
  gap: 2vw;
}

.workflow-step {
  flex: 1;
  text-align: center;
  padding: 2vh 1vw;
  background: #f8f9fa;
  border-radius: 8px;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.workflow-step:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
}

.step-icon {
  width: 4vw;
  height: 4vw;
  margin: 0 auto 1vh;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5vw;
}

.step-icon.completed {
  background: #f6ffed;
  border: 2px solid #52c41a;
}

.step-icon.ongoing {
  background: #e6f7ff;
  border: 2px solid #1890ff;
}

.step-icon.pending {
  background: #fff7e6;
  border: 2px solid #fa8c16;
}

.step-name {
  color: #333;
  font-size: 0.9vw;
  font-weight: bold;
  margin-bottom: 0.5vh;
}

.step-count {
  color: #2470FF;
  font-size: 1vw;
  font-weight: bold;
  margin-bottom: 0.5vh;
}

.step-status {
  color: #666;
  font-size: 0.8vw;
}

.timeline-chart {
  height: 25vh;
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
  font-size: 1vw;
  font-weight: bold;
  margin-bottom: 0.5vh;
}

.placeholder-hint {
  font-size: 0.7vw;
  color: #adb5bd;
}

.project-list {
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

.filter-select {
  padding: 0.3vh 0.5vw;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 0.8vw;
  background: white;
}

.project-table {
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.5fr 1fr 1.5fr 1.5fr;
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
  grid-template-columns: 2fr 1fr 1fr 1.5fr 1fr 1.5fr 1.5fr;
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

.stage-badge {
  padding: 0.3vh 0.8vw;
  border-radius: 12px;
  font-size: 0.7vw;
  font-weight: bold;
}

.stage-badge.planning {
  background: #fff7e6;
  color: #fa8c16;
}

.stage-badge.designing {
  background: #e6f7ff;
  color: #1890ff;
}

.stage-badge.reviewing {
  background: #f6ffed;
  color: #52c41a;
}

.stage-badge.approved {
  background: #f0f0f0;
  color: #666;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
  margin-right: 0.5vw;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #2470FF, #6da0ff);
  transition: width 0.3s ease;
}

.progress-text {
  color: #666;
  font-size: 0.7vw;
  min-width: 2.5vw;
}
</style>
