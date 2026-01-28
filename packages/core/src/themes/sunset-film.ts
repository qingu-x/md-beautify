export const sunsetFilmTheme = `/* 落日胶片风格 | Sunset Film Style */
#mdb {
    padding: 30px 22px;
    max-width: 677px;
    margin: 0 auto;
    /* 强制使用衬线体，营造电影字幕感 | Force serif fonts for a cinematic subtitle feel */
    font-family: "Songti SC", "SimSun", "STSong", "Georgia", serif;
    color: #4A3B32;
    /* 深咖啡色文字，比黑色更柔和 | Dark coffee text, softer than black */
    background-color: transparent;
    /* 透明背景，兼容微信深色模式 | Transparent background, compatible with WeChat dark mode */
    word-break: break-word;
}

/* 段落 - 像是在读一封旧信 | Paragraphs - like reading an old letter */
#mdb p {
    margin-top: 26px;
    margin-bottom: 26px;
    line-height: 1.9;
    letter-spacing: 0.8px;
    /* 字间距稍大 | Slightly larger letter spacing */
    text-align: justify;
    color: #5D4037;
    font-size: 16px;
}

/* 
 * 一级标题 - 电影片名风格 | H1 - Movie Title Style
 * 上下双线装饰 | Top and bottom double-line decoration
 */
#mdb h1 {
    margin-top: 60px;
    margin-bottom: 50px;
    text-align: center;
    border-top: 4px double #B33D25;
    /* 双实线 | Double solid lines */
    border-bottom: 1px solid #B33D25;
    padding: 20px 0;
}

#mdb h1 .content {
    font-size: 26px;
    font-weight: 900;
    color: #B33D25;
    display: inline-block;
    line-height: 1.2;
    letter-spacing: 3px;
}

#mdb h1 .prefix,
#mdb h1 .suffix {
    display: none;
}

/* 
 * 二级标题 - 邮票/标签风格 | H2 - Stamp/Label Style
 * 实心背景 + 白字 | Solid background + White text
 */
#mdb h2 {
    margin-top: 50px;
    margin-bottom: 30px;
    text-align: left;
}

#mdb h2 .content {
    display: inline-block;
    font-size: 19px;
    font-weight: bold;
    color: #FFFBF0;
    /* 米白字 | Off-white text */
    background-color: #B33D25;
    /* 陶土红底 | Terracotta red background */
    padding: 8px 16px;
    border-radius: 2px;
    box-shadow: 4px 4px 0px rgba(179, 61, 37, 0.2);
    /* 淡淡的复古阴影 | Subtle vintage shadow */
    line-height: 1.2;
}

#mdb h2 .prefix,
#mdb h2 .suffix {
    display: none;
}

/* 
 * 三级标题 - 像书本的小节 | H3 - Like a book section
 * 咖啡色文字 + 左侧装饰 | Coffee text + left decoration
 */
#mdb h3 {
    margin-top: 40px;
    margin-bottom: 20px;
}

#mdb h3 .content {
    font-size: 18px;
    font-weight: bold;
    color: #8D5B4C;
    display: inline-block;
    padding-left: 10px;
    border-left: 4px solid #D98C45;
    /* 琥珀黄 | Amber Yellow */
}

#mdb h3 .prefix,
#mdb h3 .suffix {
    display: none;
}

/* 
 * 四级标题 - 极简下划线 | H4 - Minimalist Underline
 */
#mdb h4 {
    margin-top: 30px;
    margin-bottom: 15px;
    text-align: left;
}

#mdb h4 .content {
    display: inline-block;
    font-size: 16px;
    font-weight: bold;
    color: #B33D25;
    border-bottom: 2px solid #F2C94C;
    /* 亮黄线条 | Bright yellow line */
    padding-bottom: 2px;
}

#mdb h4 .prefix,
#mdb h4 .suffix {
    display: none;
}

/* 列表 - 经典的实心方点 | List - Classic solid square dots */
#mdb ul {
    list-style-type: square;
    padding-left: 20px;
    margin: 20px 0;
    color: #D98C45;
}

#mdb ul li {
    margin-bottom: 12px;
    line-height: 1.8;
}

#mdb li section {
    color: #5D4037;
    font-size: 16px;
}

/* 有序列表 | Ordered List */
#mdb ol {
    list-style-type: decimal;
    padding-left: 20px;
    margin: 20px 0;
    color: #B33D25;
    font-weight: bold;
    font-family: serif;
    /* 数字也用衬线体，很有味道 | Numbers also use serif fonts, very stylish */
}

#mdb ol li {
    margin-bottom: 12px;
    line-height: 1.8;
}

#mdb ol li section {
    color: #5D4037;
    font-weight: normal;
    font-size: 16px;
}

#mdb ul ul {
    list-style-type: circle;
    color: #8D5B4C;
    margin-top: 8px;
}

#mdb ol ol {
    list-style-type: lower-roman;
    color: #B33D25;
}

/* 
 * 引用 - 泛黄的旧报纸 | Blockquote - Yellowed old newspaper
 * 深米色背景 + 棕色边框 | Deep beige background + brown border
 */
#mdb .multiquote-1,
#mdb .multiquote-2,
#mdb .multiquote-3 {
    margin: 36px 0;
    padding: 24px;
    background-color: #F7EED6;
    /* 泛黄背景 | Yellowed background */
    border-left: 3px solid #8D5B4C;
    /* 咖啡色边框 | Coffee border */
    border-radius: 2px;
    overflow: visible;
}

#mdb .multiquote-1 p,
#mdb .multiquote-2 p,
#mdb .multiquote-3 p {
    margin: 0;
    color: #6D4C41;
    font-size: 15px;
    line-height: 1.8;
    font-style: italic;
}

#mdb .multiquote-2 {
    margin: 34px 0;
    padding: 22px;
    background: #FFF8E7;
    border-left: 3px solid #D98C45;
    border-radius: 2px;
}

#mdb .multiquote-3 {
    margin: 32px 0;
    padding: 20px;
    background: #FFFBF0;
    border-left: 2px solid #D98C45;
    border-radius: 2px;
}

/* 链接 - 像是手写的下划线 | Links - like handwritten underlines */
#mdb a {
    color: #B33D25;
    text-decoration: none;
    border-bottom: 1px solid #B33D25;
    font-weight: bold;
    transition: opacity 0.2s;
}

/* 
 * 加粗 - 重点标记 | Bold - Key markers
 * 像是用深色马克笔划过 | Like marked with a dark marker
 */
#mdb strong {
    color: #B33D25;
    font-weight: 900;
    margin: 0 2px;
}

/* 斜体 | Italic */
#mdb em {
    color: #D98C45;
    font-style: italic;
    font-weight: bold;
}

#mdb em strong {
    color: #B33D25;
}

/* 高亮 - 暖黄背景 | Highlight - Warm yellow background */
#mdb mark {
    background: rgba(242, 201, 76, 0.3);
    color: #B33D25;
    padding: 2px 4px;
    border-radius: 2px;
}

/* 删除线 | Strikethrough */
#mdb del {
    text-decoration: line-through;
    color: #8D5B4C;
}

/* 分隔线 - 虚线剪裁线 | Divider - Dashed cutting line */
#mdb hr {
    margin: 60px auto;
    border: 0;
    height: 1px;
    border-top: 2px dashed #D98C45;
    /* 剪裁线风格 | Cutting line style */
    width: 100%;
}

/* 
 * 图片 - 老照片风格 | Image - Old photo style
 * 加上白色边框和阴影 | With white border and shadow
 */
#mdb img {
    display: block;
    margin: 40px auto;
    width: 95%;
    /* 稍微留点白边 | Leave some white space */
    border: 8px solid #fff;
    /* 模拟照片白边 | Simulate photo white border */
    box-shadow: 0 10px 25px rgba(93, 64, 55, 0.15);
    background: #fff;
}

#mdb figcaption {
    font-size: 13px;
    color: #8D5B4C;
    margin-top: 15px;
    font-style: italic;
    font-family: serif;
}

/* 行内代码 - 咖啡色块 | Inline Code - Coffee color block */
#mdb p code,
#mdb li code {
    color: #5D4037;
    background: #EFE6D5;
    border: none;
    padding: 2px 6px;
    margin: 0 4px;
    border-radius: 3px;
    font-size: 14px;
    font-family: serif;
    /* 代码也用衬线体，保持复古感 | Code also uses serif fonts to maintain a vintage feel */
}

/* 代码块 - 复古打字机配色 | Code Block - Vintage typewriter color scheme */
/* 代码块 - 注意：不要设置 color，让语法高亮主题控制文字颜色 | Code Block - Note: Do not set color, let the syntax highlighting theme control the text color */
#mdb pre code.hljs {
    display: block;
    padding: 20px;
    background: #4A3B32;
    /* 深咖啡背景 | Dark coffee background */
    color: #E6CBB5;
    /* 默认奶茶色文字 | Default milk tea color text */
    font-size: 13px;
    line-height: 1.6;
    border-radius: 4px;
    font-family: "Courier New", Courier, monospace;
    /* 打字机字体 | Typewriter font */
    overflow-x: auto;
    white-space: pre;
  min-width: max-content;
    border: 4px solid #F7EED6;
}

/* 优化深色背景下的语法高亮颜色 - 使用暖色调高对比度颜色 | Optimize syntax highlighting colors on dark backgrounds - using warm tones and high contrast colors */
#mdb pre code.hljs .hljs-comment,
#mdb pre code.hljs .hljs-quote {
    color: #A68B7A;
}

#mdb pre code.hljs .hljs-keyword,
#mdb pre code.hljs .hljs-selector-tag {
    color: #FFB84D;
    font-weight: bold;
}

#mdb pre code.hljs .hljs-string,
#mdb pre code.hljs .hljs-doctag {
    color: #FFD4A3;
}

#mdb pre code.hljs .hljs-number,
#mdb pre code.hljs .hljs-literal {
    color: #C9A961;
}

#mdb pre code.hljs .hljs-title,
#mdb pre code.hljs .hljs-section {
    color: #F7EED6;
    font-weight: bold;
}

#mdb pre code.hljs .hljs-built_in,
#mdb pre code.hljs .hljs-builtin-name {
    color: #E6CBB5;
    font-weight: bold;
}

/* 如果没有语法高亮，设置默认奶茶色 | If there is no syntax highlighting, set the default milk tea color */
#mdb pre code:not(.hljs) {
    color: #E6CBB5;
    background: #4A3B32;
    border: 4px solid #F7EED6;
}

/* 表格 - 复古账单 | Table - Vintage Bill */
#mdb table {
    width: 100%;
    border-collapse: collapse;
    margin: 40px 0;
    font-size: 14px;
    border: 2px solid #8D5B4C;
}

#mdb table tr th {
    background: #EFE6D5;
    color: #4A3B32;
    font-weight: bold;
    border: 1px solid #8D5B4C;
    padding: 12px 10px;
    text-align: center;
}

#mdb table tr td {
    border: 1px solid #8D5B4C;
    padding: 12px 10px;
    color: #5D4037;
    background: #FFFBF0;
}

/* 脚注 */
#mdb .footnote-word,
#mdb .footnote-ref {
    color: #B33D25;
}

#mdb .footnotes-sep {
    border-top: 1px solid #D98C45;
    padding-top: 20px;
    margin-top: 60px;
    font-size: 12px;
    color: #8D5B4C;
    text-align: center;
    font-family: serif;
}

#mdb .footnote-num {
    font-weight: bold;
    color: #FFFBF0;
    background-color: #D98C45;
    border-radius: 50%;
    width: 16px;
    height: 16px;
    display: inline-block;
    text-align: center;
    line-height: 16px;
    font-size: 11px;
    margin-right: 4px;
}

#mdb .footnote-item p {
    color: #8D5B4C;
    font-size: 12px;
    margin: 4px 0;
}

/* 公式 */
#mdb .block-equation svg {
    max-width: 100%;
}

#mdb .inline-equation svg {
    max-width: 100%;
    vertical-align: middle;
}

/* 提示块 - 落日胶片风格 */
#mdb .callout {
    margin: 36px 0;
    padding: 24px;
    background: #F7EED6;
    border-left: 3px solid #8D5B4C;
    border-radius: 2px;
}

#mdb .callout-title {
    font-weight: bold;
    margin-bottom: 10px;
    color: #B33D25;
    font-family: serif;
    font-size: 15px;
}

#mdb .callout-icon {
    margin-right: 6px;
}

#mdb .callout-note { border-left-color: #8D5B4C; }
#mdb .callout-tip { border-left-color: #D98C45; }
#mdb .callout-important { border-left-color: #8D5B4C; }
#mdb .callout-warning { border-left-color: #D98C45; }
#mdb .callout-caution { border-left-color: #B33D25; }

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
