import en from "./lang/en.json"
import zh_cn from "./lang/zh_cn.json"


export const languages = {
    en: "English",
    "zh-cn": "简体中文",
};

export const defaultLang = "en";

export const ui = {
    en,
    "zh-cn": zh_cn,
} as const;

export const langs = ["en", "zh-cn"];
