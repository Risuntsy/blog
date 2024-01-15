/** @type {import('tailwindcss').Config} */
export default {
    content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                pixel: {
                    background: "#ddcfff",
                    primary: "#040de1",
                    light: "#937cfd",
                    "code-bg": "#F8EDFF",
                    "menu-bg": "rgba(248, 237, 255, 0.9)",
                },
                "pixel-dark": {
                    background: "#2d2e34",
                    primary: "#b392d4",
                    light: "#8379ad",
                    "code-bg": "#141717",
                    "menu-bg": "rgba(66, 66, 66, 0.9)",
                },
            },
            boxShadow: ({ theme }) => ({
                pixel: `6px 6px 0px -2px ${theme(
                    "colors.pixel.background"
                )}, 6px 6px ${theme("colors.pixel.primary")}`,
                "pixel-dark": `6px 6px 0px -2px ${theme(
                    "colors.pixel-dark.background"
                )}, 6px 6px ${theme("colors.pixel-dark.primary")}`,
            }),
            height: {
                404: "75vh",
            },
            textUnderlineOffset: {
                6: "6px",
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
            ringOffsetWidth: {
                m2: "-2",
                m4: "-4",
            },
            borderWidth: {
                link: "2px",
            },
            gridTemplateColumns: {
                "1a1": "1fr auto 1fr",
                "1a": "1fr auto",
            },
        },
    },
    plugins: [],
};
