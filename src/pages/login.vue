<script setup lang="ts">
import { ref } from 'vue';
// useUser 会被自动导入
// import { useUser } from '@/composables/useUser'; 
import { useRouter } from 'vue-router'; // 自动导入

const { isAuthenticated, currentUser, login, logout } = useUser();
const router = useRouter();

// 表单状态
const username = ref('');
const password = ref('');
const loginError = ref('');

/**
 * 处理登录逻辑
 */
const handleLogin = () => {
  loginError.value = ''; // 清除之前的错误信息
  
  if (!username.value || !password.value) {
      loginError.value = '用户名和密码不能为空。';
      return;
  }
  
  const success = login(username.value, password.value);
  
  if (success) {
    // 登录成功后跳转回首页或曲谱列表页
    alert('登录成功！欢迎回来。');
    router.push('/scores');
  } else {
    loginError.value = '登录失败：模拟密码验证失败。';
  }
};

/**
 * 处理登出逻辑（如果用户已经登录）
 */
const handleLogout = () => {
    logout();
    alert('已安全登出。');
    router.push('/');
};

</script>

<template>
  <div class="p-8 max-w-sm mx-auto min-h-full flex flex-col justify-center">

    <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white mb-8 text-center">
      {{ isAuthenticated ? '用户中心' : '登录 / 注册' }}
    </h1>
    
    <div v-if="isAuthenticated" class="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl text-center">
        <div class="i-carbon-user-avatar-filled text-6xl text-green-600 mb-4 mx-auto" />
        <p class="text-xl font-semibold dark:text-white mb-2">
            欢迎您，{{ currentUser?.username }}
        </p>
        <p class="text-gray-500 dark:text-gray-400 mb-6">
            {{ currentUser?.email }}
        </p>
        
        <RouterLink to="/scores" class="block w-full text-green-600 hover:underline mb-4">
            进入高清曲谱库
        </RouterLink>
        
        <button 
            @click="handleLogout" 
            class="w-full py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-150"
        >
            安全登出
        </button>
    </div>

    <form v-else @submit.prevent="handleLogin" class="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl space-y-6">
      
      <div v-if="loginError" class="p-3 bg-red-100 dark:bg-red-900/50 border border-red-300 rounded text-red-700 dark:text-red-300">
        {{ loginError }}
      </div>

      <div>
        <label for="username" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">用户名</label>
        <input 
          id="username" 
          type="text" 
          v-model="username"
          placeholder="请输入用户名" 
          required
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      <div>
        <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">密码</label>
        <input 
          id="password" 
          type="password" 
          v-model="password"
          placeholder="请输入密码" 
          required
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      <button 
        type="submit" 
        class="w-full py-3 text-white bg-green-600 rounded-lg font-semibold hover:bg-green-700 transition duration-150 shadow-md"
      >
        <div class="i-carbon-login inline-block mr-2" />
        登录账户
      </button>
      
      <p class="text-center text-sm text-gray-500 dark:text-gray-400 pt-2">
        还没有账户？<a href="#" class="text-green-600 hover:underline">立即注册</a> (模拟)
      </p>
    </form>
    
  </div>
</template>