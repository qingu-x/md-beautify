export const receiptTheme = `/* 购物小票风格 | Receipt Style */
#mdb {
    padding: 40px 20px;
    max-width: 677px;
    margin: 0 auto;
    /* 强制等宽/衬线字体，模拟打印机 | Force monospace/serif fonts, simulate a printer */
    font-family: "Courier New", "SimSun", "Songti SC", monospace;
    color: #111;
    background-color: transparent;
    /* 透明背景，兼容微信深色模式 | Transparent background, compatible with WeChat dark mode */
    /* 顶部撕纸效果 | Top torn paper effect */
    border-top: 5px dashed #111;
    border-bottom: 5px dashed #111;
    word-break: break-word;
}

/* 正文 | Body text */
#mdb p {
    margin: 18px 0;
    line-height: 1.6;
    text-align: justify;
    color: #222;
    font-size: 15px;
}

/* 
 * 一级标题 - 店铺招牌风格 | H1 - Store signage style
 * 改为：上下双虚线包裹，居中，加大字重 | Changed to: Wrapped with top and bottom double dashed lines, centered, increased font weight
 */
#mdb h1 {
    margin: 40px 0 30px;
    text-align: center;
    border-top: 2px dashed #000;
    border-bottom: 2px dashed #000;
    padding: 15px 0;
}

#mdb h1 .content {
    font-size: 26px;
    font-weight: 900;
    color: #000;
    letter-spacing: 2px;
    display: block;
    /* 占满整行 | Full width */
    border: none;
    /* 去除之前的下划线 | Remove previous underline */
}

#mdb h1 .prefix,
#mdb h1 .suffix {
    display: none;
}

/* 二级标题 - 分类栏 | H2 - Category bar */
#mdb h2 {
    margin: 30px 0 20px;
    text-align: center;
}

#mdb h2 .content {
    display: block;
    font-size: 18px;
    font-weight: bold;
    color: #fff;
    /* 反白文字 | Reversed text */
    background: #000;
    /* 黑色背景条 | Black background bar */
    padding: 8px;
}

#mdb h2 .prefix,
#mdb h2 .suffix {
    display: none;
}

/* 三级标题 - 加粗项目 | H3 - Bold items */
#mdb h3 {
    margin: 25px 0 10px;
}

#mdb h3 .content {
    font-size: 16px;
    font-weight: bold;
    border-bottom: 2px solid #000;
    padding-bottom: 2px;
    display: inline-block;
}

#mdb h3 .prefix,
#mdb h3 .suffix {
    display: none;
}

/* 四级标题 - 简单标签 | H4 - Simple labels */
#mdb h4 {
    margin: 20px 0 10px;
    text-align: left;
}

#mdb h4 .content {
    font-size: 16px;
    font-weight: bold;
    color: #000;
    text-decoration: underline;
}

#mdb h4 .prefix,
#mdb h4 .suffix {
    display: none;
}

/* 引用 - 备注框 | Quote - Note box */
#mdb .multiquote-1 {
    margin: 25px 0;
    padding: 15px;
    border: 1px dotted #000;
    /* 点状边框 | Dotted border */
    font-size: 14px;
    text-align: left;
    background: #f8f8f8;
}

#mdb .multiquote-1 p {
    font-family: monospace;
    color: #444;
}

#mdb .multiquote-2 {
    margin: 22px 0;
    padding: 13px;
    border: 1px dashed #000;
    background: #fafafa;
}

#mdb .multiquote-2 p {
    font-family: monospace;
    color: #444;
}

#mdb .multiquote-3 {
    margin: 20px 0;
    padding: 11px;
    border: 1px dotted #666;
    background: #fcfcfc;
}

#mdb .multiquote-3 p {
    font-family: monospace;
    color: #444;
}

/* 列表 | List */
#mdb ul {
    list-style: none;
    padding-left: 10px;
    margin: 20px 0;
}

#mdb ul li {
    margin-bottom: 8px;
    border-bottom: 1px dotted #ccc;
    /* 下划线辅助阅读 | Underline to assist reading */
    padding-bottom: 4px;
}

#mdb ul li::before {
    content: "[*] ";
    /* 模拟字符列表 | Simulate character list */
    font-weight: bold;
    margin-right: 5px;
}

#mdb ol {
    list-style: decimal;
    padding-left: 25px;
    margin: 20px 0;
    font-weight: bold;
}

#mdb li section {
    font-weight: normal;
    color: #222;
}

#mdb ul ul {
    list-style: none;
    margin-top: 6px;
}

#mdb ul ul li::before {
    content: "[-] ";
    font-weight: bold;
}

#mdb ol ol {
    list-style-type: lower-alpha;
}

/* 链接 | Link */
#mdb a {
    color: #000;
    text-decoration: underline;
    font-weight: bold;
}

/* 加粗 | Bold */
#mdb strong {
    font-weight: 900;
    background: #ddd;
    /* 模拟灰色高亮打印 | Simulate gray highlight printing */
    padding: 0 4px;
}

/* 斜体 | Italic */
#mdb em {
    font-style: italic;
    color: #000;
}

/* 加粗斜体 | Bold Italic */
#mdb em strong {
    font-weight: 900;
    font-style: italic;
}

/* 高亮 - 灰色背景 | Highlight - Gray background */
#mdb mark {
    background: #ddd;
    color: #000;
    padding: 0 4px;
}

/* 删除线 | Strikethrough */
#mdb del {
    text-decoration: line-through;
    color: #666;
}

/* 分割线 - 虚线 | Divider - Dashed line */
#mdb hr {
    margin: 30px 0;
    border: none;
    border-top: 2px dashed #000;
}

/* 行内代码 - 反色打印块 | Inline code - Inverted print block */
#mdb p code,
#mdb li code {
    background: #000;
    color: #fff;
    font-family: monospace;
    padding: 2px 6px;
    margin: 0 4px;
    font-size: 14px;
    border-radius: 0;
}

/* 图片 - 抖动边框 | Image - Jitter border */
#mdb img {
    display: block;
    margin: 30px auto;
    width: 100%;
    border: 2px dashed #000;
    padding: 8px;
    background: #fff;
}

#mdb figcaption {
    margin-top: 8px;
    text-align: center;
    color: #000;
    font-size: 13px;
    font-family: monospace;
    border-top: 1px dashed #000;
    padding-top: 6px;
}

/* 
 * 代码块 - 暴力修复版 | Code block - Brutal fix version
 * 1. !important 强制覆盖编辑器的深色主题 | 1. !important forced to override the editor's dark theme
 * 2. 去除圆角 and 阴影 | 2. Remove rounded corners and shadows
 * 3. 模拟虚线纸张 | 3. Simulate dashed paper
 */
/* 代码块 - 注意：不要设置 color，让语法高亮主题控制文字颜色 | Code block - Note: Do not set color, let the syntax highlighting theme control the text color */
#mdb pre code.hljs {
    background: #f4f4f4 !important;
    /* 强制浅灰背景 | Forced light gray background */
    /* color 由 .hljs 语法高亮主题控制 | color is controlled by .hljs syntax highlighting theme */
    border: 2px dashed #000 !important;
    /* 强制虚线框 | Forced dashed box */
    border-radius: 0 !important;
    /* 强制直角 | Forced right angle */
    box-shadow: none !important;
    /* 去掉立体阴影 | Remove 3D shadow */
    font-family: "Courier New", monospace;
    font-size: 13px;
    padding: 15px;
    line-height: 1.5;
}

/* 如果没有语法高亮，设置默认黑色 | If no syntax highlighting, set default black */
#mdb pre code:not(.hljs) {
    color: #000 !important;
    background: #f4f4f4 !important;
    border: 2px dashed #000 !important;
    border-radius: 0 !important;
    box-shadow: none !important;
}

/* 尝试隐藏 Mac 红绿灯 (如果编辑器是用伪元素实现的) | Try to hide Mac traffic lights (if the editor is implemented with pseudo-elements) */
#mdb pre code::before {
    content: "" !important;
    display: none !important;
}

/* 表格 - 价格单 | Table - Price list */
#mdb table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
    font-size: 14px;
    font-family: monospace;
}

#mdb table tr th {
    border-bottom: 2px dashed #000;
    padding: 8px 5px;
    text-align: right;
    font-weight: 900;
    text-transform: uppercase;
}

#mdb table tr th:first-child {
    text-align: left;
}

#mdb table tr td {
    border-bottom: 1px dotted #000;
    padding: 8px 5px;
    text-align: right;
    color: #000;
}

#mdb table tr td:first-child {
    text-align: left;
}

/* 脚注 | Footnote */
#mdb .footnote-word,
#mdb .footnote-ref {
    color: #000;
    text-decoration: underline;
}

#mdb .footnotes-sep {
    border-top: 2px dashed #000;
    margin-top: 30px;
    padding-top: 15px;
}

#mdb .footnote-num {
    font-weight: bold;
    color: #000;
    margin-right: 4px;
}

#mdb .footnote-item p {
    color: #444;
    font-size: 13px;
    font-family: monospace;
}

/* 提示块 - 购物小票风格 | Callout - Receipt style */
#mdb .callout {
    margin: 25px 0;
    padding: 15px;
    border: 1px dotted #000;
    background: #f8f8f8;
    border-radius: 0;
}

#mdb .callout-title {
    font-weight: bold;
    margin-bottom: 8px;
    color: #000;
    font-family: monospace;
    text-transform: uppercase;
    font-size: 14px;
}

#mdb .callout-icon {
    margin-right: 6px;
}

#mdb .callout-note { border-left: 2px dashed #000; }
#mdb .callout-tip { border-left: 2px dashed #000; }
#mdb .callout-important { border-left: 2px dashed #000; }
#mdb .callout-warning { border-left: 2px dashed #000; }
#mdb .callout-caution { border-left: 2px dashed #000; }

/* Imageflow CSS */
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
