export type Locale = "zh" | "en";

export function normalizeLocale(raw?: string | null): Locale | null {
  if (!raw) return null;
  const normalized = raw.toLowerCase();
  if (
    normalized === "zh" ||
    normalized === "zh-cn" ||
    normalized.startsWith("zh")
  ) {
    return "zh";
  }
  if (normalized === "en" || normalized.startsWith("en")) {
    return "en";
  }
  return null;
}

export function parseLocaleFromUrl(): Locale | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  const raw = params.get("lang") ?? params.get("locale");
  return normalizeLocale(raw);
}

export function resolveInitialLocale(): Locale {
  const fromUrl = parseLocaleFromUrl();
  if (fromUrl) {
    localStorage.setItem("mdb-locale", fromUrl);
    return fromUrl;
  }

  const saved = localStorage.getItem("mdb-locale");
  if (saved === "zh" || saved === "en") {
    return saved;
  }

  const browserLang = navigator.language.toLowerCase();
  return browserLang.startsWith("zh") ? "zh" : "en";
}
