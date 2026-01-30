function expandHexColor(color: string): string {
  if (color.length === 4 && color.startsWith("#")) {
    return `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`;
  }
  return color;
}

// Visual Theme Editor - Preset Options Configuration / 可视化主题编辑器 - 预设选项配置

export interface StyleOption<T = string> {
  id?: string;
  label: string;
  value: T;
  desc?: string;
}

// Font Family Options / 字体选项
export const fontFamilyOptions: StyleOption[] = [
  {
    id: "sansSerif",
    label: "Sans Serif",
    value: '-apple-system, BlinkMacSystemFont, "Microsoft YaHei", sans-serif',
    desc: "Modern & Clean",
  },
  {
    id: "serif",
    label: "Serif",
    value: 'Georgia, "Times New Roman", serif',
    desc: "Elegant & Traditional",
  },
  {
    id: "monospace",
    label: "Monospace",
    value: 'Menlo, Monaco, "Courier New", monospace',
    desc: "Technical Documentation",
  },
];

// Font Size Options / 字号选项
export const fontSizeOptions: StyleOption[] = [
  { id: "compact", label: "14px", value: "14px", desc: "Compact" },
  { id: "small", label: "15px", value: "15px", desc: "Small" },
  { id: "recommended", label: "16px", value: "16px", desc: "Recommended" },
  { id: "large", label: "17px", value: "17px", desc: "Large" },
  { id: "comfortable", label: "18px", value: "18px", desc: "Comfortable" },
];

// Primary Color Presets / 主题色预设
export const primaryColorOptions: StyleOption[] = [
  {
    id: "green",
    label: "Emerald Green",
    value: "#07C160",
    desc: "WeChat Green",
  },
  {
    id: "orange",
    label: "Vibrant Orange",
    value: "#FA5151",
    desc: "Enthusiastic",
  },
  { id: "blue", label: "Sky Blue", value: "#55C9EA", desc: "Fresh & Free" },
  { id: "pink", label: "Sakura Pink", value: "#FF85C0", desc: "Romantic" },
  {
    id: "mint",
    label: "Mint Green",
    value: "#13C2C2",
    desc: "Fresh & Natural",
  },
  {
    id: "yellow",
    label: "Amber Yellow",
    value: "#FAAD14",
    desc: "Bright & Warm",
  },
  { id: "techBlue", label: "Geek Blue", value: "#1890FF", desc: "Tech Feel" },
  { id: "purple", label: "Noble Purple", value: "#722ED1", desc: "Elegant" },
];

// Line Height Options / 行高选项
export const lineHeightOptions: StyleOption[] = [
  { id: "compact", label: "1.5", value: "1.5", desc: "Compact" },
  { id: "moderate", label: "1.6", value: "1.6", desc: "Moderate" },
  { id: "recommended", label: "1.7", value: "1.7", desc: "Recommended" },
  { id: "comfortable", label: "1.8", value: "1.8", desc: "Comfortable" },
  { id: "loose", label: "2.0", value: "2.0", desc: "Loose" },
];

// Heading Size Presets / 标题字号预设
export const headingSizePresets = {
  h1: { min: 20, max: 32, default: 24 },
  h2: { min: 18, max: 28, default: 20 },
  h3: { min: 16, max: 24, default: 18 },
  h4: { min: 14, max: 20, default: 16 },
};

// Margin Preset Range / 边距预设范围
export const marginPresets = {
  min: 0,
  max: 60,
  step: 4,
};

// Heading Style Presets / 标题样式预设
export interface HeadingPresetCss {
  content: string;
  extra?: string;
}

export interface HeadingPreset {
  id: string;
  label: string;
  cssTemplate: (color: string, tag: string) => HeadingPresetCss; // Accepts primary color and tag (e.g., h1) / 接受主题色和标签（如 h1）
}

export const headingStylePresets: HeadingPreset[] = [
  {
    id: "simple",
    label: "Simple",
    cssTemplate: () => ({ content: "" }),
  },
  {
    id: "left-border",
    label: "Left Border",
    cssTemplate: (color) => ({
      content: `
            border-left: 4px solid ${color};
            padding-left: 10px;
        `,
    }),
  },
  {
    id: "bottom-border",
    label: "Bottom Border",
    cssTemplate: (color) => ({
      content: `
            border-bottom: 2px solid ${color};
            padding-bottom: 8px;
        `,
    }),
  },
  {
    id: "double-line",
    label: "Double Line",
    cssTemplate: (color) => ({
      content: `
            border-top: 2px solid ${color};
            border-bottom: 2px solid ${color};
            padding: 8px 0;
        `,
    }),
  },
  {
    id: "boxed",
    label: "Boxed",
    cssTemplate: (color) => ({
      content: `
            background: ${color}15;
            border-left: 4px solid ${color};
            padding: 8px 12px;
            border-radius: 4px;
        `,
    }),
  },
  {
    id: "bottom-highlight",
    label: "Bottom Highlight",
    cssTemplate: (color) => ({
      content: `
            display: inline-block;
            background: linear-gradient(to bottom, transparent 60%, ${color}40 60%);
            padding: 0 4px;
        `,
    }),
  },
  {
    id: "pill",
    label: "Pill",
    cssTemplate: (color) => ({
      content: `
            background: ${color};
            color: #fff;
            padding: 4px 16px;
            border-radius: 20px;
            display: inline-block;
        `,
    }),
  },
  {
    id: "bracket",
    label: "Bracket",
    cssTemplate: (color, tag) => ({
      content: `
            display: inline-block;
            position: relative;
            padding: 0 10px;
        `,
      extra: `
        #mdb ${tag} .content::before {
            content: '[';
            margin-right: 5px;
            color: ${color};
            font-weight: bold;
        }
        #mdb ${tag} .content::after {
            content: ']';
            margin-left: 5px;
            color: ${color};
            font-weight: bold;
        }
        `,
    }),
  },
];

export const boldStyleOptions = [
  { id: "none", label: "Basic Bold" },
  { id: "color", label: "Follow Theme" },
  { id: "highlighter", label: "Highlighter" },
  { id: "highlighter-bottom", label: "Bottom Marker" },
  { id: "underline", label: "Underline" },
  { id: "dot", label: "Emphasis Dot" },
];

// 引用样式预设 | Quote Style Presets
export interface QuotePresetCss {
  base: string;
  extra?: string;
}

export interface QuotePreset {
  id: string;
  label: string;
  cssTemplate: (
    color: string,
    bgColor: string,
    textColor: string,
    borderWidth: number,
    borderStyle: string,
    padding: number,
    centered?: boolean,
  ) => QuotePresetCss;
}

export const quoteStylePresets: QuotePreset[] = [
  {
    id: "left-border",
    label: "Classic Vertical",
    cssTemplate: (
      _color,
      bgColor,
      _textColor,
      borderWidth,
      borderStyle,
      _padding,
      _centered,
    ) => ({
      base: `
            background: ${bgColor};
            border-left-style: ${borderStyle};
            border-left-width: ${borderWidth}px;
        `,
    }),
  },
  {
    id: "top-bottom-border",
    label: "Top & Bottom",
    cssTemplate: (
      color,
      bgColor,
      _textColor,
      borderWidth,
      borderStyle,
      _padding,
      _centered,
    ) => ({
      base: `
            border-top: ${borderWidth}px ${borderStyle} ${color};
            border-bottom: ${borderWidth}px ${borderStyle} ${color};
            border-left: none !important;
            background: ${bgColor};
            text-align: center;
        `,
      extra: `
        #mdb blockquote p { text-align: center !important; }
        `,
    }),
  },
  {
    id: "quotation-marks",
    label: "Big Quotes",
    cssTemplate: (
      color,
      bgColor,
      _textColor,
      _borderWidth,
      _borderStyle,
      padding,
      _centered,
    ) => {
      const c = expandHexColor(color);

      // 基础 padding + 40px 用于避让引号 | Base padding + 40px to avoid quotation marks
      const leftPadding = (padding || 20) + 40;

      return {
        base: `
            background: ${bgColor};
            border-left: none !important;
            border-radius: 4px;
            padding-left: ${leftPadding}px !important;
        `,
        extra: `
        #mdb blockquote::before {
            content: "“";
            display: block;
            height: 0;
            font-size: 60px;
            color: ${c};
            font-family: Georgia, serif;
            line-height: 1;
            margin-left: -40px;
            margin-top: -6px;
            opacity: 0.3;
            pointer-events: none;
        }
        #mdb blockquote p {
            position: relative;
            z-index: 1;
        }
        `,
      };
    },
  },
  {
    id: "boxed",
    label: "Minimal Box",
    cssTemplate: (
      color,
      bgColor,
      _textColor,
      borderWidth,
      borderStyle,
      _padding,
      _centered,
    ) => {
      const c = expandHexColor(color);
      return {
        base: `
            border: ${borderWidth}px ${borderStyle} ${c}40;
            border-left: ${borderWidth}px ${borderStyle} ${c}40 !important;
            background: ${bgColor};
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.03);
        `,
      };
    },
  },
  {
    id: "center-accent",
    label: "Center Accent",
    cssTemplate: (
      color,
      _bgColor,
      _textColor,
      borderWidth,
      _borderStyle,
      _padding,
      _centered,
    ) => ({
      base: `
            background: transparent;
            border-left: none !important;
            text-align: center;
            position: relative;
        `,
      extra: `
        #mdb blockquote p { text-align: center !important; }
        #mdb blockquote::before {
            content: "";
            display: block;
            width: 40px;
            height: ${borderWidth}px;
            background: ${color};
            margin: 0 auto 15px;
            opacity: 0.8;
        }
        #mdb blockquote::after {
            content: "";
            display: block;
            width: 40px;
            height: ${borderWidth}px;
            background: ${color};
            margin: 15px auto 0;
            opacity: 0.8;
        }
        `,
    }),
  },
  {
    id: "straight-border",
    label: "Straight Vertical",
    cssTemplate: (
      color,
      bgColor,
      _textColor,
      borderWidth,
      borderStyle,
      _padding,
      _centered,
    ) => ({
      base: `
            background: ${bgColor};
            border-left: ${borderWidth}px ${borderStyle} ${color} !important;
            border-radius: 0 !important;
        `,
    }),
  },
  {
    id: "centered-boxed",
    label: "Centered Box",
    cssTemplate: (
      color,
      bgColor,
      _textColor,
      borderWidth,
      borderStyle,
      _padding,
      _centered,
    ) => ({
      base: `
            background: ${bgColor};
            border: ${borderWidth}px ${borderStyle} ${color}40;
            border-left: ${borderWidth}px ${borderStyle} ${color}40 !important;
            text-align: center;
            border-radius: 8px;
        `,
      extra: `
        #mdb blockquote p { text-align: center !important; }
        `,
    }),
  },
  {
    id: "minimal-transparent",
    label: "Transparent",
    cssTemplate: (
      color,
      _bgColor,
      _textColor,
      borderWidth,
      borderStyle,
      _padding,
      _centered,
    ) => ({
      base: `
            background: transparent !important;
            border-left: ${borderWidth}px ${borderStyle} ${color} !important;
            border-radius: 0;
        `,
    }),
  },
  {
    id: "corner-frame",
    label: "Corner Frame",
    cssTemplate: (
      color,
      bgColor,
      _textColor,
      borderWidth,
      borderStyle,
      _padding,
      _centered,
    ) => {
      const c = expandHexColor(color);
      return {
        base: `
            background: ${bgColor};
            border-left: none !important;
            position: relative;
        `,
        extra: `
        #mdb blockquote::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 20px;
            height: 20px;
            border-top: ${borderWidth}px ${borderStyle} ${c};
            border-left: ${borderWidth}px ${borderStyle} ${c};
        }
        #mdb blockquote::after {
            content: "";
            position: absolute;
            bottom: 0;
            right: 0;
            width: 20px;
            height: 20px;
            border-bottom: ${borderWidth}px ${borderStyle} ${c};
            border-right: ${borderWidth}px ${borderStyle} ${c};
        }
        `,
      };
    },
  },
];

// 无序列表样式选项 | Unordered List Style Options
export const ulStyleOptions: StyleOption[] = [
  { id: "disc", label: "Solid Dot", value: "disc" },
  { id: "circle", label: "Hollow Dot", value: "circle" },
  { id: "square", label: "Solid Square", value: "square" },
  { id: "none", label: "None", value: "none" },
];

// 有序列表样式选项 | Ordered List Style Options
export const olStyleOptions: StyleOption[] = [
  { id: "decimal", label: "Numbers (1, 2, 3)", value: "decimal" },
  { id: "lower-alpha", label: "Letters (a, b, c)", value: "lower-alpha" },
  {
    id: "lower-roman",
    label: "Roman Numerals (i, ii, iii)",
    value: "lower-roman",
  },
  {
    id: "cjk-ideographic",
    label: "Chinese Numerals",
    value: "cjk-ideographic",
  },
];

export const inlineCodeStyleOptions = [
  { id: "simple", label: "Basic" },
  { id: "rounded", label: "Rounded" },
  { id: "github", label: "GitHub Style" },
  { id: "color-text", label: "Colored Text" },
];

export const codeBlockThemeOptions = [
  { id: "github", label: "GitHub Light" },
  { id: "monokai", label: "Monokai" },
  { id: "vscode", label: "Atom One Dark" },
  { id: "night-owl", label: "Night Owl" },
  { id: "dracula", label: "Dracula" },
  { id: "solarized-dark", label: "Solarized Dark" },
  { id: "solarized-light", label: "Solarized Light" },
  { id: "xcode", label: "Xcode" },
  { id: "atom-one-light", label: "Atom One Light" },
];

// 8 大分类定义 | 8 Major Category Definitions
export type StyleCategory =
  | "global"
  | "heading"
  | "paragraph"
  | "quote"
  | "list"
  | "code"
  | "mermaid"
  | "image"
  | "table"
  | "other";

export interface CategoryConfig {
  id: StyleCategory;
  label: string;
  icon: string;
  description: string;
}

export const styleCategories: CategoryConfig[] = [
  {
    id: "global",
    label: "Global",
    icon: "🎨",
    description: "Font, Primary Color",
  },
  { id: "heading", label: "Heading", icon: "H", description: "H1-H4 Styles" },
  {
    id: "paragraph",
    label: "Paragraph",
    icon: "¶",
    description: "Paragraph Styles",
  },
  { id: "quote", label: "Quote", icon: "❝", description: "Quote Block Styles" },
  { id: "list", label: "List", icon: "☰", description: "List Styles" },
  { id: "code", label: "Code", icon: "</>", description: "Code Block Styles" },
  { id: "mermaid", label: "Charts", icon: "📊", description: "Mermaid Charts" },
  { id: "image", label: "Image", icon: "🖼", description: "Image Styles" },
  { id: "table", label: "Table", icon: "田", description: "Table Styles" },
  { id: "other", label: "Other", icon: "⋯", description: "Other Styles" },
];
