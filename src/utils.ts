import { getCollection, type CollectionEntry } from "astro:content";

export type Post = CollectionEntry<"post">;

export async function getPosts(lang: string, includeDraft = false) {
  const all = await getCollection("post", ({ data, id }) => {
    if (!id.startsWith(`${lang}/`)) return false;
    if (!includeDraft && data.draft) return false;
    return true;
  });
  return all.sort((a, b) => {
    if (a.data.pinned !== b.data.pinned) return a.data.pinned ? -1 : 1;
    return b.data.created_at.getTime() - a.data.created_at.getTime();
  });
}

export function postSlug(post: Post) {
  return post.id.replace(/^(en|zh-cn)\//, "");
}

export function postLang(post: Post) {
  return post.id.split("/")[0] ?? "en";
}
