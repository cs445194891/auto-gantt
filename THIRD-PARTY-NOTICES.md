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

两个库的许可证全文已从各自 npm 包内的 `package/LICENSE` **原样复制**到本仓库，不做转录改写：

| 文件 | 内容 |
| --- | --- |
| `licenses/SheetJS-Apache-2.0.txt` | Apache License 2.0 全文（201 行） |
| `licenses/Mermaid-MIT.txt` | MIT License 全文（版权 Knut Sveidqvist） |
| `licenses/THIRD-PARTY-NOTICES.txt` | 本声明 + 两份全文的合并版，作为 Release 资产分发 |

`gantt.html` 内嵌这两个库，随 Release 对外分发。依据 Apache-2.0 §4(a)，接收者应获得许可证副本；MIT 要求随副本保留版权与许可声明。因此从 Releases 单独下载 `gantt.html` 时，应一并下载 `THIRD-PARTY-NOTICES.txt`，或直接查阅仓库 `licenses/` 目录。仓库根目录的 `LICENSE` 仅覆盖本项目自研代码（MIT），**不覆盖**上述第三方组件。
