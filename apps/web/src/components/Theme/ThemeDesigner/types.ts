// 可视化主题设计器 - 共享类型定义 | Visual Theme Designer - Shared Type Definitions

/**
 * 标题样式配置 | Heading style configuration
 */
export interface HeadingStyle {
  fontSize: number;
  color: string;
  marginTop: number;
  marginBottom: number;
  preset?: string;
  centered?: boolean;
  fontWeight?: string;
  letterSpacing?: number;
}

/**
 * 可视化设计器变量 | Visual designer variables
 */
export interface DesignerVariables {
  // 全局 | Global
  fontFamily: string;
  fontSize: string;
  primaryColor: string;
  lineHeight: string;
  pagePadding: number;
  globalLetterSpacing: number;

  // 标题 | Heading
  h1: HeadingStyle;
  h2: HeadingStyle;
  h3: HeadingStyle;
  h4: HeadingStyle;

  // 段落 | Paragraph
  paragraphMargin: number;
  paragraphPadding: number;
  paragraphColor: string;
  textIndent: boolean;
  textJustify: boolean;

  // 引用 | Quote
  quoteBackground: string;
  quoteBorderColor: string;
  quoteTextColor: string;
  quotePreset: string;
  quoteBorderWidth: number;
  quoteBorderStyle: "solid" | "dashed" | "dotted" | "double";
  quotePaddingX: number;
  quotePaddingY: number;
  quoteFontSize: number;
  quoteLineHeight: number;
  quoteTextCentered: boolean;

  // 代码 | Code
  codeBackground: string;
  codeFontSize: number;
  inlineCodeColor: string;
  inlineCodeBackground: string;
  inlineCodeStyle: string;
  showMacBar: boolean;
  codeTheme: string;

  // 图片 | Image
  imageMargin: number;
  imageBorderRadius: number;
  imageCaptionColor: string;
  imageCaptionFontSize: number;
  imageCaptionTextAlign: string;

  // 链接/文本 | Link/Text
  linkColor: string;
  linkUnderline: boolean;
  italicColor: string;
  delColor: string;
  markBackground: string;
  markColor: string;
  strongStyle: string;
  strongColor: string;

  // 表格 | Table
  tableHeaderBackground: string;
  tableHeaderColor: string;
  tableBorderColor: string;
  tableZebra: boolean;

  // 分割线 | Horizontal Rule
  hrColor: string;
  hrHeight: number;
  hrMargin: number;
  hrStyle: string;

  // 列表 | List
  ulStyle: string;
  ulStyleL2: string;
  olStyle: string;
  olStyleL2: string;
  listSpacing: number;
  listMarkerColor: string;
  listMarkerColorL2: string;
  ulFontSize: string;
  olFontSize: string;

  // 脚注 | Footnote
  footnoteColor: string;
  footnoteFontSize: number;
  footnoteHeader: string;
  footnoteHeaderColor: string;
  footnoteHeaderStyle: string;

  // 提示块 | Callout
  calloutStyle: "default" | "primary";

  // Mermaid
  mermaidTheme: "base" | "forest" | "dark" | "neutral" | "default";
}

/**
 * 标题级别类型 | Heading level type
 */
export type HeadingLevel = "h1" | "h2" | "h3" | "h4";
