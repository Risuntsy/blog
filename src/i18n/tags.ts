export type TagLang = "en" | "zh-cn";

export const TAG_TRANSLATIONS = [
    { en: "Frontend", "zh-cn": "前端" },
    { en: "Year-End Summary", "zh-cn": "年终总结" },
    { en: "Blog", "zh-cn": "博客" },
    { en: "Politics", "zh-cn": "政治" },
    { en: "Currents of the Times", "zh-cn": "时代洪流" },
    { en: "Anime", "zh-cn": "动漫" },
    { en: "Frieren: Beyond Journey's End", "zh-cn": "葬送的芙莉莲" },
] as const satisfies ReadonlyArray<Record<TagLang, string>>;

/** Return a tag's translated name, falling back to the name it already has. */
export function localizedTag(tag: string, locale: TagLang): string {
    const translation = TAG_TRANSLATIONS.find(entry => entry.en === tag || entry["zh-cn"] === tag);
    return translation?.[locale] ?? tag;
}
