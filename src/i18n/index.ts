import en from "./en.json";
import zh_cn from "./zh-cn.json";
import { localizedTag } from "./tags";

export { TAG_TRANSLATIONS, localizedTag } from "./tags";

export const LANGS = ["en", "zh-cn"] as const;
export type Lang = (typeof LANGS)[number];

const dicts: Record<string, Record<string, string>> = { en, "zh-cn": zh_cn };

export function useTranslate(locale: string) {
  const dict = dicts[locale] || dicts["en"];
  return (key: string, params?: Record<string, string | number>): string => {
    let template = dict[key] || dicts["en"][key] || key;
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        template = template.replaceAll(`\${${k}}`, String(v));
      }
    }
    return template;
  };
}

/** Build locale-aware URL: /en/path or /zh-cn/path */
export function l(locale: string, path: string): string {
  const prefix = locale === "en" ? "/en" : "/zh-cn";
  if (!path || path === "/") return prefix;
  return prefix + (path.startsWith("/") ? path : "/" + path);
}

export function tagHref(locale: string, tag: string): string {
  return l(locale, `/tag/${encodeURIComponent(tag)}`);
}

/** Build the equivalent path when switching languages. */
export function languagePath(pathname: string, locale: Lang): string {
  const tagRoute = pathname.match(
    /^\/(?:en|zh-cn)\/tag\/([^/]+)(\/.*)?$/,
  );

  if (tagRoute) {
    let tag = tagRoute[1];
    try {
      tag = decodeURIComponent(tag);
    } catch {
      // Keep a malformed-but-usable segment unchanged.
    }
    return `/${locale}/tag/${encodeURIComponent(localizedTag(tag, locale))}${tagRoute[2] ?? ""}`;
  }

  if (/^\/(?:en|zh-cn)(?:\/|$)/.test(pathname)) {
    return pathname.replace(/^\/(?:en|zh-cn)/, `/${locale}`);
  }

  return `/${locale}`;
}

/** Format date for the given locale */
export function fmtDate(locale: string, date: Date, opts?: Intl.DateTimeFormatOptions): string {
  const defaultOpts: Intl.DateTimeFormatOptions = locale === "zh-cn"
    ? { year: "numeric", month: "long", day: "numeric" }
    : { year: "numeric", month: "short", day: "numeric" };
  return date.toLocaleDateString(locale === "zh-cn" ? "zh-CN" : "en-US", opts || defaultOpts);
}

/** Embeddable client-side search strings */
export function searchStrings(locale: string) {
  const t = useTranslate(locale);
  return {
    placeholder: t("search_placeholder"),
    no_results: t("search_no_results"),
    result_count: t("search_result_count"),
    not_available: t("search_not_available"),
    untitled: t("post_untitled"),
    btn: t("nav_search"),
  };
}
