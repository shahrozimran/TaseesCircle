// Isolated UI fixtures: no production authentication, requests or database writes.
// Start `npm run dev -- --port 3101` first for the actual application stylesheet/fonts.
import { build } from "esbuild";
import fs from "node:fs";
import path from "node:path";
import http from "node:http";

const root = path.resolve(import.meta.dirname, "..");
const out = path.join(root, "output/playwright/fixtures");
fs.mkdirSync(out, { recursive: true });
const fixtures = path.join(root, "tests/fixtures");

await build({
  absWorkingDir: root,
  entryPoints: [path.join(fixtures, "preview.jsx")],
  outfile: path.join(out, "app.js"),
  bundle: true,
  format: "iife",
  jsx: "automatic",
  loader: { ".js": "jsx" },
  define: { "process.env.NODE_ENV": '"production"' },
  plugins: [
    {
      name: "local-fixtures",
      setup(builder) {
        const aliases = {
          "@/hooks/useAuth": "supabase.js",
          "@/lib/supabase/client": "supabase.js",
          "next/navigation": "navigation.js",
          "next/link": "link.jsx",
        };
        builder.onResolve(
          {
            filter:
              /^@\/hooks\/useAuth$|^@\/lib\/supabase\/client$|^next\/(navigation|link)$/,
          },
          (args) => ({ path: path.join(fixtures, aliases[args.path]) }),
        );
      },
    },
  ],
});

if (process.argv.includes("--build-only")) process.exit(0);
const original = await (await fetch("http://localhost:3101")).text();
const styles = [
  ...original.matchAll(/<link[^>]+href="([^"]+\.css[^\"]*)"[^>]*>/g),
]
  .map((match) => `<link rel="stylesheet" href="${match[1]}">`)
  .join("");
const classes = original.match(/<html[^>]+class="([^"]+)"/)?.[1] || "";

http
  .createServer(async (request, response) => {
    const url = new URL(request.url, "http://localhost:3102");
    if (url.pathname === "/app.js") {
      response.setHeader("Content-Type", "text/javascript");
      return response.end(fs.readFileSync(path.join(out, "app.js")));
    }
    if (url.pathname.startsWith("/_next/")) {
      try {
        const asset = await fetch("http://localhost:3101" + request.url);
        response.setHeader(
          "Content-Type",
          asset.headers.get("content-type") || "application/octet-stream",
        );
        return response.end(Buffer.from(await asset.arrayBuffer()));
      } catch {
        response.writeHead(502);
        return response.end("Start the local Next.js server on port 3101.");
      }
    }
    const locale = url.searchParams.get("lang") === "ur" ? "ur" : "en";
    response.setHeader("Content-Type", "text/html; charset=utf-8");
    response.end(
      `<!doctype html><html lang="${locale}" dir="${locale === "ur" ? "rtl" : "ltr"}" class="${classes}"><head>${styles}</head><body class="bg-beige-50 text-charcoal-500 font-body"><div id="root"></div><script src="/app.js"></script></body></html>`,
    );
  })
  .listen(3102, "127.0.0.1", () =>
    console.log(
      "Local fixture UI: http://localhost:3102/?screen=dashboard&lang=ur",
    ),
  );
