/**
 * ============================================================
 *  KONFIGURASI SINGLE SOURCE OF TRUTH
 *  Dealer Resmi JAECOO - Medan, Sumatera Utara
 * ============================================================
 *  Ubah SEMUA data dealer, harga, promo, dan kontak HANYA di file ini.
 *  Tidak perlu menyentuh komponen.
 *
 *  PLACEHOLDER YANG HARUS DIGANTI:
 *    [NAMA SALES]            -> nama sales yang tampil di halaman
 *    [NOMOR WA FORMAT 62xxx] -> nomor WhatsApp tanpa "+" / spasi
 *    [HARGA OTR PER VARIAN]  -> harga OTR Medan per varian
 *    [ALAMAT DEALER]         -> alamat lengkap dealer
 *    [LINK GOOGLE MAPS]      -> link Google Maps dealer
 *    [LINK SHEETS WEBHOOK]   -> URL Google Apps Script (lihat README)
 * ============================================================
 */

/* ------------------------------------------------------------------ */
/*  0. HELPER PLACEHOLDER                                              */
/* ------------------------------------------------------------------ */

/**
 * Awalan nilai placeholder.
 *
 * Dideklarasikan paling atas karena dipakai oleh banyak `const` turunan
 * di bawah (mis. `visibleTrustStats`). Kalau declaring lebih akhir, nilai
 * turunannya akan membaca `PLACEHOLDER_PATTERN` sebelum diinisialisasi
 * dan build gagal dengan "Cannot access before initialization".
 *
 * Dipakai untuk:
 * - menyembunyikan teks placeholder dari structured data (JSON-LD), supaya
 *   Google tidak mengindeks "[ISI SPESIFIKASI]",
 * - menyaring placeholder dari komponen sebelum dirender.
 */
export const PLACEHOLDER_PATTERN = /^\[ISI/;

export function isPlaceholder(value: string): boolean {
  return PLACEHOLDER_PATTERN.test(value.trim());
}

/* ------------------------------------------------------------------ */
/*  1. IDENTITAS DEALER & KONTAK                                       */
/* ------------------------------------------------------------------ */

export const site = {
  brand: "JAECOO",
  /**
   * Line-up yang dijual, ditulis sebagai satu string agar bisa langsung
   * disisipkan di judul, heading, dan pesan WhatsApp.
   *
   * CATATAN: nilai ini ditulis manual (tidak diturunkan dari `models`)
   * karena `site` dideklarasikan sebelum `models`. Kalau lineup berubah,
   * ubah `site.model` ini juga.
   */
  model: "J5, J7, dan J8",
  city: "Medan",
  region: "Sumatera Utara",
  cityLong: "Medan, Sumatera Utara",
  area: "Medan, Binjai, Deli Serdang",
  tagline: "[ISI TAGLINE DEALER]",
  legalName: "[NAMA BADAN USAHA DEALER]",
} as const;

export const contact = {
  /** Nama sales yang tampil di seluruh halaman. GANTI dengan nama asli. */
  salesName: "[NAMA SALES]",
  salesTitle: "Sales Consultant JAECOO Medan",
  /**
   * Nomor WhatsApp format internasional TANPA "+" dan TANPA spasi.
   * Cara mengambil: buka WhatsApp > Profil > Bagikan > Salin tautan
   */
  whatsapp: "6289524146310",
  /** Nomor telepon untuk tampilan saja. */
  phoneDisplay: "+62 895-2414-6310",
  phoneDial: "+6289524146310",
  email: "sales@jaecoo-medan.example",
  /** Jam operasional dealer. */
  hours: [
    { day: "Senin - Jumat", time: "09.00 - 18.00 WIB" },
    { day: "Sabtu", time: "09.00 - 15.00 WIB" },
    { day: "Minggu", time: "10.00 - 14.00 WIB" },
  ],
  /**
   * Jam operasional dalam format ISO 8601 (HH:MM, 24 jam) untuk JSON-LD
   * `openingHoursSpecification`. GANTI bila jam buka-tutup dealer berubah.
   */
  businessHours: [
    { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "09:00", closes: "18:00" },
    { days: ["Saturday"], opens: "09:00", closes: "15:00" },
    { days: ["Sunday"], opens: "10:00", closes: "14:00" },
  ],
} as const;

export const address = {
  street: "Jl. T. Amir Hamzah No.88",
  district: "Medan Helvetia",
  city: "Medan",
  province: "Sumatera Utara",
  postalCode: "20113",
  /**
   * Link dibangun dari query alamat, jadi selalu benar walau dealer belum
   * punya listing di Google Maps. Kalau nanti sudah ada listing resmi,
   * ganti dengan URL pin yang asli (bagikan dari aplikasi Maps).
   */
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Jl.+T.+Amir+Hamzah+No.88,+Medan+Helvetia,+Kota+Medan,+Sumatera+Utara+20113",
  /**
   * GANTI: URL embed Google Maps. Cara mendapatnya: buka Google Maps ->
   * Bagikan -> Sematkan peta -> salin hanya bagian `src="..."` di dalam
   * tag `<iframe>`, lalu tempel di sini.
   */
  mapsEmbedUrl:
    "https://www.google.com/maps?q=Jl.+T.+Amir+Hamzah+No.88,+Medan+Helvetia,+Kota+Medan,+Sumatera+Utara+20113&z=15&output=embed",
  /** GANTI: link rute Google Maps (bagikan dari aplikasi Maps). */
  directionsUrl:
    "https://www.google.com/maps/dir/?api=1&destination=Jl.+T.+Amir+Hamzah+No.88,+Medan+Helvetia,+Kota+Medan,+Sumatera+Utara+20113",
  landmarks: ["Medan Helvetia", "Kota Medan, Sumatera Utara 20113"],
  /**
   * Koordinat dealer untuk JSON-LD `geo`.
   *
   * PENTING: nilai di bawah ini adalah TEBAKAN untuk area Helvetia dan
   * belum diverifikasi, jadi sengaja dibiarkan sebagai placeholder agar
   * tidak ikut tayang ke Google. Koordinat yang salah cukup merusak SEO
   * lokal.
   *
   * Cara mendapat yang benar: buka Google Maps -> klik kanan lokasi dealer
   * -> salin koordinat (lat, long) dari opsi pertama.
   */
  geo: {
    latitude: "[ISI LATITUDE]",
    longitude: "[ISI LONGITUDE]",
  },
} as const;

export const social = {
  instagram: "https://instagram.com/[INSTAGRAM_DEALER]",
  facebook: "https://facebook.com/[FACEBOOK_DEALER]",
  tiktok: "https://tiktok.com/@[TIKTOK_DEALER]",
} as const;

/**
 * GANTI: URL Webhook Google Apps Script untuk menyimpan lead ke Google Sheets.
 * Cara setup: lihat README.md bagian "Setup Google Sheets Webhook".
 * Biarkan kosong ("") untuk mode demo - form tetap berjalan, data hanya
 * dikirim ke WhatsApp sales.
 */
export const sheetsWebhookUrl: string = "";

/** Nama environment variable yang bisa menimpa nilai di atas. */
export const sheetsWebhookEnvVar = "GOOGLE_SHEETS_WEBHOOK_URL";

/* ------------------------------------------------------------------ */
/*  2. HERO                                                            */
/* ------------------------------------------------------------------ */

/**
 * GANTI: headline dan subheadline dengan copy final.
 *
 * `headline` dan `subheadline` TIDAK boleh berisi klaim teknis (tenaga,
 * jarak tempuh, garansi) sebelum ada konfirmasi pabrikan. Yang aman adalah
 * menyebut lineup dan lokasi.
 *
 * Harga "mulai dari" tidak ditulis di sini - nilainya diturunkan dari
 * `entryVariant` (varian termurah) supaya tidak bisa meleset dari
 * section Varian dan Harga.
 */
export const hero = {
  eyebrow: "DEALER RESMI JAECOO MEDAN",
  title: "JAECOO J5, J7, dan J8",
  headline: "Listrik, Hybrid, atau Empat Roda",
  subheadline:
    "Enam varian JAECOO dalam satu dealer resmi Medan. Lihat harga OTR, hitung cicilan, lalu booking SPK atau test drive langsung dari halaman ini.",
  image: "/images/hero.jpg",
  imageAlt: "Unit JAECOO di dealer resmi Medan",
} as const;

/* ------------------------------------------------------------------ */
/*  3. TRUST BAR / STATISTIK                                           */
/* ------------------------------------------------------------------ */

/**
 * GANTI: angka garansi dan statistik dengan data resmi dealer.
 * Nilai `[ISI]` sengaja dipakai agar tidak ada klaim yang belum
 * dikonfirmasi ikut tampil.
 */
export const trustStats = [
  { value: "[ISI]", label: "Garansi Kendaraan", icon: "shield" },
  { value: "24/7", label: "Layanan Darurat", icon: "headset" },
  { value: "Tersedia", label: "Kredit & Leasing", icon: "wallet" },
  { value: "[ISI]", label: "Unit Terkirim di Medan", icon: "car" },
] as const;

/**
 * `trustStats` versi siap tampil - statistik yang angkanya belum diisi
 * dilewati, dan grid akan menyesuaikan jumlah kolomnya.
 */
export const visibleTrustStats = trustStats.filter((stat) => !isPlaceholder(stat.value));

/* ------------------------------------------------------------------ */
/*  4. KEUNGGULAN (4 KARTU)                                            */
/* ------------------------------------------------------------------ */

/**
 * Empat sudut pandang line-up, disusun dari data resmi ketiga model.
 *
 * Setiap `points` hanya berisi angka yang benar-benar diterima. Jangan
 * menambahkan angka yang tidak ada di pricelist - kalau data model tertentu
 * belum tersedia, tambahkan poin dari model yang sudah lengkap.
 */
export const features = [
  {
    id: "suv-premium",
    title: "SUV Premium",
    description:
      "JAECOO J5, J7, dan J8 ARDIS memakai bahasa desain yang sama: bodi tegas, garis bodi bersih, dan proporsi yang utuh di jalan raya.",
    points: [
      "J5: 4.380 mm, ground clearance 200 mm",
      "J8 ARDIS: kabin 7 penumpang, konfigurasi 2-3-2",
      "J7 dan J8 ARDIS tersedia panoramic sunroof",
    ],
    image: "/images/fitur-suv-premium.jpg",
    ctaLabel: "Tanya SUV Premium",
  },
  {
    id: "teknologi",
    title: "Teknologi Cerdas",
    description:
      "Layar besar, kamera 360 derajat, dan ADAS sudah jadi standar di line-up ini - bukan fitur tambahan yang harus dibayar terpisah.",
    points: [
      "J5: head unit 13,2 inci + kamera 540 derajat + 17 sistem ADAS",
      "J7: layar 14,8 inci dengan CarPlay dan Android Auto nirkabel",
      "J8 ARDIS: instrumen dan multimedia 14 inci",
    ],
    image: "/images/fitur-teknologi.jpg",
    ctaLabel: "Tanya teknologi",
  },
  {
    id: "performa",
    title: "Listrik dan Hybrid",
    description:
      "Pilih sesuai gaya jalan: J5 sepenuhnya listrik untuk harian, J7 Super Hybrid untuk yang sering touring, J8 ARDIS untuk keluarga besar.",
    points: [
      "J5: 155 kW (207 hp), torsi 288 Nm, baterai 60,9 kWh",
      "J7: mesin 1.5TGDI 140 hp + motor listrik 201 hp",
      "J8 ARDIS AWD: 2.0L Turbo 245-250 hp, torsi 385-390 Nm",
    ],
    image: "/images/fitur-performa.jpg",
    ctaLabel: "Tanya performa",
  },
  {
    id: "kenyamanan",
    title: "Kenyamanan Kabin",
    description:
      "Fitur yang terasa setiap hari: kabin kedap suara, kursi dengan pemanas dan ventilasi, serta sistem AC yang bisa diatur per zona.",
    points: [
      "J7: gagang pintu rata bodi, kaca depan peredam suara, audio Sony 8-speaker",
      "J8 ARDIS: double glass window, jok kulit pemanas dan ventilasi",
      "J8 ARDIS: AC 3-zona independen dan ambient lighting 256 warna",
    ],
    image: "/images/fitur-kenyamanan.jpg",
    ctaLabel: "Tanya kenyamanan kabin",
  },
] as const;

/* ------------------------------------------------------------------ */
/*  5. MODEL & VARIAN                                                 */
/* ------------------------------------------------------------------ */

/**
 * Model yang dijual. Satu dealer ini memegang tiga line-up JAECOO:
 * J5 (SUV listrik), J7 (Super Hybrid System), dan J8 ARDIS (SUV 7-seater).
 *
 * GANTI `image` dengan foto resmi per model.
 */
export const models = [
  {
    id: "j5",
    name: "J5",
    fullName: "JAECOO J5",
    bodyType: "SUV Listrik (BEV)",
    tagline: "SUV listrik 60,9 kWh dengan jarak tempuh hingga 461 km dan 17 sistem ADAS.",
    image: "/images/model-j5.jpg",
    imageAlt: "JAECOO J5 - SUV listrik",
  },
  {
    id: "j7",
    name: "J7",
    fullName: "JAECOO J7",
    bodyType: "SUV Super Hybrid System (PHEV)",
    tagline: "Super Hybrid System: 1.300 km jarak tempuh gabungan, hingga 90 km mode full EV.",
    image: "/images/model-j7.jpg",
    imageAlt: "JAECOO J7 - SUV Super Hybrid System",
  },
  {
    id: "j8",
    name: "J8 ARDIS",
    fullName: "JAECOO J8 ARDIS",
    bodyType: "SUV 7-Seater (SHS & Bensin)",
    tagline: "SUV tujuh penumpang dengan fitur flagship, tersedia hybrid dan bensin.",
    image: "/images/model-j8.jpg",
    imageAlt: "JAECOO J8 ARDIS - SUV 7-seater",
  },
] as const;

export type ModelId = (typeof models)[number]["id"];

/**
 * Kunci baris tabel perbandingan, sesuai urutan yang enak dibaca.
 *
 * Tiap varian hanya mengisi kunci yang datanya benar-benar tersedia, jadi
 * sel yang tidak berlaku otomatis tampil sebagai "-" di tabel perbandingan.
 */
export const SPEC_KEYS = [
  "Powertrain",
  "Tenaga",
  "Torsi",
  "Baterai",
  "Jarak tempuh",
  "Transmisi",
  "Penggerak",
  "Dimensi (P x L x T)",
  "Ground clearance",
  "Bagasi",
  "Kapasitas penumpang",
  "Layar sentuh",
  "Fitur andalan",
  "Keamanan",
] as const;

export type SpecKey = (typeof SPEC_KEYS)[number];

/**
 * Label powertrain yang tampil di kartu varian.
 *
 * Perhatikan bahwa `AWD` di sini berarti penggerak, bukan jenis bahan bakar.
 * Untuk structured data selalu pakai `variant.fuel`, bukan label ini.
 */
export const POWERTRAIN_LABEL = {
  EV: "Listrik (BEV)",
  SHS: "Super Hybrid (PHEV)",
  AWD: "All Wheel Drive",
} as const;

/** Nilai `fuelType` schema.org yang valid untuk data di atas. */
export type FuelType = "Electric" | "Hybrid" | "Gasoline";


/**
 * Varian yang dijual beserta harga OTR Medan.
 *
 * Harga sudah dikonfirmasi: J5 Standard 313.800.000, J5 EV Premium
 * 342.800.000, J7 SHS 535.800.000, J7 AWD 575.800.000, J8 AWD 729.800.000,
 * J8 SHS 859.800.000.
 *
 * PENTING - `specs` hanya diisi data yang benar-benar tersedia. Kunci yang
 * tidak dicantumkan berarti datanya belum diterima, dan selnya akan tampil
 * "-" di tabel perbandingan. Jangan mengarang angka untuk mengisinya.
 *
 * GANTI: `image` dengan foto unit asli, `subtitle` dengan positioning sales.
 */
export const variants = [
  {
    id: "j5-standard",
    modelId: "j5",
    name: "J5 Standard",
    powertrain: "EV",
    fuel: "Electric",
    subtitle: "SUV listrik kelas entry dengan fitur lengkap",
    price: 313_800_000,
    image: "/images/varian-j5-standard.jpg",
    imageAlt: "JAECOO J5 Standard",
    badge: "Paling Laris",
    isFeatured: false,
    highlights: [
      "Baterai 60,9 kWh - jarak tempuh hingga 461 km",
      "DC fast charging 30% ke 80% dalam 28 menit",
      "Head unit vertikal 13,2 inci",
      "Kamera 540 derajat",
      "17 sistem ADAS terintegrasi",
    ],
    specs: {
      Powertrain: "Motor listrik (BEV)",
      Tenaga: "155 kW (207 hp)",
      Torsi: "288 Nm",
      Baterai: "60,9 kWh",
      "Jarak tempuh": "Hingga 461 km",
      "Dimensi (P x L x T)": "4.380 x 1.860 x 1.650 mm",
      "Ground clearance": "200 mm",
      Bagasi: "480 L belakang + 35 L frunk",
      "Kapasitas penumpang": "5 penumpang",
      "Layar sentuh": "13,2 inci vertikal",
      "Fitur andalan": "Kamera 540 derajat, 17 sistem ADAS terintegrasi",
      Keamanan: "17 sistem ADAS terintegrasi",
    },
  },
  {
    id: "j5-ev-premium",
    modelId: "j5",
    name: "J5 EV Premium",
    powertrain: "EV",
    fuel: "Electric",
    subtitle: "Varian premium dengan panoramic roof",
    price: 342_800_000,
    image: "/images/varian-j5-ev-premium.jpg",
    imageAlt: "JAECOO J5 EV Premium",
    badge: "Rekomendasi",
    /**
     * Varian yang ditampilkan paling menonjol (kartu lebih besar, badge
     * berwarna merek). Hanya varian dengan `isFeatured: true` yang
     * mendapat perlakuan ini.
     */
    isFeatured: true,
    highlights: [
      "Semua fitur J5 Standard",
      "Panoramic roof 1,45 m2",
      "Baterai 60,9 kWh - 461 km",
      "Kamera 540 derajat",
      "17 sistem ADAS terintegrasi",
    ],
    specs: {
      Powertrain: "Motor listrik (BEV)",
      Tenaga: "155 kW (207 hp)",
      Torsi: "288 Nm",
      Baterai: "60,9 kWh",
      "Jarak tempuh": "Hingga 461 km",
      "Dimensi (P x L x T)": "4.380 x 1.860 x 1.650 mm",
      "Ground clearance": "200 mm",
      Bagasi: "480 L belakang + 35 L frunk",
      "Kapasitas penumpang": "5 penumpang",
      "Layar sentuh": "13,2 inci vertikal",
      "Fitur andalan":
        "Panoramic roof 1,45 m2, kamera 540 derajat, 17 sistem ADAS terintegrasi",
      Keamanan: "17 sistem ADAS terintegrasi",
    },
  },
  {
    id: "j7-shs",
    modelId: "j7",
    name: "J7 SHS",
    powertrain: "SHS",
    fuel: "Hybrid",
    subtitle: "Super Hybrid System untuk harian dan luar kota",
    price: 535_800_000,
    image: "/images/varian-j7-shs.jpg",
    imageAlt: "JAECOO J7 SHS",
    badge: "Rekomendasi",
    isFeatured: false,
    highlights: [
      "Mesin 1.5TGDI dedicated hybrid 140 hp + motor listrik 201 hp",
      "Baterai hybrid 18,3 kWh (IP68)",
      "Jarak tempuh gabungan hingga 1.300 km",
      "Mode full EV hingga 90 km",
      "Layar 14,8 inci + Sony 8-speaker",
    ],
    specs: {
      Powertrain:
        "Super Hybrid System (PHEV) - mesin 1.5TGDI generasi kelima + motor listrik",
      Tenaga: "Mesin 140 hp + motor listrik 201 hp",
      Baterai: "18,3 kWh hybrid (IP68)",
      "Jarak tempuh": "1.300 km gabungan; hingga 90 km mode full EV",
      "Layar sentuh":
        "14,8 inci dengan Apple CarPlay dan Android Auto nirkabel",
      "Fitur andalan":
        "Gagang pintu rata bodi, panoramic sunroof, kaca depan berlapis peredam suara, audio Sony 8-speaker, wireless charging 50W, AC dengan AQS",
    },
  },
  {
    id: "j7-awd",
    modelId: "j7",
    name: "J7 AWD",
    powertrain: "AWD",
    fuel: "Hybrid",
    subtitle: "Super Hybrid System dengan penggerak empat roda",
    price: 575_800_000,
    image: "/images/varian-j7-awd.jpg",
    imageAlt: "JAECOO J7 AWD",
    badge: null,
    isFeatured: false,
    highlights: [
      "Mesin 1.5TGDI dedicated hybrid 140 hp + motor listrik 201 hp",
      "Penggerak All Wheel Drive",
      "Baterai hybrid 18,3 kWh (IP68)",
      "Jarak tempuh gabungan hingga 1.300 km",
      "Layar 14,8 inci + Sony 8-speaker",
    ],
    specs: {
      Powertrain:
        "Super Hybrid System (PHEV) - mesin 1.5TGDI generasi kelima + motor listrik",
      Tenaga: "Mesin 140 hp + motor listrik 201 hp",
      Baterai: "18,3 kWh hybrid (IP68)",
      "Jarak tempuh": "1.300 km gabungan; hingga 90 km mode full EV",
      Penggerak: "All Wheel Drive",
      "Layar sentuh":
        "14,8 inci dengan Apple CarPlay dan Android Auto nirkabel",
      "Fitur andalan":
        "Gagang pintu rata bodi, panoramic sunroof, kaca depan berlapis peredam suara, audio Sony 8-speaker, wireless charging 50W, AC dengan AQS",
    },
  },
  {
    id: "j8-awd",
    modelId: "j8",
    name: "J8 AWD",
    powertrain: "AWD",
    fuel: "Gasoline",
    subtitle: "SUV 7-seater dengan mesin turbo dan AWD",
    price: 729_800_000,
    image: "/images/varian-j8-awd.jpg",
    imageAlt: "JAECOO J8 ARDIS AWD",
    badge: "Rekomendasi",
    isFeatured: false,
    highlights: [
      "Mesin bensin 2.0L Turbo 4-silinder 245-250 hp",
      "Torsi 385-390 Nm, transmisi 7-percepatan DCT",
      "All Wheel Drive dengan Terrain Response",
      "Kabin 7 penumpang, konfigurasi 2-3-2",
      "Layar 14 inci, AC 3-zona, 8 airbags",
    ],
    specs: {
      Powertrain: "Bensin 2.0L Turbo 4-silinder",
      Tenaga: "245-250 hp",
      Torsi: "385-390 Nm",
      Transmisi: "Otomatis 7-percepatan DCT",
      Penggerak: "All Wheel Drive dengan Terrain Response",
      "Dimensi (P x L x T)": "Sekitar 4.800 x 1.900 mm",
      "Kapasitas penumpang": "7 penumpang (2-3-2)",
      "Layar sentuh": "Instrumen dan multimedia 14 inci",
      "Fitur andalan":
        "Double glass window, ambient lighting 256 warna, jok kulit dengan pemanas dan ventilasi, AC 3-zona independen, power tailgate",
      Keamanan: "8 airbags dan ADAS",
    },
  },
  {
    id: "j8-shs",
    modelId: "j8",
    name: "J8 SHS",
    powertrain: "SHS",
    fuel: "Hybrid",
    subtitle: "SUV 7-seater dengan Super Hybrid System",
    price: 859_800_000,
    image: "/images/varian-j8-shs.jpg",
    imageAlt: "JAECOO J8 ARDIS SHS",
    badge: null,
    isFeatured: false,
    highlights: [
      "Super Hybrid System (PHEV) - mesin 1.5T + 3DHT",
      "Kabin 7 penumpang, konfigurasi 2-3-2",
      "Range gabungan hingga 1.400 km, 180 km full EV",
      "DC fast charging 30% ke 80% dalam 24 menit",
      "Layar instrumen dan multimedia 14 inci, ambient lighting 256 warna",
    ],
    specs: {
      Powertrain:
        "Super Hybrid System (PHEV) - mesin 1.5T + transmisi 3-percepatan DHT",
      "Kapasitas penumpang": "7 penumpang (2-3-2)",
      "Jarak tempuh": "Hingga 1.400 km gabungan; hingga 180 km mode full EV",
      "Layar sentuh": "Instrumen dan multimedia 14 inci",
      "Fitur andalan":
        "Double glass window, ambient lighting 256 warna, jok kulit dengan pemanas dan ventilasi, AC 3-zona independen, power tailgate, DC fast charging 30% ke 80% dalam 24 menit",
      Keamanan: "8 airbags dan ADAS",
    },
  },
] as const;

export type Variant = (typeof variants)[number];
export type VariantId = (typeof variants)[number]["id"];

/**
 * Rentang harga OTR, dihitung otomatis dari `variants` agar tidak pernah
 * tidak sinkron dengan harga di section Varian. Dipakai untuk `priceRange`
 * pada JSON-LD `AutoDealer` (schema.org).
 */
export const priceRange = {
  min: Math.min(...variants.map((variant) => variant.price)),
  max: Math.max(...variants.map((variant) => variant.price)),
} as const;

/** Varian termurah - sumber tunggal untuk copy "harga mulai dari ...". */
export const entryVariant = variants.reduce((cheapest, variant) =>
  variant.price < cheapest.price ? variant : cheapest,
);

/** Nama model yang marketable, contoh: "J5, J7, dan J8". */
export const modelLineup = models.map((model) => model.name);
export const modelLineupText =
  modelLineup.length <= 1
    ? modelLineup[0]
    : `${modelLineup.slice(0, -1).join(", ")}, dan ${modelLineup[modelLineup.length - 1]}`;

/** Varian milik sebuah model, dipakai untuk mengelompokkan section Varian. */
export function variantsByModel(modelId: ModelId) {
  return variants.filter((variant) => variant.modelId === modelId);
}

/* ------------------------------------------------------------------ */
/*  6. PILIH WARNA (interaktif, per model)                             */
/* ------------------------------------------------------------------ */

/** Satu pilihan warna bodi untuk sebuah model. */
interface BodyColor {
  /** Unik per model - dipakai sebagai React key dan nilai select. */
  id: string;
  /** Nama warna sesuai katalog pabrikan. */
  name: string;
  /** Keterangan singkat untuk ditampilkan di bawah nama warna. */
  description: string;
  /** Kode warna untuk swatch, contoh "#B9BFC4". */
  hex: string;
  /** Foto unit dalam warna ini. Ganti dengan foto asli dealer. */
  image: string;
}

/**
 * Warna resmi per model, diambil dari halaman model JAECOO Indonesia
 * (`jaecoo.id`) pada 2026-10-05. Tiap model punya palet sendiri, jadi satu
 * daftar global tidak bisa dipakai.
 *
 * `id` wajib unik per model karena dipakai sebagai React key dan nilai
 * select. `hex` untuk swatch, `image` untuk foto unit.
 *
 * CATATAN PENTING - dua hal di bawah tidak boleh dianggap final:
 *
 * 1. `hex` adalah PENDEKATAN yang dipilih manual, BUKAN kode warna resmi.
 *    Swatch di website JAECOO adalah ikon gradien dengan pantulan, bukan chip
 *    warna datar, jadi warna catnya tidak bisa dibaca lewat sampling pixel
 *    (percobaan pertama menghasilkan hal seperti "Stone Gray" = biru).
 *    Kalau butuh warna pixel-perfect, ambil hex dari pricelist resmi dealer.
 *    Swatch sekarang hanya untuk memberi gambaran kasatmata.
 *
 * 2. `image` menunjuk ke foto resmi JAECOO. Cek kembali daftar nama warna di
 *    website JAECOO sebelum publish - kalau pabrikan menambah atau mengganti
 *    nama warna, bagian ini harus ikut diperbarui.
 *
 * GANTI `image` dengan foto unit asli dari showroom begitu tersedia.
 *
 * Referensi nama warna resmi per model (urutan di website pabrikan):
 *   J5  - Ivory Gray, Forest Green, White Pristine, Jet Black
 *   J7  - Stone Gray, Moonlight Silver, Pristine White, Jet Black,
 *         Pristine White Two Tone
 *   J8  - Stone Gray, Pristine White Two Tone, Lunar Silver, Jet Black
 *
 * Catatan "Stone Gray": di J7 file swatch-nya bernama `olive_gray_J7`, dan di
 * J8 ikonnya `Icon_Green_2`. Nama resmi pabrikannya tetap "Stone Gray",
 * sering disebut pula olive grey atau model green di jalur penjualan.
 */
export const modelColors: Record<ModelId, BodyColor[]> = {
  j5: [
    {
      id: "j5-pristine-white",
      name: "Pristine White",
      description: "Putih bersih tanpa kilap metalik",
      hex: "#EDEEEF",
      image: "/images/warna-j5-1.jpg",
    },
    {
      id: "j5-jet-black",
      name: "Jet Black",
      description: "Hitam pekat dengan hasil gloss",
      hex: "#141719",
      image: "/images/warna-j5-2.jpg",
    },
    {
      id: "j5-ivory-gray",
      name: "Ivory Gray",
      description: "Abu-abu hangat dengan nuansa ivory",
      hex: "#C9C6BE",
      image: "/images/warna-j5-3.jpg",
    },
    {
      id: "j5-forest-green",
      name: "Forest Green",
      description: "Hijau hutan gelap, karakter premium",
      hex: "#3A4A3F",
      image: "/images/warna-j5-4.jpg",
    },
  ],
  j7: [
    {
      id: "j7-pristine-white",
      name: "Pristine White",
      description: "Putih bersih tanpa kilap metalik",
      hex: "#EDEEEF",
      image: "/images/warna-j7-1.jpg",
    },
    {
      id: "j7-jet-black",
      name: "Jet Black",
      description: "Hitam pekat dengan kedalaman kristal",
      hex: "#17181A",
      image: "/images/warna-j7-2.jpg",
    },
    {
      id: "j7-stone-gray",
      name: "Stone Gray",
      description: "Abu-abu olive gelap, juga dikenal sebagai Olive Grey atau Model Green",
      hex: "#6B705C",
      image: "/images/warna-j7-3.jpg",
    },
    {
      id: "j7-moonlight-silver",
      name: "Moonlight Silver",
      description: "Perak metalik dengan nuansa moonlight",
      hex: "#C2C6CA",
      image: "/images/warna-j7-4.jpg",
    },
    {
      id: "j7-pristine-white-two-tone",
      name: "Pristine White Two Tone",
      description: "Pristine White dengan kontras atap dua warna",
      hex: "#DDE0E2",
      image: "/images/warna-j7-5.jpg",
    },
  ],
  j8: [
    {
      id: "j8-pristine-white-two-tone",
      name: "Pristine White Two Tone",
      description: "Putih dengan kontras atap dua warna",
      hex: "#DDE0E2",
      image: "/images/warna-j8-1.jpg",
    },
    {
      id: "j8-jet-black",
      name: "Jet Black",
      description: "Hitam pekat dengan hasil gloss",
      hex: "#141719",
      image: "/images/warna-j8-2.jpg",
    },
    {
      id: "j8-stone-gray",
      name: "Stone Gray",
      description: "Abu-abu batu bernuansa hijau, juga dikenal sebagai Olive Grey atau Model Green",
      hex: "#5F6B5C",
      image: "/images/warna-j8-3.jpg",
    },
    {
      id: "j8-lunar-silver",
      name: "Lunar Silver",
      description: "Perak metalik dengan nuansa lunar",
      hex: "#C4C8CC",
      image: "/images/warna-j8-4.jpg",
    },
  ],
};

export type Color = BodyColor;
export type ColorId = string;

/**
 * Warna milik sebuah varian, dihitung dari model induknya. Ini yang dipakai
 * `ColorPicker`, jadi ganti varian otomatis mengganti daftar warnanya.
 */
export function colorsForVariant(variant: Variant): BodyColor[] {
  return modelColors[variant.modelId] ?? [];
}

/**
 * Label warna siap tampil. Kalau nama warna masih placeholder, tampilkan
 * "Warna 1/2/3" supaya sepekerja warna tetap bisa dipakai dan dicoba,
 * tanpa menampilkan teks `[ISI NAMA WARNA]`.
 */
export function colorLabel(color: BodyColor, index: number): string {
  return isPlaceholder(color.name) ? `Warna ${index + 1}` : color.name;
}

/**
 * Nilai satu baris spesifikasi untuk sebuah varian, atau `null` kalau datanya
 * belum tersedia.
 *
 * Satu accessor dipakai bersama oleh tabel perbandingan dan kartu varian
 * supaya keduanya tidak pernah berbeda: kunci yang tidak ada di `specs`
 * (dan nilai placeholder) sama-sama dianggap "belum ada data" dan dirender
 * sebagai "-", bukan muncul sebagai teks kosong atau `[ISI ...]`.
 */
export function specValue(variant: Variant, key: SpecKey): string | null {
  const value = (variant.specs as Partial<Record<SpecKey, string>>)[key];
  if (!value || isPlaceholder(value)) {
    return null;
  }
  return value;
}

/* ------------------------------------------------------------------ */
/*  7. GALERI                                                          */
/* ------------------------------------------------------------------ */

/**
 * GANTI: foto galeri asli dealer. Alt text ditulis generik supaya tetap
 * akurat walau foto sudah diganti ke model lain.
 */
export const gallery = [
  {
    src: "/images/galeri-eksterior-1.jpg",
    alt: "Tampak depan unit JAECOO di dealer Medan",
    label: "Eksterior - Tampak Depan",
    category: "Eksterior",
  },
  {
    src: "/images/galeri-eksterior-2.jpg",
    alt: "Tampak samping unit JAECOO di dealer Medan",
    label: "Eksterior - Samping",
    category: "Eksterior",
  },
  {
    src: "/images/galeri-eksterior-3.jpg",
    alt: "Tampak belakang unit JAECOO di dealer Medan",
    label: "Eksterior - Belakang",
    category: "Eksterior",
  },
  {
    src: "/images/galeri-interior-1.jpg",
    alt: "Dasbor dan layar sentuh JAECOO",
    label: "Interior - Dasbor",
    category: "Interior",
  },
  {
    src: "/images/galeri-interior-2.jpg",
    alt: "Kursi kabin JAECOO",
    label: "Interior - Kursi",
    category: "Interior",
  },
  {
    src: "/images/galeri-interior-3.jpg",
    alt: "Layar sentuh JAECOO",
    label: "Interior - Infotainment",
    category: "Interior",
  },
  {
    src: "/images/galeri-fitur-1.jpg",
    alt: "Kamera 360 derajat pada unit JAECOO",
    label: "Fitur - Kamera 360 derajat",
    category: "Fitur",
  },
  {
    src: "/images/galeri-fitur-2.jpg",
    alt: "Unit JAECOO saat malam hari",
    label: "Fitur - Pencahayaan",
    category: "Fitur",
  },
  {
    src: "/images/galeri-fitur-3.jpg",
    alt: "Prosesori unit JAECOO",
    label: "Fitur - Prosesiori",
    category: "Fitur",
  },
] as const;

export const galleryCategories = ["Semua", "Eksterior", "Interior", "Fitur"] as const;

/* ------------------------------------------------------------------ */
/*  8. SIMULASI KREDIT                                                 */
/* ------------------------------------------------------------------ */

export const credit = {
  title: "Simulasi Kredit JAECOO",
  subtitle:
    "Geser DP, pilih tenor, lihat estimasi cicilan bulan ini. Tanpa registrasi, langsung dapat angkanya.",
  /** Suku bunga flat per tahun (%). Angka ilustrasi umum leasing Indonesia. */
  flatRatePercent: 7.5,
  minDpPercent: 10,
  maxDpPercent: 50,
  defaultDpPercent: 20,
  tenorOptions: [1, 2, 3, 4, 5] as const,
  disclaimer:
    "Estimasi cicilan di atas bersifat illustrasi dan bukan penawaran final. Suku bunga, biaya administrasi, dan securiti ditentukan oleh leasing. Angka final mengikuti keputusan leasing.",
  financingNote:
    "DP mulai 10% dengan tenor hingga 5 tahun. Butuh DP lebih kecil? Konsultasikan program khusus ke sales kami.",
} as const;

/**
 * Cicilan bulanan paling rendah yang bisa dicapai (harga termurah, DP
 * tertinggi, tenor terpanjang). Dipakai untuk copy "cicilan mulai dari ..."
 * di CTA penutup supaya tidak perlu menulis angka manual.
 */
export const lowestMonthlyInstallment = (() => {
  const cheapest = Math.min(...variants.map((variant) => variant.price));
  const longestTenor = credit.tenorOptions[credit.tenorOptions.length - 1];
  const dpAmount = Math.round((cheapest * credit.maxDpPercent) / 100);
  const principal = cheapest - dpAmount;
  const totalBunga = (principal * (credit.flatRatePercent * longestTenor)) / 100;
  return Math.round((principal + totalBunga) / (longestTenor * 12));
})();

/* ------------------------------------------------------------------ */
/*  9. PROMO + COUNTDOWN                                               */
/* ------------------------------------------------------------------ */

/**
 * GANTI: detail promo resmi dealer. Placeholder di bawah sengaja dipakai
 * supaya tidak ada klaim yang belum dikonfirmasi ikut tayang.
 */
export const promo = {
  badge: "PROMO BERLAKU",
  title: "[ISI JUDUL PROMO]",
  description: "[ISI DESKRIPSI PROMO]",
  bullets: ["[ISI PROMO 1]", "[ISI PROMO 2]", "[ISI PROMO 3]", "[ISI PROMO 4]"],
  /** GANTI: tanggal & jam berakhir promo (WIB). Format ISO8601 dengan offset. */
  endsAt: "2026-10-31T23:59:59+07:00",
  quotaTotal: 20,
  /** GANTI: jumlah unit tersisa (dipakai untuk badge urgensi). */
  quotaRemaining: 6,
  ctaLabel: "Klaim Promo Sekarang",
  terms:
    "Promo berlaku selama kuota unit tersedia dan tidak dapat digabung dengan promo lain. Detail dan bonus mengikuti ketentuan dealer.",
  /**
   * Ambang batas unit tersisa untuk menampilkan badge urgensi.
   * GANTI sesuai kebijakan dealer.
   */
  urgentThreshold: 8,
} as const;

/* ------------------------------------------------------------------ */
/*  10. CUSTOMER JOURNEY                                               */
/* ------------------------------------------------------------------ */

/**
 * Janji respons. Dipakai di beberapa section sekaligus, jadi cukup ubah
 * di sini agar tidak ada angka yang tidak sinkron antar halaman.
 */
export const responseTime = {
  /** Respons pada jam kerja, untuk chat WhatsApp dan form. */
  onWorkingHours: "di bawah 10 menit",
  /** Konfirmasi booking test drive. */
  testDriveConfirmation: "1x24 jam",
} as const;

/**
 * Klaim singkat yang tampil sebagai "micro trust" di hero dan CTA penutup.
 * GANTI dengan ketentuan garansi dan skema DP yang benar-benar berlaku.
 * `@todo` - konfirmasi garansi resmi pabrikan untuk J5, J7, dan J8.
 */
export const microTrust = [
  { label: "[ISI KLAIM GARANSI]", icon: "shield" },
  { label: `Balas chat ${responseTime.onWorkingHours}`, icon: "chat" },
  { label: `DP mulai ${credit.minDpPercent}%`, icon: "wallet" },
] as const;

/**
 * `microTrust` versi siap tampil - placeholder dilewati.
 *
 * Dipakai di komponen supaya tidak perlu memanggil `isPlaceholder` di
 * banyak tempat, dan agar placeholder tidak pernah bocor ke UI.
 */
export const visibleMicroTrust = microTrust.filter((item) => !isPlaceholder(item.label));

/**
 * Penawaran singkat di bawah CTA penutup.
 * GANTI agar sesuai program dealer yang sedang berjalan.
 */
export const closingOffers = ["Test drive gratis", "[ISI PENAWARAN LAIN]"] as const;

export const visibleClosingOffers = closingOffers.filter(
  (item) => !isPlaceholder(item),
);

export const journeySteps = [
  {
    step: 1,
    title: "Inquiry",
    description: `Anda isi form atau chat WA. Sales kami membalas ${responseTime.onWorkingHours} pada jam kerja.`,
    duration: responseTime.onWorkingHours,
    icon: "chat",
  },
  {
    step: 2,
    title: "Konsultasi",
    description:
      "Sesi empat mata bersama sales untuk menentukan varian, warna, dan opsi kredit yang paling sesuai kebutuhan Anda.",
    duration: "30-45 menit",
    icon: "user",
  },
  {
    step: 3,
    title: "Test Drive",
    description:
      "Rasakan langsung karakter JAECOO di jalan. Kami atur waktu dan rute agar Anda bisa membandingkan dengan mobil lama Anda.",
    duration: "20-30 menit",
    icon: "steering",
  },
  {
    step: 4,
    title: "Pembelian dan SPK",
    description:
      "Setelah cocok, SPK lengkap dengan rincian harga dan cicilan. DP mulai Rp100 ribu untuk lock unit.",
    duration: "30 menit",
    icon: "document",
  },
  {
    step: 5,
    title: "Pengiriman",
    description:
      "Unit prepping, cek akhir bersama, lalu handover. Setelah itu Anda nikmati pengalaman JAECOO.",
    duration: "7-14 hari",
    icon: "delivery",
  },
] as const;

/* ------------------------------------------------------------------ */
/*  11. TESTIMONI (data dummy - GANTI dengan pelanggan asli)           */
/* ------------------------------------------------------------------ */

/**
 * GANTI: testimonials asli dari pelanggan dealer.
 *
 * PERINGATAN - isi di bawah masih contoh. Jangan tayangkan sebelum diganti:
 * nama, lokasi, dan kutipan di sini adalah rekaan, dan memuat klaim yang
 * belum terverifikasi. Jumlah testimonial dan foto juga menyesuaikan
 * data asli.
 */
export const testimonials = [
  {
    id: "t1",
    name: "[NAMA PELANGGAN 1]",
    location: "[LOKASI]",
    variant: "[ISI VARIAN]",
    quote: "[ISI KUTIPAN ASLI PELANGGAN]",
    image: "/images/testimoni-1.jpg",
    rating: 5,
  },
  {
    id: "t2",
    name: "[NAMA PELANGGAN 2]",
    location: "[LOKASI]",
    variant: "[ISI VARIAN]",
    quote: "[ISI KUTIPAN ASLI PELANGGAN]",
    image: "/images/testimoni-2.jpg",
    rating: 5,
  },
  {
    id: "t3",
    name: "[NAMA PELANGGAN 3]",
    location: "[LOKASI]",
    variant: "[ISI VARIAN]",
    quote: "[ISI KUTIPAN ASLI PELANGGAN]",
    image: "/images/testimoni-3.jpg",
    rating: 5,
  },
  {
    id: "t4",
    name: "[NAMA PELANGGAN 4]",
    location: "[LOKASI]",
    variant: "[ISI VARIAN]",
    quote: "[ISI KUTIPAN ASLI PELANGGAN]",
    image: "/images/testimoni-4.jpg",
    rating: 5,
  },
] as const;

/* ------------------------------------------------------------------ */
/*  12. FAQ                                                            */
/* ------------------------------------------------------------------ */

export const faqs = [
  {
    question: "Model apa saja yang tersedia?",
    answer:
      "Dealer kami menyediakan tiga line-up JAECOO dengan total enam varian: J5, J7, dan J8 ARDIS. J5 adalah SUV listrik murni (BEV) dengan dua varian, J7 memakai Super Hybrid System (PHEV) dan tersedia versi SHS maupun AWD, sedangkan J8 ARDIS adalah SUV tujuh penumpang yang tersedia dalam versi hybrid (SHS) dan bensin (AWD). Harga OTR tiap varian tercantum di bagian Varian dan Harga.",
    category: "Fitur",
  },
  {
    question: "Bedanya powertrain J5, J7, dan J8 ARDIS?",
    answer:
      "J5 sepenuhnya listrik: baterai 60,9 kWh dengan jarak tempuh hingga 461 km, dan DC fast charging 30% ke 80% dalam 28 menit. J7 memakai Super Hybrid System: mesin 1.5TGDI generasi kelima 140 hp dipadukan motor listrik 201 hp, baterai hybrid 18,3 kWh, jarak tempuh gabungan hingga 1.300 km serta hingga 90 km dalam mode full EV. J8 ARDIS adalah SUV tujuh penumpang dengan dua pilihan powertrain: bensin 2.0L Turbo 245-250 hp dengan transmisi 7-percepatan DCT, atau Super Hybrid System dengan mesin 1.5T dan transmisi 3-percepatan DHT yang memberi jarak tempuh gabungan hingga 1.400 km atau hingga 180 km dalam mode full EV.",
    category: "Fitur",
  },
  {
    question: "Apa saja fitur dan kapasitas J8 ARDIS?",
    answer:
      "J8 ARDIS menampung tujuh penumpang dengan konfigurasi 2-3-2. Fiturnya termasuk layar instrumen dan multimedia 14 inci, ambient lighting 256 warna, jok kulit dengan pemanas dan ventilasi, AC 3-zona independen, power tailgate, serta standar keamanan termasuk delapan airbags dan ADAS. Varian AWD menambahkan sistem All Wheel Drive dengan Terrain Response.",
    category: "Fitur",
  },
  {
    question: "Warna apa saja yang tersedia untuk tiap model?",
    answer:
      "J5 tersedia dalam Pristine White, Jet Black, Ivory Gray, dan Forest Green. J7 tersedia dalam Pristine White, Jet Black, Stone Gray, Moonlight Silver, dan Pristine White Two Tone. J8 ARDIS tersedia dalam Pristine White Two Tone, Jet Black, Stone Gray, dan Lunar Silver. Warna Stone Gray di J7 dan J8 sering disebut juga Olive Grey atau Model Green di jalur penjualan - itu nama yang sama untuk cat yang sama. Ketersediaan fisik tiap warna mengikuti unit yang sedang ada di dealer, jadi silakan tentukan warna saat mengisi form SPK atau chat tim kami.",
    category: "Fitur",
  },
  {
    question: "Apakah bisa test drive di Medan?",
    answer:
      "Bisa, dan kami sangat menyarankan test drive sebelum membeli. Silakan isi form Booking Test Drive atau chat WA. Tim kami akan menjadwalkan sesuai ketersediaan unit dan waktu luang Anda. Test drive tersedia di dealer dan area sekitar Medan.",
    category: "Test Drive",
  },
  {
    question: "Kredit dan DP berapa? Apakah bisa DP kecil?",
    answer:
      "Simulasi kredit di halaman ini memakai asumsi DP mulai 10% dan tenor hingga 5 tahun dengan bunga flat, dan hasilnya bersifat estimasi - bukan penawaran final. Suku bunga, biaya administrasi, dan securiti ditentukan oleh leasing. Untuk program dengan DP lebih kecil atau bersubsidi, konsultasikan langsung ke sales kami.",
    category: "Kredit",
  },
  {
    question: "Berapa lama proses SPK dan indent unit?",
    answer:
      "SPK bisa diselesaikan di hari yang sama setelah test drive. Untuk unit stock yang tersedia, proses sekitar 3-7 hari kerja. Untuk indent, estimasi 1-3 bulan tergantung batch dari pabrik. Sales kami akan memberikan update berkala via WhatsApp.",
    category: "Pembelian",
  },
  {
    question: "Apakah menerima tukar tambah?",
    answer:
      "Ya, kami menerima tukar tambah mobil lama apa pun. Tim kami melakukan appraisal dan memberikan tawaran di hari yang sama. Mobil lama yang kondisi baik dapat menjadi tambahan DP yang signifikan.",
    category: "Tukar Tambah",
  },
  {
    question: "Apa saja garansi yang diterima?",
    answer:
      "[ISI KETENTUAN GARANSI RESMI PABRIKAN - mencakup garansi kendaraan dan garansi baterai untuk J5, J7, dan J8 ARDIS. Isi juga syarat agar garansi tetap aktif.]",
    category: "Garansi",
  },
  {
    question: "Bagaimana layanan after-sales?",
    answer:
      "Dealer kami buka Senin-Minggu. Anda mendapat layanan service berkala dengan teknisi terlatih dan suku cadang asli. Ada nomor layanan darurat 24/7 yang bisa dihubungi jika kendaraan bermasalah di jalan.",
    category: "After-Sales",
  },
  {
    question: "Di mana lokasi dealer? Apakah bisa datang langsung?",
    answer:
      "Dealer kami berada di [ALAMAT DEALER], Medan, Sumatera Utara, dan buka setiap hari sesuai jam operasional di atas. Silakan datang langsung tanpa perlu janji, tapi untuk test drive atau konsultasi yang memerlukan unit spesifik, kami sarankan booking dulu via WA agar waktu Anda lebih efektif.",
    category: "Lokasi",
  },
  {
    question: "Apakah harga di halaman ini sudah final?",
    answer:
      "Harga yang ditampilkan adalah harga OTR (on-the-road) di Medan termasuk pajak dan BPKB. Harga final bisa berbeda tergantung pilihan warna, opsi tambahan, dan program insentif tertentu. Sales kami akan mengonfirmasi harga final di dokumen SPK resmi sebelum Anda tanda tangan.",
    category: "Harga",
  },
] as const;

/* ------------------------------------------------------------------ */
/*  13. TEST DRIVE                                                    */
/* ------------------------------------------------------------------ */

export const testDrive = {
  title: `Booking Test Drive ${site.brand} ${site.city}`,
  subtitle: `Rasakan langsung karakter ${site.model}. Pilih tanggal dan sesi, tim kami yang mengatur semuanya.`,
  sessions: [
    { id: "pagi", label: "Pagi", time: "09.00 - 11.00" },
    { id: "siang", label: "Siang", time: "11.00 - 14.00" },
    { id: "sore", label: "Sore", time: "14.00 - 17.00" },
  ],
  /** Sesi yang terpilih secara default di form (index ke-1). */
  defaultSessionIndex: 1,
  location: address.street,
  benefits: [
    "Rute test drive disesuaikan dengan kondisi jalan yang Anda pilih",
    "Unit tersedia setiap hari sesuai jam operasional dealer",
    "Tidak ada kewajiban untuk langsung membeli",
  ],
} as const;

/** Id sesi default, diturunkan dari `testDrive.sessions`. */
export const defaultTestDriveSession = testDrive.sessions[testDrive.defaultSessionIndex].id;

/* ------------------------------------------------------------------ */
/*  14. PESAN WHATSAPP                                                 */
/* ------------------------------------------------------------------ */

/** Template pesan WhatsApp. Ganti nama sales di satu tempat (contact.salesName). */
export const waMessages = {
  general: (sales: string) =>
    `Halo ${sales}, saya tertarik dengan ${site.brand} ${site.model} di ${site.city}. Boleh minta info harga dan ketersediaan unit?`,
  variant: (sales: string, variantName: string) =>
    `Halo ${sales}, saya tertarik dengan ${site.brand} ${site.model} varian ${variantName}. Boleh minta info harga OTR dan ketersediaan warnanya?`,
  color: (sales: string, variantName: string, colorName: string) =>
    `Halo ${sales}, saya tertarik dengan ${site.brand} ${site.model} varian ${variantName} warna ${colorName}. Apakah warna ini tersedia untuk pengiriman cepat?`,
  credit: (sales: string, variantName: string, installment: string) =>
    `Halo ${sales}, saya sudah melakukan simulasi kredit untuk ${site.brand} ${site.model} varian ${variantName} dengan estimasi cicilan ${installment} per bulan. Boleh saya ajukan pengajuan kreditnya?`,
  testDrive: (sales: string) =>
    `Halo ${sales}, saya ingin booking test drive ${site.brand} ${site.model} di ${site.city}. Mohon info jadwal dan lokasinya.`,
  promo: (sales: string) =>
    `Halo ${sales}, saya tertarik dengan PROMO bulan ini untuk ${site.brand} ${site.model}. Mohon info detail promo, kuota tersedia, dan bonus yang bisa saya dapat.`,
  feature: (sales: string, featureTitle: string) =>
    `Halo ${sales}, saya tertarik dengan keunggulan ${site.brand} ${site.model} bagian "${featureTitle}". Bisa jelaskan lebih detail?`,
  location: (sales: string) =>
    `Halo ${sales}, saya ingin menanyakan lokasi dealer ${site.brand} ${site.model} di ${site.city} dan jam bukanya.`,
  spkResult: (sales: string, summary: string) =>
    `Halo ${sales}, saya sudah mengisi form Pemesanan SPK di website.\n\n${summary}\n\nMohon konfirmasi proses berikutnya ya. Terima kasih!`,
  testDriveResult: (sales: string, summary: string) =>
    `Halo ${sales}, saya sudah mengisi form Booking Test Drive di website.\n\n${summary}\n\nMohon konfirmasi jadwalnya ya. Terima kasih!`,
} as const;

/* ------------------------------------------------------------------ */
/*  15. SEO & NAVIGATION                                               */
/* ------------------------------------------------------------------ */

export const navLinks = [
  { href: "#beranda", label: "Beranda" },
  { href: "#model", label: "Model" },
  { href: "#keunggulan", label: "Keunggulan" },
  { href: "#varian", label: "Varian dan Harga" },
  { href: "#simulasi", label: "Simulasi Kredit" },
  { href: "#faq", label: "FAQ" },
] as const;

/**
 * Kata kunci SEO. Keyword per model dibangkitkan dari `models` supaya
 * tidak perlu ditulis manual dan tetap sinkron saat lineup berubah.
 */
export const seo = {
  /** GANTI dengan domain produksi. */
  siteUrl: "https://jaecoo-medan.example.com",
  title: `Dealer Resmi ${site.brand} ${site.model} di ${site.city} | Harga, Kredit, dan Test Drive`,
  titleTemplate: `%s | ${site.brand} ${site.city}`,
  description: `Dealer resmi ${site.brand} di ${site.cityLong}. Jual ${site.model} dengan harga OTR, simulasi kredit, booking SPK online, dan test drive. Promo terbatas setiap bulan. Hubungi sales sekarang.`,
  ogImage: "/images/og-cover.jpg",
  locale: "id_ID",
  keywords: [
    `dealer ${site.brand} ${site.city}`,
    `${site.brand} ${site.city}`,
    ...models.flatMap((model) => [
      `${model.name} ${site.city}`,
      `harga ${model.fullName}`,
      `${model.fullName} ${site.region}`,
      `${model.fullName} OTR ${site.city}`,
    ]),
    `SPK ${site.brand}`,
    `test drive ${site.brand} ${site.city}`,
    `kredit SUV ${site.city}`,
  ],
} as const;

/* ------------------------------------------------------------------ */
/*  16. KOTA LAYARAN (form SPK)                                       */
/* ------------------------------------------------------------------ */

export const cities = [
  "Medan",
  "Binjai",
  "Deli Serdang",
  "Karo",
  "Simalungun",
  "Langkat",
  "Serdang Bedagai",
  "Toba",
  "Tapanuli Utara",
  "Mandailing Natal",
  "Dairi",
  "Pakpak Bharat",
  "Lhokseumawe (Aceh Utara)",
  "Lainnya",
] as const;

/* ------------------------------------------------------------------ */
/*  17. DISCLAIMER FOOTER                                              */
/* ------------------------------------------------------------------ */

export const footerDisclaimer = {
  price: `Harga yang tercantum adalah harga OTR (on-the-road) di Medan dan dapat berubah sewaktu-waktu tanpa pemberitahuan sebelumnya. Harga final dikonfirmasi dalam dokumen SPK resmi.`,
  credit:
    "Simulasi kredit bersifat estimasi dan bukan penawaran kredit. Suku bunga dan biaya akhir mengikuti ketentuan leasing.",
  images:
    "Gambar mobil bersifat ilustrasi dan dapat berbeda dari unit aktual. Spesifikasi dapat berubah sesuai penyedia resmi.",
} as const;
