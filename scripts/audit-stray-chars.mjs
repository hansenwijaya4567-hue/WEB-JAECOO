/**
 * Audit tambahan: cari karakter asing (CJK/Cyrillic/Arabic/dll) dan token
 * sampah yang pernah muncul karena salah ketik saat menyunting file.
 *
 * Berbeda dengan `audit-encoding.mjs` yang mengejar pola mojibake UTF-8,
 * skrip ini mencari karakter non-Latin sama sekali, karena di file
 * berbahasa Indonesia tidak seharusnya ada.
 *
 * Jalankan: node scripts/audit-stray-chars.mjs
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const SCAN_DIRS = ["src", "scripts"];
const SKIP = new Set(["node_modules", ".next", ".git", "out"]);

const EXTENSIONS = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".mjs",
  ".cjs",
  ".jsx",
  ".css",
  ".json",
  ".md",
  ".mjs",
]);

/** Rentang skrip yang tidak mungkin muncul di file berbahasa Indonesia. */
const FOREIGN_SCRIPTS = [
  { name: "CJK", re: /[\u3000-\u9fff\uf900-\ufaff]/g },
  { name: "Hiragana/Katakana", re: /[\u3040-\u30ff]/g },
  { name: "Hangul", re: /[\uac00-\ud7af]/g },
  { name: "Cyrillic", re: /[\u0400-\u04ff]/g },
  { name: "Arabic", re: /[\u0600-\u06ff]/g },
  { name: "Hebrew", re: /[\u0590-\u05ff]/g },
  { name: "Thai", re: /[\u0e00-\u0e7f]/g },
  { name: "Devanagari", re: /[\u0900-\u097f]/g },
];

/**
 * Kata-kata hasil salah ketik yang pernah muncul. Ini daftar eksplisit,
 * bukan kamus, jadi penambahannya murah dan tidak menghasilkan false positive.
 */
const SUSPECT_WORDS = [
  "recited",
  "cotizacion",
  "TantaXi",
  "kenyattan",
  "berbedaOpin",
  "nayati",
  "nayatinya",
  "Metalik", // kapital di tengah kalimat bukan bahasa Indonesia
];

function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    if (SKIP.has(entry)) continue;
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) {
      yield* walk(full);
    } else if (EXTENSIONS.has(path.extname(full))) {
      yield full;
    }
  }
}

let issues = 0;
let files = 0;

for (const dir of SCAN_DIRS) {
  const abs = path.join(ROOT, dir);
  let entries;
  try {
    entries = [...walk(abs)];
  } catch {
    continue;
  }

  for (const file of entries) {
    files += 1;
    const rel = path.relative(ROOT, file);
    // Daftar kata di bawah memang memuat kata-kata tersebut, jadi file ini
    // tidak boleh memindai dirinya sendiri.
    if (rel.replace(/\\/g, "/") === "scripts/audit-stray-chars.mjs") continue;
    const lines = readFileSync(file, "utf8").split(/\r?\n/);

    lines.forEach((line, index) => {
      const found = [];

      for (const { name, re } of FOREIGN_SCRIPTS) {
        const match = line.match(re);
        if (match) {
          found.push(
            `karakter ${name}: ${[...new Set(match)].map((c) => `${c} (U+${c.codePointAt(0).toString(16).toUpperCase().padStart(4, "0")})`).join(", ")}`,
          );
        }
      }

      for (const word of SUSPECT_WORDS) {
        if (line.includes(word)) {
          found.push(`kata suspects: "${word}"`);
        }
      }

      if (found.length > 0) {
        issues += 1;
        console.log(`${rel}:${index + 1}  ${found.join(" | ")}`);
        console.log(`    ${line.trim().slice(0, 140)}`);
      }
    });
  }
}

console.log(`\nFile dipindai: ${files} | Baris bermasalah: ${issues}`);

if (issues > 0) {
  console.log("Perbaiki baris di atas sebelum publish.");
  process.exitCode = 1;
}
