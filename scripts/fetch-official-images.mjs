/**
 * Unduh foto produk resmi JAECOO Indonesia dari CDN resmi (cms.jaecoo.id).
 *
 * PENTING - HAK CIPTA
 * Foto-foto ini milik JAECOO. Dealer resmi biasanya boleh memakainya untuk
 * keperluan marketing, tapi itu DATANG DARI PROGRAM RESMI JAECOO, bukan
 * karena Technically boleh diambil dari internet. Sebelum site ini dipublikasikan:
 *   1. Hubungi hook Representative JAECOO Indonesia dan minta konfirmasi /
 *      permintaan aset marketing resmi untuk dealer (biasanya ada di paket
 *      Joining dealer).
 *   2. Kalau tidak mendapat izin, JANGAN pakai file di folder ini - ganti
 *      dengan foto unit asli dari showroom.
 * Jangan pernah ambil aset JAECOO dari Pinterest, Instagram, atau situs lain:
 * itu aset orang lain dan bisa kena masalah hukum.
 *
 * Script ini sengaja menyimpan ke `public/images/official/` dan TIDAK
 * menyentuh `src/data/config.ts`, supaya pemetaannya bisa dicek manusia
 * dulu sebelum dipakai.
 *
 * Jalankan: node scripts/fetch-official-images.mjs
 */
import { mkdir, writeFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "..", "public", "images", "official");
const CDN = "https://cms.jaecoo.id/uploads/";

/**
 * Pemetaan file lokal -> file di CDN.
 *
 * Nama file lokal dipilihemnetyap ada di `src/data/config.ts` supaya tidak
 * ada yang perlu diubah di sisi kode.
 *
 *_slot_ dipakai untuk warna, karena urutan warna resmi bisa berubah dan
 * urutan di config kita adalah hasil konfirmasi dealer - bukan urutan
 * di website pabrikan. Slot warna SENGAJA dikosongkan di sini; lihat
 * `COLOR_MAPPING` di bawah.
 */
/**
 * Lebar maksimum file lokal. Gambar asli dari pabrikan bisa 8000px lebih,
 * yang tidak ada gunanya untuk web (memperlambat halaman tanpa membuat
 * tampil lebih tajam di layar retina) tapi hundreds of KB lebih berat.
 */
const MAX_WIDTH = 2400;

const DOWNLOADS = [
  // ---- Hero & showcase model ----
  { local: "hero.jpg", remote: "Hero_Img_1_5b8420489a.jpg", note: "J5 hero" },
  { local: "model-j5.jpg", remote: "front_ac4df0c185.jpeg", note: "J5 3/4 depan" },
  { local: "model-j7.jpg", remote: "Group_37_295e2ad7dc.png", note: "J7 3/4" },
  { local: "model-j8.jpg", remote: "2880_x_1620_b0a150edf3.jpg", note: "J8 ARDIS" },

  // ---- Varian ----
  { local: "varian-j5-standard.jpg", remote: "Group_21_1_7f2fa8a308.png" },
  { local: "varian-j5-ev-premium.jpg", remote: "Group_24_3351333ce5.png" },
  { local: "varian-j7-shs.jpg", remote: "image_81707_5f7ebfdb9f.jpeg" },
  { local: "varian-j7-awd.jpg", remote: "Group_32_95b175f3dc.png" },
  { local: "varian-j8-awd.jpg", remote: "front_grille_d9baeb5290.jpg" },
  { local: "varian-j8-shs.jpg", remote: "J8_SHS_up_view_1_8d0eccd37f_1_f267ab568d.jpeg" },

  // ---- Detail eksterior ----
  { local: "detail-retractable-handles.jpg", remote: "Retractable_handles_21e6924afb.webp", note: "J7" },
  { local: "detail-wheels-j7.jpg", remote: "19_Wheels_2_e78d1fdf23.webp", note: "J7" },
  { local: "detail-tailgate-j7.jpg", remote: "rear_tailgate_c92df1a88c.jpg", note: "J7" },
  { local: "detail-waistline-j8.jpg", remote: "Waistline_c7641978f9.webp", note: "J8" },
  { local: "detail-handle-j8.jpg", remote: "J8_Handle_e00f41e484.jpg", note: "J8" },
  { local: "detail-front-j5.jpg", remote: "03_OL_97070cda8e.jpeg", note: "J5" },
  { local: "detail-trunk-j5.jpg", remote: "rear_trunk_202b50fca7_1_f6100a8588.png", note: "J5" },
  { local: "detail-led.jpg", remote: "LED_3b8645aaa9.webp", note: "J7" },
  { local: "detail-baterai-ip68.jpg", remote: "ip68_664f0ee41a.webp", note: "Baterai hybrid" },
  { local: "detail-mesin-15t.jpg", remote: "5th_generation_a76fa3bb8f.webp", note: "1.5TGDI" },
  { local: "detail-rear-j7.jpg", remote: "rear_view_df3c56c01b.webp", note: "J7" },
  { local: "detail-grille-j8.jpg", remote: "banner8_1_a429801a0d.webp", note: "J8" },

  // ---- Interior ----
  { local: "galeri-interior-1.jpg", remote: "phev_interior_a08740a37f.png", note: "Kabin PHEV" },
  { local: "galeri-interior-2.jpg", remote: "J7_Mobile_1_cfae94561e.png", note: "Kabin J7" },
  { local: "galeri-interior-3.jpg", remote: "810_x_1440_8ed47cac22.jpg", note: "Kabin J8" },

  // ---- Fitur / banner ----
  { local: "fitur-suv-premium.jpg", remote: "image_81704_1_277c2e39ba.jpeg" },
  { local: "fitur-teknologi.jpg", remote: "Frame_1171278251_4f133c471d.jpg" },
  { local: "fitur-performa.jpg", remote: "5th_generation_a76fa3bb8f.webp" },
  { local: "fitur-kenyamanan.jpg", remote: "LED_3b8645aaa9.webp" },
  { local: "banner-j8-shs.jpg", remote: "banner8_1_a429801a0d.webp" },
  { local: "banner-j8-top.jpg", remote: "2880_x_1620_b0a150edf3.jpg" },
];

/**
 * Slot warna.
 *
 * Nama warna resmi diambil dari `aria-label` tombol warna di halaman model
 * JAECOO Indonesia (lihat `extract-official-colors.mjs`). Dipasangkan dengan
 * foto warna resmi di halaman yang sama, jadi nama dan fotonya berasal dari
 * satu sumber dan tidak bisa tertukar.
 *
 * PENTING: `hex` TIDAK diambil dari sini. Swatch pabrikan adalah ikon gradien
 * dengan pantulan, bukan chip warna datar, jadi warna catnya tidak bisa
 * dibaca dari pixel. Nilai `hex` di `src/data/config.ts` adalah pendekatan
 * manual dan terdokumentasi sebagaisuch.
 */
const COLOR_SLOTS = [
  // ---- J5 (4 warna resmi) ----
  { local: "warna-j5-1.jpg", remote: "Group_23_69ecc3b907.png", name: "Pristine White" },
  { local: "warna-j5-2.jpg", remote: "Group_24_3351333ce5.png", name: "Jet Black" },
  { local: "warna-j5-3.jpg", remote: "Group_25_faf1e38e0f.png", name: "Ivory Gray" },
  { local: "warna-j5-4.jpg", remote: "Group_26_d78e5b40e0.png", name: "Forest Green" },

  // ---- J7 (5 warna resmi) ----
  { local: "warna-j7-1.jpg", remote: "Group_34_82f68abdb7.png", name: "Pristine White" },
  { local: "warna-j7-2.jpg", remote: "Group_35_67abb69ded.png", name: "Jet Black" },
  { local: "warna-j7-3.jpg", remote: "Group_32_95b175f3dc.png", name: "Stone Gray" },
  { local: "warna-j7-4.jpg", remote: "Group_33_037fb2157f.png", name: "Moonlight Silver" },
  { local: "warna-j7-5.jpg", remote: "Group_36_afef68046a.png", name: "Pristine White Two Tone" },

  // ---- J8 ARDIS (4 warna resmi) ----
  { local: "warna-j8-1.jpg", remote: "Group_29_9b5883e023.png", name: "Pristine White Two Tone" },
  { local: "warna-j8-2.jpg", remote: "Group_30_4da0e34d93.png", name: "Jet Black" },
  { local: "warna-j8-3.jpg", remote: "Group_27_e0237a1b2b.png", name: "Stone Gray" },
  { local: "warna-j8-4.jpg", remote: "Group_31_a8acb8f288.png", name: "Lunar Silver" },
];

async function exists(p) {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

async function fetchOne({ local, remote, note }, seen) {
  const outPath = path.join(OUT_DIR, local);

  if (await exists(outPath)) {
    console.log(`  = ${local} (sudah ada)`);
    return { local, status: "skip", remote };
  }

  const url = CDN + remote;
  if (seen.has(url)) {
    console.log(`  > ${local} (duplikat dari ${seen.get(url)}, dilewati)`);
    return { local, status: "duplicate", remote };
  }
  seen.set(url, local);

  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
      Referer: "https://jaecoo.id/",
    },
  });

  if (!res.ok) {
    console.log(`  ! ${local} - HTTP ${res.status}`);
    return { local, status: "error", remote, http: res.status };
  }

  const buf = Buffer.from(await res.arrayBuffer());

  // Semua file lokal disimpan sebagai .jpg supaya `config.ts` tidak perlu
  // berubah. Gambar asli bisa 8000px lebih, jadi dilebarkan ke MAX_WIDTH -
  // untuk layar retina 2400px sudah lebih dari cukup.
  await sharp(buf)
    .rotate()
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .flatten({ background: "#ffffff" })
    .jpeg({ quality: 84, progressive: true, mozjpeg: true })
    .toFile(outPath);

  const { size } = await stat(outPath);
  console.log(
    `  + ${local.padEnd(30)} ${(size / 1024).toFixed(0).padStart(5)} KB  ${remote}${note ? `  (${note})` : ""}`,
  );
  return { local, status: "ok", remote, bytes: size };
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  console.log("Mengunduh aset resmi JAECOO Indonesia...\n");
  const seen = new Map();
  const report = [];

  for (const item of DOWNLOADS) {
    report.push(await fetchOne(item, seen));
  }

  console.log("\nFoto warna resmi:");
  for (const slot of COLOR_SLOTS) {
    report.push(await fetchOne(slot, seen));
  }

  const ok = report.filter((r) => r.status === "ok").length;
  const failed = report.filter((r) => r.status === "error");

  console.log(`\nBerhasil: ${ok}/${report.length}`);
  if (failed.length > 0) {
    console.log(`Gagal: ${failed.map((f) => `${f.local} (${f.http})`).join(", ")}`);
  }

  await writeFile(
    path.join(OUT_DIR, "SUMBER.md"),
    `# Aset resmi JAECOO Indonesia

Unduh otomatis dari \`cms.jaecoo.id\` pada ${new Date().toISOString().slice(0, 10)}.

## Status: disetujui owner dealer

Pemilik dealer sudah memutuskan memakai aset ini tanpa perundingan tambahan,
dengan alasan dealership ini adalah dealer resmi JAECOO dan aset di sini
diambil dari kanal resmi JAECOO Indonesia (\`cms.jaecoo.id\`) - bukan dari
Pinterest, blog, atau scraping situs pihak lain.

Keputusan ini sudah dicatat di sini supaya tidak perlu dipertanyakan ulang
oleh developer berikutnya.

**Catatan faktual:** foto di folder ini tetap milik JAECOO. Kalau JAECOO
Indonesia sewaktu-waktu mengirim permintaan penghapusan, foto unit asli dari
showroom perlu disiapkan sebagai pengganti - tidak perlu sekarang.

## Kalau nanti butuh foto sendiri

- Timpa file di \`public/images/\` dengan nama file yang sama.
- \`npm run placeholders\` mengembalikan semuanya ke diagram SVG.`,
    "utf8",
  );
  console.log("\nCatatan asal aset ditulis ke public/images/official/SUMBER.md");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
