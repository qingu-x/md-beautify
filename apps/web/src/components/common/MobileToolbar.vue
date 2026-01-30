<template>
  <div>
    <!-- More Menu Popup / 更多菜单弹窗 -->
    <Teleport to="body">
      <div v-if="showMenu" class="mobile-menu-overlay" @click="showMenu = false">
        <div class="mobile-menu-panel" @click.stop>
          <div class="mobile-menu-header">
            <span>{{ t('header.more') }}</span>
            <button class="mobile-menu-close" @click="showMenu = false">
              <X :size="20" />
            </button>
          </div>
          <div class="mobile-menu-list">
            <button
              class="mobile-menu-item"
              @click="handleOpenTheme"
            >
              <Palette :size="20" />
              <span>{{ t('header.themeManagement') }}</span>
            </button>
            <button
              class="mobile-menu-item"
              @click="handleOpenStorage"
            >
              <Layers :size="20" />
              <span>{{ t('header.storageMode') }}</span>
            </button>
            <button
              class="mobile-menu-item"
              @click="handleOpenImageHost"
            >
              <ImageIcon :size="20" />
              <span>{{ t('header.imageHost') }}</span>
            </button>
            <button
              class="mobile-menu-item"
              @click="locale = locale === 'zh' ? 'en' : 'zh'; showMenu = false"
            >
              <Languages :size="20" />
              <span>{{ t('header.toggleLanguage') }}</span>
            </button>
            <button
              class="mobile-menu-item"
              @click="handleToggleTheme"
            >
              <Sun v-if="uiThemeStore.theme === 'dark'" :size="20" />
              <Moon v-else :size="20" />
              <span>{{ uiThemeStore.theme === 'dark' ? t('header.toggleLight') : t('header.toggleDark') }}</span>
            </button>
            <button
              class="mobile-menu-item"
              @click="handleExportHtml"
            >
              <Download :size="20" />
              <span>{{ t('header.exportHtml') }}</span>
            </button>
            <button
              class="mobile-menu-item"
              @click="handleExportPdf"
            >
              <FileText :size="20" />
              <span>{{ t('header.exportPdf') }}</span>
            </button>
            <button
              v-if="uiThemeStore.headerAutoHide"
              class="mobile-menu-item highlight"
              @click="handleShowHeader"
            >
              <ChevronsUp :size="20" />
              <span>{{ t('header.showHeader') }}</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Bottom Toolbar / 底部工具栏 -->
    <div class="mobile-toolbar">
      <div class="mobile-toolbar-tabs">
        <button
          class="mobile-tab"
          :class="{ active: activeView === 'editor' }"
          @click="$emit('viewChange', 'editor')"
        >
          <Pencil :size="18" />
          <span>{{ t('mobile.edit') }}</span>
        </button>
        <button
          class="mobile-tab"
          :class="{ active: activeView === 'preview' }"
          @click="$emit('viewChange', 'preview')"
        >
          <Eye :size="18" />
          <span>{{ t('mobile.preview') }}</span>
        </button>
      </div>


      <div class="mobile-toolbar-actions">
        <button
          class="mobile-action-btn primary"
          @click="$emit('copyToEditor')"
        >
          <Copy :size="18" />
        </button>
        <button
          class="mobile-action-btn"
          @click="showMenu = true"
        >
          <MoreHorizontal :size="18" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Pencil, Eye, Copy, MoreHorizontal, Palette, X, Download, FileText, ChevronsUp, Layers, ImageIcon, Sun, Moon, Languages } from "lucide-vue-next";
import type { MobileViewType } from "../../hooks/useMobileView";
import { useUIThemeStore } from "../../store/uiThemeStore";
import { useI18n } from "../../i18n";

const { t, locale } = useI18n();

defineProps<{
  activeView: MobileViewType;
}>();

const emit = defineEmits<{
  (e: 'viewChange', view: MobileViewType): void;
  (e: 'copyToEditor'): void;
  (e: 'openTheme'): void;
  (e: 'openStorage'): void;
  (e: 'openImageHost'): void;
  (e: 'exportHtml'): void;
  (e: 'exportPdf'): void;
}>();

const uiThemeStore = useUIThemeStore();
const showMenu = ref(false);

const handleOpenTheme = () => {
  emit('openTheme');
  showMenu.value = false;
};

const handleOpenStorage = () => {
  emit('openStorage');
  showMenu.value = false;
};

const handleOpenImageHost = () => {
  emit('openImageHost');
  showMenu.value = false;
};

const handleToggleTheme = () => {
  const newTheme = uiThemeStore.theme === 'dark' ? 'default' : 'dark';
  uiThemeStore.setTheme(newTheme);
  showMenu.value = false;
};

const handleExportHtml = () => {
  emit('exportHtml');
  showMenu.value = false;
};

const handleExportPdf = () => {
  emit('exportPdf');
  showMenu.value = false;
};

const handleShowHeader = () => {
  uiThemeStore.setHeaderAutoHide(false);
  showMenu.value = false;
};
</script>

<style scoped>
@import "./MobileToolbar.css";
</style>
