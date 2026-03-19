import Handlebars from 'handlebars'

Handlebars.registerHelper('eq', function (a, b) {
  return a === b
})

// 将数组按每行 cols 个分组，用于 el-row/el-col 布局
Handlebars.registerHelper('chunk', function (arr, cols) {
  if (!arr || !arr.length) return []
  const result = []
  for (let i = 0; i < arr.length; i += cols) {
    result.push(arr.slice(i, i + cols))
  }
  return result
})

/**
 * 预处理 searchFields
 */
function preprocessSearchFields(searchFields) {
  if (!searchFields?.length) return []
  return searchFields.map((f) => {
    const field = { ...f }
    if (field.type === 'dateRange' && field.placeholder) {
      const parts = String(field.placeholder).split(/[,，]/).map((s) => s.trim())
      field.startPlaceholder = parts[0] || '开始时间'
      field.endPlaceholder = parts[1] || '结束时间'
    }
    if (!field.valueFormat && (field.type === 'date' || field.type === 'dateRange')) {
      field.valueFormat = 'YYYY-MM-DD'
    }
    if (!field.placeholder) {
      const defaults = { input: '请输入', select: '请选择', date: '选择日期', dateRange: '选择日期范围', selectMultiple: '请选择', cascader: '请选择' }
      field.placeholder = defaults[field.type] || ''
    }
    if (field.type === 'selectMultiple' || field.type === 'cascader') {
      field.defaultValue = '[]'
    } else if (field.type === 'dateRange') {
      field.defaultValue = '[]'
    } else {
      field.defaultValue = "''"
    }
    field.optionsKey = field.optionsKey || `${field.key}Options`
    field.cascaderMultiple = !!field.cascaderMultiple
    const hasOpts = !!(field.options && field.options.length)
    field.hasInlineOptions = hasOpts
    if (hasOpts) {
      field.optionsData = field.options
        .map((o) => `{ value: ${JSON.stringify(o.value)}, label: ${JSON.stringify(o.label)} }`)
        .join(',\n        ')
    }
    return field
  })
}

const CN_MAP = { 用: 'yong', 户: 'hu', 管: 'guan', 理: 'li', 订: 'ding', 单: 'dan', 车: 'che', 商: 'shang', 地: 'di', 区: 'qu', 时: 'shi', 间: 'jian', 状: 'zhuang', 态: 'tai' }

function toSlug(name) {
  let s = (name || 'page')
    .replace(/[\u4e00-\u9fa5]/g, (c) => CN_MAP[c] || c)
    .replace(/[^a-z0-9]/gi, '-')
    .toLowerCase()
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
  return s || 'page'
}

function toComponentName(name) {
  const slug = toSlug(name)
  if (!slug) return 'Page'
  return slug.split('-').map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join('') || 'Page'
}

export function generatePageCode(config) {
  const searchFields = preprocessSearchFields(config.searchFields || [])
  const pageNameSlug = toSlug(config.pageName || 'page')
  const api = config.api || { list: '/api/list' }

  const templateContext = {
    pageName: config.pageName || '页面',
    pageNameSlug,
    componentName: toComponentName(config.pageName || 'page'),
    searchFields,
    api
  }

  const template = Handlebars.compile(getTemplateSource())
  return template(templateContext)
}

function getTemplateSource() {
  return `<template>
  <div class="pg-{{pageNameSlug}}">
    <div class="content-section">
      <div class="top-section">
        <el-form
          ref="searchForm"
          :model="form"
          label-width="130px"
          label-position="right">
          {{#each (chunk searchFields 3)}}
          <el-row :gutter="ROW_GUTTER">
            {{#each this}}
            <el-col :span="ROW_SPAN">
              <el-form-item label="{{label}}:" prop="{{key}}">
                {{#if (eq type "input")}}
                <el-input
                  v-model="form.{{key}}"
                  placeholder="{{placeholder}}"
                  clearable
                  @keyup.enter="resetPageAndSearch" />
                {{/if}}
                {{#if (eq type "select")}}
                <el-select
                  v-model="form.{{key}}"
                  style="width: 100%;"
                  placeholder="{{placeholder}}">
                  {{#if hasInlineOptions}}
                  <el-option
                    v-for="item in {{optionsKey}}"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value" />
                  {{else}}
                  <el-option
                    v-for="item in {{optionsKey}}"
                    :key="item.code"
                    :label="item.desc"
                    :value="item.code" />
                  {{/if}}
                </el-select>
                {{/if}}
                {{#if (eq type "date")}}
                <el-date-picker
                  v-model="form.{{key}}"
                  type="date"
                  placeholder="{{placeholder}}"
                  value-format="{{valueFormat}}"
                  clearable
                  style="width: 100%;" />
                {{/if}}
                {{#if (eq type "dateRange")}}
                <el-date-picker
                  v-model="form.{{key}}"
                  type="daterange"
                  unlink-panels
                  range-separator="-"
                  start-placeholder="{{startPlaceholder}}"
                  end-placeholder="{{endPlaceholder}}"
                  value-format="{{valueFormat}}"
                  clearable
                  style="width: 100%;"
                  @change="formatDate('{{key}}')" />
                {{/if}}
                {{#if (eq type "selectMultiple")}}
                <el-select
                  v-model="form.{{key}}"
                  placeholder="{{placeholder}}"
                  multiple
                  clearable
                  collapse-tags
                  collapse-tags-tooltip
                  style="width: 100%;">
                  {{#if hasInlineOptions}}
                  <el-option
                    v-for="item in {{optionsKey}}"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value" />
                  {{else}}
                  <el-option
                    v-for="item in {{optionsKey}}"
                    :key="item.code"
                    :label="item.desc"
                    :value="item.code" />
                  {{/if}}
                </el-select>
                {{/if}}
                {{#if (eq type "cascader")}}
                <el-cascader
                  v-model="form.{{key}}"
                  style="width: 100%;"
                  filterable
                  placeholder="{{placeholder}}"
                  :collapse-tags="{{cascaderMultiple}}"
                  clearable
                  :options="{{optionsKey}}"
                  {{#if cascaderMultiple}}:props="{ multiple: true }"{{/if}} />
                {{/if}}
              </el-form-item>
            </el-col>
            {{/each}}
            {{#if @last}}
            <el-col :span="ROW_SPAN">
              <div class="search-area">
                <el-button type="primary" @click="resetPageAndSearch">查询</el-button>
                <el-button type="default" class="reset-button" @click="resetSearchForm">重置</el-button>
              </div>
            </el-col>
            {{/if}}
          </el-row>
          {{/each}}
        </el-form>
      </div>
      <div class="table-area">
        <el-table
          v-loading="tableLoading"
          :data="tableData"
          highlight-current-row
          :header-row-style="headStyle"
          stripe>
          <el-table-column type="index" label="序号" width="60" align="center" />
          <el-table-column prop="id" label="ID" width="80" align="center" />
          <el-table-column label="操作" width="150" fixed="right" align="center">
            <template #default="scope">
              <el-button
                color="#409eff"
                type="text"
                @click="handleDetail(scope.row)">
                详情
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-area">
          <el-pagination
            v-model:current-page="pageIndex"
            background
            :page-size="pageSize"
            :total="totalNumber"
            :page-count="totalPage"
            layout="total, prev, pager, next"
            @current-change="handleCurrentChange" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const ROW_GUTTER = 24;
const ROW_SPAN = 8;

export default {
  name: '{{componentName}}',
  data() {
    return {
      tableLoading: false,
      headStyle: {
        color: '#000000a6',
        background: '#fafafa',
      },
      form: {
        {{#each searchFields}}
        {{key}}: {{{defaultValue}}},
        {{/each}}
      },
      {{#each searchFields}}
      {{#if (eq type "select")}}
      {{optionsKey}}: [
        {{#if hasInlineOptions}}
        {{{optionsData}}}
        {{else}}
        // { code: '1', desc: '选项1' },
        {{/if}}
      ],
      {{/if}}
      {{#if (eq type "selectMultiple")}}
      {{optionsKey}}: [
        {{#if hasInlineOptions}}
        {{{optionsData}}}
        {{else}}
        // { code: '1', desc: '选项1' },
        {{/if}}
      ],
      {{/if}}
      {{#if (eq type "cascader")}}
      {{optionsKey}}: [],
      {{/if}}
      {{/each}}
      tableData: [],
      pageSize: 10,
      pageIndex: 1,
      totalNumber: 0,
      totalPage: 0,
      ROW_SPAN,
      ROW_GUTTER,
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      // TODO: 获取下拉选项等初始化数据
      // await this.fetchOptions();
      this.resetPageAndSearch();
    },
    formatDate(fieldKey) {
      if (this.form[fieldKey] === null) {
        setTimeout(() => {
          this.form[fieldKey] = [];
        }, 200);
      }
    },
    getTime(date, ifAddOneDay) {
      const str = new Date(date);
      return date ? (ifAddOneDay ? str.getTime() + 24 * 60 * 60 * 1000 : str.getTime()) : '';
    },
    formatCascaderList(data) {
      if (data && Array.isArray(data)) {
        return data.map((i) => (Array.isArray(i) ? i[i.length - 1] : i));
      }
      return [];
    },
    resetPageAndSearch() {
      this.tableData = [];
      this.totalNumber = 0;
      this.totalPage = 0;
      this.pageIndex = 1;
      this.searchTableData();
    },
    resetSearchForm() {
      this.$refs.searchForm.resetFields();
      this.pageIndex = 1;
      this.totalNumber = 0;
      this.totalPage = 0;
      this.$nextTick(() => {
        this.searchTableData();
      });
    },
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.$nextTick(() => {
        this.searchTableData();
      });
    },
    getAllQueryData() {
      const queryData = {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        ...this.form,
      };
      {{#each searchFields}}
      {{#if (eq type "dateRange")}}
      if (this.form.{{key}} && this.form.{{key}}.length === 2) {
        queryData.{{key}}Start = this.getTime(this.form.{{key}}[0]);
        queryData.{{key}}End = this.getTime(this.form.{{key}}[1], true);
      }
      delete queryData.{{key}};
      {{/if}}
      {{#if (eq type "cascader")}}
      queryData.{{key}} = this.formatCascaderList(this.form.{{key}});
      {{/if}}
      {{/each}}
      return queryData;
    },
    async searchTableData() {
      const queryData = this.getAllQueryData();
      try {
        this.tableLoading = true;
        // const res = await api.getList(queryData);
        // this.tableData = res.items;
        // this.totalPage = res.totalPage;
        // this.totalNumber = res.totalNumber;
        this.tableData = [];
        this.totalPage = 0;
        this.totalNumber = 0;
      } catch (err) {
        console.error(err);
      } finally {
        this.tableLoading = false;
      }
    },
    handleDetail(row) {
      console.log('detail', row);
    },
  },
};
</script>

<style lang="less" scoped>
.pg-{{pageNameSlug}} {
  padding: 10px;
  background: #f0f0f0;

  .content-section {
    padding: 20px;
    background: #fff;
    border-radius: 10px;

    .top-section {
      padding: 10px 0;
      border-radius: 8px;

      .search-area {
        display: flex;
        justify-content: center;
        margin-top: 10px;

        .reset-button {
          margin-left: 10px;
        }
      }
    }

    .table-area {
      margin-top: 20px;

      .pagination-area {
        display: flex;
        padding: 10px 0;
        flex-direction: row-reverse;
      }
    }
  }
}

:deep(.el-form-item--small .el-form-item__label) {
  text-align: right;
}
</style>
`
}
