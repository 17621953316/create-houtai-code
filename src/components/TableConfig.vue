<template>
  <div class="table-config">
    <div class="config-header">
      <span class="config-title">表格配置</span>
    </div>
    <el-form label-width="120px" size="small" class="table-form">
      <el-form-item label="表头固定">
        <div class="inline-row">
          <el-switch v-model="local.fixedHeader" />
          <template v-if="local.fixedHeader">
            <span class="hint">表格高度(px)</span>
            <el-input v-model="local.height" placeholder="如 440" style="width: 100px" />
          </template>
        </div>
      </el-form-item>
      <el-form-item label="多选列">
        <el-switch v-model="local.showSelection" />
      </el-form-item>
      <el-form-item label="序号列">
        <div class="inline-row">
          <el-switch v-model="local.showIndex" />
          <template v-if="local.showIndex">
            <span class="hint">列名</span>
            <el-input v-model="local.indexLabel" style="width: 90px" />
            <span class="hint">宽度</span>
            <el-input v-model="local.indexWidth" style="width: 72px" />
          </template>
        </div>
      </el-form-item>
      <el-form-item label="示例数据">
        <el-input
          v-model="mockJsonText"
          type="textarea"
          :rows="5"
          placeholder='JSON 数组，如 [{"id":1,"name":"a"}]，生成代码会写入 tableData 初值'
          @blur="applyMockJson"
        />
      </el-form-item>
      <el-form-item label="操作列">
        <el-switch v-model="local.operation.enabled" active-text="启用" inactive-text="关闭" />
      </el-form-item>
      <template v-if="local.operation.enabled">
        <el-form-item label="操作列标题">
          <el-input v-model="local.operation.label" style="max-width: 200px" />
        </el-form-item>
        <el-form-item label="操作列宽度">
          <el-input v-model="local.operation.width" style="width: 100px" />
        </el-form-item>
        <el-form-item label="操作列固定">
          <el-select v-model="local.operation.fixed" style="width: 120px">
            <el-option label="右侧" value="right" />
            <el-option label="左侧" value="left" />
            <el-option label="不固定" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="操作按钮">
          <div class="btn-list">
            <div
              v-for="(btn, idx) in local.operation.buttons"
              :key="idx"
              class="btn-row"
            >
              <el-input v-model="btn.text" placeholder="文案" style="width: 88px" />
              <el-input v-model="btn.handler" placeholder="方法名" style="width: 120px" />
              <el-button link type="danger" size="small" @click="removeOpBtn(idx)">删除</el-button>
            </div>
            <el-button link type="primary" size="small" @click="addOpBtn">+ 添加按钮</el-button>
          </div>
        </el-form-item>
      </template>
    </el-form>

    <div class="columns-header">
      <span class="sub-title">数据列</span>
      <el-button type="primary" size="small" :icon="Plus" @click="addColumn">添加列</el-button>
    </div>
    <div class="column-list">
      <div
        v-for="(col, index) in local.columns"
        :key="col._id || index"
        class="column-item"
      >
        <div class="col-order">
          <el-button
            link
            type="primary"
            size="small"
            :icon="ArrowUp"
            :disabled="index === 0"
            @click="moveColumn(index, -1)"
          />
          <el-button
            link
            type="primary"
            size="small"
            :icon="ArrowDown"
            :disabled="index === local.columns.length - 1"
            @click="moveColumn(index, 1)"
          />
        </div>
        <div class="col-fields">
          <el-row :gutter="8">
            <el-col :span="6">
              <el-form-item label="字段 prop" label-position="top">
                <el-input v-model="col.key" placeholder="如 username" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="列标题" label-position="top">
                <el-input v-model="col.label" placeholder="如 用户名" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="宽度" label-position="top">
                <el-input v-model="col.width" placeholder="可选" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="最小宽" label-position="top">
                <el-input v-model="col.minWidth" placeholder="可选" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="对齐" label-position="top">
                <el-select v-model="col.align" style="width: 100%">
                  <el-option label="左" value="left" />
                  <el-option label="中" value="center" />
                  <el-option label="右" value="right" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="8">
            <el-col :span="8">
              <el-form-item label="列固定" label-position="top">
                <el-select v-model="col.fixed" style="width: 100%">
                  <el-option label="不固定" value="" />
                  <el-option label="左侧" value="left" />
                  <el-option label="右侧" value="right" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="排序" label-position="top">
                <el-switch v-model="col.sortable" />
              </el-form-item>
            </el-col>
            <el-col :span="8" class="col-actions">
              <el-button link type="danger" size="small" :icon="Delete" @click="removeColumn(index)">删除列</el-button>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <el-empty v-if="!local.columns?.length" description="暂无数据列，点击「添加列」" :image-size="56" />
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, Delete, ArrowUp, ArrowDown } from '@element-plus/icons-vue'
import { defaultTableConfig } from '@/config/defaultConfig'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:modelValue'])

const local = reactive(mergeTable(props.modelValue))
const mockJsonText = ref('')
let syncingFromParent = false

function mergeTable(raw) {
  const base = JSON.parse(JSON.stringify(defaultTableConfig))
  const op = { ...base.operation, ...(raw.operation || {}) }
  if (!op.buttons || !op.buttons.length) {
    op.buttons = (base.operation.buttons || []).map((b) => ({ ...b }))
  }
  return {
    ...base,
    ...raw,
    operation: op,
    columns: Array.isArray(raw.columns) && raw.columns.length
      ? raw.columns.map((c, i) => ({
          ...c,
          _id: c._id || `tc_${Date.now()}_${i}`,
          align: c.align || 'left',
          fixed: c.fixed || '',
          sortable: !!c.sortable
        }))
      : base.columns.map((c, i) => ({ ...c, _id: c._id || `tc_${Date.now()}_${i}` }))
  }
}

function tableSnapshot(obj) {
  return JSON.stringify({
    fixedHeader: obj.fixedHeader,
    height: obj.height,
    showIndex: obj.showIndex,
    showSelection: obj.showSelection,
    indexLabel: obj.indexLabel,
    indexWidth: obj.indexWidth,
    mockRows: obj.mockRows || [],
    operation: obj.operation,
    columns: (obj.columns || []).map(({ _id, ...c }) => ({ ...c }))
  })
}

function applySnapshot(v) {
  const m = mergeTable(v || {})
  syncingFromParent = true
  local.fixedHeader = m.fixedHeader
  local.height = m.height
  local.showIndex = m.showIndex
  local.showSelection = !!m.showSelection
  local.indexLabel = m.indexLabel
  local.indexWidth = m.indexWidth
  local.mockRows = m.mockRows
  local.operation = m.operation
  local.columns.splice(0, local.columns.length, ...m.columns)
  syncMockText()
  nextTick(() => {
    syncingFromParent = false
  })
}

function syncMockText() {
  try {
    mockJsonText.value = JSON.stringify(local.mockRows || [], null, 2)
  } catch {
    mockJsonText.value = '[]'
  }
}

function emitUpdate() {
  if (syncingFromParent) return
  const payload = JSON.parse(JSON.stringify(local))
  payload.columns = (payload.columns || []).map(({ _id, ...c }) => ({ ...c }))
  emit('update:modelValue', payload)
}

watch(
  () => local,
  () => emitUpdate(),
  { deep: true }
)

onMounted(() => {
  syncMockText()
})

watch(
  () => props.modelValue,
  (v) => {
    if (!v || typeof v !== 'object') return
    if (tableSnapshot(v) === tableSnapshot(local)) return
    applySnapshot(v)
  },
  { deep: true }
)

function applyMockJson() {
  const text = (mockJsonText.value || '').trim() || '[]'
  try {
    const parsed = JSON.parse(text)
    if (!Array.isArray(parsed)) {
      ElMessage.warning('示例数据须为 JSON 数组')
      return
    }
    local.mockRows = parsed
  } catch {
    ElMessage.warning('示例数据 JSON 无法解析')
  }
}

function addColumn() {
  const id = `tc_${Date.now()}`
  local.columns.push({
    _id: id,
    key: `col_${id}`,
    label: '新列',
    width: '',
    minWidth: '',
    align: 'left',
    fixed: '',
    sortable: false
  })
}

function removeColumn(index) {
  local.columns.splice(index, 1)
}

function moveColumn(index, delta) {
  const target = index + delta
  if (target < 0 || target >= local.columns.length) return
  const arr = local.columns
  ;[arr[index], arr[target]] = [arr[target], arr[index]]
}

function addOpBtn() {
  if (!local.operation.buttons) local.operation.buttons = []
  local.operation.buttons.push({ text: '按钮', handler: 'handleRowAction' })
}

function removeOpBtn(idx) {
  local.operation.buttons.splice(idx, 1)
}
</script>

<style scoped>
.table-config {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #e4e7ed;
}
.config-header {
  margin-bottom: 12px;
}
.config-title {
  font-weight: 600;
  color: #303133;
}
.table-form :deep(.el-form-item) {
  margin-bottom: 12px;
}
.inline-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}
.hint {
  font-size: 12px;
  color: #909399;
  margin-left: 4px;
}
.columns-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 16px 0 10px;
}
.sub-title {
  font-weight: 600;
  color: #303133;
}
.column-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.column-item {
  display: flex;
  gap: 10px;
  padding: 10px;
  background: #fafafa;
  border-radius: 8px;
  border: 1px solid #ebeef5;
}
.col-order {
  display: flex;
  flex-direction: column;
}
.col-fields {
  flex: 1;
  min-width: 0;
}
.col-actions {
  display: flex;
  align-items: flex-end;
  padding-bottom: 4px;
}
.btn-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.btn-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
