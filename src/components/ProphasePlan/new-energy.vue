<template>
  <div class="new-energy">
    <!-- 主标题区域 -->
    <div class="title-section">
      <div class="main-title-wrapper">
        <div class="title-decoration"></div>
        <h2 class="main-title">新能源项目分布</h2>
      </div>
    </div>
    
    <!-- 内容容器 -->
    <div class="content-container">
      <!-- 汇总条 -->
      <div class="summary-bar">
        <div class="summary-item">
          <div class="summary-icon">
            <img src="@/assets/xmzs.svg" alt="项目总数" class="icon-image" />
          </div>
          <div class="summary-text">
            <span class="label">项目总数</span>
            <span class="value">
              <span class="value-number">{{ totalProjects }}</span>
              <span class="value-unit">项</span>
            </span>
          </div>
        </div>
        
        <div class="summary-item">
          <div class="summary-icon">
            <img src="@/assets/zjjh.svg" alt="资金计划" class="icon-image" />
          </div>
          <div class="summary-text">
            <span class="label">下达资金计划</span>
            <span class="value">
              <span class="value-number">{{ totalFunding }}</span>
              <span class="value-unit">万元</span>
            </span>
          </div>
        </div>
      </div>
      
      <!-- 项目分布网格 -->
      <div class="projects-grid">
        <!-- 第一行 -->
        <div class="project-card">
          <div class="project-icon">
            <img src="@/assets/光伏.svg" alt="光伏" class="icon-image" />
          </div>
          <div class="project-name">光伏</div>
          <div class="project-data">
            <div class="data-item">
              <span class="data-number">{{ projectData.photovoltaic.projects }}</span>
              <span class="data-unit">项</span>
            </div>
            <div class="data-item">
              <span class="data-number">{{ projectData.photovoltaic.funding }}</span>
              <span class="data-unit">万元</span>
            </div>
          </div>
        </div>
        
        <div class="project-card">
          <div class="project-icon">
            <img src="@/assets/压力.svg" alt="余压" class="icon-image" />
          </div>
          <div class="project-name">余压</div>
          <div class="project-data">
            <div class="data-item">
              <span class="data-number">{{ projectData.pressure.projects }}</span>
              <span class="data-unit">项</span>
            </div>
            <div class="data-item">
              <span class="data-number">{{ projectData.pressure.funding }}</span>
              <span class="data-unit">万元</span>
            </div>
          </div>
        </div>
        
        <div class="project-card">
          <div class="project-icon">
            <img src="@/assets/C.svg" alt="CCS/CCUS" class="icon-image"></img>
          </div>
          <div class="project-name">CCS/CCUS</div>
          <div class="project-data">
            <div class="data-item">
              <span class="data-number">{{ projectData.ccs.projects }}</span>
              <span class="data-unit">项</span>
            </div>
            <div class="data-item">
              <span class="data-number">{{ projectData.ccs.funding }}</span>
              <span class="data-unit">万元</span>
            </div>
          </div>
        </div>
        
        <div class="project-card">
          <div class="project-icon">
            <img src="@/assets/能源.svg" alt="综合能源" class="icon-image"></img>
          </div>
          <div class="project-name">综合能源</div>
          <div class="project-data">
            <div class="data-item">
              <span class="data-number">{{ projectData.comprehensive.projects }}</span>
              <span class="data-unit">项</span>
            </div>
            <div class="data-item">
              <span class="data-number">{{ projectData.comprehensive.funding }}</span>
              <span class="data-unit">万元</span>
            </div>
          </div>
        </div>
        
        <!-- 第二行 -->
        <div class="project-card">
          <div class="project-icon">
            <img src="@/assets/资源.svg" alt="伴生资源" class="icon-image"></img>
          </div>
          <div class="project-name">伴生资源</div>
          <div class="project-data">
            <div class="data-item">
              <span class="data-number">{{ projectData.associated.projects }}</span>
              <span class="data-unit">项</span>
            </div>
            <div class="data-item">
              <span class="data-number">{{ projectData.associated.funding }}</span>
              <span class="data-unit">万元</span>
            </div>
          </div>
        </div>
        
        <div class="project-card">
          <div class="project-icon">
            <img src="@/assets/氢能.svg" alt="氢能" class="icon-image"></img>
          </div>
          <div class="project-name">氢能</div>
          <div class="project-data">
            <div class="data-item">
              <span class="data-number">{{ projectData.hydrogen.projects }}</span>
              <span class="data-unit">项</span>
            </div>
            <div class="data-item">
              <span class="data-number">{{ projectData.hydrogen.funding }}</span>
              <span class="data-unit">万元</span>
            </div>
          </div>
        </div>
        
        <div class="project-card">
          <div class="project-icon">
            <img src="@/assets/气电.svg" alt="气电" class="icon-image"></img>
          </div>
          <div class="project-name">气电</div>
          <div class="project-data">
            <div class="data-item">
              <span class="data-number">{{ projectData.gasPower.projects }}</span>
              <span class="data-unit">项</span>
            </div>
            <div class="data-item">
              <span class="data-number">{{ projectData.gasPower.funding }}</span>
              <span class="data-unit">万元</span>
            </div>
          </div>
        </div>
        
        <div class="project-card">
          <div class="project-icon">
            <img src="@/assets/碳资源.svg" alt="碳资源" class="icon-image"></img>
          </div>
          <div class="project-name">碳资源</div>
          <div class="project-data">
            <div class="data-item">
              <span class="data-number">{{ projectData.carbon.projects }}</span>
              <span class="data-unit">项</span>
            </div>
            <div class="data-item">
              <span class="data-number">{{ projectData.carbon.funding }}</span>
              <span class="data-unit">万元</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// 项目数据
const projectData = ref({
  photovoltaic: { projects: 45, funding: 1250 },      // 光伏
  pressure: { projects: 32, funding: 890 },           // 余压
  ccs: { projects: 28, funding: 1560 },              // CCS/CCUS
  comprehensive: { projects: 38, funding: 1120 },     // 综合能源
  associated: { projects: 25, funding: 680 },         // 伴生资源
  hydrogen: { projects: 42, funding: 1890 },          // 氢能
  gasPower: { projects: 35, funding: 980 },           // 气电
  carbon: { projects: 30, funding: 720 }              // 碳资源
})

// 计算项目总数
const totalProjects = computed(() => {
  return Object.values(projectData.value).reduce((sum, item) => sum + item.projects, 0)
})

// 计算资金总额
const totalFunding = computed(() => {
  return Object.values(projectData.value).reduce((sum, item) => sum + item.funding, 0)
})

// 暴露数据供外部使用
defineExpose({
  projectData,
  totalProjects,
  totalFunding
})
</script>

<style scoped>
.new-energy {
  background: white;
  border-radius: 0.417vw;
  padding: 1vh 0.571vw 1.389vh 0.571vw;
  box-shadow: 0 0.185vh 0.417vw rgba(0, 0, 0, 0.1);
  width: 25.52vw;
  height: 29.011vh;
  position: fixed;
  right: 0.521vw;
  top: 36.811vh;
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

.content-container {
  background: #F2F6FF;
  border-radius: 0.313vw;
  padding: 0.926vh 0.521vw 0.926vh 0.521vw;
  width: 100%;
  box-sizing: border-box;
}

.summary-bar {
  display: flex;
  justify-content: space-between;
  background: #DFEAFF;
  padding: 0.741vh 0.781vw;
  border-radius: 0.313vw;
  margin-bottom: 0.926vh;
  height: 3.704vh;
  align-items: center;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 0.417vw;
}

.summary-icon {
  width: 1.25vw;
  height: 2.222vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-image {
  width: 1.042vw;
  height: 1.667vh;
  object-fit: contain;
}

.summary-text {
  display: flex;
  align-items: center;
  gap: 0.417vw;
}

.label {
  font-size: 0.623vw;
  color: #6C757D;
}

.value {
  display: flex;
  align-items: baseline;
  gap: 0.104vw;
}

.value-number {
  font-size: 0.933vw;
  font-weight: bold;
  color: #2C3E50;
}

.value-unit {
  font-size: 0.573vw;
  color: #6C757D;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 0.521vw;
  height: calc(108% - 9.259vh);
  width: 100%;
}

.project-card {
  background: #DFEAFF;
  border: 0.052vw solid #E9ECEF;
  border-radius: 0.313vw;
  padding: 0.926vh 0.521vw 0.926vh 0.521vw;
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto auto;
  column-gap: 0.313vw;
  row-gap: 0.37vh;
  align-items: center;
  justify-items: center;
  transition: all 0.3s ease;
  cursor: pointer;
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
}

.project-card:hover {
  box-shadow: 0 0.37vh 0.625vw rgba(0, 0, 0, 0.1);
  transform: translateY(-0.185vh);
}

.project-icon {
  font-size: 1.042vw;
  margin-bottom: 0;
  grid-column: 1;
  grid-row: 1;
}

.project-name {
  font-size: 0.673vw;
  font-weight: 600;
  color: #2470FF;
  margin-bottom: 0;
  text-align: left;
  grid-column: 2;
  grid-row: 1;
}

.project-data {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 0.521vw;
  grid-column: 1 / span 2;
  grid-row: 2;
}

.data-item {
  font-size: 0.469vw;
  color: #6C757D;
  display: flex;
  align-items: baseline;
  gap: 0.052vw;
}

.data-number {
  font-size: 0.573vw;
  font-weight: 600;
  color: #2C3E50;
}

.data-unit {
  font-size: 0.517vw;
  color: #6C757D;
}
</style> 