<script setup lang="ts">
// 自动导入，RouterLink 可以直接使用
import { useRoute } from 'vue-router';

// 模拟外部链接
const links = {
  learn: [
    { name: '竹笛基础教程', to: '#' },
    { name: '指法技巧进阶', to: '#' },
    { name: '气韵练习', to: '#' },
    { name: '名家访谈', to: '#' },
  ],
  support: [
    { name: '联系我们', to: '/about' },
    { name: '常见问题 (FAQ)', to: '#' },
    { name: '免责声明', to: '#' },
    { name: '隐私政策', to: '#' },
  ],
};

const currentYear = new Date().getFullYear();
</script>

<template>
  <footer class="bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
    <div class="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-10">
      <div class="grid grid-cols-2 gap-8 lg:grid-cols-4">
        
        <div class="col-span-2 lg:col-span-1">
          <RouterLink to="/" class="flex items-center text-xl font-bold text-gray-900 dark:text-white mb-4">
            <span class="text-green-600 dark:text-green-400 mr-2 i-carbon-music text-2xl" />
            <span class="text-green-600">竹笛曲谱网</span>
          </RouterLink>
          <p class="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
            致力于为全球竹笛爱好者提供专业、高清、免费的乐谱和学习资源。
          </p>
          
          <div class="flex space-x-4 mt-4">
            <a href="#" class="text-gray-400 hover:text-green-600 transition duration-150">
              <div class="i-carbon-logo-github text-xl" />
            </a>
            <a href="#" class="text-gray-400 hover:text-green-600 transition duration-150">
              <div class="i-carbon-logo-wechat text-xl" />
            </a>
            <a href="#" class="text-gray-400 hover:text-green-600 transition duration-150">
              <div class="i-carbon-email text-xl" />
            </a>
          </div>
        </div>

        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">学习资源</h3>
          <ul class="space-y-3">
            <li v-for="link in links.learn" :key="link.name">
              <RouterLink :to="link.to" class="text-sm text-gray-600 dark:text-gray-400 hover:text-green-600 transition duration-150">
                {{ link.name }}
              </RouterLink>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">帮助与支持</h3>
          <ul class="space-y-3">
            <li v-for="link in links.support" :key="link.name">
              <RouterLink :to="link.to" class="text-sm text-gray-600 dark:text-gray-400 hover:text-green-600 transition duration-150">
                {{ link.name }}
              </RouterLink>
            </li>
          </ul>
        </div>

        <div class="col-span-2 lg:col-span-1">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">加入我们</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
                订阅我们的邮件，获取最新的曲谱更新和竹笛学习干货。
            </p>
            <form class="flex">
                <input type="email" placeholder="输入您的邮箱" 
                       class="p-2 border border-gray-300 dark:border-gray-600 rounded-l-lg w-full text-gray-900 dark:bg-gray-700 dark:text-white focus:ring-green-500 focus:border-green-500"
                />
                <button type="submit" 
                        class="p-2 bg-green-600 text-white rounded-r-lg hover:bg-green-700 transition duration-150"
                >
                    订阅
                </button>
            </form>
        </div>
        
      </div>

      <div class="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
        <p class="text-sm text-gray-500 dark:text-gray-400">
          © {{ currentYear }} 竹笛曲谱网. All rights reserved. |
          <span class="text-green-600">为爱笛者而生。</span>
        </p>
      </div>
    </div>
  </footer>
</template>