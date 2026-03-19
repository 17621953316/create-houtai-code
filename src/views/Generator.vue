<template>
  <div class="generator">
    <header class="header">
      <h1 class="title">Vue 后台页面代码生成器</h1>
      <div class="actions">
        <el-button @click="$router.push('/')">返回首页</el-button>
        <el-button type="primary" @click="generateCode" :icon="Document">生成代码</el-button>
        <el-button
          v-if="generatedCode"
          type="success"
          @click="copyCode"
          :icon="CopyDocument"
        >
          复制代码
        </el-button>
        <el-button
          v-if="generatedCode"
          @click="downloadCode"
          :icon="Download"
        >
          下载 .vue
        </el-button>
      </div>
    </header>
    <main class="content">
      <div class="left-panel">
        <el-card shadow="never" class="config-card">
          <template #header>
            <span>基础配置</span>
          </template>
          <el-form label-width="80px" size="default">
            <el-form-item label="页面名称">
              <el-input v-model="config.pageName" placeholder="如：用户管理" />
            </el-form-item>
            <el-form-item label="列表接口">
              <el-input v-model="config.api.list" placeholder="/api/users" />
            </el-form-item>
          </el-form>
        </el-card>
        <el-card shadow="never" class="config-card">
          <SearchFieldConfig v-model="config.searchFields" />
        </el-card>
      </div>
      <div class="right-panel">
        <el-card shadow="never" class="code-card">
          <template #header>
            <div class="code-header">
              <span>生成代码</span>
              <el-tag v-if="generatedCode" type="success" size="small">已生成</el-tag>
            </div>
          </template>
          <div v-if="generatedCode" class="code-block">
            <pre><code>{{ generatedCode }}</code></pre>
          </div>
          <el-empty v-else description="配置筛选项后点击「生成代码」" :image-size="80" />
        </el-card>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Document, CopyDocument, Download } from '@element-plus/icons-vue'
import SearchFieldConfig from '@/components/SearchFieldConfig.vue'
import { defaultConfig } from '@/config/defaultConfig'
import { generatePageCode } from '@/generator'

const config = reactive({
  pageName: defaultConfig.pageName,
  api: { ...defaultConfig.api },
  searchFields: []
})

const generatedCode = ref('')

onMounted(() => {
  config.searchFields = (defaultConfig.searchFields || []).map((f, i) => ({
    ...JSON.parse(JSON.stringify(f)),
    _id: f._id || `sf_${Date.now()}_${i}`
  }))
})

function generateCode() {
  try {
    const code = generatePageCode(config)
    generatedCode.value = code
    ElMessage.success('代码生成成功')
  } catch (err) {
    ElMessage.error('生成失败：' + (err.message || String(err)))
    console.error(err)
  }
}

async function copyCode() {
  if (!generatedCode.value) return
  try {
    await navigator.clipboard.writeText(generatedCode.value)
    ElMessage.success('已复制到剪贴板')
  } catch {
    ElMessage.error('复制失败')
  }
}

function downloadCode() {
  if (!generatedCode.value) return
  const base = (config.pageName || 'page').replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_').slice(0, 30) || 'page'
  const filename = `${base}_${Date.now()}.vue`
  const blob = new Blob([generatedCode.value], { type: 'text/vue' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
  ElMessage.success('文件已下载')
}
</script>

<style scoped>
.generator {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f7fa;
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  background: #fff;
  border-bottom: 1px solid #e4e7ed;
}
.title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}
.content {
  flex: 1;
  display: flex;
  gap: 16px;
  padding: 16px;
  overflow: hidden;
}
.left-panel {
  flex: 0 0 480px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.right-panel {
  flex: 1;
  min-width: 0;
  overflow: hidden;
}
.config-card {
  flex-shrink: 0;
}
.code-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.code-header {
  display: flex;
  align-items: center;
  gap: 8px;
}
.code-card :deep(.el-card__body) {
  flex: 1;
  overflow: auto;
}
.code-block {
  background: #1e1e1e;
  border-radius: 8px;
  padding: 16px;
  overflow: auto;
}
.code-block pre {
  margin: 0;
  font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
  font-size: 13px;
  line-height: 1.5;
  color: #d4d4d4;
}
.code-block code {
  white-space: pre;
}
</style>
