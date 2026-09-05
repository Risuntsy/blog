import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import { z } from "astro/zod";

const post = defineCollection({
    loader: glob({ base: "./src/content/post", pattern: "**/*.{md,mdx}" }),
    schema: z
        .object({
            title: z.string(),
            tags: z.array(z.string()).default([]),
            created_at: z.coerce.date(),
            updated_at: z.coerce.date().optional(),
            description: z.string().optional(),
            draft: z.boolean().optional().default(false),
            pinned: z.boolean().optional().default(false),
        })
        .strip(),
});

export const collections = { post };
