import { defineStore } from "pinia";
import { ref } from "vue";
import { getDefaultMarkdown, isDefaultMarkdown } from "@mdb/core";
import { getCurrentLocale } from "../i18n";
import { resolveInitialLocale, type Locale } from "../utils/locale";
import { useThemeStore } from "./themeStore";
// import { createMarkdownParser } from "@mdb/core";
import { copyToEditor as execCopyToEditor } from "../services/wechatCopyService";

// const parser = createMarkdownParser();

export interface ResetOptions {
  markdown?: string;
  theme?: string;
  customCSS?: string;
  themeName?: string;
}

const initialLocale = resolveInitialLocale();
export const defaultMarkdown = getDefaultMarkdown(initialLocale);

export function getEditorDefaultMarkdown(locale?: Locale): string {
  return getDefaultMarkdown(locale ?? getCurrentLocale());
}

export const useEditorStore = defineStore("editor", () => {
  const markdown = ref(defaultMarkdown);
  // const html = computed(() => parser.render(markdown.value));
  const lastAutoSavedAt = ref<Date | null>(null);
  const isEditing = ref(false);
  const currentFilePath = ref<string | undefined>(undefined);
  const workspaceDir = ref<string | undefined>(undefined);
  const fixedWidthPreview = ref(true);
  const previewWidth = ref(430);
  const previewDevice = ref("custom");
  const previewWidthUnit = ref<"px" | "%">("px");
  const customPreviewWidth = ref("100%");
  const customPreviewHeight = ref("100%");
  const previewRotated = ref(false);
  const previewAutoScale = ref(true);
  const previewManualScale = ref(100);
  const syncScroll = ref(true);

  function setMarkdown(val: string) {
    markdown.value = val;
  }

  function setLastAutoSavedAt(time: Date | null) {
    lastAutoSavedAt.value = time;
  }

  function setIsEditing(editing: boolean) {
    isEditing.value = editing;
  }

  function setFilePath(path?: string) {
    currentFilePath.value = path;
  }

  function setWorkspaceDir(dir?: string) {
    workspaceDir.value = dir;
  }

  function syncMarkdownForLocale(locale: Locale) {
    if (isDefaultMarkdown(markdown.value)) {
      markdown.value = getDefaultMarkdown(locale);
    }
  }

  function resetDocument(options?: ResetOptions) {
    if (options?.markdown !== undefined) {
      markdown.value = options.markdown;
    } else {
      markdown.value = getEditorDefaultMarkdown();
    }

    // Reset theme (via themeStore) / 重置主题（通过 themeStore）
    const themeStore = useThemeStore();
    const targetTheme = options?.theme ?? "default";
    themeStore.selectTheme(targetTheme);
    if (options?.customCSS !== undefined) {
      themeStore.setCustomCSS(options.customCSS);
    } else {
      themeStore.setCustomCSS("");
    }
  }

  async function copyToEditor(css: string) {
    await execCopyToEditor(markdown.value, css);
  }

  function setFixedWidthPreview(value: boolean) {
    fixedWidthPreview.value = value;
  }

  function setPreviewWidth(width: number) {
    previewWidth.value = Math.max(200, Math.min(width, 1200));
  }

  function setPreviewDevice(device: string) {
    previewDevice.value = device;
  }

  function setCustomPreviewWidth(width: string) {
    customPreviewWidth.value = width;
  }

  function setCustomPreviewHeight(height: string) {
    customPreviewHeight.value = height;
  }

  function setPreviewRotated(rotated: boolean) {
    previewRotated.value = rotated;
  }

  function setPreviewAutoScale(autoScale: boolean) {
    previewAutoScale.value = autoScale;
  }

  function setPreviewManualScale(scale: number) {
    previewManualScale.value = Math.max(10, Math.min(scale, 200));
  }

  function setSyncScroll(enabled: boolean) {
    syncScroll.value = enabled;
  }

  return {
    markdown,
    lastAutoSavedAt,
    isEditing,
    currentFilePath,
    workspaceDir,
    fixedWidthPreview,
    previewWidth,
    previewDevice,
    previewWidthUnit,
    customPreviewWidth,
    customPreviewHeight,
    previewRotated,
    previewAutoScale,
    previewManualScale,
    syncScroll,
    setMarkdown,
    setLastAutoSavedAt,
    setIsEditing,
    setFilePath,
    setWorkspaceDir,
    setFixedWidthPreview,
    setPreviewWidth,
    setPreviewDevice,
    setCustomPreviewWidth,
    setCustomPreviewHeight,
    setPreviewRotated,
    setPreviewAutoScale,
    setPreviewManualScale,
    setSyncScroll,
    resetDocument,
    syncMarkdownForLocale,
    copyToEditor,
  };
});
