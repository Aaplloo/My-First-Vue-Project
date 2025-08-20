// 高德地图配置
export const AMAP_CONFIG = {
  // 请替换为您的高德地图API密钥
  API_KEY: '17481e7ffaf090dffb961647e01d03f6',
  
  // 地图中心点坐标（绵阳市中心）
  CENTER: [104.681, 31.467],
  
  // 默认缩放级别
  DEFAULT_ZOOM: 11,
  
  // 地图样式
  MAP_STYLE: 'amap://styles/normal',
  
  // 视图模式
  VIEW_MODE: '3D',
  
  // 插件列表
  PLUGINS: [
    'AMap.Scale',
    'AMap.ToolBar', 
    'AMap.HawkEye',
    'AMap.MapType',
    'AMap.Geolocation'
  ]
}
