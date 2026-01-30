<template>
  <div class="fs-tree-item">
    <div
      :class="[
        'history-item',
        !item.isDirectory && activePath === item.path ? 'active' : '',
        item.isDirectory ? 'is-folder' : ''
      ]"
      :style="{ paddingLeft: `${((item.level || 0) * 16) + 12}px` }"
      @click="handleClick"
      @contextmenu.prevent="(e) => $emit('context-menu', e, item)"
    >
      <div class="history-item-main">
        <!-- Folder toggle icon / 文件夹折叠图标 -->
        <button
          v-if="item.isDirectory"
          class="fs-folder-toggle"
          @click.stop="$emit('toggle-folder', item.path)"
        >
          <ChevronRight v-if="!isExpanded" :size="14" />
          <ChevronDown v-else :size="14" />
        </button>

        <!-- File/Folder icon / 文件/文件夹图标 -->
        <Folder v-if="item.isDirectory" :size="14" class="fs-icon" />
        <FileText v-else :size="14" class="fs-icon" />

        <div class="history-title-block">
          <div
            v-if="renamingPath === item.path"
            class="history-rename"
            @click.stop
          >
            <input
              :value="renameValue"
              @input="$emit('update-rename', ($event.target as HTMLInputElement).value)"
              @keydown.enter="$emit('submit-rename')"
              @keydown.esc="$emit('cancel-rename')"
              v-focus
            />
            <button @click="$emit('submit-rename')">{{ t('common.confirm') }}</button>
            <button @click="$emit('cancel-rename')">{{ t('common.cancel') }}</button>
          </div>
          <template v-else>
            <span v-if="!item.isDirectory" class="history-time">
              {{ item.updatedAt ? new Date(item.updatedAt).toLocaleString() : '' }}
            </span>
            <span class="history-title" :title="item.name">
              {{ item.name }}
            </span>
          </template>
        </div>
        
        <div v-if="renamingPath !== item.path" class="history-actions-menu-wrapper">
          <button
            class="history-action-trigger"
            @click.stop="(e) => $emit('context-menu', e, item)"
          >
            <MoreHorizontal :size="16" />
          </button>
        </div>
      </div>
    </div>

    <!-- Recursively render children / 递归渲染子项 -->
    <template v-if="item.isDirectory && isExpanded && item.children">
      <FileSystemTreeItem
        v-for="child in item.children"
        :key="child.path"
        :item="child"
        :active-path="activePath"
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
import { ChevronRight, ChevronDown, Folder, FileText, MoreHorizontal } from 'lucide-vue-next';
import { useI18n } from '../../i18n';
import type { FileItem as StorageFileItem } from '../../storage/types';

const { t } = useI18n();

const props = defineProps<{
  item: StorageFileItem;
  activePath: string | null;
  expandedFolders: Set<string>;
  renamingPath: string | null;
  renameValue: string;
}>();

const emit = defineEmits<{
  (e: 'toggle-folder', path: string): void;
  (e: 'open-file', file: StorageFileItem): void;
  (e: 'context-menu', event: MouseEvent, file: StorageFileItem): void;
  (e: 'update-rename', value: string): void;
  (e: 'submit-rename'): void;
  (e: 'cancel-rename'): void;
}>();

const isExpanded = computed(() => props.expandedFolders.has(props.item.path));

const handleClick = () => {
  emit('open-file', props.item);
};

// Custom directive for auto-focus / 自定义自动聚焦指令
const vFocus = {
  mounted: (el: HTMLInputElement) => el.focus()
};
</script>

<style scoped>
.fs-tree-item {
  display: contents;
}

.fs-folder-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  color: var(--text-tertiary);
  transition: transform 0.2s ease;
  flex-shrink: 0;
  margin-right: 4px;
}

.fs-folder-toggle:hover {
  color: var(--text-primary);
  background: var(--bg-hover);
  border-radius: var(--radius-sm);
}

.fs-icon {
  color: var(--text-secondary);
  flex-shrink: 0;
  margin-right: 6px;
}

.history-item.is-folder {
  font-weight: 500;
}

.history-item.is-folder .fs-icon {
  color: var(--accent-primary);
}

.history-item.is-folder .history-title {
  font-weight: 500;
}
</style>
