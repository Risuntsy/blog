import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
    redirects: {
        "/post":"/en/post"
    },
    integrations: [tailwind()],
    markdown: {
        shikiConfig: {
            theme: "material-theme-lighter",
            wrap: true,
        },
    },
});
