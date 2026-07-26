import { execSync } from "child_process";
import { existsSync, symlinkSync, rmSync } from "fs";
import { resolve } from "path";

const repo = process.env.CONTENT_REPO;
const path = process.env.CONTENT_PATH;
const target = resolve("src/content/post");

// Only act if an external source is configured
if (!repo && !path) {
  if (existsSync(target) && (existsSync(resolve(target, "en")) || existsSync(resolve(target, "zh-cn")))) {
    console.log("[sync-content] using local content");
  } else {
    console.log("[sync-content] no local or external content found");
  }
  process.exit(0);
}

// Clean up existing content before pulling
if (existsSync(target)) {
  try { rmSync(target, { recursive: true, force: true }); } catch {}
}

if (repo) {
  console.log(`[sync-content] cloning from ${repo}...`);
  execSync(`git clone --depth 1 "${repo}" "${target}"`, { stdio: "inherit" });
  // If repo has a posts/ subdirectory, use that
  if (existsSync(resolve(target, "posts"))) {
    const tmp = resolve(target, "_tmp");
    execSync(`mv "${resolve(target, "posts")}" "${tmp}" && rm -rf "${target}" && mv "${tmp}" "${target}"`, { stdio: "inherit" });
  }
} else {
  const src = resolve(path);
  if (!existsSync(src)) {
    console.error(`[sync-content] CONTENT_PATH "${path}" not found`);
    process.exit(1);
  }
  console.log(`[sync-content] symlinking ${src} -> ${target}`);
  symlinkSync(src, target, "dir");
}
