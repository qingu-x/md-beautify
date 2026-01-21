import { processHtml } from "./ThemeProcessor";
// @ts-expect-error - html2pdf.js lacks TypeScript definitions
import html2pdf from "html2pdf.js";

export interface ExportOptions {
  title?: string;
  themeCss: string;
  extraCss?: string;
}

/**
 * 将 HTML 中的 checkbox 转换为 emoji
 * 许多 HTML 查看器对 input 标签支持 not well, 转为 emoji 替代
 */
const convertCheckboxesToEmoji = (html: string): string => {
  // 先替换选中的 checkbox（包含 checked 属性）
  let result = html.replace(/<input[^>]*checked[^>]*>/gi, "✅&nbsp;");
  // 再替换未选中的 checkbox
  result = result.replace(
    /<input[^>]*type=["']checkbox["'][^>]*>/gi,
    "⬜&nbsp;",
  );
  return result;
};

/**
 * 生成用于导出的完整 HTML 文档
 */
export const generateExportHtml = (
  contentHtml: string,
  options: ExportOptions,
): string => {
  const { title = "WeMD Export", themeCss, extraCss = "" } = options;

  // 使用 processHtml 处理内联样式
  // 导出时，我们希望尽可能内联所有样式以保证在离线环境下也能正常显示
  let styledHtml = "";
  try {
    styledHtml = processHtml(contentHtml, themeCss, true, true);
  } catch (e) {
    console.error("Export processHtml failed:", e);
  }

  // 兜底逻辑：如果 styledHtml 为空，则直接使用 contentHtml 并包裹在 wemd 容器中
  if (!styledHtml || styledHtml.trim() === "") {
    styledHtml = `<section id="wemd">${contentHtml}</section>`;
  }

  // 转换 checkbox 为 emoji
  styledHtml = convertCheckboxesToEmoji(styledHtml);

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #fff;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
    }
    #wemd-export-container {
      max-width: 900px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    @page {
      size: auto;
      margin: 0; /* 设为 0 以强制隐藏 Edge/Chrome 的默认页眉页脚 */
    }
    @media print {
      html, body {
        overflow: visible !important;
        height: auto !important;
        margin: 0 !important;
        padding: 0 !important;
      }
      /* 使用 table 模拟每一页的上下边距 */
      .print-table {
        display: table;
        width: 100%;
        border-collapse: collapse;
      }
      .print-header-space, .print-footer-space {
        display: table-header-group; /* 每一页顶部重复 */
        height: 15mm;
      }
      .print-footer-space {
        display: table-footer-group; /* 每一页底部重复 */
      }
      .print-content-cell {
        padding: 0 15mm; /* 这里控制左右间距 */
      }
      body {
        background-color: transparent !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      #wemd-export-container {
        max-width: 100%;
        margin: 0;
        padding: 0;
      }
      /* 内容按块分页，避免跨页拆分 */
      #wemd p, 
      #wemd li, 
      #wemd img, 
      #wemd figure,
      #wemd pre, 
      #wemd blockquote, 
      #wemd .callout, 
      #wemd table,
      #wemd h1, #wemd h2, #wemd h3, #wemd h4, #wemd h5, #wemd h6 {
        break-inside: avoid;
        page-break-inside: avoid;
      }
      /* 标题后避免分页，确保标题与其内容在同一页 */
      #wemd h1, #wemd h2, #wemd h3, #wemd h4, #wemd h5, #wemd h6 {
        break-after: avoid;
        page-break-after: avoid;
      }
      /* 修复打印时文字颜色透明的问题（通常是由于 background-clip: text 引起） */
      #wemd h1 .content,
      #wemd strong,
      #wemd .callout-title {
        -webkit-background-clip: initial !important;
        background-clip: initial !important;
        background-image: none !important;
        color: inherit !important;
      }
      /* 针对不同主题的特殊修复 */
      #wemd .callout-title {
        color: #333 !important;
      }
      /* 确保 callout 内的内容可见 */
      #wemd .callout p, 
      #wemd .callout section,
      #wemd .callout li {
        color: #444 !important;
      }
      /* 确保背景色能够打印出来 */
      #wemd .callout {
        background-color: #f8fafc !important;
        background-image: none !important;
      }
      /* 隐藏可能遮挡文字的装饰性伪元素 */
      #wemd .callout::after,
      #wemd .callout::before {
        display: none !important;
      }
      /* 打印时隐藏不必要的元素 */
      .no-print {
        display: none !important;
      }
    }
    ${extraCss}
  </style>
</head>
<body>
  <table class="print-table">
    <thead><tr><td><div class="print-header-space"></div></td></tr></thead>
    <tbody>
      <tr>
        <td class="print-content-cell">
          <div id="wemd-export-container">
            ${styledHtml}
          </div>
        </td>
      </tr>
    </tbody>
    <tfoot><tr><td><div class="print-footer-space"></div></td></tr></tfoot>
  </table>
</body>
</html>`;
};

/**
 * 在浏览器环境中触发下载
 */
export const downloadFile = (
  content: string,
  fileName: string,
  mimeType: string,
) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * 使用浏览器原生打印功能导出 PDF（矢量文字，支持中文，Web 会弹窗）
 */
export const exportToPdfNative = (html: string) => {
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (doc) {
    doc.open();
    doc.write(html);
    doc.close();

    iframe.onload = () => {
      setTimeout(() => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 1000);
      }, 500);
    };
  }
};

/**
 * 使用 html2pdf.js 将 HTML 转换为 PDF 并下载（高清图片方案，不弹窗，支持中文）
 */
export const exportToPdfImage = async (html: string, fileName: string) => {
  // 创建一个临时的 iframe 来渲染 HTML，以保证样式正确加载
  const iframe = document.createElement("iframe");
  iframe.style.visibility = "hidden";
  iframe.style.position = "fixed";
  iframe.style.left = "-9999px";
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) {
    document.body.removeChild(iframe);
    throw new Error("Failed to create iframe for PDF export");
  }

  doc.open();
  doc.write(html);
  doc.close();

  // 等待样式和图片加载
  await new Promise((resolve) => {
    iframe.onload = resolve;
    // 兜底超时
    setTimeout(resolve, 2000);
  });

  const contentElement = (doc.querySelector("#wemd-export-container") ||
    doc.body) as HTMLElement;

  const opt = {
    margin: 10,
    filename: fileName,
    image: { type: "jpeg" as const, quality: 0.98 },
    html2canvas: {
      scale: 3, // 提高分辨率
      useCORS: true,
      letterRendering: true,
      logging: false,
    },
    jsPDF: {
      unit: "mm" as const,
      format: "a4" as const,
      orientation: "portrait" as const,
    },
  };

  try {
    await html2pdf().set(opt).from(contentElement).save();
  } catch (e) {
    console.error("html2pdf failed:", e);
    throw e;
  } finally {
    document.body.removeChild(iframe);
  }
};
