export const morandiForestTheme = `/* 莫兰迪森林风格 | Morandi Forest Style */
#mdb {
  padding: 30px 22px;
  max-width: 677px;
  margin: 0 auto;
  font-family: "Optima", "Georgia", "PingFang SC", "Microsoft YaHei", serif;
  color: #2F3E32;
  background-color: transparent;
  /* 透明背景，兼容微信深色模式 | Transparent background, compatible with WeChat dark mode */
  word-break: break-word;
}

/* 段落 | Paragraphs */
#mdb p {
  margin-top: 26px;
  margin-bottom: 26px;
  line-height: 2.0;
  letter-spacing: 0.5px;
  text-align: justify;
  color: #3A4D39;
  font-size: 16px;
}

/* 一级标题 | H1 */
#mdb h1 {
  margin-top: 60px;
  margin-bottom: 50px;
  text-align: center;
}

#mdb h1 .content {
  display: inline-block;
  font-size: 24px;
  font-weight: normal;
  color: #1A261D;
  padding: 12px 24px;
  border: 1px solid #739072;
  border-radius: 2px;
  background-color: #F1F4F0;
  letter-spacing: 2px;
}

#mdb h1 .prefix,
#mdb h1 .suffix {
  display: none;
}

/* 二级标题 | H2 */
#mdb h2 {
  margin-top: 50px;
  margin-bottom: 24px;
  text-align: left;
  border-bottom: 1px solid #E8EBE9;
  padding-bottom: 10px;
}

#mdb h2 .content {
  display: inline-block;
  font-size: 19px;
  font-weight: 700;
  color: #4F6F52;
  padding-left: 12px;
  border-left: 5px solid #4F6F52;
  line-height: 1.2;
  letter-spacing: 1px;
}

#mdb h2 .prefix,
#mdb h2 .suffix {
  display: none;
}

/* 三级标题 | H3 */
#mdb h3 {
  margin-top: 40px;
  margin-bottom: 20px;
  text-align: center;
}

#mdb h3 .content {
  font-size: 17px;
  font-weight: bold;
  color: #739072;
  display: inline-block;
  border-bottom: 2px dotted #739072;
  padding-bottom: 4px;
}

#mdb h3 .prefix,
#mdb h3 .suffix {
  display: none;
}

/* 四级标题 | H4 */
#mdb h4 {
  margin-top: 30px;
  margin-bottom: 15px;
  text-align: left;
}

#mdb h4 .content {
  display: inline-block;
  font-size: 15px;
  font-weight: 700;
  color: #fff;
  background-color: #86A789;
  padding: 4px 10px;
  border-radius: 4px;
  line-height: 1.4;
}

#mdb h4 .prefix,
#mdb h4 .suffix {
  display: none;
}

/* 列表 | Lists */
#mdb ul {
  list-style-type: disc;
  padding-left: 20px;
  margin: 20px 0;
  color: #86A789;
}

#mdb ul li {
  margin-bottom: 12px;
  line-height: 1.8;
}

#mdb li section {
  color: #3A4D39;
  font-size: 16px;
}

/* 有序列表 | Ordered List */
#mdb ol {
  list-style-type: decimal;
  padding-left: 20px;
  margin: 20px 0;
  color: #4F6F52;
  font-weight: bold;
}

#mdb ul ul {
  list-style-type: circle;
  color: #4F6F52;
  margin-top: 8px;
}

#mdb ol ol {
  list-style-type: lower-alpha;
  color: #739072;
}

#mdb ol li {
  margin-bottom: 12px;
  line-height: 1.8;
}

#mdb ol li section {
  color: #3A4D39;
  font-weight: normal;
  font-size: 16px;
}

/* 引用 | Blockquote */
#mdb .multiquote-1,
#mdb .multiquote-2,
#mdb .multiquote-3 {
  margin: 36px 0;
  padding: 24px;
  background-color: #F6F8F6;
  border: 1px dashed #739072;
  border-radius: 8px;
  overflow: visible;
}

#mdb .multiquote-1 p,
#mdb .multiquote-2 p,
#mdb .multiquote-3 p {
  margin: 0;
  color: #556B58;
  font-size: 15px;
  line-height: 1.8;
  font-family: "KaiTi", "STKaiti", serif;
}

/* 链接 | Links */
#mdb a {
  color: #4F6F52;
  text-decoration: none;
  border-bottom: 1px solid #4F6F52;
  font-weight: 600;
  padding-bottom: 0px;
}

/* 加粗 | Bold */
#mdb strong {
  color: #1A261D;
  font-weight: 700;
  background: linear-gradient(to top, rgba(134, 167, 137, 0.4) 50%, transparent 50%);
  margin: 0 2px;
  padding: 0 2px;
}

/* 斜体 | Italic */
#mdb em {
  color: #739072;
  font-style: italic;
}

#mdb em strong {
  color: #4F6F52;
}

/* 高亮 - 浅绿背景 | Highlight - Light green background */
#mdb mark {
  background: linear-gradient(to top, rgba(134, 167, 137, 0.3) 50%, transparent 50%);
  color: #1A261D;
  padding: 0 2px;
}

/* 删除线 | Strikethrough */
#mdb del {
  text-decoration: line-through;
  color: #889E8B;
}

/* 
 * 分隔线 | Divider
 * 修复了这里无效的颜色代码 #D2DSD4 | Fixed invalid color code #D2DSD4 here
 */
#mdb hr {
  margin: 60px auto;
  border: 0;
  height: 1px;
  background-color: #D2D4D4;
  /* 已修正 | Corrected */
  width: 60%;
}

/* 图片 | Images */
#mdb img {
  display: block;
  margin: 40px auto;
  width: 100%;
  border-radius: 2px;
  box-shadow: 0 8px 20px rgba(79, 111, 82, 0.15);
  padding: 6px;
  background: #fff;
  border: 1px solid #eee;
}

#mdb figcaption {
  font-size: 13px;
  color: #889E8B;
  margin-top: 10px;
  font-family: serif;
}

/* 行内代码 | Inline Code */
#mdb p code,
#mdb li code {
  color: #4F6F52;
  background: #EDF1EE;
  border: none;
  padding: 3px 6px;
  margin: 0 4px;
  border-radius: 4px;
  font-size: 14px;
  font-family: sans-serif;
}

/* 代码块 | Code Block */
/* 代码块 - 注意：不要设置 color，让语法高亮主题控制文字颜色 | Code Block - Note: Don't set color, let the syntax highlighting theme control text color */
#mdb pre code.hljs {
  display: block;
  padding: 20px;
  background: #F0F2F0;
  /* color 由 .hljs 语法高亮主题控制 | color is controlled by the .hljs syntax highlighting theme */
  font-size: 13px;
  line-height: 1.6;
  border-radius: 6px;
  font-family: sans-serif;
  overflow-x: auto;
  white-space: pre;
  min-width: max-content;
  border: 1px solid #DCE3DD;
}

/* 如果没有语法高亮，设置默认深绿色 | If no syntax highlighting, set default dark green */
#mdb pre code:not(.hljs) {
  color: #3A4D39;
  background: #F0F2F0;
  border: 1px solid #DCE3DD;
}

/* 
 * 表格 | Table
 * 修复了这里无效的颜色代码 #D2DSD4 | Fixed invalid color code #D2DSD4 here
 */
#mdb table {
  width: 100%;
  border-collapse: collapse;
  margin: 40px 0;
  font-size: 14px;
  border: 1px solid #D2D4D4;
  /* 已修正 | Corrected */
}

#mdb table tr th {
  background: #EDF1EE;
  color: #4F6F52;
  font-weight: 700;
  border: 1px solid #D2D4D4;
  /* 已修正 | Corrected */
  padding: 12px 10px;
  text-align: left;
}

#mdb table tr td {
  border: 1px solid #D2D4D4;
  /* 已修正 | Corrected */
  padding: 12px 10px;
  color: #555;
  background: #fff;
}

/* 脚注 | Footnotes */
#mdb .footnote-word,
#mdb .footnote-ref {
  color: #4F6F52;
}

#mdb .footnotes-sep {
  border-top: 1px solid #E8EBE9;
  padding-top: 20px;
  margin-top: 60px;
  font-size: 12px;
  color: #B0BEB3;
  text-align: center;
}

#mdb .footnote-num {
  font-weight: bold;
  color: #739072;
  margin-right: 4px;
}

#mdb .footnote-item p {
  color: #889E8B;
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

/* 提示块 - 莫兰迪森林风格 | Callout - Morandi Forest Style */
#mdb .callout {
  margin: 30px 0;
  padding: 20px;
  background: #F6F8F6;
  border: 1px dashed #739072;
  border-radius: 8px;
}

#mdb .callout-title {
  font-weight: 700;
  margin-bottom: 10px;
  color: #4F6F52;
  font-size: 15px;
}

#mdb .callout-icon {
  margin-right: 6px;
}

#mdb .callout-note { border-left: 4px solid #739072; }
#mdb .callout-tip { border-left: 4px solid #86A789; }
#mdb .callout-important { border-left: 4px solid #4F6F52; }
#mdb .callout-warning { border-left: 4px solid #D98C45; }
#mdb .callout-caution { border-left: 4px solid #B33D25; }

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
