/**
 * 使用 PptxGenJS 生成项目介绍幻灯片（遵循 openskills pptx + 排版：行距/防溢出）
 * 输出: public/presentation/project-intro.pptx
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import pptxgen from 'pptxgenjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.join(__dirname, '..', 'public', 'presentation')
const outFile = path.join(outDir, 'project-intro.pptx')

const C = {
  dark: '0F172A',
  dark2: '1E293B',
  teal: '0D9488',
  tealLight: '14B8A6',
  mint: '5EEAD4',
  ice: 'CCFBF1',
  white: 'FFFFFF',
  slate: '94A3B8',
  slateDark: '334155',
  paper: 'F8FAFC',
  paper2: 'F1F5F9'
}

/** 中文演示优先雅黑；无则由 Office 回退 */
const FONT = 'Microsoft YaHei'
const FONT_MONO = 'Consolas'

/** 多行标题：行距 = 约 1.25×字号（pt，Exactly） */
function lineSpacingFor(fontPt) {
  return Math.round(fontPt * 1.28)
}

function shadowOuter() {
  return { type: 'outer', color: '000000', blur: 8, offset: 2, angle: 135, opacity: 0.12 }
}

fs.mkdirSync(outDir, { recursive: true })

const pres = new pptxgen()
pres.layout = 'LAYOUT_16x9'
pres.author = 'ai-create-houtai'
pres.title = '后台管理系统代码生成器'
pres.subject = 'Vue 配置驱动 · 项目介绍'

// --- 1 封面 深色 ---
{
  const slide = pres.addSlide()
  slide.background = { color: C.dark }
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0,
    y: 0,
    w: 0.14,
    h: 5.625,
    fill: { color: C.teal },
    line: { color: C.teal, width: 0 }
  })
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 6.15,
    y: 0.75,
    w: 3.6,
    h: 3.65,
    fill: { color: C.dark2 },
    line: { color: C.teal, width: 1 },
    shadow: shadowOuter()
  })
  slide.addText(
    [
      { text: 'VUE · LOW-CODE 辅助工具', options: { breakLine: true, fontSize: 12, color: C.mint, fontFace: FONT } }
    ],
    { x: 0.5, y: 1.05, w: 5.4, h: 0.45, margin: 0, valign: 'top', lineSpacingMultiple: 1.2 }
  )
  slide.addText('后台管理系统\n代码生成器', {
    x: 0.5,
    y: 1.5,
    w: 5.5,
    h: 2.1,
    fontSize: 38,
    bold: true,
    color: C.white,
    fontFace: FONT,
    lineSpacing: lineSpacingFor(38),
    margin: 0,
    valign: 'top'
  })
  slide.addText('配置驱动，分钟级产出列表页：搜索区 · 表格 · 分页 · 一键复制 / 下载 .vue', {
    x: 0.5,
    y: 3.75,
    w: 5.85,
    h: 1.35,
    fontSize: 14,
    color: C.slate,
    fontFace: FONT,
    margin: 0,
    valign: 'top',
    lineSpacingMultiple: 1.35,
    wrap: true
  })
}

// --- 2 痛点 浅色（左侧列表与右侧卡互不挤压）---
{
  const slide = pres.addSlide()
  slide.background = { color: C.paper }
  slide.addShape(pres.shapes.OVAL, {
    x: 0.5,
    y: 0.45,
    w: 0.42,
    h: 0.42,
    fill: { color: C.teal },
    line: { width: 0 }
  })
  slide.addText('我们在解决什么问题？', {
    x: 1.02,
    y: 0.4,
    w: 8.5,
    h: 0.65,
    fontSize: 30,
    bold: true,
    color: C.dark,
    fontFace: FONT,
    margin: 0,
    valign: 'middle'
  })
  slide.addText(
    [
      {
        text: '后台 CRUD 页面高度重复：筛选项、表格、分页结构雷同',
        options: { bullet: true, breakLine: true, fontSize: 15, color: C.slateDark, fontFace: FONT, paraSpaceAfter: 10 }
      },
      {
        text: '手工复制粘贴与微调，单次开发往往耗费数小时',
        options: { bullet: true, breakLine: true, fontSize: 15, color: C.slateDark, fontFace: FONT, paraSpaceAfter: 10 }
      },
      {
        text: '团队输出风格不一致，后续维护与 Code Review 成本高',
        options: { bullet: true, fontSize: 15, color: C.slateDark, fontFace: FONT }
      }
    ],
    {
      x: 0.5,
      y: 1.2,
      w: 6.55,
      h: 3.5,
      margin: [2, 4, 2, 4],
      valign: 'top',
      lineSpacingMultiple: 1.28
    }
  )
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 7.2,
    y: 1.15,
    w: 2.3,
    h: 3.45,
    fill: { color: C.ice },
    line: { color: C.tealLight, width: 1 }
  })
  slide.addText('⏱', {
    x: 7.35,
    y: 1.85,
    w: 2,
    h: 0.65,
    fontSize: 34,
    align: 'center',
    margin: 0,
    valign: 'middle'
  })
  slide.addText('2h → 分钟级', {
    x: 7.2,
    y: 2.85,
    w: 2.3,
    h: 1.1,
    fontSize: 13,
    bold: true,
    color: C.teal,
    align: 'center',
    fontFace: FONT,
    margin: 0,
    valign: 'top',
    lineSpacingMultiple: 1.2
  })
}

// --- 3 定位 双栏 ---
{
  const slide = pres.addSlide()
  slide.background = { color: C.white }
  slide.addText('产品定位', {
    x: 0.5,
    y: 0.38,
    w: 9,
    h: 0.62,
    fontSize: 30,
    bold: true,
    color: C.dark,
    fontFace: FONT,
    margin: 0,
    valign: 'middle'
  })
  slide.addText(
    '面向 Vue 技术栈的配置驱动工具：用结构化配置快速生成「搜索 + 表格 + 分页」等典型后台页面代码，并可与 Cursor / Claude 等 AI 工具链结合扩展。',
    {
      x: 0.5,
      y: 1.05,
      w: 4.45,
      h: 2.85,
      fontSize: 14,
      color: C.slateDark,
      fontFace: FONT,
      valign: 'top',
      margin: [0, 4, 0, 0],
      lineSpacingMultiple: 1.32,
      wrap: true
    }
  )
  const cards = [
    ['配置即文档', '协作与迭代有据可查'],
    ['Handlebars 模板', '稳定、可预期的代码风格'],
    ['可扩展', '多组件库 · TS · AI 生成']
  ]
  let cy = 1.05
  for (const [t, d] of cards) {
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 5.1,
      y: cy,
      w: 4.4,
      h: 1.08,
      fill: { color: C.paper },
      line: { color: C.paper2, width: 1 },
      shadow: shadowOuter()
    })
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 5.1,
      y: cy,
      w: 0.09,
      h: 1.08,
      fill: { color: C.teal },
      line: { width: 0 }
    })
    slide.addText(t, {
      x: 5.32,
      y: cy + 0.12,
      w: 4,
      h: 0.42,
      fontSize: 14,
      bold: true,
      color: C.dark,
      fontFace: FONT,
      margin: 0,
      valign: 'top'
    })
    slide.addText(d, {
      x: 5.32,
      y: cy + 0.52,
      w: 4,
      h: 0.52,
      fontSize: 12,
      color: C.slateDark,
      fontFace: FONT,
      margin: 0,
      valign: 'top',
      lineSpacingMultiple: 1.25,
      wrap: true
    })
    cy += 1.18
  }
}

// --- 4 核心价值 三卡片 ---
{
  const slide = pres.addSlide()
  slide.background = { color: C.paper }
  slide.addText('核心价值', {
    x: 0.5,
    y: 0.38,
    w: 9,
    h: 0.58,
    fontSize: 30,
    bold: true,
    color: C.dark,
    fontFace: FONT,
    margin: 0
  })
  const stats = [
    ['提效', '小时级 → 分钟级', '0D9488'],
    ['一致', '模板统一 Element Plus 风格', '14B8A6'],
    ['可维护', '配置即规格，便于复用', '0F766E']
  ]
  let sx = 0.5
  for (let i = 0; i < 3; i++) {
    slide.addShape(pres.shapes.RECTANGLE, {
      x: sx,
      y: 1.2,
      w: 3,
      h: 3.05,
      fill: { color: C.white },
      line: { color: C.paper2, width: 1 },
      shadow: shadowOuter()
    })
    sx += 3.2
  }
  sx = 0.5
  for (const [big, sub, col] of stats) {
    slide.addText(big, {
      x: sx,
      y: 1.38,
      w: 3,
      h: 1.05,
      fontSize: 32,
      bold: true,
      color: col,
      align: 'center',
      fontFace: FONT,
      margin: 0,
      valign: 'middle'
    })
    slide.addText(sub, {
      x: sx + 0.2,
      y: 2.55,
      w: 2.6,
      h: 1.55,
      fontSize: 13,
      color: C.slateDark,
      align: 'center',
      fontFace: FONT,
      margin: [0, 2, 0, 2],
      valign: 'top',
      lineSpacingMultiple: 1.3,
      wrap: true
    })
    sx += 3.2
  }
}

// --- 5 目标用户 表格 ---
{
  const slide = pres.addSlide()
  slide.background = { color: C.white }
  slide.addText('目标用户', {
    x: 0.5,
    y: 0.38,
    w: 9,
    h: 0.58,
    fontSize: 30,
    bold: true,
    color: C.dark,
    fontFace: FONT,
    margin: 0
  })
  slide.addTable(
    [
      [
        { text: '角色', options: { fill: { color: C.teal }, color: C.white, bold: true, fontFace: FONT } },
        { text: '场景与诉求', options: { fill: { color: C.teal }, color: C.white, bold: true, fontFace: FONT } }
      ],
      [
        { text: '前端开发', options: { fontFace: FONT } },
        { text: '减少重复劳动，专注业务逻辑', options: { fontFace: FONT } }
      ],
      [
        { text: '全栈 / 后端', options: { fontFace: FONT } },
        { text: '不熟悉 Vue 也能产出可用页面骨架', options: { fontFace: FONT } }
      ],
      [
        { text: '技术负责人', options: { fontFace: FONT } },
        { text: '配置驱动，统一团队输出风格', options: { fontFace: FONT } }
      ],
      [
        { text: '产品 / 运营', options: { fontFace: FONT } },
        { text: '快速生成可演示的页面结构', options: { fontFace: FONT } }
      ]
    ],
    {
      x: 0.5,
      y: 1.08,
      w: 9,
      h: 3.95,
      colW: [2.35, 6.65],
      rowH: [0.42, 0.62, 0.62, 0.62, 0.62],
      border: { pt: 0.5, color: 'E2E8F0' },
      fontSize: 13,
      color: C.slateDark,
      valign: 'middle',
      margin: [0.1, 0.08, 0.1, 0.08],
      autoPage: false
    }
  )
}

// --- 6 流程（两行，避免总宽度超出 10"）---
{
  const slide = pres.addSlide()
  slide.background = { color: C.paper }
  slide.addText('使用流程', {
    x: 0.5,
    y: 0.38,
    w: 9,
    h: 0.58,
    fontSize: 30,
    bold: true,
    color: C.dark,
    fontFace: FONT,
    margin: 0
  })
  const row1 = ['基础配置', '表格配置', '筛选项']
  const row2 = ['生成代码', '复制 / 下载']
  const boxW = 1.85
  const boxH = 0.68
  const gap = 0.22
  function drawRow(steps, y0) {
    let x = 0.5
    for (let i = 0; i < steps.length; i++) {
      slide.addShape(pres.shapes.RECTANGLE, {
        x,
        y: y0,
        w: boxW,
        h: boxH,
        fill: { color: C.teal },
        line: { width: 0 }
      })
      slide.addText(steps[i], {
        x,
        y: y0 + 0.06,
        w: boxW,
        h: boxH - 0.12,
        fontSize: 11,
        bold: true,
        color: C.white,
        align: 'center',
        valign: 'middle',
        fontFace: FONT,
        margin: [2, 4, 2, 4],
        lineSpacingMultiple: 1.15,
        wrap: true
      })
      if (i < steps.length - 1) {
        slide.addText('→', {
          x: x + boxW,
          y: y0 + 0.18,
          w: gap,
          h: 0.35,
          fontSize: 14,
          color: C.slateDark,
          align: 'center',
          margin: 0
        })
      }
      x += boxW + gap
    }
  }
  drawRow(row1, 1.35)
  drawRow(row2, 2.25)
  slide.addText(
    '在 Web 界面完成配置后，一键生成完整 .vue 单文件（template + script + style），可直接粘贴到业务仓库。',
    {
      x: 0.5,
      y: 3.25,
      w: 9,
      h: 1.55,
      fontSize: 14,
      color: C.slateDark,
      fontFace: FONT,
      margin: [0, 4, 0, 4],
      valign: 'top',
      lineSpacingMultiple: 1.32,
      wrap: true
    }
  )
}

// --- 7 已实现 深色 ---
{
  const slide = pres.addSlide()
  slide.background = { color: C.dark }
  slide.addText('已实现能力', {
    x: 0.5,
    y: 0.42,
    w: 9,
    h: 0.62,
    fontSize: 30,
    bold: true,
    color: C.white,
    fontFace: FONT,
    margin: 0
  })
  const items = [
    ['筛选项', 'input · select · date · 范围 · 多选 · 级联'],
    ['表格', '列配置 · 表头固定 · 示例数据 · 可选操作列'],
    ['生成物', 'Vue3 + Element Plus · 4 空格缩进'],
    ['工程', 'JSON Schema（Ajv）· 默认配置 · 路由入口']
  ]
  let y = 1.15
  for (const [head, body] of items) {
    slide.addShape(pres.shapes.OVAL, {
      x: 0.52,
      y: y + 0.1,
      w: 0.36,
      h: 0.36,
      fill: { color: C.tealLight },
      line: { width: 0 }
    })
    slide.addText(head, {
      x: 1.02,
      y,
      w: 2.2,
      h: 0.4,
      fontSize: 16,
      bold: true,
      color: C.mint,
      fontFace: FONT,
      margin: 0,
      valign: 'top'
    })
    slide.addText(body, {
      x: 1.02,
      y: y + 0.42,
      w: 8.45,
      h: 0.78,
      fontSize: 13,
      color: C.slate,
      fontFace: FONT,
      margin: 0,
      valign: 'top',
      lineSpacingMultiple: 1.28,
      wrap: true
    })
    y += 1.18
  }
}

// --- 8 技术栈 ---
{
  const slide = pres.addSlide()
  slide.background = { color: C.white }
  slide.addText('技术栈', {
    x: 0.5,
    y: 0.38,
    w: 9,
    h: 0.58,
    fontSize: 30,
    bold: true,
    color: C.dark,
    fontFace: FONT,
    margin: 0
  })
  const tags = ['Vue 3', 'Vite', 'Element Plus', 'Vue Router', 'Handlebars', 'Ajv · JSON Schema']
  let tx = 0.5
  let ty = 1.12
  const tagH = 0.56
  for (const tag of tags) {
    const w = Math.min(3.1, 0.42 + tag.length * 0.12)
    slide.addShape(pres.shapes.RECTANGLE, {
      x: tx,
      y: ty,
      w,
      h: tagH,
      fill: { color: C.ice },
      line: { color: C.teal, width: 1 }
    })
    slide.addText(tag, {
      x: tx,
      y: ty + 0.1,
      w,
      h: tagH - 0.2,
      fontSize: 12,
      bold: true,
      color: C.dark2,
      align: 'center',
      valign: 'middle',
      fontFace: FONT,
      margin: [2, 6, 2, 6],
      lineSpacingMultiple: 1.1,
      wrap: true
    })
    tx += w + 0.18
    if (tx + 1.5 > 10) {
      tx = 0.5
      ty += tagH + 0.2
    }
  }
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5,
    y: 3.2,
    w: 9,
    h: 1.55,
    fill: { color: C.paper },
    line: { color: 'E2E8F0', width: 1 }
  })
  slide.addText('src/generator  ·  src/components  ·  src/config  ·  src/schema', {
    x: 0.62,
    y: 3.38,
    w: 8.76,
    h: 0.55,
    fontSize: 12,
    color: C.slateDark,
    fontFace: FONT_MONO,
    margin: 0,
    valign: 'top',
    lineSpacingMultiple: 1.25,
    wrap: true
  })
  slide.addText('npm run dev → http://localhost:5173', {
    x: 0.62,
    y: 4.05,
    w: 8.5,
    h: 0.55,
    fontSize: 13,
    color: C.teal,
    bold: true,
    fontFace: FONT,
    margin: 0,
    valign: 'top'
  })
}

// --- 9 路线图 ---
{
  const slide = pres.addSlide()
  slide.background = { color: C.paper }
  slide.addText('规划方向（PRD）', {
    x: 0.5,
    y: 0.38,
    w: 9,
    h: 0.58,
    fontSize: 30,
    bold: true,
    color: C.dark,
    fontFace: FONT,
    margin: 0
  })
  slide.addText(
    [
      {
        text: '配置导入 / 导出 · Monaco 级 JSON 编辑 · 实时预览',
        options: { bullet: true, breakLine: true, fontSize: 14, color: C.slateDark, fontFace: FONT, paraSpaceAfter: 8 }
      },
      {
        text: 'Composition API + TypeScript 输出选项',
        options: { bullet: true, breakLine: true, fontSize: 14, color: C.slateDark, fontFace: FONT, paraSpaceAfter: 8 }
      },
      {
        text: 'Ant Design Vue · Naive UI 等多组件库切换',
        options: { bullet: true, breakLine: true, fontSize: 14, color: C.slateDark, fontFace: FONT, paraSpaceAfter: 8 }
      },
      {
        text: '与 AI 深度结合：自然语言 + 配置联合生成',
        options: { bullet: true, fontSize: 14, color: C.slateDark, fontFace: FONT }
      }
    ],
    {
      x: 0.5,
      y: 1.12,
      w: 5.85,
      h: 3.55,
      margin: [2, 4, 2, 4],
      valign: 'top',
      lineSpacingMultiple: 1.3
    }
  )
  slide.addChart(
    pres.charts.BAR,
    [
      {
        name: '优先级',
        labels: ['MVP', 'V1.1', 'V1.2'],
        values: [90, 65, 40]
      }
    ],
    {
      x: 6.45,
      y: 1.08,
      w: 3.05,
      h: 3.35,
      barDir: 'col',
      chartColors: ['0D9488', '14B8A6', '5EEAD4'],
      chartArea: { fill: { color: 'FFFFFF' }, roundedCorners: true },
      catAxisLabelColor: '64748B',
      valAxisLabelColor: '64748B',
      valGridLine: { color: 'E2E8F0', size: 0.5 },
      catGridLine: { style: 'none' },
      showLegend: false,
      showTitle: true,
      title: '迭代重心（示意）',
      titleFontSize: 10,
      titleColor: '334155'
    }
  )
}

// --- 10 结尾 深色 ---
{
  const slide = pres.addSlide()
  slide.background = { color: C.dark }
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0,
    y: 0,
    w: 10,
    h: 5.625,
    fill: { color: C.dark2, transparency: 40 },
    line: { width: 0 }
  })
  slide.addText('总结', {
    x: 0.5,
    y: 1.2,
    w: 9,
    h: 0.48,
    fontSize: 17,
    color: C.mint,
    fontFace: FONT,
    margin: 0,
    valign: 'middle'
  })
  slide.addText('结构化配置 + 模板引擎\n= 后台页面开发提效', {
    x: 0.5,
    y: 1.72,
    w: 8.9,
    h: 1.75,
    fontSize: 34,
    bold: true,
    color: C.white,
    fontFace: FONT,
    lineSpacing: lineSpacingFor(34),
    margin: 0,
    valign: 'top'
  })
  slide.addText('谢谢聆听  ·  Q & A', {
    x: 0.5,
    y: 3.75,
    w: 9,
    h: 0.85,
    fontSize: 20,
    color: C.tealLight,
    fontFace: FONT,
    margin: 0,
    valign: 'top',
    lineSpacingMultiple: 1.2
  })
}

await pres.writeFile({ fileName: outFile })
console.log('Written:', outFile)
