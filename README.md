

# README

使用 [Astro](https://astro.build/) 框架和 [TailwindCSS](https://tailwindcss.com/) 搭建的简单个人博客

应该是纯静态SSG, 目前部署在Vercel

部分样式来源:   
https://without.boats/blog/  
Wordpress theme [Pixl](https://wordpress.com/theme/pixl) 源码:[pixl](https://github.com/Automattic/themes/tree/trunk/pixl)

因为`markdown-to-txt`使用了但没有添加lodash为自己的依赖，需要手动安装 `npm install lodash`

## TODO

- [x] dark theme 
- [ ] archiver page / time line (mobile)
- [ ] code block style
- [ ] font style
- [ ] code copy  
- [ ] i18n  

## Commands



All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |

