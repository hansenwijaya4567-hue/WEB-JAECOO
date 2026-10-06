/**
 * Kumpulkan URL gambar dari CDN resmi JAECOO Indonesia (cms.jaecoo.id).
 *
 * Script ini hanya MENGAMBIL DAFTAR URL - tidak mengunduh apa pun.
 * Hasilnya dipakai sebagai input `scripts/fetch-official-images.mjs`.
 *
 * Jalankan: node scripts/collect-official-images.mjs
 */
import { writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "official-images.json");

const PAGES = [
  ["j5", "https://jaecoo.id/model/jaecoo-j5-ev"],
  ["j7", "https://jaecoo.id/model/jaecoo-j7"],
  ["j8-shs", "https://jaecoo.id/model/jaecoo-j8-shs-p-ardis"],
  ["j8-awd", "https://jaecoo.id/model/jaecoo-j8-ardis"],
];

const CDN = "https://cms.jaecoo.id/uploads/";

function extract(html) {
  const found = new Set();

  // URL di-encode di dalam atribut srcSet milik Next.js: %2F untuk "/"
  for (const m of html.matchAll(/cms\.jaecoo\.id%2Fuploads%2F[^"&\\]+/g)) {
    found.add(CDN + decodeURIComponent(m[0].split("cms.jaecoo.id%2Fuploads%2F")[1]));
  }

  // URL yang sudah polos (meta og:image, JSON-LD)
  for (const m of html.matchAll(/https:\/\/cms\.jaecoo\.id\/uploads\/[^"'\\<\s]+/g)) {
    found.add(m[0]);
  }

  return [...found].sort();
}

/**
 * Nama warna muncul di `aria-label` atau `alt` tepat sebelum / di sekitar
 * gambar, jadi ambil juga pasangan label + file untuk majority matching manual.
 */
function extractLabeled(html) {
  const pairs = [];
  const re =
    /(?:aria-label|alt)="([^"]*(?:WHITE|BLACK|SILVER|GRAY|GREY|GREEN|BLUE|RED|GOLD|BRONZE|TWO TONE)[^"]*)"[^>]{0,400}?cms\.jaecoo\.id%2Fuploads%2F([^"&]+)/gi;
  for (const m of html.matchAll(re)) {
    pairs.push({ label: m[1].trim(), file: m[2] });
  }
  return pairs;
}

const result = {};

for (const [key, url] of PAGES) {
  process.stdout.write(`Mengambil ${key}... `);
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
      },
    });
    const html = await res.text();
    const images = extract(html);
    const labeled = extractLabeled(html);
    result[key] = { page: url, images, labeled };
    console.log(`${images.length} gambar`);
  } catch (error) {
    result[key] = { page: url, error: String(error), images: [], labeled: [] };
    console.log(`GAGAL: ${error}`);
  }
}

writeFileSync(OUT, JSON.stringify(result, null, 2), "utf8");
console.log(`\nTersimpan ke ${path.relative(process.cwd(), OUT)}`);
