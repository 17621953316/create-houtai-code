<template>
  <div class="generator">
    <header class="header">
      <div class="header-brand">
        <span class="logo-dot" aria-hidden="true" />
        <div class="header-titles">
          <h1 class="title">Vue 后台页面代码生成器</h1>
          <p class="subtitle">配置驱动 · 实时预览 · 一键导出</p>
        </div>
      </div>
      <div class="actions">
        <el-button @click="$router.push('/')" round>返回首页</el-button>
        <el-button type="primary" @click="generateCode" :icon="Document" round>生成代码</el-button>
        <el-button @click="showPreview = !showPreview" :icon="View" :type="showPreview ? 'warning' : 'default'" round>
          {{ showPreview ? '返回代码' : '一键预览' }}
        </el-button>
        <el-button
          v-if="generatedCode"
          type="success"
          @click="copyCode"
          :icon="CopyDocument"
          round
        >
          复制代码
        </el-button>
        <el-button
          v-if="generatedCode"
          @click="downloadCode"
          :icon="Download"
          round
        >
          下载 .vue
        </el-button>
      </div>
    </header>
    <main class="content">
      <aside v-show="!leftCollapsed" class="left-panel">
        <el-card shadow="never" class="shell-card template-card">
          <div class="template-head">
            <div>
              <span class="section-kicker">快速开始</span>
              <h2 class="section-title">模板库</h2>
              <p class="section-desc">选中即可覆盖当前配置，可随时再改</p>
            </div>
            <el-tag v-if="selectedTemplateId" size="small" effect="dark" class="template-tag">
              {{ currentTemplateName }}
            </el-tag>
          </div>
          <div class="template-chips" role="list">
            <button
              v-for="t in pageTemplates"
              :key="t.id"
              type="button"
              class="template-chip"
              :class="{ active: selectedTemplateId === t.id, [`accent-${t.accent || 'teal'}`]: true }"
              @click="applyTemplate(t.id)"
            >
              <span class="chip-name">{{ t.name }}</span>
              <span v-if="t.tag" class="chip-tag">{{ t.tag }}</span>
            </button>
          </div>
          <p class="template-hint">{{ currentTemplateDescription }}</p>
        </el-card>

        <div class="workspace-toolbar">
          <span class="workspace-label">配置工作台</span>
          <div class="workspace-toolbar-actions">
            <el-button link type="primary" @click="expandAllPanels">全部展开</el-button>
            <el-button link @click="collapseAllPanels">全部收起</el-button>
          </div>
        </div>

        <el-collapse v-model="activePanels" class="config-collapse">
          <el-collapse-item name="basic">
            <template #title>
              <span class="collapse-title">
                <span class="collapse-icon basic" />
                基础配置
              </span>
            </template>
            <el-card shadow="never" class="inner-card">
              <el-form label-width="88px" size="default">
                <el-form-item label="页面名称">
                  <el-input v-model="config.pageName" placeholder="如：用户管理" clearable />
                </el-form-item>
                <el-form-item label="列表接口">
                  <el-input v-model="config.api.list" placeholder="/api/users" clearable />
                </el-form-item>
              </el-form>
            </el-card>
          </el-collapse-item>

          <el-collapse-item name="table">
            <template #title>
              <span class="collapse-title">
                <span class="collapse-icon table" />
                表格配置
              </span>
            </template>
            <el-card shadow="never" class="inner-card inner-card--flush">
              <TableConfig v-model="config.table" />
            </el-card>
          </el-collapse-item>

          <el-collapse-item name="search">
            <template #title>
              <span class="collapse-title">
                <span class="collapse-icon search" />
                筛选项配置
              </span>
            </template>
            <el-card shadow="never" class="inner-card inner-card--flush">
              <SearchFieldConfig v-model="config.searchFields" />
            </el-card>
          </el-collapse-item>
        </el-collapse>
      </aside>

      <button
        type="button"
        class="rail-toggle"
        :class="{ collapsed: leftCollapsed }"
        :title="leftCollapsed ? '展开配置' : '收起配置'"
        @click="leftCollapsed = !leftCollapsed"
      >
        <el-icon><component :is="leftCollapsed ? Expand : Fold" /></el-icon>
      </button>

      <div class="right-panel">
        <el-card v-if="showPreview" shadow="never" class="code-card preview-card shell-card">
          <template #header>
            <div class="code-header">
              <span class="code-title">页面预览</span>
              <el-tag type="warning" size="small" effect="plain" round>实时</el-tag>
            </div>
          </template>
          <PagePreview :config="config" />
        </el-card>
        <el-card v-else shadow="never" class="code-card shell-card">
          <template #header>
            <div class="code-header">
              <span class="code-title">生成代码</span>
              <el-tag v-if="generatedCode" type="success" size="small" effect="plain" round>已生成</el-tag>
            </div>
          </template>
          <div v-if="generatedCode" class="code-block">
            <pre><code>{{ generatedCode }}</code></pre>
          </div>
          <el-empty v-else description="选择模板或配置筛选项后点击「生成代码」" :image-size="88" />
        </el-card>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Document, CopyDocument, Download, View, Fold, Expand } from '@element-plus/icons-vue'
import SearchFieldConfig from '@/components/SearchFieldConfig.vue'
import TableConfig from '@/components/TableConfig.vue'
import PagePreview from '@/components/PagePreview.vue'
import { defaultConfig } from '@/config/defaultConfig'
import { pageTemplates, buildConfigFromTemplate, getTemplateById } from '@/config/templates'
import { generatePageCode } from '@/generator'

const UI_STORAGE_KEY = 'ai-create-houtai:generator-ui'
const PANEL_NAMES = ['basic', 'table', 'search']

function normalizeActivePanels(arr) {
  if (!Array.isArray(arr)) return ['basic']
  const next = arr.filter((p) => PANEL_NAMES.includes(p))
  return next.length ? next : ['basic']
}

function loadUiState() {
  try {
    const raw = localStorage.getItem(UI_STORAGE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    const templateId =
      typeof data.templateId === 'string' && getTemplateById(data.templateId)
        ? data.templateId
        : null
    return {
      templateId,
      leftCollapsed: !!data.leftCollapsed,
      activePanels: normalizeActivePanels(data.activePanels)
    }
  } catch {
    return null
  }
}

function saveUiState() {
  try {
    localStorage.setItem(
      UI_STORAGE_KEY,
      JSON.stringify({
        templateId: selectedTemplateId.value,
        leftCollapsed: leftCollapsed.value,
        activePanels: activePanels.value
      })
    )
  } catch {
    /* ignore quota / private mode */
  }
}

const config = reactive({
  pageName: defaultConfig.pageName,
  api: { ...defaultConfig.api },
  table: JSON.parse(JSON.stringify(defaultConfig.table)),
  searchFields: []
})

const generatedCode = ref('')
const showPreview = ref(false)
const leftCollapsed = ref(false)
const activePanels = ref(['basic'])
const selectedTemplateId = ref('user-list')

const currentTemplateMeta = computed(() => getTemplateById(selectedTemplateId.value))
const currentTemplateName = computed(() => currentTemplateMeta.value?.name || '')
const currentTemplateDescription = computed(
  () => currentTemplateMeta.value?.description || '从上方选择一个模板快速开始'
)

onMounted(() => {
  const saved = loadUiState()
  if (saved) {
    leftCollapsed.value = saved.leftCollapsed
    activePanels.value = [...saved.activePanels]
  }
  const id = saved?.templateId || 'user-list'
  applyTemplate(id, { confirmDialog: false, silent: true })
  saveUiState()
})

watch([selectedTemplateId, leftCollapsed, activePanels], saveUiState, { deep: true })

function patchConfigFromBuilt(built) {
  config.pageName = built.pageName
  config.api = { ...built.api }
  config.table = built.table
  config.searchFields = built.searchFields
}

/**
 * @param {string} id
 * @param {{ confirmDialog?: boolean, silent?: boolean }} [options]
 */
function applyTemplate(id, options = {}) {
  const { confirmDialog = true, silent = false } = options
  const built = buildConfigFromTemplate(id)
  if (!built) {
    ElMessage.warning('未找到该模板')
    return
  }
  const doApply = () => {
    patchConfigFromBuilt(built)
    selectedTemplateId.value = id
    if (!silent) {
      ElMessage.success(`已应用「${getTemplateById(id)?.name || id}」`)
    }
  }
  if (!confirmDialog) {
    doApply()
    return
  }
  ElMessageBox.confirm('将用模板覆盖当前页面名、接口、表格与筛选项，是否继续？', '套用模板', {
    confirmButtonText: '覆盖并应用',
    cancelButtonText: '取消',
    type: 'warning',
    roundButton: true
  })
    .then(doApply)
    .catch(() => {})
}

function expandAllPanels() {
  activePanels.value = ['basic', 'table', 'search']
}

function collapseAllPanels() {
  activePanels.value = []
}

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
  --gen-font: 'Outfit', 'Noto Sans SC', system-ui, sans-serif;
  --gen-bg-1: #f0fdfa;
  --gen-bg-2: #fff7ed;
  --gen-bg-3: #eef2ff;
  --gen-ink: #0f172a;
  --gen-muted: #64748b;
  --gen-card: rgba(255, 255, 255, 0.82);
  --gen-card-border: rgba(15, 23, 42, 0.08);
  --gen-teal: #0d9488;
  --gen-teal-soft: rgba(13, 148, 136, 0.12);
  --gen-coral: #ea580c;
  --gen-shadow: 0 18px 50px rgba(15, 23, 42, 0.08);

  height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: var(--gen-font);
  color: var(--gen-ink);
  background-color: #f8fafc;
  background-image:
    radial-gradient(900px 420px at 12% -10%, rgba(13, 148, 136, 0.18), transparent 55%),
    radial-gradient(700px 380px at 92% 0%, rgba(234, 88, 12, 0.12), transparent 50%),
    radial-gradient(600px 400px at 50% 100%, rgba(99, 102, 241, 0.1), transparent 55%);
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 22px;
  background: var(--gen-card);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--gen-card-border);
  box-shadow: var(--gen-shadow);
}

.header-brand {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
}

.logo-dot {
  width: 12px;
  height: 12px;
  border-radius: 4px;
  background: linear-gradient(135deg, var(--gen-teal), #22d3ee);
  box-shadow: 0 0 0 6px var(--gen-teal-soft);
  flex-shrink: 0;
}

.header-titles {
  min-width: 0;
}

.title {
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.25;
  background: linear-gradient(105deg, #0f766e 0%, #0d9488 40%, #0891b2 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.subtitle {
  margin-top: 4px;
  font-size: 0.8125rem;
  color: var(--gen-muted);
  font-weight: 500;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
}

.content {
  flex: 1;
  display: flex;
  gap: 0;
  padding: 16px 16px 16px 0;
  overflow: hidden;
  position: relative;
}

.left-panel {
  flex: 0 0 min(440px, 38vw);
  max-width: 520px;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-left: 16px;
  padding-right: 8px;
  scrollbar-gutter: stable;
}

.shell-card {
  border-radius: 16px !important;
  border: 1px solid var(--gen-card-border) !important;
  background: var(--gen-card) !important;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 24px rgba(15, 23, 42, 0.06) !important;
}

.shell-card :deep(.el-card__header) {
  border-bottom: 1px solid var(--gen-card-border);
  padding: 14px 18px;
}

.template-card :deep(.el-card__body) {
  padding: 16px 18px 18px;
}

.template-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.section-kicker {
  display: block;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--gen-teal);
  margin-bottom: 4px;
}

.section-title {
  font-size: 1.0625rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.section-desc {
  margin-top: 4px;
  font-size: 0.8125rem;
  color: var(--gen-muted);
  line-height: 1.45;
}

.template-tag {
  flex-shrink: 0;
  border: none;
  background: linear-gradient(135deg, #0d9488, #14b8a6) !important;
}

.template-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.template-chip {
  appearance: none;
  border: 1px solid var(--gen-card-border);
  background: rgba(255, 255, 255, 0.65);
  border-radius: 999px;
  padding: 8px 14px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: inherit;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--gen-ink);
  transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
}

.template-chip:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.08);
}

.template-chip.active {
  border-color: transparent;
  color: #fff;
  box-shadow: 0 10px 28px rgba(13, 148, 136, 0.35);
}

.template-chip.accent-teal.active {
  background: linear-gradient(135deg, #0f766e, #14b8a6);
}

.template-chip.accent-coral.active {
  background: linear-gradient(135deg, #c2410c, #fb923c);
  box-shadow: 0 10px 28px rgba(234, 88, 12, 0.35);
}

.template-chip.accent-violet.active {
  background: linear-gradient(135deg, #5b21b6, #8b5cf6);
  box-shadow: 0 10px 28px rgba(91, 33, 182, 0.35);
}

.template-chip.accent-slate.active {
  background: linear-gradient(135deg, #334155, #64748b);
  box-shadow: 0 10px 28px rgba(51, 65, 85, 0.35);
}

.template-chip.accent-neutral.active {
  background: linear-gradient(135deg, #475569, #94a3b8);
  box-shadow: 0 10px 28px rgba(71, 85, 105, 0.3);
}

.chip-tag {
  font-size: 0.625rem;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 6px;
  background: rgba(15, 23, 42, 0.06);
  color: var(--gen-muted);
}

.template-chip.active .chip-tag {
  background: rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.95);
}

.template-hint {
  margin-top: 12px;
  font-size: 0.75rem;
  color: var(--gen-muted);
  line-height: 1.5;
}

.workspace-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 4px 4px 0 6px;
}

.workspace-label {
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--gen-ink);
  letter-spacing: -0.01em;
}

.workspace-toolbar-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.config-collapse {
  border: none;
  --el-collapse-header-height: 48px;
}

.config-collapse :deep(.el-collapse-item) {
  margin-bottom: 10px;
  border-radius: 14px;
  border: 1px solid var(--gen-card-border);
  background: var(--gen-card);
  backdrop-filter: blur(10px);
  overflow: hidden;
  box-shadow: 0 4px 18px rgba(15, 23, 42, 0.05);
}

.config-collapse :deep(.el-collapse-item__header) {
  font-family: var(--gen-font);
  font-weight: 600;
  padding: 0 16px;
  background: transparent;
  border: none;
}

.config-collapse :deep(.el-collapse-item__wrap) {
  border: none;
  background: transparent;
}

.config-collapse :deep(.el-collapse-item__content) {
  padding: 0 12px 12px;
}

.collapse-title {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.collapse-icon {
  width: 8px;
  height: 8px;
  border-radius: 3px;
  flex-shrink: 0;
}

.collapse-icon.basic {
  background: linear-gradient(135deg, #14b8a6, #22d3ee);
}

.collapse-icon.table {
  background: linear-gradient(135deg, #f97316, #fbbf24);
}

.collapse-icon.search {
  background: linear-gradient(135deg, #6366f1, #a855f7);
}

.inner-card {
  border-radius: 12px !important;
  border: 1px solid rgba(15, 23, 42, 0.06) !important;
  background: rgba(255, 255, 255, 0.72) !important;
  box-shadow: none !important;
}

.inner-card :deep(.el-card__body) {
  padding: 16px;
}

.inner-card--flush :deep(.el-card__body) {
  padding: 8px 12px 12px;
}

.rail-toggle {
  flex: 0 0 36px;
  align-self: stretch;
  margin: 0 4px;
  border: 1px solid var(--gen-card-border);
  border-radius: 12px;
  background: var(--gen-card);
  backdrop-filter: blur(8px);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--gen-muted);
  transition: background 0.15s ease, color 0.15s ease, box-shadow 0.15s ease;
}

.rail-toggle:hover {
  color: var(--gen-teal);
  box-shadow: 0 6px 20px rgba(15, 23, 42, 0.08);
}

.rail-toggle.collapsed {
  margin-left: 16px;
}

.right-panel {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  padding-right: 16px;
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
  gap: 10px;
}

.code-title {
  font-weight: 700;
  font-size: 0.9375rem;
  letter-spacing: -0.02em;
}

.code-card :deep(.el-card__body) {
  flex: 1;
  overflow: auto;
}

.code-block {
  background: linear-gradient(160deg, #0f172a 0%, #1e293b 100%);
  border-radius: 12px;
  padding: 16px;
  overflow: auto;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.code-block pre {
  margin: 0;
  font-family: 'Menlo', 'Monaco', 'Consolas', monospace;
  font-size: 12px;
  line-height: 1.55;
  color: #e2e8f0;
}

.code-block code {
  white-space: pre;
}

.preview-card :deep(.el-card__body) {
  padding: 0;
}

@media (max-width: 960px) {
  .left-panel {
    flex: 1 1 auto;
    max-width: none;
  }
  .content {
    flex-direction: column;
    padding: 12px;
  }
  .rail-toggle {
    display: none;
  }
}
</style>
