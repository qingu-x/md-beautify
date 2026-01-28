<template>
  <div>
    <!-- 隐藏状态下的持久化窗口控制 (Windows only) -->
    <WindowControls v-if="autoHide && isWindows" fixed />

    <!-- 隐藏状态下的浮动工具栏 (仅桌面端显示) -->
    <Transition name="toolbar-expand">
        <div 
          v-if="autoHide && !isMobile" 
          :class="['floating-toolbar', isWindows ? 'floating-toolbar-win' : '', showFloatingMore ? 'expanded' : '']"
          @mouseenter="handleMouseEnter"
          @mouseleave="handleMouseLeave"
        >
          <div class="floating-more-wrapper" :style="{ maxHeight: showFloatingMore ? '500px' : '0' }">
            <div class="floating-more-actions">
              <FloatingToolbarButton
                label="显示标题栏"
                @click="autoHide = false"
                highlight
              >
                <template #icon><ChevronsUp :size="18" :strokeWidth="2" /></template>
              </FloatingToolbarButton>
              <FloatingToolbarButton
                :label="uiTheme === 'dark' ? '亮色模式' : '暗色模式'"
                @click="setTheme(uiTheme === 'dark' ? 'default' : 'dark')"
              >
                <template #icon>
                  <Sun v-if="uiTheme === 'dark'" :size="18" :strokeWidth="2" />
                  <Moon v-else :size="18" :strokeWidth="2" />
                </template>
              </FloatingToolbarButton>

              <FloatingToolbarButton
                v-if="!isElectron"
                label="存储模式"
                @click="showStorageModal = true"
              >
                <template #icon><Layers :size="18" :strokeWidth="2" /></template>
              </FloatingToolbarButton>

              <FloatingToolbarButton
                label="图床设置"
                @click="showImageHostModal = true"
              >
                <template #icon><ImageIcon :size="18" :strokeWidth="2" /></template>
              </FloatingToolbarButton>

              <FloatingToolbarButton
                label="主题管理"
                @click="showThemePanel = true"
              >
                <template #icon><Palette :size="18" :strokeWidth="2" /></template>
              </FloatingToolbarButton>

              <div class="floating-submenu-container">
                <FloatingToolbarButton
                  label="导出功能"
                  @click="showFloatingExportMenu = !showFloatingExportMenu"
                  :active="showFloatingExportMenu"
                >
                  <template #icon><Download :size="18" :strokeWidth="2" /></template>
                </FloatingToolbarButton>
                
                <div v-if="showFloatingExportMenu" class="floating-submenu">
                  <button class="submenu-item" @click="() => exportHtml()">
                    <Download :size="14" :strokeWidth="2" />
                    <span>导出 HTML</span>
                  </button>
                  <button class="submenu-item" @click="() => exportPdf()">
                    <FileText :size="14" :strokeWidth="2" />
                    <span>导出 PDF</span>
                  </button>
                </div>
              </div>

              <FloatingToolbarButton
                label="复制到公众号"
                @click="copyToWechat"
                primary
              >
                <template #icon><Send :size="18" :strokeWidth="2" /></template>
              </FloatingToolbarButton>
            </div>
          </div>

          <FloatingToolbarButton
            :label="showFloatingMore ? '收起' : '更多功能'"
            @click="toggleFloatingMore"
            :class="['floating-more-btn', { 'active': showFloatingMore }]"
          >
            <template #icon>
              <MoreHorizontal :size="18" :strokeWidth="2" />
            </template>
          </FloatingToolbarButton>
        </div>
      </Transition>

    <header
      :class="['app-header', autoHide ? 'header-auto-hide' : '']"
      :style="headerStyle"
    >
      <div class="header-left">
        <div class="logo">
          <StructuralismLogoMark v-if="isStructuralismUI" />
          <DefaultLogoMark v-else />
          <div class="logo-info">
            <span class="logo-text">MD Beautify</span>
            <span class="logo-subtitle">公众号 Markdown 排版编辑器</span>
          </div>
        </div>
      </div>

      <div class="header-actions">
        <div class="header-right">
          <button
            class="btn-secondary"
            @click="showThemePanel = true"
          >
            <Palette :size="18" :strokeWidth="2" />
            <span>主题管理</span>
          </button>

          <div class="dropdown-container">
            <button
              class="btn-secondary"
              @click="showExportMenu = !showExportMenu"
              title="导出文件"
            >
              <Download :size="18" :strokeWidth="2" />
              <span>导出</span>
              <ChevronDown :size="14" :strokeWidth="2" class="chevron-icon" />
            </button>
            <div v-if="showExportMenu" class="dropdown-menu">
              <button class="dropdown-item" @click="() => exportHtml()">
                <div class="item-title">
                  <Download :size="16" :strokeWidth="2" />
                  <span>导出 HTML</span>
                </div>
                <span class="item-desc">包含完整样式的 HTML 文件</span>
              </button>
              <button class="dropdown-item" @click="() => exportPdf()">
                <div class="item-title">
                  <FileText :size="16" :strokeWidth="2" />
                  <span>导出 PDF</span>
                </div>
                <span class="item-desc">矢量格式，支持选中文字</span>
              </button>
            </div>
          </div>

          <button class="btn-primary" @click="copyToWechat">
            <Send :size="18" :strokeWidth="2" />
            <span>复制到公众号</span>
          </button>

          <div class="dropdown-container">
            <button
              class="btn-icon-only"
              @click="isMobile ? autoHide = true : showSettingsMenu = !showSettingsMenu"
              :title="isMobile ? '隐藏标题栏' : '设置'"
            >
              <ChevronsDown v-if="isMobile" :size="18" :strokeWidth="2" />
              <Settings v-else :size="18" :strokeWidth="2" />
            </button>
            <div v-if="showSettingsMenu && !isMobile" class="dropdown-menu">
              <button
                v-if="!isElectron"
                class="dropdown-item"
                @click="showStorageModal = true; showSettingsMenu = false"
              >
                <div class="item-title">
                  <Layers :size="16" :strokeWidth="2" />
                  <span>存储模式</span>
                </div>
                <span class="item-desc">选择本地或云端存储</span>
              </button>
              <button
                class="dropdown-item"
                @click="showImageHostModal = true; showSettingsMenu = false"
              >
                <div class="item-title">
                  <ImageIcon :size="16" :strokeWidth="2" />
                  <span>图床设置</span>
                </div>
                <span class="item-desc">配置图片上传服务</span>
              </button>
              <button
                class="dropdown-item"
                @click="setTheme(uiTheme === 'dark' ? 'default' : 'dark'); showSettingsMenu = false"
              >
                <div class="item-title">
                  <Sun v-if="uiTheme === 'dark'" :size="16" :strokeWidth="2" />
                  <Moon v-else :size="16" :strokeWidth="2" />
                  <span>{{ uiTheme === 'dark' ? '切换到亮色模式' : '切换到暗色模式' }}</span>
                </div>
              </button>
              <button
                class="dropdown-item"
                @click="autoHide = true; showSettingsMenu = false"
              >
                <div class="item-title">
                  <ChevronsDown :size="16" :strokeWidth="2" />
                  <span>隐藏标题栏</span>
                </div>
                <span class="item-desc">专注写作，可通过悬浮按钮恢复</span>
              </button>
            </div>
          </div>

        </div>

        <!-- Windows 自定义标题栏按钮 -->
        <WindowControls v-if="isWindows" />
      </div>
    </header>

    <ThemePanel
      v-if="showThemePanel"
      :open="showThemePanel"
      @close="showThemePanel = false"
    />

    <Modal
      v-if="showStorageModal"
      :open="showStorageModal"
      @close="showStorageModal = false"
      title="选择存储模式"
    >
      <StorageModeSelector />
    </Modal>

    <Modal
      v-if="showImageHostModal"
      :open="showImageHostModal"
      @close="showImageHostModal = false"
      title="图床设置"
      className="modal-narrow"
    >
      <ImageHostSettings />
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineAsyncComponent, onMounted, h } from 'vue';
import { useEditorStore } from "../../store/editorStore";
import { useThemeStore } from "../../store/themeStore";
import { useUIThemeStore } from "../../store/uiThemeStore";
import { useWindowControls } from "../../hooks/useWindowControls";
import { useMobileView } from "../../hooks/useMobileView";
import { useExport } from "../../hooks/useExport";
import WindowControls from "./WindowControls.vue";
import { Modal, FloatingToolbarButton } from "../common";
import {
  Layers,
  Palette,
  Send,
  Download,
  FileText,
  ImageIcon,
  Sun,
  Moon,
  ChevronsUp,
  ChevronsDown,
  ChevronDown,
  Settings,
  MoreHorizontal,
} from "lucide-vue-next";

// Components
const ThemePanel = defineAsyncComponent(() => import("../Theme/ThemePanel.vue"));

const AsyncLoading = () => h('div', { 
  style: { padding: "20px", textAlign: "center", color: "var(--text-secondary)" } 
}, '正在加载...');

const StorageModeSelector = defineAsyncComponent({
  loader: () => import("../StorageModeSelector/StorageModeSelector.vue"),
  loadingComponent: AsyncLoading,
  delay: 200,
});

const ImageHostSettings = defineAsyncComponent({
  loader: () => import("../Settings/ImageHostSettings.vue"),
  loadingComponent: AsyncLoading,
  delay: 200,
});

// SVG components as functional components
const DefaultLogoMark = () => h('svg', {
  width: "40", height: "40", viewBox: "0 0 200 200", xmlns: "http://www.w3.org/2000/svg", "aria-hidden": "true"
}, [
  h('path', { d: "M40 20 H160 C171 20 180 29 180 40 V140 C180 151 171 160 160 160 H140 L140 185 L110 160 H40 C29 160 20 151 20 140 V40 C20 29 29 20 40 20 Z", fill: "#1A1A1A" }),
  h('rect', { x: "50", y: "50", width: "100", height: "12", rx: "6", fill: "#07C160" }),
  h('path', { d: "M60 85 L60 130 H80 L80 110 L100 130 L120 110 L120 130 H140 L140 85 L120 85 L100 105 L80 85 Z", fill: "#FFFFFF" })
]);

const structuralismLogoSrc = (import.meta as any).env.BASE_URL + "favicon-light.svg";
const StructuralismLogoMark = () => h('img', {
  src: structuralismLogoSrc, alt: "MD Beautify Logo", width: "40", height: "40", style: { display: "block" }
});

const editorStore = useEditorStore();
const themeStore = useThemeStore();
const uiThemeStore = useUIThemeStore();
const { isMobile } = useMobileView();
const { isElectron, isWindows, platform } = useWindowControls();
const { exportHtml: baseExportHtml, exportPdf: baseExportPdf } = useExport();

const showThemePanel = ref(false);
const showStorageModal = ref(false);
const showImageHostModal = ref(false);
const showExportMenu = ref(false);
const showSettingsMenu = ref(false);
const showFloatingMore = ref(false);
const showFloatingExportMenu = ref(false);
let hoverTimer: any = null;

// 检测是否支持 hover (排除触摸屏模拟的 hover)
const isHoverSupported = typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches;

const handleMouseEnter = () => {
  if (!isHoverSupported) return;
  if (hoverTimer) clearTimeout(hoverTimer);
  showFloatingMore.value = true;
};

const handleMouseLeave = () => {
  if (!isHoverSupported) return;
  hoverTimer = setTimeout(() => {
    showFloatingMore.value = false;
  }, 300);
};

const toggleFloatingMore = (e: MouseEvent) => {
  // 如果是桌面端 hover 触发的，点击时不应再次切换（防止 hover 展开后点击又收起）
  // 但在移动端（不支持 hover 的设备），点击应正常切换
  if (isHoverSupported && showFloatingMore.value && e.type === 'click') {
    // 桌面端且已展开时，点击收起
    showFloatingMore.value = false;
  } else {
    showFloatingMore.value = !showFloatingMore.value;
  }
};

const autoHide = computed({
  get: () => uiThemeStore.headerAutoHide,
  set: (val) => uiThemeStore.setHeaderAutoHide(val)
});

// 初始化和挂载逻辑
onMounted(() => {
  // 点击外部关闭菜单
  window.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.dropdown-container') && !target.closest('.floating-submenu-container')) {
      showExportMenu.value = false;
      showSettingsMenu.value = false;
      showFloatingExportMenu.value = false;
    }
  });
});

// 移除原有的 watch 和 localStorage 逻辑，因为已经在 store 中处理了

const uiTheme = computed(() => uiThemeStore.theme);
const isStructuralismUI = computed(() => uiTheme.value === "dark");

const setTheme = (theme: 'default' | 'dark') => uiThemeStore.setTheme(theme);

const copyToWechat = () => {
  const isDarkMode = uiThemeStore.theme === "dark";
  const css = themeStore.getThemeCSS(themeStore.themeId, isDarkMode);
  editorStore.copyToWechat(css);
};

const exportHtml = async () => {
  await baseExportHtml();
  showExportMenu.value = false;
  showFloatingExportMenu.value = false;
};

const exportPdf = async () => {
  await baseExportPdf();
  showExportMenu.value = false;
  showFloatingExportMenu.value = false;
};

const openStorageModal = () => showStorageModal.value = true;
const openImageHostModal = () => showImageHostModal.value = true;

defineExpose({
  openStorageModal,
  openImageHostModal
});

const headerStyle = computed(() => {
  return platform === "darwin" ? { paddingLeft: "100px" } : undefined;
});
</script>

<style scoped>
@import "./Header.css";
</style>
