<template>
  <div class="map-components-demo">
    <h2>Map 组件库演示</h2>
    
    <!-- 地图组件 -->
    <div class="component-section">
      <h3>地图组件</h3>
      <div class="map-container">
        <GislifeMap 
          :width="800" 
          :height="400" 
          :center="[116.3974, 39.9093]"
          :zoom="10"
        />
      </div>
    </div>

    <!-- 图层树组件 -->
    <div class="component-section">
      <h3>图层树组件</h3>
      <LayerTree 
        :layers="layers"
        @layer-toggle="handleLayerToggle"
        style="width: 300px; height: 200px;"
      />
    </div>

    <!-- 地图表格组件 -->
    <div class="component-section">
      <h3>地图表格组件</h3>
      <GislifeTable 
        :data="tableData"
        :columns="tableColumns"
        style="width: 600px; height: 200px;"
      />
    </div>

    <!-- 图例组件 -->
    <div class="component-section">
      <h3>图例组件</h3>
      <GislifeLegend 
        :items="legendItems"
        style="width: 200px;"
      />
    </div>

    <!-- 地图切换组件 -->
    <div class="component-section">
      <h3>地图切换组件</h3>
      <GislifeMapSwitch 
        :maps="mapTypes"
        @map-change="handleMapChange"
      />
    </div>

    <!-- 搜索组件 -->
    <div class="component-section">
      <h3>搜索组件</h3>
      <GislifeSearch 
        placeholder="请输入搜索内容"
        @search="handleSearch"
        style="width: 300px;"
      />
    </div>

    <!-- 工具栏组件 -->
    <div class="component-section">
      <h3>工具栏组件</h3>
      <GislifeTooBox 
        :tools="toolItems"
        @tool-click="handleToolClick"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { 
  GislifeMap, 
  LayerTree, 
  GislifeTable, 
  GislifeLegend, 
  GislifeMapSwitch, 
  GislifeSearch, 
  GislifeTooBox 
} from 'map-components'

// 图层数据
const layers = ref([
  { id: 1, name: '基础地图', visible: true, type: 'base' },
  { id: 2, name: '行政区划', visible: true, type: 'boundary' },
  { id: 3, name: '道路网络', visible: false, type: 'road' },
  { id: 4, name: '兴趣点', visible: true, type: 'poi' }
])

// 表格数据
const tableData = ref([
  { id: 1, name: '北京市', population: 21540000, area: 16410 },
  { id: 2, name: '上海市', population: 24870000, area: 6340 },
  { id: 3, name: '广州市', population: 15300000, area: 7434 }
])

const tableColumns = ref([
  { title: '城市', dataIndex: 'name', key: 'name' },
  { title: '人口', dataIndex: 'population', key: 'population' },
  { title: '面积(km²)', dataIndex: 'area', key: 'area' }
])

// 图例数据
const legendItems = ref([
  { label: '城市', color: '#1890ff', icon: '🏙️' },
  { label: '道路', color: '#52c41a', icon: '🛣️' },
  { label: '水域', color: '#1890ff', icon: '💧' },
  { label: '绿地', color: '#52c41a', icon: '🌳' }
])

// 地图类型
const mapTypes = ref([
  { id: 'satellite', name: '卫星图', icon: '🛰️' },
  { id: 'street', name: '街道图', icon: '🏘️' },
  { id: 'terrain', name: '地形图', icon: '🏔️' }
])

// 工具栏项目
const toolItems = ref([
  { id: 'measure', name: '测量', icon: '📏' },
  { id: 'draw', name: '绘制', icon: '✏️' },
  { id: 'export', name: '导出', icon: '💾' },
  { id: 'print', name: '打印', icon: '🖨️' }
])

// 事件处理
const handleLayerToggle = (layerId, visible) => {
  console.log('图层切换:', layerId, visible)
  const layer = layers.value.find(l => l.id === layerId)
  if (layer) {
    layer.visible = visible
  }
}

const handleMapChange = (mapType) => {
  console.log('地图类型切换:', mapType)
}

const handleSearch = (keyword) => {
  console.log('搜索关键词:', keyword)
}

const handleToolClick = (toolId) => {
  console.log('工具点击:', toolId)
}
</script>

<style scoped>
.map-components-demo {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.component-section {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
  background-color: #fafafa;
}

.component-section h3 {
  margin-bottom: 15px;
  color: #1890ff;
  font-size: 18px;
}

.map-container {
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  overflow: hidden;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .map-components-demo {
    padding: 10px;
  }
  
  .component-section {
    padding: 15px;
  }
}
</style>
