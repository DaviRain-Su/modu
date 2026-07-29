#!/usr/bin/env node
/**
 * Nitro/Vercel bundles `@electric-sql/pglite` JS into `_libs/electric-sql__pglite.mjs`
 * but drops the adjacent WASM/data files. At runtime PGLite does:
 *   open('.../_libs/pglite.data')  → ENOENT → HTTP 500 on every auth write.
 *
 * Copy the assets next to the bundled module after `vite build`.
 */
import { copyFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const srcDir = join(root, "node_modules/@electric-sql/pglite/dist");
const outRoots = [
  join(root, ".vercel/output/functions/__server.func"),
  join(root, ".output/server"),
  join(root, "dist/server"),
];

const files = ["pglite.data", "pglite.wasm", "initdb.wasm"];

function findLibDirs(base) {
  if (!existsSync(base)) return [];
  const dirs = [base];
  const libs = join(base, "_libs");
  if (existsSync(libs)) dirs.push(libs);
  // Also search one level for any folder that already has the pglite bundle
  try {
    for (const name of readdirSync(base, { withFileTypes: true })) {
      if (!name.isDirectory()) continue;
      const sub = join(base, name.name);
      if (existsSync(join(sub, "electric-sql__pglite.mjs")) || name.name === "_libs") {
        dirs.push(sub);
      }
    }
  } catch {
    /* ignore */
  }
  return dirs;
}

let copied = 0;
for (const out of outRoots) {
  for (const dir of findLibDirs(out)) {
    for (const file of files) {
      const from = join(srcDir, file);
      if (!existsSync(from)) continue;
      mkdirSync(dir, { recursive: true });
      const to = join(dir, file);
      copyFileSync(from, to);
      copied += 1;
      console.log(`[copy-pglite] ${file} → ${to}`);
    }
  }
}

if (copied === 0) {
  console.warn(
    "[copy-pglite] No server output dirs found yet — skip (dev-only?). " +
      "Expected .vercel/output/functions/__server.func after production build.",
  );
  process.exit(0);
}

console.log(`[copy-pglite] done (${copied} files)`);
