/**
 * markdown-it-github-alert
 * 解析 GitHub 风格的 Alert 语法
 *
 * 语法：
 * > [!NOTE]
 * > 内容
 *
 * 支持类型：NOTE, TIP, IMPORTANT, WARNING, CAUTION
 */

import type MarkdownIt from "markdown-it";
import Token from "markdown-it/lib/token";
import StateCore from "markdown-it/lib/rules_core/state_core";

interface AlertConfig {
  type: string;
  label: string;
  icon: string;
  cssClass: string;
}

const ALERT_CONFIGS: AlertConfig[] = [
  { type: "NOTE", label: "备注", icon: "ℹ️", cssClass: "note" },
  { type: "TIP", label: "提示", icon: "💡", cssClass: "tip" },
  { type: "IMPORTANT", label: "重要", icon: "📌", cssClass: "important" },
  { type: "WARNING", label: "警告", icon: "⚠️", cssClass: "warning" },
  { type: "CAUTION", label: "危险", icon: "🚨", cssClass: "caution" },
];

// 允许 [!TYPE] 后面接内容或者独占一行
// 注意：只匹配空格和 tab，不匹配换行符，这样可以正确区分标题和正文
const ALERT_PATTERN = /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\][ \t]*/i;

function findAlertType(
  text: string,
): { config: AlertConfig; restContent: string } | null {
  const match = text.match(ALERT_PATTERN);
  if (!match) return null;
  const type = match[1].toUpperCase();
  const config = ALERT_CONFIGS.find((c) => c.type === type);
  if (!config) return null;
  // 返回配置和剩余内容
  const restContent = text.slice(match[0].length);
  return { config, restContent };
}

export default function markdownItGitHubAlert(md: MarkdownIt): void {
  // 在 core 规则中处理 blockquote，转换为 callout
  md.core.ruler.push("github-alert", (state: StateCore) => {
    const tokens = state.tokens;

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];

      // 查找 blockquote_open
      if (token.type !== "blockquote_open") continue;

      // 查找对应的 blockquote_close
      let closeIdx = -1;
      let depth = 1;
      for (let j = i + 1; j < tokens.length; j++) {
        if (tokens[j].type === "blockquote_open") depth++;
        if (tokens[j].type === "blockquote_close") {
          depth--;
          if (depth === 0) {
            closeIdx = j;
            break;
          }
        }
      }

      if (closeIdx === -1) continue;

      // 查找第一个 inline token
      let firstInlineIdx = -1;
      for (let j = i + 1; j < closeIdx; j++) {
        if (tokens[j].type === "inline" && tokens[j].content) {
          firstInlineIdx = j;
          break;
        }
      }

      if (firstInlineIdx === -1) continue;

      const firstInline = tokens[firstInlineIdx];
      const content = firstInline.content;

      // 检查是否是 alert 语法
      const alertResult = findAlertType(content);
      if (!alertResult) continue;

      const { config: alertConfig, restContent } = alertResult;

      // 转换为 callout
      // 修改 blockquote_open
      token.type = "callout_open";
      token.tag = "section";
      token.attrSet("class", `callout callout-${alertConfig.cssClass}`);

      // 修改 blockquote_close
      tokens[closeIdx].type = "callout_close";
      tokens[closeIdx].tag = "section";

      // 判断标题和正文：
      // 1. 如果 [!TYPE] 后面同一行有内容（在第一个换行符之前），该内容作为自定义标题
      // 2. 如果 [!TYPE] 后面直接是换行符或空白，使用默认标题
      let titleText: string;
      let bodyContent: string;

      const firstNewlineIndex = restContent.indexOf("\n");
      if (firstNewlineIndex === -1) {
        // 没有换行符，整个 restContent 是单行
        const singleLineContent = restContent.trim();
        if (singleLineContent) {
          // 单行有内容：作为自定义标题，无正文
          titleText = singleLineContent;
          bodyContent = "";
        } else {
          // 单行无内容：使用默认标题，无正文
          titleText = alertConfig.label;
          bodyContent = "";
        }
      } else {
        // 有换行符
        const firstLine = restContent.substring(0, firstNewlineIndex).trim();
        const remainingLines = restContent.substring(firstNewlineIndex + 1);

        if (firstLine) {
          // 第一行有内容：作为自定义标题，后续行作为正文
          titleText = firstLine;
          bodyContent = remainingLines;
        } else {
          // 第一行无内容（[!TYPE] 后直接换行）：使用默认标题，所有内容作为正文
          titleText = alertConfig.label;
          bodyContent = restContent;
        }
      }

      // 更新第一个 inline token 的内容为正文内容
      firstInline.content = bodyContent;

      // 同时更新 firstInline.children（如果存在）
      if (firstInline.children && firstInline.children.length > 0) {
        if (bodyContent) {
          // 如果有正文内容，更新第一个 text 节点
          const firstTextChild = firstInline.children.find(
            (c) => c.type === "text",
          );
          if (firstTextChild) {
            firstTextChild.content = bodyContent;
          }
        } else {
          // 如果没有正文内容，清空所有子节点
          firstInline.children = [];
        }
      }

      // 处理 callout 内容中嵌套的其他 callout 标记（应该被当作普通文本）
      // 遍历所有 inline tokens，移除额外的 [!TYPE] 标记
      for (let j = i + 1; j < closeIdx; j++) {
        const inlineToken = tokens[j];
        if (inlineToken.type === "inline" && inlineToken.content) {
          // 将内容中的 [!TYPE] 标记替换为纯文本显示
          inlineToken.content = inlineToken.content.replace(
            ALERT_PATTERN,
            (match) => {
              return `**${match.trim()}**`; // 将嵌套的标记显示为加粗文本
            },
          );

          // 同时更新 children
          if (inlineToken.children) {
            for (const child of inlineToken.children) {
              if (child.type === "text" && child.content) {
                child.content = child.content.replace(
                  ALERT_PATTERN,
                  (match) => {
                    return `**${match.trim()}**`;
                  },
                );
              }
            }
          }
        }
      }

      // 在第一个段落开始处插入标题
      // 查找 paragraph_open
      for (let j = i + 1; j < closeIdx; j++) {
        if (tokens[j].type === "paragraph_open") {
          // 插入标题 token
          const titleOpen = new Token("callout_title_open", "div", 1);
          titleOpen.attrSet("class", "callout-title");

          const titleContent = new Token("html_inline", "", 0);
          // 使用自定义标题或默认标签
          titleContent.content = `<span class="callout-icon">${alertConfig.icon}</span><span>${titleText}</span>`;

          const titleClose = new Token("callout_title_close", "div", -1);

          // 插入标题
          tokens.splice(j, 0, titleOpen, titleContent, titleClose);
          break;
        }
      }
    }
  });

  // 渲染规则
  md.renderer.rules.callout_open = (tokens: Token[], idx: number) => {
    const token = tokens[idx];
    const classAttr = token.attrGet("class") || "callout";
    return `<section class="${classAttr}">\n`;
  };

  md.renderer.rules.callout_close = () => "</section>\n";

  md.renderer.rules.callout_title_open = (tokens: Token[], idx: number) => {
    const token = tokens[idx];
    const classAttr = token.attrGet("class") || "callout-title";
    return `<div class="${classAttr}">`;
  };

  md.renderer.rules.callout_title_close = () => "</div>\n";
}
