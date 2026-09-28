// @ts-check
import { defineConfig } from "astro/config";
import { unified } from "@astrojs/markdown-remark";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { TAG_TRANSLATIONS } from "./src/i18n/tags.ts";

const siteUrl = new URL("https://blog.risun.icu");

function externalLinks() {
    return (/** @type {any} */ tree) => {
        /** @param {any} node */
        function visit(node) {
            if (node?.type === "element" && node.tagName === "a") {
                const properties = node.properties || (node.properties = {});
                const href = properties.href;
                const isAbsoluteUrl = typeof href === "string" && /^(https?:)?\/\//i.test(href);

                if (isAbsoluteUrl) {
                    const url = new URL(href, siteUrl);
                    if (url.host !== siteUrl.host && properties.target == null) {
                        properties.target = "_blank";
                    }

                    if (properties.target === "_blank") {
                        const rel = Array.isArray(properties.rel)
                            ? properties.rel
                            : typeof properties.rel === "string"
                              ? properties.rel.split(/\s+/)
                              : [];
                        properties.rel = [...new Set([...rel, "noopener", "noreferrer"])];
                    }
                }
            }

            node?.children?.forEach(visit);
        }

        visit(tree);
    };
}

function removeDuplicateTitle() {
    return (/** @type {any} */ tree, /** @type {any} */ file) => {
        const children = tree?.children;
        if (!Array.isArray(children)) return;

        const firstContentIndex = children.findIndex(
            (/** @type {any} */ node) => node?.type !== "text" || String(node.value ?? "").trim() !== "",
        );
        const heading = children[firstContentIndex];
        const title = file.data.astro?.frontmatter?.title;
        if (heading?.type !== "element" || heading.tagName !== "h1") return;
        if (typeof title !== "string") return;

        let headingText = "";
        function collectText(/** @type {any} */ node) {
            if (node?.type === "text") headingText += node.value;
            node?.children?.forEach(collectText);
        }
        collectText(heading);

        const normalize = (/** @type {string} */ value) =>
            value
                .normalize("NFKC")
                // remark-smartypants curls quotes in rendered content but not in
                // frontmatter, so unify both to straight quotes before comparing.
                .replace(/[‘’]/g, "'")
                .replace(/[“”]/g, '"')
                .trim()
                .replace(/\s+/g, " ")
                .toLocaleLowerCase();

        if (normalize(headingText) === normalize(title)) {
            children.splice(firstContentIndex, 1);
        }
    };
}

/** Shiki drops the fence meta, so keep `title="file.ext"` on the <pre>. */
const codeTitleTransformer = {
    name: "code-title",
    /** @param {any} node */
    pre(node) {
        // @ts-ignore - `this` is the Shiki transformer context
        const title = String(this.options.meta?.__raw ?? "").match(/title=(["'])(.*?)\1/)?.[2];
        if (title) node.properties["data-title"] = title;
    },
};

const COPY_LABELS = {
    en: { copy: "Copy", copied: "Copied" },
    "zh-cn": { copy: "复制", copied: "已复制" },
};

/** Wrap highlighted blocks in a titled code window and make inline code copyable. */
function codeBlocks() {
    return (/** @type {any} */ tree, /** @type {any} */ file) => {
        const lang = /[\\/]zh-cn[\\/]/.test(String(file.path ?? "")) ? "zh-cn" : "en";
        const labels = COPY_LABELS[lang];

        /** @param {any} node */
        function visit(node) {
            if (!Array.isArray(node?.children)) return;
            node.children = node.children.map((/** @type {any} */ child) => {
                if (child?.type !== "element") return child;

                if (child.tagName === "pre") {
                    const language = String(child.properties?.dataLanguage ?? "");
                    const title = String(child.properties?.["data-title"] ?? "");
                    delete child.properties["data-title"];
                    const text = (/** @type {string} */ value) => ({ type: "text", value });
                    return {
                        type: "element",
                        tagName: "figure",
                        properties: { className: ["code-window"] },
                        children: [
                            {
                                type: "element",
                                tagName: "figcaption",
                                properties: { className: ["code-titlebar"] },
                                children: [
                                    {
                                        type: "element",
                                        tagName: "span",
                                        properties: { className: ["file"] },
                                        children: title ? [text(title)] : [],
                                    },
                                    {
                                        type: "element",
                                        tagName: "span",
                                        properties: { className: ["lang"] },
                                        children: language && language !== "plaintext" ? [text(language)] : [],
                                    },
                                    {
                                        type: "element",
                                        tagName: "button",
                                        properties: {
                                            type: "button",
                                            className: ["code-copy"],
                                            dataCopy: "block",
                                            dataCopied: labels.copied,
                                        },
                                        children: [text(labels.copy)],
                                    },
                                ],
                            },
                            child,
                        ],
                    };
                }

                if (child.tagName === "code") {
                    child.properties = {
                        ...child.properties,
                        dataCopy: "inline",
                        tabIndex: 0,
                        title: labels.copy,
                    };
                    return child;
                }

                visit(child);
                return child;
            });
        }

        visit(tree);
    };
}

/** @param {string} page */
function isTranslatedTagAlias(page) {
    const { pathname } = new URL(page);
    const match = pathname.match(/^\/(en|zh-cn)\/tag\/([^/]+)(?:\/page\/\d+)?\/?$/);
    if (!match) return false;

    const [, lang, encodedTag] = match;
    const tag = decodeURIComponent(encodedTag);
    return TAG_TRANSLATIONS.some(entry => {
        const localTag = lang === "en" ? entry.en : entry["zh-cn"];
        return localTag !== tag && (entry.en === tag || entry["zh-cn"] === tag);
    });
}

export default defineConfig({
    site: siteUrl.href,
    prefetch: {
        prefetchAll: true,
        defaultStrategy: "hover",
    },
    integrations: [mdx(), sitemap({ filter: page => !isTranslatedTagAlias(page) })],
    markdown: {
        processor: unified({
            rehypePlugins: [removeDuplicateTitle, externalLinks, codeBlocks],
        }),
        shikiConfig: {
            theme: "css-variables",
            transformers: [codeTitleTransformer],
        },
    },
    vite: {
        resolve: {
            alias: {
                "#": "/src",
            },
        },
    },
});
