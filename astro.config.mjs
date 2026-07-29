// @ts-check
import { defineConfig } from "astro/config";
import { unified } from "@astrojs/markdown-remark";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

const siteUrl = new URL("https://blog.risun.icu");

function externalLinks() {
  return (/** @type {any} */ tree) => {
    /** @param {any} node */
    function visit(node) {
      if (node?.type === "element" && node.tagName === "a") {
        const properties = node.properties || (node.properties = {});
        const href = properties.href;
        const isAbsoluteUrl =
          typeof href === "string" && /^(https?:)?\/\//i.test(href);

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

function copyableInlineCode() {
  return (/** @type {any} */ tree) => {
    /** @param {any} node @param {any} parent */
    function visit(node, parent) {
      if (
        node?.type === "element" &&
        node.tagName === "code" &&
        parent?.tagName !== "pre"
      ) {
        const properties = node.properties || (node.properties = {});
        const text = node.children
          ?.filter((/** @type {any} */ child) => child.type === "text")
          .map((/** @type {any} */ child) => child.value)
          .join("") ?? "";

        properties["data-copy-inline"] = "";
        properties.tabIndex = 0;
        properties.role = "button";
        properties.title = "Copy";
        properties.ariaLabel = `Copy ${text}`;
      }

      node?.children?.forEach((/** @type {any} */ child) => visit(child, node));
    }

    visit(tree, undefined);
  };
}

export default defineConfig({
  site: siteUrl.href,
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "hover",
  },
  integrations: [mdx(), sitemap()],
  markdown: {
    processor: unified({ rehypePlugins: [externalLinks, copyableInlineCode] }),
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
