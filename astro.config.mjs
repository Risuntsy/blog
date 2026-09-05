// @ts-check
import { defineConfig } from "astro/config";
import { unified } from "@astrojs/markdown-remark";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
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
            rehypePlugins: [removeDuplicateTitle, externalLinks],
        }),
    },
    vite: {
        plugins: [tailwindcss()],
        resolve: {
            alias: {
                "#": "/src",
            },
        },
    },
});
