<template>
  <div class="home">
    <div class="mesh" aria-hidden="true" />
    <div class="hero">
      <span class="kicker">Vue · Element Plus · 配置驱动</span>
      <h1 class="title">后台管理系统代码生成器</h1>
      <p class="desc">用结构化配置快速生成列表页：搜索区、表格、分页与接口占位一次到位。</p>
      <div class="cta-row">
        <el-button type="primary" size="large" class="cta-primary" round @click="goToGenerator">
          <el-icon><Document /></el-icon>
          进入工作台
        </el-button>
        <span class="cta-hint">支持模板一键套用与实时预览</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { Document } from '@element-plus/icons-vue'

const router = useRouter()

function goToGenerator() {
  router.push('/generator')
}
</script>

<style scoped>
.home {
  min-height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 20px;
  font-family: 'Outfit', 'Noto Sans SC', system-ui, sans-serif;
  background: #f8fafc;
  overflow: hidden;
}

.mesh {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image:
    radial-gradient(900px 480px at 10% -20%, rgba(13, 148, 136, 0.2), transparent 55%),
    radial-gradient(720px 420px at 95% 10%, rgba(234, 88, 12, 0.14), transparent 52%),
    radial-gradient(640px 400px at 50% 110%, rgba(99, 102, 241, 0.12), transparent 55%);
}

.hero {
  position: relative;
  text-align: center;
  max-width: 520px;
  padding: 40px 28px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.78);
  border: 1px solid rgba(15, 23, 42, 0.08);
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.1);
  backdrop-filter: blur(14px);
}

.kicker {
  display: inline-block;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #0d9488;
  margin-bottom: 12px;
}

.title {
  font-size: clamp(1.75rem, 4vw, 2.25rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.2;
  background: linear-gradient(105deg, #0f766e 0%, #0d9488 45%, #0891b2 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin-bottom: 14px;
}

.desc {
  font-size: 0.9375rem;
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 28px;
}

.cta-row {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.cta-primary {
  padding: 12px 28px;
  font-weight: 600;
  background: linear-gradient(135deg, #0f766e, #14b8a6) !important;
  border: none !important;
  box-shadow: 0 14px 36px rgba(13, 148, 136, 0.35);
}

.cta-hint {
  font-size: 0.8125rem;
  color: #94a3b8;
}
</style>
