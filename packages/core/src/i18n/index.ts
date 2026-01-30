export type Locale = "zh" | "en";

export interface CoreTranslations {
  alert: {
    note: string;
    tip: string;
    important: string;
    warning: string;
    caution: string;
  };
  export: {
    defaultTitle: string;
    localImageTitle: string;
  };
}

export const translations: Record<Locale, CoreTranslations> = {
  zh: {
    alert: {
      note: "备注",
      tip: "提示",
      important: "重要",
      warning: "警告",
      caution: "危险",
    },
    export: {
      defaultTitle: "MD Beautify 导出",
      localImageTitle: "本地图片 - 复制到微信前请先上传",
    },
  },
  en: {
    alert: {
      note: "NOTE",
      tip: "TIP",
      important: "IMPORTANT",
      warning: "WARNING",
      caution: "CAUTION",
    },
    export: {
      defaultTitle: "MD Beautify Export",
      localImageTitle: "Local image - Upload required for WeChat",
    },
  },
};

let currentLocale: Locale = "zh";

export const setLocale = (locale: Locale) => {
  currentLocale = locale;
};

export const getLocale = (): Locale => {
  return currentLocale;
};

export const t = <T extends keyof CoreTranslations>(
  key: T,
  subKey: keyof CoreTranslations[T],
): string => {
  return (translations[currentLocale][key] as any)[subKey];
};
