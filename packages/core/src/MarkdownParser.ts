// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./types/markdown-it-plugins.d.ts" />
import MarkdownIt from "markdown-it";
import markdownItDeflist from "markdown-it-deflist";
import markdownItImplicitFigures from "markdown-it-implicit-figures";
import markdownItTableOfContents from "markdown-it-table-of-contents";
import markdownItRuby from "markdown-it-ruby";
import markdownItMark from "markdown-it-mark";

import markdownItSub from "markdown-it-sub";
import markdownItSup from "markdown-it-sup";
import { full as markdownItEmoji } from "markdown-it-emoji";

// Local plugins

import markdownItMath from "./plugins/markdown-it-math";

import markdownItSpan from "./plugins/markdown-it-span";

import markdownItTableContainer from "./plugins/markdown-it-table-container";

import markdownItLinkfoot from "./plugins/markdown-it-linkfoot";

import markdownItImageFlow from "./plugins/markdown-it-imageflow";

import markdownItMultiquote from "./plugins/markdown-it-multiquote";

import markdownItLiReplacer from "./plugins/markdown-it-li";

import markdownItGitHubAlert from "./plugins/markdown-it-github-alert";
import markdownItTaskLists from "markdown-it-task-lists";
import markdownItCheckboxEmoji from "./plugins/markdown-it-checkbox-emoji";

import highlightjs from "./utils/langHighlight";

export const createMarkdownParser = () => {
  const markdownParser: MarkdownIt = new MarkdownIt({
    html: true,
    highlight: (str: string, lang: string): string => {
      const language = (lang || "").trim().toLowerCase();
      // Mermaid diagrams: output pre.mermaid for frontend rendering / Mermaid 图表：输出 pre.mermaid 让前端渲染
      if (language === "mermaid") {
        const escaped = markdownParser.utils.escapeHtml(str);
        return `<pre class="mermaid">\n${escaped}\n</pre>\n`;
      }

      if (language === undefined || language === "") {
        lang = "bash";
      }
      // Add custom to indicate custom style, not WeChat specific, avoid being removed pre / 加上custom则表示自定义样式，而非微信专属，避免被remove pre
      if (lang && highlightjs.getLanguage(lang)) {
        try {
          const formatted = highlightjs.highlight(str, {
            language: lang,
            ignoreIllegals: true,
          }).value;
          return (
            '<pre class="custom"><code class="hljs">' +
            formatted +
            "</code></pre>"
          );
        } catch {
          // Ignore highlight errors
        }
      }
      return (
        '<pre class="custom"><code class="hljs">' +
        markdownParser.utils.escapeHtml(str) +
        "</code></pre>"
      );
    },
  });

  markdownParser
    .use(markdownItSpan)
    .use(markdownItTableContainer)
    .use(markdownItMath)
    .use(markdownItLinkfoot)
    .use(markdownItTableOfContents, {
      transformLink: () => "",
      includeLevel: [2, 3],
      markerPattern: /^\[toc\]/im,
    })
    .use(markdownItRuby)
    .use(markdownItImplicitFigures, { figcaption: true })
    .use(markdownItDeflist)
    .use(markdownItLiReplacer)
    .use(markdownItImageFlow)
    .use(markdownItMultiquote)
    .use(markdownItMark)
    .use(markdownItSub)
    .use(markdownItSup)
    .use(markdownItEmoji)
    .use(markdownItGitHubAlert)
    .use(markdownItTaskLists, {
      enabled: true,
      label: true,
      labelAfter: true,
    })
    .use(markdownItCheckboxEmoji);

  // 自定义图片渲染：支持 ![alt](url =100x100) 或 ![alt](url "title" =100x100)
  const defaultImageRender =
    markdownParser.renderer.rules.image ||
    function (tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options);
    };

  markdownParser.renderer.rules.image = function (
    tokens,
    idx,
    options,
    env,
    self,
  ) {
    const token = tokens[idx];
    const srcIndex = token.attrIndex("src");
    let src = token.attrs![srcIndex][1];

    // 匹配 URL 中的 mdb-size 参数（由下面的 render 拦截器注入）
    const sizeMatch = src.match(/[?&]mdb-size=([^&]+)/);
    if (sizeMatch) {
      const size = decodeURIComponent(sizeMatch[1]);
      // 移除 src 中的 mdb-size 参数
      src = src.replace(sizeMatch[0], "");
      // 如果移除后 URL 以 ? 或 & 结尾，也清理掉
      src = src.replace(/[?&]$/, "");
      token.attrs![srcIndex][1] = src;

      // 移除 size 字符串开头的 '='
      const cleanSize = size.startsWith("=") ? size.substring(1) : size;

      if (cleanSize.includes("x")) {
        const [width, height] = cleanSize.split("x");
        if (width) token.attrPush(["width", width]);
        if (height) token.attrPush(["height", height]);
      } else {
        token.attrPush(["width", cleanSize]);
      }
    }

    // 支持 Obsidian 风格的图片尺寸语法：![alt|100](url) 或 ![alt|100x200](url)
    const altIndex = token.attrIndex("alt");
    let altText = "";

    // 优先从 attrs 读取，如果为空则使用 content
    if (altIndex >= 0 && token.attrs && token.attrs[altIndex]) {
      altText = token.attrs[altIndex][1] || "";
    }
    if (!altText && token.content) {
      altText = token.content;
    }

    if (altText) {
      // 匹配结尾的 |width 或 |widthxheight
      const match = altText.match(/\|(\d+)(?:x(\d+))?$/);
      if (match) {
        const width = match[1];
        const height = match[2];

        // 仅当之前未设置 width/height 时才设置（mdb-size 优先级更高）
        if (width && token.attrIndex("width") === -1) {
          token.attrPush(["width", width]);
        }
        if (height && token.attrIndex("height") === -1) {
          token.attrPush(["height", height]);
        }

        // 添加 style 属性，直接设置宽高，覆盖主题的 width: 100%
        const styleIndex = token.attrIndex("style");
        let styleValue = "";
        if (width) {
          styleValue += `width: ${width}px !important; max-width: none !important;`;
        }
        if (height) {
          styleValue += ` height: ${height}px !important; max-height: none !important;`;
        }

        if (styleValue) {
          if (styleIndex >= 0) {
            // 合并已有的 style
            token.attrs![styleIndex][1] += "; " + styleValue;
          } else {
            // 添加新的 style
            token.attrPush(["style", styleValue]);
          }
        }

        // 清理 alt 文本（移除尺寸部分）
        const cleanAlt = altText.substring(0, match.index);
        token.content = cleanAlt;

        // 同步更新 attrs 中的 alt 属性
        if (altIndex >= 0 && token.attrs) {
          token.attrs[altIndex][1] = cleanAlt;
        }
      }
    }

    return defaultImageRender(tokens, idx, options, env, self);
  };

  // Disable client-side html processing / 禁用客户端 html 处理
  // markdownParser.validateLink = () => true;

  // Use customized link renderer / 使用自定义的 link 渲染器
  const defaultLinkOpenRender =
    markdownParser.renderer.rules.link_open ||
    function (tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options);
    };

  markdownParser.renderer.rules.link_open = function (
    tokens,
    idx,
    options,
    env,
    self,
  ) {
    const token = tokens[idx];
    const hrefIndex = token.attrIndex("href");

    if (hrefIndex >= 0) {
      const href = token.attrs![hrefIndex][1];

      // Check if it is an external link / 检查是否为外部链接
      if (href && (href.startsWith("http://") || href.startsWith("https://"))) {
        // Add target="_blank" / 添加 target="_blank"
        token.attrPush(["target", "_blank"]);
        // Add rel="noopener noreferrer" for security / 添加 rel="noopener noreferrer" 安全性
        token.attrPush(["rel", "noopener noreferrer"]);
      }
    }

    return defaultLinkOpenRender(tokens, idx, options, env, self);
  };

  // 增强图片语法支持：拦截 render 方法进行预处理
  const originalRender = markdownParser.render.bind(markdownParser);
  markdownParser.render = (src: string, env?: unknown) => {
    let normalizedSrc = src;

    // 1. 处理带有尺寸和标题的图片：![alt](url "title" =100x100) 或 ![alt](url =100x100 "title")
    // 将尺寸信息注入到 URL 参数中，避开 markdown-it 的原生解析限制
    normalizedSrc = normalizedSrc.replace(
      /(!\[.*?\]\()(.+?)(?:\s+(['"].+?['"])\s+(=(?:\d+)?x?(?:\d+)?)| \s+(=(?:\d+)?x?(?:\d+)?)\s+(['"].+?['"]))(\))/g,
      (_match, p1, url, p3, p4, p5, p6) => {
        const title = p3 || p6;
        const size = p4 || p5;
        const connector = url.includes("?") ? "&" : "?";
        return `${p1}${url}${connector}mdb-size=${encodeURIComponent(size)} ${title})`;
      },
    );

    // 2. 处理只有尺寸没有标题的图片：![alt](url =100x100)
    normalizedSrc = normalizedSrc.replace(
      /(!\[.*?\]\()(.+?)\s+(=(?:\d+)?x?(?:\d+)?)\)/g,
      (match, p1, url, size) => {
        const connector = url.includes("?") ? "&" : "?";
        return `${p1}${url}${connector}mdb-size=${encodeURIComponent(size)})`;
      },
    );

    // 3. 容错：处理 ![alt]\n(url) -> ![alt](url)
    normalizedSrc = normalizedSrc.replace(/(!\[.*?\])\s*\n\s*(\()/g, "$1$2");

    return originalRender(normalizedSrc, env);
  };

  return markdownParser;
};
