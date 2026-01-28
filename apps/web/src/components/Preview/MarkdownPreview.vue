<script lang="ts">
export const SYNC_SCROLL_EVENT = "mdb-sync-scroll";

export interface SyncScrollDetail {
  source: "editor" | "preview";
  ratio: number;
}
</script>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed, nextTick } from "vue";
import mermaid from "mermaid";
import { createMarkdownParser, processHtml } from "@mdb/core";
import { useEditorStore } from "../../store/editorStore";
import { useThemeStore } from "../../store/themeStore";
import { useUIThemeStore } from "../../store/uiThemeStore";
import { hasMathFormula, renderMathInElement } from "../../utils/katexRenderer";
import { convertLinksToFootnotes } from "../../utils/linkFootnote";
import {
  getMermaidConfig,
  getThemedMermaidDiagram,
} from "../../utils/mermaidConfig";
import {
  getLinkToFootnoteEnabled,
  LINK_TO_FOOTNOTE_EVENT,
} from "../Editor/ToolbarState";

const editorStore = useEditorStore();
const themeStore = useThemeStore();
const uiThemeStore = useUIThemeStore();

const html = ref("");
const linkToFootnoteEnabled = ref(getLinkToFootnoteEnabled());
const previewRef = ref<HTMLDivElement | null>(null);
const scrollContainerRef = ref<HTMLDivElement | null>(null);
const previewContentRef = ref<HTMLDivElement | null>(null);
const isSyncing = ref(false);
const mermaidRenderId = ref(0);
const showDeviceMenu = ref(false);
const showCustomMenu = ref(false);
const showScaleMenu = ref(false);

const devices = [
  { id: 'custom', label: '自定义', width: '100%', height: '100%' },
  { id: 'iphone16pro', label: 'iPhone 16 Pro', width: '430px', height: '932px' },
  { id: 'iphone16', label: 'iPhone 16', width: '390px', height: '844px' },
  { id: 'ipad', label: 'iPad', width: '768px', height: '1024px' },
  { id: 'desktop', label: '桌面端', width: '1280px', height: '720px' },
];

const currentDevice = computed(() => 
  devices.find(d => d.id === editorStore.previewDevice) || devices[0]
);

const previewContentWidth = computed(() => {
  if (editorStore.previewDevice === 'custom') {
    return editorStore.customPreviewWidth;
  }
  return editorStore.previewRotated ? currentDevice.value.height : currentDevice.value.width;
});

const previewContentHeight = computed(() => {
  if (editorStore.previewDevice === 'custom') {
    return editorStore.customPreviewHeight;
  }
  return editorStore.previewRotated ? currentDevice.value.width : currentDevice.value.height;
});

const autoScaleRatio = ref(1);

const finalScale = computed(() => {
  if (editorStore.previewAutoScale) {
    return autoScaleRatio.value * 100;
  }
  return editorStore.previewManualScale;
});

const updateAutoScale = () => {
  if (!editorStore.previewAutoScale || !scrollContainerRef.value) {
    autoScaleRatio.value = 1;
    return;
  }

  const container = scrollContainerRef.value;
  
  // 获取容器实际可用尺寸
  const containerWidth = container.clientWidth - 48;
  const containerHeight = container.clientHeight - 48;

  // 如果容器尺寸尚未准备好，跳过缩放计算
  if (containerWidth <= 0 || containerHeight <= 0) {
    return;
  }

  // 处理百分比宽高
  let contentWidthPx: number;
  let contentHeightPx: number;

  if (previewContentWidth.value.endsWith('%')) {
    contentWidthPx = containerWidth * (parseFloat(previewContentWidth.value) / 100);
  } else {
    contentWidthPx = parseFloat(previewContentWidth.value);
  }

  if (previewContentHeight.value.endsWith('%')) {
    contentHeightPx = containerHeight * (parseFloat(previewContentHeight.value) / 100);
  } else {
    contentHeightPx = parseFloat(previewContentHeight.value);
  }
  
  if (isNaN(contentWidthPx) || contentWidthPx <= 0) {
    autoScaleRatio.value = 1;
    return;
  }

  const scaleX = containerWidth / contentWidthPx;
  const scaleY = contentHeightPx > 0 && !isNaN(contentHeightPx) ? containerHeight / contentHeightPx : 1;
  
  autoScaleRatio.value = Math.min(scaleX, scaleY, 1);
};

// 创建 parser 实例
const parser = createMarkdownParser();

const themeCSS = computed(() => {
  return themeStore.getThemeCSS(themeStore.themeId, uiThemeStore.theme === "dark");
});

// 获取当前主题
const currentTheme = computed(() => {
  return (
    themeStore.customThemes.find((t: any) => t.id === themeStore.themeId) ||
    themeStore.allThemes.find((t: any) => t.id === themeStore.themeId)
  );
});

const designerVars = computed(() => currentTheme.value?.designerVariables);
const mermaidTheme = computed(() => designerVars.value?.mermaidTheme || "base");

watch(
  [
    () => editorStore.markdown,
    () => themeStore.themeId,
    () => themeStore.customCSS,
    () => uiThemeStore.theme,
    linkToFootnoteEnabled,
  ],
  () => {
    const rawHtml = parser.render(editorStore.markdown);
    const previewHtml = linkToFootnoteEnabled.value
      ? convertLinksToFootnotes(rawHtml)
      : rawHtml;

    const styledHtml = processHtml(previewHtml, themeCSS.value, false, false, true);

    html.value = styledHtml;
  },
  { immediate: true }
);

// KaTeX 渲染
watch(html, () => {
  if (!previewRef.value || !html.value) return;

  if (!hasMathFormula(editorStore.markdown)) return;

  nextTick(() => {
    setTimeout(() => {
      if (previewRef.value) {
        renderMathInElement(previewRef.value);
      }
    }, 100);
  });
});

// 自动缩放监听
watch([previewContentWidth, previewContentHeight, () => editorStore.previewAutoScale], () => {
  if (editorStore.previewAutoScale) {
    nextTick(() => {
      setTimeout(() => updateAutoScale(), 100);
    });
  }
});

const normalizeMermaidText = (text: string): string => {
  return text.replace(/\u00A0/g, " ").replace(/\r\n?/g, "\n");
};

const renderMermaidBlocks = async () => {
  if (!previewRef.value || !html.value) return;

  const renderToken = ++mermaidRenderId.value;

  // 使用 nextTick 确保 DOM 已更新
  await nextTick();
  
  // 给一小段时间让 v-html 完成渲染
  await new Promise(resolve => setTimeout(resolve, 100));

  if (!previewRef.value) return;

  const mermaidBlocks = Array.from(
    previewRef.value.querySelectorAll<HTMLElement>(
      ".mermaid, pre.mermaid, pre.language-mermaid, pre.lang-mermaid, pre.custom > code.hljs, pre > code.language-mermaid, pre > code.lang-mermaid, pre > code.mermaid, code.language-mermaid, code.lang-mermaid, code.mermaid",
    )
  );
  
  if (mermaidBlocks.length === 0) return;

  const initConfig = getMermaidConfig(
    designerVars.value,
    uiThemeStore.theme === "dark",
  );

  // 确保 mermaid 已初始化
  try {
    mermaid.initialize({ startOnLoad: false });
  } catch (e) {
    // 忽略重复初始化错误
  }

  for (const [index, block] of mermaidBlocks.entries()) {
    if (!block.dataset.mermaidRaw) {
      block.dataset.mermaidRaw = block.textContent ?? "";
    }
    const diagram = normalizeMermaidText(block.dataset.mermaidRaw ?? "");
    if (!diagram.trim()) continue;

    const themedDiagram = getThemedMermaidDiagram(diagram, initConfig);

    try {
      const { svg } = await mermaid.render(`preview-${renderToken}-${index}`, themedDiagram);
      
      if (mermaidRenderId.value !== renderToken) return;
      
      block.innerHTML = svg;
      block.classList.add("mermaid"); // 确保类名存在
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

// Mermaid 渲染监听
watch([html, mermaidTheme, designerVars, () => uiThemeStore.theme], () => {
  renderMermaidBlocks();
}, { immediate: true });

// 监听预览容器变化
watch(previewRef, (newVal) => {
  if (newVal) {
    renderMermaidBlocks();
  }
});

// 处理预览栏滚动事件
const handlePreviewScroll = () => {
  if (!editorStore.syncScroll || isSyncing.value || !previewContentRef.value) return;

  const container = previewContentRef.value;
  const scrollTop = container.scrollTop;
  const scrollHeight = container.scrollHeight - container.clientHeight;

  if (scrollHeight <= 0) return;

  const ratio = scrollTop / scrollHeight;

  window.dispatchEvent(
    new CustomEvent<SyncScrollDetail>(SYNC_SCROLL_EVENT, {
      detail: { source: "preview", ratio },
    })
  );
};

// 接收编辑器的同步事件
const handleSync = (event: Event) => {
  if (!editorStore.syncScroll) return;
  
  const customEvent = event as CustomEvent<SyncScrollDetail>;
  const { source, ratio } = customEvent.detail;

  if (source === "preview" || !previewContentRef.value) return;

  const container = previewContentRef.value;
  const scrollHeight = container.scrollHeight - container.clientHeight;

  if (scrollHeight <= 0) return;

  isSyncing.value = true;
  container.scrollTop = scrollHeight * ratio;

  setTimeout(() => {
    isSyncing.value = false;
  }, 100);
};

const handleLinkToFootnoteChange = (event: Event) => {
  const customEvent = event as CustomEvent<boolean>;
  linkToFootnoteEnabled.value = customEvent.detail;
};

const selectDevice = (deviceId: string) => {
  editorStore.setPreviewDevice(deviceId);
  showDeviceMenu.value = false;
  if (deviceId === 'custom') {
    editorStore.setPreviewRotated(false);
  }
};

const handleCustomWidthInput = (e: Event) => {
  const input = (e.target as HTMLInputElement).value.trim();
  editorStore.setCustomPreviewWidth(input || '100%');
};

const handleCustomHeightInput = (e: Event) => {
  const input = (e.target as HTMLInputElement).value.trim();
  editorStore.setCustomPreviewHeight(input || '100%');
};

const handleClickOutside = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  if (!target.closest('.device-selector')) {
    showDeviceMenu.value = false;
  }
  if (!target.closest('.scale-selector')) {
    showScaleMenu.value = false;
  }
  if (!target.closest('.custom-selector')) {
    showCustomMenu.value = false;
  }
};

const toggleRotation = () => {
  editorStore.setPreviewRotated(!editorStore.previewRotated);
  nextTick(() => updateAutoScale());
};

const toggleAutoScale = () => {
  editorStore.setPreviewAutoScale(!editorStore.previewAutoScale);
  if (editorStore.previewAutoScale) {
    nextTick(() => updateAutoScale());
  }
};

const handleScaleChange = (e: Event) => {
  const value = parseInt((e.target as HTMLInputElement).value);
  editorStore.setPreviewManualScale(value);
};

onMounted(() => {
  try {
    mermaid.initialize({ startOnLoad: false });
  } catch (e) {
    console.error("Mermaid initialization failed:", e);
  }
  
  // 确保初次挂载时也尝试渲染 Mermaid
  renderMermaidBlocks();

  if (previewContentRef.value) {
    previewContentRef.value.addEventListener("scroll", handlePreviewScroll);
  }
  window.addEventListener(SYNC_SCROLL_EVENT, handleSync as EventListener);
  window.addEventListener(
    LINK_TO_FOOTNOTE_EVENT,
    handleLinkToFootnoteChange as EventListener
  );
  document.addEventListener('click', handleClickOutside);
  window.addEventListener('resize', updateAutoScale);
  
  nextTick(() => {
    setTimeout(() => updateAutoScale(), 200);
  });
});

onUnmounted(() => {
  if (previewContentRef.value) {
    previewContentRef.value.removeEventListener("scroll", handlePreviewScroll);
  }
  window.removeEventListener(SYNC_SCROLL_EVENT, handleSync as EventListener);
  window.removeEventListener(
    LINK_TO_FOOTNOTE_EVENT,
    handleLinkToFootnoteChange as EventListener
  );
  document.removeEventListener('click', handleClickOutside);
  window.removeEventListener('resize', updateAutoScale);
});
</script>

<template>
  <div class="markdown-preview">
    <div class="preview-header">
      <div class="header-left">
        <span class="preview-title">预览</span>
      </div>
      <div class="header-spacer"></div>
      <div class="header-controls">
        <button 
          class="sync-button"
          :class="{ active: editorStore.syncScroll }"
          @click="editorStore.setSyncScroll(!editorStore.syncScroll)"
          :title="editorStore.syncScroll ? '关闭同步滚动' : '开启同步滚动'"
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
            <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>
          </svg>
        </button>
        <div class="device-selector">
        <button class="device-button" @click="showDeviceMenu = !showDeviceMenu">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M17 1H7c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zm0 18H7V5h10v14z"/>
          </svg>
          <span>{{ currentDevice.label }}</span>
          <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
            <path d="M7 10l5 5 5-5z"/>
          </svg>
        </button>
        <div v-if="showDeviceMenu" class="device-menu">
          <div 
            v-for="device in devices" 
            :key="device.id"
            class="device-item"
            :class="{ active: device.id === editorStore.previewDevice }"
            @click="selectDevice(device.id)"
          >
            <span>{{ device.label }}</span>
            <span class="device-width">{{ device.width }} × {{ device.height }}</span>
          </div>
        </div>
      </div>
      <button 
        v-if="editorStore.previewDevice !== 'custom'"
        class="rotate-button" 
        :class="{ rotated: editorStore.previewRotated }"
        @click="toggleRotation"
        title="旋转"
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          <path d="M15.55 5.55L11 1v3.07C7.06 4.56 4 7.92 4 12s3.05 7.44 7 7.93v-2.02c-2.84-.48-5-2.94-5-5.91s2.16-5.43 5-5.91V10l4.55-4.45zM19.93 11c-.17-1.39-.72-2.73-1.62-3.89l-1.42 1.42c.54.75.88 1.6 1.02 2.47h2.02zM13 17.9v2.02c1.39-.17 2.74-.71 3.9-1.61l-1.44-1.44c-.75.54-1.59.89-2.46 1.03zm3.89-2.42l1.42 1.41c.9-1.16 1.45-2.5 1.62-3.89h-2.02c-.14.87-.48 1.72-1.02 2.48z"/>
        </svg>
      </button>
      <div v-if="editorStore.previewDevice === 'custom'" class="custom-selector">
        <button class="custom-button" @click="showCustomMenu = !showCustomMenu">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"/>
          </svg>
          <span>尺寸</span>
        </button>
        <div v-if="showCustomMenu" class="custom-menu">
          <div class="custom-menu-item">
            <label>宽度</label>
            <input
              type="text"
              :value="editorStore.customPreviewWidth"
              @input="handleCustomWidthInput"
              placeholder="如: 500px 或 80%"
            />
          </div>
          <div class="custom-menu-item">
            <label>高度</label>
            <input
              type="text"
              :value="editorStore.customPreviewHeight"
              @input="handleCustomHeightInput"
              placeholder="如: 800px 或 auto"
            />
          </div>
        </div>
      </div>
      <div class="scale-selector">
        <button class="scale-button" @click="showScaleMenu = !showScaleMenu">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            <path d="M12 10h-2v2H9v-2H7V9h2V7h1v2h2v1z"/>
          </svg>
          <span>{{ finalScale.toFixed(0) }}%</span>
        </button>
        <div v-if="showScaleMenu" class="scale-menu">
          <div class="scale-mode">
            <label class="scale-mode-item">
              <input type="radio" :checked="editorStore.previewAutoScale" @change="toggleAutoScale" />
              <span>自动缩放</span>
            </label>
            <label class="scale-mode-item">
              <input type="radio" :checked="!editorStore.previewAutoScale" @change="toggleAutoScale" />
              <span>手动缩放</span>
            </label>
          </div>
          <div v-if="!editorStore.previewAutoScale" class="scale-slider">
            <input 
              type="range" 
              min="10" 
              max="200" 
              :value="editorStore.previewManualScale"
              @input="handleScaleChange"
            />
            <span>{{ editorStore.previewManualScale }}%</span>
          </div>
        </div>
      </div>
      </div>
    </div>
    <div class="preview-container" ref="scrollContainerRef">
      <div 
        class="preview-wrapper"
        :style="{
          width: editorStore.previewAutoScale ? '100%' : 'auto',
          height: editorStore.previewAutoScale ? '100%' : 'auto'
        }"
      >
        <div 
          ref="previewContentRef"
          class="preview-content"
          :style="{ 
            width: previewContentWidth, 
            height: previewContentHeight, 
            transform: `scale(${finalScale / 100})`,
            transformOrigin: 'center top'
          }"
        >
          <component is="style" v-html="themeCSS"></component>
          <div ref="previewRef" v-html="html"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.markdown-preview {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--bg-secondary);
}

.preview-header {
  padding: 8px 12px;
  border-bottom: 1px solid var(--border-light);
  background: var(--bg-primary);
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-spacer {
  flex: 1;
  min-width: 8px;
}

.header-controls {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.device-selector {
  position: relative;
}

.device-button {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-light);
  border-radius: 4px;
  color: var(--text-secondary);
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.device-button:hover {
  background: var(--bg-secondary);
  border-color: var(--border-primary);
}

.device-button svg {
  flex-shrink: 0;
}

.device-button span {
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 80px;
}

.device-menu {
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  background: var(--bg-primary);
  border: 1px solid var(--border-light);
  border-radius: 8px;
  box-shadow: var(--shadow-lg);
  min-width: 200px;
  z-index: 1000;
  overflow: hidden;
}

.device-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  font-size: 13px;
  color: var(--text-primary);
  cursor: pointer;
  transition: background 0.15s;
}

.device-item:hover {
  background: var(--bg-tertiary);
}

.device-item.active {
  background: var(--bg-accent);
  color: var(--accent-primary);
}

.device-width {
  font-size: 11px;
  color: var(--text-tertiary);
}

.custom-selector {
  position: relative;
}

.custom-button {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-light);
  border-radius: 4px;
  color: var(--text-secondary);
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.custom-button:hover {
  background: var(--bg-secondary);
  border-color: var(--border-primary);
}

.custom-button svg {
  flex-shrink: 0;
  width: 14px;
  height: 14px;
}

.custom-menu {
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  background: var(--bg-primary);
  border: 1px solid var(--border-light);
  border-radius: 8px;
  box-shadow: var(--shadow-lg);
  min-width: 220px;
  padding: 12px;
  z-index: 1000;
}

.custom-menu-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 12px;
}

.custom-menu-item:last-child {
  margin-bottom: 0;
}

.custom-menu-item label {
  font-size: 12px;
  color: var(--text-secondary);
  font-weight: 500;
}

.custom-menu-item input {
  width: 100%;
  padding: 6px 10px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-light);
  border-radius: 6px;
  color: var(--text-primary);
  font-size: 12px;
  outline: none;
  box-sizing: border-box;
}

.custom-menu-item input:focus {
  border-color: var(--accent-primary);
  background: var(--bg-primary);
}

.custom-menu-item input::placeholder {
  color: var(--text-tertiary);
  font-size: 11px;
}

.rotate-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-light);
  border-radius: 4px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.rotate-button:hover {
  background: var(--bg-secondary);
  border-color: var(--border-primary);
}

.rotate-button.rotated,
.sync-button.active {
  /* background: var(--accent-primary); */
  color: var(--accent-primary);
  /* border-color: var(--interactive-accent); */
}

.rotate-button svg {
  transition: transform 0.3s;
  width: 14px;
  height: 14px;
}

.rotate-button.rotated svg {
  transform: rotate(90deg);
}

.scale-selector {
  position: relative;
}

.scale-button {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-light);
  border-radius: 4px;
  color: var(--text-secondary);
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.scale-button:hover {
  background: var(--bg-secondary);
  border-color: var(--border-primary);
}

.scale-button svg {
  flex-shrink: 0;
  width: 14px;
  height: 14px;
}

.sync-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-light);
  border-radius: 4px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.sync-button:hover {
  background: var(--bg-secondary);
  border-color: var(--border-primary);
}

.sync-button svg {
  width: 14px;
  height: 14px;
  transition: transform 0.3s;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.scale-menu {
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  background: var(--bg-primary);
  border: 1px solid var(--border-light);
  border-radius: 8px;
  box-shadow: var(--shadow-lg);
  min-width: 200px;
  padding: 12px;
  z-index: 1000;
}

.scale-mode {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.scale-mode-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--text-primary);
  cursor: pointer;
}

.scale-mode-item input[type="radio"] {
  cursor: pointer;
}

.scale-slider {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-top: 8px;
  border-top: 1px solid var(--border-light);
}

.scale-slider input[type="range"] {
  flex: 1;
  cursor: pointer;
}

.scale-slider span {
  font-size: 12px;
  color: var(--text-secondary);
  min-width: 40px;
  text-align: right;
}

.preview-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
  white-space: nowrap;
}

.preview-container {
  flex: 1;
  overflow: auto;
  padding: 24px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 0;
}

.preview-wrapper {
  position: relative;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.preview-content {
  background: var(--bg-primary);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
  padding: 36px;
  border-radius: var(--radius-lg);
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  transition: transform 0.2s ease-out;
  box-sizing: border-box;
  flex-shrink: 0;
}

/* 滚动条样式 */
.preview-content::-webkit-scrollbar {
  width: 12px;
  height: 12px;
}

.preview-content::-webkit-scrollbar-track {
  background: var(--bg-secondary);
  border-radius: 0 var(--radius-lg) var(--radius-lg) 0;
}

.preview-content::-webkit-scrollbar-track:horizontal {
  border-radius: 0 0 var(--radius-lg) var(--radius-lg);
}

.preview-content::-webkit-scrollbar-thumb {
  background-color: var(--scrollbar-thumb, rgba(0, 0, 0, 0.2));
  border-radius: 6px;
  border: 3px solid var(--bg-secondary);
  background-clip: content-box;
}

.preview-content::-webkit-scrollbar-thumb:hover {
  background-color: var(--scrollbar-thumb-hover, rgba(0, 0, 0, 0.3));
}

.preview-content::-webkit-scrollbar-corner {
  background: var(--bg-secondary);
  border-radius: 0 0 var(--radius-lg) 0;
}

/* 响应式 */
@media (max-width: 768px) {
  .preview-header {
    padding: 6px 8px;
    gap: 6px;
  }

  .header-controls {
    gap: 4px;
  }

  .device-button,
  .custom-button,
  .scale-button {
    padding: 4px 6px;
    font-size: 10px;
    gap: 3px;
  }

  .device-button span {
    max-width: 60px;
  }

  .rotate-button,
  .sync-button {
    width: 26px;
    height: 26px;
  }

  .rotate-button svg,
  .sync-button svg,
  .device-button svg,
  .custom-button svg,
  .scale-button svg {
    width: 12px;
    height: 12px;
  }

  .preview-title {
    font-size: 11px;
  }

  .preview-container {
    padding: 16px;
  }

  .preview-content {
    padding: 24px 20px;
  }
}

@media (max-width: 480px) {
  .preview-header {
    padding: 4px 6px;
  }

  .device-button span,
  .custom-button span {
    display: none;
  }

  .device-button,
  .custom-button,
  .scale-button {
    padding: 4px;
    min-width: 26px;
    justify-content: center;
  }

  .scale-button span {
    display: inline;
  }
}

/* 深色模式 */
[data-ui-theme="dark"] .markdown-preview,
[data-ui-theme="dark"] .preview-container {
  background: #1e1e1e;
}

[data-ui-theme="dark"] .preview-content {
  box-shadow: none;
  background: #0f1113;
}

/* 深色模式滚动条 */
[data-ui-theme="dark"] .preview-content::-webkit-scrollbar-track {
  background: #1a1c1e;
  border-radius: 0 var(--radius-lg) var(--radius-lg) 0;
}

[data-ui-theme="dark"] .preview-content::-webkit-scrollbar-track:horizontal {
  border-radius: 0 0 var(--radius-lg) var(--radius-lg);
}

[data-ui-theme="dark"] .preview-content::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
  border-color: #1a1c1e;
}

[data-ui-theme="dark"] .preview-content::-webkit-scrollbar-thumb:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

[data-ui-theme="dark"] .preview-content::-webkit-scrollbar-corner {
  background: #1a1c1e;
  border-radius: 0 0 var(--radius-lg) 0;
}
</style>

<style>
/* 以下样式需要全局生效，以便作用于 v-html 注入的内容 */

/* 确保斜体样式生效 */
#mdb em {
  font-style: italic;
  font-synthesis: style;
}

/* 强制图片自适应 */
#mdb img {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 10px auto;
}

/* 针对整个预览容器启用字体合成 */
#mdb {
  font-synthesis: style weight;
}
</style>
