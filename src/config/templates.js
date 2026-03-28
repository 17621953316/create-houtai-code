/**
 * 页面配置模板：一键套用典型后台列表场景
 */
import { defaultTableConfig } from './defaultConfig'

function clone(obj) {
  return JSON.parse(JSON.stringify(obj))
}

function withSearchIds(searchFields) {
  const ts = Date.now()
  return (searchFields || []).map((f, i) => ({
    ...clone(f),
    _id: f._id || `sf_${ts}_${i}`
  }))
}

/** @typedef {{ id: string, name: string, tag?: string, description: string, accent?: string, config: () => object }} PageTemplate */

/** @type {PageTemplate[]} */
export const pageTemplates = [
  {
    id: 'user-list',
    name: '用户管理',
    tag: '常用',
    description: '关键词、状态、日期与多选标签，含操作列',
    accent: 'teal',
    config: () => ({
      pageName: '用户管理',
      api: {
        list: '/api/users',
        create: '/api/users',
        update: '/api/users/:id',
        delete: '/api/users/:id'
      },
      table: {
        ...clone(defaultTableConfig),
        showSelection: true,
        fixedHeader: true,
        height: '420',
        columns: [
          { key: 'id', label: 'ID', width: '72', minWidth: '', align: 'center', fixed: '', sortable: true },
          { key: 'username', label: '用户名', width: '', minWidth: '120', align: 'left', fixed: '', sortable: false },
          { key: 'mobile', label: '手机号', width: '120', minWidth: '', align: 'center', fixed: '', sortable: false },
          { key: 'status', label: '状态', width: '88', minWidth: '', align: 'center', fixed: '', sortable: false },
          { key: 'createdAt', label: '创建时间', width: '168', minWidth: '', align: 'center', fixed: '', sortable: false }
        ],
        mockRows: [
          { id: 1, username: '张三', mobile: '138****0001', status: '启用', createdAt: '2025-01-10' },
          { id: 2, username: '李四', mobile: '139****0002', status: '禁用', createdAt: '2025-01-11' }
        ],
        operation: {
          enabled: true,
          label: '操作',
          width: '200',
          fixed: 'right',
          buttons: [
            { text: '详情', handler: 'handleDetail' },
            { text: '编辑', handler: 'handleEdit' },
            { text: '禁用', handler: 'handleDisable' }
          ]
        }
      },
      searchFields: [
        { key: 'keyword', label: '关键词', type: 'input', placeholder: '用户名 / 手机号' },
        { key: 'status', label: '状态', type: 'select', placeholder: '请选择', options: [{ value: 1, label: '启用' }, { value: 0, label: '禁用' }] },
        { key: 'createTime', label: '创建时间', type: 'date', placeholder: '选择日期', valueFormat: 'YYYY-MM-DD' },
        { key: 'dateRange', label: '注册时间', type: 'dateRange', placeholder: '开始日期,结束日期', valueFormat: 'YYYY-MM-DD' },
        { key: 'tags', label: '标签', type: 'selectMultiple', placeholder: '请选择标签', options: [{ value: 'vip', label: 'VIP' }, { value: 'new', label: '新用户' }] }
      ]
    })
  },
  {
    id: 'order-list',
    name: '订单列表',
    tag: '电商',
    description: '订单号、状态、下单时间范围',
    accent: 'coral',
    config: () => ({
      pageName: '订单列表',
      api: {
        list: '/api/orders',
        create: '/api/orders',
        update: '/api/orders/:id',
        delete: '/api/orders/:id'
      },
      table: {
        ...clone(defaultTableConfig),
        showSelection: false,
        showIndex: true,
        columns: [
          { key: 'orderNo', label: '订单号', width: '', minWidth: '160', align: 'left', fixed: '', sortable: false },
          { key: 'buyer', label: '买家', width: '100', minWidth: '', align: 'left', fixed: '', sortable: false },
          { key: 'amount', label: '金额', width: '100', minWidth: '', align: 'right', fixed: '', sortable: true },
          { key: 'status', label: '状态', width: '96', minWidth: '', align: 'center', fixed: '', sortable: false },
          { key: 'createdAt', label: '下单时间', width: '168', minWidth: '', align: 'center', fixed: '', sortable: false }
        ],
        mockRows: [
          { orderNo: 'ORD20250324001', buyer: '王小明', amount: '199.00', status: '待发货', createdAt: '2025-03-24 10:20' },
          { orderNo: 'ORD20250324002', buyer: '赵敏', amount: '58.90', status: '已完成', createdAt: '2025-03-23 18:05' }
        ],
        operation: {
          enabled: true,
          label: '操作',
          width: '160',
          fixed: 'right',
          buttons: [
            { text: '详情', handler: 'handleDetail' },
            { text: '发货', handler: 'handleShip' }
          ]
        }
      },
      searchFields: [
        { key: 'orderNo', label: '订单号', type: 'input', placeholder: '请输入订单号' },
        {
          key: 'status',
          label: '订单状态',
          type: 'select',
          placeholder: '请选择',
          options: [
            { value: 'pending', label: '待付款' },
            { value: 'paid', label: '待发货' },
            { value: 'done', label: '已完成' }
          ]
        },
        { key: 'dateRange', label: '下单时间', type: 'dateRange', placeholder: '开始日期,结束日期', valueFormat: 'YYYY-MM-DD' }
      ]
    })
  },
  {
    id: 'product-list',
    name: '商品管理',
    tag: '商品',
    description: 'SKU、类目、上下架状态',
    accent: 'violet',
    config: () => ({
      pageName: '商品管理',
      api: {
        list: '/api/products',
        create: '/api/products',
        update: '/api/products/:id',
        delete: '/api/products/:id'
      },
      table: {
        ...clone(defaultTableConfig),
        showSelection: true,
        columns: [
          { key: 'sku', label: 'SKU', width: '120', minWidth: '', align: 'left', fixed: '', sortable: false },
          { key: 'name', label: '商品名称', width: '', minWidth: '160', align: 'left', fixed: '', sortable: false },
          { key: 'category', label: '类目', width: '100', minWidth: '', align: 'center', fixed: '', sortable: false },
          { key: 'price', label: '售价', width: '88', minWidth: '', align: 'right', fixed: '', sortable: true },
          { key: 'stock', label: '库存', width: '72', minWidth: '', align: 'center', fixed: '', sortable: false },
          { key: 'onSale', label: '上架', width: '72', minWidth: '', align: 'center', fixed: '', sortable: false }
        ],
        mockRows: [
          { sku: 'P-1001', name: '无线鼠标', category: '数码', price: '89.00', stock: 120, onSale: '是' },
          { sku: 'P-1002', name: '机械键盘', category: '数码', price: '399.00', stock: 34, onSale: '是' }
        ],
        operation: {
          enabled: true,
          label: '操作',
          width: '180',
          fixed: 'right',
          buttons: [
            { text: '编辑', handler: 'handleEdit' },
            { text: '下架', handler: 'handleOffShelf' }
          ]
        }
      },
      searchFields: [
        { key: 'keyword', label: '商品名/SKU', type: 'input', placeholder: '请输入' },
        {
          key: 'category',
          label: '类目',
          type: 'select',
          placeholder: '请选择',
          options: [
            { value: 'digital', label: '数码' },
            { value: 'home', label: '家居' },
            { value: 'food', label: '食品' }
          ]
        },
        {
          key: 'onSale',
          label: '上架状态',
          type: 'select',
          placeholder: '请选择',
          options: [
            { value: '1', label: '上架' },
            { value: '0', label: '下架' }
          ]
        }
      ]
    })
  },
  {
    id: 'audit-log',
    name: '操作日志',
    tag: '审计',
    description: '操作人、模块、时间范围，只读列表',
    accent: 'slate',
    config: () => ({
      pageName: '操作日志',
      api: {
        list: '/api/audit/logs',
        create: '/api/audit/logs',
        update: '/api/audit/logs/:id',
        delete: '/api/audit/logs/:id'
      },
      table: {
        ...clone(defaultTableConfig),
        showSelection: false,
        operation: { enabled: false, label: '操作', width: '120', fixed: '', buttons: [] },
        columns: [
          { key: 'time', label: '时间', width: '168', minWidth: '', align: 'center', fixed: '', sortable: true },
          { key: 'operator', label: '操作人', width: '100', minWidth: '', align: 'left', fixed: '', sortable: false },
          { key: 'module', label: '模块', width: '100', minWidth: '', align: 'center', fixed: '', sortable: false },
          { key: 'action', label: '动作', width: '88', minWidth: '', align: 'center', fixed: '', sortable: false },
          { key: 'detail', label: '详情', width: '', minWidth: '200', align: 'left', fixed: '', sortable: false }
        ],
        mockRows: [
          { time: '2025-03-24 09:12', operator: 'admin', module: '用户', action: '更新', detail: '修改用户 #1001 状态' },
          { time: '2025-03-24 08:40', operator: 'ops', module: '订单', action: '导出', detail: '导出筛选结果 320 条' }
        ]
      },
      searchFields: [
        { key: 'operator', label: '操作人', type: 'input', placeholder: '账号 / 姓名' },
        {
          key: 'module',
          label: '模块',
          type: 'select',
          placeholder: '请选择',
          options: [
            { value: 'user', label: '用户' },
            { value: 'order', label: '订单' },
            { value: 'system', label: '系统' }
          ]
        },
        { key: 'dateRange', label: '时间范围', type: 'dateRange', placeholder: '开始日期,结束日期', valueFormat: 'YYYY-MM-DD' }
      ]
    })
  },
  {
    id: 'minimal',
    name: '最小模板',
    tag: '空白',
    description: '仅一页一名，表格与筛选项自行添加',
    accent: 'neutral',
    config: () => ({
      pageName: '新页面',
      api: {
        list: '/api/list',
        create: '/api/list',
        update: '/api/list/:id',
        delete: '/api/list/:id'
      },
      table: clone(defaultTableConfig),
      searchFields: []
    })
  }
]

export function getTemplateById(id) {
  return pageTemplates.find((t) => t.id === id) || null
}

/**
 * 应用模板得到可写入 reactive config 的纯对象
 * @param {string} id
 */
export function buildConfigFromTemplate(id) {
  const t = getTemplateById(id)
  if (!t) return null
  const raw = t.config()
  return {
    pageName: raw.pageName,
    api: { ...raw.api },
    table: clone(raw.table),
    searchFields: withSearchIds(raw.searchFields)
  }
}
