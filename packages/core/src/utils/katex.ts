import katex from "katex";

/**
 * 检测内容是否包含数学公式
 */
export function hasMathFormula(content: string): boolean {
  if (!content) return false;
  // 检测行内公式 $...$ 或行间公式 $$...$$
  // 使用更宽松的正则，支持多行
  return /\$([\s\S]+?)\$/.test(content);
}

/**
 * 渲染元素中的数学公式
 * 查找所有 $ 包裹的内容并用 KaTeX 渲染
 */
export function renderMathInElement(element: HTMLElement): void {
  if (!element) return;

  // 获取所有文本节点
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null);

  const textNodes: Text[] = [];
  let node: Text | null;
  while ((node = walker.nextNode() as Text | null)) {
    if (node.textContent && /\$([\s\S]+?)\$/.test(node.textContent)) {
      textNodes.push(node);
    }
  }

  // 处理每个包含公式的文本节点
  for (const textNode of textNodes) {
    const text = textNode.textContent || "";
    const parent = textNode.parentNode;
    if (!parent) continue;

    // 跳过已经渲染过的节点或代码块
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
