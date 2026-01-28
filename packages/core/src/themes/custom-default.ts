export const customDefaultTheme = `/* 自定义样式,实时生效,浏览器实时缓存 | Custom style, takes effect in real-time, browser real-time cache */

/* 全局属性 | Global Attributes
 * 页边距 | Padding: 30px;
 * 全文字体 | Global Font: ptima-Regular;
 * 英文换行 | English Line Break: break-all;
 */
#mdb {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
  color: #2c3e50;
  line-height: 1.8;
  font-size: 16px;
  letter-spacing: 0.3px;
}

/* 段落,下方未标注标签参数均同此处 | Paragraph, parameters for unlabeled tags below are the same as here
 * 上边距 | Margin Top: 5px;
 * 下边距 | Margin Bottom: 5px;
 * 行高 | Line Height: 26px;
 * 词间距 | Word Spacing: 3px;
 * 字间距 | Letter Spacing: 3px;
 * 对齐 | Alignment: left;
 * 颜色 | Color: #3e3e3e;
 * 字体大小 | Font Size: 16px;
 * 首行缩进 | First Line Indent: 2em;
 */
#mdb p {
  margin: 20px 0;
  font-size: 16px;
  color: #34495e;
  line-height: 1.8;
  letter-spacing: 0.5px;
}

/* 一级标题 | Level 1 Heading */
#mdb h1 {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 40px 0 24px;
  text-align: center;
  padding-bottom: 12px;
  border-bottom: 2px solid #07c160;
  letter-spacing: 1px;
}

/* 一级标题内容 | Level 1 Heading Content */
#mdb h1 .content {
}

/* 一级标题前缀 | Level 1 Heading Prefix */
#mdb h1 .prefix {
}

/* 一级标题后缀 | Level 1 Heading Suffix */
#mdb h1 .suffix {
}

/* 二级标题 | Level 2 Heading */
#mdb h2 {
  font-size: 22px;
  font-weight: 600;
  color: #2c3e50;
  margin: 32px 0 16px;
  padding-left: 12px;
  border-left: 4px solid #07c160;
  line-height: 1.4;
  letter-spacing: 0.5px;
}

/* 二级标题内容 | Level 2 Heading Content */
#mdb h2 .content {
}

/* 二级标题前缀 | Level 2 Heading Prefix */
#mdb h2 .prefix {
}

/* 二级标题后缀 | Level 2 Heading Suffix */
#mdb h2 .suffix {
}

/* 三级标题 | Level 3 Heading */
#mdb h3 {
  font-size: 19px;
  font-weight: 600;
  color: #34495e;
  margin: 24px 0 12px;
  padding-left: 10px;
  border-left: 3px solid #07c160;
  letter-spacing: 0.3px;
}

/* 三级标题内容 | Level 3 Heading Content */
#mdb h3 .content {
}

/* 三级标题前缀 | Level 3 Heading Prefix */
#mdb h3 .prefix {
}

/* 三级标题后缀 | Level 3 Heading Suffix */
#mdb h3 .suffix {
}

/* 四级标题 | Level 4 Heading */
#mdb h4 {
  font-size: 17px;
  font-weight: 600;
  color: #07c160;
  margin: 20px 0 10px;
  letter-spacing: 0.3px;
}

/* 四级标题内容 | Level 4 Heading Content */
#mdb h4 .content {
}

/* 四级标题前缀 | Level 4 Heading Prefix */
#mdb h4 .prefix {
}

/* 四级标题后缀 | Level 4 Heading Suffix */
#mdb h4 .suffix {
}

/* 五级标题 | Level 5 Heading */
#mdb h5 {
  font-size: 16px;
  font-weight: 600;
  color: #5a6c7d;
  margin: 18px 0 8px;
}

/* 六级标题 | Level 6 Heading */
#mdb h6 {
  font-size: 15px;
  font-weight: 600;
  color: #7f8c8d;
  margin: 16px 0 8px;
}

/* 无序列表整体样式 | Unordered List Overall Style
 * list-style-type: square|circle|disc;
 */
#mdb ul {
  padding-left: 24px;
  list-style-type: disc;
  color: #34495e;
}

#mdb ul li {
  padding-left: 4px;
  color: #07c160;
}

#mdb ul li section {
  color: #34495e;
}

/* 嵌套列表 | Nested Lists */
#mdb ul ul {
  list-style-type: circle;
}

#mdb ul ul ul {
  list-style-type: square;
}

/* 有序列表整体样式 | Ordered List Overall Style
 * list-style-type: upper-roman|lower-greek|lower-alpha;
 */
#mdb ol {
  padding-left: 24px;
  list-style-type: decimal;
  color: #34495e;
}

#mdb ol li {
  padding-left: 4px;
}

/* 列表内容,不要设置li | List content, do not set li
 */
#mdb li section {
  margin: 8px 0;
  line-height: 1.8;
  font-size: 16px;
  color: #34495e;
}

/* 一级引用 | Level 1 Blockquote
 * 左边缘颜色 | Border Left Color: black;
 * 背景色 | Background Color: gray;
 */
#mdb .multiquote-1 {
  border-left: 4px solid #07c160;
  background: #f6f8fa;
  padding: 16px 20px;
  margin: 20px 0;
  color: #475569;
  border-radius: 2px;
}

/* 一级引用文字 | Level 1 Blockquote Text */
#mdb .multiquote-1 p {
  margin: 0;
  font-size: 15px;
  color: #475569;
  line-height: 1.8;
}

/* 二级引用 | Level 2 Blockquote
 */
#mdb .multiquote-2 {
  border-left: 3px solid #00a854;
  background: #fafafa;
  padding: 14px 18px;
  margin: 16px 0;
  border-radius: 2px;
}

/* 二级引用文字 | Level 2 Blockquote Text */
#mdb .multiquote-2 p {
  margin: 0;
  font-size: 15px;
  color: #64748b;
  line-height: 1.7;
}

/* 三级引用 | Level 3 Blockquote
 */
#mdb .multiquote-3 {
  border-left: 2px solid #07c160;
  background: #fafafa;
  padding: 12px 16px;
  margin: 14px 0;
  border-radius: 2px;
}

/* 三级引用文字 | Level 3 Blockquote Text */
#mdb .multiquote-3 p {
  margin: 0;
  font-size: 14px;
  color: #64748b;
}

/* 链接 | Links 
 * border-bottom: 1px solid #009688;
 */
#mdb a {
  color: #07c160;
  text-decoration: none;
  border-bottom: 1px solid #07c160;
  font-weight: 500;
}

/* 加粗 | Bold */
#mdb strong {
  font-weight: 600;
  color: #07c160;
  letter-spacing: 0.2px;
}

/* 斜体 | Italic */
#mdb em {
  font-style: italic;
  color: #07c160;
  font-weight: 500;
}

/* 加粗斜体 | Bold Italic */
#mdb em strong {
  font-weight: 700;
  font-style: italic;
  color: #00a854;
}

/* 删除线 | Strikethrough */
#mdb del {
  text-decoration: line-through;
  color: #94a3b8;
  opacity: 0.7;
}

/* 分隔线 | Horizontal Rule
* 粗细、样式和颜色 | Thickness, style and color
* border-top: 1px solid #3e3e3e;
*/
#mdb hr {
  border: none;
  height: 1px;
  background: #e2e8f0;
  margin: 28px 0;
}

/* 图片 | Image
* 宽度 | Width: 80%;
* 居中 | Center: margin: 0 auto;
* 居左 | Left: margin: 0 0;
*/
#mdb img {
  display: block;
  margin: 24px auto;
  max-width: 100%;
  border-radius: 4px;
}

/* 图片描述文字 | Image Caption Text */
#mdb figcaption {
  text-align: center;
  font-size: 14px;
  color: #94a3b8;
  margin-top: 8px;
  letter-spacing: 0.2px;
}

/* 行内代码 | Inline Code */
#mdb p code, #mdb li code {
  background: #f0fdf4;
  padding: 3px 6px;
  border-radius: 3px;
  color: #059669;
  font-family: "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, monospace;
  font-size: 0.9em;
  margin: 0 3px;
  border: 1px solid #bbf7d0;
}

/* 
 * 代码块不换行 | Code block no wrap: display: -webkit-box !important;
 * 代码块换行 | Code block wrap: display: block;
 */
#mdb pre code {
  display: block;
  background: #f8fafc;
  padding: 16px;
  border-radius: 4px;
  overflow-x: auto;
  font-family: "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, monospace;
  font-size: 14px;
  line-height: 1.6;
  color: #334155;
  border: 1px solid #e2e8f0;
}

/*
 * 表格内的单元格 | Cells within Table
 * 字体大小 | Font Size: 16px;
 * 边框 | Border: 1px solid #ccc;
 * 内边距 | Padding: 5px 10px;
 */
#mdb table tr th,
#mdb table tr td {
  border: 1px solid #e2e8f0;
  padding: 10px 14px;
  font-size: 15px;
  color: #334155;
  line-height: 1.6;
}

#mdb table tr th {
  background: #f0fdf4;
  color: #065f46;
  font-weight: 600;
  letter-spacing: 0.3px;
}

#mdb table tr:nth-child(2n) {
  background-color: #f8fafc;
}

/* 
 * 某一列表格列宽控制 | Specific Table Column Width Control
 * n 可以修改为具体数字,不修改时表示所有列 | n can be modified to a specific number, if not modified it represents all columns
 * 最小列宽 | Minimum Column Width: 85px;
 */
#mdb table tr th:nth-of-type(n),
#mdb table tr td:nth-of-type(n){
  min-width: 100px;
}

/* 脚注文字 | Footnote Text */
#mdb .footnote-word {
  color: #07c160;
  font-weight: 500;
  border-bottom: 1px dashed #07c160;
}

/* 脚注上标 | Footnote Superscript */
#mdb .footnote-ref {
  color: #07c160;
  font-weight: 600;
}

/* "参考资料"四个字 | "References" Title
 * 内容 | Content: "参考资料";
 */
#mdb .footnotes-sep:before {
  content: "参考资料";
  font-weight: 600;
  margin-top: 36px;
  margin-bottom: 16px;
  display: block;
  font-size: 18px;
  color: #1a1a1a;
  letter-spacing: 0.5px;
}

/* 参考资料编号 | Reference Number */
#mdb .footnote-num {
  display: inline-block;
  width: 24px;
  text-align: right;
  margin-right: 8px;
  color: #94a3b8;
  font-weight: 500;
}

/* 参考资料文字 | Reference Text */
#mdb .footnote-item p { 
  display: inline;
  font-size: 14px;
  color: #64748b;
  line-height: 1.8;
}

/* 参考资料解释 | Reference Explanation */
#mdb .footnote-item p em {
  font-style: normal;
  color: #94a3b8;
  margin-left: 6px;
}

/* 行间公式 | Block Equation
 * 最大宽度 | Max Width: 300% !important;
 */
#mdb .block-equation svg {
  display: block;
  margin: 20px auto;
  max-width: 300%;
}

/* 行内公式 | Inline Equation
 */
#mdb .inline-equation svg { 
  vertical-align: middle;
}

/* Callout 提示块 | Callout Block */
#mdb .callout {
  margin: 28px 0;
  padding: 22px 24px;
  border-radius: 22px;
  border: 1px solid rgba(7, 193, 96, 0.15);
  background: #ffffff;
  box-shadow: 0 25px 45px rgba(15, 23, 42, 0.12);
  position: relative;
  overflow: hidden;
}

#mdb .callout::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 22px;
  pointer-events: none;
  background: linear-gradient(120deg, rgba(7,193,96,0.05), rgba(7,89,193,0.03));
}

#mdb .callout-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #0f172a;
  font-size: 16px;
  letter-spacing: 0.05em;
}

#mdb .callout-icon {
  font-size: 20px;
}

#mdb .callout-note {
  border-color: rgba(100, 116, 255, 0.25);
  background: linear-gradient(135deg, #f7f9ff, #edf2ff);
}

#mdb .callout-tip {
  border-color: rgba(139, 92, 246, 0.25);
  background: linear-gradient(135deg, #f5f3ff, #ede9fe);
}

#mdb .callout-important {
  border-color: rgba(14, 165, 233, 0.25);
  background: linear-gradient(135deg, #f0f9ff, #e0f2ff);
}

#mdb .callout-warning {
  border-color: rgba(249, 158, 0, 0.25);
  background: linear-gradient(135deg, #fff8ed, #fff3dc);
}

#mdb .callout-caution {
  border-color: rgba(239, 68, 68, 0.25);
  background: linear-gradient(135deg, #fff5f5, #ffe7e7);
}


/* 高亮文本 | Highlighted Text */
#mdb mark {
  background: linear-gradient(135deg, #fff9c4, #fff59d);
  color: #1a1a1a;
  padding: 2px 4px;
  border-radius: 3px;
  font-weight: 500;
}

/* 上标 | Superscript */
#mdb sup {
  font-size: 0.75em;
  vertical-align: super;
  color: #059669;
}

/* 下标 | Subscript */
#mdb sub {
  font-size: 0.75em;
  vertical-align: sub;
  color: #059669;
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
