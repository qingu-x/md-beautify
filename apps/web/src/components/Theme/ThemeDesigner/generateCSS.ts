// 可视化主题设计器 - CSS 生成函数 | Visual Theme Designer - CSS Generation Functions
import type { DesignerVariables } from "./types";
import {
  headingStylePresets,
  quoteStylePresets,
  type HeadingPreset,
  type QuotePreset,
} from "@/config/styleOptions";

/**
 * 获取标题预设 CSS 模板 | Get heading preset CSS template
 */
export function getHeadingPresetCSS(
  presetId: string,
  color: string,
  tag: string,
): { content: string; extra: string } {
  const preset = headingStylePresets.find(
    (p: HeadingPreset) => p.id === presetId,
  );
  if (!preset) return { content: "", extra: "" };
  const css = preset.cssTemplate(color, tag);
  return { content: css.content || "", extra: css.extra || "" };
}

/**
 * 获取引用预设 CSS | Get quote preset CSS
 */
export function getQuotePresetCSS(
  presetId: string,
  color: string,
  bgColor: string,
  textColor: string,
  borderWidth: number,
  borderStyle: string,
  padding: number,
  centered?: boolean,
): { base: string; extra: string } {
  const preset = quoteStylePresets.find((p: QuotePreset) => p.id === presetId);
  if (!preset) return { base: "", extra: "" };
  const css = preset.cssTemplate(
    color,
    bgColor,
    textColor,
    borderWidth,
    borderStyle,
    padding,
    centered,
  );
  return { base: css.base || "", extra: css.extra || "" };
}

/**
 * 获取代码主题 CSS | Get code theme CSS
 */
export function getCodeThemeCSS(themeId: string): string {
  const themes: Record<string, string> = {
    github: `
            #mdb .hljs-comment, #mdb .hljs-quote { color: #998; font-style: italic; }
            #mdb .hljs-keyword, #mdb .hljs-selector-tag, #mdb .hljs-subst { color: #333; font-weight: bold; }
            #mdb .hljs-string, #mdb .hljs-doctag { color: #d14; }
            #mdb .hljs-title, #mdb .hljs-section, #mdb .hljs-selector-id { color: #900; font-weight: bold; }
            #mdb .hljs-type, #mdb .hljs-class .hljs-title { color: #458; font-weight: bold; }
            #mdb .hljs-variable, #mdb .hljs-template-variable { color: #008080; }
            #mdb .hljs-attr { color: #000080; }
        `,
    monokai: `
            #mdb .hljs { color: #f8f8f2; }
            #mdb .hljs-comment, #mdb .hljs-quote { color: #75715e; }
            #mdb .hljs-keyword, #mdb .hljs-selector-tag, #mdb .hljs-literal { color: #f92672; }
            #mdb .hljs-string, #mdb .hljs-attr { color: #e6db74; }
            #mdb .hljs-title, #mdb .hljs-section { color: #a6e22e; }
            #mdb .hljs-type, #mdb .hljs-class .hljs-title { color: #66d9ef; font-style: italic; }
            #mdb .hljs-built_in, #mdb .hljs-selector-attr { color: #ae81ff; }
        `,
    vscode: `
            #mdb .hljs { color: #d4d4d4; }
            #mdb .hljs-comment { color: #6a9955; }
            #mdb .hljs-keyword { color: #569cd6; }
            #mdb .hljs-string { color: #ce9178; }
            #mdb .hljs-literal { color: #569cd6; }
            #mdb .hljs-number { color: #b5cea8; }
            #mdb .hljs-function { color: #dcdcaa; }
            #mdb .hljs-class { color: #4ec9b0; }
            #mdb .hljs-attr { color: #9cdcfe; }
        `,
    dracula: `
            #mdb .hljs { color: #f8f8f2; }
            #mdb .hljs-comment { color: #6272a4; }
            #mdb .hljs-quote { color: #6272a4; }
            #mdb .hljs-keyword { color: #ff79c6; }
            #mdb .hljs-selector-tag { color: #ff79c6; }
            #mdb .hljs-literal { color: #bd93f9; }
            #mdb .hljs-string { color: #f1fa8c; }
            #mdb .hljs-variable { color: #50fa7b; }
            #mdb .hljs-number { color: #bd93f9; }
            #mdb .hljs-function { color: #50fa7b; }
            #mdb .hljs-class { color: #8be9fd; }
            #mdb .hljs-attr { color: #50fa7b; }
        `,
    "solarized-dark": `
            #mdb .hljs { color: #839496; }
            #mdb .hljs-comment { color: #586e75; font-style: italic; }
            #mdb .hljs-keyword { color: #859900; }
            #mdb .hljs-selector-tag { color: #859900; }
            #mdb .hljs-string { color: #2aa198; }
            #mdb .hljs-variable { color: #b58900; }
            #mdb .hljs-number { color: #d33682; }
            #mdb .hljs-function { color: #268bd2; }
            #mdb .hljs-attr { color: #b58900; }
        `,
    "solarized-light": `
            #mdb .hljs { color: #657b83; }
            #mdb .hljs-comment { color: #93a1a1; font-style: italic; }
            #mdb .hljs-keyword { color: #859900; }
            #mdb .hljs-selector-tag { color: #859900; }
            #mdb .hljs-string { color: #2aa198; }
            #mdb .hljs-variable { color: #b58900; }
            #mdb .hljs-number { color: #d33682; }
            #mdb .hljs-function { color: #268bd2; }
            #mdb .hljs-attr { color: #b58900; }
        `,
    xcode: `
            #mdb .hljs { color: #000000; }
            #mdb .hljs-comment { color: #007400; }
            #mdb .hljs-quote { color: #007400; }
            #mdb .hljs-keyword { color: #aa0d91; }
            #mdb .hljs-selector-tag { color: #aa0d91; }
            #mdb .hljs-literal { color: #aa0d91; }
            #mdb .hljs-string { color: #c41a16; }
            #mdb .hljs-attr { color: #836C28; }
            #mdb .hljs-title { color: #1c00cf; }
            #mdb .hljs-section { color: #1c00cf; }
            #mdb .hljs-type { color: #5c2699; }
            #mdb .hljs-class .hljs-title { color: #5c2699; }
            #mdb .hljs-variable { color: #3f6e74; }
            #mdb .hljs-built_in { color: #5c2699; }
            #mdb .hljs-number { color: #1c00cf; }
        `,
    "atom-one-light": `
            #mdb .hljs { color: #383a42; }
            #mdb .hljs-comment { color: #a0a1a7; font-style: italic; }
            #mdb .hljs-keyword { color: #a626a4; }
            #mdb .hljs-selector-tag { color: #e45649; }
            #mdb .hljs-string { color: #50a14f; }
            #mdb .hljs-variable { color: #986801; }
            #mdb .hljs-number { color: #986801; }
            #mdb .hljs-function { color: #4078f2; }
            #mdb .hljs-attr { color: #986801; }
            #mdb .hljs-class .hljs-title { color: #c18401; }
            #mdb .hljs-type { color: #986801; }
            #mdb .hljs-built_in { color: #c18401; }
        `,
    "night-owl": `
            #mdb .hljs { color: #d6deeb; }
            #mdb .hljs-comment { color: #637777; font-style: italic; }
            #mdb .hljs-keyword { color: #c792ea; }
            #mdb .hljs-selector-tag { color: #ff5874; }
            #mdb .hljs-string { color: #ecc48d; }
            #mdb .hljs-variable { color: #addb67; }
            #mdb .hljs-number { color: #f78c6c; }
            #mdb .hljs-function { color: #82aaff; }
            #mdb .hljs-attr { color: #7fdbca; }
        `,
  };
  return themes[themeId] || "";
}

/**
 * 从变量生成完整 CSS | Generate full CSS from variables
 */
export function generateCSS(v: DesignerVariables): string {
  const h1Preset = getHeadingPresetCSS(
    v.h1.preset || "simple",
    v.primaryColor,
    "h1",
  );
  const h2Preset = getHeadingPresetCSS(
    v.h2.preset || "simple",
    v.primaryColor,
    "h2",
  );
  const h3Preset = getHeadingPresetCSS(
    v.h3.preset || "simple",
    v.primaryColor,
    "h3",
  );
  const h4Preset = getHeadingPresetCSS(
    v.h4.preset || "simple",
    v.primaryColor,
    "h4",
  );
  const quotePreset = getQuotePresetCSS(
    v.quotePreset,
    v.quoteBorderColor,
    v.quoteBackground,
    v.quoteTextColor,
    v.quoteBorderWidth,
    v.quoteBorderStyle,
    v.quotePaddingX ?? 20,
    v.quoteTextCentered,
  );
  const headingExtras = [
    h1Preset.extra,
    h2Preset.extra,
    h3Preset.extra,
    h4Preset.extra,
  ]
    .filter(Boolean)
    .join("\n");

  return `/* 可视化设计器生成 */
#mdb {
  font-family: ${v.fontFamily};
  padding: 0 ${v.pagePadding ?? 8}px;
  color: ${v.paragraphColor};
  overflow-wrap: break-word;
  letter-spacing: ${v.globalLetterSpacing ?? 0}px;
}
#mdb figcaption {
  color: ${v.imageCaptionColor};
  font-size: ${v.imageCaptionFontSize}px;
  text-align: ${v.imageCaptionTextAlign};
  margin-top: 8px;
  line-height: ${v.lineHeight};
}

#mdb strong { 
  font-weight: bold;
  ${
    v.strongColor && v.strongColor !== "inherit"
      ? `color: ${v.strongColor};`
      : v.strongStyle === "none"
        ? "color: inherit;"
        : `color: ${v.primaryColor};`
  }
  ${v.strongStyle === "highlighter" ? `background: ${v.primaryColor}20; padding: 0 2px; border-radius: 2px;` : ""}
  ${v.strongStyle === "highlighter-bottom" ? `background: linear-gradient(to bottom, transparent 60%, ${v.primaryColor}30 60%); padding: 0 2px;` : ""}
  ${v.strongStyle === "underline" ? `border-bottom: 2px solid ${v.primaryColor}; padding-bottom: 1px;` : ""}
  ${v.strongStyle === "dot" ? `-webkit-text-emphasis: dot; -webkit-text-emphasis-position: under; text-emphasis: dot; text-emphasis-position: under;` : ""}
}

#mdb p {
  font-size: ${v.fontSize};
  line-height: ${v.lineHeight};
  margin: ${v.paragraphMargin}px 0;
  padding: ${v.paragraphPadding ?? 0}px 0;
  ${v.textIndent ? "text-indent: 2em;" : ""}
  ${v.textJustify ? "text-align: justify;" : ""}
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
  line-height: ${v.lineHeight};
}

#mdb dd p {
  margin: 4px 0;
}

#mdb h1 .content {
  font-size: ${v.h1.fontSize}px;
  color: ${v.h1.color};
  font-weight: ${v.h1.fontWeight || "bold"};
  letter-spacing: ${v.h1.letterSpacing || 0}px;
  ${h1Preset.content}
}
#mdb h1 { margin: ${v.h1.marginTop}px 0 ${v.h1.marginBottom}px; ${v.h1.centered ? "text-align: center;" : ""} }

#mdb h2 .content {
  font-size: ${v.h2.fontSize}px;
  color: ${v.h2.color};
  font-weight: ${v.h2.fontWeight || "bold"};
  letter-spacing: ${v.h2.letterSpacing || 0}px;
  ${h2Preset.content}
}
#mdb h2 { margin: ${v.h2.marginTop}px 0 ${v.h2.marginBottom}px; ${v.h2.centered ? "text-align: center;" : ""} }

#mdb h3 .content {
  font-size: ${v.h3.fontSize}px;
  color: ${v.h3.color};
  font-weight: ${v.h3.fontWeight || "bold"};
  letter-spacing: ${v.h3.letterSpacing || 0}px;
  ${h3Preset.content}
}
#mdb h3 { margin: ${v.h3.marginTop}px 0 ${v.h3.marginBottom}px; ${v.h3.centered ? "text-align: center;" : ""} }

#mdb h4 .content {
  font-size: ${v.h4.fontSize}px;
  color: ${v.h4.color};
  font-weight: ${v.h4.fontWeight || "bold"};
  letter-spacing: ${v.h4.letterSpacing || 0}px;
  ${h4Preset.content}
}
#mdb h4 { margin: ${v.h4.marginTop}px 0 ${v.h4.marginBottom}px; ${v.h4.centered ? "text-align: center;" : ""} }

#mdb blockquote, 
#mdb .multiquote-1, 
#mdb .multiquote-2, 
#mdb .multiquote-3 {
  ${quotePreset.base}
  margin: ${v.paragraphMargin}px 0 !important;
  border-left-color: ${v.quoteBorderColor};
  border-left-style: ${v.quoteBorderStyle};
  padding: ${v.quotePaddingY}px ${v.quotePaddingX}px;
}
#mdb blockquote p,
#mdb .multiquote-1 p,
#mdb .multiquote-2 p,
#mdb .multiquote-3 p { 
  color: ${v.quoteTextColor}; 
  margin: 0 !important;
  font-size: ${v.quoteFontSize}px;
  line-height: ${v.quoteLineHeight};
  ${v.quoteTextCentered ? "text-align: center !important;" : ""}
}

#mdb pre {
  margin: ${v.paragraphMargin}px 0;
  position: relative;
  padding: 0;
  border-radius: 8px;
  overflow: hidden;
}

#mdb pre code {
  display: block;
  background: ${v.codeBackground};
  font-size: ${v.codeFontSize}px;
  padding: ${v.showMacBar ? "36px 16px 16px" : "16px"};
  position: relative;
  white-space: pre;
  border-radius: 0;
  word-wrap: normal;
  word-break: keep-all;
  text-align: left;
  letter-spacing: 0;
  word-spacing: 0;
  width: 100%;
  box-sizing: border-box;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

#mdb pre.custom {
  position: relative;
  margin: ${v.paragraphMargin}px 0;
}

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
  letter-spacing: 0 !important;
  word-spacing: 0 !important;
  font-kerning: normal;
}

#mdb .mermaid svg .eventWrapper {
  filter: none !important;
}

${
  v.showMacBar
    ? `
#mdb pre.custom::before {
  content: "";
  display: block;
  position: absolute;
  top: 10px;
  left: 12px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #ff5f56;
  box-shadow: 20px 0 0 #ffbd2e, 40px 0 0 #27c93f;
  z-index: 10;
}`
    : ""
}

${getCodeThemeCSS(v.codeTheme)}

#mdb code {
  color: ${v.inlineCodeColor};
  background: ${v.inlineCodeBackground};
  padding: 2px 4px;
  border-radius: ${v.inlineCodeStyle === "rounded" ? "12px" : v.inlineCodeStyle === "github" ? "4px" : "2px"};
  font-size: 0.9em;
  font-family: Menlo, Monaco, Consolas, "Courier New", monospace;
  white-space: normal;
  ${v.inlineCodeStyle === "github" ? "border: 1px solid rgba(0,0,0,0.06);" : ""}
  ${v.inlineCodeStyle === "color-text" ? `background: transparent; font-weight: bold; border-bottom: 2px solid ${v.primaryColor}50;` : ""}
}

/* 代码块样式需要更高优先级覆盖行内代码样式 */
#mdb pre code,
#mdb pre code.hljs {
  padding: ${v.showMacBar ? "36px 16px 16px" : "16px"} !important;
  white-space: pre;
  text-align: left;
  letter-spacing: 0;
  word-spacing: 0;
}

#mdb a {
  color: ${v.linkColor || v.primaryColor};
  text-decoration: none;
  border-bottom: ${v.linkUnderline ? `1px solid ${v.linkColor || v.primaryColor}` : "none"};
  word-break: break-all;
}

#mdb em {
  font-style: italic;
  color: ${v.italicColor};
}

#mdb del {
  text-decoration: line-through;
  color: ${v.delColor};
}

#mdb mark {
  background: ${v.markBackground};
  color: ${v.markColor};
  padding: 0 2px;
  border-radius: 2px;
}

#mdb hr {
  margin: ${v.hrMargin}px 0;
  border: 0;
  ${(() => {
    const style = v.hrStyle || "solid";
    const color = v.hrColor;
    const height = v.hrHeight;

    if (style === "pill") {
      return `
    height: ${height}px;
    background: ${color};
    width: 20%;
    margin-left: auto;
    margin-right: auto;
    border-radius: 8px;
      `;
    }

    return `
    border-top: ${height}px ${style} ${color};
    `;
  })()}
}
#mdb table {
  width: 100%;
  border-collapse: collapse;
  margin: ${v.paragraphMargin}px 0;
}

#mdb th {
  background: ${v.tableHeaderBackground};
  color: ${v.tableHeaderColor};
  font-weight: bold;
}

#mdb th, #mdb td {
  border: 1px solid ${v.tableBorderColor};
  padding: 8px 12px;
  text-align: left;
}

${
  v.tableZebra
    ? `
#mdb tr:nth-child(even) {
  background: #fcfcfc;
}`
    : ""
}

#mdb .footnote-word {
  color: ${v.footnoteHeaderColor || v.primaryColor};
  font-weight: bold;
}

#mdb .footnote-ref {
  color: ${v.footnoteHeaderColor || v.primaryColor};
  font-weight: bold;
}

#mdb .footnote-ref a {
  color: ${v.footnoteHeaderColor || v.primaryColor} !important;
  text-decoration: none;
  border-bottom: none !important;
}

#mdb .footnote-item {
  display: flex;
}

#mdb .footnote-num {
  display: inline;
  width: 32px;
  flex-shrink: 0;
  background: none;
  font-size: 80%;
  line-height: 26px;
  color: ${v.footnoteHeaderColor || v.primaryColor};
  font-family: Optima-Regular, Optima, PingFangSC-light, PingFangTC-light, 'PingFang SC', Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
}

#mdb .footnote-num a,
#mdb .footnote-item a.footnote-backref {
  color: ${v.footnoteHeaderColor || v.primaryColor} !important;
  text-decoration: none;
  border-bottom: none !important;
}

#mdb .footnote-item p {
  display: inline;
  font-size: ${v.footnoteFontSize}px;
  flex: 1;
  padding: 0;
  margin: 0;
  line-height: 26px;
  word-break: break-all;
  color: ${v.footnoteColor || "#666"};
}

#mdb .footnotes-sep:before {
  content: "${v.footnoteHeader}";
  display: ${v.footnoteHeader ? "block" : "none"};
  ${
    v.footnoteHeaderStyle === "simple"
      ? `
    font-weight: bold;
    font-size: 16px;
    color: ${v.footnoteHeaderColor || v.primaryColor};
  `
      : ""
  }
  ${
    v.footnoteHeaderStyle === "left-border"
      ? `
    font-weight: bold;
    font-size: 18px;
    color: ${v.footnoteHeaderColor || v.primaryColor};
    border-left: 4px solid ${v.footnoteHeaderColor || v.primaryColor};
    padding-left: 10px;
  `
      : ""
  }
  ${
    v.footnoteHeaderStyle === "bottom-border"
      ? `
    font-weight: bold;
    font-size: 18px;
    color: ${v.footnoteHeaderColor || v.primaryColor};
    border-bottom: 2px solid ${v.footnoteHeaderColor || v.primaryColor};
    padding-bottom: 6px;
  `
      : ""
  }
  ${
    v.footnoteHeaderStyle === "background"
      ? `
    font-weight: bold;
    font-size: 18px;
    color: ${v.footnoteHeaderColor || v.primaryColor};
    background: ${v.footnoteHeaderColor || v.primaryColor}15;
    padding: 6px 12px;
    border-radius: 4px;
    border-left: 4px solid ${v.footnoteHeaderColor || v.primaryColor};
  `
      : ""
  }
  ${
    v.footnoteHeaderStyle === "pill"
      ? `
    font-weight: bold;
    font-size: 16px;
    background: ${v.footnoteHeaderColor || v.primaryColor};
    color: #fff;
    padding: 4px 16px;
    border-radius: 20px;
    display: inline-block;
  `
      : ""
  }
}

#mdb .callout {
  border-left-width: 4px;
  border-left-style: solid;
  border-radius: 4px;
  margin: ${v.paragraphMargin}px 0;
  padding: 12px 16px;
}

#mdb img {
  display: block;
  max-width: 100%;
  height: auto;
  margin: ${v.imageMargin}px auto;
  border-radius: ${v.imageBorderRadius}px;
}

#mdb ul { list-style-type: ${v.ulStyle}; padding-left: 20px; margin: ${v.paragraphMargin}px 0; font-size: ${!v.ulFontSize || v.ulFontSize === "inherit" ? v.fontSize : v.ulFontSize}; }
#mdb ul ul { list-style-type: ${v.ulStyleL2}; margin: 4px 0; }
#mdb ol { list-style-type: ${v.olStyle}; padding-left: 20px; margin: ${v.paragraphMargin}px 0; font-size: ${!v.olFontSize || v.olFontSize === "inherit" ? v.fontSize : v.olFontSize}; }
#mdb ol ol { list-style-type: ${v.olStyleL2}; margin: 4px 0; }
#mdb li { margin: ${v.listSpacing}px 0; line-height: ${v.lineHeight}; }

/* 列表符号颜色 */
#mdb ul li::marker,
#mdb ol li::marker {
  color: ${v.listMarkerColor};
}
#mdb ul ul li::marker,
#mdb ol ol li::marker,
#mdb ul ol li::marker,
#mdb ol ul li::marker {
  color: ${v.listMarkerColorL2};
}
${headingExtras}
${quotePreset.extra}

/* 横向滑动图片 */
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
  border-radius: ${v.imageBorderRadius}px;
}

#mdb .imageflow-caption {
  text-align: center;
  margin-top: 0px;
  padding-top: 0px;
  color: ${v.imageCaptionColor};
  font-size: ${v.imageCaptionFontSize}px;
}

/* 提示块默认样式 */
#mdb .callout-title {
  font-weight: 600;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 0;
  letter-spacing: 0.05em;
}

#mdb .callout-icon {
  font-size: 18px;
  margin-right: 8px;
}

#mdb .callout p {
  margin: 0 !important;
}

#mdb .callout-note { border-left: 4px solid #6366f1; background: #f5f5ff; }
#mdb .callout-tip { border-left: 4px solid #10b981; background: #ecfdf5; }
#mdb .callout-important { border-left: 4px solid #8b5cf6; background: #f5f3ff; }
#mdb .callout-warning { border-left: 4px solid #f59e0b; background: #fffbeb; }
#mdb .callout-caution { border-left: 4px solid #ef4444; background: #fff5f5; }

/* Mermaid 样式覆盖 */
  #mdb .mermaid foreignObject { overflow: visible; }
  #mdb .mermaid .label {
    color: ${v.paragraphColor};
    font-family: ${v.fontFamily};
    display: block;
    width: 100%;
    height: 100%;
    text-align: left;
    line-height: 1.2;
    white-space: normal;
    letter-spacing: 0 !important;
    word-spacing: 0 !important;
    font-kerning: normal;
  }
  #mdb .mermaid .label * {
    margin: 0;
    padding: 0;
    letter-spacing: 0 !important;
    word-spacing: 0 !important;
  }
  #mdb .mermaid .edgeLabel .label {
    display: block;
    white-space: normal;
    text-align: left;
    letter-spacing: 0 !important;
    word-spacing: 0 !important;
    font-kerning: normal;
  }

  /* 适配微信暗黑模式的标记 */
  @media (prefers-color-scheme: dark) {
    #mdb .mermaid {
      background: #1a1a1a;
    }
  }
`;
}
