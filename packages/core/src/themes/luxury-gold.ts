export const luxuryGoldTheme = `/* 黑金奢华风格 | Luxury Gold Style */
#mdb {
    padding: 40px 22px;
    max-width: 677px;
    margin: 0 auto;
    /* 强制宋体/衬线体，移动端显示优雅字体的关键 | Forced Songti/Serif, the key to displaying elegant fonts on mobile */
    font-family: "Songti SC", "SimSun", "STSong", "Georgia", serif;
    color: #222;
    background-color: transparent;
    /* 透明背景，兼容微信深色模式 | Transparent background, compatible with WeChat dark mode */
    word-break: break-word;
}

/* 正文 - 疏朗的行间距 | Body - Spacious line spacing */
#mdb p {
    margin: 30px 0;
    line-height: 2.0;
    text-align: justify;
    color: #444;
    font-size: 16px;
}

/* 一级标题 - 极简留白 | H1 - Minimalist white space */
#mdb h1 {
    margin: 70px 0 50px;
    text-align: center;
}

#mdb h1 .content {
    font-size: 26px;
    font-weight: normal;
    color: #000;
    display: block;
    letter-spacing: 3px;
    border-bottom: 1px solid #000;
    /* 纯黑细线 | Pure black thin line */
    padding-bottom: 20px;
}

#mdb h1 .prefix,
#mdb h1 .suffix {
    display: none;
}

/* 二级标题 - 金色边框盒子 | H2 - Gold bordered box */
#mdb h2 {
    margin: 50px 0 30px;
    text-align: center;
}

#mdb h2 .content {
    display: inline-block;
    font-size: 19px;
    font-weight: normal;
    color: #9E8045;
    /* 复古金 | Vintage gold */
    border-top: 1px solid #9E8045;
    border-bottom: 1px solid #9E8045;
    padding: 10px 24px;
    letter-spacing: 1px;
}

#mdb h2 .prefix,
#mdb h2 .suffix {
    display: none;
}

/* 三级标题 - 纯黑大写感 | H3 - Pure black uppercase feel */
#mdb h3 {
    margin: 40px 0 20px;
    text-align: center;
}

#mdb h3 .content {
    font-size: 17px;
    font-weight: bold;
    color: #000;
    text-transform: uppercase;
    letter-spacing: 1px;
}

#mdb h3 .prefix,
#mdb h3 .suffix {
    display: none;
}

/* 四级标题 - 金色小标 | H4 - Gold small label */
#mdb h4 {
    margin: 30px 0 15px;
    text-align: center;
}

#mdb h4 .content {
    font-size: 16px;
    font-weight: normal;
    color: #9E8045;
    border-bottom: 1px solid #eee;
    padding-bottom: 4px;
}

#mdb h4 .prefix,
#mdb h4 .suffix {
    display: none;
}

/* 引用 - 居中衬线斜体 | Blockquote - Centered serif italic */
#mdb .multiquote-1,
#mdb .multiquote-2,
#mdb .multiquote-3 {
    margin: 40px 0;
    padding: 20px 30px;
    background: #fff;
    /* 保持纯白 | Keep pure white */
    border: none;
    text-align: center;
    border-left: none;
    /* 去掉默认左边框 | Remove default left border */
}

#mdb .multiquote-1 p {
    color: #666;
    font-style: italic;
    font-family: serif;
    font-size: 15px;
    line-height: 1.8;
}

#mdb .multiquote-2 {
    margin: 38px 0;
    padding: 18px 28px;
    background: #fff;
    border: none;
    text-align: center;
    border-left: 2px solid #9E8045;
}

#mdb .multiquote-2 p {
    color: #666;
    font-style: italic;
    font-family: serif;
    font-size: 15px;
}

#mdb .multiquote-3 {
    margin: 36px 0;
    padding: 16px 26px;
    background: #fafafa;
    border: none;
    text-align: center;
    border-left: 1px solid #9E8045;
}

#mdb .multiquote-3 p {
    color: #666;
    font-style: italic;
    font-family: serif;
    font-size: 15px;
}

/* 列表 - 精致的金点 | List - Exquisite gold dots */
#mdb ul {
    list-style: square;
    /* 方块比圆点更时尚 | Squares are more stylish than dots */
    padding-left: 20px;
    margin: 20px 0;
    color: #9E8045;
}

#mdb ul li {
    margin-bottom: 10px;
}

#mdb li section {
    color: #444;
}

/* 有序列表 | Ordered List */
#mdb ol {
    list-style: decimal;
    padding-left: 20px;
    margin: 20px 0;
    color: #9E8045;
}

#mdb ul ul {
    list-style-type: circle;
    color: #9E8045;
    margin-top: 8px;
}

#mdb ol ol {
    list-style-type: lower-roman;
    color: #9E8045;
}

#mdb ol li {
    margin-bottom: 10px;
}

#mdb ol li section {
    color: #444;
}

/* 链接 - 金色细线 | Links - Gold thin line */
#mdb a {
    color: #000;
    border-bottom: 1px solid #9E8045;
    text-decoration: none;
    transition: opacity 0.2s;
}

/* 加粗 - 金色高亮 | Bold - Gold highlight */
#mdb strong {
    color: #9E8045;
    font-weight: bold;
    margin: 0 2px;
}

/* 斜体 | Italic */
#mdb em {
    color: #9E8045;
    font-style: italic;
}

/* 加粗斜体 | Bold Italic */
#mdb em strong {
    color: #9E8045;
    font-weight: bold;
}

/* 高亮 - 淡金背景 | Highlight - Light gold background */
#mdb mark {
    background: rgba(158, 128, 69, 0.15);
    color: #9E8045;
    padding: 2px 6px;
    border-bottom: 1px solid rgba(158, 128, 69, 0.3);
}

/* 删除线 | Strikethrough */
#mdb del {
    text-decoration: line-through;
    color: #999;
    text-decoration-color: #9E8045;
}

/* 分隔线 - 极简短线 | Divider - Minimalist short line */
#mdb hr {
    margin: 60px auto;
    height: 1px;
    background: #9E8045;
    width: 40px;
    border: none;
}

/* 图片 - 纯净留白 | Images - Pure white space */
#mdb img {
    display: block;
    margin: 50px auto;
    width: 100%;
    /* 极淡的阴影，几乎看不见，增加一点立体感 | Very faint shadow, almost invisible, adds a bit of 3D feel */
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.06);
}

#mdb figcaption {
    color: #999;
    font-size: 12px;
    margin-top: 15px;
    text-align: center;
    font-style: italic;
    font-family: serif;
}

/* 
 * 行内代码 - 香槟金吊牌风格 (修复重点) | Inline Code - Champagne gold tag style (Fix priority)
 * 极淡的金色背景 + 细边框，精致感拉满 | Very light gold background + thin border, full of exquisite feel
 */
#mdb p code,
#mdb li code {
    color: #9E8045;
    /* 深金色文字 | Dark gold text */
    background: rgba(158, 128, 69, 0.06);
    /* 6%透明度的金色背景 | 6% transparency gold background */
    border: 1px solid rgba(158, 128, 69, 0.2);
    /* 20%透明度的金色边框 | 20% transparency gold border */
    padding: 2px 6px;
    margin: 0 4px;
    border-radius: 2px;
    font-size: 14px;
    font-family: serif;
    /* 保持衬线体风格 | Maintain serif style */
}

/* 代码块 - 极简黑白 | Code Block - Minimalist black and white */
/* 代码块 - 注意：不要设置 color，让语法高亮主题控制文字颜色 | Code Block - Note: Don't set color, let the syntax highlighting theme control text color */
#mdb pre code.hljs {
    display: block;
    padding: 20px;
    background: #fcfcfc;
    /* 接近纯白 | Close to pure white */
    /* color 由 .hljs 语法高亮主题控制 | color is controlled by the .hljs syntax highlighting theme */
    font-size: 13px;
    line-height: 1.6;
    border: 1px solid #eee;
    font-family: serif;
    /* 特意使用衬线体显示代码，极具艺术感 | Specially use serif fonts to display code, very artistic */
    overflow-x: auto;
    white-space: pre;
  min-width: max-content;
}

/* 如果没有语法高亮，设置默认深灰色 | If no syntax highlighting, set default dark gray */
#mdb pre code:not(.hljs) {
    color: #333;
    background: #fcfcfc;
    border: 1px solid #eee;
}

/* 表格 - 极简线条 | Table - Minimalist lines */
#mdb table {
    width: 100%;
    border-collapse: collapse;
    margin: 40px 0;
    font-size: 14px;
    border-top: 1px solid #000;
    border-bottom: 1px solid #000;
}

#mdb table tr th {
    color: #9E8045;
    font-weight: normal;
    border-bottom: 1px solid #eee;
    padding: 12px 10px;
    text-align: center;
}

#mdb table tr td {
    border-bottom: 1px solid #eee;
    padding: 12px 10px;
    color: #555;
    text-align: center;
}

/* 脚注 | Footnotes */
#mdb .footnote-word,
#mdb .footnote-ref {
    color: #9E8045;
}

#mdb .footnotes-sep {
    border-top: 1px solid #eee;
    padding-top: 20px;
    margin-top: 60px;
    font-size: 12px;
    color: #ccc;
    text-align: center;
}

#mdb .footnote-num {
    font-weight: bold;
    color: #9E8045;
    margin-right: 4px;
}

#mdb .footnote-item p {
    color: #999;
    font-size: 12px;
    margin: 4px 0;
}

/* 公式 | Equations */
#mdb .block-equation svg {
    max-width: 100%;
}

#mdb .inline-equation svg {
    max-width: 100%;
    vertical-align: middle;
}

/* 提示块 - 黑金奢华风格 | Callout - Luxury Gold Style */
#mdb .callout {
    margin: 40px 0;
    padding: 20px 30px;
    background: #fff;
    border: 1px solid rgba(158, 128, 69, 0.3);
    border-radius: 2px;
}

#mdb .callout-title {
    font-weight: normal;
    margin-bottom: 10px;
    color: #9E8045;
    font-family: serif;
    letter-spacing: 1px;
    font-size: 15px;
}

#mdb .callout-icon {
    margin-right: 6px;
}

#mdb .callout-note { border-left: 3px solid #9E8045; }
#mdb .callout-tip { border-left: 3px solid #9E8045; }
#mdb .callout-important { border-left: 3px solid #9E8045; }
#mdb .callout-warning { border-left: 3px solid #D98C45; }
#mdb .callout-caution { border-left: 3px solid #B33D25; }

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
