// Visual Theme Designer - Default Values / 可视化主题设计器 - 默认值
import type { DesignerVariables } from "./types";
import {
  fontFamilyOptions,
  fontSizeOptions,
  primaryColorOptions,
  lineHeightOptions,
  headingSizePresets,
} from "@/config/styleOptions";

/**
 * Designer variables default values / 设计器变量默认值
 */
export const defaultVariables: DesignerVariables = {
  // Global / 全局
  fontFamily: fontFamilyOptions[0].value,
  fontSize: fontSizeOptions[2].value,
  primaryColor: primaryColorOptions[0].value,
  lineHeight: lineHeightOptions[2].value,
  pagePadding: 8,
  globalLetterSpacing: 0,

  // Heading / 标题
  h1: {
    fontSize: headingSizePresets.h1.default,
    color: "#000",
    marginTop: 40,
    marginBottom: 30,
    centered: false,
    fontWeight: "bold",
    letterSpacing: 0,
  },
  h2: {
    fontSize: headingSizePresets.h2.default,
    color: "#333",
    marginTop: 30,
    marginBottom: 20,
    centered: false,
    fontWeight: "bold",
    letterSpacing: 0,
  },
  h3: {
    fontSize: headingSizePresets.h3.default,
    color: "#666",
    marginTop: 25,
    marginBottom: 15,
    centered: false,
    fontWeight: "bold",
    letterSpacing: 0,
  },
  h4: {
    fontSize: headingSizePresets.h4.default,
    color: "#666",
    marginTop: 20,
    marginBottom: 10,
    centered: false,
    fontWeight: "bold",
    letterSpacing: 0,
  },

  // Paragraph / 正文
  paragraphMargin: 16,
  paragraphPadding: 0,
  paragraphColor: "#333",
  textIndent: false,
  textJustify: true,

  // Quote / 引用
  quoteBackground: "#f5f5f5",
  quoteBorderColor: "#ddd",
  quoteTextColor: "#666",
  quotePreset: "left-border",
  quoteBorderWidth: 4,
  quoteBorderStyle: "solid",
  quotePaddingX: 16,
  quotePaddingY: 12,
  quoteFontSize: 16,
  quoteLineHeight: 1.6,
  quoteTextCentered: false,

  // Code / 代码
  codeBackground: "#f5f5f5",
  codeFontSize: 13,
  inlineCodeColor: "#c7254e",
  inlineCodeBackground: "#f9f2f4",
  inlineCodeStyle: "simple",
  showMacBar: true,
  codeTheme: "github",

  // Image / 图片
  imageMargin: 20,
  imageBorderRadius: 4,
  imageCaptionColor: "#999",
  imageCaptionFontSize: 14,
  imageCaptionTextAlign: "center",

  // Link & Text / 链接与文本
  linkColor: "",
  linkUnderline: true,
  italicColor: "inherit",
  delColor: "#999",
  markBackground: "#fff5b1",
  markColor: "inherit",
  strongStyle: "color",
  strongColor: "inherit",

  // Table / 表格
  tableHeaderBackground: "#f8f8f8",
  tableHeaderColor: "inherit",
  tableBorderColor: "#dfe2e5",
  tableZebra: true,

  // Horizontal Rule / 分割线
  hrColor: "#eee",
  hrHeight: 1,
  hrMargin: 20,
  hrStyle: "solid",

  // List / 列表
  ulStyle: "disc",
  ulStyleL2: "circle",
  olStyle: "decimal",
  olStyleL2: "lower-alpha",
  listSpacing: 4,
  listMarkerColor: primaryColorOptions[0].value,
  listMarkerColorL2: primaryColorOptions[0].value,
  ulFontSize: "inherit",
  olFontSize: "inherit",

  // Footnote / 脚注
  footnoteColor: "",
  footnoteFontSize: 12,
  footnoteHeader: "References",
  footnoteHeaderColor: "",
  footnoteHeaderStyle: "left-border",

  // Callout / 提示块
  calloutStyle: "default",

  // Mermaid
  mermaidTheme: "base",
};
