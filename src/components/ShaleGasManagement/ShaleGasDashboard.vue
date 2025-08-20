<template>
  <div class="shale-gas-dashboard">
    <!-- 主标题区域 -->
    <div class="title-section">
      <div class="main-title-wrapper">
        <div class="title-decoration"></div>
        <h2 class="main-title">页岩气驾驶舱</h2>
      </div>
    </div>
    
    <!-- 关键指标卡片 -->
    <div class="kpi-cards">
      <!-- 日产量 -->
      <div class="kpi-card">
        <div class="card-header">
          <div class="card-icon">
            <span class="icon-text">⛽</span>
          </div>
          <span class="card-title">日产量</span>
        </div>
        <div class="card-content">
          <div class="kpi-value">
            <span class="value-number">{{ shaleGasData.dailyProduction }}</span>
            <span class="value-unit">万方</span>
          </div>
          <div class="kpi-trend">
            <span class="trend-label">较昨日:</span>
            <span class="trend-value" :class="shaleGasData.dailyTrend > 0 ? 'positive' : 'negative'">
              {{ shaleGasData.dailyTrend > 0 ? '+' : '' }}{{ shaleGasData.dailyTrend }}%
            </span>
          </div>
        </div>
      </div>

      <!-- 月累计产量 -->
      <div class="kpi-card">
        <div class="card-header">
          <div class="card-icon">
            <span class="icon-text">📊</span>
          </div>
          <span class="card-title">月累计产量</span>
        </div>
        <div class="card-content">
          <div class="kpi-value">
            <span class="value-number">{{ shaleGasData.monthlyProduction }}</span>
            <span class="value-unit">万方</span>
          </div>
          <div class="kpi-progress">
            <span class="progress-label">完成率:</span>
            <span class="progress-value">{{ shaleGasData.monthlyProgress }}%</span>
          </div>
        </div>
      </div>

      <!-- 年累计产量 -->
      <div class="kpi-card">
        <div class="card-header">
          <div class="card-icon">
            <span class="icon-text">📈</span>
          </div>
          <span class="card-title">年累计产量</span>
        </div>
        <div class="card-content">
          <div class="kpi-value">
            <span class="value-number">{{ shaleGasData.yearlyProduction }}</span>
            <span class="value-unit">万方</span>
          </div>
          <div class="kpi-target">
            <span class="target-label">目标:</span>
            <span class="target-value">{{ shaleGasData.yearlyTarget }}万方</span>
          </div>
        </div>
      </div>

      <!-- 井口压力 -->
      <div class="kpi-card">
        <div class="card-header">
          <div class="card-icon">
            <span class="icon-text">🔋</span>
          </div>
          <span class="card-title">平均井口压力</span>
        </div>
        <div class="card-content">
          <div class="kpi-value">
            <span class="value-number">{{ shaleGasData.wellheadPressure }}</span>
            <span class="value-unit">MPa</span>
          </div>
          <div class="pressure-status">
            <span class="status-label">状态:</span>
            <span class="status-value" :class="shaleGasData.pressureStatus === '正常' ? 'normal' : 'warning'">
              {{ shaleGasData.pressureStatus }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 生产监控区域 -->
    <div class="monitoring-section">
      <div class="section-header">
        <h3 class="section-title">生产监控</h3>
        <div class="monitoring-tabs">
          <span 
            class="tab-item" 
            :class="{ active: activeTab === 'realtime' }"
            @click="activeTab = 'realtime'"
          >实时数据</span>
          <span 
            class="tab-item" 
            :class="{ active: activeTab === 'history' }"
            @click="activeTab = 'history'"
          >历史数据</span>
        </div>
      </div>
      
      <div class="monitoring-content">
        <div v-if="activeTab === 'realtime'" class="realtime-data">
          <div class="data-grid">
            <div class="data-item" v-for="item in realtimeData" :key="item.name">
              <div class="data-header">
                <span class="data-name">{{ item.name }}</span>
                <span class="data-unit">{{ item.unit }}</span>
              </div>
              <div class="data-value">{{ item.value }}</div>
              <div class="data-status" :class="item.status">
                {{ item.statusText }}
              </div>
            </div>
          </div>
        </div>
        
        <div v-else-if="activeTab === 'history'" class="history-data">
          <div class="chart-placeholder">
            <div class="placeholder-text">历史数据图表</div>
            <div class="placeholder-hint">页岩气产量、压力等历史变化趋势</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 井场分布地图 -->
    <div class="wellfield-map">
      <div class="map-header">
        <h3 class="map-title">井场分布</h3>
        <div class="map-stats">
          <span class="stat-item">总井数: {{ wellfieldData.totalWells }}口</span>
          <span class="stat-item">生产井: {{ wellfieldData.producingWells }}口</span>
          <span class="stat-item">钻井中: {{ wellfieldData.drillingWells }}口</span>
        </div>
      </div>
      <div class="map-container">
        <div class="map-placeholder">
          <div class="placeholder-text">井场分布地图</div>
          <div class="placeholder-hint">页岩气井场地理位置分布</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 页岩气数据
const shaleGasData = ref({
  dailyProduction: 125.6,
  dailyTrend: 2.3,
  monthlyProduction: 3456.8,
  monthlyProgress: 78.5,
  yearlyProduction: 125680.5,
  yearlyTarget: 160000,
  wellheadPressure: 15.8,
  pressureStatus: '正常'
})

// 实时数据
const realtimeData = ref([
  { name: '气井温度', value: '45.2', unit: '°C', status: 'normal', statusText: '正常' },
  { name: '流量计读数', value: '125.6', unit: '万方/日', status: 'normal', statusText: '正常' },
  { name: '分离器液位', value: '65.8', unit: '%', status: 'warning', statusText: '偏高' },
  { name: '压缩机转速', value: '2850', unit: 'rpm', status: 'normal', statusText: '正常' },
  { name: '管道压力', value: '8.5', unit: 'MPa', status: 'normal', statusText: '正常' },
  { name: '天然气浓度', value: '98.5', unit: '%', status: 'normal', statusText: '正常' }
])

// 井场数据
const wellfieldData = ref({
  totalWells: 156,
  producingWells: 142,
  drillingWells: 14
})

// 当前激活的标签页
const activeTab = ref('realtime')

onMounted(() => {
  console.log('页岩气驾驶舱页面已加载')
})
</script>

<style scoped>
.shale-gas-dashboard {
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

.kpi-trend, .kpi-progress, .kpi-target, .pressure-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8vw;
}

.trend-label, .progress-label, .target-label, .status-label {
  color: #666;
}

.trend-value.positive {
  color: #52c41a;
}

.trend-value.negative {
  color: #ff4d4f;
}

.progress-value, .target-value {
  color: #2470FF;
  font-weight: bold;
}

.status-value.normal {
  color: #52c41a;
}

.status-value.warning {
  color: #fa8c16;
}

.monitoring-section {
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
  min-height: 20vh;
}

.data-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5vw;
}

.data-item {
  background: #f8f9fa;
  border-radius: 6px;
  padding: 1.5vh 1vw;
  text-align: center;
}

.data-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1vh;
}

.data-name {
  color: #333;
  font-size: 0.9vw;
  font-weight: bold;
}

.data-unit {
  color: #666;
  font-size: 0.7vw;
}

.data-value {
  color: #2470FF;
  font-size: 1.3vw;
  font-weight: bold;
  margin-bottom: 0.8vh;
}

.data-status {
  padding: 0.3vh 0.8vw;
  border-radius: 12px;
  font-size: 0.7vw;
  font-weight: bold;
}

.data-status.normal {
  background: #f6ffed;
  color: #52c41a;
}

.data-status.warning {
  background: #fff7e6;
  color: #fa8c16;
}

.chart-placeholder {
  height: 20vh;
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

.wellfield-map {
  flex: 1;
  background: white;
  border-radius: 8px;
  padding: 2vh 1.5vw;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.map-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2vh;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 1vh;
}

.map-title {
  color: #333;
  font-size: 1vw;
  font-weight: bold;
  margin: 0;
}

.map-stats {
  display: flex;
  gap: 1.5vw;
}

.stat-item {
  color: #666;
  font-size: 0.8vw;
}

.stat-item:first-child {
  color: #2470FF;
  font-weight: bold;
}

.map-container {
  height: calc(100% - 4vh);
}

.map-placeholder {
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
</style>
