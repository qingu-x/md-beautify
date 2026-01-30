<template>
  <div>
    <!-- Persistent window controls in hidden state (Windows only) / 隐藏状态下的持久化窗口控制 (Windows only) -->
    <WindowControls v-if="autoHide && isWindows" fixed />

    <!-- Floating toolbar in hidden state (Desktop only) / 隐藏状态下的浮动工具栏 (仅桌面端显示) -->
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
                :label="t('header.showHeader')"
                @click="autoHide = false"
                highlight
              >
                <template #icon><ChevronsUp :size="18" :strokeWidth="2" /></template>
              </FloatingToolbarButton>
              <FloatingToolbarButton
                :label="uiTheme === 'dark' ? t('header.toggleLight') : t('header.toggleDark')"
                @click="setTheme(uiTheme === 'dark' ? 'default' : 'dark')"
              >
                <template #icon>
                  <Sun v-if="uiTheme === 'dark'" :size="18" :strokeWidth="2" />
                  <Moon v-else :size="18" :strokeWidth="2" />
                </template>
              </FloatingToolbarButton>

              <FloatingToolbarButton
                v-if="!isElectron"
                :label="t('header.storageMode')"
                @click="showStorageModal = true"
              >
                <template #icon><Layers :size="18" :strokeWidth="2" /></template>
              </FloatingToolbarButton>

              <FloatingToolbarButton
                :label="t('header.imageHost')"
                @click="showImageHostModal = true"
              >
                <template #icon><ImageIcon :size="18" :strokeWidth="2" /></template>
              </FloatingToolbarButton>

              <FloatingToolbarButton
                :label="t('header.themeManagement')"
                @click="showThemePanel = true"
              >
                <template #icon><Palette :size="18" :strokeWidth="2" /></template>
              </FloatingToolbarButton>

              <div class="floating-submenu-container">
                <FloatingToolbarButton
                  :label="t('header.export')"
                  @click="showFloatingExportMenu = !showFloatingExportMenu"
                  :active="showFloatingExportMenu"
                >
                  <template #icon><Download :size="18" :strokeWidth="2" /></template>
                </FloatingToolbarButton>
                
                <div v-if="showFloatingExportMenu" class="floating-submenu">
                  <button class="submenu-item" @click="() => exportHtml()">
                    <Download :size="14" :strokeWidth="2" />
                    <span>{{ t('header.exportHtml') }}</span>
                  </button>
                  <button class="submenu-item" @click="() => exportPdf()">
                    <FileText :size="14" :strokeWidth="2" />
                    <span>{{ t('header.exportPdf') }}</span>
                  </button>
                </div>
              </div>

              <FloatingToolbarButton
                :label="t('header.copyButton')"
                @click="copyToEditor"
                primary
              >
                <template #icon><Send :size="18" :strokeWidth="2" /></template>
              </FloatingToolbarButton>
            </div>
          </div>

          <FloatingToolbarButton
            :label="showFloatingMore ? t('header.collapse') : t('header.more')"
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
            <span class="logo-subtitle">{{ t('header.subtitle') }}</span>
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
            <span>{{ t('header.themeManagement') }}</span>
          </button>

          <div class="dropdown-container">
            <button
              class="btn-secondary"
              @click="showExportMenu = !showExportMenu"
              :title="t('header.export')"
            >
              <Download :size="18" :strokeWidth="2" />
              <span>{{ t('header.export') }}</span>
              <ChevronDown :size="14" :strokeWidth="2" class="chevron-icon" />
            </button>
            <div v-if="showExportMenu" class="dropdown-menu">
              <button class="dropdown-item" @click="() => exportHtml()">
                <div class="item-title">
                  <Download :size="16" :strokeWidth="2" />
                  <span>{{ t('header.exportHtml') }}</span>
                </div>
                <span class="item-desc">{{ t('header.exportHtmlDesc') }}</span>
              </button>
              <button class="dropdown-item" @click="() => exportPdf()">
                <div class="item-title">
                  <FileText :size="16" :strokeWidth="2" />
                  <span>{{ t('header.exportPdf') }}</span>
                </div>
                <span class="item-desc">{{ t('header.exportPdfDesc') }}</span>
              </button>
            </div>
          </div>

          <button class="btn-primary" @click="copyToEditor">
            <Send :size="18" :strokeWidth="2" />
            <span>{{ t('header.copyToEditor') }}</span>
          </button>

          <div class="dropdown-container">
            <button
              class="btn-icon-only"
              @click="isMobile ? autoHide = true : showSettingsMenu = !showSettingsMenu"
              :title="isMobile ? t('header.hideHeader') : t('header.settings')"
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
                  <span>{{ t('header.storageMode') }}</span>
                </div>
                <span class="item-desc">{{ t('header.storageModeDesc') }}</span>
              </button>
              <button
                class="dropdown-item"
                @click="showImageHostModal = true; showSettingsMenu = false"
              >
                <div class="item-title">
                  <ImageIcon :size="16" :strokeWidth="2" />
                  <span>{{ t('header.imageHost') }}</span>
                </div>
                <span class="item-desc">{{ t('header.imageHostDesc') }}</span>
              </button>
              <button
                class="dropdown-item"
                @click="setTheme(uiTheme === 'dark' ? 'default' : 'dark'); showSettingsMenu = false"
              >
                <div class="item-title">
                  <Sun v-if="uiTheme === 'dark'" :size="16" :strokeWidth="2" />
                  <Moon v-else :size="16" :strokeWidth="2" />
                  <span>{{ uiTheme === 'dark' ? t('header.toggleLight') : t('header.toggleDark') }}</span>
                </div>
              </button>
              <button
                class="dropdown-item"
                @click="locale = locale === 'zh' ? 'en' : 'zh'; showSettingsMenu = false"
              >
                <div class="item-title">
                  <Languages :size="16" :strokeWidth="2" />
                  <span>{{ t('header.toggleLanguage') }}</span>
                </div>
              </button>
              <button
                class="dropdown-item"
                @click="autoHide = true; showSettingsMenu = false"
              >
                <div class="item-title">
                  <ChevronsDown :size="16" :strokeWidth="2" />
                  <span>{{ t('header.hideHeader') }}</span>
                </div>
                <span class="item-desc">{{ t('header.hideHeaderDesc') }}</span>
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
      :title="t('modal.storageMode')"
    >
      <StorageModeSelector />
    </Modal>

    <Modal
      v-if="showImageHostModal"
      :open="showImageHostModal"
      @close="showImageHostModal = false"
      :title="t('modal.imageHost')"
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
  Languages,
} from "lucide-vue-next";
import { useI18n } from "../../i18n";

const { t, locale } = useI18n();

// Components
const ThemePanel = defineAsyncComponent(() => import("../Theme/ThemePanel.vue"));

const AsyncLoading = () => h('div', { 
  style: { padding: "20px", textAlign: "center", color: "var(--text-secondary)" } 
}, t('modal.loading'));

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
  h('rect', { x: "20", y: "20", width: "160", height: "160", rx: "32", fill: "#07C160" }),
  h('path', { d: "M50 60 L50 140 L80 140 L80 100 L100 130 L120 100 L120 140 L150 140 L150 60 L120 60 L100 90 L80 60 Z", fill: "white" })
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

const copyToEditor = () => {
  const isDarkMode = uiThemeStore.theme === "dark";
  const css = themeStore.getThemeCSS(themeStore.themeId, isDarkMode);
  editorStore.copyToEditor(css);
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
