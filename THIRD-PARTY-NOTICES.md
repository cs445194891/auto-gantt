# 第三方组件声明

构建产物 `gantt.html` 内嵌以下两个 UMD 构建，以便完全离线运行。源码仓库本身不分发这些库文件；它们由 `npm install` 获取，或由使用者自行放入 `build/vendor/`。

| 组件 | 锁定版本 | 用途 | 许可证 | 来源 |
| --- | --- | --- | --- | --- |
| SheetJS Community Edition (`xlsx`) | 0.18.5 | 读取 `.xlsx / .xls / .csv`，写出 `.xlsx`，生成 Excel 模板 | Apache-2.0 | https://www.npmjs.com/package/xlsx/v/0.18.5 |
| Mermaid | 10.9.3 | 可选的 Mermaid gantt 渲染引擎与 `.mmd` 代码导出 | MIT | https://www.npmjs.com/package/mermaid/v/10.9.3 |

## 核实依据

- 版本号与 SPDX 许可证标识取自 npm registry 元数据（`npm view xlsx@0.18.5 license version`、`npm view mermaid@10.9.3 license version`），查询日期 2026-11-09。
- 包内目标路径已核实：`package/dist/xlsx.full.min.js`、`package/dist/mermaid.min.js`。
- 两个 npm 包内目标文件与本项目原始 `build/vendor/` 文件 SHA-256 一致：
  - `xlsx.full.min.js` = `c9506197caf809a075b6dee1da0d36fb19da7158ffe8a88e7b0c96c5d8623c99`
  - `mermaid.min.js` = `5a8ec91820bd55afef049068489369910e5d6ce70c8103952f27e29d3e76e8bc`

## 完整许可证文本

Apache-2.0 与 MIT 的完整条款未在本文件内转录（避免转录失真），请在执行 `npm install` 后查阅：

- `node_modules/xlsx/LICENSE`
- `node_modules/mermaid/LICENSE`

若将 `gantt.html` 作为独立文件对外分发，应随附本声明及上述完整许可证文本。
