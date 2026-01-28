<template>
  <div>
    <!-- 更多菜单弹窗 -->
    <Teleport to="body">
      <div v-if="showMenu" class="mobile-menu-overlay" @click="showMenu = false">
        <div class="mobile-menu-panel" @click.stop>
          <div class="mobile-menu-header">
            <span>更多功能</span>
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
              <span>主题管理</span>
            </button>
            <button
              class="mobile-menu-item"
              @click="handleOpenStorage"
            >
              <Layers :size="20" />
              <span>存储模式</span>
            </button>
            <button
              class="mobile-menu-item"
              @click="handleOpenImageHost"
            >
              <ImageIcon :size="20" />
              <span>图床设置</span>
            </button>
            <button
              class="mobile-menu-item"
              @click="handleToggleTheme"
            >
              <Sun v-if="uiThemeStore.theme === 'dark'" :size="20" />
              <Moon v-else :size="20" />
              <span>{{ uiThemeStore.theme === 'dark' ? '切换到亮色模式' : '切换到暗色模式' }}</span>
            </button>
            <button
              class="mobile-menu-item"
              @click="handleExportHtml"
            >
              <Download :size="20" />
              <span>导出 HTML</span>
            </button>
            <button
              class="mobile-menu-item"
              @click="handleExportPdf"
            >
              <FileText :size="20" />
              <span>导出 PDF</span>
            </button>
            <button
              v-if="uiThemeStore.headerAutoHide"
              class="mobile-menu-item highlight"
              @click="handleShowHeader"
            >
              <ChevronsUp :size="20" />
              <span>显示标题栏</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- 底部工具栏 -->
    <div class="mobile-toolbar">
      <div class="mobile-toolbar-tabs">
        <button
          class="mobile-tab"
          :class="{ active: activeView === 'editor' }"
          @click="$emit('viewChange', 'editor')"
        >
          <Pencil :size="18" />
          <span>编辑</span>
        </button>
        <button
          class="mobile-tab"
          :class="{ active: activeView === 'preview' }"
          @click="$emit('viewChange', 'preview')"
        >
          <Eye :size="18" />
          <span>预览</span>
        </button>
      </div>

      <div class="mobile-toolbar-actions">
        <button
          class="mobile-action-btn primary"
          @click="$emit('copyToWechat')"
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
import { Pencil, Eye, Copy, MoreHorizontal, Palette, X, Download, FileText, ChevronsUp, Layers, ImageIcon, Sun, Moon } from "lucide-vue-next";
import type { MobileViewType } from "../../hooks/useMobileView";
import { useUIThemeStore } from "../../store/uiThemeStore";

defineProps<{
  activeView: MobileViewType;
}>();

const emit = defineEmits<{
  (e: 'viewChange', view: MobileViewType): void;
  (e: 'copyToWechat'): void;
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
