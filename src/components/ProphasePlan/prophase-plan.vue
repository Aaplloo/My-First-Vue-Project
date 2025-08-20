<template>
  <div class="prophase-plan">
    <!-- 主标题区域 -->
    <div class="title-section">
      <div class="main-title-wrapper">
        <div class="title-decoration"></div>
        <h2 class="main-title">前期计划</h2>
      </div>
    </div>
    
    <!-- 信息卡片区域 -->
    <div class="cards-wrapper">
      <!-- 顶部汇总条 -->
      <div class="summary-bar">
        <div class="summary-item">
          <div class="summary-icon">
            <img src="@/assets/xmzs.svg" alt="项目总数" class="icon-svg" />
          </div>
          <div class="summary-text">
            <span class="label">项目总数</span>
            <div class="value-container">
              <span class="value-number">{{ totalProjects }}</span>
              <span class="value-unit">项</span>
            </div>
          </div>
        </div>
        
        <div class="summary-item">
          <div class="summary-icon">
            <img src="@/assets/zjjh.svg" alt="资金计划" class="icon-svg" />
          </div>
          <div class="summary-text">
            <span class="label">下达资金计划</span>
            <div class="value-container">
              <span class="value-number">{{ totalFunding }}</span>
              <span class="value-unit">万元</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="cards-container">
        <div class="card">
        <div class="card-header">
          <div class="card-icon folder-icon">
            <img src="@/assets/xkxm.svg" alt="新开项目" class="card-icon-svg" />
          </div>
          <span class="card-title">新开项目</span>
        </div>
        <div class="card-divider"></div>
        <div class="card-content">
          <div class="data-column">
            <span class="data-label">项目总数:</span>
            <div class="data-value-container">
              <span class="data-value-number">{{ projectData.newProjects?.projects || 0 }}</span>
              <span class="data-value-unit">项</span>
            </div>
          </div>
          <div class="data-column">
            <span class="data-label">资金计划:</span>
            <div class="data-value-container">
              <span class="data-value-number">{{ projectData.newProjects?.funding || 0 }}</span>
              <span class="data-value-unit">万元</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="card">
        <div class="card-header">
          <div class="card-icon edit-icon">
            <img src="@/assets/tzxm.svg" alt="调整项目" class="card-icon-svg" />
          </div>
          <span class="card-title">调整项目</span>
        </div>
        <div class="card-divider"></div>
        <div class="card-content">
          <div class="data-column">
            <span class="data-label">项目总数:</span>
            <div class="data-value-container">
              <span class="data-value-number">{{ projectData.adjustedProjects?.projects || 0 }}</span>
              <span class="data-value-unit">项</span>
            </div>
          </div>
          <div class="data-column">
            <span class="data-label">资金计划:</span>
            <div class="data-value-container">
              <span class="data-value-number">{{ projectData.adjustedProjects?.funding || 0 }}</span>
              <span class="data-value-unit">万元</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="card">
        <div class="card-header">
          <div class="card-icon list-icon">
            <img src="@/assets/u245.svg" alt="例行项目" class="card-icon-svg" />
            <img src="@/assets/u246.svg" alt="例行项目" class="card-icon-svg card-icon-overlay" />
          </div>
          <span class="card-title">例行项目</span>
        </div>
        <div class="card-divider"></div>
        <div class="card-content">
          <div class="data-column">
            <span class="data-label">项目总数:</span>
            <div class="data-value-container">
              <span class="data-value-number">{{ projectData.routineProjects?.projects || 0 }}</span>
              <span class="data-value-unit">项</span>
            </div>
          </div>
          <div class="data-column">
            <span class="data-label">资金计划:</span>
            <div class="data-value-container">
              <span class="data-value-number">{{ projectData.routineProjects?.funding || 0 }}</span>
              <span class="data-value-unit">万元</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="card">
        <div class="card-header">
          <div class="card-icon calendar-icon">
            <img src="@/assets/u249.svg" alt="跨年项目" class="card-icon-svg" />
            <img src="@/assets/u250.svg" alt="跨年项目" class="card-icon-svg card-icon-overlay2" />
            <img src="@/assets/u251.svg" alt="跨年项目" class="card-icon-svg card-icon-overlay3" />
            <img src="@/assets/u252.svg" alt="跨年项目" class="card-icon-svg card-icon-overlay4" />
          </div>
          <span class="card-title">跨年项目</span>
        </div>
        <div class="card-divider"></div>
        <div class="card-content">
          <div class="data-column">
            <span class="data-label">项目总数:</span>
            <div class="data-value-container">
              <span class="data-value-number">{{ projectData.crossYearProjects?.projects || 0 }}</span>
              <span class="data-value-unit">项</span>
            </div>
          </div>
          <div class="data-column">
            <span class="data-label">资金计划:</span>
            <div class="data-value-container">
              <span class="data-value-number">{{ projectData.crossYearProjects?.funding || 0 }}</span>
              <span class="data-value-unit">万元</span>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// 项目数据 - 初始化时就有默认数据，避免组件消失
const projectData = ref({
  newProjects: { projects: 68, funding: 2150 },        // 新开项目
  adjustedProjects: { projects: 42, funding: 1680 },   // 调整项目
  routineProjects: { projects: 85, funding: 3240 },    // 例行项目
  crossYearProjects: { projects: 56, funding: 2980 }   // 跨年项目
})

// 从CSV文件读取数据
const loadDataFromCSV = async () => {
  try {
    const response = await fetch('/prophase-plan-data.csv')
    const csvText = await response.text()
    const lines = csvText.trim().split('\n')
    const headers = lines[0].split(',')
    
    const data = {}
    lines.slice(1).forEach((line) => {
      const values = line.split(',')
      const projectType = values[1]
      const projects = parseInt(values[2])
      const funding = parseInt(values[3])
      
      // 根据项目类型映射到对应的key
      let key = ''
      switch (projectType) {
        case '新开项目':
          key = 'newProjects'
          break
        case '调整项目':
          key = 'adjustedProjects'
          break
        case '例行项目':
          key = 'routineProjects'
          break
        case '跨年项目':
          key = 'crossYearProjects'
          break
      }
      
      if (key) {
        data[key] = { projects, funding }
      }
    })
    
    // 只有当CSV数据完整时才更新
    if (Object.keys(data).length === 4) {
      projectData.value = data
      console.log('CSV数据加载成功:', data)
    } else {
      console.warn('CSV数据不完整，保持默认数据')
    }
  } catch (error) {
    console.error('加载CSV数据失败:', error)
    // 如果CSV加载失败，保持默认数据
    console.log('使用默认数据')
  }
}

// 计算项目总数
const totalProjects = computed(() => {
  return Object.values(projectData.value).reduce((sum, item) => sum + (item?.projects || 0), 0)
})

// 计算资金总额
const totalFunding = computed(() => {
  return Object.values(projectData.value).reduce((sum, item) => sum + (item?.funding || 0), 0)
})

// 生命周期钩子
onMounted(() => {
  // 延迟加载CSV数据，确保组件先渲染
  setTimeout(() => {
    loadDataFromCSV()
  }, 100)
})

// 暴露数据供外部使用
defineExpose({
  projectData,
  totalProjects,
  totalFunding,
  loadDataFromCSV
})
</script>

<style scoped>
.prophase-plan {
  background: white;
  border-radius: 0.417vw;
  padding: 1vh 0.571vw 1.389vh 0.571vw;
  box-shadow: 0 0.185vh 0.417vw rgba(0, 0, 0, 0.1);
  width: 25.52vw;
  height: 32.315vh;
  position: fixed;
  left: 0.521vw;
  top: 8.333vh;
  overflow: hidden;
}

.title-section {
  display: flex;
  align-items: center;
  margin-bottom: 1.111vh;
}

.title-decoration {
  width: 0.456vw;
  height: 2.467vh;
  background: #2470FF;
  margin-right: 0.817vw;
}

.main-title-wrapper {
  background: linear-gradient(to right, #ECF3FF 0%, rgba(36, 112, 255, 0) 100%);
  padding: 0.463vh 1.042vw 0.463vh 0;
  display: inline-flex;
  align-items: center;
}

.main-title {
  color: #2470FF;
  font-size: 1.042vw;
  font-weight: bold;
  margin: 0;
}

.summary-bar {
  display: flex;
  justify-content: space-between;
  background: #DFEAFF;
  padding: 0 0.781vw;
  border-radius: 0.417vw;
  margin-bottom: 0.741vh;
  height: 3.333vh;
  align-items: center;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 0.521vw;
}

.summary-icon {
  width: 1.25vw;
  height: 2.222vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-svg {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.line-group {
  display: flex;
  flex-direction: column;
  gap: 0.093vh;
}

.line {
  width: 0.938vw;
  height: 0.185vh;
  background: #5BA0F2;
  border-radius: 0.052vw;
}

.chart-icon {
  display: flex;
  align-items: end;
  gap: 0.052vw;
  height: 1.481vh;
}

.bar {
  width: 0.156vw;
  background: #5BA0F2;
  border-radius: 0.052vw;
}

.bar:nth-child(1) { height: 0.926vh; }
.bar:nth-child(2) { height: 1.204vh; }
.bar:nth-child(3) { height: 1.481vh; }
.bar:nth-child(4) { height: 1.019vh; }
.bar:nth-child(5) { height: 1.296vh; }

.summary-text {
  display: flex;
  align-items: center;
  gap: 0.521vw;
}

.label {
  font-size: 0.625vw;
  color: #7B8794;
}

.value-container {
  display: flex;
  align-items: baseline;
  gap: 0.104vw;
}

.value-number {
  font-size: 0.938vw;
  font-weight: bold;
  color: #1F2937;
}

.value-unit {
  font-size: 0.729vw;
  font-weight: normal;
  color: #7B8794;
}

.cards-wrapper {
  background: #F2F6FF;
  border-radius: 0.417vw;
  padding: 0.926vh 0.581vw 1.2vh 0.581vw;
  margin-top: 0.278vh;
}

.cards-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 0.521vw;
  height: calc(100% - 5.815vh);
}

.card {
  background: white;
  border: none;
  border-radius: 0.329vw;
  padding: 0.680vh 0.647vw;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 0.833vw rgba(3, 129, 255, 0.3);
}

.card:hover {
  box-shadow: 0 0 1.042vw rgba(3, 129, 255, 0.3);
  transform: translateY(-0.093vh);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.329vw;
  margin-bottom: 0.486vh;
}

.card-divider {
  width: 100%;
  height: 0.093vh;
  border-top: 0.052vw dashed #CCCCCC;
  margin-bottom: 0.584vh;
}

.card-icon {
  font-size: 0.875vw;
  width: 1.094vw;
  height: 1.750vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.card-icon-svg {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.card-icon-overlay {
  position: absolute;
  top: 15%;
  left: 15%;
  width: 70%;
  height: 70%;
}

.card-icon-overlay2 {
  position: absolute;
  top: -50%;
  right: 0;
  width: 100%;
  height: 100%;
}

.card-icon-overlay3 {
  position: absolute;
  bottom: 20%;
  left: 0;
  width: 100%;
  height: 100%;
}

.card-icon-overlay4 {
  position: absolute;
  bottom: 10%;
  right: 10%;
  width: 100%;
  height: 100%;
}

.card-title {
  font-size: 0.711vw;
  font-weight: 600;
  color: #2470FF;
}

.card-content {
  display: flex;
  justify-content: space-between;
  gap: 0.547vw;
  flex: 1;
}

.data-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.389vh;
  flex: 1;
}

.data-label {
  font-size: 0.602vw;
  color: #7B8794;
}

.data-value-container {
  display: flex;
  align-items: baseline;
  gap: 0.104vw;
}

.data-value-number {
  font-size: 0.711vw;
  font-weight: 600;
  color: #1F2937;
}

.data-value-unit {
  font-size: 0.602vw;
  font-weight: normal;
  color: #7B8794;
}
</style> 