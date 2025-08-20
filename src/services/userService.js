// 用户数据存储管理
const STORAGE_KEY = 'app_users'

// 从localStorage获取用户数据
const getUsersFromStorage = () => {
  try {
    const storedUsers = localStorage.getItem(STORAGE_KEY)
    if (storedUsers) {
      return JSON.parse(storedUsers)
    }
  } catch (error) {
    console.error('读取用户数据失败:', error)
  }
  
  // 如果没有存储的数据，返回默认管理员账户
  return [
    {
      id: 1,
      username: 'admin',
      password: 'admin',
      email: 'admin@example.com',
      role: 'admin'
    }
  ]
}

// 保存用户数据到localStorage
const saveUsersToStorage = (users) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users))
  } catch (error) {
    console.error('保存用户数据失败:', error)
    throw new Error('保存用户数据失败')
  }
}

// 模拟API延迟
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const userService = {
  // 用户登录
  async login(username, password) {
    await delay(1000) // 模拟网络请求
    
    const users = getUsersFromStorage()
    const user = users.find(u => u.username === username && u.password === password)
    
    if (user) {
      const { password: _, ...userWithoutPassword } = user
      return {
        success: true,
        user: userWithoutPassword,
        token: `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      }
    } else {
      throw new Error('用户名或密码错误')
    }
  },

  // 用户注册
  async register(userData) {
    await delay(1000) // 模拟网络请求
    
    const users = getUsersFromStorage()
    
    // 检查用户名是否已存在
    const existingUser = users.find(u => u.username === userData.username)
    if (existingUser) {
      throw new Error('用户名已存在')
    }

    // 检查邮箱是否已存在
    const existingEmail = users.find(u => u.email === userData.email)
    if (existingEmail) {
      throw new Error('邮箱已被注册')
    }

    // 创建新用户
    const newUser = {
      id: users.length + 1,
      username: userData.username,
      password: userData.password,
      email: userData.email,
      role: 'user',
      createdAt: new Date().toISOString()
    }

    // 添加新用户到数组
    users.push(newUser)
    
    // 保存到localStorage
    saveUsersToStorage(users)
    
    return {
      success: true,
      message: '注册成功'
    }
  },

  // 获取用户信息
  async getUserInfo(token) {
    await delay(500) // 模拟网络请求
    
    // 这里应该验证token并返回用户信息
    // 为了演示，我们从localStorage获取用户信息
    const users = getUsersFromStorage()
    const user = users.find(u => u.username === localStorage.getItem('username'))
    
    if (user) {
      const { password: _, ...userWithoutPassword } = user
      return {
        success: true,
        user: userWithoutPassword
      }
    } else {
      // 如果没有找到用户，返回默认管理员信息
      return {
        success: true,
        user: {
          id: 1,
          username: 'admin',
          email: 'admin@example.com',
          role: 'admin'
        }
      }
    }
  },

  // 退出登录
  async logout(token) {
    await delay(500) // 模拟网络请求
    
    return {
      success: true,
      message: '退出成功'
    }
  },

  // 获取所有用户（用于调试）
  getAllUsers() {
    return getUsersFromStorage()
  },

  // 清除所有用户数据（用于重置）
  clearAllUsers() {
    try {
      localStorage.removeItem(STORAGE_KEY)
      return {
        success: true,
        message: '所有用户数据已清除'
      }
    } catch (error) {
      throw new Error('清除用户数据失败')
    }
  }
}
