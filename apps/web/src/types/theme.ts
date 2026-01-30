// 可视化主题设计器 - 共享类型定义

import type {
  DesignerVariables,
  HeadingStyle,
} from "../components/Theme/ThemeDesigner/types";

export type { DesignerVariables, HeadingStyle };

/**
 * Custom Theme Interface / 自定义主题接口
 */
export interface CustomTheme {
  id: string;
  name: string;
  css: string;
  isBuiltIn: boolean;
  createdAt: string;
  updatedAt: string;
  /** Editor Mode: Determined at creation, immutable / 编辑模式：创建时确定，不可更改 */
  editorMode?: "visual" | "css";
  /** Visual Designer Variables, exists only in visual mode / 可视化设计器变量，仅 visual 模式存在 */
  designerVariables?: DesignerVariables;
}

/**
 * Theme Definition Interface (Simplified, for backward compatibility) / 主题定义接口（简化版，用于向后兼容）
 */
export interface ThemeDefinition {
  id: string;
  name: string;
  css: string;
}
