<script setup lang="ts">
// 引入 ref, computed, useRoute 等不再需要，全部移除。
// 我们只需要获取当前的年份用于版权信息
const currentYear = new Date().getFullYear();
</script>

<template>
    <footer class="mt-auto py-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <div class="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500 dark:text-gray-400">
            &copy; {{ currentYear }} 乐器曲谱平台. All rights reserved.
        </div>
    </footer>
</template>

<style scoped>
/* 保持样式简洁，确保页脚始终在底部 */
footer {
    /* min-h-[4rem] 确保页脚有一定的可见高度 */
    min-height: 4rem; 
}
</style>