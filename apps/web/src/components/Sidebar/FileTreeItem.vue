<template>
  <div class="fs-tree-item">
    <div
      :class="[
        'fs-item',
        !item.isDirectory && currentFile?.path === item.path ? 'active' : '',
        item.isDirectory ? 'is-folder' : ''
      ]"
      :style="{ 
        marginLeft: `${(item.level || 0) * 20 + 16}px`,
      }"
      @click="handleClick"
      @contextmenu.prevent="(e) => $emit('context-menu', e, item)"
    >
      <div class="fs-item-main">
        <template v-if="item.isDirectory">
          <div class="fs-folder-left">
            <button
              class="fs-folder-toggle"
              @click.stop="$emit('toggle-folder', item.path)"
            >
              <ChevronRight v-if="!isExpanded" :size="14" />
              <ChevronDown v-else :size="14" />
            </button>
            <Folder :size="14" class="fs-icon" />
            <div
              v-if="renamingPath === item.path"
              class="fs-rename"
              @click.stop
            >
              <input
                :value="renameValue"
                @input="$emit('update-rename', ($event.target as HTMLInputElement).value)"
                @keydown.enter="$emit('submit-rename')"
                @keydown.esc="$emit('cancel-rename')"
                v-focus
              />
              <div class="fs-rename-actions">
                <button @click="$emit('cancel-rename')">{{ t('sidebar.renameCancel') }}</button>
                <button @click="$emit('submit-rename')">{{ t('sidebar.renameConfirm') }}</button>
              </div>
            </div>
            <span v-else class="fs-title" :title="item.name">
              {{ item.name }}
            </span>
          </div>
          <button
            v-if="renamingPath !== item.path"
            class="fs-action-trigger"
            @click.stop="(e) => $emit('context-menu', e, item)"
          >
            <MoreHorizontal :size="16" />
          </button>
        </template>
        <template v-else>
          <template v-if="renamingPath === item.path">
            <div class="fs-rename" @click.stop>
              <input
                :value="renameValue"
                @input="$emit('update-rename', ($event.target as HTMLInputElement).value)"
                @keydown.enter="$emit('submit-rename')"
                @keydown.esc="$emit('cancel-rename')"
                v-focus
              />
              <div class="fs-rename-actions">
                <button @click="$emit('cancel-rename')">{{ t('sidebar.renameCancel') }}</button>
                <button @click="$emit('submit-rename')">{{ t('sidebar.renameConfirm') }}</button>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="fs-file-header">
              <span class="fs-timestamp">{{ formattedTime }}</span>
              <button
                class="fs-action-trigger"
                @click.stop="(e) => $emit('context-menu', e, item)"
              >
                <MoreHorizontal :size="16" />
              </button>
            </div>
            <div class="fs-file-content">
              <div class="fs-title" :title="item.name">{{ item.name }}</div>
              <div class="fs-theme-info">
                {{ currentFile?.path === item.path ? currentThemeName : (item.themeName || t('sidebar.defaultTheme')) }}
              </div>
            </div>
          </template>
        </template>
      </div>
    </div>

    <template v-if="item.isDirectory && isExpanded && item.children">
      <FileTreeItem
        v-for="child in item.children"
        :key="child.path"
        :item="child"
        :current-file="currentFile"
        :current-theme-name="currentThemeName"
        :expanded-folders="expandedFolders"
        :renaming-path="renamingPath"
        :rename-value="renameValue"
        @toggle-folder="$emit('toggle-folder', $event)"
        @open-file="$emit('open-file', $event)"
        @context-menu="$emit('context-menu', $event, child)"
        @update-rename="$emit('update-rename', $event)"
        @submit-rename="$emit('submit-rename')"
        @cancel-rename="$emit('cancel-rename')"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from "../../i18n";
import { ChevronRight, ChevronDown, Folder, FileText, MoreHorizontal } from 'lucide-vue-next';
import type { FileItem } from '../../store/fileTypes';

const props = defineProps<{
  item: FileItem;
  currentFile: FileItem | null;
  currentThemeName: string;
  expandedFolders: Set<string>;
  renamingPath: string | null;
  renameValue: string;
}>();

const emit = defineEmits<{
  (e: 'toggle-folder', path: string): void;
  (e: 'open-file', file: FileItem): void;
  (e: 'context-menu', event: MouseEvent, file: FileItem): void;
  (e: 'update-rename', value: string): void;
  (e: 'submit-rename'): void;
  (e: 'cancel-rename'): void;
}>();

const { t, locale } = useI18n();

const isExpanded = computed(() => props.expandedFolders.has(props.item.path));

const formattedTime = computed(() => {
  if (!props.item.updatedAt) return '';
  const date = new Date(props.item.updatedAt);
  const localeStr = locale.value === 'zh' ? 'zh-CN' : 'en-US';
  return date.toLocaleString(localeStr, {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true
  });
});

const handleClick = () => {
  if (props.item.isDirectory) {
    emit('toggle-folder', props.item.path);
  } else {
    emit('open-file', props.item);
  }
};

const vFocus = {
  mounted: (el: HTMLInputElement) => el.focus()
};
</script>

<style scoped>
.fs-tree-item {
  display: contents;
}

.fs-item {
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.fs-item.is-folder {
  display: flex;
  align-items: center;
  min-height: 40px;
  gap: 6px;
  padding: 8px;
  margin-right: 16px;
  border-radius: var(--radius-md);
  transition: background 0.15s ease;
}

.fs-item.is-folder:has(.fs-rename) {
  min-height: auto;
  padding: 10px 8px;
}

.fs-item.is-folder:hover {
  background: var(--bg-hover);
}

.fs-item.is-folder .fs-action-trigger {
  opacity: 0;
  visibility: hidden;
}

.fs-item.is-folder:hover .fs-action-trigger {
  opacity: 1;
  visibility: visible;
}

.fs-item:not(.is-folder) {
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  background: color-mix(in srgb, var(--bg-primary) 85%, transparent);
  padding: 16px;
  margin-top: 8px;
  margin-bottom: 8px;
  margin-right: 16px;
}

.fs-item:not(.is-folder):hover {
  transform: translateY(-2px);
  background: var(--bg-primary);
  box-shadow: var(--shadow-sm);
}

.fs-item:not(.is-folder).active {
  background: var(--bg-primary);
  border: var(--border-width) solid color-mix(in srgb, var(--accent-primary) 35%, transparent);
  box-shadow: var(--shadow-md);
}

.fs-item-main {
  display: flex;
  width: 100%;
}

.fs-item.is-folder .fs-item-main {
  align-items: center;
  justify-content: space-between;
}

.fs-item:not(.is-folder) .fs-item-main {
  flex-direction: column;
  gap: 8px;
}

.fs-item:not(.is-folder):has(.fs-rename) .fs-item-main {
  gap: 0;
}

.fs-folder-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  color: var(--text-tertiary);
  transition: all 0.15s ease;
  flex-shrink: 0;
}

.fs-folder-toggle:hover {
  color: var(--text-primary);
}

.fs-icon {
  color: var(--text-secondary);
  flex-shrink: 0;
  margin-right: 8px;
}

.fs-item.is-folder .fs-icon {
  color: var(--accent-primary);
  opacity: 0.8;
}

.fs-folder-left {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 6px;
}

.fs-title-block {
  flex: 1;
  min-width: 0;
}

.fs-file-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.fs-timestamp {
  font-size: 12px;
  color: var(--text-tertiary);
}

.fs-file-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.fs-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.5;
}

.fs-item.is-folder .fs-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-secondary);
}

.fs-theme-info {
  font-size: 11px;
  color: var(--accent-primary);
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.fs-action-trigger {
  border: none;
  width: 28px;
  height: 28px;
  border-radius: var(--radius-pill);
  background: transparent;
  color: var(--text-tertiary);
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.fs-action-trigger:hover {
  background: var(--bg-hover);
  color: var(--text-secondary);
  transform: scale(1.1);
}

.fs-item.is-folder .fs-rename {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 8px;
  flex: 1;
  min-width: 0;
}

.fs-item.is-folder .fs-rename input {
  width: 100%;
}

.fs-item.is-folder .fs-rename-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.fs-item:not(.is-folder) .fs-rename {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 8px;
  width: 100%;
}

.fs-item:not(.is-folder) .fs-rename-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.fs-rename input {
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  padding: 6px 12px;
  font-size: 14px;
  background: var(--bg-primary);
  min-width: 120px;
  flex: 1;
  color: var(--text-primary);
  outline: none;
}

.fs-rename input:focus {
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--accent-primary) 25%, transparent);
}

.fs-rename button {
  border: none;
  background: var(--bg-secondary);
  padding: 6px 12px;
  border-radius: var(--radius-pill);
  cursor: pointer;
  font-size: 13px;
  color: var(--text-primary);
  transition: background 0.2s;
  white-space: nowrap;
  flex-shrink: 0;
}

.fs-rename button:hover {
  background: var(--bg-hover);
  color: var(--accent-primary);
}
</style>
