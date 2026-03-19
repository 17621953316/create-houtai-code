<template>
  <div class="home">
    <div class="hero">
      <h1 class="title">后台管理系统代码生成器</h1>
      <p class="desc">通过 JSON 配置驱动，快速生成 Vue 页面代码</p>
      <el-button type="primary" size="large" @click="goToGenerator">
        <el-icon><Document /></el-icon>
        开始生成
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function goToGenerator() {
  router.push('/generator')
}
</script>

<style scoped>
.home {
  min-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e7ed 100%);
}
.hero {
  text-align: center;
  padding: 48px;
}
.title {
  font-size: 32px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 16px;
}
.desc {
  font-size: 16px;
  color: #606266;
  margin-bottom: 32px;
}
</style>
