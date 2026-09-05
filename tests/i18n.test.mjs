import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { parse } from "@babel/parser";
import messages from "../src/lib/i18n/messages.mjs";
import {
  translateText,
  normalizeLocale,
  localeDirection,
  formatDate,
  formatRelativeTime,
  normalizeMessage,
  matchesLocalizedSearch,
} from "../src/lib/i18n/translate.mjs";

const root = path.resolve(import.meta.dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
function walk(node, visit, parents = []) {
  if (!node || typeof node !== "object") return;
  if (node.type) visit(node, parents);
  for (const [key, value] of Object.entries(node)) {
    if (["loc", "extra", "comments"].includes(key)) continue;
    if (Array.isArray(value))
      value.forEach((child) => walk(child, visit, [...parents, node]));
    else if (value && typeof value === "object")
      walk(value, visit, [...parents, node]);
  }
}
const ast = (file) =>
  parse(read(file), { sourceType: "module", plugins: ["jsx"] });
const sourceFiles = fs
  .readdirSync(path.join(root, "src"), { recursive: true })
  .filter((f) => f.endsWith(".js"))
  .map((f) => "src/" + f.replaceAll("\\", "/"));
const identifiers = new Set(["T", "U", "MK", "RRSP", "TFSA"]);

test("every catalogue entry restores the exact English source and supplies Urdu", () => {
  for (const [english, urdu] of Object.entries(messages)) {
    assert.equal(translateText(english, "en"), english);
    assert.ok(
      urdu.trim() &&
        (/[\u0600-\u06ff]/.test(urdu) ||
          !/[a-zA-Z]/.test(urdu.replace(/\{\w+\}/g, ""))),
      english,
    );
    const tokens = (s) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();
    assert.deepEqual(
      tokens(urdu),
      tokens(english),
      "Interpolation mismatch: " + english,
    );
  }
});

test("only supported cookie values choose Urdu and directions are deterministic", () => {
  assert.equal(normalizeLocale("ur"), "ur");
  for (const value of [undefined, null, "ar", "UR", "ur-PK", "<script>", "en"])
    assert.equal(normalizeLocale(value), "en");
  assert.equal(localeDirection("ur"), "rtl");
  assert.equal(localeDirection("en"), "ltr");
});

test("templates preserve user names, codes, quotes and markup-like values", () => {
  assert.equal(translateText("Members (42)", "ur"), "اراکین (42)");
  assert.equal(
    translateText("Members ({count})", "ur", { count: 42 }),
    "اراکین (42)",
  );
  const name = "Home <b>Ali</b> $&";
  const message = translateText(
    'Your Masjid "{name}" has been approved! Your circle code is: {code}.',
    "ur",
    { name, code: "A7K3X9" },
  );
  assert.ok(message.includes(name));
  assert.ok(message.includes("A7K3X9"));
  const legacy = translateText(
    'Your Masjid "{name}" has been approved! Your circle code is: {code}.',
    "en",
    { name, code: "A7K3X9" },
  );
  assert.equal(translateText(legacy, "ur"), message);
  assert.match(
    translateText(
      "Your role in Home has been updated to Circle Admin by TaseesCircle Admin.",
      "ur",
    ),
    /حلقے کا منتظم/,
  );
  assert.equal(
    translateText("My own message mentions Home and Members (42).", "ur"),
    "My own message mentions Home and Members (42).",
  );
  assert.equal(translateText("user@example.com", "ur"), "user@example.com");
  assert.equal(translateText("  Home\n", "ur"), "  صفحۂ اول\n");
});

test("all authored editorial data has translations while Arabic bypasses lookup", () => {
  const fields = new Set([
    "title",
    "subtitle",
    "description",
    "excerpt",
    "intro",
    "heading",
    "content",
    "conclusion",
    "translation",
    "text",
    "surah",
    "source",
    "grade",
    "quote",
    "bio",
    "label",
    "question",
    "answer",
    "readTime",
    "authorTitle",
  ]);
  for (const file of sourceFiles.filter((f) => f.startsWith("src/data/"))) {
    walk(ast(file), (node, parents) => {
      if (node.type !== "StringLiteral") return;
      const parent = parents.at(-1);
      if (parent?.type !== "ObjectProperty") return;
      if (parent.key.name === "arabic") {
        assert.equal(translateText(node.value, "ur"), node.value);
        assert.equal(translateText(node.value, "en"), node.value);
      } else if (fields.has(parent.key.name) && /[a-zA-Z]/.test(node.value)) {
        assert.notEqual(
          translateText(node.value, "ur"),
          node.value,
          file + ": " + node.value,
        );
      }
    });
  }
});

test("all literal JSX copy has a translation and an explicit translation boundary", () => {
  for (const file of sourceFiles.filter((f) => !f.includes("/i18n/"))) {
    walk(ast(file), (node, parents) => {
      if (node.type !== "JSXText") return;
      const text = normalizeMessage(node.value);
      if (!/[a-zA-Z]/.test(text) || identifiers.has(text) || text.includes("@"))
        return;
      assert.notEqual(translateText(text, "ur"), text, file + ": " + text);
      assert.ok(
        parents.some(
          (p) => p.type === "JSXElement" && p.openingElement.name.name === "T",
        ),
        "Missing <T>: " + file + ": " + text,
      );
    });
  }
});

test("Arabic passages are byte-for-byte unchanged from the pre-feature baseline", () => {
  const hashes = [];
  for (const file of sourceFiles.filter((f) => !f.includes("/i18n/"))) {
    walk(ast(file), (node, parents) => {
      if (
        (node.type === "StringLiteral" &&
          parents.at(-1)?.type === "ObjectProperty" &&
          parents.at(-1).key.name === "arabic") ||
        (node.type === "JSXText" &&
          /[\u0600-\u06ff]/.test(node.value) &&
          !/[a-zA-Z]/.test(node.value))
      ) {
        hashes.push(
          file +
            ":" +
            createHash("sha256").update(node.value.trim()).digest("hex"),
        );
      }
    });
  }
  assert.deepEqual(
    hashes.sort(),
    JSON.parse(read("tests/arabic-baseline.json")),
  );
  for (const file of [
    "src/components/ui/QuranBlock.js",
    "src/components/ui/DiscussionCard.js",
    "src/app/discussions/DiscussionsLandingClient.js",
  ]) {
    assert.match(read(file), /lang="ar" translate="no"/);
  }
});

test("dates and relative times use the selected locale", () => {
  const now = Date.UTC(2026, 8, 5, 12);
  assert.equal(formatRelativeTime(now - 30000, "ur", now), "ابھی");
  assert.match(formatRelativeTime(now - 3600000, "ur", now), /[\u0600-\u06ff]/);
  assert.match(formatRelativeTime(now - 3600000, "en", now), /ago/);
  assert.match(
    formatDate("2026-09-05T12:00:00Z", "ur", {
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }),
    /ستمبر/,
  );
  assert.equal(formatDate("invalid", "ur"), "invalid");
});

test("search accepts English and Urdu without changing filter values", () => {
  assert.ok(matchesLocalizedSearch("فری لانسنگ", "Freelancing"));
  assert.ok(matchesLocalizedSearch("freelancing", "Freelancing"));
  assert.ok(!matchesLocalizedSearch("unrelated", "Freelancing"));
});
