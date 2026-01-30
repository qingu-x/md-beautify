<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { useI18n } from '../../i18n';
import { useEditorStore, defaultMarkdown } from '../../store/editorStore';
import { useThemeStore } from '../../store/themeStore';
import { useHistoryStore } from '../../store/historyStore';

const { t } = useI18n();

const AUTO_SAVE_INTERVAL = 10 * 1000; // 10 seconds / 10 秒

function deriveTitle(markdown: string) {
  const trimmed = markdown.trim();
  if (!trimmed) return t('history.unnamed');
  const headingMatch = trimmed.match(/^(#+)\s*(.+)$/m);
  if (headingMatch) {
    return headingMatch[2].trim().slice(0, 50) || t('history.unnamed');
  }
  const firstLine = trimmed.split(/\r?\n/).find((line) => line.trim());
  return firstLine ? firstLine.trim().slice(0, 50) : t('history.unnamed');
}

const editorStore = useEditorStore();
const themeStore = useThemeStore();
const historyStore = useHistoryStore();

const isInitialMount = ref(true);
const isRestoring = ref(false);
const hasUserEdited = ref(false);
const hasAppliedInitialHistory = ref(false);
const creatingInitialSnapshot = ref(false);
const hasLoadedHistory = ref(false);
const wasLoading = ref(false);
const restoringContent = ref<string | null>(null);

const prevMarkdown = ref(editorStore.markdown);

// Load history / 加载历史记录
onMounted(() => {
  historyStore.loadHistory();
});

// Track loading lifecycle / 跟踪加载生命周期
watch(() => historyStore.loading, (loading: boolean) => {
  if (loading) {
    wasLoading.value = true;
  } else if (wasLoading.value) {
    hasLoadedHistory.value = true;
  }
});

// Watch content changes and save snapshot / 监听内容变化并保存快照
watch(
  [() => editorStore.markdown, () => themeStore.themeId, () => themeStore.customCSS, () => themeStore.themeName] as const,
  ([markdown, themeId, customCSS, themeName]) => {
    const markdownChanged = markdown !== prevMarkdown.value;
    prevMarkdown.value = markdown;

    if (isInitialMount.value) {
      isInitialMount.value = false;
      return;
    }

    // Check if current change matches content being restored / 检查当前变化是否与正在恢复的内容匹配
    if (restoringContent.value !== null && markdown === restoringContent.value) {
      restoringContent.value = null;
      return;
    }

    if (
      markdownChanged &&
      !isRestoring.value &&
      !historyStore.loading &&
      hasLoadedHistory.value
    ) {
      hasUserEdited.value = true;
    }

    if (creatingInitialSnapshot.value) return;

    if (historyStore.loading) return;

    if (!historyStore.activeId && historyStore.history.length === 0 && markdown.trim()) {
      creatingInitialSnapshot.value = true;
      historyStore.saveSnapshot(
        {
          markdown,
          theme: themeId,
          customCSS,
          title: deriveTitle(markdown),
          themeName,
        },
        { force: true }
      ).finally(() => {
        creatingInitialSnapshot.value = false;
      });
    }
  }
);

const persistLatestSnapshot = async () => {
  const markdown = editorStore.markdown;
  const themeId = themeStore.themeId;
  const customCSS = themeStore.customCSS;
  const themeName = themeStore.themeName;

  if (markdown.trim() === '') return;

  await historyStore.saveSnapshot({
    markdown,
    theme: themeId,
    customCSS,
    title: deriveTitle(markdown),
    themeName,
  });
};

// Periodic save / 定期保存
let autoSaveTimer: number | null = null;
onMounted(() => {
  autoSaveTimer = window.setInterval(() => {
    if (hasUserEdited.value && !historyStore.loading) {
      hasUserEdited.value = false;
      persistLatestSnapshot();
    }
  }, AUTO_SAVE_INTERVAL);
});

onUnmounted(() => {
  if (autoSaveTimer) clearInterval(autoSaveTimer);
});

defineExpose({
  persistLatestSnapshot,
});
</script>

<template>
  <!-- Logic-only component / 纯逻辑组件 -->
</template>
