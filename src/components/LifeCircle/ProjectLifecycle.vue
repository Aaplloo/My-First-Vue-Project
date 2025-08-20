<template>
  <div class="project-lifecycle">
    <!-- 主标题区域 -->
    <div class="title-section">
      <div class="main-title-wrapper">
        <div class="title-decoration"></div>
        <h2 class="main-title">项目全生命周期</h2>
      </div>
    </div>
    
    <!-- 生命周期阶段卡片 -->
    <div class="lifecycle-cards">
      <!-- 项目立项阶段 -->
      <div class="lifecycle-card">
        <div class="card-header">
          <div class="card-icon">
            <span class="icon-text">📋</span>
          </div>
          <span class="card-title">项目立项</span>
        </div>
        <div class="card-content">
          <div class="stage-info">
            <div class="info-item">
              <span class="label">进行中项目:</span>
              <span class="value">{{ lifecycleData.planning?.ongoing || 0 }}项</span>
            </div>
            <div class="info-item">
              <span class="label">已完成项目:</span>
              <span class="value">{{ lifecycleData.planning?.completed || 0 }}项</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 项目设计阶段 -->
      <div class="lifecycle-card">
        <div class="card-header">
          <div class="card-icon">
            <span class="icon-text">✏️</span>
          </div>
          <span class="card-title">项目设计</span>
        </div>
        <div class="card-content">
          <div class="stage-info">
            <div class="info-item">
              <span class="label">进行中项目:</span>
              <span class="value">{{ lifecycleData.design?.ongoing || 0 }}项</span>
            </div>
            <div class="info-item">
              <span class="label">已完成项目:</span>
              <span class="value">{{ lifecycleData.design?.completed || 0 }}项</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 项目实施阶段 -->
      <div class="lifecycle-card">
        <div class="card-header">
          <div class="card-icon">
            <span class="icon-text">🚧</span>
          </div>
          <span class="card-title">项目实施</span>
        </div>
        <div class="card-content">
          <div class="stage-info">
            <div class="info-item">
              <span class="label">进行中项目:</span>
              <span class="value">{{ lifecycleData.implementation?.ongoing || 0 }}项</span>
            </div>
            <div class="info-item">
              <span class="label">已完成项目:</span>
              <span class="value">{{ lifecycleData.implementation?.completed || 0 }}项</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 项目验收阶段 -->
      <div class="lifecycle-card">
        <div class="card-header">
          <div class="card-icon">
            <span class="icon-text">✅</span>
          </div>
          <span class="card-title">项目验收</span>
        </div>
        <div class="card-content">
          <div class="stage-info">
            <div class="info-item">
              <span class="label">进行中项目:</span>
              <span class="value">{{ lifecycleData.acceptance?.ongoing || 0 }}项</span>
            </div>
            <div class="info-item">
              <span class="label">已完成项目:</span>
              <span class="value">{{ lifecycleData.acceptance?.completed || 0 }}项</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 项目统计图表 -->
    <div class="statistics-section">
      <div class="chart-container">
        <div class="chart-title">项目阶段分布</div>
        <div class="chart-placeholder">
          <div class="placeholder-text">图表区域</div>
          <div class="placeholder-hint">项目生命周期各阶段数据可视化</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 生命周期数据
const lifecycleData = ref({
  planning: { ongoing: 15, completed: 8 },
  design: { ongoing: 12, completed: 10 },
  implementation: { ongoing: 20, completed: 15 },
  acceptance: { ongoing: 8, completed: 25 }
})

onMounted(() => {
  console.log('项目全生命周期页面已加载')
})
</script>

<style scoped>
.project-lifecycle {
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

.lifecycle-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5vw;
  margin-bottom: 2vh;
}

.lifecycle-card {
  background: white;
  border-radius: 8px;
  padding: 1.5vh 1vw;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.lifecycle-card:hover {
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

.stage-info {
  display: flex;
  flex-direction: column;
  gap: 0.5vh;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.label {
  color: #666;
  font-size: 0.8vw;
}

.value {
  color: #2470FF;
  font-size: 0.9vw;
  font-weight: bold;
}

.statistics-section {
  flex: 1;
  background: white;
  border-radius: 8px;
  padding: 2vh 1.5vw;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.chart-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.chart-title {
  color: #333;
  font-size: 1vw;
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
  font-size: 1.2vw;
  font-weight: bold;
  margin-bottom: 0.5vh;
}

.placeholder-hint {
  font-size: 0.8vw;
  color: #adb5bd;
}
</style>
