# auto-gantt｜单文件离线甘特图生成器

一个无需后端、无需联网的单页面工具：导入 Excel/CSV 模板或直接在页面里填写任务，即时生成甘特图；支持三种视觉风格、两套渲染引擎、十项外观设置，并可导出为多种格式。

**本仓库是源码仓库**：构建产物（`gantt.html` 与 `甘特图模板.xlsx`）不纳入版本控制，需本地构建生成；也可直接从 [Releases](https://github.com/cs445194891/auto-gantt/releases) 下载预构建成品，无需构建。

## 快速开始

```bash
npm install
npm run build
```

构建完成后得到：

| 文件 | 说明 |
| --- | --- |
| `gantt.html` | 约 4.1 MB 的自包含单文件，内嵌 SheetJS 与 Mermaid，**双击即可离线使用** |
| `甘特图模板.xlsx` | 7 列标准模板（「任务数据」+「填写说明」两个工作表） |

也可以直接执行 `node build/build.js`。网页本身还提供「下载 Excel 模板」按钮，因此即使不构建，只要拿到 `gantt.html` 也能生成模板。

### 依赖从哪来

`build/build.js` 按以下顺序查找两个 UMD 构建：

1. `build/vendor/xlsx.full.min.js`、`build/vendor/mermaid.min.js`（离线缓存，不入库）；
2. `node_modules/xlsx/dist/xlsx.full.min.js`、`node_modules/mermaid/dist/mermaid.min.js`（`npm install` 得到）。

两者都缺时会报错并给出指引。已核实：npm 包 `xlsx@0.18.5` 与 `mermaid@10.9.3` 内的这两个 `dist/*.min.js`，与本项目原始 `build/vendor/` 文件的 SHA-256 完全一致，因此两种路径生成的 `gantt.html` 字节一致。

## 使用方法

1. 打开构建出的 `gantt.html`；
2. 导入 `.xlsx / .xls / .csv`（或页面导出的 `.json`），也可直接编辑页面下方的数据表格；
3. 选择风格（正式 / 简约 / 花哨）与渲染引擎（SVG 精细 / Mermaid）；
4. 展开「外观设置」调整字号、文字色、已完成色、未完成色等，三种风格各自独立保存并随 JSON 导入导出；
5. 导出所需格式。

### 模板字段口径

| 列 | 必填 | 说明 |
| --- | --- | --- |
| 任务名称 | 是 | 文本，建议不超过 20 字 |
| 开始日期 | 是 | `YYYY-MM-DD`；也兼容 `2026/11/9`、`2026年11月9日`、Excel 日期序列号 |
| 结束日期 | 是 | 含结束当日；里程碑行可留空 |
| 分组 | 否 | 同名分组自动归入同一段，按首次出现顺序排列 |
| 进度 % | 否 | 0–100 的整数，不按小数比例解释；留空按 0 |
| 负责人 | 否 | 仅作鼠标悬停提示，不显示在条形上 |
| 里程碑 | 否 | `是 / Y / 1 / ✓` 均视为里程碑，显示为菱形单点 |

### 导出格式

PNG（2 倍分辨率）、SVG、PDF（调起浏览器打印对话框，横向另存为 PDF）、CSV、XLSX、JSON、Mermaid `.mmd` 代码。

## 已知边界

- Mermaid gantt 语法没有原生「进度百分比」与任务级配色，该引擎用 `done / active` 状态标签 + 任务名后缀近似表达，风格差异小于 SVG 引擎。
- PDF 不是直接生成 `.pdf` 文件，而是打印对话框另存。
- `gantt.html` 的体积主要来自内嵌的两个第三方库，不是自研代码冗余。
- 本工具不实现任务依赖、关键路径、资源平衡、挣值等项目管理逻辑。

## 目录结构

```
.
├── build/
│   ├── gantt.src.html      # 带占位符的源码（HTML/CSS/JS 全在此）
│   ├── build.js            # 内嵌依赖并生成 HTML 与 Excel 模板
│   └── vendor/             # 本地离线缓存（.gitignore 忽略）
├── licenses/               # 两个第三方库的许可证全文 + 合并声明
├── package.json
├── README.md
├── THIRD-PARTY-NOTICES.md
└── .gitignore
```

修改源码后重新执行 `npm run build` 即可。若改动了依赖版本，需同步核对内嵌逻辑与 `THIRD-PARTY-NOTICES.md`。

## 许可证

本仓库自研代码采用 **MIT** 许可证（仓库初始化时已生成 `LICENSE`）。内嵌第三方库的许可证另见 [THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md)：SheetJS 为 Apache-2.0，Mermaid 为 MIT，两者的**完整许可证全文**已原样收录在 `licenses/` 目录，并随 Release 以 `THIRD-PARTY-NOTICES.txt` 分发。单独下载 `gantt.html` 时请一并保留该声明文件。
