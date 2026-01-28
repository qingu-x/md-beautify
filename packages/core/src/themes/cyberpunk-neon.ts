export const cyberpunkNeonTheme = `/* 赛博朋克风格 | Cyberpunk Style */
#mdb {
    padding: 24px 20px;
    max-width: 677px;
    margin: 0 auto;
    font-family: -apple-system, BlinkMacSystemFont, "Microsoft YaHei", sans-serif;
    color: #333;
    /* 深色文字，兼容微信 | Dark text, compatible with WeChat */
    background-color: transparent;
    /* 透明背景，兼容微信亮色/深色模式 | Transparent background, compatible with WeChat light/dark mode */
    word-break: break-word;
}

/* 正文 | Body Text */
#mdb p {
    margin: 22px 0;
    line-height: 1.75;
    text-align: justify;
    color: #444;
    font-size: 16px;
}

/* 一级标题 - 故障框线 | Level 1 Heading - Glitch Frame */
#mdb h1 {
    margin: 50px 0 40px;
    text-align: center;
}

#mdb h1 .content {
    font-size: 26px;
    font-weight: 900;
    color: #12161F;
    /* 深色文字 | Dark Text */
    display: inline-block;
    border: 2px solid #00F3FF;
    /* 青色实线框 | Cyan Solid Border */
    padding: 12px 24px;
    background: rgba(0, 243, 255, 0.1);
    /* 硬阴影模拟故障错位 | Hard shadow simulating glitch misalignment */
    box-shadow: 4px 4px 0px #FF00C1;
}

#mdb h1 .prefix,
#mdb h1 .suffix {
    display: none;
}

/* 二级标题 - 能量条 | Level 2 Heading - Energy Bar */
#mdb h2 {
    margin: 45px 0 25px;
    text-align: left;
}

#mdb h2 .content {
    display: inline-block;
    font-size: 20px;
    font-weight: bold;
    color: #12161F;
    /* 深色字 | Dark Text */
    background: linear-gradient(90deg, #00F3FF, #00F3FF);
    /* 纯青色背景 | Pure Cyan Background */
    padding: 6px 16px;
    /* 赛博切角 | Cyberpunk Cut Corners */
    clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);
    border-radius: 4px;
    /* 兼容回退 | Compatibility Fallback */
}

#mdb h2 .prefix,
#mdb h2 .suffix {
    display: none;
}

/* 三级标题 - 简单高亮 | Level 3 Heading - Simple Highlight */
#mdb h3 {
    margin: 30px 0 15px;
}

#mdb h3 .content {
    font-size: 18px;
    font-weight: bold;
    color: #FF00C1;
    /* 粉色标题 | Pink Heading */
    padding-left: 10px;
    border-left: 4px solid #FF00C1;
}

#mdb h3 .prefix,
#mdb h3 .suffix {
    display: none;
}

/* 四级标题 - 终端提示符 | Level 4 Heading - Terminal Prompt */
#mdb h4 {
    margin: 24px 0 10px;
}

#mdb h4 .content {
    font-size: 16px;
    font-weight: bold;
    color: #00F3FF;
}

/* 模拟 > 符号 | Simulating > symbol */
#mdb h4 .content:before {
    content: "> ";
    color: #FF00C1;
}

#mdb h4 .prefix,
#mdb h4 .suffix {
    display: none;
}

/* 引用 - 终端数据块 | Blockquote - Terminal Data Block */
#mdb .multiquote-1 {
    margin: 30px 0;
    padding: 20px;
    background-color: rgba(0, 243, 255, 0.05);
    border: 1px solid rgba(0, 243, 255, 0.3);
    border-left: 4px solid #00F3FF;
}

#mdb .multiquote-1 p {
    color: #444;
    font-size: 14px;
    margin: 0;
    font-family: monospace;
}

#mdb .multiquote-2 {
    margin: 28px 0;
    padding: 18px;
    background: rgba(255, 184, 77, 0.05);
    border: 1px solid rgba(255, 184, 77, 0.3);
    border-left: 4px solid #FFB84D;
}

#mdb .multiquote-2 p {
    color: #444;
    font-size: 14px;
    margin: 0;
    font-family: monospace;
}

#mdb .multiquote-3 {
    margin: 26px 0;
    padding: 16px;
    background: rgba(255, 0, 193, 0.05);
    border: 1px solid rgba(255, 0, 193, 0.3);
    border-left: 4px solid #FF00C1;
}

#mdb .multiquote-3 p {
    color: #444;
    font-size: 14px;
    margin: 0;
    font-family: monospace;
}

/* 列表 | List */
#mdb ul {
    list-style: disc;
    padding-left: 20px;
    color: #00F3FF;
    margin: 20px 0;
}

#mdb ol {
    list-style: decimal;
    padding-left: 20px;
    color: #FF00C1;
    font-weight: bold;
    margin: 20px 0;
}

#mdb ul ul {
    list-style-type: square;
    color: #FFB84D;
    margin-top: 8px;
}

#mdb ol ol {
    list-style-type: lower-alpha;
    color: #00F3FF;
}

#mdb li section {
    color: #444;
    font-weight: normal;
}

/* 链接 - 能量链接 | Link - Energy Link */
#mdb a {
    color: #00F3FF;
    text-decoration: none;
    border-bottom: 1px dashed #00F3FF;
    transition: all 0.2s;
}

/* 加粗 - 故障粉高亮 | Bold - Glitch Pink Highlight */
#mdb strong {
    color: #FF00C1;
    font-weight: bold;
    text-shadow: 0 0 2px rgba(255, 0, 193, 0.4);
}

/* 斜体 - 粉色发光 | Italic - Pink Glow */
#mdb em {
    font-style: italic;
    color: #FF00C1;
    text-shadow: 0 0 3px rgba(255, 0, 193, 0.5);
}

/* 加粗斜体 | Bold Italic */
#mdb em strong {
    color: #00F3FF;
    font-weight: bold;
    text-shadow: 0 0 5px rgba(0, 243, 255, 0.5);
}

/* 高亮 - 霓虹背景 | Mark - Neon Background */
#mdb mark {
    background: rgba(255, 0, 193, 0.2);
    color: #FF00C1;
    padding: 2px 4px;
    border: 1px solid rgba(255, 0, 193, 0.3);
    box-shadow: 0 0 5px rgba(255, 0, 193, 0.2);
}

/* 删除线 - 发光线 | Strikethrough - Glowing Line */
#mdb del {
    text-decoration: line-through;
    text-decoration-color: #FF00C1;
    color: #666;
}

/* 分割线 - 霓虹线 | Horizontal Rule - Neon Line */
#mdb hr {
    margin: 50px 0;
    border: none;
    height: 2px;
    background: linear-gradient(90deg, transparent, #00F3FF, transparent);
    box-shadow: 0 0 10px rgba(0, 243, 255, 0.5);
}

/* 
 * 行内代码 - 黑客终端指令 (修复重点) | Inline Code - Hacker Terminal Commands (Key Fix)
 * 纯黑底 + 青色字 + 等宽字体 + 微发光 | Pure Black Background + Cyan Text + Monospace + Slight Glow
 */
#mdb p code,
#mdb li code {
    color: #00F3FF;
    /* 霓虹青 | Neon Cyan */
    background: #000000;
    /* 纯黑背景 | Pure Black Background */
    border: 1px solid rgba(0, 243, 255, 0.3);
    /* 微弱的青色边框 | Faint Cyan Border */
    padding: 2px 6px;
    margin: 0 4px;
    border-radius: 4px;
    font-size: 14px;
    font-family: "Courier New", Courier, monospace;
    /* 强制等宽 | Forced Monospace */
    letter-spacing: 0px;
}

/* 代码块 - 赛博朋克终端风格 | Code Block - Cyberpunk Terminal Style */
/* 注意：不要设置 color，让语法高亮主题 control 文字颜色 | Note: Do not set color, let the syntax highlighting theme control the text color */
#mdb pre code.hljs {
    background: #161B22;
    /* 稍微亮一点的深色背景，提高可读性 | Slightly lighter dark background to improve readability */
    border: 1px solid #00F3FF;
    /* 霓虹青色边框 | Neon Cyan Border */
    border-left: 3px solid #00F3FF;
    /* 左侧霓虹条 | Neon strip on the left */
    font-family: "Courier New", "Consolas", "Monaco", monospace;
    padding: 16px;
    border-radius: 4px;
    font-size: 13px;
    overflow-x: auto;
    white-space: pre;
  min-width: max-content;
    /* 微妙的发光效果 | Subtle glowing effect */
    box-shadow: 
        0 0 10px rgba(0, 243, 255, 0.2),
        inset 0 0 20px rgba(0, 243, 255, 0.05);
    /* 外发光 + 内发光 | Outer glow + Inner glow */
    position: relative;
}

/* 代码块故障效果 - 模拟扫描线（降低透明度，不影响可读性） | Code Block Glitch Effect - Simulating scanlines (reduced opacity, does not affect readability) */
#mdb pre code.hljs::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
        transparent 50%,
        rgba(0, 243, 255, 0.015) 50%
    );
    /* 降低扫描线透明度，从 0.03 改为 0.015 | Reduced scanline opacity, from 0.03 to 0.015 */
    background-size: 100% 4px;
    pointer-events: none;
    border-radius: 4px;
}

/* 增强语法高亮颜色的对比度，确保在深色背景下清晰可见 | Enhance contrast of syntax highlighting colors to ensure clarity on dark backgrounds */
/* 基础文字颜色 - 确保默认文字足够亮 | Base text color - ensure default text is bright enough */
#mdb pre code.hljs {
    color: #E6EDF3;
    /* 非常亮的灰白色作为默认文字颜色 | Very bright greyish-white as the default text color */
}

#mdb pre code.hljs .hljs-comment,
#mdb pre code.hljs .hljs-quote {
    color: #8B949E;
    /* 注释用中等亮度的灰色 | Use medium-brightness grey for comments */
    opacity: 0.9;
}

#mdb pre code.hljs .hljs-keyword,
#mdb pre code.hljs .hljs-selector-tag,
#mdb pre code.hljs .hljs-subst {
    color: #FF7B72;
    /* 亮红橙色关键字 | Bright red-orange keywords */
    font-weight: bold;
}

#mdb pre code.hljs .hljs-string,
#mdb pre code.hljs .hljs-doctag {
    color: #FFA657;
    /* 亮橙色字符串 | Bright orange strings */
}

#mdb pre code.hljs .hljs-number,
#mdb pre code.hljs .hljs-literal,
#mdb pre code.hljs .hljs-variable,
#mdb pre code.hljs .hljs-template-variable {
    color: #79C0FF;
    /* 亮蓝色数字和变量 | Bright blue numbers and variables */
}

#mdb pre code.hljs .hljs-title,
#mdb pre code.hljs .hljs-section,
#mdb pre code.hljs .hljs-selector-id {
    color: #D2A8FF;
    /* 亮紫色函数名 | Bright purple function names */
    font-weight: bold;
}

#mdb pre code.hljs .hljs-type,
#mdb pre code.hljs .hljs-class .hljs-title {
    color: #FFA657;
    /* 橙色类型，提高对比度 | Orange type, improve contrast */
    font-weight: bold;
}

#mdb pre code.hljs .hljs-tag,
#mdb pre code.hljs .hljs-name,
#mdb pre code.hljs .hljs-attribute {
    color: #79C0FF;
    /* 亮蓝色标签 | Bright blue tags */
}

#mdb pre code.hljs .hljs-regexp,
#mdb pre code.hljs .hljs-link {
    color: #56D4DD;
    /* 亮青色正则表达式 | Bright cyan regex */
}

#mdb pre code.hljs .hljs-symbol,
#mdb pre code.hljs .hljs-bullet {
    color: #FF7B72;
    /* 亮红橙色符号 | Bright red-orange symbols */
}

#mdb pre code.hljs .hljs-built_in,
#mdb pre code.hljs .hljs-builtin-name {
    color: #58A6FF;
    /* 亮蓝色内置函数 | Bright blue built-in functions */
    font-weight: bold;
}

#mdb pre code.hljs .hljs-meta {
    color: #8B949E;
    /* 元数据用灰色 | Meta-data in grey */
    font-weight: bold;
}

#mdb pre code.hljs .hljs-deletion {
    background: rgba(255, 123, 114, 0.2);
    /* 删除线背景 | Deletion background */
    color: #FF7B72;
}

#mdb pre code.hljs .hljs-addition {
    background: rgba(121, 192, 255, 0.2);
    /* 添加线背景 | Addition background */
    color: #79C0FF;
}

#mdb pre code.hljs .hljs-emphasis {
    font-style: italic;
    color: #E6EDF3;
}

#mdb pre code.hljs .hljs-strong {
    font-weight: bold;
    color: #FF7B72;
}

/* 如果没有语法高亮，设置默认霓虹青色 | If there is no syntax highlighting, set default neon cyan */
#mdb pre code:not(.hljs) {
    color: #00F3FF;
    background: #161B22;
    border: 1px solid #00F3FF;
    border-left: 3px solid #00F3FF;
    box-shadow: 
        0 0 10px rgba(0, 243, 255, 0.2),
        inset 0 0 20px rgba(0, 243, 255, 0.05);
}

/* 表格 - 数据面板 | Table - Data Panel */
#mdb table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    margin: 30px 0;
    font-size: 14px;
    border: 1px solid rgba(0, 243, 255, 0.3);
    background: transparent;
}

#mdb table tr th {
    background: rgba(0, 243, 255, 0.1);
    color: #00F3FF;
    border-bottom: 1px solid rgba(0, 243, 255, 0.3);
    padding: 10px;
    font-weight: bold;
    text-align: left;
}

#mdb table tr td {
    border-bottom: 1px solid rgba(0, 243, 255, 0.2);
    padding: 10px;
    color: #444;
    background: transparent;
}

#mdb figcaption {
    margin-top: 10px;
    text-align: center;
    color: #00F3FF;
    font-size: 13px;
    font-family: monospace;
}

/* 脚注 | Footnote */
#mdb .footnote-word,
#mdb .footnote-ref {
    color: #FF00C1;
}

#mdb .footnotes-sep {
    border-top: 1px solid #30363D;
    padding-top: 20px;
    margin-top: 40px;
    font-size: 12px;
    color: #555;
}

#mdb .footnote-num {
    font-weight: bold;
    color: #0d1117;
    background: #00F3FF;
    margin-right: 4px;
    font-size: 11px;
    padding: 1px 4px;
}

#mdb .footnote-item p {
    color: #666;
    font-size: 12px;
    margin: 4px 0;
}

/* 公式 - 保持默认颜色，兼容微信亮色/深色模式 | Formula - keep default color, compatible with WeChat light/dark mode */
#mdb .block-equation svg,
#mdb .katex-block svg,
#mdb mjx-container[display="true"] svg {
    max-width: 100%;
}

#mdb .inline-equation svg,
#mdb .katex-inline svg,
#mdb mjx-container:not([display="true"]) svg {
    max-width: 100%;
    vertical-align: middle;
}

/* 提示块 - 赛博朋克风格 | Callout - Cyberpunk Style */
#mdb .callout {
    margin: 30px 0;
    padding: 20px;
    background: rgba(0, 243, 255, 0.05);
    border: 1px solid rgba(0, 243, 255, 0.2);
    border-radius: 4px;
    color: #444;
}

#mdb .callout-title {
    font-weight: bold;
    margin-bottom: 10px;
    color: #00F3FF;
    text-shadow: 0 0 5px rgba(0, 243, 255, 0.5);
    font-size: 16px;
}

#mdb .callout-icon {
    margin-right: 6px;
}

#mdb .callout-note { 
    border-left: 3px solid #00F3FF;
    box-shadow: 0 0 10px rgba(0, 243, 255, 0.2);
}

#mdb .callout-tip { 
    border-left: 3px solid #FF00C1;
    box-shadow: 0 0 10px rgba(255, 0, 193, 0.2);
}

#mdb .callout-important { 
    border-left: 3px solid #00F3FF;
    box-shadow: 0 0 10px rgba(0, 243, 255, 0.2);
}

#mdb .callout-warning { 
    border-left: 3px solid #FFB84D;
    box-shadow: 0 0 10px rgba(255, 184, 77, 0.2);
}

#mdb .callout-caution { 
    border-left: 3px solid #FF00C1;
    box-shadow: 0 0 10px rgba(255, 0, 193, 0.2);
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
