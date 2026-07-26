import { execFileSync } from "child_process";
import {
  existsSync,
  mkdirSync,
  renameSync,
  rmSync,
  statSync,
  symlinkSync,
} from "fs";
import { dirname, resolve } from "path";

const repo = process.env.CONTENT_REPO;
const contentPath = process.env.CONTENT_PATH;
const target = resolve("src/content/post");
const targetParent = dirname(target);
const staging = resolve(targetParent, ".post-sync-tmp");

function remove(path) {
  rmSync(path, { recursive: true, force: true });
}

// Only act if an external source is configured
if (!repo && !contentPath) {
  if (
    existsSync(target) &&
    (existsSync(resolve(target, "en")) ||
      existsSync(resolve(target, "zh-cn")))
  ) {
    console.log("[sync-content] using local content");
  } else {
    console.log("[sync-content] no local or external content found");
  }
  process.exit(0);
}

if (repo) {
  console.log("[sync-content] cloning external content repository");
  mkdirSync(targetParent, { recursive: true });
  remove(staging);

  try {
    execFileSync("git", ["clone", "--depth", "1", "--", repo, staging], {
      stdio: "inherit",
    });

    const posts = resolve(staging, "posts");
    const source = existsSync(posts) ? posts : staging;
    remove(resolve(staging, ".git"));
    remove(target);
    renameSync(source, target);
    if (source !== staging) remove(staging);
  } catch (error) {
    remove(staging);
    throw error;
  }
} else {
  const source = resolve(contentPath);
  if (!existsSync(source) || !statSync(source).isDirectory()) {
    console.error(`[sync-content] CONTENT_PATH "${contentPath}" is not a directory`);
    process.exit(1);
  }

  if (source === target) {
    console.log("[sync-content] CONTENT_PATH already points at local content");
    process.exit(0);
  }

  mkdirSync(targetParent, { recursive: true });
  remove(target);
  console.log(`[sync-content] symlinking ${source} -> ${target}`);
  symlinkSync(source, target, "dir");
}
