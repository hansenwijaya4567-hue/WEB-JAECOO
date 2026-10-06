/**
 * Generator placeholder image.
 *
 * Jalankan: node scripts/generate-placeholders.mjs
 *
 * Menghasilkan file JPG placeholder di /public/images dengan nama yang
 * sama dengan file yang dipakai src/data/config.ts. Setelah gambar asli
 * tersedia, cukup ganti file-nya - tidak perlu menyentuh kode.
 */

import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "..", "public", "images");

/* ------------------------------------------------------------------ */
/*  Helper SVG                                                         */
/* ------------------------------------------------------------------ */

const escape = (value) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

/**
 * Placeholder berbentuk foto produk: gradient teal + siluet mobil + label.
 */
function carPlaceholder({
  width,
  height,
  label,
  sublabel,
  hue = 0,
  paint,
}) {
  const cx = width / 2;
  const cy = height / 2;
  const scale = Math.min(width, height) / 1000;
  const labelSize = Math.max(18, Math.round(38 * scale));
  const subSize = Math.max(13, Math.round(20 * scale));

  // Siluet mobil sederhana (path relatif terhadap kotak 1000x520).
  const carW = 640 * scale;
  const carH = 250 * scale;
  const carX = cx - carW / 2;
  const carY = cy - carH / 2 + 40 * scale;

  const carPath = `
    M ${carX + carW * 0.06} ${carY + carH * 0.62}
    C ${carX + carW * 0.04} ${carY + carH * 0.5},
      ${carX + carW * 0.14} ${carY + carH * 0.46},
      ${carX + carW * 0.22} ${carY + carH * 0.45}
    L ${carX + carW * 0.34} ${carY + carH * 0.2}
    C ${carX + carW * 0.4} ${carY + carH * 0.1},
      ${carX + carW * 0.46} ${carY + carH * 0.08},
      ${carX + carW * 0.58} ${carY + carH * 0.08}
    C ${carX + carW * 0.72} ${carY + carH * 0.08},
      ${carX + carW * 0.78} ${carY + carH * 0.14},
      ${carX + carW * 0.84} ${carY + carH * 0.3}
    L ${carX + carW * 0.94} ${carY + carH * 0.44}
    C ${carX + carW * 0.99} ${carY + carH * 0.48},
      ${carX + carW} ${carY + carH * 0.56},
      ${carX + carW} ${carY + carH * 0.66}
    L ${carX + carW * 0.97} ${carY + carH * 0.78}
    L ${carX + carW * 0.04} ${carY + carH * 0.78}
    C ${carX + carW * 0.01} ${carY + carH * 0.72},
      ${carX + carW * 0.01} ${carY + carH * 0.66},
      ${carX + carW * 0.06} ${carY + carH * 0.62}
    Z`;

  const wheelY = carY + carH * 0.78;
  const wheelR = carH * 0.13;
  const wheel1X = carX + carW * 0.24;
  const wheel2X = carX + carW * 0.78;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="hsl(${186 + hue}, 62%, ${22 + (hue % 7)}%)"/>
      <stop offset="55%" stop-color="hsl(${189 + hue}, 58%, ${32 + (hue % 5)}%)"/>
      <stop offset="100%" stop-color="hsl(${196 + hue}, 52%, ${18 + (hue % 6)}%)"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="42%" r="62%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="${width}" height="${height}" fill="url(#bg)"/>
  <rect width="${width}" height="${height}" fill="url(#glow)"/>

  <!-- grid dekoratif -->
  <g stroke="#ffffff" stroke-opacity="0.06" stroke-width="1">
    ${Array.from({ length: Math.ceil(width / 64) + 1 }, (_, i) => {
      const x = i * 64;
      return `<line x1="${x}" y1="0" x2="${x}" y2="${height}"/>`;
    }).join("")}
    ${Array.from({ length: Math.ceil(height / 64) + 1 }, (_, i) => {
      const y = i * 64;
      return `<line x1="0" y1="${y}" x2="${width}" y2="${y}"/>`;
    }).join("")}
  </g>

  <!-- siluet mobil -->
  <g>
    <ellipse cx="${cx}" cy="${carY + carH * 1.02}" rx="${carW * 0.46}" ry="${carH * 0.09}"
      fill="#000000" fill-opacity="0.28"/>
    <path d="${carPath}" fill="${paint ?? "#ffffff"}"
      fill-opacity="${paint ? "0.92" : "0.16"}"
      stroke="#ffffff" stroke-opacity="${paint ? "0.34" : "0.5"}" stroke-width="${Math.max(1.5, 2.4 * scale)}"
      stroke-linejoin="round"/>
    <path d="M ${carX + carW * 0.36} ${carY + carH * 0.44}
             L ${carX + carW * 0.44} ${carY + carH * 0.16}
             L ${carX + carW * 0.62} ${carY + carH * 0.16}
             L ${carX + carW * 0.74} ${carY + carH * 0.44} Z"
      fill="#ffffff" fill-opacity="${paint ? "0.16" : "0.1"}"/>
    <circle cx="${wheel1X}" cy="${wheelY}" r="${wheelR}" fill="#0b0f11" fill-opacity="0.72"
      stroke="#ffffff" stroke-opacity="0.42" stroke-width="${Math.max(1.4, 2 * scale)}"/>
    <circle cx="${wheel1X}" cy="${wheelY}" r="${wheelR * 0.42}" fill="#ffffff" fill-opacity="0.35"/>
    <circle cx="${wheel2X}" cy="${wheelY}" r="${wheelR}" fill="#0b0f11" fill-opacity="0.72"
      stroke="#ffffff" stroke-opacity="0.42" stroke-width="${Math.max(1.4, 2 * scale)}"/>
    <circle cx="${wheel2X}" cy="${wheelY}" r="${wheelR * 0.42}" fill="#ffffff" fill-opacity="0.35"/>
  </g>

  <!-- label -->
  <text x="${cx}" y="${cy - carH * 0.72}" text-anchor="middle"
    font-family="Inter, Segoe UI, Arial, sans-serif" font-size="${labelSize}"
    font-weight="800" fill="#ffffff" letter-spacing="1.5">${escape(label)}</text>
  <text x="${cx}" y="${cy - carH * 0.72 + labelSize * 1.5}" text-anchor="middle"
    font-family="Inter, Segoe UI, Arial, sans-serif" font-size="${subSize}"
    font-weight="600" fill="#ffffff" fill-opacity="0.62">${escape(sublabel)}</text>

  <text x="${cx}" y="${height - subSize * 2.1}" text-anchor="middle"
    font-family="Inter, Segoe UI, Arial, sans-serif" font-size="${subSize}"
    font-weight="700" fill="#ffffff" fill-opacity="0.4" letter-spacing="2">PLACEHOLDER</text>
</svg>`;
}

/**
 * Placeholder potret untuk foto testimonial / foto orang.
 */
function portraitPlaceholder({ width, height, label, initials, hue }) {
  const cx = width / 2;
  const cy = height * 0.4;
  const headR = Math.min(width, height) * 0.19;
  const fontSize = Math.round(headR * 1.15);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="hsl(${178 + hue}, 45%, 88%)"/>
      <stop offset="100%" stop-color="hsl(${196 + hue}, 42%, 76%)"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#bg)"/>
  <circle cx="${cx}" cy="${cy + headR * 1.5}" r="${headR * 1.75}" fill="#0f7a83" fill-opacity="0.22"/>
  <circle cx="${cx}" cy="${cy}" r="${headR}" fill="#0f7a83" fill-opacity="0.38"/>
  <text x="${cx}" y="${cy + fontSize * 0.34}" text-anchor="middle"
    font-family="Inter, Segoe UI, Arial, sans-serif" font-size="${fontSize}"
    font-weight="800" fill="#ffffff">${escape(initials)}</text>
  <text x="${cx}" y="${height - height * 0.09}" text-anchor="middle"
    font-family="Inter, Segoe UI, Arial, sans-serif" font-size="${Math.round(width * 0.09)}"
    font-weight="700" fill="#0b0f11" fill-opacity="0.55">${escape(label)}</text>
</svg>`;
}

/* ------------------------------------------------------------------ */
/*  DAFTAR GAMBAR                                                      */
/* ------------------------------------------------------------------ */

const PLACEHOLDERS = [
  // Hero - besar, wide
  { file: "hero.jpg", kind: "car", w: 1600, h: 1067, label: "JAECOO J5 J7 J8", sublabel: "HERO - GANTI DENGAN FOTO UNIT", hue: 0 },

  // Model showcase
  { file: "model-j5.jpg", kind: "car", w: 1000, h: 750, label: "JAECOO J5", sublabel: "SUV Listrik", hue: 2 },
  { file: "model-j7.jpg", kind: "car", w: 1000, h: 750, label: "JAECOO J7", sublabel: "Super Hybrid System", hue: 0 },
  { file: "model-j8.jpg", kind: "car", w: 1000, h: 750, label: "JAECOO J8 ARDIS", sublabel: "SUV 7-Seater", hue: -3 },

  // Varian
  { file: "varian-j5-standard.jpg", kind: "car", w: 1200, h: 750, label: "J5 Standard", sublabel: "Varian J5", hue: 2 },
  { file: "varian-j5-ev-premium.jpg", kind: "car", w: 1200, h: 750, label: "J5 EV Premium", sublabel: "Varian J5", hue: 0 },
  { file: "varian-j7-shs.jpg", kind: "car", w: 1200, h: 750, label: "J7 SHS", sublabel: "Varian J7", hue: -2 },
  { file: "varian-j7-awd.jpg", kind: "car", w: 1200, h: 750, label: "J7 AWD", sublabel: "Varian J7", hue: -5 },
  { file: "varian-j8-awd.jpg", kind: "car", w: 1200, h: 750, label: "J8 AWD", sublabel: "Varian J8", hue: -8 },
  { file: "varian-j8-shs.jpg", kind: "car", w: 1200, h: 750, label: "J8 SHS", sublabel: "Varian J8", hue: -11 },

  // Warna - per model. `paint` mewarnai bodi mobil sesuai warna cat, jadi
  // calon pembeli bisa membedakan nuansa tiap warna meski fotonya masih
  // placeholder. `paint` harus sama dengan `hex` di src/data/config.ts.
  //
  // Jumlah warna mengikuti daftar resmi di jaecoo.id: J5 = 4, J7 = 5, J8 = 4.
  { file: "warna-j5-1.jpg", kind: "car", w: 1200, h: 750, label: "J5", sublabel: "Pristine White", hue: 6, paint: "#EDEEEF" },
  { file: "warna-j5-2.jpg", kind: "car", w: 1200, h: 750, label: "J5", sublabel: "Jet Black", hue: 14, paint: "#141719" },
  { file: "warna-j5-3.jpg", kind: "car", w: 1200, h: 750, label: "J5", sublabel: "Ivory Gray", hue: 20, paint: "#C9C6BE" },
  { file: "warna-j5-4.jpg", kind: "car", w: 1200, h: 750, label: "J5", sublabel: "Forest Green", hue: 26, paint: "#3A4A3F" },

  { file: "warna-j7-1.jpg", kind: "car", w: 1200, h: 750, label: "J7", sublabel: "Pristine White", hue: 4, paint: "#EDEEEF" },
  { file: "warna-j7-2.jpg", kind: "car", w: 1200, h: 750, label: "J7", sublabel: "Jet Black", hue: 12, paint: "#17181A" },
  { file: "warna-j7-3.jpg", kind: "car", w: 1200, h: 750, label: "J7", sublabel: "Stone Gray", hue: 18, paint: "#6B705C" },
  { file: "warna-j7-4.jpg", kind: "car", w: 1200, h: 750, label: "J7", sublabel: "Moonlight Silver", hue: 24, paint: "#C2C6CA" },
  { file: "warna-j7-5.jpg", kind: "car", w: 1200, h: 750, label: "J7", sublabel: "Pristine White Two Tone", hue: 30, paint: "#DDE0E2" },

  { file: "warna-j8-1.jpg", kind: "car", w: 1200, h: 750, label: "J8", sublabel: "Pristine White Two Tone", hue: 2, paint: "#DDE0E2" },
  { file: "warna-j8-2.jpg", kind: "car", w: 1200, h: 750, label: "J8", sublabel: "Jet Black", hue: 10, paint: "#141719" },
  { file: "warna-j8-3.jpg", kind: "car", w: 1200, h: 750, label: "J8", sublabel: "Stone Gray", hue: 16, paint: "#5F6B5C" },
  { file: "warna-j8-4.jpg", kind: "car", w: 1200, h: 750, label: "J8", sublabel: "Lunar Silver", hue: 22, paint: "#C4C8CC" },

  // Galeri
  { file: "galeri-eksterior-1.jpg", kind: "car", w: 1200, h: 900, label: "Eksterior", sublabel: "Tampak Depan", hue: 1 },
  { file: "galeri-eksterior-2.jpg", kind: "car", w: 1200, h: 900, label: "Eksterior", sublabel: "Samping", hue: 4 },
  { file: "galeri-eksterior-3.jpg", kind: "car", w: 1200, h: 900, label: "Eksterior", sublabel: "Belakang", hue: 7 },
  { file: "galeri-interior-1.jpg", kind: "car", w: 1200, h: 900, label: "Interior", sublabel: "Dasbor", hue: 10 },
  { file: "galeri-interior-2.jpg", kind: "car", w: 1200, h: 900, label: "Interior", sublabel: "Kursi", hue: 12 },
  { file: "galeri-interior-3.jpg", kind: "car", w: 1200, h: 900, label: "Interior", sublabel: "Infotainment", hue: 15 },
  { file: "galeri-fitur-1.jpg", kind: "car", w: 1200, h: 900, label: "Fitur", sublabel: "Kamera 360 Derajat", hue: 17 },
  { file: "galeri-fitur-2.jpg", kind: "car", w: 1200, h: 900, label: "Fitur", sublabel: "Pencahayaan", hue: 19 },
  { file: "galeri-fitur-3.jpg", kind: "car", w: 1200, h: 900, label: "Fitur", sublabel: "Prosesori", hue: 21 },

  // Keunggulan
  { file: "fitur-suv-premium.jpg", kind: "car", w: 1000, h: 750, label: "SUV Premium", sublabel: "Desain & Dimensi", hue: 3 },
  { file: "fitur-teknologi.jpg", kind: "car", w: 1000, h: 750, label: "Teknologi Cerdas", sublabel: "ADAS & Kamera 360", hue: 8 },
  { file: "fitur-performa.jpg", kind: "car", w: 1000, h: 750, label: "Performa Andal", sublabel: "EV - SHS - AWD", hue: 13 },
  { file: "fitur-kenyamanan.jpg", kind: "car", w: 1000, h: 750, label: "Kenyamanan", sublabel: "Kabin & Kursi", hue: 16 },

  // Testimoni
  { file: "testimoni-1.jpg", kind: "portrait", w: 400, h: 400, label: "Pelanggan", initials: "01", hue: 0 },
  { file: "testimoni-2.jpg", kind: "portrait", w: 400, h: 400, label: "Pelanggan", initials: "02", hue: 22 },
  { file: "testimoni-3.jpg", kind: "portrait", w: 400, h: 400, label: "Pelanggan", initials: "03", hue: 45 },
  { file: "testimoni-4.jpg", kind: "portrait", w: 400, h: 400, label: "Pelanggan", initials: "04", hue: 68 },

  // Open Graph
  {
    file: "og-cover.jpg",
    kind: "og",
    w: 1200,
    h: 630,
    label: "JAECOO J5 J7 J8",
    sublabel: "Dealer Resmi Medan",
    price: "Rp313.800.000",
    badge: "PROMO BULAN INI",
    hue: 0,
  },
];

/* ------------------------------------------------------------------ */
/*  OG COVER (komposisi khusus)                                        */
/* ------------------------------------------------------------------ */

function ogCoverSvg({ width, height, label, sublabel, price, badge }) {
  const scale = width / 1200;
  const titleSize = Math.round(92 * scale);
  const subSize = Math.round(34 * scale);
  const badgeSize = Math.round(24 * scale);

  const carW = 820 * scale;
  const carH = 320 * scale;
  const carX = (width - carW) / 2;
  const carY = height * 0.56;

  const carPath = `
    M ${carX + carW * 0.04} ${carY + carH * 0.66}
    C ${carX + carW * 0.02} ${carY + carH * 0.52},
      ${carX + carW * 0.13} ${carY + carH * 0.48},
      ${carX + carW * 0.22} ${carY + carH * 0.47}
    L ${carX + carW * 0.33} ${carY + carH * 0.2}
    C ${carX + carW * 0.39} ${carY + carH * 0.09},
      ${carX + carW * 0.46} ${carY + carH * 0.07},
      ${carX + carW * 0.58} ${carY + carH * 0.07}
    C ${carX + carW * 0.72} ${carY + carH * 0.07},
      ${carX + carW * 0.79} ${carY + carH * 0.14},
      ${carX + carW * 0.85} ${carY + carH * 0.32}
    L ${carX + carW * 0.95} ${carY + carH * 0.46}
    C ${carX + carW * 0.99} ${carY + carH * 0.51},
      ${carX + carW} ${carY + carH * 0.58},
      ${carX + carW} ${carY + carH * 0.7}
    L ${carX + carW * 0.97} ${carY + carH * 0.82}
    L ${carX + carW * 0.03} ${carY + carH * 0.82}
    C ${carX + carW * 0.01} ${carY + carH * 0.76},
      ${carX + carW * 0.01} ${carY + carH * 0.7},
      ${carX + carW * 0.04} ${carY + carH * 0.66} Z`;

  const wheelY = carY + carH * 0.82;
  const wheelR = carH * 0.14;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#082f33"/>
      <stop offset="55%" stop-color="#0a4f56"/>
      <stop offset="100%" stop-color="#0f7a83"/>
    </linearGradient>
    <radialGradient id="glow" cx="70%" cy="20%" r="60%">
      <stop offset="0%" stop-color="#3fabb7" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#3fabb7" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="${width}" height="${height}" fill="url(#bg)"/>
  <rect width="${width}" height="${height}" fill="url(#glow)"/>

  <g stroke="#ffffff" stroke-opacity="0.05" stroke-width="1">
    ${Array.from({ length: Math.ceil(width / 56) + 1 }, (_, i) => {
      const x = i * 56;
      return `<line x1="${x}" y1="0" x2="${x}" y2="${height}"/>`;
    }).join("")}
  </g>

  <!-- badge -->
  <rect x="${width * 0.07}" y="${height * 0.13}" width="${34 * scale + subSize * 12}" height="${badgeSize * 2.1}"
    rx="${badgeSize}" fill="#ff6b35"/>
  <text x="${width * 0.07 + (34 * scale + subSize * 12) / 2}" y="${height * 0.13 + badgeSize * 1.42}"
    text-anchor="middle" font-family="Inter, Segoe UI, Arial, sans-serif"
    font-size="${badgeSize}" font-weight="800" fill="#ffffff" letter-spacing="1.6">${escape(badge)}</text>

  <!-- judul -->
  <text x="${width * 0.07}" y="${height * 0.42}"
    font-family="Inter, Segoe UI, Arial, sans-serif" font-size="${titleSize}"
    font-weight="900" fill="#ffffff" letter-spacing="-1">${escape(label)}</text>
  <text x="${width * 0.07}" y="${height * 0.42 + subSize * 1.5}"
    font-family="Inter, Segoe UI, Arial, sans-serif" font-size="${subSize}"
    font-weight="700" fill="#a9e1e7">${escape(sublabel)}</text>

  <!-- mobil -->
  <ellipse cx="${width / 2}" cy="${carY + carH * 1.06}" rx="${carW * 0.44}" ry="${carH * 0.08}"
    fill="#000000" fill-opacity="0.3"/>
  <path d="${carPath}" fill="#ffffff" fill-opacity="0.14"
    stroke="#ffffff" stroke-opacity="0.45" stroke-width="${2.4 * scale}" stroke-linejoin="round"/>
  <circle cx="${carX + carW * 0.23}" cy="${wheelY}" r="${wheelR}" fill="#041d20" fill-opacity="0.85"
    stroke="#ffffff" stroke-opacity="0.4" stroke-width="${2 * scale}"/>
  <circle cx="${carX + carW * 0.78}" cy="${wheelY}" r="${wheelR}" fill="#041d20" fill-opacity="0.85"
    stroke="#ffffff" stroke-opacity="0.4" stroke-width="${2 * scale}"/>

  <!-- harga -->
  <text x="${width * 0.07}" y="${height * 0.87}"
    font-family="Inter, Segoe UI, Arial, sans-serif" font-size="${Math.round(subSize * 0.82)}"
    font-weight="700" fill="#ffffff" fill-opacity="0.62">Mulai dari</text>
  <text x="${width * 0.07}" y="${height * 0.87 + subSize * 1.35}"
    font-family="Inter, Segoe UI, Arial, sans-serif" font-size="${Math.round(subSize * 1.5)}"
    font-weight="900" fill="#ffffff">${escape(price)}</text>
</svg>`;
}

/* ------------------------------------------------------------------ */
/*  RUN                                                                */
/* ------------------------------------------------------------------ */

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  let count = 0;

  for (const item of PLACEHOLDERS) {
    const { file, kind, w, h, label, sublabel, hue = 0, paint } = item;

    let svg;

    if (kind === "portrait") {
      svg = portraitPlaceholder({
        width: w,
        height: h,
        label,
        initials: item.initials,
        hue,
      });
    } else if (kind === "og") {
      svg = ogCoverSvg({
        width: w,
        height: h,
        label,
        sublabel,
        price: item.price ?? "",
        badge: item.badge ?? "PLACEHOLDER",
      });
    } else {
      svg = carPlaceholder({ width: w, height: h, label, sublabel, hue, paint });
    }

    const outPath = path.join(OUT_DIR, file);

    await sharp(Buffer.from(svg))
      .flatten({ background: "#082f33" })
      .jpeg({ quality: 82, progressive: true, mozjpeg: true })
      .toFile(outPath);

    count += 1;
    console.log(`  + ${file}`);
  }

  console.log(`\n${count} placeholder dibuat di public/images/`);
  console.log("Ganti dengan foto asli tanpa perlu mengubah kode.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});