export const basicTheme = `/* 默认样式，最佳实践 | Default Style, Best Practices */

/* 全局属性 | Global Attributes */
#mdb {
  font-size: 16px;
  color: #000000;
  padding: 0 10px;
  line-height: 1.6;
  word-spacing: 0px;
  letter-spacing: 0px;
  word-break: break-word;
  word-wrap: break-word;
  text-align: left;
  font-family: Optima-Regular, Optima, PingFangSC-light, PingFangTC-light, 'PingFang SC', Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
}

/* 段落 | Paragraph */
#mdb p {
  font-size: 16px;
  margin-top: 10px;
  margin-bottom: 10px;
  line-height: 26px;
  color: #000000;
}

/* 标题 | Heading */
#mdb h1,
#mdb h2,
#mdb h3,
#mdb h4,
#mdb h5,
#mdb h6 {
  margin-top: 30px;
  margin-bottom: 15px;
  padding: 0px;
  font-weight: bold;
  color: #000000;
}
#mdb h1 {
  font-size: 24px;
}
#mdb h2 {
  font-size: 22px;
}
#mdb h3 {
  font-size: 20px;
}
#mdb h4 {
  font-size: 18px;
}
#mdb h5 {
  font-size: 16px;
}
#mdb h6 {
  font-size: 16px;
}

#mdb h1 .prefix,
#mdb h2 .prefix,
#mdb h3 .prefix,
#mdb h4 .prefix,
#mdb h5 .prefix,
#mdb h6 .prefix {
  display: none;
}

#mdb h1 .suffix,
#mdb h2 .suffix,
#mdb h3 .suffix,
#mdb h4 .suffix,
#mdb h5 .suffix,
#mdb h6 .suffix {
  display: none;
}

/* 列表 | List */
#mdb ul,
#mdb ol {
  margin-top: 8px;
  margin-bottom: 8px;
  padding-left: 25px;
  color: #000000;
}
#mdb ul {
  list-style-type: disc;
}
#mdb ol {
  list-style-type: decimal;
}
#mdb li section {
  margin-top: 5px;
  margin-bottom: 5px;
  line-height: 26px;
  text-align: left;
  color: #010101; /* 使用接近黑色的 HEX，避免微信吞掉纯黑色 | Use HEX close to black to avoid WeChat stripping pure black */
  font-weight: 500;
}

/* 术语列表 | Definition List */
#mdb dl {
  margin: 20px 0;
  padding: 0;
}

#mdb dt {
  font-weight: bold;
  font-size: 1.1em;
  margin-top: 16px;
  color: #000000;
}

#mdb dt::after {
  content: "：";
  display: inline;
}

#mdb dd {
  margin-left: 0;
  margin-top: 4px;
  color: #333333;
  line-height: 1.6;
}

#mdb dd p {
  margin: 4px 0;
}

/* 引用 | Blockquote */
#mdb blockquote {
  border: none;
}

#mdb .multiquote-1 {
  display: block;
  font-size: 0.9em;
  overflow: auto;
  overflow-scrolling: touch;
  border-left: 3px solid rgba(0, 0, 0, 0.4);
  background: rgba(0, 0, 0, 0.05);
  color: #6a737d;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 20px;
  padding-right: 10px;
  margin-bottom: 20px;
  margin-top: 20px;
}

#mdb .multiquote-1 p {
  margin: 0px;
  color: #000000;
  line-height: 26px;
}

#mdb .multiquote-2 {
  box-shadow: 1px 1px 10px rgba(0,0,0,0.2);
  padding: 20px;
  margin-bottom: 20px;
  margin-top: 20px;
}

#mdb .multiquote-3 {
  box-shadow: 1px 1px 10px rgba(0,0,0,0.2);
  padding: 20px;
  margin-bottom: 20px;
  margin-top: 20px;
}

#mdb .multiquote-3 p {
  text-align: center;
}

#mdb .multiquote-3 h3 {
  text-align: center;
}

#mdb .table-of-contents a {
  border: none;
  color: #000000;
  font-weight: normal;
}

/* 链接 | Link */
#mdb a {
  text-decoration: none;
  color: #1e6bb8;
  word-wrap: break-word;
  font-weight: bold;
  border-bottom: 1px solid #1e6bb8;
}

/* 加粗 | Bold */
#mdb strong {
  font-weight: bold;
  color: #000000;
}

/* 斜体 | Italic */
#mdb em {
  font-style: italic;
  color: #000000;
}

/* 加粗斜体 | Bold Italic */
#mdb em strong {
  font-weight: bold;
  color: #000000;
}

/* 删除线 | Strikethrough */
#mdb del {
  font-style: italic;
  color: #000000;
}

/* 分隔线 | Horizontal Rule */
#mdb hr {
  height: 1px;
  margin: 0;
  margin-top: 10px;
  margin-bottom: 10px;
  border: none;
  border-top: 1px solid black;
}

/* 代码块容器 */
#mdb pre {
  margin: 10px 0;
  position: relative;
  padding: 0;
  border-radius: 6px;
  overflow: hidden;
}

#mdb pre.custom::before {
  content: "";
  position: absolute;
  top: 10px;
  left: 12px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #ff5f56;
  box-shadow: 20px 0 0 #ffbd2e, 40px 0 0 #27c93f;
  z-index: 10;
}

#mdb pre code {
  display: block;
  font-family: Operator Mono, Consolas, Monaco, Menlo, monospace;
  border-radius: 0px;
  font-size: 12px;
  white-space: pre;
  width: 100%;
  box-sizing: border-box;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  padding: 36px 16px 16px;
}

#mdb pre code span {
  line-height: 26px;
}

/* Mermaid */
#mdb .mermaid {
  background: #f8f8f8;
  display: flex;
  justify-content: center;
  margin: 20px 0;
  overflow-x: auto;
  padding: 16px;
  border-radius: 6px;
  white-space: pre;
  font-family: inherit;
  font-size: inherit;
}

#mdb .mermaid svg {
  display: block;
  width: 100%;
  max-width: 100%;
  height: auto;
}

#mdb .mermaid svg line,
#mdb .mermaid svg path {
  vector-effect: non-scaling-stroke;
}

#mdb .mermaid svg text {
  letter-spacing: 0;
  word-spacing: 0;
  font-kerning: normal;
}

#mdb .mermaid svg .eventWrapper {
  filter: none;
}

#mdb .mermaid .label {
  text-align: left;
  white-space: normal;
  letter-spacing: 0;
  word-spacing: 0;
  font-kerning: normal;
}
#mdb .mermaid .label * {
  letter-spacing: 0;
  word-spacing: 0;
}

/* 行内代码 */
#mdb p code,
#mdb li code {
  font-size: 14px;
  word-wrap: break-word;
  padding: 2px 4px;
  border-radius: 4px;
  margin: 0 2px;
  color: #1e6bb8;
  background-color: rgba(27,31,35,.05);
  font-family: Operator Mono, Consolas, Monaco, Menlo, monospace;
  word-break: break-all;
}

/* 图片 */
#mdb img {
  display: block;
  margin: 0 auto;
  max-width: 100%;
}

/* 图片 */
#mdb figure {
  margin: 0;
  margin-top: 10px;
  margin-bottom: 10px;
}

/* 图片描述文字 */
#mdb figcaption {
  margin-top: 5px;
  text-align: center;
  color: #888;
  font-size: 14px;
}


/* 表格容器 */
#mdb .table-container{
  overflow-x: auto;
}

/* 表格 */
#mdb table {
  display: table;
  text-align: left;
}
#mdb tbody {
  border: 0;
}

#mdb table tr {
  border: 0;
  border-top: 1px solid #ccc;
  background-color: #ffffff;
}

#mdb table tr:nth-child(2n) {
  background-color: #F8F8F8;
}

#mdb table tr th,
#mdb table tr td {
  font-size: 16px;
  border: 1px solid #ccc;
  padding: 5px 10px;
  text-align: left;
}

#mdb table tr th {
  font-weight: bold;
  background-color: #f0f0f0;
}

/* 表格最小列宽4个汉字 */
#mdb table tr th:nth-of-type(n),
#mdb table tr td:nth-of-type(n){
  min-width:85px;
}

#mdb .footnote-word {
  color: #1e6bb8;
  font-weight: bold;
}

#mdb .footnote-ref {
  color: #1e6bb8;
  font-weight: bold;
}

#mdb .footnote-item {
  display: flex;
}

#mdb .footnote-num {
  display: inline;
  width: 10%;
  background: none;
  font-size: 80%;
  opacity: 0.6;
  line-height: 26px;
  font-family: ptima-Regular, Optima, PingFangSC-light, PingFangTC-light, 'PingFang SC', Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
}

#mdb .footnote-item p {
  display: inline;
  font-size: 14px;
  width: 90%;
  padding: 0px;
  margin: 0;
  line-height: 26px;
  color: #000000;
  word-break:break-all;
  width: calc(100%-50)
}

#mdb sub, sup {
  line-height: 0;
}

#mdb .footnotes-sep:before {
  content: "参考资料";
  display: block;
}

/* 解决公式问题 */
#mdb .block-equation {
  display:block;
  text-align: center;
  overflow: auto;
  display: block;
  -webkit-overflow-scrolling: touch;
}

#mdb .block-equation svg {
  max-width: 300%;
  -webkit-overflow-scrolling: touch;
}

#mdb .inline-equation {
}

#mdb .inline-equation svg {
}

#mdb .imageflow-layer1 {
  margin-top: 1em;
  margin-bottom: 0.5em;
  white-space: normal;
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

#mdb .nice-suffix-juejin-container {
  margin-top: 20px;
}

#mdb figure a {
  border: none;
}

#mdb figure a img {
  margin: 0px;
}

#mdb figure {
  display:flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

/* 图片链接嵌套 */
#mdb figure a {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 图片链接嵌套，图片解释 */
#mdb figure a + figcaption {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: -35px;
  background: rgba(0,0,0,0.7);
  color: #ffffff;
  line-height: 35px;
  z-index: 20;
}

#mdb .callout {
  margin: 24px 0;
  padding: 18px 20px;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  box-shadow: 0 12px 25px rgba(15, 23, 42, 0.08);
}

#mdb .callout-title {
  font-weight: 600;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  letter-spacing: 0.05em;
}

#mdb .callout-icon {
  font-size: 18px;
}

#mdb .callout-note { border-left: 4px solid #6366f1; background: #f5f5ff; }
#mdb .callout-tip { border-left: 4px solid #10b981; background: #ecfdf5; }
#mdb .callout-important { border-left: 4px solid #8b5cf6; background: #f5f3ff; }
#mdb .callout-warning { border-left: 4px solid #f59e0b; background: #fffbeb; }
#mdb .callout-caution { border-left: 4px solid #ef4444; background: #fff5f5; }


#mdb .task-list-item {
  list-style: none;
  margin-left: -1.2em;
  margin-bottom: 6px;
  display: flex;
  gap: 8px;
  align-items: flex-start;
}

#mdb .task-list-item input[type='checkbox'] {
  margin-top: 4px;
  pointer-events: none;
}
`;
