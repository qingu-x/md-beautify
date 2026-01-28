import { computed } from "vue";
import {
  generateExportHtml,
  downloadFile,
  createMarkdownParser,
  exportToPdfNative,
  processExportContent,
} from "@mdb/core";
import { useEditorStore } from "../store/editorStore";
import { useThemeStore } from "../store/themeStore";
import { useUIThemeStore } from "../store/uiThemeStore";
import { useFileStore } from "../store/fileStore";
import { useWindowControls } from "./useWindowControls";
import { toast } from "./useToast";
import { getLinkToFootnoteEnabled } from "../components/Editor/ToolbarState";
import { convertLinksToFootnotes } from "../utils/linkFootnote";
import { renderMermaidToImage } from "../utils/mermaidExport";
import { renderMathInElement, hasMathFormula } from "../utils/katexRenderer";

interface ElectronWindow extends Window {
  electron?: {
    isElectron: boolean;
    platform: string;
    update?: any;
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
  const fileStore = useFileStore();
  const { isElectron } = useWindowControls();
  const parser = createMarkdownParser();

  const documentTitle = computed(() => {
    if (fileStore.currentFile?.name) {
      return fileStore.currentFile.name.replace(/\.md$/, "");
    }

    const firstLine = editorStore.markdown.split("\n")[0];
    if (firstLine.startsWith("# ")) {
      return firstLine.replace("# ", "").trim();
    }
    return "MD Beautify Export";
  });

  const getExportContent = async () => {
    const rawHtml = parser.render(editorStore.markdown);
    const contentHtml = getLinkToFootnoteEnabled()
      ? convertLinksToFootnotes(rawHtml)
      : rawHtml;

    // 创建临时容器处理 Mermaid 和 KaTeX
    const tempContainer = document.createElement("div");
    tempContainer.innerHTML = contentHtml;
    tempContainer.style.position = "absolute";
    tempContainer.style.left = "-9999px";
    tempContainer.style.top = "-9999px";
    tempContainer.style.visibility = "hidden";
    document.body.appendChild(tempContainer);

    try {
      // 渲染 Mermaid 图表为图片
      const mermaidCount = tempContainer.querySelectorAll(
        ".mermaid, pre.language-mermaid, code.language-mermaid",
      ).length;
      if (mermaidCount > 0) {
        await renderMermaidToImage(tempContainer);
      }

      // 渲染 KaTeX 公式
      if (hasMathFormula(editorStore.markdown)) {
        renderMathInElement(tempContainer);
        // 等待 KaTeX 渲染完成（包括字体加载）
        await new Promise((resolve) => setTimeout(resolve, 200));
      }

      // 处理导出内容
      let processedHtml = tempContainer.innerHTML;
      processedHtml = processExportContent(processedHtml);

      return processedHtml;
    } finally {
      document.body.removeChild(tempContainer);
    }
  };

  const getExportContentWithTheme = async () => {
    const css = themeStore.getThemeCSS(themeStore.themeId, false);
    const contentHtml = await getExportContent();

    return generateExportHtml(contentHtml, {
      title: documentTitle.value,
      themeCss: css,
    });
  };

  const exportHtml = async () => {
    const css = themeStore.getThemeCSS(themeStore.themeId, false);
    const contentHtml = await getExportContent();

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

  const exportPdf = async () => {
    const prepareToastId = toast.info("正在准备导出...", 0);

    try {
      const fullHtml = await getExportContentWithTheme();
      toast.remove(prepareToastId);

      const electronWindow = window as ElectronWindow;
      if (isElectron && electronWindow.electron?.fs?.exportPdf) {
        try {
          const success = await electronWindow.electron.fs.exportPdf({
            content: fullHtml,
            title: documentTitle.value,
          });
          if (success) {
            toast.success("导出 PDF 成功");
          }
        } catch (err) {
          console.error("[Export PDF] Error:", err);
          toast.error("导出 PDF 失败");
        }
      } else {
        try {
          toast.info("正在调用打印机...", 3000);
          exportToPdfNative(fullHtml);
        } catch (err) {
          console.error("[Export PDF] Error:", err);
          toast.error("导出 PDF 失败");
        }
      }
    } catch (err) {
      console.error("[Export PDF] Prepare failed:", err);
      toast.remove(prepareToastId);
      toast.error("准备导出失败");
    }
  };

  return {
    exportHtml,
    exportPdf,
  };
}
