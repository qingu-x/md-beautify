<template>
  <aside class="file-sidebar">
    <div class="fs-header">
      <div
        class="fs-workspace-info"
        @click="selectWorkspace"
        :title="workspacePath || '选择工作区'"
      >
        <FolderOpen :size="14" />
        <span>
          {{ workspacePath ? workspacePath.split("/").pop() : "选择工作区" }}
        </span>
      </div>
      <div class="fs-actions">
        <button
          class="fs-btn-secondary fs-btn-icon-only"
          @click="createFile"
          title="新建文章"
        >
          <Plus :size="16" />
        </button>
      </div>
    </div>

    <div class="fs-search">
      <div class="fs-search-wrapper">
        <Search :size="14" class="fs-search-icon" />
        <input
          type="text"
          placeholder="搜索文件..."
          v-model="filter"
        />
      </div>
    </div>

    <div class="fs-body">
      <div class="fs-list">
        <template v-for="item in visibleItems" :key="item.path">
          <FileTreeItem
            :item="item"
            :current-file="currentFile"
            :current-theme-name="currentThemeName"
            :expanded-folders="expandedFolders"
            :renaming-path="renamingPath"
            :rename-value="renameValue"
            @toggle-folder="toggleFolder"
            @open-file="openFile"
            @context-menu="handleContextMenu"
            @update-rename="renameValue = $event"
            @submit-rename="submitRename"
            @cancel-rename="renamingPath = null"
          />
        </template>

        <!-- 无限滚动触发器 -->
        <div v-if="hasMore" ref="loadMoreRef" class="fs-load-more">
          <span>加载更多...</span>
        </div>
        <div v-if="flattenedFiles.length === 0" class="fs-empty">暂无文件</div>
      </div>
    </div>

    <!-- Context Menu -->
    <Teleport to="body">
      <div v-if="menuOpen" class="fs-context-menu-overlay" @click="closeMenu">
        <div
          class="fs-context-menu"
          :style="{ top: menuPos.y + 'px', left: menuPos.x + 'px' }"
        >
          <button v-if="!menuTarget?.isDirectory" @click="copyTitleAction">
            <Copy :size="14" /> 复制标题
          </button>
          <button @click="startRenameAction">
            <Edit2 :size="14" /> 重命名
          </button>
          <button class="danger" @click="confirmDelete">
            <Trash2 :size="14" /> 删除
          </button>
        </div>
      </div>
    </Teleport>

    <!-- Delete Confirmation -->
    <Teleport to="body">
      <div v-if="deleteTarget" class="history-confirm-backdrop" @click="!deleting && (deleteTarget = null)">
        <div class="history-confirm-modal" @click.stop>
          <h4>删除{{ deleteTarget.isDirectory ? '文件夹' : '文件' }}</h4>
          <p>确定要删除"{{ deleteTarget.name }}"吗？{{ deleteTarget.isDirectory ? '文件夹内的所有文件也会被删除。' : '' }}此操作不可撤销。</p>
          <div class="history-confirm-actions">
            <button class="btn-secondary" @click="deleteTarget = null" :disabled="deleting">取消</button>
            <button class="btn-danger" @click="handleDelete" :disabled="deleting">
              {{ deleting ? '删除中...' : '确认删除' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useFileSystem } from "../../hooks/useFileSystem";
import { toast } from "../../hooks/useToast";
import { useThemeStore } from "../../store/themeStore";
import {
  Search,
  Plus,
  Trash2,
  FolderOpen,
  Edit2,
  MoreHorizontal,
  Copy,
  ChevronRight,
  ChevronDown,
  Folder,
  FileText,
} from "lucide-vue-next";
import type { FileItem } from "../../store/fileTypes";
import FileTreeItem from "./FileTreeItem.vue";

const PAGE_SIZE = 100;

const {
  files,
  currentFile,
  openFile,
  createFile,
  renameFile,
  deleteFile,
  selectWorkspace,
  workspacePath,
} = useFileSystem();

const themeStore = useThemeStore();
const currentThemeName = computed(() => themeStore.themeName);

const filter = ref("");
const renamingPath = ref<string | null>(null);
const renameValue = ref("");
const visibleCount = ref(PAGE_SIZE);
const loadMoreRef = ref<HTMLElement | null>(null);
const expandedFolders = ref<Set<string>>(new Set());

const menuOpen = ref(false);
const menuPos = ref({ x: 0, y: 0 });
const menuTarget = ref<FileItem | null>(null);
const deleteTarget = ref<FileItem | null>(null);
const deleting = ref(false);

// 扁平化文件列表（用于搜索）
const flattenedFiles = computed(() => {
  const flatten = (items: FileItem[]): FileItem[] => {
    return items.reduce((acc: FileItem[], item) => {
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
const filteredItems = computed(() => {
  if (!filter.value) return files.value;
  
  const searchLower = filter.value.toLowerCase();
  const matchedFiles = flattenedFiles.value.filter((f: FileItem) => 
    !f.isDirectory && f.name.toLowerCase().includes(searchLower)
  );
  
  // 如果有搜索，返回扁平列表
  return matchedFiles;
});

// 展开所有包含匹配文件的文件夹
watch(filter, (newFilter) => {
  if (newFilter) {
    // 搜索时展开所有文件夹
    const allFolders = flattenedFiles.value.filter(f => f.isDirectory).map(f => f.path);
    expandedFolders.value = new Set(allFolders);
  } else {
    // 清空搜索时保持当前展开状态
  }
});

// 可见的项（分页）
const visibleItems = computed(() => {
  return filteredItems.value.slice(0, visibleCount.value);
});

const hasMore = computed(() => {
  return visibleCount.value < filteredItems.value.length;
});

const loadMore = () => {
  if (hasMore.value) {
    visibleCount.value = Math.min(visibleCount.value + PAGE_SIZE, filteredItems.value.length);
  }
};

let observer: IntersectionObserver | null = null;

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && hasMore.value) {
        loadMore();
      }
    },
    { threshold: 0.1 }
  );

  watch(loadMoreRef, (el: HTMLElement | null) => {
    if (el) observer?.observe(el);
  }, { immediate: true });
});

onUnmounted(() => {
  observer?.disconnect();
});

watch(filter, () => {
  visibleCount.value = PAGE_SIZE;
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

const handleContextMenu = (e: MouseEvent, file: FileItem) => {
  menuTarget.value = file;
  menuPos.value = { x: e.clientX, y: e.clientY };
  menuOpen.value = true;
};

const closeMenu = () => {
  menuOpen.value = false;
  menuTarget.value = null;
};

const copyTitleAction = async () => {
  if (!menuTarget.value) return;
  try {
    const title = menuTarget.value.name.replace(".md", "");
    await navigator.clipboard.writeText(title);
    toast.success("标题已复制");
  } catch {
    toast.error("复制失败");
  }
  closeMenu();
};

const startRenameAction = () => {
  if (!menuTarget.value) return;
  renamingPath.value = menuTarget.value.path;
  renameValue.value = menuTarget.value.isDirectory 
    ? menuTarget.value.name 
    : menuTarget.value.name.replace(".md", "");
  closeMenu();
};

const submitRename = async () => {
  if (renamingPath.value && renameValue.value) {
    const file = flattenedFiles.value.find((f: FileItem) => f.path === renamingPath.value);
    if (file) {
      const newName = file.isDirectory ? renameValue.value : `${renameValue.value}.md`;
      const pathParts = file.path.split('/');
      pathParts[pathParts.length - 1] = newName;
      const newPath = pathParts.join('/');
      await renameFile(file.path, newPath);
    }
  }
  renamingPath.value = null;
};

const confirmDelete = () => {
  deleteTarget.value = menuTarget.value;
  closeMenu();
};

const handleDelete = async () => {
  if (!deleteTarget.value) return;
  deleting.value = true;
  try {
    await deleteFile(deleteTarget.value.path);
  } finally {
    deleting.value = false;
    deleteTarget.value = null;
  }
};

// Custom directive for auto-focus
const vFocus = {
  mounted: (el: HTMLInputElement) => el.focus()
};
</script>

<style scoped>
@import "./FileSidebar.css";
</style>
