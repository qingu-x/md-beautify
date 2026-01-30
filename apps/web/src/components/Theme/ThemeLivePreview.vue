<template>
  <div class="theme-live-preview">
    <div class="preview-header-mini">
      <span>{{ t('theme.livePreview') }}</span>
    </div>
    <iframe
      ref="iframeRef"
      class="preview-iframe"
      :srcdoc="shellDoc"
      :title="t('theme.livePreview')"
      sandbox="allow-same-origin"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import mermaid from "mermaid";
import { createMarkdownParser, processHtml, convertCssToWeChatDarkMode, getDefaultMarkdown } from "@mdb/core";
import { useUIThemeStore } from "../../store/uiThemeStore";
import { useI18n } from "../../i18n";
import type { DesignerVariables } from "./ThemeDesigner/types";
import {
  getMermaidConfig,
  getThemedMermaidDiagram,
} from "../../utils/mermaidConfig";

const props = defineProps<{
  css: string;
  designerVariables?: DesignerVariables;
}>();

const { locale, t } = useI18n();

const uiThemeStore = useUIThemeStore();
const isDarkMode = computed(() => uiThemeStore.theme === "dark");
const iframeRef = ref<HTMLIFrameElement | null>(null);
const mermaidRenderId = ref(0);

const parser = createMarkdownParser();

const shellDoc = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style id="base-style">
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      padding: 16px;
      font-size: 14px;
      line-height: 1.6;
      transition: background 0.2s, color 0.2s;
      min-height: 100vh;
    }
    /* Hide scrollbar until content loads / 隐藏滚动条直到内容加载 */
    body:empty { display: none; }
  </style>
  <style id="theme-style"></style>
</head>
<body><div id="preview-root"></div></body>
</html>
`;

const rawHtml = computed(() => {
  const md = getDefaultMarkdown(locale.value);
  return parser.render(md);
});

const finalCss = computed(() => (isDarkMode.value ? convertCssToWeChatDarkMode(props.css) : props.css));

const html = computed(() => {
  return processHtml(rawHtml.value, finalCss.value, false);
});

const normalizeMermaidText = (text: string): string => {
  return text.replace(/\u00A0/g, " ").replace(/\r\n?/g, "\n");
};

const renderMermaid = async (doc: Document) => {
  const blocks = Array.from(
    doc.querySelectorAll<HTMLElement>(
      ".mermaid, pre.mermaid, pre.language-mermaid, pre.lang-mermaid, pre > code.language-mermaid, pre > code.lang-mermaid, pre > code.mermaid, code.language-mermaid, code.lang-mermaid, code.mermaid",
    ),
  );
  if (blocks.length === 0) return;

  if (!(window as any).__mdbMermaidInitialized) {
    try {
      mermaid.initialize({ startOnLoad: false });
      (window as any).__mdbMermaidInitialized = true;
    } catch (e) {
      console.error("Mermaid initialization failed in preview:", e);
      return;
    }
  }

  const initConfig = getMermaidConfig(
    props.designerVariables,
    isDarkMode.value,
  );

  const renderToken = ++mermaidRenderId.value;
  for (const [index, block] of blocks.entries()) {
    if (!block.dataset.mermaidRaw) {
      block.dataset.mermaidRaw = block.textContent ?? "";
    }
    const diagram = normalizeMermaidText(block.dataset.mermaidRaw ?? "");
    if (!diagram.trim()) continue;

    const themedDiagram = getThemedMermaidDiagram(diagram, initConfig);
    try {
      const { svg } = await mermaid.render(
        `theme-preview-${renderToken}-${index}`,
        themedDiagram,
      );
      if (mermaidRenderId.value !== renderToken) {
        return;
      }
      block.innerHTML = svg;
      block.classList.add("mermaid");
      const svgEl = block.querySelector("svg");
      if (svgEl) {
        const defs = svgEl.querySelector("defs");
        const refNode = defs ? defs.nextSibling : svgEl.firstChild;
        const selectors = [
          "g.lineWrapper", 
          "g.edgePaths", 
          "g[class*='arrow']", 
          "g[class*='node-line']", 
          "g[class*='timeline-line']"
        ];
        const lineGroups = Array.from(svgEl.querySelectorAll(selectors.join(", ")));
        for (const g of lineGroups) {
          // Ensure g and refNode are direct children of svgEl / 确保 g 和 refNode 是 svgEl 的直接子节点
          if (g.parentNode === svgEl && (!refNode || refNode.parentNode === svgEl)) {
            if (refNode) {
              svgEl.insertBefore(g, refNode);
            } else {
              svgEl.insertBefore(g, svgEl.firstChild);
            }
          }
        }
      }
    } catch (e) {
      console.error("Mermaid render error:", e);
    }
  }
};

const updateContent = (() => {
  let timer: any = null;
  return () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      const iframe = iframeRef.value;
      if (!iframe) return;

      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!doc) return;

      const themeStyle = doc.getElementById("theme-style");
      const root = doc.getElementById("preview-root");

      if (themeStyle && root) {
        // Save current scroll position / 保存当前滚动位置
        const scrollY = iframe.contentWindow?.scrollY || 0;

        // Update colors / 更新颜色
        doc.body.style.background = isDarkMode.value ? "#252526" : "#fff";
        doc.body.style.color = isDarkMode.value ? "#d4d4d4" : "#000";

        // Update styles and HTML / 更新样式和 HTML
        themeStyle.textContent = finalCss.value;
        root.innerHTML = html.value;

        // Restore scroll position / 恢复滚动位置
        iframe.contentWindow?.scrollTo(0, scrollY);
        
        // Render Mermaid / 渲染 Mermaid
        void renderMermaid(doc);
      }
    }, 100);
  };
})();

watch([html, finalCss, isDarkMode, () => props.designerVariables?.mermaidTheme], () => {
  updateContent();
}, { immediate: true });

onMounted(() => {
  const iframe = iframeRef.value;
  if (!iframe) return;

  const doc = iframe.contentDocument || iframe.contentWindow?.document;
  if (doc && doc.readyState === "complete" && doc.getElementById("preview-root")) {
    updateContent();
  } else {
    iframe.onload = updateContent;
  }
});
</script>

<style scoped>
.theme-live-preview {
  flex: 1;
  min-width: 280px;
  border-right: 1px solid var(--border-light);
  display: flex;
  flex-direction: column;
  background: var(--bg-secondary);
  min-height: 0;
}

.preview-header-mini {
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-light);
  font-size: 12px;
  font-weight: 600;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  background: var(--bg-primary);
  flex-shrink: 0;
}

.preview-iframe {
  flex: 1;
  width: 100%;
  border: none;
  background: #fff;
}
</style>
