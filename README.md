# 后台管理系统代码生成器

通过 JSON 配置驱动，快速生成 Vue 页面代码。

## 技术栈

- Vue 3 + Vite
- Element Plus
- Vue Router
- Handlebars（代码生成模板）
- Ajv（配置校验）

## 项目结构

```
src/
├── config/          # 默认配置
├── schema/          # JSON Schema
├── utils/            # 工具函数
├── generator/        # 代码生成逻辑
├── components/       # 公共组件
├── views/            # 页面
├── router/           # 路由
└── assets/           # 静态资源
```

## 开发

```bash
# 安装依赖
npm install

# 若遇到 @rollup/rollup-darwin-arm64 缺失，可显式安装：
# npm install @rollup/rollup-darwin-arm64 --save-dev

# 启动开发服务器
npm run dev
```

访问 http://localhost:5173

## 构建

```bash
npm run build
```

## 预览构建结果

```bash
npm run preview
```
