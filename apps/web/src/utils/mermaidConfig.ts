import type { DesignerVariables } from "../components/Theme/ThemeDesigner/types";

export interface MermaidConfig {
  theme: string;
  themeCSS?: string;
  themeVariables: {
    fontFamily?: string;
    fontSize?: string;
    [key: string]: string | undefined;
  };
  flowchart?: {
    htmlLabels?: boolean;
    padding?: number;
    nodeSpacing?: number;
    rankSpacing?: number;
    [key: string]: unknown;
  };
  er?: {
    fontSize?: number;
    [key: string]: unknown;
  };
}

/**
 * 根据设计器变量生成 Mermaid 初始化配置
 * @param designerVariables 主题设计器变量
 * @returns Mermaid 初始化配置对象
 */
export const getMermaidConfig = (
  designerVariables?: DesignerVariables,
  isDarkMode = false,
): MermaidConfig => {
  // 如果是深色模式，强制使用 dark 主题作为基准，除非用户明确指定了其他兼容深色的主题
  const userTheme = (designerVariables?.mermaidTheme as string) || "base";
  const mermaidTheme = isDarkMode ? "dark" : userTheme;

  const mermaidFontFamily =
    designerVariables?.fontFamily ||
    '-apple-system, BlinkMacSystemFont, "Microsoft YaHei", sans-serif';

  const fontSizeStr = designerVariables?.fontSize || "16px";
  const fontSizeInt = parseInt(fontSizeStr) || 16;

  // 构建基础变量
  // 模仿 Obsidian 的处理方式：主要依赖 Mermaid 的 base/dark 主题默认行为
  // 仅注入核心的主题色变量，不做过多的颜色计算和覆盖
  const themeVariables: Record<string, unknown> = {
    fontFamily: mermaidFontFamily,
    fontSize: fontSizeStr,
    edgeLabelBackground: isDarkMode ? undefined : "#ECEDFE",
  };

  return {
    theme: mermaidTheme,
    // 1. 强制修正 ER 图 label 的 CSS，清除可能导致溢出的边距
    // 2. 将 line-height 设为 1.2 (比之前的 1 更合理)，避免文字重叠或过于紧凑
    themeCSS: `
      /* 允许 foreignObject 内容溢出，防止裁剪 */
      foreignObject {
        overflow: visible !important;
      }
      .labelBkg {
        overflow: visible !important;
      }
      .labelBkg p {
        margin: 0 !important;
        padding: 0 !important;
        line-height: 1.2 !important;
      }
    `,
    flowchart: {
      htmlLabels: true,
      padding: 20,
      nodeSpacing: 50,
      rankSpacing: 50,
    },
    er: {
      // 关键 Hack: 告诉 Mermaid 使用比实际稍大的字号进行布局计算
      // 这会使其生成更高/更宽的 foreignObject 容器，从而避免文字被裁剪
      fontSize: fontSizeInt + 4,
    },
    themeVariables: themeVariables,
  };
};

/**
 * 生成带有样式的 Mermaid 图表源码
 * @param diagram 原始 Mermaid 代码
 * @param config Mermaid 配置对象
 * @returns 注入了配置的 Mermaid 代码
 */
export const getThemedMermaidDiagram = (
  diagram: string,
  config: MermaidConfig,
): string => {
  if (!diagram.trim()) return "";

  // 如果用户已经手动指定了 init 指令，则不覆盖
  if (diagram.trimStart().startsWith("%%{")) {
    return diagram;
  }

  return `%%{init: ${JSON.stringify(config)} }%%\n${diagram}`;
};
