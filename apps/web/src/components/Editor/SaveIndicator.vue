<template>
  <span v-if="isSaving" class="save-indicator saving">{{ t('editor.status.saving') }}</span>
  <span v-else-if="isDirty" class="save-indicator unsaved">{{ t('editor.status.editing') }}</span>
  <span v-else-if="displayText" class="save-indicator saved">{{ displayText }}</span>
  <span v-else class="save-indicator ready">{{ t('editor.status.ready') }}</span>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted, watch } from 'vue';
import { useFileStore } from '../../store/fileStore';
import { useEditorStore } from '../../store/editorStore';
import { useI18n } from "../../i18n";

const { t } = useI18n();

/**
 * Format relative time / 格式化相对时间
 */
function formatRelativeTime(date: Date | null): string {
  if (!date) return "";

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);

  if (diffSec < 10) return t("editor.status.justNow");
  if (diffSec < 60) return t("editor.status.secondsAgo", { n: diffSec.toString() });
  if (diffMin < 60) return t("editor.status.minutesAgo", { n: diffMin.toString() });
  if (diffHour < 24) return t("editor.status.hoursAgo", { n: diffHour.toString() });

  // Show specific time if over 24 hours / 超过 24 小时显示具体时间
  const timeStr = `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  return t("editor.status.saveAt", { time: timeStr });
}

const fileStore = useFileStore();
const editorStore = useEditorStore();

const displayText = ref("");

// Check if in file system mode / 判断是否处于文件系统模式
const isFileMode = computed(() => !!fileStore.currentFile);

// Choose which status to use / 选择使用哪个状态
const lastSavedAt = computed(() => isFileMode.value ? fileStore.lastSavedAt : editorStore.lastAutoSavedAt);
const isDirty = computed(() => isFileMode.value ? fileStore.isDirty : editorStore.isEditing);
const isSaving = computed(() => isFileMode.value ? fileStore.isSaving : false);

let autoSaveTimer: ReturnType<typeof setTimeout> | null = null;
let relativeTimeTimer: ReturnType<typeof setInterval> | null = null;

// Non-file mode: mark as "saved" after 2 seconds of content change / 非文件模式：内容变化后 2 秒标记为"已保存"
watch(() => editorStore.markdown, () => {
  if (isFileMode.value) return;
  
  // Mark as editing / 标记为正在编辑
  editorStore.setIsEditing(true);

  if (autoSaveTimer) clearTimeout(autoSaveTimer);
  autoSaveTimer = setTimeout(() => {
    editorStore.setLastAutoSavedAt(new Date());
    // Mark as saved after 2 seconds / 2 秒后标记为保存完成
    editorStore.setIsEditing(false);
  }, 2000);
});

// Periodically refresh relative time display / 定时刷新相对时间显示
const updateRelativeTime = () => {
  displayText.value = formatRelativeTime(lastSavedAt.value);
};

watch(lastSavedAt, (newVal) => {
  if (!newVal) {
    displayText.value = "";
    if (relativeTimeTimer) {
      clearInterval(relativeTimeTimer);
      relativeTimeTimer = null;
    }
    return;
  }

  updateRelativeTime();
  if (!relativeTimeTimer) {
    relativeTimeTimer = setInterval(updateRelativeTime, 10000);
  }
}, { immediate: true });

onUnmounted(() => {
  if (autoSaveTimer) clearTimeout(autoSaveTimer);
  if (relativeTimeTimer) clearInterval(relativeTimeTimer);
});
</script>

<style scoped>
/* Reuse React version styles, usually defined in global CSS or parent component / 样式复用 React 版的，通常在全局 CSS 或父级组件中定义 */
.save-indicator {
  font-size: 12px;
  color: var(--text-secondary);
  transition: color 0.2s;
}

.save-indicator.saving {
  color: var(--accent-primary);
}

.save-indicator.unsaved {
  color: var(--warning);
}

.save-indicator.saved {
  color: var(--text-secondary);
}

.save-indicator.ready {
  color: var(--text-tertiary);
}
</style>
