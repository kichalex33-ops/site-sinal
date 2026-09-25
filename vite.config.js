import { defineConfig } from "vite";
import { globSync } from "glob";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));

function htmlInputs() {
  const files = globSync("**/index.html", {
    cwd: root,
    ignore: ["node_modules/**", "dist/**", ".claude/**", "SINAL_RUIDO_WEB_DINAMICO_COMENTARIOS/**"],
  });
  const entries = {};
  for (const f of files) {
    const key = f === "index.html" ? "index" : f.replace(/\/index\.html$/, "").replace(/\//g, "_");
    entries[key] = resolve(root, f);
  }
  return entries;
}

export default defineConfig({
  build: {
    rollupOptions: {
      input: htmlInputs(),
    },
  },
});
