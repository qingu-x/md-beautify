<template>
  <aside class="history-sidebar">
    <div class="history-header">
      <h3>{{ t('history.title') }}</h3>
      <div class="history-actions">
        <button 
          class="btn-secondary btn-icon-only" 
          @mousedown="handleMouseDown"
          @mouseup="handleMouseUp"
          @mouseleave="handleMouseLeave"
          @touchstart="handleTouchStart"
          @touchend="handleTouchEnd"
          @touchcancel="handleTouchCancel"
          :data-tooltip="isLongPressing ? t('history.longPressReleaseTip') : t('history.longPressTip')"
        >
          <Plus :size="16" />
        </button>
        <button
          class="btn-secondary btn-icon-only"
          @click="showClearConfirm = true"
          :data-tooltip="t('history.clearHistory')"
        >
          <Trash2 :size="16" />
        </button>
      </div>
    </div>
    <div class="history-search">
      <div class="search-wrapper">
        <Search :size="14" class="search-icon" />
        <input
          type="text"
          :placeholder="t('history.searchPlaceholder')"
          :value="filter"
          @input="e => setFilter((e.target as HTMLInputElement).value)"
        />
      </div>
    </div>
    <div v-if="loading" class="history-empty">{{ t('history.loading') }}</div>
    <div v-else-if="!hasEntries" class="history-empty">
      {{ filter ? t('history.noResults') : t('history.empty') }}
    </div>
    <div v-else class="history-body">
      <div class="history-list">
        <div
          v-for="entry in visibleHistory"
          :key="entry.id"
          :class="['history-item', activeId === entry.id ? 'active' : '']"
          @click="handleRestore(entry)"
        >
          <div class="history-item-main">
            <div class="history-title-block">
              <span class="history-time">{{ new Date(entry.savedAt).toLocaleString() }}</span>
              <div v-if="renamingId === entry.id" class="history-rename" @click.stop>
                <input
                  v-model="tempTitle"
                  v-focus
                  @keydown.enter="confirmRename(entry)"
                  @keydown.esc="renamingId = null"
                />
                <button @click="confirmRename(entry)">{{ t('common.confirm') }}</button>
                <button @click="renamingId = null">{{ t('common.cancel') }}</button>
              </div>
              <span v-else class="history-title">{{ entry.title || t('history.unnamed') }}</span>
              <span class="history-theme">{{ getThemeName(entry) }}</span>
            </div>
            <div class="history-actions-menu-wrapper">
              <button
                class="history-action-trigger"
                @click.stop="e => handleMenuToggle(e, entry)"
                :aria-label="t('history.menu')"
              >
                <MoreHorizontal :size="16" />
              </button>
            </div>
          </div>
        </div>
        <!-- Infinite scroll trigger / 无限滚动触发器 -->
        <div v-if="hasMore" ref="loadMoreRef" class="history-load-more">
          <span>{{ t('history.loadMore') }}</span>
        </div>
      </div>
    </div>
  </aside>

  <!-- Action Menu Portal -->
  <Teleport to="body">
    <div
      v-if="actionMenuId && menuEntry"
      class="history-action-menu"
      :style="{ top: menuPosition.top + 'px', left: menuPosition.left + 'px' }"
      @click.stop
    >
      <button @click="copyTitle(menuEntry); closeActionMenu()">
        <Copy :size="14" />
        {{ t('history.copyTitle') }}
      </button>
      <button @click="startRename(menuEntry); closeActionMenu()">
        <Edit2 :size="14" />
        {{ t('history.rename') }}
      </button>
      <button class="danger" @click="deleteTarget = menuEntry; closeActionMenu()">
        <Trash2 :size="14" />
        {{ t('history.delete') }}
      </button>
    </div>
  </Teleport>

  <!-- Delete Confirm Portal -->
  <Teleport to="body">
    <div v-if="deleteTarget" class="history-confirm-backdrop" @click="!deleting && (deleteTarget = null)">
      <div class="history-confirm-modal" @click.stop>
        <h4>{{ t('history.deleteConfirmTitle') }}</h4>
        <p>{{ t('history.deleteConfirmText', { title: deleteTarget.title || t('history.unnamed') }) }}</p>
        <div class="history-confirm-actions">
          <button class="btn-secondary" @click="deleteTarget = null" :disabled="deleting">
            {{ t('common.cancel') }}
          </button>
          <button
            class="btn-danger"
            @click="handleDeleteConfirm"
            :disabled="deleting"
          >
            {{ deleting ? t('history.deleting') : t('history.confirmDelete') }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>

  <!-- Clear Confirm Portal -->
  <Teleport to="body">
    <div v-if="showClearConfirm" class="history-confirm-backdrop" @click="!clearing && (showClearConfirm = false)">
      <div class="history-confirm-modal" @click.stop>
        <h4>{{ t('history.clearConfirmTitle') }}</h4>
        <p>{{ t('history.clearConfirmText') }}</p>
        <div class="history-confirm-actions">
          <button class="btn-secondary" @click="showClearConfirm = false" :disabled="clearing">
            {{ t('common.cancel') }}
          </button>
          <button
            class="btn-danger"
            @click="handleClearConfirm"
            :disabled="clearing"
          >
            {{ clearing ? t('history.clearing') : t('history.confirmClear') }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { Search, Plus, Trash2, MoreHorizontal, Edit2, Copy } from 'lucide-vue-next';
import { useI18n } from '../../i18n';
import { useEditorStore } from '../../store/editorStore';
import { useThemeStore } from '../../store/themeStore';
import { useHistoryStore } from '../../store/historyStore';
import { getEditorDefaultMarkdown } from '../../store/editorStore';
import { toast } from '../../hooks/useToast';
import type { HistorySnapshot } from '../../store/historyTypes';

const PAGE_SIZE = 50;
const LONG_PRESS_DURATION = 500;

const editorStore = useEditorStore();
const themeStore = useThemeStore();
const historyStore = useHistoryStore();
const { t } = useI18n();

const getThemeName = (entry: HistorySnapshot): string => {
  if (!entry.theme) return entry.themeName || t('history.defaultTheme');
  // Check if it is a built-in theme / 检查是否是内置主题
  const isBuiltIn = themeStore.allThemes.find(th => th.id === entry.theme)?.isBuiltIn;
  if (isBuiltIn) {
    return t(`theme.names.${entry.theme}`);
  }
  return entry.themeName || t('history.defaultTheme');
};

const history = computed(() => historyStore.history);
const loading = computed(() => historyStore.loading);
const filter = computed(() => historyStore.filter);
const activeId = computed(() => historyStore.activeId);

const setFilter = (val: string) => historyStore.setFilter(val);

const renamingId = ref<string | null>(null);
const tempTitle = ref(t('history.unnamed'));
const actionMenuId = ref<string | null>(null);
const menuPosition = ref({ top: 0, left: 0 });
const menuEntry = ref<HistorySnapshot | null>(null);

const visibleCount = ref(PAGE_SIZE);
const loadMoreRef = ref<HTMLElement | null>(null);
const showClearConfirm = ref(false);
const clearing = ref(false);
const deleteTarget = ref<HistorySnapshot | null>(null);
const deleting = ref(false);

const isLongPressing = ref(false);
let longPressTimer: number | null = null;

const handleRestore = async (entry: HistorySnapshot) => {
  try {
    await historyStore.persistActiveSnapshot({
      markdown: editorStore.markdown,
      theme: themeStore.themeId,
      customCSS: themeStore.customCSS,
      themeName: themeStore.themeName,
    });
    editorStore.setMarkdown(entry.markdown);
    themeStore.selectTheme(entry.theme);
    themeStore.setCustomCSS(entry.customCSS);
    historyStore.setActiveId(entry.id);
    renamingId.value = null;
    actionMenuId.value = null;
    toast.success(t('history.restoreSuccess'));
  } catch (error) {
    toast.error(t('history.restoreError'));
    console.error(error);
  }
};

const handleDeleteConfirm = async () => {
  if (!deleteTarget.value) return;
  deleting.value = true;
  try {
    const id = deleteTarget.value.id;
    await historyStore.deleteEntry(id);
    if (renamingId.value === id) renamingId.value = null;
    if (activeId.value === id) {
      if (historyStore.activeId) {
        const nextEntry = historyStore.history.find(item => item.id === historyStore.activeId);
        if (nextEntry) {
          editorStore.setMarkdown(nextEntry.markdown);
          themeStore.selectTheme(nextEntry.theme);
          themeStore.setCustomCSS(nextEntry.customCSS);
        }
      } else {
        editorStore.resetDocument();
      }
    }
    toast.success(t('history.deleteSuccess'));
  } catch (error) {
    toast.error(t('history.deleteError'));
    console.error(error);
  } finally {
    deleting.value = false;
    deleteTarget.value = null;
  }
};

const handleCreateArticle = async (withExample = false) => {
  const initial = withExample ? getEditorDefaultMarkdown() : '# ' + t('history.newArticle') + '\n\n';
  const title = withExample ? t('history.exampleArticle') : t('history.newArticle');
  
  try {
    // 1. Save current article state / 1. 保存当前文章的状态
    await historyStore.persistActiveSnapshot({
      markdown: editorStore.markdown,
      theme: themeStore.themeId,
      customCSS: themeStore.customCSS,
      themeName: themeStore.themeName,
    });

    // 2. Reset editor and theme state / 2. 重置编辑器和主题状态
    editorStore.resetDocument({ 
      markdown: initial, 
      theme: 'default', 
      customCSS: '',
      themeName: t('theme.defaultTheme') 
    });

    // 3. Create new history entry / 3. 创建新的历史记录条目
    const newEntry = await historyStore.saveSnapshot(
      { 
        markdown: initial, 
        theme: 'default', 
        customCSS: '', 
        title, 
        themeName: t('theme.defaultTheme') 
      },
      { force: true }
    );

    // 4. Set new entry as active / 4. 设置新条目为激活状态
    if (newEntry) {
      historyStore.setActiveId(newEntry.id);
    }
    
    toast.success(withExample ? t('history.createExampleSuccess') : t('history.createSuccess'));

    // 5. Close rename and other temporary states / 5. 关闭重命名等临时状态
    renamingId.value = null;
    actionMenuId.value = null;
  } catch (error) {
    toast.error(t('history.createError'));
    console.error(error);
  }
};

const clearLongPressTimer = () => {
  if (longPressTimer !== null) {
    window.clearTimeout(longPressTimer);
    longPressTimer = null;
  }
  isLongPressing.value = false;
};

const handleMouseDown = (e: MouseEvent) => {
  e.preventDefault();
  clearLongPressTimer();
  longPressTimer = window.setTimeout(() => {
    isLongPressing.value = true;
  }, LONG_PRESS_DURATION);
};

const handleMouseUp = (e: MouseEvent) => {
  e.preventDefault();
  const wasLongPress = isLongPressing.value;
  clearLongPressTimer();
  handleCreateArticle(wasLongPress);
};

const handleMouseLeave = () => {
  clearLongPressTimer();
};

const handleTouchStart = (e: TouchEvent) => {
  e.preventDefault();
  clearLongPressTimer();
  longPressTimer = window.setTimeout(() => {
    isLongPressing.value = true;
  }, LONG_PRESS_DURATION);
};

const handleTouchEnd = (e: TouchEvent) => {
  e.preventDefault();
  const wasLongPress = isLongPressing.value;
  clearLongPressTimer();
  handleCreateArticle(wasLongPress);
};

const handleTouchCancel = () => {
  clearLongPressTimer();
};

const startRename = (entry: HistorySnapshot) => {
  renamingId.value = entry.id;
  tempTitle.value = entry.title || t('history.unnamed');
  actionMenuId.value = null;
  menuEntry.value = null;
};

const confirmRename = async (entry: HistorySnapshot) => {
  try {
    await historyStore.updateTitle(entry.id, tempTitle.value);
    renamingId.value = null;
    toast.success(t('history.renameSuccess'));
  } catch (error) {
    toast.error(t('history.renameError'));
    console.error(error);
  }
};

const copyTitle = async (entry: HistorySnapshot) => {
  try {
    await navigator.clipboard.writeText(entry.title || t('history.unnamed'));
    toast.success(t('history.copySuccess'));
  } catch (error) {
    toast.error(t('history.copyError'));
    console.error(error);
  }
};

const handleMenuToggle = (event: MouseEvent, entry: HistorySnapshot) => {
  const button = event.currentTarget as HTMLElement;
  const rect = button.getBoundingClientRect();
  const width = 180;
  const padding = 12;
  const maxLeft = window.innerWidth - width - padding;
  const minLeft = padding;
  const desiredLeft = rect.right - width;
  const left = Math.max(minLeft, Math.min(maxLeft, desiredLeft));
  const top = rect.bottom + 8;

  if (actionMenuId.value === entry.id) {
    closeActionMenu();
    return;
  }

  actionMenuId.value = entry.id;
  menuEntry.value = entry;
  menuPosition.value = { top, left };
};

const closeActionMenu = () => {
  actionMenuId.value = null;
  menuEntry.value = null;
};

const handleClearConfirm = async () => {
  clearing.value = true;
  try {
    await historyStore.clearHistory();
    editorStore.resetDocument();
  } finally {
    clearing.value = false;
    showClearConfirm.value = false;
  }
};

const keyword = computed(() => filter.value.trim().toLowerCase());
const filteredHistory = computed(() => {
  if (!keyword.value) return history.value;
  return history.value.filter((entry) =>
    (entry.title || t('history.unnamed')).toLowerCase().includes(keyword.value)
  );
});

const visibleHistory = computed(() => filteredHistory.value.slice(0, visibleCount.value));
const hasMore = computed(() => visibleCount.value < filteredHistory.value.length);
const hasEntries = computed(() => filteredHistory.value.length > 0);

const loadMore = () => {
  if (hasMore.value) {
    visibleCount.value = Math.min(visibleCount.value + PAGE_SIZE, filteredHistory.value.length);
  }
};

let observer: IntersectionObserver | null = null;

onMounted(() => {
  historyStore.loadHistory();
  
  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && hasMore.value) {
        loadMore();
      }
    },
    { threshold: 0.1 }
  );

  watch(loadMoreRef, (el) => {
    if (el) observer?.observe(el);
  }, { immediate: true });

  const handleWindowClick = () => closeActionMenu();
  const handleWindowScroll = () => closeActionMenu();
  window.addEventListener('click', handleWindowClick);
  window.addEventListener('scroll', handleWindowScroll, true);

  onUnmounted(() => {
    observer?.disconnect();
    window.removeEventListener('click', handleWindowClick);
    window.removeEventListener('scroll', handleWindowScroll, true);
    clearLongPressTimer();
  });
});

watch(filter, () => {
  visibleCount.value = PAGE_SIZE;
});

const vFocus = {
  mounted: (el: HTMLInputElement) => el.focus()
};
</script>

<style scoped>
@import "./HistoryPanel.css";
</style>
