// Skrip audit: cari karakter non-Latin yang tidak disengaja (CJK, Hiragana,
// Katakana, Hangul, fullwidth, replacement char) yang bisa menyusup ke source
// akibat masalah encoding. Jalankan: node scripts/audit-encoding.mjs
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SKIP = new Set(["node_modules", ".next", ".git", "out", "build"]);
const EXTS = new Set([".ts", ".tsx", ".mjs", ".js", ".json", ".css", ".md"]);

// CJK, Kana, Hangul, fullwidth forms, U+FFFD replacement character.
const SUSPECT =
  /[\uFFFD\u3000-\u30FF\u3400-\u4DBF\u4E00-\u9FFF\uAC00-\uD7AF\uFF01-\uFF60]/;

let files = 0;
const hits = [];

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    if (SKIP.has(entry)) continue;
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) {
      walk(full);
      continue;
    }
    if (!EXTS.has(path.extname(entry))) continue;
    files += 1;
    const lines = readFileSync(full, "utf8").split(/\r?\n/);
    lines.forEach((line, i) => {
      if (!SUSPECT.test(line)) return;
      const codes = [...line]
        .map((ch, idx) => [ch, idx])
        .filter(([ch]) => SUSPECT.test(ch))
        .map(([ch, idx]) => {
          const cp = ch.codePointAt(0);
          const around = line.slice(Math.max(0, idx - 30), idx + 30).trim();
          return `U+${cp.toString(16).toUpperCase().padStart(4, "0")} in "${around}"`;
        });
      hits.push({ file: path.relative(ROOT, full), line: i + 1, text: line.trim(), codes });
    });
  }
}

walk(ROOT);

for (const h of hits) {
  console.log(`HIT ${h.file}:${h.line}`);
  console.log(`    ${h.text}`);
  for (const c of h.codes) console.log(`    -> ${c}`);
}
console.log(`\nFile dipindai: ${files} | Baris bermasalah: ${hits.length}`);
process.exit(hits.length > 0 ? 1 : 0);