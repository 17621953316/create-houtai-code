/**
 * 默认示例配置
 */
export const defaultConfig = {
  pageName: '用户管理',
  pageType: 'list',
  fields: [
    {
      key: 'username',
      label: '用户名',
      type: 'input',
      required: true,
      rules: ['required', 'maxLength:20'],
      placeholder: '请输入用户名',
      span: 12
    },
    {
      key: 'status',
      label: '状态',
      type: 'select',
      required: true,
      options: [
        { value: 1, label: '启用' },
        { value: 0, label: '禁用' }
      ],
      span: 12
    }
  ],
  tableColumns: [],
  searchFields: [
    { key: 'keyword', label: '关键词', type: 'input', placeholder: '请输入关键词' },
    { key: 'status', label: '状态', type: 'select', placeholder: '请选择', options: [{ value: 1, label: '启用' }, { value: 0, label: '禁用' }] },
    { key: 'createTime', label: '创建时间', type: 'date', placeholder: '选择日期', valueFormat: 'YYYY-MM-DD' },
    { key: 'dateRange', label: '时间范围', type: 'dateRange', placeholder: '开始日期,结束日期', valueFormat: 'YYYY-MM-DD' },
    { key: 'tags', label: '标签', type: 'selectMultiple', placeholder: '请选择标签', options: [{ value: 'a', label: '标签A' }, { value: 'b', label: '标签B' }, { value: 'c', label: '标签C' }] }
  ],
  api: {
    list: '/api/users',
    create: '/api/users',
    update: '/api/users/:id',
    delete: '/api/users/:id'
  },
  formCols: 2
}
