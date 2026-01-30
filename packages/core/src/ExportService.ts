import { processHtml } from "./ThemeProcessor";
import { katexInlineCss } from "./katex-inline-css";
import { t } from "./i18n";

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
  const {
    title = t("export", "defaultTitle"),
    themeCss,
    extraCss = "",
  } = options;

  // Use processHtml to process inline styles
  // Inline basic styles for export and convert pseudo-elements (ensure Mac indicators etc. work)
  // 使用 processHtml 处理内联样式
  // 导出时内联基本样式，并转换伪元素（确保Mac指示器等样式生效）
  let styledHtml = "";
  try {
    styledHtml = processHtml(contentHtml, themeCss, true, true);
  } catch (e) {
    console.error("Export processHtml failed:", e);
  }

  // Fallback: if styledHtml is empty, use contentHtml wrapped in mdb container / 兜底逻辑：如果 styledHtml 为空，则直接使用 contentHtml 并包裹在 mdb 容器中
  if (!styledHtml || styledHtml.trim() === "") {
    styledHtml = `<section id="mdb">${contentHtml}</section>`;
  }

  // Convert checkboxes to emojis / 转换 checkbox 为 emoji
  styledHtml = convertCheckboxesToEmoji(styledHtml);

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    /* KaTeX CSS (Fully inlined, includes base64 fonts, offline available) / KaTeX CSS (完全内联，包含 base64 字体，离线可用) */
    ${katexInlineCss}
  </style>
  <style>
    * {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      margin: 0;
      padding: 0;
      background-color: #fff;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
    }
    #mdb-export-container {
      max-width: 900px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    /* 修复极光玻璃主题的渲染问题 */
    #mdb h1 .content {
      -webkit-background-clip: initial !important;
      background-clip: initial !important;
      background-image: none !important;
      color: #4158D0 !important;
    }
    #mdb strong {
      -webkit-background-clip: initial !important;
      background-clip: initial !important;
      background-image: none !important;
      color: #C850C0 !important;
    }
    #mdb .callout-title {
      -webkit-background-clip: initial !important;
      background-clip: initial !important;
      background-image: none !important;
      color: #4158D0 !important;
    }
    #mdb .callout {
      background-color: rgba(255, 255, 255, 0.95) !important;
      -webkit-backdrop-filter: none !important;
      backdrop-filter: none !important;
    }
    #mdb .callout p,
    #mdb .callout section,
    #mdb .callout li {
      color: #444 !important;
    }
    @page {
      size: auto;
      margin: 0; /* 设为 0 以强制隐藏 Edge/Chrome 的默认页眉页脚 */
    }
    /* KaTeX 公式样式 - 确保正确显示 */
    .katex {
      font: normal 1.21em KaTeX_Main, Times New Roman, serif;
      line-height: 1.2;
      text-indent: 0;
      text-rendering: auto;
    }
    .katex .katex-mathml {
      position: absolute !important;
      clip: rect(1px, 1px, 1px, 1px) !important;
      padding: 0 !important;
      border: 0 !important;
      height: 1px !important;
      width: 1px !important;
      overflow: hidden !important;
    }
    .katex .katex-html {
      display: inline-block !important;
    }
    .katex-display {
      display: block !important;
      margin: 1em 0 !important;
      text-align: center !important;
    }
    .katex-display > span {
      display: inline-block !important;
      text-align: initial !important;
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
      #mdb-export-container {
        max-width: 100%;
        margin: 0;
        padding: 0;
      }
      /* Pagination by block, avoid split across pages / 内容按块分页，避免跨页拆分 */
      #mdb p, 
      #mdb li, 
      #mdb img, 
      #mdb figure,
      #mdb pre, 
      #mdb blockquote, 
      #mdb .callout, 
      #mdb table,
      #mdb h1, #mdb h2, #mdb h3, #mdb h4, #mdb h5, #mdb h6 {
        break-inside: avoid;
        page-break-inside: avoid;
      }
      /* Avoid page break after heading, ensure heading stays with content / 标题后避免分页，确保标题与其内容在同一页 */
      #mdb h1, #mdb h2, #mdb h3, #mdb h4, #mdb h5, #mdb h6 {
        break-after: avoid;
        page-break-after: avoid;
      }
      /* Fix text color transparency issue during printing (usually caused by background-clip: text) / 修复打印时文字颜色透明的问题（通常是由于 background-clip: text 引起） */
      #mdb h1 .content,
      #mdb strong,
      #mdb .callout-title {
        -webkit-background-clip: initial !important;
        background-clip: initial !important;
        background-image: none !important;
        color: inherit !important;
      }
      /* 针对不同主题的特殊修复 */
      #mdb .callout-title {
        color: #333 !important;
      }
      /* 确保 callout 内的内容可见 */
      #mdb .callout p, 
      #mdb .callout section,
      #mdb .callout li {
        color: #444 !important;
      }
      /* 确保背景色能够打印出来 */
      #mdb .callout {
        background-color: #f8fafc !important;
        background-image: none !important;
      }
      /* 隐藏可能遮挡文字的装饰性伪元素 */
      #mdb .callout::after,
      #mdb .callout::before {
        display: none !important;
      }
      /* 打印时隐藏不必要的元素 */
      .no-print {
        display: none !important;
      }
      /* 打印时确保 KaTeX 公式正确显示 */
      .katex .katex-mathml {
        display: none !important;
      }
      .katex .katex-html {
        display: inline-block !important;
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
          <div id="mdb-export-container">
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
