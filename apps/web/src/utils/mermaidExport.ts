import mermaid from "mermaid";
import { getMermaidConfig } from "./mermaidConfig";

let mermaidInitialized = false;

const ensureMermaidInitialized = () => {
  if (mermaidInitialized) return;
  try {
    mermaid.initialize({ startOnLoad: false });
    mermaidInitialized = true;
  } catch (e) {
    console.error("Mermaid initialization failed:", e);
  }
};

const getSvgDimensions = (svgElement: SVGElement) => {
  const parseSize = (value: string | null): number | null => {
    if (!value) return null;
    const trimmed = value.trim();
    if (trimmed.endsWith("%")) return null;
    const parsed = Number.parseFloat(trimmed);
    return Number.isFinite(parsed) ? parsed : null;
  };

  const width = parseSize(svgElement.getAttribute("width"));
  const height = parseSize(svgElement.getAttribute("height"));

  if (width && height) {
    return { width, height };
  }

  const viewBox = svgElement.getAttribute("viewBox");
  if (viewBox) {
    const parts = viewBox
      .trim()
      .split(/[\s,]+/)
      .map(Number);
    if (parts.length === 4 && parts.every(Number.isFinite)) {
      return { width: parts[2], height: parts[3] };
    }
  }

  return { width: 400, height: 300 };
};

const normalizeMermaidSvg = (svgMarkup: string): string => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgMarkup, "image/svg+xml");
  const svgEl = doc.documentElement;
  const defs = svgEl.querySelector("defs");
  const refNode = defs ? defs.nextSibling : svgEl.firstChild;
  const selectors = [
    "g.lineWrapper",
    "g.edgePaths",
    "g[class*='arrow']",
    "g[class*='node-line']",
    "g[class*='timeline-line']",
  ];
  const lineGroups = Array.from(svgEl.querySelectorAll(selectors.join(", ")));
  for (const g of lineGroups) {
    if (g.parentNode === svgEl && (!refNode || refNode.parentNode === svgEl)) {
      if (refNode) {
        svgEl.insertBefore(g, refNode);
      } else {
        svgEl.insertBefore(g, svgEl.firstChild);
      }
    }
  }
  return new XMLSerializer().serializeToString(svgEl);
};

const svgMarkupToPng = async (svgMarkup: string): Promise<string> => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgMarkup, "image/svg+xml");
  const svgElement = doc.documentElement as unknown as SVGElement;
  const { width, height } = getSvgDimensions(svgElement);

  svgElement.setAttribute("width", String(width));
  svgElement.setAttribute("height", String(height));
  if (!svgElement.getAttribute("xmlns")) {
    svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  }

  const svgData = new XMLSerializer().serializeToString(svgElement);
  const svgDataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgData)}`;

  const img = new Image();
  img.src = svgDataUrl;

  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = (e) => reject(e);
  });

  const scale = 3;
  const canvas = document.createElement("canvas");
  canvas.width = width * scale;
  canvas.height = height * scale;
  const ctx = canvas.getContext("2d")!;
  ctx.scale(scale, scale);
  ctx.drawImage(img, 0, 0);

  return canvas.toDataURL("image/png");
};

const normalizeMermaidText = (text: string): string => {
  return text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();
};

const isMermaidDiagramText = (text: string): boolean => {
  const trimmed = text.trim();
  const keywords = [
    "graph",
    "flowchart",
    "sequenceDiagram",
    "classDiagram",
    "stateDiagram",
    "erDiagram",
    "gantt",
    "pie",
    "journey",
    "gitGraph",
    "mindmap",
    "timeline",
  ];
  return keywords.some((kw) => trimmed.startsWith(kw));
};

/**
 * 渲染容器中的所有 Mermaid 图表为 PNG 图片
 */
export const renderMermaidToImage = async (
  container: HTMLElement,
  onProgress?: (current: number, total: number) => void,
): Promise<void> => {
  const mermaidNodes = Array.from(
    container.querySelectorAll<HTMLElement>(
      ".mermaid, pre.language-mermaid, pre.lang-mermaid, code.language-mermaid, code.lang-mermaid, code.mermaid",
    ),
  );
  if (mermaidNodes.length === 0) return;

  ensureMermaidInitialized();
  const renderIdBase = `mdb-mermaid-export-${Date.now()}`;

  const targets: { container: HTMLElement; diagram: string }[] = [];
  const visited = new Set<HTMLElement>();

  mermaidNodes.forEach((node) => {
    const isCode = node.tagName === "CODE";
    const containerEl = (
      isCode ? node.parentElement : node
    ) as HTMLElement | null;
    if (!containerEl || visited.has(containerEl)) return;
    visited.add(containerEl);

    const diagramSource = isCode ? node.textContent : containerEl.textContent;
    const diagram = normalizeMermaidText(diagramSource ?? "");
    const shouldRender =
      containerEl.classList.contains("mermaid") ||
      node.classList.contains("language-mermaid") ||
      node.classList.contains("lang-mermaid") ||
      node.classList.contains("mermaid") ||
      isMermaidDiagramText(diagram);
    if (!diagram.trim() || !shouldRender) return;

    targets.push({ container: containerEl, diagram });
  });

  const total = targets.length;

  for (const [index, target] of targets.entries()) {
    const diagram = target.diagram;
    if (!diagram.trim()) continue;

    try {
      onProgress?.(index + 1, total);

      // 添加超时机制
      const renderTimeout = 30000;
      const renderPromise = (async () => {
        const { svg } = await mermaid.render(
          `${renderIdBase}-${index}`,
          diagram,
        );
        const normalizedSvg = normalizeMermaidSvg(svg);
        const pngDataUrl = await svgMarkupToPng(normalizedSvg);
        return pngDataUrl;
      })();

      const timeoutPromise = new Promise<string>((_, reject) =>
        setTimeout(
          () => reject(new Error("Mermaid render timeout")),
          renderTimeout,
        ),
      );

      const pngDataUrl = await Promise.race([renderPromise, timeoutPromise]);

      const figure = document.createElement("div");
      figure.style.cssText = "margin: 1em 0; text-align: center;";
      figure.setAttribute("data-tool", "MD Beautify");

      const img = document.createElement("img");
      img.src = pngDataUrl;
      img.style.cssText =
        "width: 100%; display: block; margin: 0 auto; max-width: 100%; height: auto;";

      figure.appendChild(img);
      target.container.parentNode?.replaceChild(figure, target.container);
    } catch (error) {
      console.error(
        `[MD Beautify] Mermaid render failed (${index + 1}/${total}):`,
        error,
      );
      // 渲染失败时显示错误
      const errorDiv = document.createElement("div");
      errorDiv.style.cssText =
        "color: #c62828; background: rgba(198, 40, 40, 0.08); padding: 12px; border-radius: 6px; margin: 1em 0;";
      errorDiv.textContent = `图表渲染失败: ${error instanceof Error ? error.message : String(error)}`;
      target.container.parentNode?.insertBefore(errorDiv, target.container);
    }
  }
};
