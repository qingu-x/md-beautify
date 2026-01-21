<template>
  <div class="fs-tree-item">
    <div
      :class="[
        'fs-item',
        !item.isDirectory && currentFile?.path === item.path ? 'active' : '',
        item.isDirectory ? 'is-folder' : ''
      ]"
      :style="{ paddingLeft: `${(item.level || 0) * 16 + 8}px` }"
      @click="handleClick"
      @contextmenu.prevent="(e) => $emit('context-menu', e, item)"
    >
      <div class="fs-item-main">
        <!-- 文件夹折叠图标 -->
        <button
          v-if="item.isDirectory"
          class="fs-folder-toggle"
          @click.stop="$emit('toggle-folder', item.path)"
        >
          <ChevronRight v-if="!isExpanded" :size="14" />
          <ChevronDown v-else :size="14" />
        </button>

        <!-- 文件/文件夹图标 -->
        <Folder v-if="item.isDirectory" :size="14" class="fs-icon" />
        <FileText v-else :size="14" class="fs-icon" />

        <div class="fs-title-block">
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
            <button @click="$emit('submit-rename')">确认</button>
            <button @click="$emit('cancel-rename')">取消</button>
          </div>
          <template v-else>
            <span class="fs-title" :title="item.name">
              {{ item.name }}
            </span>
            <span v-if="!item.isDirectory && renamingPath !== item.path" class="fs-theme-info">
              {{ currentFile?.path === item.path ? currentThemeName : (item.themeName || "默认主题") }}
            </span>
          </template>
        </div>
        <button
          v-if="renamingPath !== item.path"
          class="fs-action-trigger"
          @click.stop="(e) => $emit('context-menu', e, item)"
        >
          <MoreHorizontal :size="16" />
        </button>
      </div>
    </div>

    <!-- 递归渲染子项 -->
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

const isExpanded = computed(() => props.expandedFolders.has(props.item.path));

const handleClick = () => {
  if (props.item.isDirectory) {
    emit('toggle-folder', props.item.path);
  } else {
    emit('open-file', props.item);
  }
};

// Custom directive for auto-focus
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

.fs-item.is-folder {
  font-weight: 500;
}

.fs-item.is-folder .fs-icon {
  color: var(--accent-primary);
}
</style>
