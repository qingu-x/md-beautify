import juice from "juice";
import { t } from "./i18n";

// Constant definitions / 常量定义
const DATA_TOOL = "MD Beautify";
const SECTION_ID = "mdb";

// Block-level elements requiring data-tool attribute / 需要添加 data-tool 属性的块级元素
const BLOCK_TAGS = [
  "p",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "ul",
  "ol",
  "li",
  "blockquote",
  "table",
  "figure",
  "pre",
  "hr",
] as const;

/**
 * Process HTML, add data-tool attribute and apply CSS styles
 * 处理 HTML，添加 data-tool 属性并应用 CSS 样式
 * @param html - Original HTML string / 原始 HTML 字符串
 * @param css - CSS style string / CSS 样式字符串
 * @param inlineStyles - Whether to inline styles (using juice), default true. Recommended false for preview mode to improve performance. / 是否内联样式 (使用 juice)，默认为 true。预览模式建议设为 false 以提高性能。
 * @param inlinePseudoElements - Whether to inline pseudo-element content (e.g. ::before / ::after), default false. Recommended true when copying to WeChat. / 是否内联伪元素内容（如 ::before / ::after），默认为 false。复制到微信时建议设为 true。
 * @param replaceLocalImages - Whether to replace local images with placeholders, default false. Recommended true for preview mode. / 是否替换本地图片为占位图，默认为 false。预览模式建议设为 true。
 * @returns Processed HTML string / 处理后的 HTML 字符串
 */
export const processHtml = (
  html: string,
  css: string,
  inlineStyles: boolean = true,
  inlinePseudoElements: boolean = false,
  replaceLocalImages: boolean = false,
): string => {
  if (!html || !css) {
    return html || "";
  }

  // Replace local images with placeholders / 替换本地图片为占位图
  if (replaceLocalImages) {
    const placeholderUrl =
      "https://img.wemd.app/mdb/local-image-placeholder.png";
    html = html.replace(
      /<img\s+([^>]*?)src="([^"]+)"([^>]*?)>/gi,
      (match, p1, src, p3) => {
        if (
          !src.startsWith("http://") &&
          !src.startsWith("https://") &&
          !src.startsWith("data:")
        ) {
          const title = t("export", "localImageTitle");
          return `<img ${p1}src="${placeholderUrl}"${p3} data-original-src="${src}" title="${title}">`;
        }
        return match;
      },
    );
  }

  // Add data-tool attribute to top-level block elements / 为顶级块元素添加 data-tool 属性
  BLOCK_TAGS.forEach((tag) => {
    const regex = new RegExp(`<${tag}(\\s+[^>]*|)>`, "gi");
    html = html.replace(regex, (match, attributes) => {
      // Check if data-tool already exists to avoid duplication / 检查 data-tool 是否已存在，避免重复
      if (match.includes("data-tool=")) return match;
      // attributes contains leading space (if exists) or is empty string / attributes 包含前导空格（如果存在），或者为空字符串
      return `<${tag} data-tool="${DATA_TOOL}"${attributes}>`;
    });
  });

  // Handle MathJax related replacements / 处理 MathJax 相关的替换
  html = html.replace(
    /<mjx-container (class="inline.+?)<\/mjx-container>/g,
    "<span $1</span>",
  );
  html = html.replace(/\s<span class="inline/g, '&nbsp;<span class="inline');
  html = html.replace(/svg><\/span>\s/g, "svg></span>&nbsp;");
  html = html.replace(/mjx-container/g, "section");
  html = html.replace(/class="mjx-solid"/g, 'fill="none" stroke-width="70"');
  html = html.replace(/<mjx-assistive-mml.+?<\/mjx-assistive-mml>/g, "");

  // Protect spaces in code blocks to prevent removal by WeChat cleaning / 保护代码块中的空格，防止微信清洗时删除
  html = html.replace(
    /<code([^>]*class="[^"]*\bhljs\b[^"]*"[^>]*)>([\s\S]*?)<\/code>/g,
    (match, attrs: string, inner: string) => {
      let protected_ = inner;
      protected_ = protected_.replace(/\t/g, "&nbsp;&nbsp;");
      protected_ = protected_.replace(/<\/span> <span/g, " </span><span");
      protected_ = protected_.replace(/\n( +)/g, (m, spaces: string) => {
        return "\n" + "&nbsp;".repeat(spaces.length);
      });
      protected_ = protected_.replace(/^( +)/, (m, spaces: string) => {
        return "&nbsp;".repeat(spaces.length);
      });
      return `<code${attrs}>${protected_}</code>`;
    },
  );

  // Detect Mac-style control bar: check pseudo-element selectors and traffic light colors / 检测 Mac 风格控制栏：同时检测伪元素选择器和红绿灯颜色
  const hasMacBarPseudo =
    css.includes("pre.custom::before") || css.includes("pre::before");
  const hasMacBar = hasMacBarPseudo && css.includes("#ff5f56");

  // Replace CSS pseudo-elements with real HTML when copying to WeChat (WeChat cleans pseudo-elements) / 复制到微信时，将 CSS 伪元素替换为真实 HTML（微信会清洗伪元素）
  if (hasMacBar && inlinePseudoElements) {
    const macBarHtml = `<span style="display:block;line-height:1;"><span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:#ff5f56;margin-right:8px;"></span><span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:#ffbd2e;margin-right:8px;"></span><span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:#27c93f;"></span></span>`;
    html = html.replace(
      /<code([^>]*class="[^"]*\bhljs\b[^"]*"[^>]*)>/gi,
      `<code$1>${macBarHtml}`,
    );

    // Remove CSS pseudo-element rules to avoid duplication / 移除 CSS 伪元素规则，避免重复
    css = css.replace(
      /#mdb[^{]*pre[^{]*::before\s*\{[^}]*#ff5f56[^}]*\}/gi,
      "",
    );
  }

  // Handle pseudo-elements for blockquotes (large quotes, corner frames, etc.) / 处理引用的伪元素 (大引号、直角边框等)
  if (inlinePseudoElements) {
    // 1. Quotation Marks style / 1. 大引号样式 (Quotation Marks)
    if (css.includes("blockquote::before") && css.includes('content: "“"')) {
      const quoteColorMatch = css.match(
        /#mdb\s+blockquote::before\s*\{[^}]*color:\s*([^;}]+)/i,
      );
      const quoteColor = quoteColorMatch
        ? quoteColorMatch[1].trim()
        : "inherit";

      html = html.replace(
        /<blockquote([^>]*)>([\s\S]*?)<\/blockquote>/gi,
        (match, attrs, content) => {
          // If data-tool or other markers exist, it might have been processed / 如果已经有 data-tool 或其他标识，说明可能是我们处理过的
          const beforeHtml = `<span style="display:block;height:0;font-size:60px;color:${quoteColor};font-family:Georgia,serif;line-height:1;margin-left:-40px;margin-top:-6px;opacity:0.3;pointer-events:none;">“</span>`;
          return `<blockquote${attrs} style="position:relative;">${beforeHtml}<section style="position:relative;z-index:1;">${content}</section></blockquote>`;
        },
      );

      // Remove pseudo-element rules from CSS / 移除 CSS 中的伪元素规则
      css = css.replace(
        /#mdb\s+blockquote::before\s*\{[^}]*content:\s*"“"[^}]*\}/gi,
        "",
      );
    }

    // 2. Corner Frame style / 2. 直角边框样式 (Corner Frame)
    if (
      css.includes("blockquote::before") &&
      css.includes("border-top") &&
      css.includes("border-left")
    ) {
      const beforeMatch = css.match(
        /#mdb\s+blockquote::before\s*\{([^}]*border-top:[^}]*border-left:[^}]*)\}/i,
      );
      const afterMatch = css.match(
        /#mdb\s+blockquote::after\s*\{([^}]*border-bottom:[^}]*border-right:[^}]*)\}/i,
      );

      if (beforeMatch && afterMatch) {
        const beforeStyle = beforeMatch[1]
          .trim()
          .replace(/\n/g, "")
          .replace(/\s+/g, " ");
        const afterStyle = afterMatch[1]
          .trim()
          .replace(/\n/g, "")
          .replace(/\s+/g, " ");

        html = html.replace(
          /<blockquote([^>]*)>([\s\S]*?)<\/blockquote>/gi,
          (match, attrs, content) => {
            const beforeHtml = `<span style="display:block;position:absolute;top:0;left:0;width:20px;height:20px;${beforeStyle}"></span>`;
            const afterHtml = `<span style="display:block;position:absolute;bottom:0;right:0;width:20px;height:20px;${afterStyle}"></span>`;
            return `<blockquote${attrs} style="position:relative;">${beforeHtml}${content}${afterHtml}</blockquote>`;
          },
        );

        // Remove pseudo-element rules from CSS / 移除 CSS 中的伪元素规则
        css = css.replace(
          /#mdb\s+blockquote::before\s*\{[^}]*border-top:[^}]*border-left:[^}]*\}/gi,
          "",
        );
        css = css.replace(
          /#mdb\s+blockquote::after\s*\{[^}]*border-bottom:[^}]*border-right:[^}]*\}/gi,
          "",
        );
      }
    }

    // 3. Center Accent style / 3. 中心强调样式 (Center Accent)
    if (
      css.includes("blockquote::before") &&
      css.includes("margin: 0 auto 15px")
    ) {
      const beforeMatch = css.match(
        /#mdb\s+blockquote::before\s*\{([^}]*background:[^}]*margin:\s*0\s+auto\s+15px[^}]*)\}/i,
      );
      const afterMatch = css.match(
        /#mdb\s+blockquote::after\s*\{([^}]*background:[^}]*margin:\s*15px\s+auto\s+0[^}]*)\}/i,
      );

      if (beforeMatch && afterMatch) {
        const beforeStyle = beforeMatch[1]
          .trim()
          .replace(/\n/g, "")
          .replace(/\s+/g, " ");
        const afterStyle = afterMatch[1]
          .trim()
          .replace(/\n/g, "")
          .replace(/\s+/g, " ");

        html = html.replace(
          /<blockquote([^>]*)>([\s\S]*?)<\/blockquote>/gi,
          (match, attrs, content) => {
            const beforeHtml = `<span style="display:block;width:40px;${beforeStyle}"></span>`;
            const afterHtml = `<span style="display:block;width:40px;${afterStyle}"></span>`;
            return `<blockquote${attrs} style="text-align:center;">${beforeHtml}${content}${afterHtml}</blockquote>`;
          },
        );

        // Remove pseudo-element rules from CSS / 移除 CSS 中的伪元素规则
        css = css.replace(
          /#mdb\s+blockquote::before\s*\{[^}]*margin:\s*0\s+auto\s+15px[^}]*\}/gi,
          "",
        );
        css = css.replace(
          /#mdb\s+blockquote::after\s*\{[^}]*margin:\s*15px\s+auto\s+0[^}]*\}/gi,
          "",
        );
      }
    }
  }

  // 包裹在 section#mdb 中，复制时添加透明背景防止某些浏览器保留选区背景色
  const bgStyle = inlinePseudoElements
    ? ' style="background:transparent;background-color:transparent;"'
    : "";
  const wrappedHtml = `<section id="${SECTION_ID}"${bgStyle}>${html}</section>`;

  if (!inlineStyles) {
    return wrappedHtml;
  }

  try {
    let res = juice.inlineContent(wrappedHtml, css, {
      inlinePseudoElements,
      preserveImportant: true,
    });

    // 如果 juice 处理结果为空（可能是由于某些极端输入或配置），则返回包装后的 HTML
    if (!res) {
      return wrappedHtml;
    }

    // 在 juice 处理之后，为代码块追加关键内联样式
    // 这确保我们的样式不会被 juice 覆盖，且优先级最高
    if (inlinePseudoElements) {
      const appendStyleValue = (styleValue: string, extra: string) => {
        const trimmed = styleValue.trim();
        if (!trimmed) return extra;
        const needsSemicolon = !trimmed.endsWith(";");
        return `${trimmed}${needsSemicolon ? ";" : ""}${extra}`;
      };

      // 处理 pre 元素：确保 overflow 和 white-space 正确
      res = res.replace(
        /<pre([^>]*)(style="[^"]*")([^>]*)>/gi,
        (match, before: string, styleAttr: string, after: string) => {
          const styleMatch = styleAttr.match(/style="([^"]*)"/i);
          const existing = styleMatch ? styleMatch[1] : "";
          const nextStyle = appendStyleValue(
            existing,
            "overflow-x:auto;-webkit-overflow-scrolling:touch;",
          );
          return `<pre${before}style="${nextStyle}"${after}>`;
        },
      );

      // 处理 code 元素：防止 text-align:justify 破坏代码格式
      // 匹配所有带 style 属性的 code 元素（不限制 class）
      res = res.replace(
        /<code([^>]*)(style="[^"]*")([^>]*)>/gi,
        (match, before: string, styleAttr: string, after: string) => {
          const styleMatch = styleAttr.match(/style="([^"]*)"/i);
          const existing = styleMatch ? styleMatch[1] : "";
          const normalized = existing.replace(
            /white-space:\s*pre-wrap/gi,
            "white-space:pre",
          );
          const nextStyle = appendStyleValue(
            normalized,
            "text-align:left;letter-spacing:0;word-spacing:0;",
          );
          return `<code${before}style="${nextStyle}"${after}>`;
        },
      );

      // 4. Definition List pseudo-element conversion / 4. 术语列表 (Definition List) 伪元素转换
      if (css.includes("dt::after") && css.includes('content: "："')) {
        res = res.replace(
          /<dt([^>]*)(style="[^"]*")([^>]*)>([\s\S]*?)<\/dt>/gi,
          (
            match,
            before: string,
            styleAttr: string,
            after: string,
            content: string,
          ) => {
            return `<dt${before}${styleAttr}${after}>${content}：</dt>`;
          },
        );
      }
    }

    return res;
  } catch (e) {
    console.error("Juice inline error:", e);
    // Return wrapped HTML even if juice processing fails / 返回包装后的 HTML，即使 juice 处理失败
    return wrappedHtml;
  }
};
