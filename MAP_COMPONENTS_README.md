# 在 First-vue-project 中使用 Map 组件库

## 概述

本项目已经配置好了 `Maps-conceil\map` 中的地图组件库，您可以直接使用这些专业的地图相关组件。

## 🗺️ 可用的地图组件

### 核心地图组件
- **`GislifeMap`** - 主地图组件，支持多种地图类型和交互
- **`GislifeBaseMap`** - 基础地图组件，提供基础地图功能

### 功能组件
- **`LayerTree`** - 图层树组件，管理地图图层显示/隐藏
- **`GislifeTable`** - 地图数据表格组件，展示地理数据
- **`GislifeLegend`** - 图例组件，显示地图符号说明
- **`GislifeMapSwitch`** - 地图类型切换组件
- **`GislifeSearch`** - 地图搜索组件
- **`GislifeTooBox`** - 地图工具栏组件

### 工具组件
- **`MapContextProvider`** - 地图上下文提供者
- **`Hooks`** - 地图相关的 Vue Composition API Hooks

## 🚀 使用方法

### 1. 基础地图组件

```vue
<template>
  <GislifeMap 
    :width="800" 
    :height="400" 
    :center="[116.3974, 39.9093]"
    :zoom="10"
  />
</template>

<script setup>
import { GislifeMap } from 'map-components'
</script>
```

### 2. 图层管理

```vue
<template>
  <LayerTree 
    :layers="layers"
    @layer-toggle="handleLayerToggle"
  />
</template>

<script setup>
import { LayerTree } from 'map-components'

const layers = ref([
  { id: 1, name: '基础地图', visible: true, type: 'base' },
  { id: 2, name: '行政区划', visible: true, type: 'boundary' }
])

const handleLayerToggle = (layerId, visible) => {
  console.log('图层切换:', layerId, visible)
}
</script>
```

### 3. 地图数据表格

```vue
<template>
  <GislifeTable 
    :data="tableData"
    :columns="tableColumns"
  />
</template>

<script setup>
import { GislifeTable } from 'map-components'

const tableData = ref([
  { id: 1, name: '北京市', population: 21540000, area: 16410 }
])

const tableColumns = ref([
  { title: '城市', dataIndex: 'name', key: 'name' },
  { title: '人口', dataIndex: 'population', key: 'population' }
])
</script>
```

### 4. 地图工具

```vue
<template>
  <GislifeTooBox 
    :tools="toolItems"
    @tool-click="handleToolClick"
  />
</template>

<script setup>
import { GislifeTooBox } from 'map-components'

const toolItems = ref([
  { id: 'measure', name: '测量', icon: '📏' },
  { id: 'draw', name: '绘制', icon: '✏️' }
])

const handleToolClick = (toolId) => {
  console.log('工具点击:', toolId)
}
</script>
```

## 🔧 组件属性

### GislifeMap 属性
- `width` - 地图宽度
- `height` - 地图高度
- `center` - 地图中心点坐标 [经度, 纬度]
- `zoom` - 地图缩放级别

### LayerTree 属性
- `layers` - 图层数据数组
- `@layer-toggle` - 图层切换事件

### GislifeTable 属性
- `data` - 表格数据
- `columns` - 表格列配置

### GislifeLegend 属性
- `items` - 图例项目数组

## 📊 数据格式

### 图层数据格式
```javascript
{
  id: 1,           // 图层ID
  name: '图层名称',  // 图层名称
  visible: true,   // 是否可见
  type: 'base'     // 图层类型
}
```

### 表格数据格式
```javascript
{
  id: 1,           // 数据ID
  name: '北京市',   // 城市名称
  population: 21540000,  // 人口
  area: 16410      // 面积
}
```

### 图例数据格式
```javascript
{
  label: '城市',    // 标签
  color: '#1890ff', // 颜色
  icon: '🏙️'       // 图标
}
```

## 🎯 使用场景

### 地理信息系统 (GIS)
- 地图展示和交互
- 空间数据可视化
- 地理分析工具

### 业务应用
- 位置服务
- 区域管理
- 路径规划
- 数据统计

### 数据展示
- 地理数据表格
- 地图图例
- 图层管理

## ⚠️ 注意事项

1. **坐标系统** - 默认使用 WGS84 坐标系统
2. **地图服务** - 需要配置地图服务提供商
3. **性能优化** - 大数据量时注意性能优化
4. **响应式设计** - 组件支持响应式布局

## 🔗 相关资源

- 地图组件库源码：`Maps-conceil\map\packages\map`
- 组件文档：各组件目录下的 `.md` 文件
- 示例代码：`MapComponentsDemo.vue`

## 🚀 开始使用

1. 查看 `MapComponentsDemo.vue` 了解完整用法
2. 根据需要选择合适的组件
3. 参考组件属性配置
4. 自定义样式和交互

现在您可以在 `First-vue-project` 中自由使用 `Maps-conceil\map` 中的所有地图组件了！
