<template>
  <div class="process-follow">
    <!-- 主标题区域 -->
    <div class="title-section">
      <div class="main-title-wrapper">
        <div class="title-decoration"></div>
        <h2 class="main-title">进度跟踪</h2>
      </div>
      <div class="main-tabs">
        <div 
          class="main-tab" 
          :class="{ active: activeMainTab === 'currentBatch' }"
          @click="switchMainTab('currentBatch')"
        >当前批次填报情况</div>
        <div 
          class="main-tab" 
          :class="{ active: activeMainTab === 'completionProgress' }"
          @click="switchMainTab('completionProgress')"
        >计划完成进度</div>
      </div>
    </div>
    
    <!-- 当前批次填报情况内容 -->
    <div v-if="activeMainTab === 'currentBatch'">
      <!-- 筛选器区域 -->
      <div class="filter-section">
        <div 
          class="filter-item" 
          :class="{ active: activeFilter === 'all' }"
          @click="switchFilter('all')"
        >
          <div class="filter-icon grid-icon">
            <img src="@/assets/全部.svg" alt="grid" class="icon-image"></img>
          </div>
          <div class="filter-content">
            <span class="filter-text">全部</span>
            <span class="filter-number">{{ getFilterCount('all') }}</span>
          </div>
        </div>
        <div 
          class="filter-item" 
          :class="{ active: activeFilter === 'notStarted' }"
          @click="switchFilter('notStarted')"
        >
          <div class="filter-icon not-started-icon">
            <img src="@/assets/取消.svg" alt="not-started" class="icon-image"></img>
          </div>
          <div class="filter-content">
            <span class="filter-text">未启动</span>
            <span class="filter-number">{{ getFilterCount('notStarted') }}</span>
          </div>
        </div>
        <div 
          class="filter-item" 
          :class="{ active: activeFilter === 'inProgress' }"
          @click="switchFilter('inProgress')"
        >
          <div class="filter-icon in-progress-icon">
            <img src="@/assets/填报中.svg" alt="in-progress" class="icon-image"></img>
          </div>
          <div class="filter-content">
            <span class="filter-text">填报中</span>
            <span class="filter-number">{{ getFilterCount('inProgress') }}</span>
          </div>
        </div>
        <div 
          class="filter-item" 
          :class="{ active: activeFilter === 'completed' }"
          @click="switchFilter('completed')"
        >
          <div class="filter-icon completed-icon">
            <img src="@/assets/已完成.svg" alt="completed" class="icon-image"></img>
          </div>
          <div class="filter-content">
            <span class="filter-text">已完成</span>
            <span class="filter-number">{{ getFilterCount('completed') }}</span>
          </div>
        </div>
      </div>
      
      <!-- 卡片区域 -->
      <div class="cards-section">
        <!-- 动态生成卡片行 -->
        <div 
          v-for="(row, rowIndex) in getCardRows()" 
          :key="rowIndex"
          class="card-row"
        >
          <div 
            v-for="(card, cardIndex) in row" 
            :key="card.id"
            class="status-card"
            @click="expandMapLeft"
          >
            <div class="card-content">
              <span class="service-name">{{ card.serviceName }}</span>
              <div :class="['status-badge', getStatusClass(card.status)]">{{ card.status }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 计划完成进度内容 -->
    <div v-if="activeMainTab === 'completionProgress'" class="progress-flow-section">
      <div class="progress-flow-container">
        <!-- 流程图步骤 -->
        <div class="flow-step" :class="{ completed: step1Completed, current: step1Current }">
          <div class="step-icon" :class="{ completed: step1Completed, current: step1Current }">
            <div class="step-number">1</div>
          </div>
          <div class="step-content">
            <div class="step-title">项目立项</div>
          </div>
        </div>
        
        <div class="flow-connector" :class="{ completed: step1Completed }"></div>
        
        <div class="flow-step" :class="{ completed: step2Completed, current: step2Current }">
          <div class="step-icon" :class="{ completed: step2Completed, current: step2Current }">
            <div class="step-number">2</div>
          </div>
          <div class="step-content">
            <div class="step-title">方案设计</div>
          </div>
        </div>
        
        <div class="flow-connector" :class="{ completed: step2Completed }"></div>
        
        <div class="flow-step" :class="{ completed: step3Completed, current: step3Current }">
          <div class="step-icon" :class="{ completed: step3Completed, current: step3Current }">
            <div class="step-number">3</div>
          </div>
          <div class="step-content">
            <div class="step-title">审批流程</div>
          </div>
        </div>
        
        <div class="flow-connector" :class="{ completed: step3Completed }"></div>
        
        <div class="flow-step" :class="{ completed: step4Completed, current: step4Current }">
          <div class="step-icon" :class="{ completed: step4Completed, current: step4Current }">
            <div class="step-number">4</div>
          </div>
          <div class="step-content">
            <div class="step-title">实施执行</div>
          </div>
        </div>
        
        <div class="flow-connector" :class="{ completed: step4Completed }"></div>
        
        <div class="flow-step" :class="{ completed: step5Completed, current: step5Current }">
          <div class="step-icon" :class="{ completed: step5Completed, current: step5Current }">
            <div class="step-number">5</div>
          </div>
          <div class="step-content">
            <div class="step-title">验收完成</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

// 当前激活的主tab
const activeMainTab = ref('currentBatch')

// 切换主tab的方法
const switchMainTab = (tabName) => {
  activeMainTab.value = tabName
}

// 筛选器激活状态
const activeFilter = ref('all')

// 切换筛选器的方法
const switchFilter = (filterName) => {
  activeFilter.value = filterName
}

// 流程图步骤状态
const step1Completed = ref(true)
const step1Current = ref(false)
const step2Completed = ref(true)
const step2Current = ref(false)
const step3Completed = ref(false)
const step3Current = ref(true)
const step4Completed = ref(false)
const step4Current = ref(false)
const step5Completed = ref(false)
const step5Current = ref(false)

// 计算属性
const totalSteps = computed(() => 5)
const completedSteps = computed(() => {
  return [step1Completed, step2Completed, step3Completed, step4Completed, step5Completed]
    .filter(completed => completed.value).length
})
const completionRate = computed(() => {
  return Math.round((completedSteps.value / totalSteps.value) * 100)
})

// 卡片数据
const cardsData = ref([])

// 从CSV文件读取数据
const loadDataFromCSV = async () => {
  try {
    const response = await fetch('/process-follow-data.csv')
    const csvText = await response.text()
    const lines = csvText.trim().split('\n')
    
    const data = []
    lines.slice(1).forEach((line) => {
      const values = line.split(',')
      data.push({
        id: parseInt(values[0]),
        serviceName: values[1],
        status: values[2],
        filterType: values[3]
      })
    })
    
    // 检查数据是否发生变化
    const hasChanged = JSON.stringify(data) !== JSON.stringify(cardsData.value)
    
    if (hasChanged) {
      cardsData.value = data
      console.log('CSV数据已更新:', data)
    } else {
      console.log('CSV数据无变化')
    }
  } catch (error) {
    console.error('加载CSV数据失败:', error)
    // 如果CSV加载失败，使用默认数据
    loadDefaultData()
  }
}

// 加载默认数据（作为备用）
const loadDefaultData = () => {
  cardsData.value = [
    { id: 1, serviceName: '综合服务中心', status: '未启动', filterType: 'notStarted' },
    { id: 2, serviceName: '技术研发部', status: '未启动', filterType: 'notStarted' },
    { id: 3, serviceName: '生产运营部', status: '填报中', filterType: 'inProgress' },
    { id: 4, serviceName: '质量检测部', status: '填报中', filterType: 'inProgress' },
    { id: 5, serviceName: '人力资源部', status: '已完成', filterType: 'completed' },
    { id: 6, serviceName: '财务审计部', status: '已完成', filterType: 'completed' }
  ]
}

// 获取筛选器数量
const getFilterCount = (filterType) => {
  if (filterType === 'all') {
    return cardsData.value.length
  }
  
  // 根据筛选器类型映射到对应的状态
  let targetStatus = ''
  switch (filterType) {
    case 'notStarted':
      targetStatus = '未启动'
      break
    case 'inProgress':
      targetStatus = '填报中'
      break
    case 'completed':
      targetStatus = '已完成'
      break
    default:
      return 0
  }
  
  return cardsData.value.filter(card => card.status === targetStatus).length
}

// 获取状态样式类
const getStatusClass = (status) => {
  switch (status) {
    case '未启动':
      return 'not-started'
    case '填报中':
      return 'in-progress'
    case '已完成':
      return 'completed'
    default:
      return ''
  }
}

// 获取卡片行数据
const getCardRows = () => {
  let filteredCards = []
  
  if (activeFilter.value === 'all') {
    filteredCards = cardsData.value
  } else {
    // 根据筛选器类型映射到对应的状态
    let targetStatus = ''
    switch (activeFilter.value) {
      case 'notStarted':
        targetStatus = '未启动'
        break
      case 'inProgress':
        targetStatus = '填报中'
        break
      case 'completed':
        targetStatus = '已完成'
        break
      default:
        targetStatus = ''
    }
    
    filteredCards = cardsData.value.filter(card => card.status === targetStatus)
  }
  
  // 每行显示2个卡片
  const rows = []
  for (let i = 0; i < filteredCards.length; i += 2) {
    const row = filteredCards.slice(i, i + 2)
    rows.push(row)
  }
  
  return rows
}

// 判断是否应该显示卡片的筛选逻辑（保留原有方法以兼容）
const shouldShowCard = (cardStatus) => {
  if (activeFilter.value === 'all') {
    return true // 显示所有卡片
  }
  return activeFilter.value === cardStatus // 只显示对应状态的卡片
}

// 地图向左展开的逻辑
const expandMapLeft = () => {
  // 触发自定义事件，通知父组件向左展开地图
  const event = new CustomEvent('expandMapLeft', {
    detail: { component: 'process-follow' }
  })
  window.dispatchEvent(event)
}

// 生命周期钩子
onMounted(() => {
  // 延迟加载CSV数据，确保组件先渲染
  setTimeout(() => {
    loadDataFromCSV()
  }, 100)
  
  // 设置定时刷新，每30秒检查一次CSV数据更新
  const refreshInterval = setInterval(() => {
    loadDataFromCSV()
  }, 30000)
  
  // 组件卸载时清理定时器
  onUnmounted(() => {
    clearInterval(refreshInterval)
  })
})

// 暴露数据供外部使用
defineExpose({
  activeMainTab,
  switchMainTab,
  activeFilter,
  switchFilter,
  shouldShowCard,
  cardsData,
  loadDataFromCSV
})
</script>

<style scoped>
.process-follow {
  background: white;
  border-radius: 0.417vw;
  padding: 1vh 0.571vw 1.389vh 0.571vw;
  box-shadow: 0 0.185vh 0.417vw rgba(0, 0, 0, 0.1);
  width: 25.52vw;
  height: 27.552vh;
  position: fixed;
  right: 0.521vw;
  top: 8.333vh;
  overflow: hidden;
  z-index: 10;
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

.main-tabs {
  display: flex;
  gap: 0.417vw;
}

.main-tab {
  padding: 0.556vh 0.625vw;
  border-radius: 0.208vw;
  font-size: 0.573vw;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #F2F2F2;
  color: #999999;
  border: 0.052vw solid #E9ECEF;
}

.main-tab.active {
  background: #2470FF;
  color: white;
  border-color: #2470FF;
}

.main-tab:hover:not(.active) {
  background: #E9ECEF;
}

.filter-section {
  display: flex;
  margin-bottom: 1.389vh;
  margin-top: -0.8vh;
  padding: 0 0;
  border-radius: 0;
  width: 100%;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 0.208vw;
  padding: 0.67vh 0.417vw 0.67vh 0vw;
  border-radius: 0;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #247EFF;
  color: white;
  font-size: 1.25vw;
  flex: 1;
  justify-content: center;
}

.filter-item.active {
  background: #2470FF;
}

.filter-item:hover {
  background: #2470FF;
}

.filter-icon {
  font-size: 0.521vw;
  width: 0.625vw;
  height: 1.111vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.grid-icon {
  font-size: 0.417vw;
}

.icon-image {
  padding-left: -100000vw;
  width: 1.042vw;
  height: 1.667vh;
  object-fit: contain;
}

.not-started-icon {
  color: #FF6B6B;
}

.in-progress-icon {
  color: #4ECDC4;
}

.completed-icon {
  color: #51CF66;
}

.filter-text {
  font-size: 0.729vw;
}

.filter-content {
  padding-left: 0.417vw;
  display: flex;
  align-items: center;
  gap: 0.208vw;
}

.filter-number {
  color: #46EFD0;
  font-size: 0.729vw;
  font-weight: 600;
}

.cards-section {
  display: flex;
  flex-direction: column;
  gap: 0.926vh;
  height: calc(100% - 9.259vh);
  min-height: 16vh;
}

.card-row {
  display: flex;
  gap: 0.521vw;
  flex: 1;
  min-height: 4vh;
}

.status-card {
  flex: 1;
  background: white;
  border: 0.052vw solid #E9ECEF;
  border-radius: 0.313vw;
  padding: 1.111vh 0.625vw;
  transition: all 0.3s ease;
  cursor: pointer;
  height: 4.7vh;
  min-height: 4vh;
  display: flex;
  align-items: center;
  box-shadow: 0 0.185vh 0.417vw rgba(36, 112, 255, 0.2);
}

.status-card:hover {
  box-shadow: 0 0.37vh 0.625vw rgba(0, 0, 0, 0.1);
  transform: translateY(-0.185vh);
}

.card-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  width: 100%;
}

.service-name {
  font-size: 0.625vw;
  font-weight: 600;
  color: #2C3E50;
}

.status-badge {
  padding: 0.37vh 0.417vw;
  border-radius: 0.208vw;
  font-size: 0.521vw;
  font-weight: 600;
  flex-shrink: 0;
}

.status-badge.not-started {
  background: #FFF7E1;
  color: #FF9100;
}

.status-badge.in-progress {
  background: #EEF5FF;
  color: #2470FF;
}

.status-badge.completed {
  background: #E5FFF3;
  color: #18BE6B;
}

/* 计划完成进度样式 */
.progress-flow-section {
  display: flex;
  flex-direction: column;
  margin-top: 1.389vh;
  padding: 0 0.571vw;
  height: calc(100% - 6vh);
  overflow-y: auto;
}

.progress-flow-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1vh;
  padding: 0.5vh 0.625vw;
  border-radius: 0.313vw;
  min-height: 10vh;
}

.flow-step {
  display: flex;
  align-items: center;
  gap: 0.833vw;
  width: 100%;
  padding: 0.5vw;
  border-radius: 0.208vw;
  transition: all 0.3s ease;
}

.flow-step:hover {
  background: rgba(36, 112, 255, 0.05);
}

.flow-step.completed {
  background: rgba(81, 207, 102, 0.1);
}

.flow-step.current {
  background: rgba(78, 205, 196, 0.1);
}

.step-icon {
  width: 1.8vw;
  height: 1.8vw;
  border-radius: 50%;
  background: #E9ECEF;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999999;
  font-size: 0.7vw;
  font-weight: bold;
  flex-shrink: 0;
  transition: all 0.3s ease;
  border: 0.104vw solid transparent;
}

.step-icon.completed {
  background: #51CF66;
  color: white;
  border-color: #51CF66;
  box-shadow: 0 0 0.208vw rgba(81, 207, 102, 0.3);
}

.step-icon.current {
  background: #4ECDC4;
  color: white;
  border-color: #4ECDC4;
  box-shadow: 0 0 0.208vw rgba(78, 205, 196, 0.3);
}

.step-number {
  font-size: 0.7vw;
  font-weight: bold;
}

.step-content {
  display: flex;
  align-items: center;
  flex-grow: 1;
}

.step-title {
  font-size: 0.625vw;
  font-weight: 600;
  color: #2C3E50;
  transition: all 0.3s ease;
}

.flow-step.completed .step-title {
  color: #51CF66;
  font-weight: 700;
}

.flow-step.current .step-title {
  color: #4ECDC4;
  font-weight: 700;
}

.flow-connector {
  width: 0.052vw;
  height: 1vh;
  background: #E9ECEF;
  flex-shrink: 0;
  transition: all 0.3s ease;
  position: relative;
}

.flow-connector.completed {
  background: #51CF66;
  box-shadow: 0 0 0.208vw rgba(81, 207, 102, 0.3);
}

.flow-connector.completed::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 0.208vw;
  height: 0.208vw;
  background: #51CF66;
  border-radius: 50%;
  box-shadow: 0 0 0.208vw rgba(81, 207, 102, 0.5);
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .step-icon {
    width: 1.6vw;
    height: 1.6vw;
    font-size: 0.6vw;
  }
  
  .step-title {
    font-size: 0.55vw;
  }
}

@media (max-width: 768px) {
  .progress-flow-container {
    gap: 0.8vh;
    padding: 1.2vw 0.5vw;
  }
  
  .flow-step {
    gap: 0.6vw;
    padding: 0.4vw;
  }
  
  .step-icon {
    width: 1.4vw;
    height: 1.4vw;
    font-size: 0.5vw;
  }
  
  .step-title {
    font-size: 0.5vw;
  }
}
</style> 