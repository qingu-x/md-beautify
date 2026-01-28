export const templateTheme = `/*
 * ============================================
 * MDB 主题模板 | MDB Theme Template
 * ============================================
 * 
 * 使用说明 | Instructions:
 * 1. 修改下方的样式定义，创建你的自定义主题 | Modify the style definitions below to create your custom theme
 * 2. 所有选择器必须以 #mdb 开头 | All selectors must start with #mdb
 * 3. 代码块使用 #mdb pre code.hljs，不要设置全局 color | Use #mdb pre code.hljs for code blocks, do not set a global color
 * 
 * ============================================
 * 🌙 深色模式说明（微信兼容） | Dark Mode Instructions (WeChat Compatibility)
 * ============================================
 * 
 * ✅ 支持自动转换的颜色格式 | Supported color formats for automatic conversion:
 *   - HEX: #333333, #fff
 *   - RGB: rgb(51, 51, 51), rgba(0, 0, 0, 0.5)
 *   - HSL: hsl(0, 0%, 20%), hsla(0, 0%, 0%, 0.5)
 *   - 渐变 | Gradients: linear-gradient(), radial-gradient() 中的色值
 * 
 * 🔄 智能转换规则（色彩语义保全） | Smart conversion rules (color semantic preservation):
 *   - 灰度背景 → 映射到深色区间 (10%-20% 亮度) | Grayscale background -> mapped to dark range (10%-20% brightness)
 *   - 高饱和色彩 (S>15%) → 保持鲜艳，亮度钳制在 35%-55% | High saturation colors (S>15%) -> kept vivid, brightness clamped at 35%-55%
 *   - 深色阴影/边框 (L<20) → 锚定为暗色，不反转 | Dark shadows/borders (L<20) -> anchored as dark, no inversion
 *   - 文字颜色 → 动态对比度调整以保证可读性 | Text color -> dynamic contrast adjustment to ensure readability
 * 
 * ⚠️ 不会被转换 | Will not be converted:
 *   - CSS 变量 | CSS variables: var(--xxx)
 *   - 图片 | Images: url()
 *   - 颜色名称 | Color names: white, black（请使用 HEX 格式 | Please use HEX format）
 * 
 * 💡 设计建议 | Design suggestions:
 *   - 背景色用透明或浅灰，利于自动适配 | Use transparent or light gray for background color for better auto-adaptation
 *   - 彩色装饰保持原值，算法自动保护 | Keep colored decorations as is, algorithm protects them automatically
 *   - 深色投影和粗边框使用纯黑 #000，可保持层级感 | Use pure black #000 for dark shadows and thick borders to maintain hierarchy
 */

/* ============================================
 * 1. 全局容器样式 | Global Container Styles
 * ============================================
 */
#mdb {
    padding: 30px 20px;
    max-width: 677px;
    margin: 0 auto;
    font-family: -apple-system, BlinkMacSystemFont, "Microsoft YaHei", sans-serif;
    color: #333;
    background-color: transparent;
    /* 透明背景，兼容微信深色模式 | Transparent background, compatible with WeChat dark mode */
    word-break: break-word;
}

/* ============================================
 * 2. 段落样式 | Paragraph Styles
 * ============================================
 */
#mdb p {
    margin: 16px 0;
    /* 段落间距：上下各 16px | Paragraph spacing: 16px top and bottom */
    line-height: 1.7;
    /* 行高：1.7 倍，舒适阅读 | Line height: 1.7x, comfortable reading */
    text-align: justify;
    /* 文本对齐：两端对齐 | Text alignment: justify */
    color: #333;
    /* 文字颜色 | Text color */
    font-size: 16px;
    /* 字体大小 | Font size */
}

/* ============================================
 * 3. 标题样式 | Heading Styles
 * ============================================
 * 注意：标题内部结构为 | Note: Heading internal structure is:
 * <h1>
 *   <span class="prefix"></span>
 *   <span class="content">标题文字 | Heading Text</span>
 *   <span class="suffix"></span>
 * </h1>
 * 
 * 可以通过 .prefix 和 .suffix 添加装饰元素 | You can add decorative elements via .prefix and .suffix
 */

/* 一级标题 | Level 1 Heading */
#mdb h1 {
    margin: 40px 0 30px;
    /* 外边距：上 40px，下 30px | Margin: 40px top, 30px bottom */
    text-align: center;
    /* 居中对齐 | Center alignment */
}

#mdb h1 .content {
    font-size: 24px;
    /* 字体大小 | Font size */
    font-weight: bold;
    /* 字体粗细：加粗 | Font weight: bold */
    color: #000;
    /* 文字颜色 | Text color */
}

/* 隐藏前缀和后缀（如果不需要装饰） | Hide prefix and suffix (if decoration is not needed) */
#mdb h1 .prefix,
#mdb h1 .suffix {
    display: none;
}

/* 二级标题 | Level 2 Heading */
#mdb h2 {
    margin: 30px 0 20px;
}

#mdb h2 .content {
    font-size: 20px;
    font-weight: bold;
    color: #333;
}

#mdb h2 .prefix,
#mdb h2 .suffix {
    display: none;
}

/* 三级标题 | Level 3 Heading */
#mdb h3 {
    margin: 25px 0 15px;
}

#mdb h3 .content {
    font-size: 18px;
    font-weight: bold;
    color: #666;
}

#mdb h3 .prefix,
#mdb h3 .suffix {
    display: none;
}

/* 四级标题 | Level 4 Heading */
#mdb h4 {
    margin: 20px 0 10px;
}

#mdb h4 .content {
    font-size: 16px;
    font-weight: bold;
    color: #666;
}

#mdb h4 .prefix,
#mdb h4 .suffix {
    display: none;
}

/* ============================================
 * 4. 引用样式 | Blockquote Styles
 * ============================================
 * 支持多级引用 | Supports multi-level blockquotes: .multiquote-1, .multiquote-2, .multiquote-3
 */
#mdb .multiquote-1 {
    margin: 20px 0;
    /* 外边距 | Margin */
    padding: 16px 20px;
    /* 内边距 | Padding */
    background: #f5f5f5;
    /* 背景色 | Background color */
    border-left: 4px solid #ddd;
    /* 左边框 | Left border */
    border-radius: 4px;
    /* 圆角 | Border radius */
}

#mdb .multiquote-1 p {
    margin: 0;
    /* 段落无外边距 | Paragraph has no margin */
    color: #666;
    /* 文字颜色 | Text color */
    font-size: 15px;
}

/* 二级引用 | Level 2 Blockquote */
#mdb .multiquote-2 {
    margin: 18px 0;
    padding: 14px 18px;
    background: #fafafa;
    border-left: 3px solid #ccc;
}

#mdb .multiquote-2 p {
    margin: 0;
    color: #777;
    font-size: 14px;
}

/* 三级引用 | Level 3 Blockquote */
#mdb .multiquote-3 {
    margin: 16px 0;
    padding: 12px 16px;
    background: #fafafa;
    border-left: 2px solid #bbb;
}

#mdb .multiquote-3 p {
    margin: 0;
    color: #888;
    font-size: 14px;
}

/* ============================================
 * 5. 列表样式 | List Styles
 * ============================================
 */
#mdb ul,
#mdb ol {
    margin: 15px 0;
    padding-left: 25px;
    /* 左内边距，为列表符号留空间 | Left padding, leave space for list symbols */
}

#mdb ul {
    list-style-type: disc;
    /* 无序列表：实心圆点 | Unordered list: solid dots */
}

#mdb ol {
    list-style-type: decimal;
    /* 有序列表：数字 | Ordered list: numbers */
}

/* 列表项内容 | List Item Content
 * 注意：列表项内部使用 <section> 包裹内容 | Note: List items wrap content in <section>
 */
#mdb li section {
    margin: 5px 0;
    /* 列表项间距 | List item spacing */
    color: #333;
    /* 文字颜色 | Text color */
    line-height: 1.6;
}

#mdb ul ul {
    list-style-type: circle;
    margin-top: 6px;
}

#mdb ol ol {
    list-style-type: lower-alpha;
}

/* ============================================
 * 6. 链接样式 | Link Styles
 * ============================================
 */
#mdb a {
    color: #1e6bb8;
    /* 链接颜色 | Link color */
    text-decoration: none;
    /* 去除下划线 | Remove underline */
    border-bottom: 1px solid #1e6bb8;
    /* 底部边框作为下划线 | Bottom border as underline */
    font-weight: bold;
    /* 加粗 | Bold */
}

/* ============================================
 * 7. 文本样式 | Text Styles
 * ============================================
 */
/* 加粗 | Bold */
#mdb strong {
    font-weight: bold;
    color: #000;
}

/* 斜体 | Italic */
#mdb em {
    font-style: italic;
    color: #333;
}

/* 加粗斜体 | Bold Italic */
#mdb em strong {
    font-weight: bold;
    font-style: italic;
    color: #000;
}

/* 高亮 | Highlight */
#mdb mark {
    background: #fff3cd;
    color: #000;
    padding: 2px 4px;
    border-radius: 3px;
}

/* 删除线 | Strikethrough */
#mdb del {
    text-decoration: line-through;
    color: #999;
}

/* ============================================
 * 8. 行内代码样式 | Inline Code Styles
 * ============================================
 * 注意：行内代码在段落和列表项中 | Note: Inline code within paragraphs and list items
 */
#mdb p code,
#mdb li code {
    color: #e83e8c;
    /* 文字颜色 | Text color */
    background: #f8f9fa;
    /* 背景色 | Background color */
    padding: 2px 6px;
    /* 内边距 | Padding */
    margin: 0 2px;
    /* 外边距 | Margin */
    border-radius: 3px;
    /* 圆角 | Border radius */
    font-size: 14px;
    font-family: "Courier New", Courier, monospace;
    /* 等宽字体 | Monospace font */
}

/* ============================================
 * 9. 代码块样式（重要！） | Code Block Styles (Important!)
 * ============================================
 * 
 * ⚠️ 重要提示 | Important Tips:
 * 1. 必须使用 #mdb pre code.hljs 选择器，不要使用 #mdb pre code | Must use #mdb pre code.hljs selector, do not use #mdb pre code
 * 2. 不要设置全局 color 属性，让语法高亮主题控制文字颜色 | Do not set a global color property, let the syntax highlighting theme control the text color
 * 3. 如果设置了 color，会覆盖语法高亮的颜色，导致代码看不清 | If color is set, it will override syntax highlighting colors, making code hard to read
 * 4. 使用 #mdb pre code:not(.hljs) 作为后备样式（无语法高亮时） | Use #mdb pre code:not(.hljs) as a fallback style (when no syntax highlighting)
 * 
 * 示例（正确） | Example (Correct):
 * #mdb pre code.hljs {
 *     background: #f5f5f5;
 *     // 不设置 color | Do not set color
 * }
 * 
 * 示例（错误） | Example (Incorrect):
 * #mdb pre code {
 *     color: #333;  // ❌ 这会覆盖语法高亮 | ❌ This will override syntax highlighting
 * }
 */
#mdb pre code.hljs {
    display: block;
    padding: 16px;
    /* 内边距 | Padding */
    background: #f5f5f5;
    /* 背景色 | Background color */
    /* ⚠️ 注意：不要在这里设置 color，让语法高亮主题控制 | ⚠️ Note: Do not set color here, let the syntax highlighting theme control it */
    font-size: 13px;
    line-height: 1.6;
    border-radius: 4px;
    /* 圆角 | Border radius */
    font-family: "Courier New", "Consolas", "Monaco", monospace;
    /* 等宽字体 | Monospace font */
    overflow-x: auto;
    /* 横向滚动 | Horizontal scroll */
    white-space: pre;
  min-width: max-content;
    /* 保留空白和换行 | Preserve whitespace and line breaks */
    border: 1px solid #ddd;
    /* 边框 | Border */
}

/* 如果没有语法高亮，设置默认样式 | If there is no syntax highlighting, set the default style */
#mdb pre code:not(.hljs) {
    color: #333;
    /* 默认文字颜色 | Default text color */
    background: #f5f5f5;
    border: 1px solid #ddd;
}

/* ============================================
 * 10. 图片样式 | Image Styles
 * ============================================
 */
#mdb img {
    display: block;
    /* 块级元素 | Block element */
    margin: 20px auto;
    /* 居中：上下 20px，左右自动 | Centered: 20px top/bottom, auto left/right */
    max-width: 100%;
    /* 最大宽度：不超出容器 | Max width: does not exceed container */
    border-radius: 4px;
    /* 圆角 | Border radius */
}

/* 图片容器（figure） | Image Container (figure) */
#mdb figure {
    margin: 20px 0;
    text-align: center;
}

/* 图片说明文字（figcaption） | Image Caption (figcaption) */
#mdb figcaption {
    margin-top: 8px;
    color: #999;
    font-size: 14px;
}

/* ============================================
 * 11. 表格样式
 * ============================================
 */
#mdb table {
    width: 100%;
    /* 宽度：100% */
    border-collapse: collapse;
    /* 边框合并 */
    margin: 20px 0;
    /* 外边距 */
    font-size: 14px;
}

/* 表头 */
#mdb table tr th {
    background: #f5f5f5;
    /* 背景色 */
    color: #333;
    border: 1px solid #ddd;
    /* 边框 */
    padding: 10px;
    /* 内边距 */
    font-weight: bold;
    /* 加粗 */
    text-align: left;
}

/* 表格单元格 */
#mdb table tr td {
    border: 1px solid #ddd;
    padding: 10px;
    color: #333;
}

/* 斑马纹（隔行变色） */
#mdb table tr:nth-child(even) td {
    background-color: #fafafa;
}

/* ============================================
 * 12. 分割线样式
 * ============================================
 */
#mdb hr {
    margin: 30px 0;
    /* 外边距 */
    border: none;
    /* 去除默认边框 */
    border-top: 1px solid #ddd;
    /* 顶部边框 */
    height: 1px;
}

/* ============================================
 * 13. 脚注样式
 * ============================================
 */
#mdb .footnote-word,
#mdb .footnote-ref {
    color: #1e6bb8;
    /* 脚注链接颜色 */
    font-weight: bold;
}

#mdb .footnotes-sep {
    border-top: 1px solid #ddd;
    /* 分隔线 */
    padding-top: 20px;
    margin-top: 40px;
}

#mdb .footnote-num {
    font-weight: bold;
    color: #1e6bb8;
    margin-right: 4px;
}

#mdb .footnote-item p {
    color: #666;
    font-size: 14px;
    margin: 4px 0;
}

/* ============================================
 * 14. 数学公式样式
 * ============================================
 */
/* 行间公式 */
#mdb .block-equation {
    display: block;
    text-align: center;
    margin: 20px 0;
    overflow-x: auto;
}

#mdb .block-equation svg {
    max-width: 100%;
    /* 最大宽度：不超出容器 */
}

/* 行内公式 */
#mdb .inline-equation {
    display: inline;
}

#mdb .inline-equation svg {
    max-width: 100%;
    vertical-align: middle;
    /* 垂直居中 */
}

/* ============================================
 * 16. 提示块样式（Callout）
 * ============================================
 * 
 * 提示块用于显示不同类型的提示信息
 * 支持的类型：note、info、tip、success、warning、danger
 */

/* 提示块基础样式 */
#mdb .callout {
    margin: 20px 0;
    padding: 16px 20px;
    background: #f5f5f5;
    border-left: 4px solid #ddd;
    border-radius: 4px;
}

#mdb .callout-title {
    font-weight: bold;
    margin-bottom: 8px;
    color: #333;
    font-size: 15px;
}

#mdb .callout-icon {
    margin-right: 6px;
}

/* 不同类型的提示块 */
#mdb .callout-note { 
    border-left-color: #6366f1; 
    background: #f5f5ff; 
}

#mdb .callout-tip { 
    border-left-color: #10b981; 
    background: #ecfdf5; 
}

#mdb .callout-important { 
    border-left-color: #8b5cf6; 
    background: #f5f3ff; 
}

#mdb .callout-warning { 
    border-left-color: #f59e0b; 
    background: #fffbeb; 
}

#mdb .callout-caution { 
    border-left-color: #ef4444; 
    background: #fff5f5; 
}

/* ============================================
 * 15. 其他元素
 * ============================================
 */
/* 定义列表 */
#mdb dl {
    margin: 15px 0;
}

#mdb dt {
    font-weight: bold;
    margin-top: 10px;
}

#mdb dd {
    margin-left: 20px;
    color: #666;
}

/* 目录（TOC） */
#mdb .table-of-contents {
    margin: 20px 0;
    padding: 15px;
    background: #f5f5f5;
    border-left: 3px solid #ddd;
    border-radius: 4px;
}

#mdb .table-of-contents a {
    color: #333;
    text-decoration: none;
}




/* ============================================
 * 17. 图片轮播样式 (Imageflow)
 * ============================================
 */
#mdb .imageflow-layer1 {
  margin-top: 1em;
  margin-bottom: 0.5em;
  /* white-space: normal; */
  border: 0px none;
  padding: 0px;
  overflow: hidden;
}

#mdb .imageflow-layer2 {
  white-space: nowrap;
  width: 100%;
  overflow-x: scroll;
}

#mdb .imageflow-layer3 {
  display: inline-block;
  word-wrap: break-word;
  white-space: normal;
  vertical-align: top;
  width: 80%;
  margin-right: 10px;
  flex-shrink: 0;
}

#mdb .imageflow-img {
  display: block;
  width: 100%;
  height: auto;
  max-height: 300px;
  object-fit: contain;
  border-radius: 4px;
}

#mdb .imageflow-caption {
  text-align: center;
  margin-top: 0px;
  padding-top: 0px;
  color: #888;
}
`;
