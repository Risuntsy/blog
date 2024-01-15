import { ui, defaultLang } from "./ui";

type uiStruct = typeof ui;
export type Lang = keyof uiStruct;
export type Page<T extends Lang> = keyof uiStruct[T];
export type Key<T extends Lang, P extends Page<T>> = keyof uiStruct[T][P];

export function getLangFromUrl(url: URL) {
    const [_, lang] = url.pathname.split("/");
    if (lang in ui) {
        return {
            lang: lang as Lang,
        };
    }
    return {
        lang: defaultLang as Lang,
    };
}

export function useTranslations(lang: Lang, page: Page<Lang>) {
    return function t(key: string) {
        const typedKey = key as Key<Lang, Page<Lang>>;
        return ui[lang][page][typedKey] || ui[defaultLang][page][typedKey];
    };
}
