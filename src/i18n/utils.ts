import { ui, defaultLang } from "./ui";

type uiStruct = typeof ui;
export type Lang = keyof uiStruct;
export type Page<T extends Lang> = keyof uiStruct[T];
export type Key<T extends Lang, P extends Page<T>> = keyof uiStruct[T][P];

export function getLangAndPageFromUrl(url: URL) {
    const [_, lang, page] = url.pathname.split("/");
    if (lang in ui) {
        const typedLang = lang as Lang;
        if (page in ui[typedLang]) {
            console;
            const typedPage = page as Page<Lang>;
            return {
                lang: typedLang,
                page: typedPage,
            };
        } else {
            return {
                lang: typedLang,
            };
        }
    }
    return {
        lang: defaultLang as Lang,
        page: page as Page<Lang>,
    };
}

export function useTranslations(lang: Lang, page: Page<Lang>) {
    return function t(key: string) {
        const typedKey = key as Key<Lang, Page<Lang>>;
        return ui[lang][page][typedKey] || ui[defaultLang][page][typedKey];
    };
}
