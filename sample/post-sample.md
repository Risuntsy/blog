---
title: Hello World
category: Test
tags: [Tag1, Test1  ]
created_at: 2023-12-29
updated_at: 1970-01-01
---


# Hello world

## Markdown的基本语法

### 标题


```markdown
# 一级标题
## 二级标题
### 三级标题
```

### 列表

```markdown
1. 有序列表项1
2. 有序列表项2

* 无序列表项1
* 无序列表项2
```

### 链接与图片


```markdown
[百度](https://www.baidu.com)
![图片描述](图片链接地址)
```

### 引用


```markdown
> 这是引用的内容
>> 引用中的引用
```

### 代码
`行内代码` 示例。


多行代码块:

```javascript

import { getCollection } from "astro:content";
import PostLayout from "@/layouts/PostLayout.astro";

export async function getStaticPaths() {
  const posts = await getCollection("post");

  return posts.map((post) => ({
    params: {
      slug: post.slug,
    },
    props: {
      post,
    },
  }));
}


```
