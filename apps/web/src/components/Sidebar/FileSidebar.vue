<template>
  <aside class="file-sidebar">
    <div class="fs-header">
      <div
        class="fs-workspace-info"
        @click="selectWorkspace"
        :title="workspacePath || t('sidebar.selectWorkspace')"
      >
        <FolderOpen :size="14" />
        <span>
          {{ workspacePath ? workspacePath.split("/").pop() : t("sidebar.selectWorkspace") }}
        </span>
      </div>
      <div class="fs-actions">
        <button
          class="fs-btn-secondary fs-btn-icon-only"
          @click="createFile"
          :title="t('sidebar.newArticle')"
        >
          <FileText :size="16" />
        </button>
        <button
          class="fs-btn-secondary fs-btn-icon-only"
          @click="createFolder"
          :title="t('sidebar.newFolder')"
        >
          <FolderPlus :size="16" />
        </button>
      </div>
    </div>

    <div class="fs-search">
      <div class="fs-search-wrapper">
        <Search :size="14" class="fs-search-icon" />
        <input
          type="text"
          :placeholder="t('sidebar.searchPlaceholder')"
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

        <!-- Infinite Scroll Trigger / 无限滚动触发器 -->
        <div v-if="hasMore" ref="loadMoreRef" class="fs-load-more">
          <span>{{ t('sidebar.loadMore') }}</span>
        </div>
        <div v-if="flattenedFiles.length === 0" class="fs-empty">{{ t('sidebar.empty') }}</div>
      </div>
    </div>

    <!-- Context Menu / 上下文菜单 -->
    <Teleport to="body">
      <div v-if="menuOpen" class="fs-context-menu-overlay" @click="closeMenu">
        <div
          class="fs-context-menu"
          :style="{ top: menuPos.y + 'px', left: menuPos.x + 'px' }"
        >
          <template v-if="menuTarget?.isDirectory">
            <button @click="createFileInFolder">
              <FileText :size="14" /> {{ t('sidebar.newFile') }}
            </button>
            <button @click="createFolderInFolder">
              <FolderPlus :size="14" /> {{ t('sidebar.newFolder') }}
            </button>
            <div class="fs-menu-divider"></div>
          </template>
          <button v-if="!menuTarget?.isDirectory" @click="copyTitleAction">
            <Copy :size="14" /> {{ t('sidebar.copyTitle') }}
          </button>
          <button @click="startRenameAction">
            <Edit2 :size="14" /> {{ t('sidebar.rename') }}
          </button>
          <button class="danger" @click="confirmDelete">
            <Trash2 :size="14" /> {{ t('sidebar.delete') }}
          </button>
        </div>
      </div>
    </Teleport>

    <!-- Delete Confirmation / 删除确认 -->
    <Teleport to="body">
      <div v-if="deleteTarget" class="history-confirm-backdrop" @click="!deleting && (deleteTarget = null)">
        <div class="history-confirm-modal" @click.stop>
          <h4>{{ t('sidebar.deleteConfirmTitle', { type: deleteTarget.isDirectory ? t('sidebar.deleteFolder') : t('sidebar.deleteFile') }) }}</h4>
          <p>{{ t('sidebar.deleteConfirmText', { name: deleteTarget.name, extra: deleteTarget.isDirectory ? t('sidebar.deleteConfirmExtra') : '' }) }}</p>
          <div class="history-confirm-actions">
            <button class="btn-secondary" @click="deleteTarget = null" :disabled="deleting">{{ t('sidebar.cancel') }}</button>
            <button class="btn-danger" @click="handleDelete" :disabled="deleting">
              {{ deleting ? t('sidebar.deleting') : t('sidebar.confirmDelete') }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useI18n } from "../../i18n";
import { useFileSystem } from "../../hooks/useFileSystem";
import { toast } from "../../hooks/useToast";
import { useThemeStore } from "../../store/themeStore";
import { useStorageStore } from "../../store/storageStore";
import {
  Search,
  Trash2,
  FolderOpen,
  FolderPlus,
  Edit2,
  Copy,
  FileText,
} from "lucide-vue-next";
import type { FileItem } from "../../store/fileTypes";
import FileTreeItem from "./FileTreeItem.vue";

const PAGE_SIZE = 100;

const {
  files,
  currentFile,
  openFile,
  renameFile,
  deleteFile,
  selectWorkspace,
  workspacePath,
  refreshFiles,
} = useFileSystem();

const themeStore = useThemeStore();
const storageStore = useStorageStore();
const { t } = useI18n();
const currentThemeName = computed(() => themeStore.themeName);

const electron = (window as any).electron;

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

// Sort function: Folders first, then sort by name / 排序函数：文件夹优先，然后按名称排序
const sortFiles = (items: FileItem[]): FileItem[] => {
  return items.slice().sort((a, b) => {
    if (a.isDirectory && !b.isDirectory) return -1;
    if (!a.isDirectory && b.isDirectory) return 1;
    return a.name.localeCompare(b.name, 'zh-CN');
  }).map(item => {
    if (item.children && item.children.length > 0) {
      return { ...item, children: sortFiles(item.children) };
    }
    return item;
  });
};

// Flatten file list (for search) / 扁平化文件列表（用于搜索）
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

// Sorted file list / 排序后的文件列表
const sortedFiles = computed(() => {
  return sortFiles(files.value || []);
});

// Filtered file list / 过滤后的文件列表
const filteredItems = computed(() => {
  if (!filter.value) return sortedFiles.value;
  
  const searchLower = filter.value.toLowerCase();
  const matchedFiles = flattenedFiles.value.filter((f: FileItem) => 
    !f.isDirectory && f.name.toLowerCase().includes(searchLower)
  );
  
  // If searching, return flattened list / 如果有搜索，返回扁平列表
  return matchedFiles;
});

// Expand all folders containing matched files / 展开所有包含匹配文件的文件夹
watch(filter, (newFilter) => {
  if (newFilter) {
    // Expand all folders when searching / 搜索时展开所有文件夹
    const allFolders = flattenedFiles.value.filter(f => f.isDirectory).map(f => f.path);
    expandedFolders.value = new Set(allFolders);
  } else {
    // Keep current expansion state when clearing search / 清空搜索时保持当前展开状态
  }
});

// Visible items (pagination) / 可见的项（分页）
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
  // Trigger reactive update / 触发响应式更新
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
    toast.success(t("sidebar.copySuccess"));
  } catch {
    toast.error(t("sidebar.copyError"));
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

const createFile = async () => {
  const defaultName = t("sidebar.untitled");
  let fileName = defaultName;
  let counter = 1;
  const initialContent = `---\ntheme: default\nthemeName: ${t('sidebar.defaultTheme')}\n---\n\n# ${fileName}\n\n`;
  
  try {
    if (electron) {
      // Electron mode
      const res = await electron.fs.createFile({
        filename: `${fileName}.md`,
        content: initialContent,
      });
      
      if (res.success && res.filePath) {
        await refreshFiles();
        const newFile = flattenedFiles.value.find(f => f.path === res.filePath);
        if (newFile) {
          renamingPath.value = newFile.path;
          renameValue.value = fileName;
        }
      } else {
        toast.error(res.error || t("sidebar.createError"));
      }
    } else if (storageStore.adapter && storageStore.adapter.writeFile) {
      // Browser mode
      const checkFileExists = async (name: string) => {
        const fullPath = `${name}.md`;
        return await storageStore.adapter!.exists(fullPath);
      };
      
      while (await checkFileExists(fileName)) {
        fileName = `${defaultName} ${counter}`;
        counter++;
      }
      
      const filePath = `${fileName}.md`;
      await storageStore.adapter.writeFile(filePath, initialContent);
      await refreshFiles();
      
      const newFile = flattenedFiles.value.find(f => f.path === filePath);
      if (newFile) {
        renamingPath.value = newFile.path;
        renameValue.value = fileName;
      }
    } else {
      toast.error(t("sidebar.storageNotReady"));
    }
  } catch (error) {
    console.error(error);
    toast.error(t("sidebar.createError"));
  }
};

const createFolder = async () => {
  const defaultName = t("sidebar.newFolder");
  let folderName = defaultName;
  let counter = 1;
  
  const checkFolderExists = (name: string) => {
    return flattenedFiles.value.some(f => f.isDirectory && f.name === name);
  };
  
  while (checkFolderExists(folderName)) {
    folderName = `${defaultName} ${counter}`;
    counter++;
  }
  
  try {
    if (electron) {
      // Electron mode: Create placeholder file / Electron mode: 创建占位文件
      const initialPath = `${folderName}/.gitkeep`;
      
      const res = await electron.fs.createFile({
        filename: initialPath,
        content: '',
      });
      
      if (res.success) {
        await refreshFiles();
        const newFolder = flattenedFiles.value.find(f => f.isDirectory && f.name === folderName);
        
        if (newFolder) {
          renamingPath.value = newFolder.path;
          renameValue.value = folderName;
        }
      } else {
        toast.error(res.error || t("sidebar.createError"));
      }
    } else if (storageStore.adapter && storageStore.adapter.writeFile) {
      // Browser mode / 浏览器模式
      const initialPath = `${folderName}/.gitkeep`;
      await storageStore.adapter.writeFile(initialPath, '');
      await refreshFiles();
      
      const newFolder = flattenedFiles.value.find(f => f.isDirectory && f.name === folderName);
      if (newFolder) {
        renamingPath.value = newFolder.path;
        renameValue.value = folderName;
      }
    } else {
      toast.error(t("sidebar.folderNotSupported"));
    }
  } catch (error) {
    console.error(error);
    toast.error(t("sidebar.createError"));
  }
};

const createFileInFolder = async () => {
  if (!menuTarget.value?.isDirectory) return;
  const targetFolder = menuTarget.value;
  closeMenu();
  
  const defaultName = t("sidebar.untitled");
  let fileName = defaultName;
  let counter = 1;
  const initialContent = `---\ntheme: default\nthemeName: ${t('sidebar.defaultTheme')}\n---\n\n# ${fileName}\n\n`;
  
  try {
    if (electron) {
      // Electron mode: Use relative path / Electron mode: 使用相对路径
      let relativePath = '';
      if (workspacePath.value) {
        // Remove workspacePath, keep only relative part / 移除 workspacePath，只保留相对部分
        const workspaceWithSep = workspacePath.value.replace(/[\/\\]$/, ''); // Remove trailing separator / 移除末尾的分隔符
        if (targetFolder.path.startsWith(workspaceWithSep)) {
          relativePath = targetFolder.path.substring(workspaceWithSep.length).replace(/^[\/\\]/, '');
        }
      }
      
      const fileNameWithPath = relativePath ? `${relativePath}/${fileName}.md` : `${fileName}.md`;
      
      const res = await electron.fs.createFile({
        filename: fileNameWithPath,
        content: initialContent,
      });
      
      if (res.success && res.filePath) {
        await refreshFiles();
        expandedFolders.value.add(targetFolder.path);
        expandedFolders.value = new Set(expandedFolders.value);
        
        const newFile = flattenedFiles.value.find(f => f.path === res.filePath);
        if (newFile) {
          renamingPath.value = newFile.path;
          renameValue.value = fileName;
        }
      }
    } else if (storageStore.adapter && storageStore.adapter.writeFile) {
      // Browser mode
      const folderPath = targetFolder.path.endsWith('/') ? targetFolder.path : `${targetFolder.path}/`;
      
      const checkFileExists = async (name: string) => {
        const fullPath = `${folderPath}${name}.md`;
        return await storageStore.adapter!.exists(fullPath);
      };
      
      while (await checkFileExists(fileName)) {
        fileName = `${defaultName} ${counter}`;
        counter++;
      }
      
      const filePath = `${folderPath}${fileName}.md`;
      await storageStore.adapter.writeFile(filePath, initialContent);
      await refreshFiles();
      expandedFolders.value.add(targetFolder.path);
      expandedFolders.value = new Set(expandedFolders.value);
      
      const newFile = flattenedFiles.value.find(f => f.path === filePath);
      if (newFile) {
        renamingPath.value = newFile.path;
        renameValue.value = fileName;
      }
    } else {
      toast.error(t("sidebar.createError"));
    }
  } catch (error) {
    console.error(error);
    toast.error(t("sidebar.createError"));
  }
};

const createFolderInFolder = async () => {
  if (!menuTarget.value?.isDirectory) return;
  const targetFolder = menuTarget.value;
  closeMenu();
  
  const defaultName = t("sidebar.newFolder");
  let folderName = defaultName;
  let counter = 1;
  
  const parentPath = targetFolder.path.endsWith('/') ? targetFolder.path : `${targetFolder.path}/`;
  
  const checkFolderExists = (name: string) => {
    const expectedPath = `${parentPath}${name}`;
    return flattenedFiles.value.some(f => f.isDirectory && f.path === expectedPath);
  };
  
  while (checkFolderExists(folderName)) {
    folderName = `${defaultName} ${counter}`;
    counter++;
  }
  
  try {
    if (electron) {
      // Electron mode: Use relative path / Electron mode: 使用相对路径
      let relativePath = '';
      if (workspacePath.value) {
        const workspaceWithSep = workspacePath.value.replace(/[\/\\]$/, '');
        if (targetFolder.path.startsWith(workspaceWithSep)) {
          relativePath = targetFolder.path.substring(workspaceWithSep.length).replace(/^[\/\\]/, '');
        }
      }
      
      const newFolderPath = relativePath ? `${relativePath}/${folderName}/.gitkeep` : `${folderName}/.gitkeep`;
      
      const res = await electron.fs.createFile({
        filename: newFolderPath,
        content: '',
      });
      
      if (res.success) {
        await refreshFiles();
        expandedFolders.value.add(targetFolder.path);
        const newPath = `${parentPath}${folderName}`;
        expandedFolders.value.add(newPath);
        expandedFolders.value = new Set(expandedFolders.value);
        
        const newFolder = flattenedFiles.value.find(f => f.isDirectory && f.path === newPath);
        if (newFolder) {
          renamingPath.value = newFolder.path;
          renameValue.value = folderName;
        }
      }
    } else if (storageStore.adapter && storageStore.adapter.writeFile) {
      // Browser mode
      const newFolderPath = `${parentPath}${folderName}/.gitkeep`;
      await storageStore.adapter.writeFile(newFolderPath, '');
      await refreshFiles();
      expandedFolders.value.add(targetFolder.path);
      const newPath = `${parentPath}${folderName}`;
      expandedFolders.value.add(newPath);
      expandedFolders.value = new Set(expandedFolders.value);
      
      const newFolder = flattenedFiles.value.find(f => f.isDirectory && f.path === newPath);
      if (newFolder) {
        renamingPath.value = newFolder.path;
        renameValue.value = folderName;
      }
    } else {
      toast.error(t("sidebar.createError"));
    }
  } catch (error) {
    console.error(error);
    toast.error(t("sidebar.createError"));
  }
};

</script>

<style scoped>
@import "./FileSidebar.css";
</style>
