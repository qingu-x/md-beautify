/**
 * 处理 KaTeX 公式：确保 katex-html 可见，katex-mathml 隐藏
 */
export const processKatexForExport = (html: string): string => {
  // 不移除任何内容，让 CSS 控制显示
  // katex-html 应该显示，katex-mathml 应该被 CSS 隐藏
  return html;
};

/**
 * 处理导出内容
 */
export const processExportContent = (html: string): string => {
  let result = html;

  // KaTeX 处理
  result = processKatexForExport(result);

  return result;
};
