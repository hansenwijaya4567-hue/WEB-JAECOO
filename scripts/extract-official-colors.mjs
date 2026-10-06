/**
 * Parse bagian `#colors` di halaman model JAECOO Indonesia.
 *
 * Untuk tiap warna dipetakan dua hal:
 *   - nama warna resmi (dari `aria-label` tombol warna)
 *   - file foto besar warna tersebut
 *
 * Keduanya diambil dari markup yang sama (tombol warna dan slide foto berada
 * di section `#colors`), jadi pasangan nama-foto tidak bisa tertukar.
 *
 * CATATAN - script ini SENGAJA tidak mencoba membaca warna cat dari pixel
 * swatch. Percobaan pertama hacerlo dan hasilnya salah: swatch JAECOO bukan
 * chip warna datar, tapi ikon gradien dengan pantulan dan bayangan, sehingga
 * pixel paling dominan adalah refleksi, bukan warna cat. Contoh kegagalan:
 * "Stone Gray" terbaca sebagai biru (#527D97). Nilai `hex` di
 * `src/data/config.ts` karena itu tetap pendekatan manual yang terdokumentasi.
 *
 * Jalankan: node scripts/extract-official-colors.mjs
 */
import { writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PAGES = [
  ["j5", "https://jaecoo.id/model/jaecoo-j5-ev"],
  ["j7", "https://jaecoo.id/model/jaecoo-j7"],
  ["j8", "https://jaecoo.id/model/jaecoo-j8-shs-p-ardis"],
];

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36";

const unescape = (p) => decodeURIComponent(p);

/** Ambil potongan HTML bagian `#colors` saja. */
function colorsSection(html) {
  const start = html.indexOf('id="colors"');
  if (start === -1) return "";
  const end = html.indexOf('id="technology"', start);
  return html.slice(start, end === -1 ? start + 200000 : end);
}

function parseColors(section) {
  // Nama warna + file swatch, dari tombol warna (`aria-label="Show NAMA"`).
  const swatches = [];
  for (const m of section.matchAll(
    /aria-label="Show ([^"]+)"[\s\S]{0,700}?cms\.jaecoo\.id%2Fuploads%2F([^"&]+)[\s\S]{0,300}?<\/button>/g,
  )) {
    swatches.push({ name: m[1].trim().toUpperCase(), swatchFile: unescape(m[2]) });
  }

  // Foto warna besar, dari `alt` pada `<img>` di dalam slide.
  const photos = [];
  for (const m of section.matchAll(
    /alt="[^"]*?([A-Z][A-Z ]{3,35})"\s+width="\d+"\s+height="\d+"[\s\S]{0,400}?cms\.jaecoo\.id%2Fuploads%2F([^"&]+)/g,
  )) {
    photos.push({ name: m[1].trim().toUpperCase(), photoFile: unescape(m[2]) });
  }

  return swatches.map((swatch) => ({
    name: swatch.name,
    swatchFile: swatch.swatchFile,
    photoFile: photos.find((p) => p.name === swatch.name)?.photoFile ?? null,
  }));
}

const result = {};

for (const [key, url] of PAGES) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  const html = await res.text();
  const colors = parseColors(colorsSection(html));

  result[key] = { page: url, jumlahWarna: colors.length, colors };

  console.log(`\n${key.toUpperCase()} - ${colors.length} warna resmi`);
  for (const c of colors) {
    console.log(`  ${c.name.padEnd(28)} foto: ${c.photoFile ?? "(tidak ditemukan)"}`);
    console.log(`  ${"".padEnd(28)} swatch: ${c.swatchFile}`);
  }
}

writeFileSync(
  path.join(__dirname, "official-colors.json"),
  JSON.stringify(result, null, 2),
  "utf8",
);

console.log("\nTersimpan ke scripts/official-colors.json");
console.log("Cocokkan dengan COLOR_SLOTS di scripts/fetch-official-images.mjs.");
