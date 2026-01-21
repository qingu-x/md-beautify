<template>
  <aside class="history-sidebar">
    <div class="history-header">
      <h3>文件列表</h3>
      <div class="history-actions">
        <button class="btn-secondary btn-icon-only" @click="handleCreate" data-tooltip="新建文章">
          <Plus :size="16" />
        </button>
        <button class="btn-secondary btn-icon-only" @click="handleSave" :disabled="!activePath || saving" data-tooltip="保存当前">
          <Save :size="16" />
        </button>
      </div>
    </div>
    
    <div class="history-search">
      <div class="search-wrapper">
        <Search :size="14" class="search-icon" />
        <input
          type="text"
          placeholder="搜索文件..."
          v-model="searchFilter"
        />
      </div>
    </div>

    <div class="history-body">
      <div v-if="loading" class="history-empty">正在加载...</div>
      <div v-else-if="visibleFiles.length === 0" class="history-empty">
        {{ searchFilter ? '无匹配结果' : '暂无文件' }}
      </div>
      <div v-else class="history-list">
        <template v-for="item in visibleFiles" :key="item.path">
          <FileSystemTreeItem
            :item="item"
            :active-path="activePath"
            :expanded-folders="expandedFolders"
            :renaming-path="renamingPath"
            :rename-value="renameValue"
            @toggle-folder="toggleFolder"
            @open-file="handleOpen"
            @context-menu="handleMenuToggle"
            @update-rename="renameValue = $event"
            @submit-rename="submitRename"
            @cancel-rename="renamingPath = null"
          />
        </template>
      </div>
    </div>
  </aside>

  <!-- Action Menu Portal -->
  <Teleport to="body">
    <div
      v-if="actionMenuId && menuFile"
      class="history-action-menu"
      :style="{ top: menuPosition.top + 'px', left: menuPosition.left + 'px' }"
      @click.stop
    >
      <button v-if="!menuFile.isDirectory" @click="copyTitle(menuFile); closeActionMenu()">
        <Copy :size="14" />
        复制标题
      </button>
      <button @click="startRename(menuFile); closeActionMenu()">
        <Edit2 :size="14" />
        重命名
      </button>
      <button class="danger" @click="deleteTarget = menuFile; closeActionMenu()">
        <Trash2 :size="14" />
        删除
      </button>
    </div>
  </Teleport>

  <!-- Delete Confirm Portal -->
  <Teleport to="body">
    <div v-if="deleteTarget" class="history-confirm-backdrop" @click="!deleting && (deleteTarget = null)">
      <div class="history-confirm-modal" @click.stop>
        <h4>删除{{ deleteTarget.isDirectory ? '文件夹' : '文件' }}</h4>
        <p>确定要删除"{{ deleteTarget.name }}"吗？{{ deleteTarget.isDirectory ? '文件夹内的所有文件也会被删除。' : '' }}此操作不可撤销。</p>
        <div class="history-confirm-actions">
          <button class="btn-secondary" @click="deleteTarget = null" :disabled="deleting">
            取消
          </button>
          <button
            class="btn-danger"
            @click="handleDeleteConfirm"
            :disabled="deleting"
          >
            {{ deleting ? '删除中...' : '确认删除' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { Plus, Save, MoreHorizontal, Copy, Edit2, Trash2, Search, Folder, FileText, ChevronRight, ChevronDown } from 'lucide-vue-next';
import { useEditorStore } from '../../store/editorStore';
import { useThemeStore } from '../../store/themeStore';
import { toast } from '../../hooks/useToast';
import type { StorageAdapter } from '../../storage/StorageAdapter';
import type { FileItem as StorageFileItem } from '../../storage/types';
import FileSystemTreeItem from './FileSystemTreeItem.vue';

const props = defineProps<{
  adapter: StorageAdapter;
}>();

const editorStore = useEditorStore();
const themeStore = useThemeStore();

const files = ref<StorageFileItem[]>([]);
const loading = ref(true);
const activePath = ref<string | null>(null);
const renamingPath = ref<string | null>(null);
const renameValue = ref('');
const saving = ref(false);
const deleteTarget = ref<StorageFileItem | null>(null);
const deleting = ref(false);
const searchFilter = ref('');
const expandedFolders = ref<Set<string>>(new Set());

const actionMenuId = ref<string | null>(null);
const menuFile = ref<StorageFileItem | null>(null);
const menuPosition = ref({ top: 0, left: 0 });

const defaultFsContent = `---
theme: default
themeName: 默认主题
---

# 新文章

`;

// 扁平化文件列表（用于搜索）
const flattenedFiles = computed(() => {
  const flatten = (items: StorageFileItem[]): StorageFileItem[] => {
    return items.reduce((acc: StorageFileItem[], item) => {
      acc.push(item);
      if (item.children) {
        acc.push(...flatten(item.children));
      }
      return acc;
    }, []);
  };
  return flatten(files.value || []);
});

// 过滤后的文件列表
const visibleFiles = computed(() => {
  if (!searchFilter.value) return files.value;
  
  const searchLower = searchFilter.value.toLowerCase();
  const matchedFiles = flattenedFiles.value.filter((f: StorageFileItem) => 
    !f.isDirectory && f.name.toLowerCase().includes(searchLower)
  );
  
  // 如果有搜索，返回扁平列表
  return matchedFiles;
});

// 展开所有包含匹配文件的文件夹
watch(searchFilter, (newFilter) => {
  if (newFilter) {
    // 搜索时展开所有文件夹
    const allFolders = flattenedFiles.value.filter(f => f.isDirectory).map(f => f.path);
    expandedFolders.value = new Set(allFolders);
  }
});

const toggleFolder = (path: string) => {
  if (expandedFolders.value.has(path)) {
    expandedFolders.value.delete(path);
  } else {
    expandedFolders.value.add(path);
  }
  // 触发响应式更新
  expandedFolders.value = new Set(expandedFolders.value);
};

const parseFsFrontmatter = (content: string) => {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) {
    return {
      body: content,
      theme: 'default',
      themeName: '默认主题',
    };
  }
  const raw = match[1];
  const body = content.slice(match[0].length).trimStart();
  const theme = raw.match(/theme:\s*(.+)/)?.[1]?.trim() ?? 'default';
  const themeName = raw.match(/themeName:\s*(.+)/)?.[1]?.trim()?.replace(/^['"]|['"]$/g, '') ?? '默认主题';
  return { body, theme, themeName };
};

const refreshFiles = async () => {
  loading.value = true;
  try {
    const list = await props.adapter.listFiles();
    files.value = list;
    if (activePath.value && !flattenedFiles.value.find((item: StorageFileItem) => item.path === activePath.value)) {
      activePath.value = null;
    }
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const handleOpen = async (file: StorageFileItem) => {
  if (file.isDirectory) {
    toggleFolder(file.path);
    return;
  }
  
  try {
    const content = await props.adapter.readFile(file.path);
    const parsed = parseFsFrontmatter(content);
    editorStore.setMarkdown(parsed.body);
    themeStore.selectTheme(parsed.theme);
    themeStore.setCustomCSS('');
    editorStore.setFilePath(file.path);
    activePath.value = file.path;
  } catch (error) {
    console.error(error);
    toast.error('打开文件失败');
  }
};

const handleCreate = async () => {
  try {
    const fileName = `文稿-${Date.now()}.md`;
    await props.adapter.writeFile(fileName, defaultFsContent);
    await refreshFiles();
    await handleOpen({ path: fileName, name: fileName, isDirectory: false } as StorageFileItem);
    toast.success('已创建新文章');
  } catch (error) {
    console.error(error);
    toast.error('创建失败');
  }
};

const handleSave = async () => {
  if (!activePath.value) return;
  try {
    saving.value = true;
    const frontmatter = `---
theme: ${themeStore.themeId}
themeName: ${themeStore.themeName}
---
`;
    await props.adapter.writeFile(activePath.value, `${frontmatter}\n${editorStore.markdown}`);
    await refreshFiles();
    toast.success('保存成功');
  } catch (error) {
    console.error(error);
    toast.error('保存失败');
  } finally {
    saving.value = false;
  }
};

const handleMenuToggle = (event: MouseEvent, file: StorageFileItem) => {
  const button = event.currentTarget as HTMLElement;
  const rect = button.getBoundingClientRect();
  const width = 180;
  const padding = 12;
  const maxLeft = window.innerWidth - width - padding;
  const minLeft = padding;
  const desiredLeft = rect.right - width;
  const left = Math.max(minLeft, Math.min(maxLeft, desiredLeft));
  const top = rect.bottom + 8;

  if (actionMenuId.value === file.path) {
    closeActionMenu();
    return;
  }

  actionMenuId.value = file.path;
  menuFile.value = file;
  menuPosition.value = { top, left };
};

const closeActionMenu = () => {
  actionMenuId.value = null;
  menuFile.value = null;
};

const copyTitle = async (file: StorageFileItem) => {
  try {
    await navigator.clipboard.writeText(file.name.replace('.md', ''));
    toast.success('标题已复制');
  } catch (error) {
    console.error(error);
    toast.error('复制失败');
  }
};

const startRename = (file: StorageFileItem) => {
  renamingPath.value = file.path;
  renameValue.value = file.isDirectory ? file.name : file.name.replace('.md', '');
  actionMenuId.value = null;
  menuFile.value = null;
};

const submitRename = async () => {
  if (!renamingPath.value || !renameValue.value.trim()) return;
  
  const file = flattenedFiles.value.find(f => f.path === renamingPath.value);
  if (!file) return;

  const newName = file.isDirectory 
    ? renameValue.value.trim() 
    : (renameValue.value.trim().endsWith('.md') ? renameValue.value.trim() : `${renameValue.value.trim()}.md`);
  
  const pathParts = file.path.split('/');
  pathParts[pathParts.length - 1] = newName;
  const newPath = pathParts.join('/');

  try {
    await props.adapter.renameFile(renamingPath.value, newPath);
    if (activePath.value === renamingPath.value) {
      activePath.value = newPath;
      editorStore.setFilePath(newPath);
    }
    renamingPath.value = null;
    renameValue.value = '';
    await refreshFiles();
    toast.success('重命名成功');
  } catch (error) {
    console.error(error);
    toast.error('重命名失败');
  }
};

const handleDeleteConfirm = async () => {
  if (!deleteTarget.value) return;
  deleting.value = true;
  try {
    await props.adapter.deleteFile(deleteTarget.value.path);
    if (activePath.value === deleteTarget.value.path) {
      activePath.value = null;
      editorStore.setFilePath(undefined);
      editorStore.setMarkdown('');
    }
    await refreshFiles();
    toast.success('删除成功');
  } catch (error) {
    console.error(error);
    toast.error('删除失败');
  } finally {
    deleting.value = false;
    deleteTarget.value = null;
  }
};

onMounted(() => {
  refreshFiles();
  const handleWindowClick = () => closeActionMenu();
  const handleWindowScroll = () => closeActionMenu();
  window.addEventListener('click', handleWindowClick);
  window.addEventListener('scroll', handleWindowScroll, true);

  onUnmounted(() => {
    window.removeEventListener('click', handleWindowClick);
    window.removeEventListener('scroll', handleWindowScroll, true);
  });
});

const vFocus = {
  mounted: (el: HTMLInputElement) => el.focus()
};
</script>

<style scoped>
@import "./HistoryPanel.css";
</style>
