import { defineStore } from "pinia";
import { ref } from "vue";

export type UITheme = "default" | "dark";

const THEME_STORAGE_KEY = "wemd-ui-theme";
const AUTOHIDE_STORAGE_KEY = "wemd-header-autohide";

const FAVICON_MAP: Record<UITheme, string> = {
  default: "favicon-dark.svg",
  dark: "favicon-dark.svg",
};

const resolveAssetHref = (filename: string) => {
  if (typeof document === "undefined") return filename;
  return new URL(filename, document.baseURI).toString();
};

const applyThemeSideEffects = (theme: UITheme) => {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-ui-theme", theme);
  const faviconEl = document.querySelector<HTMLLinkElement>(
    "link[rel='icon'], link[rel='shortcut icon']",
  );
  if (faviconEl) {
    const file = FAVICON_MAP[theme] ?? FAVICON_MAP.default;
    faviconEl.href = resolveAssetHref(file);
  }
};

const hydrateThemeFromStorage = (): UITheme => {
  if (typeof window === "undefined") return "default";
  try {
    const stored = window.localStorage?.getItem(THEME_STORAGE_KEY);
    // 兼容旧值 structuralism 迁移到 dark
    if (stored === "structuralism") {
      applyThemeSideEffects("dark");
      return "dark";
    }
    if (stored === "default" || stored === "dark") {
      applyThemeSideEffects(stored as UITheme);
      return stored as UITheme;
    }

    // 如果没有存储，尝试使用系统主题
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      applyThemeSideEffects("dark");
      return "dark";
    }
  } catch {
    /* ignore hydration errors */
  }
  applyThemeSideEffects("default");
  return "default";
};

export const useUIThemeStore = defineStore("uiTheme", () => {
  const theme = ref<UITheme>(hydrateThemeFromStorage());
  const headerAutoHide = ref<boolean>(
    typeof window !== "undefined"
      ? window.localStorage.getItem(AUTOHIDE_STORAGE_KEY) === "true"
      : false,
  );

  function setTheme(newTheme: UITheme) {
    theme.value = newTheme;
    applyThemeSideEffects(newTheme);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    }
  }

  function setHeaderAutoHide(value: boolean) {
    headerAutoHide.value = value;
    if (typeof window !== "undefined") {
      window.localStorage.setItem(AUTOHIDE_STORAGE_KEY, String(value));
    }
  }

  // 监听系统主题变化
  if (typeof window !== "undefined" && window.matchMedia) {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    // 如果没有本地存储的主题设置，则跟随系统
    if (!window.localStorage.getItem(THEME_STORAGE_KEY)) {
      const systemTheme: UITheme = mediaQuery.matches ? "dark" : "default";
      if (theme.value !== systemTheme) {
        theme.value = systemTheme;
        applyThemeSideEffects(systemTheme);
      }
    }

    mediaQuery.addEventListener("change", (e) => {
      // 只有在用户没有手动设置过主题的情况下，才跟随系统变化
      if (!window.localStorage.getItem(THEME_STORAGE_KEY)) {
        const newTheme = e.matches ? "dark" : "default";
        theme.value = newTheme;
        applyThemeSideEffects(newTheme);
      }
    });
  }

  return {
    theme,
    setTheme,
    headerAutoHide,
    setHeaderAutoHide,
  };
});
