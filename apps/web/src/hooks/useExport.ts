import { computed } from "vue";
import {
  generateExportHtml,
  downloadFile,
  createMarkdownParser,
  exportToPdfImage,
  exportToPdfNative,
} from "@wemd/core";
import { useEditorStore } from "../store/editorStore";
import { useThemeStore } from "../store/themeStore";
import { useUIThemeStore } from "../store/uiThemeStore";
import { useWindowControls } from "./useWindowControls";
import { toast } from "./useToast";
import { getLinkToFootnoteEnabled } from "../components/Editor/ToolbarState";
import { convertLinksToFootnotes } from "../utils/linkFootnote";

interface ElectronWindow extends Window {
  electron?: {
    fs?: {
      exportHtml?: (data: {
        content: string;
        title: string;
      }) => Promise<boolean>;
      exportPdf?: (data: {
        content: string;
        title: string;
      }) => Promise<boolean>;
    };
  };
}

export function useExport() {
  const editorStore = useEditorStore();
  const themeStore = useThemeStore();
  const uiThemeStore = useUIThemeStore();
  const { isElectron } = useWindowControls();
  const parser = createMarkdownParser();

  const documentTitle = computed(() => {
    const firstLine = editorStore.markdown.split("\n")[0];
    if (firstLine.startsWith("# ")) {
      return firstLine.replace("# ", "").trim();
    }
    return "WeMD Export";
  });

  const getExportContent = () => {
    const rawHtml = parser.render(editorStore.markdown);
    const contentHtml = getLinkToFootnoteEnabled()
      ? convertLinksToFootnotes(rawHtml)
      : rawHtml;
    return contentHtml;
  };

  const getExportContentWithTheme = () => {
    const isDarkMode = uiThemeStore.theme === "dark";
    const css = themeStore.getThemeCSS(themeStore.themeId, isDarkMode);
    const contentHtml = getExportContent();

    return generateExportHtml(contentHtml, {
      title: documentTitle.value,
      themeCss: css,
    });
  };

  const exportHtml = async () => {
    const isDarkMode = uiThemeStore.theme === "dark";
    const css = themeStore.getThemeCSS(themeStore.themeId, isDarkMode);
    const contentHtml = getExportContent();

    const fullHtml = generateExportHtml(contentHtml, {
      title: documentTitle.value,
      themeCss: css,
    });

    const electronWindow = window as ElectronWindow;
    if (isElectron && electronWindow.electron?.fs?.exportHtml) {
      const success = await electronWindow.electron.fs.exportHtml({
        content: fullHtml,
        title: documentTitle.value,
      });
      if (success) toast.success("导出 HTML 成功");
    } else {
      downloadFile(fullHtml, `${documentTitle.value}.html`, "text/html");
      toast.success("导出 HTML 成功");
    }
  };

  const exportPdf = async (mode: "image" | "vector" = "image") => {
    const fullHtml = getExportContentWithTheme();

    const electronWindow = window as ElectronWindow;
    if (isElectron && electronWindow.electron?.fs?.exportPdf) {
      try {
        const success = await electronWindow.electron.fs.exportPdf({
          content: fullHtml,
          title: documentTitle.value,
        });
        if (success) toast.success("导出 PDF 成功");
      } catch {
        toast.error("导出 PDF 失败");
      }
    } else {
      try {
        if (mode === "vector") {
          toast.info(
            "建议使用桌面客户端进行矢量导出，效果更佳且无需弹窗",
            5000,
          );
          toast.success("正在调用打印机...", 5000);
          setTimeout(() => {
            exportToPdfNative(fullHtml);
          }, 5000);
        } else {
          await exportToPdfImage(fullHtml, `${documentTitle.value}.pdf`);
          toast.success("导出 PDF (图片) 成功");
        }
      } catch {
        toast.error("导出 PDF 失败");
      }
    }
  };

  return {
    exportHtml,
    exportPdf,
  };
}
