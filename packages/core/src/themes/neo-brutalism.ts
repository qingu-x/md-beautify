export const neoBrutalismTheme = `/* 新粗野主义风格 | Neo-Brutalism Style */
#mdb {
    padding: 30px 20px;
    max-width: 677px;
    margin: 0 auto;
    font-family: -apple-system, "Helvetica Neue", "PingFang SC", "Microsoft YaHei", sans-serif;
    color: #000;
    /* 纯黑文字，极致对比 | Pure black text, extreme contrast */
    /* 透明背景，兼容微信深色模式 | Transparent background, compatible with WeChat dark mode */
    background-color: transparent;
    word-break: break-word;
}

/* 段落 - 高对比度 | Paragraph - High contrast */
#mdb p {
    margin-top: 24px;
    margin-bottom: 24px;
    line-height: 1.8;
    letter-spacing: 0.5px;
    text-align: justify;
    color: #111;
    font-size: 16px;
    font-weight: 400;
}

/* 
 * 一级标题 - 像一个醒目的标签盒子 | H1 - Like a prominent label box
 * 设计：粗边框 + 荧光黄背景 + 硬阴影 | Design: Thick border + Neon yellow background + Hard shadow
 */
#mdb h1 {
    margin-top: 60px;
    margin-bottom: 50px;
    text-align: center;
}

#mdb h1 .content {
    display: inline-block;
    font-size: 24px;
    font-weight: 900;
    color: #000;
    background-color: #CCFF00;
    /* 荧光黄高亮 | Neon yellow highlight */
    border: 3px solid #000;
    /* 粗黑边框 | Thick black border */
    padding: 12px 20px;
    /* 关键：黑色硬阴影 | Key: Black hard shadow */
    box-shadow: 6px 6px 0px #000;
    line-height: 1.3;
}

#mdb h1 .prefix,
#mdb h1 .suffix {
    display: none;
}

/* 
 * 二级标题 - 下划线高亮 | H2 - Underline highlight
 * 设计：文字下方的厚实色块 | Design: Thick color block below the text
 */
#mdb h2 {
    margin-top: 60px;
    margin-bottom: 30px;
    text-align: left;
    border-bottom: 3px solid #000;
    /* 通栏粗黑线 | Full-width thick black line */
    padding-bottom: 10px;
}

#mdb h2 .content {
    display: inline-block;
    font-size: 20px;
    font-weight: 800;
    color: #fff;
    background-color: #6A00FF;
    /* 电光紫背景 | Electric purple background */
    padding: 8px 16px;
    border: 2px solid #000;
    /* 左上偏移的阴影效果 | Shadow effect offset to the top-left */
    box-shadow: 4px -4px 0px #000;
    line-height: 1.2;
}

#mdb h2 .prefix,
#mdb h2 .suffix {
    display: none;
}

/* 
 * 三级标题 - 几何引导 | H3 - Geometric guidance
 */
#mdb h3 {
    margin-top: 40px;
    margin-bottom: 20px;
}

#mdb h3 .content {
    display: inline-block;
    font-size: 18px;
    font-weight: 800;
    color: #000;
    padding-left: 12px;
    border-left: 8px solid #CCFF00;
    /* 极粗的黄线 | Extremely thick yellow line */
    line-height: 1.2;
}

#mdb h3 .prefix,
#mdb h3 .suffix {
    display: none;
}

/* 
 * 四级标题 - 反色黑盒 | H4 - Inverted black box
 */
#mdb h4 {
    margin-top: 30px;
    margin-bottom: 15px;
    text-align: left;
}

#mdb h4 .content {
    display: inline-block;
    font-size: 16px;
    font-weight: 700;
    color: #fff;
    background-color: #000;
    /* 纯黑背景 | Pure black background */
    padding: 6px 12px;
    border-radius: 0;
    /* 直角 | Right angle */
    line-height: 1.4;
}

#mdb h4 .prefix,
#mdb h4 .suffix {
    display: none;
}

/* 
 * 列表 - 强烈的几何感 | List - Strong geometric sense
 * 必须使用正方形 | Must use square
 */
#mdb ul {
    list-style-type: square;
    padding-left: 20px;
    margin: 20px 0;
    color: #6A00FF;
    /* 紫色方块 | Purple square */
}

#mdb ul li {
    margin-bottom: 12px;
    line-height: 1.75;
}

#mdb li section {
    color: #000;
    font-size: 16px;
    font-weight: 500;
}

/* 有序列表 - 粗黑体数字 | Ordered list - Bold black numbers */
#mdb ol {
    list-style-type: decimal;
    padding-left: 20px;
    margin: 20px 0;
    color: #000;
    font-weight: 900;
    /* 最粗字体 | Thickest font */
}

#mdb ol li {
    margin-bottom: 12px;
    line-height: 1.75;
    border-bottom: 1px solid #eee;
    /* 增加分割线 | Add divider line */
    padding-bottom: 8px;
}

#mdb ol li section {
    color: #222;
    font-weight: normal;
    font-size: 16px;
    padding-left: 5px;
}

#mdb ul ul {
    list-style-type: circle;
    color: #CCFF00;
    margin-top: 10px;
}

#mdb ol ol {
    list-style-type: upper-alpha;
    color: #6A00FF;
    font-weight: 900;
}

/* 
 * 引用 - 视窗风格 (Window Style) | Quote - Window Style
 * 这是一个带粗边框和硬阴影的盒子 | This is a box with a thick border and hard shadow
 */
#mdb .multiquote-1,
#mdb .multiquote-2,
#mdb .multiquote-3 {
    margin: 40px 0;
    padding: 24px;
    background-color: #f4f4f4;
    /* 浅灰背景 | Light gray background */
    border: 2px solid #000;
    /* 粗黑边框 | Thick black border */
    /* 经典的波普风硬阴影 | Classic Pop Art hard shadow */
    box-shadow: 6px 6px 0px #6A00FF;
    overflow: visible;
}

#mdb .multiquote-1 p,
#mdb .multiquote-2 p,
#mdb .multiquote-3 p {
    margin: 0;
    color: #000;
    font-size: 15px;
    line-height: 1.8;
    font-weight: 500;
}

#mdb .multiquote-2 {
    margin: 38px 0;
    padding: 22px;
    background: #fff;
    border: 2px solid #000;
    box-shadow: 5px 5px 0px #CCFF00;
}

#mdb .multiquote-3 {
    margin: 36px 0;
    padding: 20px;
    background: #fafafa;
    border: 2px solid #000;
    box-shadow: 4px 4px 0px #FF6B9D;
}

/* 链接 - 荧光笔涂抹效果 | Link - Highlighter smear effect */
#mdb a {
    color: #000;
    /* 链接文字黑色 | Link text black */
    text-decoration: none;
    border-bottom: 2px solid #000;
    background: linear-gradient(180deg, transparent 60%, #CCFF00 0);
    /* 下半部分黄色高亮 | Lower half yellow highlight */
    font-weight: 700;
    padding: 0 2px;
    transition: all 0.2s;
}

/* 
 * 加粗 - 故障风效果 | Bold - Glitch effect
 * 紫色背景 + 白字 | Purple background + White text
 */
#mdb strong {
    color: #fff;
    background-color: #6A00FF;
    font-weight: 700;
    padding: 2px 6px;
    margin: 0 2px;
    border: 1px solid #000;
    /* 加个细黑边 | Add a thin black border */
}

/* 斜体 | Italic */
#mdb em {
    color: #6A00FF;
    font-style: italic;
    font-weight: bold;
}

#mdb em strong {
    color: #fff;
}

/* 高亮 - 荧光黄块 | Highlight - Neon yellow block */
#mdb mark {
    background: #CCFF00;
    color: #000;
    padding: 2px 6px;
    border: 2px solid #000;
    font-weight: bold;
}

/* 删除线 - 粗线 | Strikethrough - Thick line */
#mdb del {
    text-decoration: line-through;
    text-decoration-thickness: 3px;
    text-decoration-color: #FF6B9D;
    color: #666;
}

/* 分隔线 - 粗黑条 | Divider - Thick black bar */
#mdb hr {
    margin: 60px auto;
    border: 0;
    height: 4px;
    background: #000;
    width: 100%;
}

/* 
 * 图片 - 拍立得效果 | Image - Polaroid effect
 * 粗框 + 硬阴影 | Thick border + Hard shadow
 */
#mdb img {
    display: block;
    margin: 40px auto;
    width: 100%;
    border: 2px solid #000;
    box-shadow: 8px 8px 0px #000;
    /* 纯黑硬阴影 | Pure black hard shadow */
    padding: 0;
    background: #fff;
}

/* 针对图片下方的注释文字 | Caption text below the image */
#mdb figcaption {
    margin-top: 12px;
    text-align: center;
    color: #000;
    font-size: 14px;
    font-weight: bold;
    background: #CCFF00;
    padding: 4px 10px;
    border: 2px solid #000;
    display: inline-block;
    box-shadow: 3px 3px 0 #000;
}

/* 行内代码 - 复古终端风 | Inline code - Retro terminal style */
#mdb p code,
#mdb li code {
    color: #000;
    background: #fff;
    border: 1px solid #000;
    padding: 2px 6px;
    margin: 0 4px;
    font-size: 14px;
    font-family: "Menlo", monospace;
    font-weight: bold;
    box-shadow: 2px 2px 0 #ccc;
}

/* 代码块 - 纯黑硬核模式 | Code block - Pure black hardcore mode */
/* 代码块 - 注意：不要设置 color，让语法高亮主题控制文字颜色 | Code block - Note: Do not set color, let the syntax highlighting theme control the text color */
#mdb pre code.hljs {
    display: block;
    padding: 16px;
    background: #000;
    /* 纯黑 | Pure black */
    color: #CCFF00;
    /* 默认荧光绿文字 | Default neon green text */
    font-size: 13px;
    line-height: 1.5;
    border-radius: 0;
    /* 直角 | Right angle */
    font-family: "Menlo", "Courier New", monospace;
    overflow-x: auto;
    white-space: pre;
  min-width: max-content;
    border: 2px solid #000;
    box-shadow: 6px 6px 0px #ddd;
}

/* 优化深色背景下的语法高亮颜色 - 使用高对比度亮色 | Optimize syntax highlighting colors on dark backgrounds - Use high-contrast bright colors */
#mdb pre code.hljs .hljs-comment,
#mdb pre code.hljs .hljs-quote {
    color: #888;
}

#mdb pre code.hljs .hljs-keyword,
#mdb pre code.hljs .hljs-selector-tag {
    color: #FF6B9D;
    font-weight: bold;
}

#mdb pre code.hljs .hljs-string,
#mdb pre code.hljs .hljs-doctag {
    color: #FFD93D;
}

#mdb pre code.hljs .hljs-number,
#mdb pre code.hljs .hljs-literal {
    color: #6BCF7F;
}

#mdb pre code.hljs .hljs-title,
#mdb pre code.hljs .hljs-section {
    color: #4D9DE0;
    font-weight: bold;
}

#mdb pre code.hljs .hljs-built_in,
#mdb pre code.hljs .hljs-builtin-name {
    color: #E85D75;
    font-weight: bold;
}

/* 如果没有语法高亮，设置默认荧光绿 | If no syntax highlighting, set default neon green */
#mdb pre code:not(.hljs) {
    color: #CCFF00;
    background: #000;
    border: 2px solid #000;
    box-shadow: 6px 6px 0px #ddd;
}

/* 表格 - Excel 粗框风格 | Table - Excel thick border style */
#mdb table {
    width: 100%;
    border-collapse: collapse;
    margin: 40px 0;
    font-size: 14px;
    border: 2px solid #000;
    box-shadow: 6px 6px 0px #000;
}

#mdb table tr th {
    background: #6A00FF;
    /* 紫色表头 | Purple table header */
    color: #fff;
    font-weight: 900;
    border: 1px solid #000;
    padding: 12px;
    text-align: left;
    text-transform: uppercase;
}

#mdb table tr td {
    border: 1px solid #000;
    padding: 12px;
    color: #000;
    background: #fff;
}

/* 隔行变色 - 黄色 | Zebra striping - Yellow */
#mdb table tr:nth-child(even) td {
    background-color: #faffd1;
}

/* 脚注 | Footnote */
#mdb .footnote-word,
#mdb .footnote-ref {
    color: #6A00FF;
    font-weight: bold;
}

#mdb .footnotes-sep {
    border-top: 2px solid #000;
    padding-top: 20px;
    margin-top: 60px;
    font-size: 14px;
    font-weight: 900;
    color: #000;
    text-transform: uppercase;
}

#mdb .footnote-num {
    font-weight: 900;
    color: #fff;
    background: #000;
    padding: 1px 4px;
    margin-right: 4px;
    font-size: 12px;
}

#mdb .footnote-item p {
    color: #333;
    font-size: 12px;
    margin: 4px 0;
}

/* 公式 | Equation */
#mdb .block-equation svg {
    max-width: 100%;
}

#mdb .inline-equation svg {
    max-width: 100%;
    vertical-align: middle;
}

/* 提示块 - 新粗野主义风格 | Callout - Neo-Brutalism style */
#mdb .callout {
    margin: 40px 0;
    padding: 20px;
    background: #f4f4f4;
    border: 2px solid #000;
    box-shadow: 6px 6px 0px #6A00FF;
    border-radius: 0;
}

#mdb .callout-title {
    font-weight: 900;
    margin-bottom: 10px;
    text-transform: uppercase;
    color: #000;
    font-size: 16px;
}

#mdb .callout-icon {
    margin-right: 6px;
}

#mdb .callout-note { border-left: 8px solid #6A00FF; }
#mdb .callout-tip { border-left: 8px solid #CCFF00; }
#mdb .callout-important { border-left: 8px solid #6A00FF; }
#mdb .callout-warning { border-left: 8px solid #CCFF00; }
#mdb .callout-caution { border-left: 8px solid #FF6B9D; }

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
