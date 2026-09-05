import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIRoute } from "astro";
import { postLang, postSlug } from "#/utils";

export const GET: APIRoute = async ({ site }) => {
    const posts = await getCollection("post", ({ data }) => !data.draft);
    const sorted = posts.sort((a, b) => b.data.created_at.getTime() - a.data.created_at.getTime());

    return rss({
        title: "Risun's Blog",
        description: "personal blog",
        site: site ?? "https://blog.risun.icu",
        items: sorted.map(post => {
            const lang = postLang(post);
            return {
                title: post.data.title,
                pubDate: post.data.created_at,
                description: post.data.description || "",
                link: `/${lang}/post/${postSlug(post)}`,
                categories: post.data.tags,
            };
        }),
    });
};
