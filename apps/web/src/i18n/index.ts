import { ref, computed } from "vue";
import zh from "./locales/zh";
import en from "./locales/en";
import { setLocale as setCoreLocale } from "@mdb/core";

export type Locale = "zh" | "en";

const messages = {
  zh,
  en,
};

const getDefaultLocale = (): Locale => {
  const saved = localStorage.getItem("mdb-locale");
  if (saved === "zh" || saved === "en") {
    return saved;
  }
  const browserLang = navigator.language.toLowerCase();
  return browserLang.startsWith("zh") ? "zh" : "en";
};

const currentLocale = ref<Locale>(getDefaultLocale());

// 同步设置 core 包的语言
setCoreLocale(currentLocale.value);

export function useI18n() {
  const locale = computed({
    get: () => currentLocale.value,
    set: (val: Locale) => {
      currentLocale.value = val;
      localStorage.setItem("mdb-locale", val);
      setCoreLocale(val);
    },
  });

  const t = (path: string, params?: Record<string, string>) => {
    const keys = path.split(".");
    let current: any = messages[currentLocale.value];
    for (const key of keys) {
      if (current[key]) {
        current = current[key];
      } else {
        return path;
      }
    }

    if (params && typeof current === "string") {
      Object.keys(params).forEach((key) => {
        current = current.replace(`{${key}}`, params[key]);
      });
    }
    return current;
  };

  return {
    locale,
    t,
  };
}

// 全局单例，非组件内使用
export const t = (path: string, params?: Record<string, string>) => {
  const keys = path.split(".");
  let current: any = messages[currentLocale.value];
  for (const key of keys) {
    if (current[key]) {
      current = current[key];
    } else {
      return path;
    }
  }

  if (params && typeof current === "string") {
    Object.keys(params).forEach((key) => {
      current = current.replace(`{${key}}`, params[key]);
    });
  }
  return current;
};
