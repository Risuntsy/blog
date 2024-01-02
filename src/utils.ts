import { markdownToTxt } from "markdown-to-txt";
import { type CollectionEntry } from "astro:content";
import { POST_PREVIEW_LENGTH } from "./config";

export function isoDate(date: Date): string {
    return date.toISOString().substring(0, 10);
}

export function md2txt(md: string) {
    return markdownToTxt(md);
}

export function definePostPreview(post: CollectionEntry<"post">) {
    Object.defineProperty(post.data, "preview", {
        value: md2txt(post.body).substring(0, POST_PREVIEW_LENGTH),
    });
    return post;
}

export function postDateCompareReverse(
    a: CollectionEntry<"post">,
    b: CollectionEntry<"post">
) {
    return b.data.created_at.getDate() - a.data.created_at.getDate();
}
