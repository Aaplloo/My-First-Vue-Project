<template>
  <div class="map-container" :class="{ 'expanded': isExpanded, 'expanded-left': isExpandedLeft }">
    <!-- 顶部控制栏 -->
    <div class="control-bar">
      <div class="control-left">
        <div class="layer-dropdown">
          <button class="layer-btn" @click="toggleLayerMenu">图层</button>
          <div class="layer-menu" v-if="showLayerMenu">
            <div class="layer-option" @click="togglePulseDots">
              <span class="option-text">脉冲点</span>
              <span class="option-status">{{ showPulseDots ? '✓' : '○' }}</span>
            </div>
            <div class="layer-option" @click="toggleWaterBodies">
              <span class="option-text">水域</span>
              <span class="option-status">{{ showWaterBodies ? '✓' : '○' }}</span>
            </div>
            <div class="layer-option" @click="toggleRoads">
              <span class="option-text">道路</span>
              <span class="option-status">{{ showRoads ? '✓' : '○' }}</span>
            </div>
            <div class="layer-option" @click="toggleLocations">
              <span class="option-text">地点标记</span>
              <span class="option-status">{{ showLocations ? '✓' : '○' }}</span>
            </div>
            <div class="layer-option" @click="toggleHeatmap">
              <span class="option-text">热力图</span>
              <span class="option-status">{{ showHeatmap ? '✓' : '○' }}</span>
            </div>
          </div>
        </div>
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input type="text" placeholder="请输入" class="search-input">
        </div>
      </div>
      <div class="control-right">
        <button v-if="isExpanded || isExpandedLeft" class="close-btn" @click="closeMap" title="关闭">
          <span class="close-icon">✕</span>
        </button>
        <div class="settings-icon">⚙️</div>
      </div>
    </div>
    
    <!-- 地图显示区域 -->
    <div class="map-area">
      <!-- 高德地图容器 -->
      <div id="amap-container" class="amap-container"></div>
      
      <!-- 地图覆盖层 - 保持原有的标记和UI元素 -->
      <div class="map-overlay">
        <!-- 水域 -->
        <div class="water-bodies" v-if="showWaterBodies">
          <div class="water-body water-1"></div>
          <div class="water-body water-2"></div>
        </div>
        
        <!-- 道路 -->
        <div class="roads" v-if="showRoads">
          <div class="road road-1"></div>
          <div class="road road-2"></div>
          <div class="road road-3"></div>
          <div class="road road-4"></div>
        </div>
        
        <!-- 热力图 -->
        <div class="heatmap" v-if="showHeatmap">
          <div class="heatmap-area main-heatmap">
            <div class="heatmap-glow"></div>
            <div class="heatmap-core"></div>
          </div>
          <div class="heatmap-area secondary-heatmap">
            <div class="heatmap-glow"></div>
            <div class="heatmap-core"></div>
          </div>
        </div>
        
        <!-- 报警地点指示器和设备坐标标注现在通过高德地图API动态添加，不再使用CSS样式 -->
        
        <!-- 地点标记和脉冲点现在通过高德地图API动态添加，不再使用CSS样式 -->
        

        
        <!-- 设备报警列表表格 -->
        <div class="alarm-table-container" v-if="isExpanded">
          <div class="alarm-table-header">
            <div class="header-top">
              <h3 class="table-title">设备报警列表</h3>
              <div class="filter-summary">
                <span v-if="filters.unit || filters.category || filters.status || filters.dateRange || filters.keyword">
                  筛选结果: {{ totalAlarms }}条数据
                </span>
              </div>
            </div>
            <div class="table-filters">
              <!-- 关键词搜索 -->
              <div class="filter-item">
                <span class="filter-label">关键词:</span>
                <input 
                  type="text" 
                  class="filter-input" 
                  placeholder="搜索单位、设备、描述等"
                  v-model="filters.keyword"
                  @input="updateFilter('keyword', filters.keyword)"
                />
              </div>
              
              <div class="filter-item">
                <span class="filter-label">所属单位:</span>
                <select class="filter-select" v-model="filters.unit" @change="updateFilter('unit', filters.unit)">
                  <option value="">全部单位</option>
                  <option v-for="unit in getFilterOptions.units" :key="unit" :value="unit">
                    {{ unit }}
                  </option>
                </select>
              </div>
              <div class="filter-item">
                <span class="filter-label">监测类别:</span>
                <select class="filter-select" v-model="filters.category" @change="updateFilter('category', filters.category)">
                  <option value="">全部类别</option>
                  <option v-for="category in getFilterOptions.categories" :key="category" :value="category">
                    {{ category }}
                  </option>
                </select>
              </div>
              <div class="filter-item">
                <span class="filter-label">处置情况:</span>
                <select class="filter-select" v-model="filters.status" @change="updateFilter('status', filters.status)">
                  <option value="">全部状态</option>
                  <option v-for="status in getFilterOptions.statuses" :key="status" :value="status">
                    {{ status }}
                  </option>
                </select>
              </div>
              
              <!-- 时间范围筛选 -->
              <div class="filter-item">
                <span class="filter-label">时间范围:</span>
                <select class="filter-select" v-model="filters.dateRange" @change="updateFilter('dateRange', filters.dateRange)">
                  <option value="">全部时间</option>
                  <option value="today">今天</option>
                  <option value="week">最近一周</option>
                  <option value="month">最近一月</option>
                </select>
              </div>
              
              <!-- 清除筛选按钮 -->
              <div class="filter-item">
                <button class="clear-filters-btn" @click="clearFilters">
                  清除筛选
                </button>
              </div>
            </div>
          </div>
          
          <div class="alarm-table">
            <table>
              <thead>
                <tr>
                  <th>序号</th>
                  <th>所属单位</th>
                  <th>监测对象名称</th>
                  <th>设备名称</th>
                  <th>处置情况</th>
                  <th>监测类别</th>
                  <th>报警/预警时间</th>
                  <th>报警描述</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in currentPageData" :key="item.id" @click="showAlarmDetail(item)" class="alarm-row">
                  <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
                  <td>{{ item.unit }}</td>
                  <td>{{ item.objectName }}</td>
                  <td>{{ item.deviceName }}</td>
                  <td>
                    <span :class="['status-badge', getStatusClass(item.status)]">
                      {{ item.status }}
                    </span>
                  </td>
                  <td>{{ item.category }}</td>
                  <td>{{ item.alarmTime }}</td>
                  <td>{{ item.description }}</td>
                  <td>
                    <button class="diagnose-btn" @click.stop="diagnoseAlarm(item)">
                      诊断
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div class="table-pagination">
            <div class="pagination-info">
              <span>每页 {{ pageSize }} 条 </span>
              <span>共 {{ totalAlarms }} 条数据 </span>
              <span>第 {{ currentPage }} / {{ totalPages }} 页 </span>
            </div>
            <div class="pagination-controls">
              <button class="page-btn" @click="goToFirstPage" :disabled="currentPage === 1">首页</button>
              <button class="page-btn" @click="goToPrevPage" :disabled="currentPage === 1">上一页</button>
              
              <!-- 显示页码按钮 -->
              <template v-for="page in getVisiblePages()" :key="page">
                <button 
                  v-if="page !== '...'" 
                  class="page-btn" 
                  :class="{ active: currentPage === page }"
                  @click="goToPage(page)"
                >
                  {{ page }}
                </button>
                <span v-else class="page-ellipsis">...</span>
              </template>
              
              <button class="page-btn" @click="goToNextPage" :disabled="currentPage === totalPages">下一页</button>
              <button class="page-btn" @click="goToLastPage" :disabled="currentPage === totalPages">末页</button>
            </div>
          </div>
        </div>
        
        <!-- 设备列表表格 - 当向左展开时显示 -->
        <div class="device-table-container" v-if="isExpandedLeft">
          <div class="device-table-header">
            <div class="header-top">
              <h3 class="table-title">设备列表</h3>
            </div>
            <div class="table-filters">
              <!-- 所属单位筛选 -->
              <div class="filter-item">
                <span class="filter-label">所属单位:</span>
                <select class="filter-select" v-model="deviceFilters.unit" @change="updateDeviceFilter('unit', deviceFilters.unit)">
                  <option value="">全部单位</option>
                  <option v-for="unit in getDeviceFilterOptions.units" :key="unit" :value="unit">
                    {{ unit }}
                  </option>
                </select>
              </div>
              
              <!-- 监测类别筛选 -->
              <div class="filter-item">
                <span class="filter-label">监测类别:</span>
                <select class="filter-select" v-model="deviceFilters.category" @change="updateDeviceFilter('category', deviceFilters.category)">
                  <option value="">全部类别</option>
                  <option v-for="category in getDeviceFilterOptions.categories" :key="category" :value="category">
                    {{ category }}
                  </option>
                </select>
              </div>
              
              <!-- 监测对象筛选 -->
              <div class="filter-item">
                <span class="filter-label">监测对象:</span>
                <input 
                  type="text" 
                  class="filter-input" 
                  placeholder="请输入监测对象名称"
                  v-model="deviceFilters.object"
                  @input="updateDeviceFilter('object', deviceFilters.object)"
                />
              </div>
              
              <!-- 搜索按钮 -->
              <div class="filter-item">
                <button class="search-btn" @click="searchDevices">
                  <span class="search-icon">🔍</span>
                </button>
              </div>
              
              <!-- 清除筛选按钮 -->
              <div class="filter-item">
                <button class="clear-filters-btn" @click="clearDeviceFilters">
                  清除筛选
                </button>
              </div>
            </div>
          </div>
          
          <div class="device-table">
            <table>
              <thead>
                <tr>
                  <th>序号</th>
                  <th>所属单位</th>
                  <th>监测类别</th>
                  <th>监测对象名称</th>
                  <th>设备名称</th>
                  <th>设备状态</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in currentDevicePageData" :key="item.id" class="device-row" @click="showDeviceOnMap(item)">
                  <td>{{ (currentDevicePage - 1) * devicePageSize + index + 1 }}</td>
                  <td>{{ item.unit }}</td>
                  <td>{{ item.category }}</td>
                  <td>{{ item.objectName }}</td>
                  <td>{{ item.deviceName }}</td>
                  <td>
                    <span 
                      :class="['device-status-badge', getDeviceStatusClass(item.status)]"
                      :style="getDeviceStatusStyle(item.status)"
                    >
                      {{ item.status }}
                    </span>
                  </td>
                  <td>
                    <button class="detail-btn" @click.stop="showDeviceDetail(item)">
                      详情
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div class="table-pagination">
            <div class="pagination-info">
              <span>每页 {{ devicePageSize }} 条 </span>
              <span>共 {{ totalDevices }} 条数据 </span>
              <span>第 {{ currentDevicePage }} / {{ totalDevicePages }} 页 </span>
            </div>
            <div class="pagination-controls">
              <button class="page-btn" @click="goToFirstDevicePage" :disabled="currentDevicePage === 1">首页</button>
              <button class="page-btn" @click="goToPrevDevicePage" :disabled="currentDevicePage === 1">上一页</button>
              
              <!-- 显示页码按钮 -->
              <template v-for="page in getVisibleDevicePages()" :key="page">
                <button 
                  v-if="page !== '...'" 
                  class="page-btn" 
                  :class="{ active: currentDevicePage === page }"
                  @click="goToDevicePage(page)"
                >
                  {{ page }}
                </button>
                <span v-else class="page-ellipsis">...</span>
              </template>
              
              <button class="page-btn" @click="goToNextDevicePage" :disabled="currentDevicePage === totalDevicePages">下一页</button>
              <button class="page-btn" @click="goToLastDevicePage" :disabled="currentDevicePage === totalDevicePages">末页</button>
            </div>
          </div>
        </div>
        
        <!-- 地图上的报警详情窗口 -->
        <div class="alarm-detail-window" v-if="showAlarmDetailPopup" :style="getAlarmWindowStyle()">
          <div class="window-content">
            <div class="window-header">
              <div class="window-title">
                <div class="title-bar"></div>
                <span>报警详情</span>
              </div>
              <div class="window-progress">
                <div class="progress-item active"></div>
                <div class="progress-item active"></div>
                <div class="progress-item active"></div>
                <div class="progress-item"></div>
                <div class="progress-item"></div>
              </div>
              <button class="close-window-btn" @click="closeAlarmDetail">✕</button>
            </div>
            
            <div class="window-body">
              <div class="detail-row">
                <div class="detail-item">
                  <span class="detail-label">二级单位:</span>
                  <span class="detail-value">{{ selectedAlarm.secondaryUnit }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">三级单位:</span>
                  <span class="detail-value">{{ selectedAlarm.tertiaryUnit }}</span>
                </div>
              </div>
              <div class="detail-row">
                <div class="detail-item">
                  <span class="detail-label">设备名称:</span>
                  <span class="detail-value">{{ selectedAlarm.deviceName }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">监测对象名称:</span>
                  <span class="detail-value">{{ selectedAlarm.objectName }}</span>
                </div>
              </div>
              <div class="detail-row">
                <div class="detail-item">
                  <span class="detail-label">监测类别:</span>
                  <span class="detail-value">{{ selectedAlarm.category }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">处置情况:</span>
                  <span class="detail-value">{{ selectedAlarm.status }}</span>
                </div>
              </div>
              <div class="detail-row">
                <div class="detail-item">
                  <span class="detail-label">实时数据:</span>
                  <span class="detail-value">{{ selectedAlarm.realTimeData }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">报警时间:</span>
                  <span class="detail-value">{{ selectedAlarm.alarmTime }}</span>
                </div>
              </div>
              <div class="detail-item description-item">
                <span class="detail-label">报警描述:</span>
                <span class="detail-value">{{ selectedAlarm.description }}</span>
              </div>
            </div>
            
            <div class="window-footer">
              <button class="diagnose-window-btn" @click="diagnoseAlarm(selectedAlarm)">
                诊断
              </button>
            </div>
          </div>
        </div>
        
        <!-- 地图上的设备详情窗口 -->
        <div class="device-detail-window" v-if="showDeviceDetailPopup" :style="getDeviceWindowStyle()">
          <div class="window-content">
            <div class="window-header">
              <div class="window-title">
                <div class="title-bar"></div>
                <span>设备详情</span>
              </div>
              <div class="window-progress">
                <div class="progress-item active"></div>
                <div class="progress-item active"></div>
                <div class="progress-item active"></div>
                <div class="progress-item"></div>
                <div class="progress-item"></div>
              </div>
              <button class="close-window-btn" @click="closeDeviceDetail">✕</button>
            </div>
            
            <div class="window-body">
              <div class="detail-row">
                <div class="detail-item">
                  <span class="detail-label">所属单位:</span>
                  <span class="detail-value">{{ selectedDevice.unit }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">监测类别:</span>
                  <span class="detail-value">{{ selectedDevice.category }}</span>
                </div>
              </div>
              <div class="detail-row">
                <div class="detail-item">
                  <span class="detail-label">设备名称:</span>
                  <span class="detail-value">{{ selectedDevice.deviceName }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">监测对象名称:</span>
                  <span class="detail-value">{{ selectedDevice.objectName }}</span>
                </div>
              </div>
              <div class="detail-row">
                <div class="detail-item">
                  <span class="detail-label">设备状态:</span>
                  <span class="detail-value">
                    <span :class="['device-status-badge', getDeviceStatusClass(selectedDevice.status)]" :style="getDeviceStatusStyle(selectedDevice.status)">
                      {{ selectedDevice.status }}
                    </span>
                  </span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">设备ID:</span>
                  <span class="detail-value">{{ selectedDevice.id }}</span>
                </div>
              </div>
              <div class="detail-item description-item">
                <span class="detail-label">设备位置:</span>
                <span class="detail-value">X: {{ selectedDevice.mapPosition?.x?.toFixed(1) }}%, Y: {{ selectedDevice.mapPosition?.y?.toFixed(1) }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 诊断弹窗 -->
    <div class="diagnose-modal" v-if="showDiagnoseModal">
      <div class="diagnose-modal-content">
        <div class="diagnose-modal-header">
          <h3>报警诊断</h3>
          <button class="close-modal-btn" @click="closeDiagnoseModal">✕</button>
        </div>
        
        <div class="diagnose-modal-body">
          <div class="form-group">
            <label class="form-label">处置情况:</label>
            <select class="form-select" v-model="diagnoseForm.status">
              <option value="研判中">研判中</option>
              <option value="处置中">处置中</option>
              <option value="已完成">已完成</option>
            </select>
          </div>
          
          <div class="form-group">
            <label class="form-label">备注:</label>
            <textarea 
              class="form-textarea" 
              v-model="diagnoseForm.remark" 
              placeholder="请输入诊断备注信息..."
              rows="4"
            ></textarea>
          </div>
        </div>
        
        <div class="diagnose-modal-footer">
          <button class="cancel-btn" @click="closeDiagnoseModal">取消</button>
          <button class="save-btn" @click="saveDiagnose">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { onMounted, onUnmounted } from 'vue'
import AMapLoader from '@amap/amap-jsapi-loader'
import { AMAP_CONFIG } from '@/config/amap.js'

// 高德地图相关
const map = ref(null)
const mapLoaded = ref(false)

// 图层显示状态
const showLayerMenu = ref(false)
const showPulseDots = ref(false) // 默认不显示脉冲点
const showWaterBodies = ref(false) // 默认不显示水域
const showRoads = ref(false) // 默认不显示道路
const showLocations = ref(false) // 默认不显示地点标记
const showHeatmap = ref(false) // 默认不显示热力图

// 地图展开状态
const isExpanded = ref(false)
const isExpandedLeft = ref(false) // 新增：左侧展开状态

// 设备报警数据
const alarmData = ref([])

// 设备列表数据
const deviceData = ref([])

// 设备坐标标注相关状态
const showDeviceMarker = ref(false)
const selectedDevice = ref({})
const deviceMarkerPosition = ref({ x: 0, y: 0 })

// 设备详情窗口状态
const showDeviceDetailPopup = ref(false)

// 默认报警数据（作为备用）
const defaultAlarmData = [
  {
    unit: '川西北气矿-广元作业区',
    secondaryUnit: '川西北气矿',
    tertiaryUnit: '广元采气作业区',
    objectName: '这是一条管道名称管道',
    deviceName: '这是设备名称xx光纤振动',
    status: '研判中',
    category: '光纤振动预警',
    alarmTime: '2024-06-06 11:11:11',
    realTimeData: '123',
    description: 'xxxx管道光纤震动预警-6153265206(设备编号)于2025年3月2日13:00发生报警，实时数据为xxXX',
    mapPosition: { x: 25, y: 55 }
  },
  {
    unit: '川西北气矿-广元作业区',
    secondaryUnit: '川西北气矿',
    tertiaryUnit: '广元采气作业区',
    objectName: '管道名称管道2',
    deviceName: '设备名称光纤振动2',
    status: '研判中',
    category: '光纤振动预警',
    alarmTime: '2024-06-06 10:30:00',
    realTimeData: '156',
    description: '管道光纤震动预警-6153265207(设备编号)于2025年3月2日12:30发生报警',
    mapPosition: { x: 65, y: 50 }
  },
  {
    unit: '川西北气矿-广元作业区',
    secondaryUnit: '川西北气矿',
    tertiaryUnit: '广元采气作业区',
    objectName: '管道名称管道3',
    deviceName: '设备名称光纤振动3',
    status: '研判中',
    category: '光纤振动预警',
    alarmTime: '2024-06-06 09:45:00',
    realTimeData: '89',
    description: '管道光纤震动预警-6153265208(设备编号)于2025年3月2日11:45发生报警',
    mapPosition: { x: 45, y: 60 }
  },
  {
    unit: '川西北气矿-广元作业区',
    secondaryUnit: '川西北气矿',
    tertiaryUnit: '广元采气作业区',
    objectName: '管道名称管道4',
    deviceName: '设备名称光纤振动4',
    status: '处置中',
    category: '光纤振动预警',
    alarmTime: '2024-06-06 08:20:00',
    realTimeData: '234',
    description: '管道光纤震动预警-6153265209(设备编号)于2025年3月2日10:20发生报警',
    mapPosition: { x: 75, y: 55 }
  }
]

// 默认设备数据（作为备用）
const defaultDeviceData = [
  {
    id: 1,
    unit: '川西北气矿-广元作业区',
    category: '光纤振动预警',
    objectName: 'XXXXXXXXXXX管道名称',
    deviceName: 'XXXXXXXXXXXxx名称',
    status: '完好',
    mapPosition: { x: 25, y: 45 }
  },
  {
    id: 2,
    unit: '川西北气矿-广元作业区',
    category: '次声波泄漏监测',
    objectName: 'XXXXXXXX管道名称',
    deviceName: 'XXXXXXXXXXX名称',
    status: '完好',
    mapPosition: { x: 65, y: 50 }
  },
  {
    id: 3,
    unit: '川西北气矿-广元作业区',
    category: '燃气泄漏监测',
    objectName: 'XXXXXXXXX管道名称',
    deviceName: 'XXXXXXXX名称',
    status: '故障',
    mapPosition: { x: 45, y: 60 }
  },
  {
    id: 4,
    unit: '川西北气矿-广元作业区',
    category: '激光云台泄漏监测',
    objectName: '中坝10井',
    deviceName: 'XXXXXXXXXXXx名称',
    status: '完好',
    mapPosition: { x: 75, y: 55 }
  }
]

// 分页设置
const pageSize = ref(5) // 每页显示5条
const currentPage = ref(1)

// 设备列表分页设置
const devicePageSize = ref(5) // 每页显示5条
const currentDevicePage = ref(1)

// 筛选器状态
const filters = ref({
  unit: '', // 所属单位筛选
  category: '', // 监测类别筛选
  status: '', // 处置情况筛选
  dateRange: '', // 时间范围筛选
  keyword: '' // 关键词搜索
})

// 设备列表筛选器状态
const deviceFilters = ref({
  unit: '', // 所属单位筛选
  category: '', // 监测类别筛选
  object: '' // 监测对象筛选
})

// 计算总报警数量（基于筛选后的数据）
const totalAlarms = computed(() => filteredAlarmData.value.length)

// 计算总页数
const totalPages = computed(() => Math.ceil(totalAlarms.value / pageSize.value))

// 设备列表计算属性
const totalDevices = computed(() => filteredDeviceData.value.length)
const totalDevicePages = computed(() => Math.ceil(totalDevices.value / devicePageSize.value))

// 获取筛选后的数据
const filteredAlarmData = computed(() => {
  let data = alarmData.value
  
  // 按单位筛选
  if (filters.value.unit) {
    data = data.filter(item => item.unit === filters.value.unit)
  }
  
  // 按监测类别筛选
  if (filters.value.category) {
    data = data.filter(item => item.category === filters.value.category)
  }
  
  // 按处置情况筛选
  if (filters.value.status) {
    data = data.filter(item => item.status === filters.value.status)
  }
  
  // 按时间范围筛选
  if (filters.value.dateRange) {
    const today = new Date()
    const filterDate = new Date()
    
    switch (filters.value.dateRange) {
      case 'today':
        filterDate.setDate(today.getDate() - 1)
        break
      case 'week':
        filterDate.setDate(today.getDate() - 7)
        break
      case 'month':
        filterDate.setMonth(today.getMonth() - 1)
        break
    }
    
    data = data.filter(item => {
      const alarmDate = new Date(item.alarmTime)
      return alarmDate >= filterDate
    })
  }
  
  // 按关键词搜索
  if (filters.value.keyword) {
    const keyword = filters.value.keyword.toLowerCase()
    data = data.filter(item => 
      item.unit.toLowerCase().includes(keyword) ||
      item.objectName.toLowerCase().includes(keyword) ||
      item.deviceName.toLowerCase().includes(keyword) ||
      item.description.toLowerCase().includes(keyword)
    )
  }
  
  return data
})

// 获取当前页的数据
const currentPageData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredAlarmData.value.slice(start, end)
})

// 获取筛选后的设备数据
const filteredDeviceData = computed(() => {
  let data = deviceData.value
  
  // 按单位筛选
  if (deviceFilters.value.unit) {
    data = data.filter(item => item.unit === deviceFilters.value.unit)
  }
  
  // 按监测类别筛选
  if (deviceFilters.value.category) {
    data = data.filter(item => item.category === deviceFilters.value.category)
  }
  
  // 按监测对象筛选
  if (deviceFilters.value.object) {
    const keyword = deviceFilters.value.object.toLowerCase()
    data = data.filter(item => 
      item.objectName.toLowerCase().includes(keyword)
    )
  }
  
  return data
})

// 获取当前页的设备数据
const currentDevicePageData = computed(() => {
  const start = (currentDevicePage.value - 1) * devicePageSize.value
  const end = start + devicePageSize.value
  return filteredDeviceData.value.slice(start, end)
})

// 报警详情弹窗状态
const showAlarmDetailPopup = ref(false)
const selectedAlarm = ref({})
const alarmMarkerPosition = ref({ x: 0, y: 0 })



// 切换图层菜单显示
const toggleLayerMenu = () => {
  showLayerMenu.value = !showLayerMenu.value
}

// 切换脉冲点显示
const togglePulseDots = () => {
  showPulseDots.value = !showPulseDots.value
  if (showPulseDots.value) {
    addPulseDots()
  } else {
    clearPulseDots()
  }
}

// 切换水域显示
const toggleWaterBodies = () => {
  showWaterBodies.value = !showWaterBodies.value
}

// 切换道路显示
const toggleRoads = () => {
  showRoads.value = !showRoads.value
}

// 切换地点标记显示
const toggleLocations = () => {
  showLocations.value = !showLocations.value
  if (showLocations.value) {
    addLocationMarkers()
  } else {
    clearLocationMarkers()
  }
}

// 切换热力图显示
const toggleHeatmap = () => {
  showHeatmap.value = !showHeatmap.value
}



// 获取状态样式类
const getStatusClass = (status) => {
  switch (status) {
    case '研判中':
      return 'status-reviewing'
    case '处置中':
      return 'status-processing'
    case '已完成':
      return 'status-completed'
    default:
      return 'status-default'
  }
}

// 获取设备状态样式类
const getDeviceStatusClass = (status) => {
  switch (status) {
    case '完好':
      return 'status-online'
    case '故障':
      return 'status-offline'
    case '维护中':
      return 'status-maintenance'
    default:
      return 'status-online'
  }
}

// 获取设备状态内联样式
const getDeviceStatusStyle = (status) => {
  switch (status) {
    case '完好':
      return {
        backgroundColor: '#E5FFF3',
        color: '#19BE6B',
        padding: '0.185vh 0.417vw',
        borderRadius: '0.208vw',
        fontSize: '0.521vw',
        fontWeight: '500',
        whiteSpace: 'nowrap',
        display: 'inline-block'
      }
    case '故障':
      return {
        backgroundColor: '#FFECEE',
        color: '#F56C6C',
        padding: '0.185vh 0.417vw',
        borderRadius: '0.208vw',
        fontSize: '0.521vw',
        fontWeight: '500',
        whiteSpace: 'nowrap',
        display: 'inline-block'
      }
    case '维护中':
      return {
        backgroundColor: '#FFF7E1',
        color: '#FF9100',
        padding: '0.185vh 0.417vw',
        borderRadius: '0.208vw',
        fontSize: '0.521vw',
        fontWeight: '500',
        whiteSpace: 'nowrap',
        display: 'inline-block'
      }
    default:
      return {
        backgroundColor: '#E5FFF3',
        color: '#19BE6B',
        padding: '0.185vh 0.417vw',
        borderRadius: '0.208vw',
        fontSize: '0.521vw',
        fontWeight: '500',
        whiteSpace: 'nowrap',
        display: 'inline-block'
      }
  }
}

// 显示设备详情
const showDeviceDetail = (item) => {
  console.log('显示设备详情:', item)
  console.log('设备状态:', item.status)
  console.log('状态样式类:', getDeviceStatusClass(item.status))
  
  // 设置选中的设备并显示详情窗口
  selectedDevice.value = item
  showDeviceDetailPopup.value = true
  
  // 如果设备有地图位置，在地图上添加设备标记点
  if (item.mapPosition) {
    addDeviceMarker(item)
  }
}

// 在地图上添加设备标记点
const addDeviceMarker = (device) => {
  if (!map.value || !mapLoaded.value || !device.mapPosition) return
  
  // 清除之前的设备标记点
  clearDeviceMarker()
  
  // 将百分比坐标转换为经纬度坐标
  const centerLng = 104.681
  const centerLat = 31.467
  const range = 0.1 // 坐标范围
  
  const lng = centerLng + (device.mapPosition.x - 50) * range / 50
  const lat = centerLat + (device.mapPosition.y - 50) * range / 50
  
  // 创建设备标记点
  const deviceMarker = new AMap.Marker({
    position: [lng, lat],
    icon: new AMap.Icon({
      size: new AMap.Size(20, 20),
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iOCIgZmlsbD0iIzQyQzFFNiIvPgo8L3N2Zz4K',
      imageSize: new AMap.Size(20, 20)
    }),
    offset: new AMap.Pixel(-10, -10),
    zIndex: 103
  })
  
  // 添加设备标签
  const deviceLabel = new AMap.Text({
    text: device.deviceName,
    position: [lng, lat],
    offset: new AMap.Pixel(0, -25),
    style: {
      fontSize: '12px',
      color: '#2C3E50',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      padding: '2px 4px',
      borderRadius: '2px',
      border: '1px solid #E9ECEF',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    }
  })
  
  // 保存设备标记点引用
  deviceMarkerRef.value = { marker: deviceMarker, label: deviceLabel }
  map.value.add(deviceMarker)
  map.value.add(deviceLabel)
  
  // 地图聚焦到设备标记点位置
  map.value.setCenter([lng, lat])
  map.value.setZoom(15) // 设置合适的缩放级别
  
  console.log('设备标记点已添加到地图，位置:', [lng, lat])
}

// 清除设备标记点
const clearDeviceMarker = () => {
  if (deviceMarkerRef.value) {
    map.value.remove(deviceMarkerRef.value.marker)
    map.value.remove(deviceMarkerRef.value.label)
    deviceMarkerRef.value = null
  }
}

// 设备标记点引用
const deviceMarkerRef = ref(null)

// 诊断弹窗状态
const showDiagnoseModal = ref(false)
const diagnoseForm = ref({
  status: '',
  remark: ''
})

// 诊断报警
const diagnoseAlarm = (item) => {
  // 初始化表单数据
  diagnoseForm.value.status = item.status || '研判中'
  diagnoseForm.value.remark = item.remark || ''
  showDiagnoseModal.value = true
}

// 关闭诊断弹窗
const closeDiagnoseModal = () => {
  showDiagnoseModal.value = false
  diagnoseForm.value = {
    status: '',
    remark: ''
  }
}

// 保存诊断信息
const saveDiagnose = () => {
  if (selectedAlarm.value) {
    // 更新报警数据
    selectedAlarm.value.status = diagnoseForm.value.status
    selectedAlarm.value.remark = diagnoseForm.value.remark
    
    // 更新alarmData中对应的项
    const index = alarmData.value.findIndex(item => item.id === selectedAlarm.value.id)
    if (index !== -1) {
      alarmData.value[index].status = diagnoseForm.value.status
      alarmData.value[index].remark = diagnoseForm.value.remark
    }
    
    console.log('诊断信息已保存:', diagnoseForm.value)
    closeDiagnoseModal()
  }
}

// 显示报警详情
const showAlarmDetail = (item) => {
  selectedAlarm.value = item
  showAlarmDetailPopup.value = true
  
  // 在地图上添加报警标记点
  addAlarmMarker(item)
}

// 在地图上添加报警标记点
const addAlarmMarker = (alarm) => {
  if (!map.value || !mapLoaded.value || !alarm.mapPosition) return
  
  // 清除之前的报警标记点
  clearAlarmMarker()
  
  // 将百分比坐标转换为经纬度坐标
  const centerLng = 104.681
  const centerLat = 31.467
  const range = 0.1 // 坐标范围
  
  const lng = centerLng + (alarm.mapPosition.x - 50) * range / 50
  const lat = centerLat + (alarm.mapPosition.y - 50) * range / 50
  
  // 创建报警标记点
  const alarmMarker = new AMap.Marker({
    position: [lng, lat],
    content: `<div style="
      width: 8px; 
      height: 8px; 
      background: #FF0000; 
      border-radius: 50%; 
      box-shadow: 0 0 6px #FF0000;
    "></div>`,
    offset: new AMap.Pixel(-4, -4),
    zIndex: 102
  })
  
  // 添加报警标记点的脉冲动画
  addAlarmPulseAnimation(alarmMarker)
  
  // 保存报警标记点引用
  alarmMarkerRef.value = alarmMarker
  map.value.add(alarmMarker)
  
  // 地图聚焦到报警标记点位置
  map.value.setCenter([lng, lat])
  map.value.setZoom(15) // 设置合适的缩放级别
  
  console.log('报警标记点已添加到地图，位置:', [lng, lat])
}

// 添加报警标记点的脉冲动画
const addAlarmPulseAnimation = (marker) => {
  let scale = 1
  let growing = true
  
  const animate = () => {
    if (growing) {
      scale += 0.03
      if (scale >= 2) {
        growing = false
      }
    } else {
      scale -= 0.03
      if (scale <= 1) {
        growing = true
      }
    }
    
    // 使用CSS transform来实现缩放，而不是重新创建图标
    marker.setContent(`<div style="
      width: 8px; 
      height: 8px; 
      background: #FF0000; 
      border-radius: 50%; 
      transform: scale(${scale});
      box-shadow: 0 0 6px #FF0000;
    "></div>`)
    
    // 继续动画
    requestAnimationFrame(animate)
  }
  
  animate()
}

// 清除报警标记点
const clearAlarmMarker = () => {
  if (alarmMarkerRef.value) {
    map.value.remove(alarmMarkerRef.value)
    alarmMarkerRef.value = null
  }
}

// 报警标记点引用
const alarmMarkerRef = ref(null)

// 关闭报警详情
const closeAlarmDetail = () => {
  showAlarmDetailPopup.value = false
  selectedAlarm.value = {}
  
  // 清除地图上的报警标记点
  clearAlarmMarker()
}

// 关闭设备详情
const closeDeviceDetail = () => {
  showDeviceDetailPopup.value = false
  selectedDevice.value = {}
  
  // 清除地图上的设备标记点
  clearDeviceMarker()
}

// 从CSV文件加载报警数据
const loadAlarmDataFromCSV = async () => {
  try {
    const response = await fetch('/alarm-data.csv')
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const csvText = await response.text()
    
    // 解析CSV数据
    const lines = csvText.trim().split('\n')
    const headers = lines[0].split(',')
    const data = []
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',')
      const item = {}
      
      headers.forEach((header, index) => {
        if (header === 'mapPositionX' || header === 'mapPositionY') {
          // 处理地图位置坐标
          if (!item.mapPosition) {
            item.mapPosition = {}
          }
          if (header === 'mapPositionX') {
            item.mapPosition.x = parseFloat(values[index]) || 0
          } else {
            item.mapPosition.y = parseFloat(values[index]) || 0
          }
        } else {
          item[header] = values[index]
        }
      })
      
      data.push(item)
    }
    
    // 更新报警数据
    alarmData.value = data
    // 重置筛选器和分页
    clearFilters()
    console.log('成功从CSV加载报警数据:', data.length, '条记录')
  } catch (error) {
    console.error('加载CSV数据失败，使用默认数据:', error)
    // 如果加载失败，使用默认数据
    alarmData.value = defaultAlarmData
  }
}

// 加载设备数据
const loadDeviceData = async () => {
  try {
    const response = await fetch('/device-data.csv')
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const csvText = await response.text()
    
    // 解析CSV数据
    const lines = csvText.trim().split('\n')
    const headers = lines[0].split(',').map(h => h.trim())
    const data = []
    
    console.log('CSV头部:', headers)
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim())
      const item = {}
      
      headers.forEach((header, index) => {
        item[header] = values[index]
      })
      
      // 调试：检查前几行的状态值
      if (i <= 3) {
        console.log(`第${i}行:`, { status: item.status, values: values })
      }
      
      // 为设备添加地图位置信息
      if (!item.mapPosition) {
        // 生成随机坐标，避免与报警标记重叠
        const x = Math.random() * 60 + 20 // 20% - 80%
        const y = Math.random() * 30 + 30 // 30% - 60%
        item.mapPosition = { x, y }
      }
      
      data.push(item)
    }
    
    // 更新设备数据
    deviceData.value = data
    // 重置筛选器和分页
    clearDeviceFilters()
    console.log('成功从CSV加载设备数据:', data.length, '条记录')
    console.log('第一条设备数据:', data[0])
    console.log('设备状态示例:', data.map(item => item.status))
    console.log('状态字段类型检查:', data.map(item => ({ status: item.status, type: typeof item.status, length: item.status ? item.status.length : 0 })))
  } catch (error) {
    console.error('加载CSV数据失败，使用默认数据:', error)
    // 如果加载失败，使用默认数据
    deviceData.value = defaultDeviceData
  }
}

// 加载默认数据
const loadDefaultAlarmData = () => {
  alarmData.value = defaultAlarmData
}

// 分页控制函数
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const goToPrevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const goToNextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const goToFirstPage = () => {
  currentPage.value = 1
}

const goToLastPage = () => {
  currentPage.value = totalPages.value
}

// 设备列表分页控制函数
const goToDevicePage = (page) => {
  if (page >= 1 && page <= totalDevicePages.value) {
    currentDevicePage.value = page
  }
}

const goToPrevDevicePage = () => {
  if (currentDevicePage.value > 1) {
    currentDevicePage.value--
  }
}

const goToNextDevicePage = () => {
  if (currentDevicePage.value < totalDevicePages.value) {
    currentDevicePage.value++
  }
}

const goToFirstDevicePage = () => {
  currentDevicePage.value = 1
}

const goToLastDevicePage = () => {
  currentDevicePage.value = totalDevicePages.value
}

// 筛选器控制函数
const updateFilter = (filterType, value) => {
  filters.value[filterType] = value
  // 重置到第一页
  currentPage.value = 1
}

const clearFilters = () => {
  filters.value = {
    unit: '',
    category: '',
    status: '',
    dateRange: '',
    keyword: ''
  }
  // 重置到第一页
  currentPage.value = 1
}

// 设备列表筛选器控制函数
const updateDeviceFilter = (filterType, value) => {
  deviceFilters.value[filterType] = value
  // 重置到第一页
  currentDevicePage.value = 1
}

const clearDeviceFilters = () => {
  deviceFilters.value = {
    unit: '',
    category: '',
    object: ''
  }
  // 重置到第一页
  currentDevicePage.value = 1
}

// 搜索设备
const searchDevices = () => {
  // 重置到第一页
  currentDevicePage.value = 1
}

// 获取可选的筛选选项
const getFilterOptions = computed(() => {
  const units = [...new Set(alarmData.value.map(item => item.unit))]
  const categories = [...new Set(alarmData.value.map(item => item.category))]
  const statuses = [...new Set(alarmData.value.map(item => item.status))]
  
  return {
    units,
    categories,
    statuses
  }
})

// 获取设备列表可选的筛选选项
const getDeviceFilterOptions = computed(() => {
  const units = [...new Set(deviceData.value.map(item => item.unit))]
  const categories = [...new Set(deviceData.value.map(item => item.category))]
  
  return {
    units,
    categories
  }
})

// 获取可见的页码数组
const getVisiblePages = () => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value
  
  if (total <= 7) {
    // 如果总页数少于等于7页，显示所有页码
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // 如果总页数大于7页，智能显示页码
    if (current <= 4) {
      // 当前页在前4页
      for (let i = 1; i <= 5; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 3) {
      // 当前页在后3页
      pages.push(1)
      pages.push('...')
      for (let i = total - 4; i <= total; i++) {
        pages.push(i)
      }
    } else {
      // 当前页在中间
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    }
  }
  
  return pages
}

// 获取设备列表可见的页码数组
const getVisibleDevicePages = () => {
  const pages = []
  const total = totalDevicePages.value
  const current = currentDevicePage.value
  
  if (total <= 7) {
    // 如果总页数少于等于7页，显示所有页码
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // 如果总页数大于7页，智能显示页码
    if (current <= 4) {
      // 当前页在前4页
      for (let i = 1; i <= 5; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 3) {
      // 当前页在后3页
      pages.push(1)
      pages.push('...')
      for (let i = total - 4; i <= total; i++) {
        pages.push(i)
      }
    } else {
      // 当前页在中间
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    }
  }
  
  return pages
}

// 这些函数已移除，因为报警点和设备点现在通过高德地图API动态添加



// 生成报警详情窗口的位置（与地图标记点联动）
const getAlarmWindowStyle = () => {
  if (!alarmMarkerRef.value || !map.value) {
    // 如果没有标记点或地图未加载，使用默认位置
    return {
      left: '50%',
      top: '30%',
      transform: 'translate(-50%, -50%)'
    }
  }
  
  try {
    // 获取地图标记点的屏幕坐标
    const markerPosition = alarmMarkerRef.value.getPosition()
    const pixelPosition = map.value.lngLatToContainer(markerPosition)
    
    // 计算窗口位置，显示在标记点上方，并向右偏移
    const windowX = pixelPosition.x + 238 // 向右偏移20像素
    const windowY = pixelPosition.y - 180 // 窗口显示在标记点上方120像素
    
    // 确保窗口不超出地图边界
    const mapContainer = document.getElementById('amap-container')
    if (!mapContainer) {
      return {
        left: '50%',
        top: '30%',
        transform: 'translate(-50%, -50%)'
      }
    }
    
    const containerRect = mapContainer.getBoundingClientRect()
    
    let finalX = windowX
    let finalY = windowY
    
    // 确保窗口不超出左边界
    if (finalX < 20) {
      finalX = 20
    }
    // 确保窗口不超出右边界
    if (finalX > containerRect.width - 320) {
      finalX = containerRect.width - 320
    }
    // 确保窗口不超出上边界
    if (finalY < 20) {
      finalY = 20
    }
    // 确保窗口不超出下边界
    if (finalY > containerRect.height - 250) {
      finalY = containerRect.height - 250
    }
    
    return {
      left: `${finalX}px`,
      top: `${finalY}px`,
      transform: 'none' // 使用绝对像素定位，不需要CSS transform
    }
  } catch (error) {
    console.error('计算报警详情窗口位置时出错:', error)
    // 出错时使用默认位置
    return {
      left: '50%',
      top: '30%',
      transform: 'translate(-50%, -50%)'
    }
  }
}

// 生成设备详情窗口的位置（与地图标记点联动）
const getDeviceWindowStyle = () => {
  if (!deviceMarkerRef.value || !map.value) {
    // 如果没有标记点或地图未加载，使用默认位置
    return {
      left: '50%',
      top: '30%',
      transform: 'translate(-50%, -50%)'
    }
  }
  
  try {
    // 获取地图标记点的屏幕坐标
    const markerPosition = deviceMarkerRef.value.marker.getPosition()
    const pixelPosition = map.value.lngLatToContainer(markerPosition)
    
    // 计算窗口位置，显示在标记点上方，并向左偏移
    const windowX = pixelPosition.x - 200 // 向左偏移30像素
    const windowY = pixelPosition.y - 120 // 窗口显示在标记点上方120像素
    
    // 确保窗口不超出地图边界
    const mapContainer = document.getElementById('amap-container')
    if (!mapContainer) {
      return {
        left: '50%',
        top: '30%',
        transform: 'translate(-50%, -50%)'
      }
    }
    
    const containerRect = mapContainer.getBoundingClientRect()
    
    let finalX = windowX
    let finalY = windowY
    
    // 确保窗口不超出左边界
    if (finalX < 20) {
      finalX = 20
    }
    // 确保窗口不超出右边界
    if (finalX > containerRect.width - 320) {
      finalX = containerRect.width - 320
    }
    // 确保窗口不超出上边界
    if (finalY < 20) {
      finalY = 20
    }
    // 确保窗口不超出下边界
    if (finalY > containerRect.height - 250) {
      finalY = containerRect.height - 250
    }
    
    return {
      left: `${finalX}px`,
      top: `${finalY}px`,
      transform: 'none' // 使用绝对像素定位，不需要CSS transform
    }
  } catch (error) {
    console.error('计算设备详情窗口位置时出错:', error)
    // 出错时使用默认位置
    return {
      left: '50%',
      top: '30%',
      transform: 'translate(-50%, -50%)'
    }
  }
}

// 地图展开功能
const expandMap = () => {
  isExpanded.value = true
}

// 地图向左展开功能
const expandMapLeft = () => {
  isExpandedLeft.value = true
}

const closeMap = () => {
  isExpanded.value = false
  isExpandedLeft.value = false
}

// 暴露展开方法供外部调用
defineExpose({
  expandMap,
  expandMapLeft,
  closeMap,
  isExpanded,
  isExpandedLeft
})

// 点击外部关闭图层菜单
const closeLayerMenu = (event) => {
  if (!event.target.closest('.layer-dropdown')) {
    showLayerMenu.value = false
  }
}

// 初始化高德地图
const initAMap = async () => {
  try {
    const AMap = await AMapLoader.load({
      key: AMAP_CONFIG.API_KEY,
      version: '2.0',
      plugins: AMAP_CONFIG.PLUGINS
    })
    
    // 创建地图实例
    map.value = new AMap.Map('amap-container', {
      zoom: AMAP_CONFIG.DEFAULT_ZOOM,
      center: AMAP_CONFIG.CENTER,
      mapStyle: AMAP_CONFIG.MAP_STYLE,
      viewMode: AMAP_CONFIG.VIEW_MODE
    })
    
    // 添加地图控件
    map.value.addControl(new AMap.Scale())
    map.value.addControl(new AMap.ToolBar())
    map.value.addControl(new AMap.HawkEye({isOpen: true}))
    map.value.addControl(new AMap.MapType())
    map.value.addControl(new AMap.Geolocation())
    
    mapLoaded.value = true
    console.log('高德地图初始化成功')
    
    // 地图加载完成后，不自动添加标记点，等待用户通过图层控制开启
    // addMapMarkers()
    
    // 添加地图事件监听器，当地图状态改变时更新详情窗口位置
    map.value.on('zoomend', updateDetailWindowPositions)
    map.value.on('moveend', updateDetailWindowPositions)
    map.value.on('resize', updateDetailWindowPositions)
  } catch (error) {
    console.error('高德地图初始化失败:', error)
    // 如果地图加载失败，可以显示错误提示或使用备用方案
  }
}

// 添加地图标记点
const addMapMarkers = () => {
  if (!map.value || !mapLoaded.value) return
  
  // 默认不添加任何标记点，只有在用户主动开启相应图层时才显示
  console.log('地图标记点功能已准备就绪，可通过图层控制开启')
}

// 当用户开启脉冲点时，添加随机分布的小红点
const addPulseDots = () => {
  if (!map.value || !mapLoaded.value) return
  
  // 清除之前的脉冲点
  clearPulseDots()
  
  // 创建随机分布的脉冲点标记
  const pulseMarkers = []
  
  // 生成8个主要脉冲点
  for (let i = 0; i < 8; i++) {
    const marker = createPulseMarker()
    pulseMarkers.push(marker)
    map.value.add(marker)
  }
  
  // 生成3个次要脉冲点
  for (let i = 0; i < 3; i++) {
    const marker = createPulseMarker(true)
    pulseMarkers.push(marker)
    map.value.add(marker)
  }
  
  // 保存脉冲点引用，用于后续清除
  pulseMarkersRef.value = pulseMarkers
  console.log('脉冲点图层已开启，共添加了', pulseMarkers.length, '个标记点')
}

// 创建脉冲点标记
const createPulseMarker = (isSecondary = false) => {
  // 生成随机坐标（在绵阳市范围内）
  const centerLng = 104.681
  const centerLat = 31.467
  const range = 0.05 // 坐标范围
  
  const lng = centerLng + (Math.random() - 0.5) * range
  const lat = centerLat + (Math.random() - 0.5) * range
  
  // 创建自定义标记，使用HTML内容而不是图标
  const marker = new AMap.Marker({
    position: [lng, lat],
    content: `<div style="
      width: 12px; 
      height: 12px; 
      background: ${isSecondary ? '#FF5722' : '#FF5722'}; 
      border-radius: 50%; 
      box-shadow: 0 0 8px ${isSecondary ? '#FF5722' : '#FF5722'};
    "></div>`,
    offset: new AMap.Pixel(-6, -6), // 居中显示
    zIndex: 100
  })
  
  // 添加脉冲动画效果
  addPulseAnimation(marker, isSecondary)
  
  return marker
}

// 添加脉冲动画效果
const addPulseAnimation = (marker, isSecondary) => {
  let scale = 1
  let growing = true
  
  const animate = () => {
    if (growing) {
      scale += 0.02
      if (scale >= 1.5) {
        growing = false
      }
    } else {
      scale -= 0.02
      if (scale <= 1) {
        growing = true
      }
    }
    
    // 使用CSS transform来实现缩放，而不是重新创建图标
    marker.setContent(`<div style="
      width: 12px; 
      height: 12px; 
      background: ${isSecondary ? '#FF5722' : '#FF5722'}; 
      border-radius: 50%; 
      transform: scale(${scale});
      box-shadow: 0 0 8px ${isSecondary ? '#FF5722' : '#FF5722'};
    "></div>`)
    
    // 继续动画
    requestAnimationFrame(animate)
  }
  
  animate()
}

// 清除脉冲点
const clearPulseDots = () => {
  if (pulseMarkersRef.value && pulseMarkersRef.value.length > 0) {
    pulseMarkersRef.value.forEach(marker => {
      map.value.remove(marker)
    })
    pulseMarkersRef.value = []
  }
}

// 脉冲点标记引用
const pulseMarkersRef = ref([])

// 当用户开启地点标记时，添加地点标记
const addLocationMarkers = () => {
  if (!map.value || !mapLoaded.value) return
  
  // 清除之前的地点标记
  clearLocationMarkers()
  
  // 创建地点标记
  const locationMarkers = []
  
  // 村委会标记
  const villageOffices = [
    { name: '涪江村村委会', position: [104.676, 31.472] },
    { name: '横山村村委会', position: [104.686, 31.467] }
  ]
  
  villageOffices.forEach(office => {
    const marker = new AMap.Marker({
      position: office.position,
      icon: new AMap.Icon({
        size: new AMap.Size(20, 20),
        image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iOCIgZmlsbD0iIzRGQzYzQyIvPgo8L3N2Zz4K',
        imageSize: new AMap.Size(20, 20)
      }),
      offset: new AMap.Pixel(-10, -10),
      zIndex: 101
    })
    
    // 添加标签
    const label = new AMap.Text({
      text: office.name,
      position: office.position,
      offset: new AMap.Pixel(0, -25),
      style: {
        fontSize: '12px',
        color: '#2C3E50',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: '2px 4px',
        borderRadius: '2px',
        border: '1px solid #E9ECEF'
      }
    })
    
    locationMarkers.push(marker, label)
    map.value.add(marker)
    map.value.add(label)
  })
  
  // 学校标记
  const schools = [
    { name: '绵阳市游仙区涪江小学', position: [104.691, 31.470] },
    { name: '上海宝冶绵阳中物院春蕾小学项目部', position: [104.696, 31.465] },
    { name: '中物院春蕾小学', position: [104.701, 31.468] }
  ]
  
  schools.forEach(school => {
    const marker = new AMap.Marker({
      position: school.position,
      icon: new AMap.Icon({
        size: new AMap.Size(20, 20),
        image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iOCIgZmlsbD0iIzIxOTZGMiIvPgo8L3N2Zz4K',
        imageSize: new AMap.Size(20, 20)
      }),
      offset: new AMap.Pixel(-10, -10),
      zIndex: 101
    })
    
    // 添加标签
    const label = new AMap.Text({
      text: school.name,
      position: school.position,
      offset: new AMap.Pixel(0, -25),
      style: {
        fontSize: '12px',
        color: '#2C3E50',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: '2px 4px',
        borderRadius: '2px',
        border: '1px solid #E9ECEF'
      }
    })
    
    locationMarkers.push(marker, label)
    map.value.add(marker)
    map.value.add(label)
  })
  
  // 其他地点标记
  const otherLocations = [
    { name: '紫云', position: [104.681, 31.457] },
    { name: '中科社区', position: [104.686, 31.452] },
    { name: '石马镇七姓村', position: [104.691, 31.460] },
    { name: '万为滨江壹号院', position: [104.696, 31.455] },
    { name: '东岳庙', position: [104.701, 31.470] },
    { name: '美乐和府', position: [104.706, 31.465] },
    { name: '科学城七区-东区', position: [104.701, 31.450] },
    { name: '浪琴湾', position: [104.706, 31.460] }
  ]
  
  otherLocations.forEach(location => {
    const marker = new AMap.Marker({
      position: location.position,
      icon: new AMap.Icon({
        size: new AMap.Size(16, 16),
        image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iOCIgY3k9IjgiIHI9IjYiIGZpbGw9IiM2Qzc1N0QiLz4KPC9zdmc+',
        imageSize: new AMap.Size(16, 16)
      }),
      offset: new AMap.Pixel(-8, -8),
      zIndex: 101
    })
    
    // 添加标签
    const label = new AMap.Text({
      text: location.name,
      position: location.position,
      offset: new AMap.Pixel(0, -20),
      style: {
        fontSize: '11px',
        color: '#2C3E50',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: '1px 3px',
        borderRadius: '2px',
        border: '1px solid #E9ECEF'
      }
    })
    
    locationMarkers.push(marker, label)
    map.value.add(marker)
    map.value.add(label)
  })
  
  // 保存地点标记引用，用于后续清除
  locationMarkersRef.value = locationMarkers
  console.log('地点标记图层已开启，共添加了', locationMarkers.length, '个标记点')
}

// 清除地点标记
const clearLocationMarkers = () => {
  if (locationMarkersRef.value && locationMarkersRef.value.length > 0) {
    locationMarkersRef.value.forEach(marker => {
      map.value.remove(marker)
    })
    locationMarkersRef.value = []
  }
}

// 地点标记引用
const locationMarkersRef = ref([])

// 监听全局点击事件
onMounted(() => {
  // 初始化高德地图
  initAMap()
  
  // 加载报警数据
  loadAlarmDataFromCSV()
  // 加载设备数据
  loadDeviceData()
  
  document.addEventListener('click', closeLayerMenu)
  
  // 监听展开地图事件
  window.addEventListener('expandMap', (event) => {
    if (event.detail.component === 'plan-count') {
      expandMap()
    }
  })
  
  // 监听向左展开地图事件
  window.addEventListener('expandMapLeft', (event) => {
    if (event.detail.component === 'process-follow') {
      expandMapLeft()
    }
  })
  
  // 设置定时刷新，每30秒检查一次CSV数据更新
  const refreshInterval = setInterval(() => {
    loadAlarmDataFromCSV()
    loadDeviceData()
  }, 30000)
  
  // 组件卸载时清理定时器
  onUnmounted(() => {
    clearInterval(refreshInterval)
  })
})

onUnmounted(() => {
  document.removeEventListener('click', closeLayerMenu)
  
  // 移除展开地图事件监听器
  window.removeEventListener('expandMap', (event) => {
    if (event.detail.component === 'plan-count') {
      expandMap()
    }
  })
  
  // 移除向左展开地图事件监听器
  window.removeEventListener('expandMapLeft', (event) => {
    if (event.detail.component === 'process-follow') {
      expandMapLeft()
    }
  })
})

// getRandomDotStyle 函数已移除，脉冲点现在通过高德地图API动态添加

const showDeviceOnMap = (item) => {
  console.log('显示设备在地图上的位置:', item)
  
  // 为设备生成随机坐标位置（如果没有预设位置）
  if (!item.mapPosition) {
    // 生成随机坐标，避免与报警标记重叠
    const x = Math.random() * 60 + 20 // 20% - 80%
    const y = Math.random() * 30 + 40 // 40% - 70%
    item.mapPosition = { x, y }
  }
  
  // 更新设备标注状态
  selectedDevice.value = item
  
  // 在地图上添加设备标记点
  addDeviceMarker(item)
  
  // 同时显示设备详情窗口
  showDeviceDetailPopup.value = true
  
  console.log('设备坐标标注已显示，位置:', item.mapPosition)
}

// 更新详情窗口位置（当地图缩放、平移时调用）
const updateDetailWindowPositions = () => {
  // 强制Vue重新计算详情窗口的位置
  // 通过触发响应式更新来实现
  if (showAlarmDetailPopup.value) {
    // 触发报警详情窗口位置更新
    nextTick(() => {
      // 这里可以添加额外的位置更新逻辑
    })
  }
  
  if (showDeviceDetailPopup.value) {
    // 触发设备详情窗口位置更新
    nextTick(() => {
      // 这里可以添加额外的位置更新逻辑
    })
  }
}

// 初始化高德地图
</script>

<style scoped>
.map-container {
  background: white;
  border-radius: 0.417vw;
  box-shadow: 0 0.185vh 0.417vw rgba(0, 0, 0, 0.1);
  width: calc(100vw - 53.125vw);
  height: calc(100vh - 9.259vh);
  position: fixed;
  left: 26.563vw;
  top: 8.333vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  z-index: 100;
}

.map-container.expanded {
  width: calc(100vw - 25vw - 2.083vw);
  right: 0.5vw;
  z-index: 1000;
}

.map-container.expanded-left {
  width: calc(100vw - 24.963vw - 2.083vw);
  left: 0.5vw;
  z-index: 1000;
}

/* 顶部控制栏 */
.control-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.926vh 0.781vw;
  background: #F8F9FA;
  border-bottom: 0.093vh solid #E9ECEF;
  height: 4.63vh;
}

.control-left {
  display: flex;
  align-items: center;
  gap: 0.781vw;
}

.layer-btn {
  background: #2470FF;
  color: white;
  border: none;
  padding: 0.556vh 0.625vw;
  border-radius: 0.208vw;
  font-size: 0.625vw;
  cursor: pointer;
  position: relative;
}

.layer-dropdown {
  position: relative;
}

.layer-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  border: 0.052vw solid #E9ECEF;
  border-radius: 0.208vw;
  box-shadow: 0 0.185vh 0.417vw rgba(0, 0, 0, 0.1);
  min-width: 8.333vw;
  z-index: 1000;
  margin-top: 0.185vh;
}

.layer-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.556vh 0.625vw;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-bottom: 0.052vw solid #F8F9FA;
}

.layer-option:last-child {
  border-bottom: none;
}

.layer-option:hover {
  background: #F8F9FA;
}

.option-text {
  font-size: 0.573vw;
  color: #2C3E50;
}

.option-status {
  font-size: 0.573vw;
  color: #4A90E2;
  font-weight: bold;
}

.search-box {
  display: flex;
  align-items: center;
  background: white;
  border: 0.052vw solid #E9ECEF;
  border-radius: 0.208vw;
  padding: 0.37vh 0.417vw;
  gap: 0.26vw;
}

.search-icon {
  font-size: 0.625vw;
  color: #6C757D;
}

.search-input {
  border: none;
  outline: none;
  font-size: 0.625vw;
  width: 6.25vw;
}

.search-input::placeholder {
  color: #6C757D;
}

.dropdown-unit {
  display: flex;
  align-items: center;
  gap: 0.26vw;
  font-size: 0.625vw;
  color: #2C3E50;
  cursor: pointer;
}

.dropdown-arrow {
  font-size: 0.521vw;
}

.settings-icon {
  font-size: 0.833vw;
  cursor: pointer;
  color: #4A90E2;
}

.close-btn {
  background: #dc3545;
  color: white;
  border: none;
  padding: 0.278vh 0.417vw;
  border-radius: 0.208vw;
  font-size: 0.521vw;
  cursor: pointer;
  margin-right: 0.417vw;
  transition: background-color 0.2s ease;
}

.close-btn:hover {
  background: #c82333;
}

.close-icon {
  font-size: 0.521vw;
  font-weight: bold;
}

/* 地图区域 */
.map-area {
  flex: 1;
  position: relative;
  overflow: hidden;
}

/* 高德地图容器 */
.amap-container {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}

/* 地图覆盖层 - 保持原有的标记和UI元素 */
.map-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  pointer-events: none; /* 允许点击穿透到地图 */
}

/* 需要交互的元素恢复指针事件 */
.map-overlay .alarm-table-container,
.map-overlay .device-table-container,
.map-overlay .alarm-detail-window,
.map-overlay .device-detail-window {
  pointer-events: auto;
}

/* 移除原有的背景图片样式 */
.map-background {
  display: none;
}

/* 水域 */
.water-bodies {
  position: absolute;
  width: 100%;
  height: 100%;
}

.water-body {
  position: absolute;
  background: #E3F2FD;
  border-radius: 50%;
}

.water-1 {
  width: 4.167vw;
  height: 5.556vh;
  left: 30%;
  top: 40%;
}

.water-2 {
  width: 3.125vw;
  height: 3.704vh;
  left: 70%;
  top: 60%;
}

/* 道路 */
.roads {
  position: absolute;
  width: 100%;
  height: 100%;
}

.road {
  position: absolute;
  background: white;
  border-radius: 0.104vw;
}

.road-1 {
  width: 60%;
  height: 0.278vh;
  left: 20%;
  top: 30%;
  transform: rotate(15deg);
}

.road-2 {
  width: 50%;
  height: 0.278vh;
  left: 25%;
  top: 50%;
  transform: rotate(-10deg);
}

.road-3 {
  width: 40%;
  height: 0.278vh;
  left: 60%;
  top: 35%;
  transform: rotate(25deg);
}

.road-4 {
  width: 35%;
  height: 0.278vh;
  left: 45%;
  top: 65%;
  transform: rotate(-5deg);
}

/* 地点标记 */
.locations {
  position: absolute;
  width: 100%;
  height: 100%;
}

.location {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.185vh;
}

.location-icon {
  font-size: 0.833vw;
  width: 1.042vw;
  height: 1.852vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.location-label {
  font-size: 0.417vw;
  color: #2C3E50;
  text-align: center;
  line-height: 1.2;
  white-space: nowrap;
}

.red-star {
  color: #FF5722;
}

.blue-building {
  color: #2196F3;
}

/* 热力图 */
.heatmap {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 5;
}

.heatmap-area {
  position: absolute;
  border-radius: 50%;
  overflow: hidden;
}

.main-heatmap {
  width: 15.625vw;
  height: 20.833vh;
  left: 50%;
  top: 30%;
  transform: translate(-50%, -50%);
}

.secondary-heatmap {
  width: 6.25vw;
  height: 8.333vh;
  left: 60%;
  top: 40%;
  transform: translate(-50%, -50%);
}

/* 热力图发光效果 */
.heatmap-glow {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: radial-gradient(circle, 
    rgba(255, 107, 0, 0.4) 0%, 
    rgba(255, 193, 7, 0.3) 30%, 
    rgba(76, 175, 80, 0.2) 60%, 
    rgba(33, 150, 243, 0.1) 80%, 
    transparent 100%);
  filter: blur(0.208vw);
  animation: heatmapPulse 3s ease-in-out infinite;
}

/* 热力图核心 */
.heatmap-core {
  position: absolute;
  width: 60%;
  height: 60%;
  top: 20%;
  left: 20%;
  border-radius: 50%;
  background: radial-gradient(circle, 
    rgba(255, 87, 34, 0.8) 0%, 
    rgba(255, 152, 0, 0.6) 40%, 
    rgba(255, 193, 7, 0.4) 70%, 
    transparent 100%);
  animation: heatmapCore 4s ease-in-out infinite;
}

/* 热力图脉冲动画 */
@keyframes heatmapPulse {
  0%, 100% {
    opacity: 0.6;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
}

/* 热力图核心动画 */
@keyframes heatmapCore {
  0%, 100% {
    opacity: 0.8;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

.heatmap-dots {
  position: relative;
  width: 100%;
  height: 100%;
}

.heatmap-dot {
  position: absolute;
  width: 0.156vw;
  height: 0.278vh;
  background: #FF5722;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

/* 脉冲动画 */
@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
    box-shadow: 0 0 0 0 rgba(255, 87, 34, 0.7);
  }
  50% {
    transform: scale(1.2);
    opacity: 0.8;
    box-shadow: 0 0 0 0.208vw rgba(255, 87, 34, 0.4);
  }
  100% {
    transform: scale(1);
    opacity: 1;
    box-shadow: 0 0 0 0 rgba(255, 87, 34, 0);
  }
}



/* 随机分布的小红点 */
.random-dots {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10;
}

/* 设备报警列表表格 */
.alarm-table-container {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: #FFFFFF;
  backdrop-filter: blur(10px);
  border-top: 0.052vw solid #E9ECEF;
  border-radius: 0.817vw;
  z-index: 20;
  max-height: 40vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.alarm-table-header {
  padding: 1.389vh 1.042vw;
  border-bottom: 0.052vw solid #E9ECEF;
  background: #FFFFFF;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.926vh;
}

.filter-summary {
  font-size: 0.573vw;
  color: #6C757D;
  font-weight: 500;
}

.table-title {
  margin: 0 0 0.926vh 0;
  font-size: 1.042vw;
  color: #2C3E50;
  font-weight: 600;
}

.table-filters {
  display: flex;
  gap: 1.042vw;
  flex-wrap: wrap;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 0.417vw;
}

.filter-label {
  font-size: 0.625vw;
  color: #6C757D;
  white-space: nowrap;
}

.filter-select {
  padding: 0.278vh 0.417vw;
  border: 0.052vw solid #E9ECEF;
  border-radius: 0.208vw;
  font-size: 0.573vw;
  background: white;
  min-width: 8.333vw;
}

.filter-input {
  padding: 0.278vh 0.417vw;
  border: 0.052vw solid #E9ECEF;
  border-radius: 0.208vw;
  font-size: 0.573vw;
  background: white;
  min-width: 12.5vw;
  outline: none;
}

.filter-input:focus {
  border-color: #007BFF;
  box-shadow: 0 0 0 0.104vw rgba(0, 123, 255, 0.25);
}

.clear-filters-btn {
  padding: 0.278vh 0.625vw;
  background: #6C757D;
  color: white;
  border: none;
  border-radius: 0.208vw;
  font-size: 0.521vw;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.clear-filters-btn:hover {
  background: #5A6268;
}

.alarm-table {
  flex: 1;
  overflow: auto;
  padding: 0 1.042vw;
}

.alarm-table table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.573vw;
}

.alarm-table th,
.alarm-table td {
  padding: 0.556vh 0.417vw;
  text-align: left;
  border-bottom: 0.052vw solid #F1F3F4;
}

.alarm-table th {
  background: #FFFFFF;
  font-weight: 600;
  color: #2C3E50;
  position: sticky;
  top: 0;
  z-index: 1;
}

.alarm-table td {
  color: #495057;
}

.status-badge {
  padding: 0.185vh 0.417vw;
  border-radius: 0.208vw;
  font-size: 0.521vw;
  font-weight: 500;
  white-space: nowrap;
}

.status-reviewing {
  background: #FFECEE;
  color: #F56C6C;
}

.status-processing {
  background: #FFF7E1;
  color: #FF9100;
}

.status-completed {
  background: #E5FFF3;
  color: #19BE6B;
}

.status-default {
  background: #FFFFFF;
  color: #6C757D;
}

.diagnose-btn {
  background: #007BFF;
  color: white;
  border: none;
  padding: 0.278vh 0.625vw;
  border-radius: 0.208vw;
  font-size: 0.521vw;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.diagnose-btn:hover {
  background: #0056B3;
}

.table-pagination {
  padding: 0.926vh 1.042vw;
  border-top: 0.052vw solid #E9ECEF;
  background: #FFFFFF;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination-info {
  font-size: 0.573vw;
  color: #6C757D;
}

.pagination-controls {
  display: flex;
  gap: 0.208vw;
  align-items: center;
}

.page-btn {
  padding: 0.278vh 0.417vw;
  border: 0.052vw solid #E9ECEF;
  background: #FFFFFF;
  color: #495057;
  border-radius: 0.208vw;
  font-size: 0.521vw;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 2.083vw;
  text-align: center;
}

.page-btn:hover:not(:disabled) {
  background: #F8F9FA;
  border-color: #007BFF;
  color: #007BFF;
}

.page-btn.active {
  background: #007BFF;
  border-color: #007BFF;
  color: white;
}

.page-btn:disabled {
  background: #F8F9FA;
  color: #ADB5BD;
  cursor: not-allowed;
  border-color: #E9ECEF;
}

.page-ellipsis {
  padding: 0.278vh 0.417vw;
  color: #6C757D;
  font-size: 0.521vw;
  min-width: 2.083vw;
  text-align: center;
}

.page-btn {
  padding: 0.278vh 0.417vw;
  border: 0.052vw solid #E9ECEF;
  background: white;
  color: #6C757D;
  border-radius: 0.208vw;
  font-size: 0.521vw;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 1.667vw;
}

.page-btn:hover {
  background: #E9ECEF;
}

.page-btn.active {
  background: #007BFF;
  color: white;
  border-color: #007BFF;
}

/* 报警行悬停效果 */
.alarm-row {
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.alarm-row:hover {
  background: rgba(0, 123, 255, 0.05);
}

/* 地图上的报警详情窗口 */
.alarm-detail-window {
  position: fixed; /* 改为fixed定位，相对于视口 */
  z-index: 1000; /* 提高z-index，确保在最上层 */
  pointer-events: auto;
  /* 确保窗口不会超出地图边界 */
  max-width: 480px;
  max-height: 50vh;
  /* 添加过渡动画 */
  transition: all 0.3s ease;
}

.window-content {
  background: white;
  border-radius: 0.417vw;
  box-shadow: 0 0.556vh 1.042vw rgba(0, 0, 0, 0.3);
  width: 25vw;
  max-width: 480px;
  max-height: 50vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border: 0.052vw solid #E9ECEF;
}

.window-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.389vh 1.042vw;
  border-bottom: 0.052vw solid #E9ECEF;
  background: #F8F9FA;
}

.window-title {
  display: flex;
  align-items: center;
  gap: 0.417vw;
  font-size: 0.833vw;
  font-weight: 600;
  color: #2C3E50;
}

.title-bar {
  width: 0.208vw;
  height: 1.389vh;
  background: #007BFF;
  border-radius: 0.104vw;
}

.window-progress {
  display: flex;
  gap: 0.208vw;
}

.progress-item {
  width: 0.417vw;
  height: 0.417vw;
  background: #E9ECEF;
  border-radius: 0.104vw;
}

.progress-item.active {
  background: #007BFF;
}

.close-window-btn {
  background: none;
  border: none;
  font-size: 0.833vw;
  color: #6C757D;
  cursor: pointer;
  padding: 0.278vh 0.417vw;
  border-radius: 0.208vw;
  transition: background-color 0.2s ease;
}

.close-window-btn:hover {
  background: #E9ECEF;
}

.window-body {
  padding: 1.389vh 1.042vw;
  flex: 1;
  overflow-y: auto;
}

.detail-row {
  display: flex;
  gap: 1.042vw;
  margin-bottom: 0.926vh;
}

.detail-item {
  display: flex;
  flex: 1;
  align-items: flex-start;
}

.detail-label {
  width: 4.167vw;
  font-size: 0.621vw;
  color: #6C757D;
  font-weight: bold;
  flex-shrink: 0;
}

.detail-value {
  font-size: 0.621vw;
  color: #2C3E50;
  flex: 1;
  word-break: break-all;
  margin-left: 0;
  padding-left: 0;
}

.description-item .detail-value {
  line-height: 1.4;
}

.window-footer {
  padding: 1.389vh 1.042vw;
  border-top: 0.052vw solid #E9ECEF;
  background: #F8F9FA;
  display: flex;
  justify-content: center;
  align-items: center;
}

.diagnose-window-btn {
  background: #2470FF;
  color: white;
  border: none;
  padding: 0.556vh 1.042vw;
  border-radius: 0.208vw;
  font-size: 0.521vw;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.diagnose-window-btn:hover {
  background: #138496;
}

/* 报警地点指示器现在通过高德地图API动态添加，不再使用CSS样式 */



.heatmap-dots {
  position: relative;
  width: 100%;
  height: 100%;
}

/* 设备列表表格 */
.device-table-container {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: #FFFFFF;
  backdrop-filter: blur(10px);
  border-top: 0.052vw solid #E9ECEF;
  border-radius: 0.817vw;
  z-index: 20;
  max-height: 40vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.device-table-header {
  padding: 1.389vh 1.042vw;
  border-bottom: 0.052vw solid #E9ECEF;
  background: #FFFFFF;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.926vh;
}

.filter-summary {
  font-size: 0.573vw;
  color: #6C757D;
  font-weight: 500;
}

.table-title {
  margin: 0 0 0.926vh 0;
  font-size: 1.042vw;
  color: #2C3E50;
  font-weight: 600;
}

.table-filters {
  display: flex;
  gap: 1.042vw;
  flex-wrap: wrap;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 0.417vw;
}

.filter-label {
  font-size: 0.625vw;
  color: #6C757D;
  white-space: nowrap;
}

.filter-select {
  padding: 0.278vh 0.417vw;
  border: 0.052vw solid #E9ECEF;
  border-radius: 0.208vw;
  font-size: 0.573vw;
  background: white;
  min-width: 8.333vw;
}

.filter-input {
  padding: 0.278vh 0.417vw;
  border: 0.052vw solid #E9ECEF;
  border-radius: 0.208vw;
  font-size: 0.573vw;
  background: white;
  min-width: 12.5vw;
  outline: none;
}

.filter-input:focus {
  border-color: #007BFF;
  box-shadow: 0 0 0 0.104vw rgba(0, 123, 255, 0.25);
}

.search-btn {
  background: #2470FF;
  color: white;
  border: none;
  padding: 0.278vh 0.625vw;
  border-radius: 0.208vw;
  font-size: 0.521vw;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.search-btn:hover {
  background: #138496;
}

.search-icon {
  font-size: 0.625vw;
  color: white;
}

.clear-filters-btn {
  padding: 0.278vh 0.625vw;
  background: #6C757D;
  color: white;
  border: none;
  border-radius: 0.208vw;
  font-size: 0.521vw;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.clear-filters-btn:hover {
  background: #5A6268;
}

.device-table {
  flex: 1;
  overflow: auto;
  padding: 0 1.042vw;
}

.device-table table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.573vw;
}

.device-table th,
.device-table td {
  padding: 0.556vh 0.417vw;
  text-align: left;
  border-bottom: 0.052vw solid #F1F3F4;
}

.device-table th {
  background: #FFFFFF;
  font-weight: 600;
  color: #2C3E50;
  position: sticky;
  top: 0;
  z-index: 1;
}

.device-table td {
  color: #495057;
}

/* 设备状态样式 */

.device-status-badge {
  padding: 0.185vh 0.417vw;
  border-radius: 0.208vw;
  font-size: 0.521vw;
  font-weight: 500;
  white-space: nowrap;
  display: inline-block;
}

.device-status-badge.status-online {
  background: #E5FFF3 !important;
  color: #19BE6B !important;
}

.device-status-badge.status-offline {
  background: #FFECEE !important;
  color: #F56C6C !important;
}

.device-status-badge.status-maintenance {
  background: #FFF7E1 !important;
  color: #FF9100 !important;
}

.detail-btn {
  background: #007BFF;
  color: white;
  border: none;
  padding: 0.278vh 0.625vw;
  border-radius: 0.208vw;
  font-size: 0.521vw;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.detail-btn:hover {
  background: #0056B3;
}

.table-pagination {
  padding: 0.926vh 1.042vw;
  border-top: 0.052vw solid #E9ECEF;
  background: #FFFFFF;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination-info {
  font-size: 0.573vw;
  color: #6C757D;
}

.pagination-controls {
  display: flex;
  gap: 0.208vw;
  align-items: center;
}

.page-btn {
  padding: 0.278vh 0.417vw;
  border: 0.052vw solid #E9ECEF;
  background: #FFFFFF;
  color: #495057;
  border-radius: 0.208vw;
  font-size: 0.521vw;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 2.083vw;
  text-align: center;
}

.page-btn:hover:not(:disabled) {
  background: #F8F9FA;
  border-color: #007BFF;
  color: #007BFF;
}

.page-btn.active {
  background: #007BFF;
  border-color: #007BFF;
  color: white;
}

.page-btn:disabled {
  background: #F8F9FA;
  color: #ADB5BD;
  cursor: not-allowed;
  border-color: #E9ECEF;
}

.page-ellipsis {
  padding: 0.278vh 0.417vw;
  color: #6C757D;
  font-size: 0.521vw;
  min-width: 2.083vw;
  text-align: center;
}

.page-btn {
  padding: 0.278vh 0.417vw;
  border: 0.052vw solid #E9ECEF;
  background: white;
  color: #6C757D;
  border-radius: 0.208vw;
  font-size: 0.521vw;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 1.667vw;
}

.page-btn:hover {
  background: #E9ECEF;
}

.page-btn.active {
  background: #007BFF;
  color: white;
  border-color: #007BFF;
}

/* 设备行悬停效果 */
.device-row {
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.device-row:hover {
  background: rgba(0, 123, 255, 0.05);
}

/* 诊断弹窗样式 */
.diagnose-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.diagnose-modal-content {
  background: white;
  border-radius: 0.417vw;
  box-shadow: 0 0.556vh 1.042vw rgba(0, 0, 0, 0.3);
  width: 25vw;
  max-width: 400px;
  max-height: 60vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.diagnose-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.389vh 1.042vw;
  border-bottom: 0.052vw solid #E9ECEF;
  background: #F8F9FA;
}

.diagnose-modal-header h3 {
  margin: 0;
  font-size: 0.833vw;
  color: #2C3E50;
  font-weight: 600;
}

.close-modal-btn {
  background: none;
  border: none;
  font-size: 0.833vw;
  color: #6C757D;
  cursor: pointer;
  padding: 0.278vh 0.417vw;
  border-radius: 0.208vw;
  transition: background-color 0.2s ease;
}

.close-modal-btn:hover {
  background: #E9ECEF;
}

.diagnose-modal-body {
  padding: 1.389vh 1.042vw;
  flex: 1;
  overflow-y: auto;
}

.form-group {
  margin-bottom: 1.389vh;
}

.form-label {
  display: block;
  font-size: 0.625vw;
  color: #2C3E50;
  font-weight: 500;
  margin-bottom: 0.556vh;
}

.form-select {
  width: 100%;
  padding: 0.556vh 0.417vw;
  border: 0.052vw solid #E9ECEF;
  border-radius: 0.208vw;
  font-size: 0.573vw;
  background: white;
  outline: none;
}

.form-select:focus {
  border-color: #007BFF;
  box-shadow: 0 0 0 0.104vw rgba(0, 123, 255, 0.25);
}

.form-textarea {
  width: 100%;
  padding: 0.556vh 0.417vw;
  border: 0.052vw solid #E9ECEF;
  border-radius: 0.208vw;
  font-size: 0.573vw;
  background: white;
  outline: none;
  resize: vertical;
  font-family: inherit;
}

.form-textarea:focus {
  border-color: #007BFF;
  box-shadow: 0 0 0 0.104vw rgba(0, 123, 255, 0.25);
}

.diagnose-modal-footer {
  padding: 1.389vh 1.042vw;
  border-top: 0.052vw solid #E9ECEF;
  background: #F8F9FA;
  display: flex;
  justify-content: flex-end;
  gap: 0.781vw;
}

.cancel-btn {
  background: #6C757D;
  color: white;
  border: none;
  padding: 0.556vh 1.042vw;
  border-radius: 0.208vw;
  font-size: 0.573vw;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.cancel-btn:hover {
  background: #5A6268;
}

.save-btn {
  background: #28A745;
  color: white;
  border: none;
  padding: 0.556vh 1.042vw;
  border-radius: 0.208vw;
  font-size: 0.573vw;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.save-btn:hover {
  background: #218838;
}

/* 设备坐标标注 */
.device-location-marker {
  position: absolute;
  z-index: 10;
  pointer-events: auto; /* 允许点击 */
  cursor: pointer; /* 显示手型光标 */
  transition: transform 0.2s ease;
}

.device-location-marker:hover {
  transform: scale(1.1); /* 悬停时放大 */
}

.device-marker-icon {
  width: 2.083vw;
  height: 2.083vw;
}

.device-marker-label {
  position: absolute;
  top: -2.5vw;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.9);
  padding: 0.278vw 0.417vw;
  border-radius: 0.208vw;
  font-size: 0.521vw;
  color: #2C3E50;
  white-space: nowrap;
  pointer-events: none;
  border: 0.052vw solid #E9ECEF;
  box-shadow: 0 0.185vh 0.417vw rgba(0, 0, 0, 0.1);
}



/* 设备详情窗口 */
.device-detail-window {
  position: fixed; /* 改为fixed定位，相对于视口 */
  z-index: 1000; /* 提高z-index，确保在最上层 */
  pointer-events: auto;
  /* 确保窗口不会超出地图边界 */
  max-width: 480px;
  max-height: 50vh;
  /* 添加过渡动画 */
  transition: all 0.3s ease;
}

/* 移除重复的CSS定义，使用与报警详情窗口相同的样式 */


</style> 