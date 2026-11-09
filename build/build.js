/* 把离线依赖内嵌进单文件 HTML，并生成配套 Excel 模板 */
const fs = require('fs');
const path = require('path');

const DIR = __dirname;
const ROOT = path.resolve(DIR, '..');
const VENDOR = path.join(DIR, 'vendor');

/** 依赖解析：优先 build/vendor/（离线缓存），其次 npm 依赖。两者都缺时给出明确指引。 */
function resolveLib(vendorFile, npmRelative, pkgName) {
  const local = path.join(VENDOR, vendorFile);
  if (fs.existsSync(local)) return local;
  const fromNpm = path.join(ROOT, 'node_modules', npmRelative);
  if (fs.existsSync(fromNpm)) return fromNpm;
  throw new Error(
    '缺少构建依赖 ' + pkgName + '。请执行下列任一操作后重试：\n' +
    '  1) npm install（见 package.json 中锁定的版本）\n' +
    '  2) 手动把该库的 UMD 构建放到 ' + path.relative(ROOT, local) + '\n' +
    '已查找：' + path.relative(ROOT, fromNpm)
  );
}

const xlsxPath = resolveLib('xlsx.full.min.js', path.join('xlsx', 'dist', 'xlsx.full.min.js'), 'xlsx@0.18.5');
const mmdPath = resolveLib('mermaid.min.js', path.join('mermaid', 'dist', 'mermaid.min.js'), 'mermaid@10.9.3');

let src = fs.readFileSync(path.join(DIR, 'gantt.src.html'), 'utf8');
const xlsxLib = fs.readFileSync(xlsxPath, 'utf8');
const mmdLib = fs.readFileSync(mmdPath, 'utf8');

// 用函数形式替换，避免库内容中的 $& / $' 被当作替换模式解释
if (!src.includes('/*__XLSX_LIB__*/') || !src.includes('/*__MERMAID_LIB__*/')) {
  throw new Error('占位符缺失，源文件可能已被构建过');
}
src = src.replace('/*__XLSX_LIB__*/', () => xlsxLib)
         .replace('/*__MERMAID_LIB__*/', () => mmdLib);
const outHtml = path.join(ROOT, 'gantt.html');
fs.writeFileSync(outHtml, src, 'utf8');
console.log('HTML:', outHtml, (fs.statSync(outHtml).size / 1024 / 1024).toFixed(2), 'MB');

// 配套 Excel 模板（与网页「下载 Excel 模板」内容一致）
const XLSX = require(xlsxPath);
const d = new Date();
const pad = n => (n < 10 ? '0' + n : '' + n);
const iso = off => {
  const x = new Date(d.getTime() + off * 86400000);
  return x.getFullYear() + '-' + pad(x.getMonth() + 1) + '-' + pad(x.getDate());
};
const data = [
  ['分组', '任务名称', '开始日期', '结束日期', '进度 %', '里程碑'],
  ['一、准备阶段', '示例：需求调研与范围确认', iso(0), iso(5), 100, '否'],
  ['一、准备阶段', '示例：方案编制与评审', iso(3), iso(12), 60, '否'],
  ['二、实施阶段', '示例：立项评审通过', iso(14), iso(14), 0, '是']
];
const note = [
  ['字段', '是否必填', '格式 / 说明'],
  ['分组', '选填', '首列；相同分组自动归入同一段，按首次出现顺序排列'],
  ['任务名称', '必填', '文本，任意字符；建议不超过 20 字'],
  ['开始日期', '必填', 'YYYY-MM-DD，如 ' + iso(0) + '；也支持 2026/11/9、2026年11月9日'],
  ['结束日期', '必填', '同上；含结束当日。里程碑行可留空'],
  ['进度 %', '选填', '0–100 的整数；不按小数比例解释；留空按 0 处理'],
  ['里程碑', '选填', '填 是 / Y / 1 / ✓ 均视为里程碑，显示为菱形单点'],
  ['', '', ''],
  ['提示', '', '本表第一行为表头，从第二行开始填任务；空白行会被忽略'],
  ['提示', '', '模板中带「示例：」前缀的 3 行仅供参照格式，正式填写前请删除'],
  ['提示', '', '导入支持 .xlsx / .xls / .csv，也支持网页导出的 .json'],
  ['提示', '', '本表为 6 列；旧版 7 列模板中的「负责人」列会被自动忽略，其余列按表头名读取'],
  ['提示', '', '页面表格可拖动行首 ⠿ 手柄在同一分组内排序，跨分组不可拖放；导出按当前顺序'],
  ['提示', '', '本工具不做任务依赖、关键路径、资源平衡等项目管理逻辑']
];
const wb = XLSX.utils.book_new();
const ws = XLSX.utils.aoa_to_sheet(data);
ws['!cols'] = [{wch:18},{wch:28},{wch:14},{wch:14},{wch:10},{wch:10}];
XLSX.utils.book_append_sheet(wb, ws, '任务数据');
XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(note), '填写说明');
const outXlsx = path.join(ROOT, '甘特图模板.xlsx');
// UMD 构建在 Node 下不自带 fs，改用 buffer 自行写入
const buf = XLSX.write(wb, {bookType: 'xlsx', type: 'buffer'});
fs.writeFileSync(outXlsx, buf);
console.log('XLSX:', outXlsx, (fs.statSync(outXlsx).size / 1024).toFixed(1), 'KB');
