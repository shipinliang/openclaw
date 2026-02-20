import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const here = path.dirname(fileURLToPath(import.meta.url));

function normalizeBase(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) {
    return "/";
  }
  if (trimmed === "./") {
    return "./";
  }
  if (trimmed.endsWith("/")) {
    return trimmed;
  }
  return `${trimmed}/`;
}

export default defineConfig(() => {
  const envBase = process.env.OPENCLAW_CONTROL_UI_BASE_PATH?.trim();
  const base = envBase ? normalizeBase(envBase) : "./";
  const nodeModules = path.resolve(here, "node_modules");
  return {
    base,
    publicDir: path.resolve(here, "public"),
    resolve: {
      alias: {
        "node:path": path.join(nodeModules, "path-browserify"),
        "node:os": path.join(nodeModules, "os-browserify"),
        "node:stream": path.join(nodeModules, "stream-browserify"),
        "node:events": path.join(nodeModules, "events"),
        "node:crypto": path.join(nodeModules, "crypto-browserify"),
        "node:util": path.join(nodeModules, "util"),
        "node:fs": path.join(nodeModules, "fs"),
        "node:fs/promises": path.join(nodeModules, "fs", "promises"),
        "node:child_process": path.join(nodeModules, "child_process"),
      },
    },
    optimizeDeps: {
      include: [
        "lit/directives/repeat.js",
        "path-browserify",
        "os-browserify",
        "fs",
        "child_process",
        "events",
        "util",
        "stream-browserify",
        "crypto-browserify",
      ],
      esbuildOptions: {
        define: {
          global: "globalThis",
        },
      },
    },
    build: {
      outDir: path.resolve(here, "../dist/control-ui"),
      emptyOutDir: true,
      sourcemap: true,
    },
    server: {
      host: true,
      port: 5173,
      strictPort: true,
    },
  };
});
