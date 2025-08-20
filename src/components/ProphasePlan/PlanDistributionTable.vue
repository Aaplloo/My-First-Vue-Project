<template>
  <div class="plan-distribution-table">
    <!-- 顶部导航栏 -->
    <header class="header">
      <div class="back-button" @click="goBack">
        <span>← 返回</span>
      </div>
      <h1 class="page-title">计划分布数据详情</h1>
    </header>

    <!-- 数据表格区域 -->
    <div class="table-container">
      <!-- 生产数据表格 -->
      <div v-if="activeTab === 'production'" class="data-table">
        <h2 class="table-title">生产单位数据</h2>
        <table class="table">
          <thead>
            <tr>
              <th>序号</th>
              <th>单位名称</th>
              <th>项目数量(项)</th>
              <th>资金计划(万元)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in productionData" :key="item.id">
              <td>{{ index + 1 }}</td>
              <td>{{ item.unitName }}</td>
              <td>{{ item.projectCount }}</td>
              <td>{{ item.fundingPlan }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 院所数据表格 -->
      <div v-else-if="activeTab === 'institute'" class="data-table">
        <h2 class="table-title">院所单位数据</h2>
        <table class="table">
          <thead>
            <tr>
              <th>序号</th>
              <th>单位名称</th>
              <th>项目数量(项)</th>
              <th>资金计划(万元)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in instituteData" :key="item.id">
              <td>{{ index + 1 }}</td>
              <td>{{ item.unitName }}</td>
              <td>{{ item.projectCount }}</td>
              <td>{{ item.fundingPlan }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 后服数据表格 -->
      <div v-else-if="activeTab === 'service'" class="data-table">
        <h2 class="table-title">后服单位数据</h2>
        <table class="table">
          <thead>
            <tr>
              <th>序号</th>
              <th>单位名称</th>
              <th>项目数量(项)</th>
              <th>资金计划(万元)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in serviceData" :key="item.id">
              <td>{{ index + 1 }}</td>
              <td>{{ item.unitName }}</td>
              <td>{{ item.projectCount }}</td>
              <td>{{ item.fundingPlan }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 接收父组件传递的参数
const props = defineProps({
  activeTab: {
    type: String,
    default: 'production'
  }
})

// 数据存储
const productionData = ref([])
const instituteData = ref([])
const serviceData = ref([])

// 从CSV文件读取数据
const loadDataFromCSV = async () => {
  try {
    // 加载生产数据
    const productionResponse = await fetch('/plan-distribution-datas/production-data.csv')
    const productionCsvText = await productionResponse.text()
    const productionLines = productionCsvText.trim().split('\n')
    
    productionData.value = productionLines.slice(1).map((line, index) => {
      const values = line.split(',')
      return {
        id: parseInt(values[0]),
        unitName: values[1],
        projectCount: parseInt(values[2]),
        fundingPlan: parseInt(values[3])
      }
    })

    // 加载院所数据
    const instituteResponse = await fetch('/plan-distribution-datas/institute-data.csv')
    const instituteCsvText = await instituteResponse.text()
    const instituteLines = instituteCsvText.trim().split('\n')
    
    instituteData.value = instituteLines.slice(1).map((line, index) => {
      const values = line.split(',')
      return {
        id: parseInt(values[0]),
        unitName: values[1],
        projectCount: parseInt(values[2]),
        fundingPlan: parseInt(values[3])
      }
    })

    // 加载后服数据
    const serviceResponse = await fetch('/plan-distribution-datas/service-data.csv')
    const serviceCsvText = await serviceResponse.text()
    const serviceLines = serviceCsvText.trim().split('\n')
    
    serviceData.value = serviceLines.slice(1).map((line, index) => {
      const values = line.split(',')
      return {
        id: parseInt(values[0]),
        unitName: values[1],
        projectCount: parseInt(values[2]),
        fundingPlan: parseInt(values[3])
      }
    })

    console.log('数据加载成功:', {
      production: productionData.value,
      institute: instituteData.value,
      service: serviceData.value
    })
  } catch (error) {
    console.error('加载CSV数据时出错:', error)
  }
}

// 返回上一页
const goBack = () => {
  // 触发自定义事件，通知父组件返回
  emit('goBack')
}

// 定义事件
const emit = defineEmits(['goBack'])

// 组件挂载时加载数据
onMounted(() => {
  loadDataFromCSV()
})
</script>

<style scoped>
.plan-distribution-table {
  width: 100%;
  height: 100vh;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
}

.header {
  background: white;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 20px;
}

.back-button {
  background: #2470FF;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.back-button:hover {
  background: #1e5fd9;
}

.page-title {
  margin: 0;
  color: #333;
  font-size: 24px;
  font-weight: bold;
}

.table-container {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.data-table {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.table-title {
  margin: 0 0 20px 0;
  color: #2470FF;
  font-size: 20px;
  font-weight: bold;
}

.table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.table th,
.table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.table th {
  background: #f8f9fa;
  color: #333;
  font-weight: bold;
  font-size: 14px;
}

.table td {
  color: #666;
  font-size: 14px;
}

.table tbody tr:hover {
  background: #f8f9fa;
}

.table tbody tr:last-child td {
  border-bottom: none;
}
</style>
