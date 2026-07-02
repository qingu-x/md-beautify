<template>
  <div class="app" :data-platform="platformName" :data-mobile="isMobile">
    <!-- Update Modal / 更新提示 Modal -->
    <UpdateModal
      v-if="updateInfo"
      :latest-version="updateInfo.latestVersion"
      :current-version="updateInfo.currentVersion"
      :release-notes="updateInfo.releaseNotes"
      @close="updateInfo = null"
      @download="handleDownload"
      @skip-version="handleSkipVersion"
    />

    <!-- Render HistoryManager only when storage context is ready and confirmed as IndexedDB / 只在存储上下文完全就绪且确认为 IndexedDB 模式时才渲染 HistoryManager -->
    <HistoryManager v-if="!isElectron && ready && storageType === 'indexeddb'" />

    <template v-if="isElectron && !workspacePath">
      <Welcome />
    </template>

    <template v-else>
      <Header ref="headerRef" />
      
      <button
        class="history-toggle"
        :class="{ 'is-collapsed': !showHistory }"
        @click="showHistory = !showHistory"
        :aria-label="showHistory ? t('editor.sidebar.hide') : t('editor.sidebar.show')"
      >
        <span class="sr-only">
          {{ showHistory ? t('editor.sidebar.hide') : t('editor.sidebar.show') }}
        </span>
      </button>

      <main
        class="app-main"
        :style="mainStyle"
        :data-show-history="showHistory"
      >
        <!-- Overlay (visible only on small/medium screens) / 遮罩层（仅在中小屏幕显示） -->
        <div 
          v-if="showHistory"
          class="history-backdrop"
          @click="showHistory = false"
        ></div>

        <div
          class="history-pane"
          :class="showHistory ? 'is-visible' : 'is-hidden'"
          :aria-hidden="!showHistory"
        >
          <div class="history-pane__content">
            <!-- Render after ready to prevent flickering / ready 后渲染，防止闪烁 -->
            <template v-if="ready">
              <FileSidebar v-if="isElectron || storageType === 'filesystem'" />
              <HistoryPanel v-else />
            </template>
          </div>
        </div>

        <div
          class="workspace"
          :data-mobile-view="isMobile ? activeView : undefined"
        >
          <div class="editor-pane">
            <!-- Show loading when storage not ready or file/history loading / 存储未就绪或文件/历史加载中显示 loading -->
            <div v-if="!ready || fileLoading || (historyLoading && !isElectron && storageType === 'indexeddb')" class="workspace-loading">
              <Loader2 class="animate-spin" :size="24" />
              <p>{{ t('editor.loadingArticle') }}</p>
            </div>
            <MarkdownEditor v-else />
          </div>

          <div class="preview-pane">
            <div v-if="!ready || fileLoading || (historyLoading && !isElectron && storageType === 'indexeddb')" class="workspace-loading">
              <Loader2 class="animate-spin" :size="24" />
              <p>{{ t('editor.loadingArticle') }}</p>
            </div>
            <MarkdownPreview v-else />
          </div>
        </div>

        <!-- Mobile Bottom Toolbar / 移动端底部工具栏 -->
        <MobileToolbar
          v-if="isMobile"
          :active-view="activeView"
          @view-change="setActiveView"
          @copy-to-wechat="copyToEditor"
          @open-theme="showThemePanel = true"
          @open-storage="headerRef?.openStorageModal"
          @open-image-host="headerRef?.openImageHostModal"
          @export-html="() => exportHtml()"
          @export-pdf="() => exportPdf()"
        />
      </main>

      <!-- Mobile Theme Selector / 移动端主题选择器 -->
      <MobileThemeSelector
        v-if="isMobile"
        :open="showThemePanel"
        @close="showThemePanel = false"
      />

      <!-- Global Toast / 全局通知 -->
      <Toast />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { Loader2 } from 'lucide-vue-next';
import { useI18n } from './i18n';
import Header from './components/Header/Header.vue';
import FileSidebar from './components/Sidebar/FileSidebar.vue';
import MarkdownEditor from './components/Editor/MarkdownEditor.vue';
import MarkdownPreview from './components/Preview/MarkdownPreview.vue';
import HistoryPanel from './components/History/HistoryPanel.vue';
import HistoryManager from './components/History/HistoryManager.vue';
import Welcome from './components/Welcome/Welcome.vue';
import UpdateModal from './components/UpdateModal/UpdateModal.vue';
import MobileToolbar from './components/common/MobileToolbar.vue';
import MobileThemeSelector from './components/Theme/MobileThemeSelector.vue';
import { Toast } from './components/common';

import { useFileSystem } from './hooks/useFileSystem';
import { useMobileView } from './hooks/useMobileView';
import { useExport } from './hooks/useExport';
import { useEditorStore } from './store/editorStore';
import { useHistoryStore } from './store/historyStore';
import { useFileStore } from './store/fileStore';
import { useStorageStore } from './store/storageStore';
import { useThemeStore } from './store/themeStore';
import { useUIThemeStore } from './store/uiThemeStore';
import { platform } from './utils/platformAdapter';

import './styles/global.css';
import './App.css';

const { t, locale } = useI18n();

const { workspacePath, saveFile } = useFileSystem({ registerListeners: true });
const storageStore = useStorageStore();
const historyStore = useHistoryStore();
const fileStore = useFileStore();
const editorStore = useEditorStore();

watch(locale, (nextLocale, prevLocale) => {
  if (nextLocale === prevLocale) return;
  editorStore.syncMarkdownForLocale(nextLocale);
});

const ready = computed(() => storageStore.ready);
const storageType = computed(() => storageStore.type);
const historyLoading = computed(() => historyStore.loading);
const fileLoading = computed(() => fileStore.isLoading);

const { isMobile, activeView, setActiveView } = useMobileView();
const { exportHtml, exportPdf } = useExport();

const themeStore = useThemeStore();
const uiThemeStore = useUIThemeStore();

const headerRef = ref<any>(null);

const copyToEditor = () => {
  // Always use light mode CSS for WeChat copy, as WeChat App handles dark mode inversion automatically
  // Using dark mode CSS (isDarkMode=true) causes issues in WeChat light mode
  // Also, if current theme is dark, force switch to default theme for copy
  // 复制到微信时始终使用浅色模式的 CSS，因为微信 App 会自动处理深色模式反色
  // 如果使用深色模式 CSS (isDarkMode=true)，在微信浅色模式下会显示异常
  // 另外，如果当前选中的是深色主题，强制切换到默认主题进行复制
  const copyThemeId = themeStore.themeId === 'dark' ? 'default' : themeStore.themeId;
  const css = themeStore.getThemeCSS(copyThemeId, false);
  editorStore.copyToEditor(css);
};

const showThemePanel = ref(false);
const showHistory = ref(
  localStorage.getItem("mdb-show-history") !== "false"
);

const historyWidth = ref(showHistory.value ? "280px" : "0px");

watch(showHistory, (val: boolean) => {
  localStorage.setItem("mdb-show-history", String(val));
  if (val) {
    historyWidth.value = "280px";
  } else {
    setTimeout(() => {
      historyWidth.value = "0px";
    }, 350);
  }
});

const mainStyle = computed(() => ({
  '--history-width': historyWidth.value,
}));

const isElectron = platform.isElectron;
const platformName = platform.name ?? "web";

// 更新提示状态
const updateInfo = ref<{
  latestVersion: string;
  currentVersion: string;
  releaseNotes: string;
} | null>(null);

const handleKeyDown = async (e: KeyboardEvent) => {
  if ((e.metaKey || e.ctrlKey) && e.key === "s") {
    e.preventDefault();
    // Shortcut save logic is handled in MarkdownEditor.vue / 快捷键保存逻辑已在 MarkdownEditor.vue 中统一处理
    // Avoid duplicate handling to prevent conflicts / 这里不再重复处理，避免冲突
  }
};

onMounted(() => {
  document.addEventListener("keydown", handleKeyDown);
  
  if (isElectron) {
    const electron = (window as any).electron;
    if (electron?.update?.onUpdateAvailable) {
      electron.update.onUpdateAvailable((data: any) => {
        const skippedVersion = localStorage.getItem("mdb-skipped-version");
        if (!data.force && skippedVersion === data.latestVersion) {
          return;
        }
        updateInfo.value = {
          latestVersion: data.latestVersion,
          currentVersion: data.currentVersion,
          releaseNotes: data.releaseNotes || "",
        };
      });
    }
  }
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleKeyDown);
});

const handleDownload = () => {
  (window as any).electron?.update?.openReleases?.();
  updateInfo.value = null;
};

const handleSkipVersion = () => {
  if (updateInfo.value) {
    localStorage.setItem("mdb-skipped-version", updateInfo.value.latestVersion);
  }
  updateInfo.value = null;
};
</script>

<style>
/* Add base styles here or rely on App.css / 可以在这里添加一些基础样式，或者依赖 App.css */
</style>
