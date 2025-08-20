<template>
    <div class="dashboard">
      <!-- 顶部导航栏 -->
      <header class="header">
        <!-- 左侧导航菜单 -->
        <nav class="nav-left">
          <a href="#" class="nav-item" :class="{ active: activeNav === '总览' }" @click="setActiveNav('总览')"><span>总览</span></a>
          <a href="#" class="nav-item" :class="{ active: activeNav === '项目全生命周期' }" @click="setActiveNav('项目全生命周期')"><span>项目全生命周期</span></a>
          <a href="#" class="nav-item" :class="{ active: activeNav === '前期计划管理' }" @click="setActiveNav('前期计划管理')"><span>前期计划管理</span></a>
          <a href="#" class="nav-item" :class="{ active: activeNav === '前期管理' }" @click="setActiveNav('前期管理')"><span>前期管理</span></a>
        </nav>
        
        <!-- 中央标题区域 -->
        <div class="header-center">
          <img src="@/assets/中石油.svg" alt="中石油" class="logo-icon">
          <h1 class="platform-title">规划计划与投资管控平台</h1>
        </div>
        
        <!-- 右侧导航菜单 -->
        <nav class="nav-right">
          <a href="#" class="nav-item" :class="{ active: activeNav === '投资计划管理' }" @click="setActiveNav('投资计划管理')"><span>投资计划管理</span></a>
          <a href="#" class="nav-item" :class="{ active: activeNav === '页岩气驾驶舱' }" @click="setActiveNav('页岩气驾驶舱')"><span>页岩气驾驶舱</span></a>
          <a href="#" class="nav-item" :class="{ active: activeNav === '项目评价管理' }" @click="setActiveNav('项目评价管理')"><span>项目评价管理</span></a>
          <a href="#" class="nav-item" :class="{ active: activeNav === '统计管理' }" @click="setActiveNav('统计管理')"><span>统计管理</span></a>
        </nav>
        
        <!-- 最右侧用户信息 -->
        <div class="user-section">
          <span class="business-system">业务系统</span>
          <div class="user-info">
            <div class="user-avatar">👤</div>
            <span class="username">{{ currentUsername }}</span>
            <div class="logout-icon" @click="handleLogout" title="退出登录">⏻</div>
          </div>
        </div>
      </header>
      
      <!-- 主要内容区域 -->
      <main class="main-content">
        <!-- 计划分布表格页面 -->
        <div v-if="showPlanDistributionTable" class="table-page">
          <PlanDistributionTable 
            :activeTab="planDistributionActiveTab"
            @goBack="goBackToPlanDistribution"
          />
        </div>
        
        <!-- 根据导航选择显示对应内容 -->
        <div v-else-if="activeNav === '总览'">
          <Overview />
        </div>
        
        <div v-else-if="activeNav === '项目全生命周期'">
          <ProjectLifecycle />
        </div>
        
        <div v-else-if="activeNav === '前期计划管理'" class="page-content-prophase">
          <!-- 前期计划管理页面 - 显示所有相关组件 -->
          <ProphasePlan />
          <PlanCount />
          <PlanDistribution @showTableData="showPlanDistributionTableHandler" />
          <ProcessFollow />
          <NewEnergy />
          <PlanRank />
          <Map />
        </div>
        
        <div v-else-if="activeNav === '前期管理'">
          <ProphaseManagement />
        </div>
        
        <div v-else-if="activeNav === '投资计划管理'">
          <InvestmentPlan />
        </div>
        
        <div v-else-if="activeNav === '页岩气驾驶舱'">
          <ShaleGasDashboard />
        </div>
        
        <div v-else-if="activeNav === '项目评价管理'">
          <ProjectEvaluation />
        </div>
        
        <div v-else-if="activeNav === '统计管理'">
          <StatisticsManagement />
        </div>
        
        <!-- 默认显示待开发提示 -->
        <div v-else class="page-content">
          <div class="under-development">
            <h2>页面开发中</h2>
            <p>该功能正在开发中，敬请期待...</p>
          </div>
        </div>
      </main>
    </div>
  </template>
  
  <script setup>
  import { ref, nextTick, onMounted } from 'vue'
import ProphasePlan from './ProphasePlan/prophase-plan.vue'
  import PlanCount from './ProphasePlan/plan-count.vue'
  import PlanDistribution from './ProphasePlan/plan-distribution.vue'
  import PlanDistributionTable from './ProphasePlan/PlanDistributionTable.vue'
  import ProcessFollow from './ProphasePlan/process-follow.vue'
  import NewEnergy from './ProphasePlan/new-energy.vue'
  import PlanRank from './ProphasePlan/plan-rank.vue'
  import Map from './map.vue'
  import Overview from './OverView/Overview.vue'
  import ProjectLifecycle from './LifeCircle/ProjectLifecycle.vue'
  import ProphaseManagement from './ProphaseManagement/ProphaseManagement.vue'
  import InvestmentPlan from './InvestmentPlan/InvestmentPlan.vue'
  import ShaleGasDashboard from './ShaleGasManagement/ShaleGasDashboard.vue'
  import ProjectEvaluation from './ProjectEvaluation/ProjectEvaluation.vue'
  import StatisticsManagement from './StasticsManagement/StatisticsManagement.vue'
  import { message } from 'ant-design-vue'

  const activeNav = ref('前期计划管理') // 默认显示前期计划管理页面
  const currentUsername = ref('')
  
  const setActiveNav = (navItem) => {
    console.log('设置导航状态:', navItem)
    activeNav.value = navItem
    // 确保状态更新
    nextTick(() => {
      console.log('当前激活导航:', activeNav.value)
    })
  }

  // 计划分布表格相关状态
  const showPlanDistributionTable = ref(false)
  const planDistributionActiveTab = ref('production')

  // 显示计划分布表格
  const showPlanDistributionTableHandler = (activeTab) => {
    planDistributionActiveTab.value = activeTab
    showPlanDistributionTable.value = true
  }

  // 返回计划分布页面
  const goBackToPlanDistribution = () => {
    showPlanDistributionTable.value = false
  }

  // 获取当前用户名
  const getCurrentUsername = () => {
    const username = localStorage.getItem('username')
    if (username) {
      currentUsername.value = username
    } else {
      currentUsername.value = '未登录'
      // 如果未登录，可以选择重定向到登录页面
      // 或者显示提示信息
    }
  }

  // 处理注销
  const handleLogout = () => {
    try {
      // 清除本地存储的登录信息
      localStorage.removeItem('isLoggedIn')
      localStorage.removeItem('username')
      localStorage.removeItem('token')
      
      // 显示注销成功消息
      message.success('已退出登录')
      
      // 重新加载页面以返回到登录界面
      window.location.reload()
    } catch (error) {
      message.error('退出登录失败')
    }
  }

  // 组件挂载时获取用户名
  onMounted(() => {
    getCurrentUsername()
  })
  </script>
  
  <style scoped>
  .dashboard {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    font-family: 'Microsoft YaHei', sans-serif;
    background-color: #E5E9FD;
    margin: 0;
    padding: 0;
    overflow: hidden;
  }
  
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 1.04vw;
    height: 7.41vh;
    background: url('@/assets/topbar.png') no-repeat center center;
    background-size: cover;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
  }
  
  .nav-left, .nav-right {
    display: flex;
    align-items: center;
    width: 40%;
    justify-content: center;
  }
  
  .nav-left {
    justify-content: flex-end;
    padding-right: 6.53vw;
  }
  
  .nav-right {
    justify-content: flex-start;
    padding-left: 20.12vw;
  }
  
  .nav-item {
    color: white;
    text-decoration: none;
    padding: 0.74vh 0.625vw;
    margin: 0 0.156vw;
    margin-top: 2.31vh;
    background: #377CFF;
    border: 0.156vw solid #FFFFFF;
    border-radius: 0.208vw;
    font-size: 0.833vw;
    transition: all 0.3s ease;
    white-space: nowrap;
    cursor: pointer;
    position: relative;
  }
  
  .nav-left .nav-item {
    transform: skew(30deg);
  }
  
  .nav-right .nav-item {
    transform: skew(-30deg);
  }
  
  .nav-item:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-1px);
  }
  
  .nav-left .nav-item:hover {
    transform: skew(30deg) translateY(-1px);
  }
  
  .nav-right .nav-item:hover {
    transform: skew(-30deg) translateY(-1px);
  }
  
  .nav-item.active,
  .nav-item.active:hover {
    background: #6DA0FF !important;
    border: 2px solid rgba(255, 255, 255, 0.8) !important;
    font-weight: bold !important;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  .nav-left .nav-item.active,
  .nav-left .nav-item.active:hover {
    transform: skew(30deg) translateY(-2px);
  }
  
  .nav-right .nav-item.active,
  .nav-right .nav-item.active:hover {
    transform: skew(-30deg) translateY(-2px);
  }
  
  .nav-item.active span,
  .nav-item.active:hover span {
    font-weight: bold !important;
  }
  
  .nav-item span {
    display: inline-block;
  }
  
  .nav-left .nav-item span {
    transform: skew(-30deg);
  }
  
  .nav-right .nav-item span {
    transform: skew(30deg);
  }
  
  .header-center {
    display: flex;
    align-items: center;
    gap: 0.781vw;
    position: absolute;
    left: 50%;
    top: 0px;
    transform: translateX(-50%);
    min-width: 20.83vw;
    justify-content: center;
  }
  
  .logo-icon {
    width: 2.083vw;
    height: 3.7vh;
    border-radius: 50%;
    object-fit: contain;
  }
  
  .platform-title {
    color: white;
    font-size: 1.875vw;
    font-weight: bold;
    margin: 0;
  }
  
  .user-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.463vh;
  }
  
  .business-system {
    font-weight: bold;
    color: #2470FF;
    font-size: 0.9375vw;
  }
  
  .user-info {
    display: flex;
    align-items: center;
    gap: 0.417vw;
    color: #2470FF;
    font-size: 0.9375vw;
  }
  
  .username {
    font-weight: bold;
  }

  .user-avatar {
    width: 1.667vw;
    height: 2.963vh;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.833vw;
  }
  
  .logout-icon {
    cursor: pointer;
    font-size: 1.042vw;
    padding: 0.3vh 0.4vw;
    border-radius: 0.3vw;
    transition: all 0.3s ease;
    user-select: none;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 1.5vw;
    min-height: 2.5vh;
  }
  
  .logout-icon:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.05);
    border-color: rgba(255, 255, 255, 0.4);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }
  
  .logout-icon:active {
    transform: scale(0.95);
    background: rgba(255, 255, 255, 0.4);
  }
  
  .main-content {
    padding: 1.85vh 1.042vw;
    height: calc(100vh - 7.41vh);
    overflow-y: auto;
    background-color: #E5E9FD;
    margin-top: 7.41vh;
  }
  
  .page-content {
    padding: 2vh 2vw;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    margin-bottom: 2vh;
  }
  
  .page-content h2 {
    color: #333;
    margin-bottom: 1vh;
    font-size: 1.5vw;
  }
  
  .page-content p {
    color: #666;
    font-size: 1vw;
    line-height: 1.6;
  }
  
  .under-development {
    text-align: center;
    padding: 8vh 4vw;
    color: #999;
  }
  
  .under-development h2 {
    font-size: 2vw;
    margin-bottom: 2vh;
    color: #999;
  }
  
  .under-development p {
    font-size: 1.2vw;
    color: #ccc;
  }

  .table-page {
    width: 100%;
    height: 100vh;
    padding-top: 0;
    overflow: hidden;
  }
  </style> 