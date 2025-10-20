// src/composables/useUser.ts

import { ref } from 'vue';

// 模拟用户数据和登录状态
interface User {
  username: string;
  email: string;
}

// 使用 ref 存储登录状态，并确保全局唯一性
// 理论上，这些状态应该持久化（例如使用 localStorage），但这里我们只做内存模拟
const isAuthenticated = ref(false);
const currentUser = ref<User | null>(null);

/**
 * 模拟用户认证相关的操作和状态管理
 * @returns {object} 包含状态和方法的对象
 */
export function useUser() {
  
  /**
   * 模拟登录操作
   * @param username - 用户名
   * @param password - 密码
   * @returns {boolean} 登录是否成功
   */
  const login = (username: string, password: string): boolean => {
    // ⚠️ 实际项目中，这里会是 API 调用和密码验证
    
    // 模拟成功：只要不是 'error' 密码，就认为是成功
    if (password === 'error') {
      return false; 
    }
    
    // 设置状态
    isAuthenticated.value = true;
    currentUser.value = {
      username: username,
      email: `${username}@music.com`
    };
    
    console.log(`用户 ${username} 模拟登录成功。`);
    return true;
  };

  /**
   * 模拟登出操作
   */
  const logout = () => {
    isAuthenticated.value = false;
    currentUser.value = null;
    console.log('用户已登出。');
  };
  
  // 暴露状态和方法
  return {
    isAuthenticated,
    currentUser,
    login,
    logout,
  };
}