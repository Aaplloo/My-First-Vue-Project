# 规划计划与投资管控平台

## 项目概述

这是一个基于Vue 3的规划计划与投资管控平台，专为能源行业设计，包含多个功能模块和交互式地图组件。平台提供全面的计划管理、进度跟踪、统计分析等功能，支持响应式设计和多端适配。

## 主要功能

### 1. 地图组件功能

- **向右展开**: 点击"计划统计"组件中的图表时，地图向右展开，显示设备报警列表
- **向左展开**: 点击"进度跟踪"组件中的卡片时，地图向左展开，覆盖左侧三个组件，在地图下半部分显示设备列表表格

### 2. 核心组件模块

####  ProphasePlan (前期计划管理)

- **new-energy.vue**: 新能源计划管理
- **plan-count.vue**: 计划数量统计
- **plan-distribution.vue**: 计划分布展示
- **plan-rank.vue**: 计划排名管理
- **process-follow.vue**: 进度跟踪（支持地图向左展开）
- **prophase-plan.vue**: 前期计划总览

####  Map (地图组件)

- 支持双向展开交互
- 集成高德地图API
- 设备位置标记和状态显示
- 响应式地图控制

####  其他功能组件

- **Dashboard.vue**: 主控制台
- **InvestmentPlan.vue**: 投资计划管理
- **ProjectLifecycle.vue**: 项目生命周期
- **ProjectEvaluation.vue**: 项目评估
- **ProphaseManagement.vue**: 前期管理
- **ShaleGasDashboard.vue**: 页岩气管理
- **StatisticsManagement.vue**: 统计管理

### 3. 设备列表表格功能

- 筛选功能：所属单位、监测类别、监测对象名称
- 表格列：序号、所属单位、监测类别、监测对象名称、设备名称、设备状态、操作
- 响应式设计，适配不同屏幕尺寸

##  项目结构

```
First-vue-project/
├── public/                          # 静态资源
│   ├── alarm-data.csv              # 报警数据
│   ├── device-data.csv             # 设备数据
│   ├── new-energy-data.csv         # 新能源数据
│   ├── plan-count-data.csv         # 计划数量数据
│   ├── plan-distribution-datas/    # 计划分布数据
│   ├── plan-rank-data.csv          # 计划排名数据
│   ├── process-follow-data.csv     # 进度跟踪数据
│   └── prophase-plan-data.csv      # 前期计划数据
├── src/
│   ├── assets/                     # 资源文件
│   │   ├── base.css               # 基础样式
│   │   ├── main.css               # 主样式
│   │   └── *.svg                  # SVG图标
│   ├── components/                 # 组件目录
│   │   ├── Dashboard.vue          # 主控制台
│   │   ├── map.vue                # 地图组件
│   │   ├── ProphasePlan/          # 前期计划组件
│   │   ├── InvestmentPlan/        # 投资计划组件
│   │   ├── LifeCircle/            # 生命周期组件
│   │   ├── ProjectEvaluation/     # 项目评估组件
│   │   ├── ProphaseManagement/    # 前期管理组件
│   │   ├── ShaleGasManagement/    # 页岩气管理组件
│   │   └── StasticsManagement/    # 统计管理组件
│   ├── config/                     # 配置文件
│   │   └── amap.js                # 高德地图配置
│   ├── App.vue                     # 根组件
│   └── main.js                     # 入口文件
├── package.json                     # 项目依赖
├── vite.config.js                   # Vite配置
└── README.md                        # 项目说明
```

##  技术栈

### 前端框架

- **Vue 3**: 使用Composition API，提供响应式数据绑定
- **Vite**: 快速构建工具，支持热更新
- **CSS3**: 响应式设计，支持vw/vh单位

### 地图服务

- **高德地图API**: 提供地图显示和交互功能
- **自定义地图组件**: 支持双向展开和状态管理

### 数据处理

- **CSV数据源**: 支持实时数据更新和动态加载
- **响应式状态管理**: Vue 3的ref和computed API

### 样式设计

- **响应式布局**: 支持多种屏幕尺寸
- **CSS变量**: 统一的颜色和尺寸管理
- **过渡动画**: 平滑的交互体验

##  安装和运行

### 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0

### 安装步骤

1. 克隆项目
   
   ```bash
   git clone [项目地址]
   cd First-vue-project
   ```

2. 安装依赖
   
   ```bash
   npm install
   ```

3. 启动开发服务器
   
   ```bash
   npm run dev
   ```

4. 构建生产版本
   
   ```bash
   npm run build
   ```

5. 预览生产版本
   
   ```bash
   npm run preview
   ```

##  开发指南

### 组件开发规范

- 使用Vue 3 Composition API
- 组件命名采用PascalCase
- 样式使用scoped作用域
- 响应式数据使用ref和computed

### 地图交互开发

- 地图展开状态通过事件驱动
- 使用CustomEvent进行组件间通信
- 地图位置和尺寸通过CSS变量控制

### 数据处理

- CSV数据通过fetch API加载
- 支持实时数据更新（30秒间隔）
- 数据变化检测和状态同步

### 样式开发

- 使用vw/vh单位确保响应式
- 颜色和尺寸通过CSS变量管理
- 支持深色/浅色主题切换

## 使用说明

### 基本操作

1. **地图向右展开**: 点击"计划统计"组件中的图表
2. **地图向左展开**: 点击"进度跟踪"组件中的任意卡片
3. **地图恢复正常**: 点击地图右上角的关闭按钮

### 数据筛选

- 使用筛选器快速定位数据
- 支持多条件组合筛选
- 实时更新筛选结果

### 响应式适配

- 自动适配不同屏幕尺寸
- 支持触摸设备操作
- 优化移动端体验

## 功能特性

### 实时数据更新

- 自动检测CSV数据变化
- 支持热更新和实时同步
- 数据加载失败时的降级处理

### 交互式地图

- 双向展开支持
- 设备状态实时显示
- 平滑的过渡动画

### 多维度分析

- 计划完成进度跟踪
- 投资计划统计分析
- 项目生命周期管理

## 注意事项

### 地图展开逻辑

- 向左展开会覆盖左侧三个组件
- 保持原有的向右展开逻辑不变
- 所有展开状态都有平滑的过渡动画

### 数据加载

- 确保CSV文件路径正确
- 网络异常时有默认数据备用
- 支持离线模式运行

### 性能优化

- 使用Vue 3的响应式系统
- 避免不必要的重复渲染
- 合理使用计算属性和缓存

## 更新日志

### v1.0.2 (当前版本)

- ✅ 基础功能模块完成
- ✅ 地图双向展开功能
- ✅ 响应式设计支持
- ✅ CSV数据集成
- ✅ 进度跟踪流程图

## 贡献指南

欢迎提交Issue和Pull Request来改进项目！

### 提交规范

- 使用清晰的提交信息
- 遵循现有的代码风格
- 添加必要的测试用例

## 许可证

本项目采用MIT许可证，详见LICENSE文件。

## 联系方式

如有问题或建议，请通过以下方式联系：

- 提交GitHub Issue
- 发送邮件至：[OpAaplloo@gmail.com]

---
