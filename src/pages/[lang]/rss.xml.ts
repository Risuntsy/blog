import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { LANGS } from "#/i18n";

export async function getStaticPaths() {
  return LANGS.map((lang) => ({ params: { lang } }));
}

export async function GET({
  params,
  site,
}: {
  params: { lang: string };
  site?: URL;
}) {
  const lang = params.lang;
  const posts = await getCollection("post", ({ data }) => !data.draft);
  const sorted = posts
    .filter((p) => p.id.startsWith(lang + "/"))
    .sort((a, b) => {
      return b.data.created_at.getTime() - a.data.created_at.getTime();
    });

  return rss({
    title: `Risun's Blog (${lang})`,
    description: `personal blog - ${lang}`,
    site: site ?? "https://blog.risun.icu",
    customData: `<language>${lang}</language>`,
    items: sorted.map((post) => {
      const slug = post.id.replace(new RegExp(`^${lang}/`), "");
      return {
        title: post.data.title,
        pubDate: post.data.created_at,
        description: post.data.description || "",
        link: `/${lang}/post/${slug}`,
        categories: post.data.tags,
      };
    }),
  });
}
