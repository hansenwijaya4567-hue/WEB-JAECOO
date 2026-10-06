/**
 * Pasang foto resmi JAECOO (hasil `fetch-official-images.mjs`) ke nama file
 * yang dipakai `src/data/config.ts`.
 *
 * Kenapa menyalin, bukan mengganti path di config:
 * - `config.ts` tidak perlu diubah sama sekali.
 * - Sutton cara rollback: jalankan `npm run placeholders` dan semua foto
 *   placeholder kembali, tanpa menyentuh kode.
 * - Nanti saat kamu punya foto unit asli dari showroom, tinggal simpan dengan
 *   nama yang sama (`varian-j8-awd.jpg`, `warna-j7-2.jpg`, dst) dan file ini
 *   langsung tergantikan.
 *
 * Jalankan: node scripts/install-official-images.mjs
 */
import { copyFile, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(__dirname, "..", "public", "images", "official");
const DEST = path.join(__dirname, "..", "public", "images");

/**
 * Nama file resmi -> nama file yang dipakai config.
 *
 * Foto warna dipasang dengan nama file yang sama. Pasangan nama warna dan
 * foto sudah diverifikasi dari satu sumber (aria-label tombol warna dan foto
 * di section `#colors` halaman model JAECOO Indonesia), jadi tidak ada
 * risiko foto Stone Gray tampil dengan label warna lain.
 *
 * Urutannya harus sama persis dengan `modelColors` di `src/data/config.ts`:
 *   J5  - Pristine White, Jet Black, Ivory Gray, Forest Green
 *   J7  - Pristine White, Jet Black, Stone Gray, Moonlight Silver,
 *         Pristine White Two Tone
 *   J8  - Pristine White Two Tone, Jet Black, Stone Gray, Lunar Silver
 */
const INSTALL = {
  // Dipasang langsung oleh `fetch-official-images.mjs` dengan nama yang sama.
  "hero.jpg": "hero.jpg",
  "model-j5.jpg": "model-j5.jpg",
  "model-j7.jpg": "model-j7.jpg",
  "model-j8.jpg": "model-j8.jpg",
  "varian-j5-standard.jpg": "varian-j5-standard.jpg",
  "varian-j5-ev-premium.jpg": "varian-j5-ev-premium.jpg",
  "varian-j7-shs.jpg": "varian-j7-shs.jpg",
  "varian-j7-awd.jpg": "varian-j7-awd.jpg",
  "varian-j8-awd.jpg": "varian-j8-awd.jpg",
  "varian-j8-shs.jpg": "varian-j8-shs.jpg",
  "fitur-suv-premium.jpg": "fitur-suv-premium.jpg",
  "fitur-teknologi.jpg": "fitur-teknologi.jpg",
  // `fetch-official-images.mjs` melewati kedua file ini karena URL-nya sama
  // dengan file detail, jadi_INSTALL_ memakai file detail yang sama.
  "detail-mesin-15t.jpg": "fitur-performa.jpg",
  "detail-led.jpg": "fitur-kenyamanan.jpg",

  // Foto detail dipakai untuk isi galeri.
  "detail-front-j5.jpg": "galeri-eksterior-1.jpg",
  "detail-waistline-j8.jpg": "galeri-eksterior-2.jpg",
  "detail-tailgate-j7.jpg": "galeri-eksterior-3.jpg",
  "galeri-interior-1.jpg": "galeri-interior-1.jpg",
  "galeri-interior-2.jpg": "galeri-interior-2.jpg",
  "galeri-interior-3.jpg": "galeri-interior-3.jpg",
  "detail-baterai-ip68.jpg": "galeri-fitur-1.jpg",
  "detail-handle-j8.jpg": "galeri-fitur-2.jpg",
  "detail-retractable-handles.jpg": "galeri-fitur-3.jpg",

  // ---- Foto warna resmi ----
  "warna-j5-1.jpg": "warna-j5-1.jpg",
  "warna-j5-2.jpg": "warna-j5-2.jpg",
  "warna-j5-3.jpg": "warna-j5-3.jpg",
  "warna-j5-4.jpg": "warna-j5-4.jpg",
  "warna-j7-1.jpg": "warna-j7-1.jpg",
  "warna-j7-2.jpg": "warna-j7-2.jpg",
  "warna-j7-3.jpg": "warna-j7-3.jpg",
  "warna-j7-4.jpg": "warna-j7-4.jpg",
  "warna-j7-5.jpg": "warna-j7-5.jpg",
  "warna-j8-1.jpg": "warna-j8-1.jpg",
  "warna-j8-2.jpg": "warna-j8-2.jpg",
  "warna-j8-3.jpg": "warna-j8-3.jpg",
  "warna-j8-4.jpg": "warna-j8-4.jpg",
};

async function main() {
  let ok = 0;
  const missing = [];

  for (const [from, to] of Object.entries(INSTALL)) {
    const src = path.join(SRC, from);
    const dest = path.join(DEST, to);

    try {
      await access(src);
    } catch {
      missing.push(from);
      continue;
    }

    await copyFile(src, dest);
    console.log(`  ${from.padEnd(34)} -> ${to}`);
    ok += 1;
  }

  console.log(`\n${ok} foto terpasang.`);
  console.log("Rollback: `npm run placeholders` mengembalikan semua foto placeholder.");

  if (missing.length > 0) {
    console.log(`\nTidak ditemukan: ${missing.join(", ")}`);
    console.log("Jalankan `node scripts/fetch-official-images.mjs` dulu.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
