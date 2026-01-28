export const auroraGlassTheme = `/* 极光玻璃风格 | Aurora Glass Style */
#mdb {
  padding: 24px 20px;
  max-width: 677px;
  margin: 0 auto;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
  color: #333;
  /* 背景透明，兼容微信深色模式 | Transparent background, compatible with WeChat dark mode */
  background-color: transparent;
  word-break: break-word;
}

/* 段落 - 增加呼吸感 | Paragraph - Increase breathing room */
#mdb p {
  margin-top: 22px;
  margin-bottom: 22px;
  line-height: 1.9;
  letter-spacing: 0.6px;
  text-align: justify;
  color: #444;
  font-size: 16px;
}

/* 
 * 一级标题 - 渐变流光文字 | Level 1 Heading - Gradient Flowing Text
 * 使用 background-clip 实现文字渐变 | Use background-clip for text gradient
 */
#mdb h1 {
  margin-top: 60px;
  margin-bottom: 50px;
  text-align: center;
}

#mdb h1 .content {
  font-size: 26px;
  font-weight: 800;
  display: inline-block;
  /* 核心渐变色：蓝 -> 紫 -> 粉 | Core gradient: Blue -> Purple -> Pink */
  background-image: linear-gradient(135deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  /* 文字透明，透出背景 | Transparent text, revealing background */
  line-height: 1.4;
  padding-bottom: 10px;
  /* 底部加一条极细的渐变线 | Add a very thin gradient line at the bottom */
  border-bottom: 2px solid #eee;
  border-image: linear-gradient(135deg, #4158D0 0%, #C850C0 100%) 1;
}

#mdb h1 .prefix,
#mdb h1 .suffix {
  display: none;
}

/* 
 * 二级标题 - 悬浮渐变按钮 | Level 2 Heading - Floating Gradient Button
 * 看起来像一个精致的 APP 图标或按钮 | Looks like an exquisite APP icon or button
 */
#mdb h2 {
  margin-top: 60px;
  margin-bottom: 30px;
  text-align: left;
}

#mdb h2 .content {
  display: inline-block;
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  /* 白字 | White text */
  /* 同样的极光渐变背景 | Same Aurora gradient background */
  background-image: linear-gradient(90deg, #4158D0 0%, #C850C0 100%);
  padding: 8px 18px;
  border-radius: 20px 20px 20px 4px;
  /* 不对称圆角，更灵动 | Asymmetric rounded corners, more dynamic */
  box-shadow: 0 8px 16px rgba(200, 80, 192, 0.3);
  /* 彩色弥散投影 | Color diffused shadow */
  line-height: 1.2;
}

#mdb h2 .prefix,
#mdb h2 .suffix {
  display: none;
}

/* 
 * 三级标题 - 渐变下划线 | Level 3 Heading - Gradient Underline
 */
#mdb h3 {
  margin-top: 35px;
  margin-bottom: 15px;
}

#mdb h3 .content {
  font-size: 17px;
  font-weight: 700;
  color: #333;
  display: inline-block;
  position: relative;
  /* 使用 background 模拟只有一半高度的下划线 | Use background to simulate half-height underline */
  background: linear-gradient(90deg, rgba(65, 88, 208, 0.2) 0%, rgba(200, 80, 192, 0.2) 100%);
  background-size: 100% 40%;
  /* 宽度100%，高度40% | Width 100%, Height 40% */
  background-repeat: no-repeat;
  background-position: 0 90%;
  /* 位于底部 | Located at the bottom */
  padding: 0 4px;
}

#mdb h3 .prefix,
#mdb h3 .suffix {
  display: none;
}

/* 
 * 四级标题 - 极简圆点 | Level 4 Heading - Minimalist Dot
 */
#mdb h4 {
  margin-top: 24px;
  margin-bottom: 12px;
  text-align: left;
}

#mdb h4 .content {
  display: inline-block;
  font-size: 16px;
  font-weight: 700;
  color: #4158D0;
  background-color: #f0f2ff;
  padding: 4px 12px;
  border-radius: 12px;
  line-height: 1.4;
}

#mdb h4 .prefix,
#mdb h4 .suffix {
  display: none;
}

/* 
 * 列表 - 炫彩圆点 | List - Colorful Dots
 */
#mdb ul {
  list-style-type: disc;
  padding-left: 20px;
  margin: 20px 0;
  color: #C850C0;
  /* 列表符号粉紫色 | List bullet pink-purple */
}

#mdb ul li {
  margin-bottom: 10px;
  line-height: 1.8;
}

#mdb li section {
  color: #444;
  /* 正文深灰 | Body dark gray */
  font-size: 16px;
}

/* 有序列表 - 渐变色数字 (通过颜色模拟) | Ordered List - Gradient numbers (simulated via color) */
#mdb ol {
  list-style-type: decimal;
  padding-left: 20px;
  margin: 20px 0;
  color: #4158D0;
  /* 数字深蓝 | Number deep blue */
  font-weight: bold;
}

#mdb ul ul {
  list-style-type: circle;
  color: #4158D0;
  margin-top: 8px;
}

#mdb ol ol {
  list-style-type: lower-roman;
  color: #C850C0;
}

#mdb ol li {
  margin-bottom: 10px;
  line-height: 1.8;
}

#mdb ol li section {
  color: #444;
  font-weight: normal;
  font-size: 16px;
}

/* 
 * 引用 - 磨砂玻璃卡片 | Blockquote - Frosted Glass Card
 * 白底 + 柔和彩色投影 + 细微边框 | White background + Soft color projection + Subtle border
 */
#mdb .multiquote-1,
#mdb .multiquote-2,
#mdb .multiquote-3 {
  margin: 36px 0;
  padding: 24px;
  background-color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.8);
  /* 关键：双重投影，一层白光，一层彩光 | Key: Double projection, one layer of white light, one layer of colored light */
  box-shadow: -4px -4px 10px rgba(255, 255, 255, 0.8), 4px 4px 20px rgba(65, 88, 208, 0.1);
  border-radius: 16px;
  /* 顶部渐变装饰条 | Top gradient decoration strip */
  border-top: 4px solid #C850C0;
  overflow: visible;
}

#mdb .multiquote-1 p,
#mdb .multiquote-2 p,
#mdb .multiquote-3 p {
  margin: 0;
  color: #555;
  font-size: 15px;
  line-height: 1.8;
}

/* 链接 - 渐变虚线 | Link - Gradient dashed line */
#mdb a {
  color: #C850C0;
  text-decoration: none;
  border-bottom: 1px dashed #C850C0;
  font-weight: 600;
  padding-bottom: 1px;
}

/* 
 * 加粗 - 渐变文字 | Bold - Gradient Text
 * 与 H1 呼应，非常高级 | Echoes H1, very sophisticated
 */
#mdb strong {
  font-weight: 700;
  background-image: linear-gradient(135deg, #4158D0 0%, #C850C0 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  /* 文字透明，显示渐变 | Transparent text, showing gradient */
  /* 兼容性回退：如果不支持渐变文字，会显示上面的 color (这里设为 transparent 需注意) | Compatibility fallback: if gradient text is not supported, the color above will be displayed (note: set to transparent here) */
  /* 为了兼容，我们可以设一个 color fallback，但在 CSS 中很难覆盖 transparent | For compatibility, we can set a color fallback, but it's hard to override transparent in CSS */
  /* 微信环境完全支持 background-clip: text | WeChat environment fully supports background-clip: text */
  margin: 0 1px;
}

/* 斜体 | Italic */
#mdb em {
  color: #C850C0;
  font-style: italic;
}

#mdb em strong {
  color: #C850C0;
}

/* 高亮 - 渐变背景 | Highlight - Gradient Background */
#mdb mark {
    background: linear-gradient(135deg, rgba(65, 88, 208, 0.15), rgba(200, 80, 192, 0.15));
    color: #4158D0;
    padding: 2px 4px;
    border-radius: 3px;
}

/* 删除线 - 渐变色 | Strikethrough - Gradient Color */
#mdb del {
    text-decoration: line-through;
    color: #999;
    text-decoration-color: #C850C0;
}

/* 分隔线 - 渐变光束 | Separator - Gradient Beam */
#mdb hr {
  margin: 60px auto;
  border: 0;
  height: 2px;
  background-image: linear-gradient(90deg, rgba(247, 249, 252, 0) 0%, #C850C0 50%, rgba(247, 249, 252, 0) 100%);
  width: 80%;
}

/* 图片 - 悬浮投影 | Image - Floating Shadow */
#mdb img {
  display: block;
  margin: 40px auto;
  width: 100%;
  border-radius: 12px;
}

/* 行内代码 - 气泡风格 | Inline Code - Bubble Style */
#mdb p code,
#mdb li code {
  color: #4158D0;
  background: #f0f2ff;
  border: 1px solid rgba(65, 88, 208, 0.1);
  padding: 3px 6px;
  margin: 0 4px;
  border-radius: 6px;
  font-size: 14px;
  font-family: sans-serif;
}

/* 代码块 - 极简深色圆角 | Code Block - Minimalist Dark Rounded Corners */
/* 代码块 - 注意：不要设置 color，让语法高亮主题控制文字颜色 | Code Block - Note: Do not set color, let the syntax highlighting theme control text color */
#mdb pre code.hljs {
  display: block;
  padding: 20px;
  background: #282c34;
  /* 经典的 Atom One Dark | Classic Atom One Dark */
  color: #abb2bf;
  /* 默认文字颜色 | Default text color */
  font-size: 13px;
  line-height: 1.6;
  border-radius: 12px;
  font-family: sans-serif;
  overflow-x: auto;
  white-space: pre;
  min-width: max-content;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

/* 优化深色背景下的语法高亮颜色 | Optimize syntax highlighting colors on dark backgrounds */
#mdb pre code.hljs .hljs-comment,
#mdb pre code.hljs .hljs-quote {
  color: #5c6370;
}

#mdb pre code.hljs .hljs-keyword,
#mdb pre code.hljs .hljs-selector-tag {
  color: #c678dd;
  font-weight: bold;
}

#mdb pre code.hljs .hljs-string,
#mdb pre code.hljs .hljs-doctag {
  color: #98c379;
}

#mdb pre code.hljs .hljs-number,
#mdb pre code.hljs .hljs-literal {
  color: #d19a66;
}

#mdb pre code.hljs .hljs-title,
#mdb pre code.hljs .hljs-section {
  color: #61afef;
  font-weight: bold;
}

#mdb pre code.hljs .hljs-built_in,
#mdb pre code.hljs .hljs-builtin-name {
  color: #e06c75;
}

/* 如果没有语法高亮，设置默认灰色 | If no syntax highlighting, set default gray */
#mdb pre code:not(.hljs) {
  color: #abb2bf;
  background: #282c34;
}

/* 表格 - 清新风格 | Table - Fresh Style */
#mdb table {
  width: 100%;
  border-collapse: collapse;
  margin: 40px 0;
  font-size: 14px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
  border: 1px solid #f0f0f0;
}

#mdb table tr th {
  background: #f4f6f9;
  color: #4158D0;
  font-weight: 700;
  border: 1px solid #f0f0f0;
  padding: 12px 10px;
  text-align: left;
}

#mdb table tr td {
  border: 1px solid #f0f0f0;
  padding: 12px 10px;
  color: #555;
  background: #fff;
}

/* 脚注 | Footnotes */
#mdb .footnote-word,
#mdb .footnote-ref {
  color: #4158D0;
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
  color: #fff;
  background: #C850C0;
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
  color: #999;
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

/* 提示块 - 极光玻璃风格 | Callout - Aurora Glass Style */
#mdb .callout {
  margin: 30px 0;
  padding: 20px;
  background: rgba(255, 255, 255, 0.8);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 20px rgba(65, 88, 208, 0.1);
}

#mdb .callout-title {
  font-weight: 700;
  margin-bottom: 10px;
  background: linear-gradient(135deg, #4158D0, #C850C0);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-size: 16px;
}

#mdb .callout-icon {
  margin-right: 6px;
}

#mdb .callout-note {
  border-left: 4px solid #6366f1;
}

#mdb .callout-tip {
  border-left: 4px solid #C850C0;
}

#mdb .callout-important {
  border-left: 4px solid #4158D0;
}

#mdb .callout-warning {
  border-left: 4px solid #FFCC70;
}

#mdb .callout-caution {
  border-left: 4px solid #ef4444;
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
