<template>
  <div class="page-preview">
    <div class="preview-inner">
      <div class="preview-search" v-if="searchFields.length">
        <el-form
          ref="searchFormRef"
          :model="form"
          label-width="130px"
          label-position="right"
        >
          <el-row
            v-for="(row, ri) in chunkedFields"
            :key="ri"
            :gutter="24"
          >
            <el-col v-for="field in row" :key="field.key" :span="8">
              <el-form-item :label="field.label + '：'" :prop="field.key">
                <el-input
                  v-if="field.type === 'input'"
                  v-model="form[field.key]"
                  :placeholder="field.placeholder || '请输入'"
                  clearable
                />
                <el-select
                  v-else-if="field.type === 'select'"
                  v-model="form[field.key]"
                  :placeholder="field.placeholder || '请选择'"
                  style="width: 100%"
                >
                  <el-option
                    v-for="opt in (field.options || [])"
                    :key="opt.value"
                    :label="opt.label"
                    :value="opt.value"
                  />
                </el-select>
                <el-select
                  v-else-if="field.type === 'selectMultiple'"
                  v-model="form[field.key]"
                  :placeholder="field.placeholder || '请选择'"
                  multiple
                  clearable
                  collapse-tags
                  collapse-tags-tooltip
                  style="width: 100%"
                >
                  <el-option
                    v-for="opt in (field.options || [])"
                    :key="opt.value"
                    :label="opt.label"
                    :value="opt.value"
                  />
                </el-select>
                <el-date-picker
                  v-else-if="field.type === 'date'"
                  v-model="form[field.key]"
                  type="date"
                  :placeholder="field.placeholder || '选择日期'"
                  :value-format="field.valueFormat || 'YYYY-MM-DD'"
                  clearable
                  style="width: 100%"
                />
                <el-date-picker
                  v-else-if="field.type === 'dateRange'"
                  v-model="form[field.key]"
                  type="daterange"
                  unlink-panels
                  range-separator="-"
                  :start-placeholder="dateRangeStart(field)"
                  :end-placeholder="dateRangeEnd(field)"
                  :value-format="field.valueFormat || 'YYYY-MM-DD'"
                  clearable
                  style="width: 100%"
                />
                <el-cascader
                  v-else-if="field.type === 'cascader'"
                  v-model="form[field.key]"
                  :placeholder="field.placeholder || '请选择'"
                  clearable
                  style="width: 100%"
                  :options="[]"
                />
              </el-form-item>
            </el-col>
            <el-col v-if="ri === chunkedFields.length - 1" :span="8">
              <div class="preview-search-btns">
                <el-button type="primary">查询</el-button>
                <el-button @click="resetForm">重置</el-button>
                <el-button type="warning">导出</el-button>
              </div>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <div class="preview-table">
        <el-table
          :data="tableData"
          :header-row-style="{ color: 'rgba(0, 0, 0, 0.65)', background: '#fafafa' }"
          highlight-current-row
          stripe
          v-bind="tableFixedProps"
        >
          <el-table-column
            v-if="tableConf.showSelection"
            type="selection"
            width="55"
            align="center"
          />
          <el-table-column
            v-if="tableConf.showIndex !== false"
            type="index"
            :label="tableConf.indexLabel || '序号'"
            :width="Number(tableConf.indexWidth) || 60"
            align="center"
          />
          <el-table-column
            v-for="col in columns"
            :key="col.key"
            :prop="col.key"
            :label="col.label"
            :width="col.width ? Number(col.width) : undefined"
            :min-width="col.minWidth ? Number(col.minWidth) : undefined"
            :align="col.align || 'left'"
            :fixed="col.fixed || false"
            :sortable="!!col.sortable"
          />
          <el-table-column
            v-if="operation.enabled"
            :label="operation.label || '操作'"
            :width="Number(operation.width) || 160"
            align="center"
            :fixed="operation.fixed || false"
          >
            <template #default>
              <el-button
                v-for="(btn, bi) in operation.buttons"
                :key="bi"
                type="primary"
                link
              >{{ btn.text }}</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="preview-pagination">
          <el-pagination
            :current-page="1"
            background
            :page-size="10"
            :total="tableData.length"
            layout="total, prev, pager, next"
            disabled
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'

const props = defineProps({
  config: {
    type: Object,
    required: true
  }
})

const searchFormRef = ref(null)

const searchFields = computed(() => {
  return (props.config.searchFields || []).map((f) => ({
    ...f,
    placeholder: f.placeholder || ''
  }))
})

const chunkedFields = computed(() => {
  const arr = searchFields.value
  const result = []
  for (let i = 0; i < arr.length; i += 3) {
    result.push(arr.slice(i, i + 3))
  }
  return result
})

const tableConf = computed(() => props.config.table || {})
const columns = computed(() => tableConf.value.columns || [])
const operation = computed(() => tableConf.value.operation || { enabled: false })

const tableData = computed(() => {
  const mock = tableConf.value.mockRows
  return Array.isArray(mock) && mock.length ? mock : []
})

const tableFixedProps = computed(() => {
  if (tableConf.value.fixedHeader) {
    const h = Number(tableConf.value.height) || 440
    return { height: h }
  }
  return {}
})

const form = reactive({})

function syncFormKeys() {
  const keys = new Set(searchFields.value.map((f) => f.key))
  for (const k of Object.keys(form)) {
    if (!keys.has(k)) delete form[k]
  }
  for (const f of searchFields.value) {
    if (!(f.key in form)) {
      if (f.type === 'selectMultiple' || f.type === 'cascader' || f.type === 'dateRange') {
        form[f.key] = []
      } else {
        form[f.key] = ''
      }
    }
  }
}

watch(searchFields, syncFormKeys, { immediate: true, deep: true })

function resetForm() {
  for (const f of searchFields.value) {
    if (f.type === 'selectMultiple' || f.type === 'cascader' || f.type === 'dateRange') {
      form[f.key] = []
    } else {
      form[f.key] = ''
    }
  }
}

function dateRangeStart(field) {
  if (!field.placeholder) return '开始日期'
  const parts = String(field.placeholder).split(/[,，]/).map((s) => s.trim())
  return parts[0] || '开始日期'
}

function dateRangeEnd(field) {
  if (!field.placeholder) return '结束日期'
  const parts = String(field.placeholder).split(/[,，]/).map((s) => s.trim())
  return parts[1] || '结束日期'
}
</script>

<style scoped>
.page-preview {
  height: 100%;
  overflow: auto;
  background: #f0f0f0;
}
.preview-inner {
  padding: 20px;
  background: #fff;
  border-radius: 10px;
  min-height: 100%;
}
.preview-search {
  padding: 10px 0 0;
}
.preview-search-btns {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}
.preview-table {
  margin-top: 20px;
}
.preview-pagination {
  display: flex;
  justify-content: flex-end;
  padding: 12px 0;
}
</style>
