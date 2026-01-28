export const academicPaperTheme = `/* 学术论文风格 | Academic Paper Style */
#mdb {
    padding: 30px 20px;
    max-width: 677px;
    margin: 0 auto;
    /* 混合字体栈：西文Times + 中文宋体 | Mixed Font Stack: Latin Times + Chinese Songti */
    font-family: "Times New Roman", "Songti SC", "SimSun", serif;
    color: #000;
    background-color: transparent;
    /* 透明背景，兼容微信深色模式 | Transparent background, compatible with WeChat dark mode */
    word-break: break-word;
}

/* 正文 - 移除首行缩进，改用段间距适应移动端 | Body - Removed first-line indent, using paragraph spacing for mobile adaptation */
#mdb p {
    margin: 16px 0;
    line-height: 1.7;
    text-align: justify;
    text-indent: 0;
    color: #1a1a1a;
    font-size: 16px;
}

/* 一级标题 - 居中论文题 | Level 1 Heading - Centered Paper Title */
#mdb h1 {
    margin: 40px 0 30px;
    text-align: center;
    line-height: 1.4;
}

#mdb h1 .content {
    font-size: 22px;
    font-weight: bold;
    color: #000;
}

#mdb h1 .prefix,
#mdb h1 .suffix {
    display: none;
}

/* 二级标题 - 章节 Section | Level 2 Heading - Section */
#mdb h2 {
    margin: 30px 0 15px;
    text-align: left;
    border-bottom: 2px solid #000;
    /* 加粗底线 | Thick bottom line */
    padding-bottom: 8px;
}

#mdb h2 .content {
    font-size: 18px;
    font-weight: bold;
    color: #000;
}

#mdb h2 .prefix,
#mdb h2 .suffix {
    display: none;
}

/* 三级标题 - Subsection | Level 3 Heading - Subsection */
#mdb h3 {
    margin: 20px 0 10px;
}

#mdb h3 .content {
    font-size: 16px;
    font-weight: bold;
    color: #800000;
    /* 栗色，区分层级 | Maroon, distinguishing hierarchy */
}

#mdb h3 .prefix,
#mdb h3 .suffix {
    display: none;
}

/* 四级标题 | Level 4 Heading */
#mdb h4 {
    margin: 15px 0 5px;
}

#mdb h4 .content {
    font-size: 16px;
    font-weight: bold;
    font-style: italic;
    /* 斜体标题 | Italic Heading */
    color: #333;
}

#mdb h4 .prefix,
#mdb h4 .suffix {
    display: none;
}

/* 引用 - 简洁边框 | Blockquote - Concise Border */
#mdb .multiquote-1 {
    margin: 20px 0;
    padding: 16px 20px;
    background: #fafafa;
    border: 1px solid #ddd;
    border-left: 4px solid #666;
}

#mdb .multiquote-1 p {
    color: #555;
    font-size: 15px;
    margin: 0;
    line-height: 1.6;
    text-indent: 0;
}

#mdb .multiquote-2 {
    margin: 18px 0 18px 20px;
    padding: 14px 18px;
    background: #fafafa;
    border: 1px solid #ddd;
}

#mdb .multiquote-2 p {
    color: #555;
    font-size: 15px;
    margin: 0;
}

#mdb .multiquote-3 {
    margin: 16px 0 16px 20px;
    padding: 12px 16px;
    background: #fcfcfc;
    border: 1px solid #e0e0e0;
}

#mdb .multiquote-3 p {
    color: #555;
    font-size: 15px;
    margin: 0;
}

/* 列表 | List */
#mdb ul {
    list-style: disc;
    padding-left: 20px;
    margin: 16px 0;
}

#mdb ul ul {
    list-style-type: square;
    margin-top: 5px;
}

#mdb ol {
    list-style: decimal;
    padding-left: 20px;
    margin: 16px 0;
}

#mdb ol ol {
    list-style-type: lower-alpha;
}

#mdb li section {
    color: #333;
    line-height: 1.6;
}

/* 链接 - 经典深蓝 | Link - Classic Deep Blue */
#mdb a {
    color: #000080;
    text-decoration: underline;
}

/* 加粗 | Bold */
#mdb strong {
    color: #000;
    font-weight: bold;
}

/* 斜体 | Italic */
#mdb em {
    font-style: italic;
    color: #000;
}

/* 加粗斜体 | Bold Italic */
#mdb em strong {
    font-weight: bold;
    font-style: italic;
    color: #000;
}

/* 高亮 - 学术标记风格 | Highlight - Academic Marking Style */
#mdb mark {
    background: #fff3cd;
    color: #000;
    padding: 0 2px;
}

/* 删除线 | Strikethrough */
#mdb del {
    text-decoration: line-through;
    color: #666;
    opacity: 0.7;
}

/* 图片 - 简洁无装饰 | Image - Simple and Undecorated */
#mdb img {
    display: block;
    margin: 30px auto;
    width: 100%;
    border: 1px solid #ddd;
}

#mdb figcaption {
    margin-top: 8px;
    text-align: center;
    color: #666;
    font-size: 14px;
    font-style: italic;
}

/* 
 * 行内代码 - LaTeX \texttt 风格 (修复重点) | Inline Code - LaTeX \texttt Style (Key Fix)
 * 纯黑文字 + 极淡灰底 + 等宽字体 | Pure black text + Very light gray background + Monospace font
 */
#mdb p code,
#mdb li code {
    color: #000;
    /* 纯黑 | Pure Black */
    background: #f4f4f4;
    /* 极淡灰 | Very Light Gray */
    border: 1px solid #eee;
    /* 极细边框 | Very Thin Border */
    padding: 1px 4px;
    margin: 0 2px;
    border-radius: 2px;
    font-size: 14px;
    font-family: "Courier New", Courier, monospace;
    /* 强制等宽 | Forced Monospace */
}

/* 代码块 - 简单的学术风格 | Code Block - Simple Academic Style */
/* 注意：不要设置 color，让语法高亮主题控制文字颜色 | Note: Do not set color, let the syntax highlighting theme control text color */
#mdb pre code.hljs {
    background: #f9f9f9;
    border: 1px solid #ccc;
    /* color 由 .hljs 语法高亮主题控制 | Color controlled by .hljs syntax highlighting theme */
    font-family: "Courier New", monospace;
    font-size: 13px;
    padding: 12px;
    border-radius: 0;
    /* 直角 | Square corner */
    overflow-x: auto;
    white-space: pre;
  min-width: max-content;
}

/* 如果没有语法高亮，设置默认颜色 | If no syntax highlighting, set default color */
#mdb pre code:not(.hljs) {
    color: #333;
}

/* 表格 - 经典三线表 | Table - Classic Three-line Table */
#mdb table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
    font-size: 14px;
    border-top: 2px solid #000;
    border-bottom: 2px solid #000;
}

#mdb table tr th {
    border-bottom: 1px solid #000;
    padding: 10px 5px;
    font-weight: bold;
    text-align: center;
    background: #fff;
}

#mdb table tr td {
    padding: 10px 5px;
    border: none;
    text-align: center;
    color: #333;
}

/* 隔行微底色 | Alternate row background color */
#mdb table tr:nth-child(even) td {
    background-color: #fafafa;
}

/* 脚注 | Footnotes */
#mdb .footnote-word,
#mdb .footnote-ref {
    color: #000080;
}

#mdb .footnotes-sep {
    border-top: 1px solid #ccc;
    padding-top: 10px;
    margin-top: 40px;
    width: 20%;
    /* 短线 | Short line */
}

#mdb .footnote-num {
    font-weight: bold;
    color: #000;
    margin-right: 4px;
    vertical-align: super;
    font-size: 10px;
}

#mdb .footnote-item p {
    color: #666;
    font-size: 12px;
    margin: 4px 0;
}

/* 公式 | Formula */
#mdb .block-equation svg {
    max-width: 100%;
}

#mdb .inline-equation svg {
    max-width: 100%;
    vertical-align: middle;
}

/* 提示块 - 学术风格 | Callout - Academic Style */
#mdb .callout {
    margin: 20px 0;
    padding: 16px 20px;
    border: 1px solid #ddd;
    border-radius: 0;
    background: #fafafa;
}

#mdb .callout-title {
    font-weight: bold;
    margin-bottom: 8px;
    font-size: 14px;
    text-transform: uppercase;
    color: #000;
}

#mdb .callout-icon {
    margin-right: 6px;
}

#mdb .callout-note { 
    border-left: 4px solid #666; 
    background: #f5f5f5;
}

#mdb .callout-tip { 
    border-left: 4px solid #555; 
    background: #f5f5f5;
}

#mdb .callout-important { 
    border-left: 4px solid #888; 
    background: #f5f5f5;
}

#mdb .callout-warning { 
    border-left: 4px solid #999; 
    background: #f5f5f5;
}

#mdb .callout-caution { 
    border-left: 4px solid #000; 
    background: #f5f5f5;
}

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
