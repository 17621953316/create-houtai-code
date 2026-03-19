<template>
  <div class="search-field-config">
    <div class="config-header">
      <span class="config-title">筛选项配置</span>
      <el-button type="primary" size="small" @click="addField" :icon="Plus">添加筛选项</el-button>
    </div>
    <div class="field-list">
      <div
        v-for="(field, index) in modelValue"
        :key="field._id || index"
        class="field-item"
      >
        <div class="field-order">
          <el-button
            link
            type="primary"
            size="small"
            :icon="ArrowUp"
            :disabled="index === 0"
            @click="moveField(index, -1)"
          />
          <el-button
            link
            type="primary"
            size="small"
            :icon="ArrowDown"
            :disabled="index === modelValue.length - 1"
            @click="moveField(index, 1)"
          />
        </div>
        <div class="field-content">
          <el-form label-width="auto" label-position="top" size="small">
            <el-row :gutter="12">
              <el-col :span="6">
                <el-form-item label="标签">
                  <el-input v-model="field.label" placeholder="如：关键词" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="字段名">
                  <el-input v-model="field.key" placeholder="如：keyword" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="类型">
                  <el-select v-model="field.type" placeholder="选择类型" style="width: 100%">
                    <el-option label="输入框" value="input" />
                    <el-option label="下拉单选" value="select" />
                    <el-option label="时间选择" value="date" />
                    <el-option label="日期范围" value="dateRange" />
                    <el-option label="多选菜单" value="selectMultiple" />
                    <el-option label="级联选择" value="cascader" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="占位符">
                  <el-input
                    v-if="field.type !== 'dateRange'"
                    v-model="field.placeholder"
                    :placeholder="placeholderHint(field.type)"
                  />
                  <template v-else>
                    <el-input v-model="field.placeholder" placeholder="开始日期,结束日期" style="margin-bottom: 4px" />
                  </template>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="field.type === 'date' || field.type === 'dateRange'" :gutter="12">
              <el-col :span="12">
                <el-form-item label="值格式">
                  <el-input v-model="field.valueFormat" placeholder="如：YYYY-MM-DD" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="field.type === 'cascader'" :gutter="12">
              <el-col :span="12">
                <el-form-item label="选项变量名">
                  <el-input v-model="field.optionsKey" placeholder="如：orderDistrictOptions，留空则用 key+Options" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="是否多选">
                  <el-switch v-model="field.cascaderMultiple" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="field.type === 'select' || field.type === 'selectMultiple'" :gutter="12">
              <el-col :span="24">
                <el-form-item label="选项">
                  <div class="options-editor">
                    <div
                      v-for="(opt, idx) in (field.options || [])"
                      :key="idx"
                      class="option-row"
                    >
                      <el-input v-model="opt.label" placeholder="显示文本" size="small" style="width: 120px" />
                      <el-input v-model="opt.value" placeholder="值" size="small" style="width: 100px" />
                      <el-button link type="danger" size="small" @click="removeOption(field, idx)">删除</el-button>
                    </div>
                    <el-button link type="primary" size="small" @click="addOption(field)">+ 添加选项</el-button>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div class="field-actions">
          <el-button link type="danger" size="small" @click="removeField(index)" :icon="Delete">删除</el-button>
        </div>
      </div>
    </div>
    <el-empty v-if="!modelValue?.length" description="暂无筛选项，点击上方按钮添加" :image-size="60" />
  </div>
</template>

<script setup>
import { Plus, Delete, ArrowUp, ArrowDown } from '@element-plus/icons-vue'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue'])

function placeholderHint(type) {
  const map = {
    input: '请输入...',
    select: '请选择',
    date: '选择日期',
    selectMultiple: '请选择',
    cascader: '请选择'
  }
  return map[type] || '占位符'
}

function addField() {
  const id = Date.now()
  const fields = [...(props.modelValue || []), {
    _id: id,
    key: `field_${id}`,
    label: '新筛选项',
    type: 'input',
    placeholder: '',
    cascaderMultiple: false
  }]
  emit('update:modelValue', fields)
}

function removeField(index) {
  const fields = props.modelValue.filter((_, i) => i !== index)
  emit('update:modelValue', fields)
}

function moveField(index, delta) {
  const fields = [...props.modelValue]
  const target = index + delta
  if (target < 0 || target >= fields.length) return
  ;[fields[index], fields[target]] = [fields[target], fields[index]]
  emit('update:modelValue', fields)
}

function addOption(field) {
  if (!field.options) field.options = []
  field.options.push({ value: '', label: '' })
  emit('update:modelValue', [...props.modelValue])
}

function removeOption(field, idx) {
  field.options.splice(idx, 1)
  emit('update:modelValue', [...props.modelValue])
}
</script>

<style scoped>
.search-field-config {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #e4e7ed;
}
.config-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.config-title {
  font-weight: 600;
  color: #303133;
}
.field-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.field-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  background: #fafafa;
  border-radius: 8px;
  border: 1px solid #ebeef5;
}
.field-order {
  display: flex;
  flex-direction: column;
  gap: 0;
}
.field-content {
  flex: 1;
  min-width: 0;
}
.field-actions {
  flex-shrink: 0;
}
.options-editor {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.option-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
