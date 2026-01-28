# KaTeX 字体内联脚本

## 概述

`inline-katex-fonts.js` 脚本用于将 KaTeX 的所有字体文件（woff2 格式）转换为 base64 编码，并内联到 CSS 文件中，实现完全离线的数学公式渲染。

## 功能

- 读取 KaTeX 0.16.27 的 CSS 和字体文件
- 将 20 个 woff2 字体文件转换为 base64 编码
- 生成两个文件：
  - `src/katex-inline.css` - 纯 CSS 文件（约 360KB）
  - `src/katex-inline-css.ts` - TypeScript 导出（约 360KB）

## 使用方法

### 自动运行

脚本会在以下情况自动运行：

- `npm run build` - 构建前自动执行（通过 `prebuild` 钩子）
- `npm run prepare` - 安装依赖后自动执行

### 手动运行

```bash
cd packages/core
node scripts/inline-katex-fonts.js
```

## 输出文件

### katex-inline.css

纯 CSS 文件，包含完整的 KaTeX 样式和 base64 编码的字体。

### katex-inline-css.ts

TypeScript 文件，导出 `katexInlineCss` 常量，供其他 TypeScript 模块使用。

```typescript
import { katexInlineCss } from "./katex-inline-css";
// katexInlineCss 是一个包含完整 CSS 的字符串
```

## 注意事项

1. **文件大小**：生成的文件约 360KB，已提交到代码仓库
2. **版本依赖**：基于 KaTeX 0.16.27，如果升级 KaTeX 版本需重新生成
3. **不要手动编辑**：这些文件是自动生成的，手动修改会被覆盖
4. **字体格式**：只包含 woff2 格式（所有现代浏览器都支持）

## 技术细节

- **字体数量**：20 个 woff2 文件
- **总大小**：约 250KB（压缩前）→ 360KB（base64 后）
- **编码方式**：base64 data URI
- **兼容性**：支持所有现代浏览器（IE11+ 支持 woff2）

## 导出功能

生成的 CSS 用于 HTML/PDF 导出功能，确保：

- ✅ 完全离线可用
- ✅ 无需外部 CDN
- ✅ 数学公式正确渲染
- ✅ 支持打印和 PDF 生成
