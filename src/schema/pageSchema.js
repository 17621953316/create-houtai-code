/**
 * 页面配置 JSON Schema 定义
 */
export const pageConfigSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  required: ['pageName', 'fields'],
  properties: {
    pageName: { type: 'string' },
    pageType: {
      type: 'string',
      enum: ['list', 'form', 'detail'],
      default: 'list'
    },
    fields: {
      type: 'array',
      items: {
        type: 'object',
        required: ['key', 'label', 'type'],
        properties: {
          key: { type: 'string' },
          label: { type: 'string' },
          type: {
            type: 'string',
            enum: ['input', 'textarea', 'select', 'radio', 'checkbox', 'date', 'dateRange', 'upload', 'switch']
          },
          placeholder: { type: 'string' },
          required: { type: 'boolean' },
          rules: { type: 'array' },
          options: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                value: {},
                label: { type: 'string' }
              }
            }
          }
        }
      }
    },
    tableColumns: { type: 'array' },
    table: {
      type: 'object',
      properties: {
        fixedHeader: { type: 'boolean' },
        height: { type: 'string' },
        showSelection: { type: 'boolean' },
        showIndex: { type: 'boolean' },
        indexLabel: { type: 'string' },
        indexWidth: { type: 'string' },
        mockRows: { type: 'array' },
        columns: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              key: { type: 'string' },
              label: { type: 'string' },
              width: { type: 'string' },
              minWidth: { type: 'string' },
              align: { type: 'string', enum: ['left', 'center', 'right'] },
              fixed: { type: 'string' },
              sortable: { type: 'boolean' }
            }
          }
        },
        operation: {
          type: 'object',
          properties: {
            enabled: { type: 'boolean' },
            label: { type: 'string' },
            width: { type: 'string' },
            fixed: { type: 'string' },
            buttons: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  text: { type: 'string' },
                  handler: { type: 'string' }
                }
              }
            }
          }
        }
      }
    },
    searchFields: {
      type: 'array',
      items: {
        type: 'object',
        required: ['key', 'label', 'type'],
        properties: {
          key: { type: 'string' },
          label: { type: 'string' },
          type: {
            type: 'string',
            enum: ['input', 'select', 'date', 'dateRange', 'selectMultiple', 'cascader'],
            description: 'input=输入框, select=下拉单选, date=时间选择, dateRange=日期范围, selectMultiple=多选菜单, cascader=级联选择'
          },
          placeholder: { type: 'string' },
          options: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                value: {},
                label: { type: 'string' }
              }
            }
          },
          valueFormat: { type: 'string', description: 'date/dateRange 的值的格式，如 YYYY-MM-DD' }
        }
      }
    },
    api: {
      type: 'object',
      properties: {
        list: { type: 'string' },
        create: { type: 'string' },
        update: { type: 'string' },
        delete: { type: 'string' }
      }
    }
  }
}
