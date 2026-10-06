# Dealer Resmi JAECOO J5 - Medan

Landing page konversi untuk dealer resmi mobil JAECOO J5 di Medan, Sumatera Utara.
Dibangun dengan Next.js (App Router) + TypeScript + Tailwind CSS + Framer Motion.

Tujuan utama: mengumpulkan lead (calon pembeli) dan permintaan SPK secara online.
Setiap section mengarahkan pengunjung ke salah satu dari dua aksi: **Pesan / Booking SPK** atau **Chat WhatsApp Sales**.

---

## 1. Menjalankan Project

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run start    # jalankan hasil build
npm run lint     # ESLint
npx tsc --noEmit # typecheck
```

> **Catatan Windows:** Next.js 16 butuh Node.js >= 20.9.0.
> Jika `npm install` gagal dengan pesan `Cannot find native binding`,
> jalankan `npm i` ulang atau pasang paket native untuk platform Anda
> (misalnya `@tailwindcss/oxide-win32-x64-msvc`).

---

## 2. Placeholder yang WAJIB Diganti

Semua data dealer ada di **satu file**: `src/data/config.ts`.
Cari dan ganti placeholder berikut (semua ditandai dengan `[ ]`):

| Placeholder | Lokasi di config | Contoh |
|---|---|---|
| `[NAMA SALES]` | `contact.salesName` | Budi Santoso |
| `[NOMOR WA FORMAT 62xxx]` | `contact.whatsapp` | `6281234567890` |
| `[HARGA OTR PER VARIAN]` | `variants[].price` dan `priceBefore` | `289_000_000` |
| `[ALAMAT DEALER]` | `address.street`, `faqs[].answer` | Jl. Sisingamangar No. 1 |
| `[LINK GOOGLE MAPS]` | `address.mapsUrl`, `directionsUrl` | link dari Google Maps |
| `[LINK SHEETS WEBHOOK]` | `sheetsWebhookUrl` | `https://script.google.com/...` |
| `[NAMA BADAN USAHA DEALER]` | `site.legalName` | PT. Otomotif Medan |
| `[ISI]` | `trustStats[3].value` | `120+` |
| `[INSTAGRAM_DEALER]` dll. | `social.*` | `jaecoo_medan` |

**Cara mengambil nomor WhatsApp:**
WhatsApp > menu tiga titik > Profil > Bagikan > Bagikan kontak > **Salin tautan**.
Tautan akan berbentuk `https://wa.me/6281234567890`. Ambil angka setelah `wa.me/`.

> Nomor harus format internasional **tanpa "+" dan tanpa spasi**.

### Tanggal promo

`promo.endsAt` di `src/data/config.ts` menentukan waktu hitung mundur.
Format ISO8601 dengan zona waktu WIB, contoh:

```ts
endsAt: "2026-12-31T23:59:59+07:00"
```

`promo.quotaRemaining` mengatur badge urgensi "Sisa X dari Y unit".
Isi `0` untuk menyembunyikan badge tersebut.

---

## 3. Daftar Gambar yang Harus Disiapkan

Semua gambar ada di `public/images/`. Ada dua sumber:

| Sumber | Isi | Command |
|---|---|---|
| **Aset resmi JAECOO** | 36 dari 41 foto aktif, disalin dari `cms.jaecoo.id` | `npm run images:official` |
| **Placeholder** | 41 diagram SVG buatan sendiri (rollback) | `npm run placeholders` |

Sisa 5 file yang masih placeholder: `testimoni-1..4.jpg` (menunggu foto
pelanggan asli) dan `og-cover.jpg` (menunggu desain).

Keduanya memakai nama file yang sama persis seperti di `src/data/config.ts`,
jadi **timpa file** saja untuk mengganti — tidak ada kode yang perlu diubah.

```bash
# Kembalikan semua foto ke placeholder
npm run placeholders

# Pasang kembali foto resmi JAECOO
npm run images:official
```

### Asal aset resmi JAECOO — sudah disetujui owner

Foto di `public/images/official/` diambil dari `cms.jaecoo.id`, kanal resmi
JAECOO Indonesia. Pemilik dealer sudah memutuskan memakai aset ini tanpa
perundingan tambahan, dengan alasan dealership ini adalah dealer resmi
JAECOO.

Catatan faktual: foto tersebut tetap milik JAECOO. Kalau JAECOO Indonesia
sewaktu-waktu meminta penghapusan, foto unit asli showroom disiapkan sebagai
pengganti — tidak perlu sekarang. Detailnya di `public/images/official/SUMBER.md`.

Tetap satu aturan: jangan menambah foto dari Pinterest, Instagram, atau blog
automobil. Kalau butuh foto tambahan, pakai foto unit sendiri.

### Rekomendasi spesifikasi

| Kategori | Rasio | Ukuran minimal | Kualitas |
|---|---|---|---|
| Hero | 3:2 | 1600 x 1067 px | quality 85, WebP ideal |
| Kartu model | 16:10 | 1200 x 750 px | quality 80 |
| Kartu varian | 16:10 | 1200 x 750 px | quality 80 |
| Warna | 16:10 | 1200 x 750 px | **latar transparan / studio**, angle sama untuk semua warna |
| Galeri | 4:3 | 1200 x 900 px | quality 80 |
| Keunggulan | 4:3 | 1000 x 750 px | quality 80 |
| Testimoni | 1:1 | 400 x 400 px | potret, wajah terlihat jelas |
| OG cover | 1.91:1 | 1200 x 630 px | ada teks besar, logo terlihat di feed |

### Warna resmi per model

Nama warna diambil dari halaman model resmi di `jaecoo.id`
(script: `node scripts/extract-official-colors.mjs`).

| Model | Warna |
|---|---|
| **J5** (4) | Pristine White · Jet Black · Ivory Gray · Forest Green |
| **J7** (5) | Pristine White · Jet Black · Stone Gray · Moonlight Silver · Pristine White Two Tone |
| **J8 ARDIS** (4) | Pristine White Two Tone · Jet Black · Stone Gray · Lunar Silver |

Dua catatan penting:

1. **"Stone Gray" = "Olive Grey" / "Model Green".** Nama resminya
   *Stone Gray*, tapi file swatch di situs pabrikan bernama `olive_gray_J7`
   (J7) dan `Icon_Green_2` (J8). Penjual sering menyebutnya olive grey atau
   model green. Itu cat yang sama, bukan warna berbeda.

2. **`hex` di `config.ts` adalah pendekatan manual, bukan kode resmi.**
   Swatch di website JAECOO adalah ikon gradien dengan pantulan, bukan chip
   warna datar, jadi warna catnya tidak bisa dibaca dari pixel - percobaan
   sampling menghasilkan "Stone Gray" = biru. Untuk warna pixel-perfect,
   ambil hex dari pricelist resmi dealer.

### Checklist file

| File | Dipakai di | Isi yang dibutuhkan |
|---|---|---|
| `hero.jpg` | Hero | Mobil 3/4 depan, area atas kosong untuk badge |
| `model-j5.jpg` | Model Showcase | J5 3/4 depan |
| `model-j7.jpg` | Model Showcase | J7 3/4 |
| `model-j8.jpg` | Model Showcase | J8 ARDIS 3/4 |
| `varian-j5-standard.jpg` | Varian | J5 Standard warna netral |
| `varian-j5-ev-premium.jpg` | Varian | J5 EV Premium, numeric panoramic roof kelihatan |
| `varian-j7-shs.jpg` | Varian | J7 SHS |
| `varian-j7-awd.jpg` | Varian | J7 AWD |
| `varian-j8-awd.jpg` | Varian | J8 ARDIS AWD, bagian grilles terlihat |
| `varian-j8-shs.jpg` | Varian | J8 ARDIS SHS |
| `warna-j5-1..4.jpg` | Warna | Pristine White · Jet Black · Ivory Gray · Forest Green |
| `warna-j7-1..5.jpg` | Warna | Pristine White · Jet Black · Stone Gray · Moonlight Silver · Pristine White Two Tone |
| `warna-j8-1..4.jpg` | Warna | Pristine White Two Tone · Jet Black · Stone Gray · Lunar Silver |
| `fitur-suv-premium.jpg` | Keunggulan | Tampak depan/samping unit |
| `fitur-teknologi.jpg` | Keunggulan | Layar infotainment / kamera 360 |
| `fitur-performa.jpg` | Keunggulan | Detail mesin / emblem |
| `fitur-kenyamanan.jpg` | Keunggulan | Kursi ventilated / interior |
| `galeri-eksterior-1..3.jpg` | Galeri | Depan · samping · belakang |
| `galeri-interior-1..3.jpg` | Galeri | Dasbor · kursi · layar sentuh |
| `galeri-fitur-1..3.jpg` | Galeri | Kamera 360 · handle · fitur interior |
| `testimoni-1..4.jpg` | Testimoni | Potret pelanggan (section disembunyikan sampai diisi) |
| `og-cover.jpg` | SEO / social sharing | Komposisi teks "JAECOO J5 J7 J8 - Dealer Resmi Medan" |

Nomor urut `warna-*` harus cocok dengan urutan `modelColors` di
`src/data/config.ts`. Kalau menambah atau menggeser warna, perbarui keduanya.

**Tips foto warna:** idealnya dibit dengan angle, focal length, dan
pencahayaan yang sama persis supaya transisi ganti warna terasa profesional.
Bila belum tersedia, foto unit yang sama bisa dipakai dulu.

---

## 4. Setup Google Sheets Webhook

Form **tidak** menulis langsung ke Google Sheets. Semua request dilewatkan
`POST /api/leads` supaya URL webhook tidak bocor ke browser dan bisa diberi rate limit.

### Langkah

1. Buat Google Spreadsheet baru, beri nama tab **`Leads`**.
2. Di baris pertama, buat header kolom:

   ```
   submittedAt | tipeForm | nama | whatsapp | whatsappRaw | kota | varian | varianId |
   warna | warnaId | metodePembayaran | dpPersen | tukarTambah | catatan
   ```

3. **Ekstensi > Apps Script**, lalu tempel kode ini:

   ```javascript
   function doPost(e) {
     var sheet = SpreadsheetApp.getActive().getSheetByName("Leads");
     var data = JSON.parse(e.postData.contents);

     sheet.appendRow([
       data.submittedAt || new Date().toISOString(),
       data.tipeForm || "",
       data.nama || "",
       data.whatsapp || "",
       data.whatsappRaw || "",
       data.kota || "",
       data.varian || "",
       data.varianId || "",
       data.warna || "",
       data.warnaId || "",
       data.metodePembayaran || "",
       data.dpPersen || "",
       data.tukarTambah || "",
       data.catatan || "",
     ]);

     return ContentService.createTextOutput(
       JSON.stringify({ ok: true })
     ).setMimeType(ContentService.MimeType.JSON);
   }
   ```

4. **Deploy > New deployment > Web app**
   - Execute as: `Me`
   - Who has access: `Anyone` (agar bisa dipanggil dari website)
5. Klik **Deploy**, lalu salin URL Web App (`https://script.google.com/macros/s/.../exec`).
6. Tempel URL itu ke `sheetsWebhookUrl` di `src/data/config.ts`,
   **atau** lebih aman ke environment variable `GOOGLE_SHEETS_WEBHOOK_URL`.

> **Mode demo:** kalau webhook kosong, form tetap berjalan normal - data hanya
> dikirim ke WhatsApp sales. Tidak ada error yang tampil ke pengguna.

---

## 5. Environment Variable

Buat file `.env.local` di root project:

```bash
# ID dari Google Analytics 4 (Admin > Property > Data Streams)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Pixel ID dari Meta Events Manager
NEXT_PUBLIC_META_PIXEL_ID=123456789012345

# Opsional - menimpa nilai sheetsWebhookUrl di config
GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/XXXX/exec
```

| Variable | Wajib | Fungsi |
|---|---|---|
| `NEXT_PUBLIC_GA_ID` | tidak | GA4. Kosongkan = tidak ada request ke Google |
| `NEXT_PUBLIC_META_PIXEL_ID` | tidak | Meta Pixel. Kosongkan = tidak ada request ke Meta |
| `GOOGLE_SHEETS_WEBHOOK_URL` | tidak | Menimpa `sheetsWebhookUrl` |

---

## 6. Event Tracking

Semua event dikirim ke GA4 **dan** Meta Pixel (dengan pemetaan ke event
standar Meta: `Lead`, `AddToCart`, `ViewContent`). Daftar event ada di
`src/lib/analytics.ts`.

| Event GA4 | Kapan dipicu |
|---|---|
| `whatsapp_click` | Setiap klik tombol WhatsApp (hero, header, navbar, section, simulasi, footer) |
| `spk_form_submit` | Submit form SPK berhasil, dan klik tombol "Pesan Sekarang" |
| `test_drive_submit` | Submit form Booking Test Drive |
| `credit_simulation` | Slider DP / tenor digeser (throttle 1,5 detik) |
| `variant_select` | Pilih varian, buka tabel perbandingan, ganti warna |
| `phone_click` | Klik tombol telepon |
| `direction_click` | Klik tombol Petunjuk Arah |

Setiap event WhatsApp membawa parameter `placement` sehingga Anda bisa
melihat sumber konversi mana yang paling efektif.

---

## 7. Struktur Project

```
src/
├── app/
│   ├── layout.tsx           # Metadata SEO, font, analytics scripts
│   ├── page.tsx             # JSON-LD structured data + render landing page
│   ├── globals.css          # Design tokens (teal #0F7A83, shadow, animasi)
│   ├── robots.ts
│   ├── sitemap.ts
│   └── api/leads/route.ts   # Proxy ke Google Sheets + honeypot + rate limit
│
├── data/
│   └── config.ts            # ★ SEMUA DATA DEALER DI SINI
│
├── lib/
│   ├── utils.ts             # Rupiah, link WA, validasi HP, simulasi kredit
│   ├── analytics.ts         # GA4 + Meta Pixel helper
│   └── rate-limit.ts        # Rate limiter in-memory
│
└── components/
    ├── LandingPage.tsx      # Client wrapper, state varian & warna terpilih
    ├── Header.tsx           # Sticky header + drawer mobile
    ├── FloatingActions.tsx  # Floating WA + sticky bottom bar mobile
    ├── Footer.tsx
    ├── AnalyticsScripts.tsx
    ├── ui/                  # Primitif: Button, Modal, Reveal, Section
    └── sections/            # 14 section sesuai urutan halaman
```

---

## 8. Alur Konversi

Halaman dirancang agar tidak pernah buntu - setiap section punya CTA:

```
Hero ──────────────► Booking SPK / Test Drive
Trust bar ──────────► (memperkuat kredibilitas, tanpa CTA langsung)
Keunggulan ─────────► Tanya fitur via WA (per kartu)
Varian ─────────────► "Pilih Varian Ini" → isi form SPK + scroll ke form
                     "Bandingkan Varian" → modal tabel spesifikasi
                     "Tanya Varian Ini" → WA
Warna ──────────────► Ganti gambar + "Tanya Warna Ini" via WA
Galeri ─────────────► Lightbox swipeable + CTA WA
Simulasi Kredit ────► Slider DP / tenor real-time → "Ajukan Kredit via WA"
                     (pesan WA membawa angka simulasi)
Promo ──────────────► Countdown timer + "Klaim Promo Sekarang"
Journey ────────────► Konteks proses, arahkan ke form SPK
Form SPK ───────────► Submit → Sheets + WhatsApp dengan ringkasan lengkap
Test Drive ─────────► Submit → Sheets + WhatsApp dengan detail jadwal
Testimoni / FAQ ────► "Chat sales kami"
Lokasi ─────────────► Petunjuk Arah + Tanya Lokasi
CTA penutup ────────► SPK / WhatsApp (pengulangan yang disengaja)
Selalu ada ─────────► Floating WA (kanan bawah) + sticky bar 2 tombol (mobile)
```

### State bersama

`LandingPage.tsx` menyimpan `selectedVariantId` dan `selectedColorId`.
Pilihan di section Varian dan Warna langsung mengisi form SPK serta
mengubah simulasi kredit - pengguna tidak perlu mengetik ulang.

---

## 9. Anti-Spam

- **Honeypot** - field `website` disembunyikan di kedua form. Kalau terisi,
  request dianggap bot: tetap dibalas sukses tapi tidak disimpan.
- **Rate limit** - `src/lib/rate-limit.ts`, maksimal 5 request per IP per menit
  di sisi server (`POST /api/leads`).
- **Perilaku klien** - klik WA membuka tab baru; penyimpanan ke Sheets selalu
  diproses terpisah dari pengiriman WhatsApp sehingga kegagalan Google Sheets
  tidak menghalangi pengguna menghubungi sales.

> Rate limiter berjalan per-instance. Untuk deployment multi-instance
> (Vercel/Cloud), ganti dengan Upstash Redis atau Vercel KV.

---

## 10. Performa & SEO

- Mobile-first, semua section punya `max-w-6xl` dan padding responsif.
- Semua gambar lewat `next/image` dengan `sizes` yang tepat; hero memakai
  `priority` + `fetchPriority="high"`, sisanya lazy load default.
- `prefers-reduced-motion` dihormati di CSS dan di komponen Framer Motion.
- Metadata lengkap: title template, description, keywords, Open Graph,
  Twitter card, canonical, robots directives.
- JSON-LD: `AutoDealer`, `Car` (per varian + `offers` harga), `FAQPage`, `WebSite`.
  FAQ yang terstruktur bisa muncul langsung di hasil pencarian Google.
- `sitemap.xml` dan `robots.txt` dibuat otomatis dari `seo.siteUrl`.

**Sebelum publish, ganti `seo.siteUrl` di `src/data/config.ts`** dengan domain
produksi Anda, karena semua URL absolut diturunkan dari nilai tersebut (canonical, OG, sitemap).

### Checklist sebelum launch

- [ ] Semua placeholder `[ ]` di `src/data/config.ts` diganti
- [ ] `seo.siteUrl` diisi domain produksi
- [ ] Koordinat `geo.latitude` / `geo.longitude` di `src/app/page.tsx` disetel tepat
- [ ] Semua gambar di `public/images/` diganti foto asli
- [ ] Testimoni diganti kutipan pelanggan asli
- [ ] `GOOGLE_SHEETS_WEBHOOK_URL` dikonfigurasi dan dites
- [ ] `NEXT_PUBLIC_GA_ID` dan `NEXT_PUBLIC_META_PIXEL_ID` diisi
- [ ] Link Instagram / Facebook / TikTok diganti
- [ ] Jalankan Lighthouse di mode incognito, target skor 90+

---

## 11. Formula Simulasi Kredit

Menggunakan metode **bunga flat** (umum dipakai leasing Indonesia):

```
DP          = Harga OTR x (DP% / 100)
Pokok       = Harga OTR - DP
Total Bunga = Pokok x (flatRate x tenor) / 100
Cicilan     = (Pokok + Total Bunga) / (tenor x 12)
```

Suku bunga default `7,5%` flat per tahun, dapat diubah di `credit.flatRatePercent`.

Disclaimer sudah ditampilkan langsung di bawah hasil simulasi karena angka
akhir tetap bergantung pada keputusan leasing.
