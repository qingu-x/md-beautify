import katex from "katex";

/**
 * Detect if content contains math formulas / 检测内容是否包含数学公式
 */
export function hasMathFormula(content: string): boolean {
  if (!content) return false;
  // Detect inline formula $...$ or block formula $$...$$ / 检测行内公式 $...$ 或行间公式 $$...$$
  // Use looser regex to support multiline / 使用更宽松的正则，支持多行
  return /\$([\s\S]+?)\$/.test(content);
}

/**
 * Replace math formulas in content / 替换内容中的数学公式
 * Used to avoid other processing (such as emoji replacement) affecting formulas / 用于在进行其他处理（如 emoji 替换）时，先将公式保护起来
 */
export function replaceMathWithPlaceholder(content: string): {
  content: string;
  placeholders: Record<string, string>;
} {
  const placeholders: Record<string, string> = {};
  let index = 0;

  // Replace block formulas $$...$$ / 替换行间公式 $$...$$
  let processedContent = content.replace(
    /\$\$([\s\S]+?)\$\$/g,
    (match, formula) => {
      const key = `__MATH_BLOCK_${index++}__`;
      placeholders[key] = match;
      return key;
    },
  );

  // Replace inline formulas $...$ / 替换行内公式 $...$
  processedContent = processedContent.replace(
    /\$([\s\S]+?)\$/g,
    (match, formula) => {
      // Avoid matching normal $ symbols (e.g. price), simple heuristic check / 避免匹配到普通的 $ 符号（如价格），简单的启发式检查
      // If there are too many spaces or newlines, it might not be a formula / 如果中间包含过多空格或换行，可能不是公式
      if (formula.includes("\n\n")) return match;

      const key = `__MATH_INLINE_${index++}__`;
      placeholders[key] = match;
      return key;
    },
  );

  return { content: processedContent, placeholders };
}

/**
 * Restore math formulas / 还原数学公式
 */
export function restoreMathFromPlaceholder(
  content: string,
  placeholders: Record<string, string>,
): string {
  let result = content;
  // Restore in reverse order of length to avoid partial replacement (though unlikely with UUID-like keys) / 按长度倒序还原，避免部分替换（虽然用 UUID 风格的 key 不太可能）
  Object.keys(placeholders).forEach((key) => {
    result = result.replace(key, placeholders[key]);
  });
  return result;
}

/**
 * Render math formulas in element / 渲染元素中的数学公式
 * Find all content wrapped in $ and render with KaTeX / 查找所有 $ 包裹的内容并用 KaTeX 渲染
 */
export function renderMathInElement(element: HTMLElement): void {
  if (!element) return;

  // Get all text nodes / 获取所有文本节点
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null);

  const textNodes: Text[] = [];
  let node: Text | null;
  while ((node = walker.nextNode() as Text | null)) {
    if (node.textContent && /\$([\s\S]+?)\$/.test(node.textContent)) {
      textNodes.push(node);
    }
  }

  // Process each text node containing formulas / 处理每个包含公式的文本节点
  for (const textNode of textNodes) {
    const text = textNode.textContent || "";
    const parent = textNode.parentNode;
    if (!parent) continue;

    // Skip already rendered nodes or code blocks / 跳过已经渲染过的节点或代码块
    if (
      parent instanceof HTMLElement &&
      (parent.classList.contains("katex") ||
        parent.closest(".katex") ||
        parent.tagName === "CODE" ||
        parent.tagName === "PRE" ||
        parent.closest("code") ||
        parent.closest("pre"))
    ) {
      continue;
    }

    // 创建文档片段
    const fragment = document.createDocumentFragment();
    let lastIndex = 0;

    // 匹配行间公式 $$...$$ 和行内公式 $...$
    // 使用 [\s\S] 来匹配包括换行符在内的所有字符
    // 使用非贪婪匹配 +?
    const regex = /\$\$([\s\S]+?)\$\$|\$([\s\S]+?)\$/g;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      // 添加公式前的普通文本
      if (match.index > lastIndex) {
        fragment.appendChild(
          document.createTextNode(text.slice(lastIndex, match.index)),
        );
      }

      // 渲染公式
      const isBlock = match[1] !== undefined;
      const formula = isBlock ? match[1] : match[2];

      if (!formula || !formula.trim()) {
        fragment.appendChild(document.createTextNode(match[0]));
        lastIndex = match.index + match[0].length;
        continue;
      }

      try {
        // 创建渲染容器
        const renderContainer = document.createElement("span");

        // 使用 KaTeX 渲染
        katex.render(formula.trim(), renderContainer, {
          throwOnError: false,
          displayMode: isBlock,
          trust: true,
          strict: false,
        });

        if (isBlock) {
          // 块级公式：需要包装在 .katex-display 容器中
          const displayWrapper = document.createElement("div");
          displayWrapper.className = "katex-display";
          // renderContainer 现在包含 .katex 元素
          displayWrapper.appendChild(renderContainer);
          fragment.appendChild(displayWrapper);
        } else {
          // 行内公式：直接添加
          fragment.appendChild(renderContainer);
        }
      } catch {
        // 渲染失败时保留原文
        const errorSpan = document.createElement("span");
        errorSpan.textContent = match[0];
        errorSpan.className = "katex-error";
        fragment.appendChild(errorSpan);
      }
      lastIndex = match.index + match[0].length;
    }

    // 添加剩余的普通文本
    if (lastIndex < text.length) {
      fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
    }

    // 替换原文本节点
    if (fragment.childNodes.length > 0) {
      parent.replaceChild(fragment, textNode);
    }
  }
}
