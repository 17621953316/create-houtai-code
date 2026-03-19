# 后台管理系统代码生成器 - 产品需求文档（PRD）

**版本**：v1.0  
**更新日期**：2025-03-19

---

## 1. 产品概述和目标用户

### 1.1 产品概述

**产品名称**：后台管理系统代码生成器（暂定）

**产品定位**：面向 Vue 技术栈的 Low-Code/No-Code 辅助工具，通过 JSON 配置驱动，快速生成「表格 + 表单 + 搜索条件」等典型后台页面代码，显著降低重复开发成本。

**核心价值**：

- 将「黏贴代码 + 手工修改」约 2 小时的流程，压缩到「填写配置 + 一键生成」数分钟内
- 配置即文档，便于团队协作和后续维护
- 可结合 AI（Cursor/Claude）或本地模板引擎，灵活扩展生成能力

### 1.2 目标用户

| 用户角色   | 典型场景           | 核心诉求                 |
| ---------- | ------------------ | ------------------------ |
| 前端开发   | 日常 CRUD 页面开发 | 减少重复劳动，提高交付效率 |
| 全栈/后端开发 | 快速搭建管理后台   | 不熟悉 Vue 也能产出可用页面 |
| 技术负责人 | 统一团队代码风格   | 配置驱动，保证输出一致性   |
| 产品/运营 | 原型验证           | 通过 Web 界面快速生成可演示页面 |

---

## 2. 详细功能列表

### 2.1 JSON 配置能力

**配置结构设计**（建议 schema）：

```json
{
  "pageName": "用户管理",
  "pageType": "list",
  "fields": [
    {
      "key": "username",
      "label": "用户名",
      "type": "input",
      "required": true,
      "rules": ["required", "maxLength:20"]
    },
    {
      "key": "status",
      "label": "状态",
      "type": "select",
      "options": [
        { "value": 1, "label": "启用" },
        { "value": 0, "label": "禁用" }
      ]
    }
  ],
  "tableColumns": [],
  "searchFields": [],
  "api": {
    "list": "/api/users",
    "create": "/api/users",
    "update": "/api/users/:id",
    "delete": "/api/users/:id"
  }
}
```

**功能点**：

- **字段定义**：key、label、type、placeholder、defaultValue
- **类型支持**：input、textarea、select、radio、checkbox、date、dateRange、upload、switch 等
- **校验规则**：required、min/max、pattern、自定义 validator 名称
- **表格列配置**：列宽、排序、固定列、操作列（编辑/删除）
- **搜索区配置**：哪些字段参与搜索、布局方式（行内/折叠）
- **API 映射**：CRUD 接口路径、请求方法
- **布局与样式**：表单列数、标签宽度、按钮位置

### 2.2 代码生成能力

**生成物**：

- **Vue 单文件组件（.vue）**：包含 template、script、style
- **可选**：配套的 API 封装、类型定义（TypeScript）

**生成策略**：

- **方案 A - 模板引擎**：预置 Vue 模板，根据 JSON 填充变量，适合固定风格
- **方案 B - AI 生成**：将 JSON 配置 + 提示词交给 Cursor/Claude，生成定制化代码
- **方案 C - 混合**：模板生成骨架，AI 负责复杂逻辑或差异化部分

**功能点**：

- 支持生成完整页面代码（含表格、表单、搜索、分页）
- 支持仅生成表单/表格/搜索区等子模块
- 可配置 UI 组件库（Element Plus、Ant Design Vue、Naive UI 等）
- 可配置代码风格（Options API / Composition API、是否 TypeScript）

### 2.3 Web 管理界面

**核心流程**：

```
填写/导入 JSON 配置 → 预览/编辑 → 生成代码 → 一键复制/下载
```

**功能点**：

- **配置编辑**：表单化编辑 or JSON 编辑器（支持语法高亮、校验）
- **配置导入/导出**：上传 JSON 文件、导出当前配置
- **实时预览**：根据配置渲染简易预览（非完整运行环境）
- **代码生成**：选择生成范围（全页面/子模块）、选择组件库
- **输出方式**：复制到剪贴板、下载 .vue 文件、推送到 Cursor 等
- **历史记录**（可选）：保存最近使用的配置，便于复用

---

## 3. 功能优先级

### MVP（第一版，4–6 周）

| 优先级 | 功能         | 说明                                           |
| ------ | ------------ | ---------------------------------------------- |
| P0     | JSON 配置编辑 | 支持基础字段、类型、校验、表格列、搜索区、API 路径 |
| P0     | 模板引擎代码生成 | 预置 1 套 Vue3 + Element Plus 模板，生成完整 list 页面 |
| P0     | Web 界面     | 配置表单 + JSON 编辑 + 一键复制代码             |
| P1     | 配置导入/导出 | 上传/下载 JSON 文件                            |
| P1     | 基础预览     | 根据配置渲染静态表单/表格预览                    |

### V1.1（迭代）

- 支持多种页面类型：form（纯表单）、detail（详情页）
- 支持 Ant Design Vue、Naive UI 等组件库切换
- 支持 Composition API + TypeScript 输出
- 配置校验与错误提示优化

### V1.2（扩展）

- AI 集成：接入 Cursor/Claude API，根据配置 + 自然语言生成代码
- 历史配置管理、模板市场
- 支持生成 API 封装层、路由配置

### V2.0（长期）

- 可视化拖拽配置（替代/补充 JSON）
- 多框架支持（React、Angular）
- 团队协作、权限与审计

---

## 4. 界面设计要求

### 4.1 整体布局

- **左侧**：配置区（表单 + JSON 编辑 Tab 切换）
- **右侧**：预览区 + 生成代码展示区（可折叠）
- **顶部**：操作栏（导入、导出、生成、复制、下载）

### 4.2 设计原则

- **简洁**：减少无关信息，突出「配置 → 生成」主流程
- **高效**：常用操作一键可达，支持快捷键（如 Ctrl+Enter 生成）
- **可发现**：提供示例配置、帮助文档入口
- **响应式**：适配 1280px 以上桌面端（主要使用场景）

### 4.3 关键界面

1. **配置编辑**：分组表单（基础信息、字段列表、表格、搜索、API），支持表格化编辑字段列表
2. **JSON 编辑**：Monaco Editor 或 CodeMirror，带 schema 校验与错误行提示
3. **代码展示**：语法高亮、行号、复制按钮，支持 Tab 切换 template/script/style
4. **预览区**：简化版渲染，不依赖完整运行时，重点展示布局与字段

### 4.4 视觉风格建议

- 偏工具型产品，建议浅色主题为主，代码区支持暗色
- 与主流后台管理系统风格一致，便于用户心智统一

---

## 5. 技术栈建议

### 5.1 Web 应用

| 层级     | 推荐方案                 | 备选             |
| -------- | ------------------------ | ---------------- |
| 框架     | Vue 3 + Vite             | -                |
| UI 组件库 | Element Plus             | Ant Design Vue   |
| JSON 编辑 | Monaco Editor（VS Code 同款） | CodeMirror 6     |
| 表单     | 自定义 + Element Form    | Form Making、Vue Formulate |
| 构建     | Vite                     | -                |

### 5.2 代码生成

| 方案     | 适用场景   | 实现方式                           |
| -------- | ---------- | ---------------------------------- |
| 模板引擎 | MVP、固定风格 | Handlebars、EJS、Nunjucks          |
| AST 转换 | 复杂定制   | Vue 编译器 API、Babel              |
| AI 生成  | 灵活、自然语言 | 调用 OpenAI/Claude API，构造 Prompt |

**MVP 建议**：Handlebars/EJS 模板 + 预置 Vue 模板，快速落地。

### 5.3 配置校验

- 使用 JSON Schema 定义配置结构
- 校验库：Ajv、Vue 的校验集成
- 编辑时实时校验，生成前二次校验

### 5.4 部署

- 静态站点，可部署至 Vercel、Netlify、OSS + CDN
- 无需后端即可运行（生成逻辑全部在前端）

---

## 6. 非功能性需求

### 6.1 性能

- 配置编辑与预览响应时间 < 200ms
- 代码生成时间 < 2s（模板方案）
- 单页应用首屏加载 < 3s（含 Monaco 等重型依赖可考虑按需加载）

### 6.2 安全

- 不持久化用户配置到服务端（纯前端工具）
- 若后续接入 AI：API Key 仅存于用户本地，不上传
- 生成的代码需做基础 XSS 防护（如对用户输入做转义）

### 6.3 可用性

- 支持 Chrome、Edge、Safari 最新两个版本
- 提供清晰错误提示与操作引导
- 关键操作支持撤销（如误删配置）

### 6.4 可维护性

- 模板与业务逻辑分离，便于扩展新组件库
- 配置 schema 版本化，支持向后兼容
- 代码结构清晰，便于团队协作开发

### 6.5 可扩展性

- 插件化设计：新增组件类型、校验规则、模板可插拔
- 预留 AI 接入点，便于后续集成

---

## 附录：配置 Schema 示例（精简版）

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["pageName", "fields"],
  "properties": {
    "pageName": { "type": "string" },
    "pageType": { "enum": ["list", "form", "detail"] },
    "fields": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["key", "label", "type"],
        "properties": {
          "key": { "type": "string" },
          "label": { "type": "string" },
          "type": { "enum": ["input", "select", "date", "textarea", "radio", "switch", "dateRange"] },
          "required": { "type": "boolean" },
          "rules": { "type": "array" },
          "options": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "value": {},
                "label": { "type": "string" }
              }
            }
          }
        }
      }
    },
    "api": {
      "type": "object",
      "properties": {
        "list": { "type": "string" },
        "create": { "type": "string" },
        "update": { "type": "string" },
        "delete": { "type": "string" }
      }
    }
  }
}
```

---

## 下一步行动

1. 确认 MVP 范围与排期
2. 搭建 Vue 3 + Vite 项目骨架
3. 设计并实现 JSON 配置 Schema
4. 开发第一套 Vue + Element Plus 代码生成模板
5. 实现 Web 界面核心流程（配置编辑 → 生成 → 复制）
