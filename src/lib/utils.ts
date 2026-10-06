import { contact } from "@/data/config";

/* ------------------------------------------------------------------ */
/*  FORMAT RUPIAH                                                      */
/* ------------------------------------------------------------------ */

const rupiahFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

/** Format angka menjadi Rupiah, contoh: 289000000 -> "Rp289.000.000" */
export function formatRupiah(value: number): string {
  return rupiahFormatter.format(value).replace(/\s/g, "");
}

/**
 * Format ringkas untuk badge / chip, contoh: 289000000 -> "Rp289 juta"
 */
export function formatRupiahShort(value: number): string {
  if (value >= 1_000_000_000) {
    const billions = value / 1_000_000_000;
    return `Rp${trimZero(billions)} miliar`;
  }
  if (value >= 1_000_000) {
    const millions = value / 1_000_000;
    return `Rp${trimZero(millions)} juta`;
  }
  return formatRupiah(value);
}

function trimZero(num: number): string {
  return num.toFixed(1).replace(/\.0$/, "");
}

/* ------------------------------------------------------------------ */
/*  WHATSAPP LINK BUILDER                                              */
/* ------------------------------------------------------------------ */

/**
 * Bangun link wa.me dengan pesan ter-encode.
 *
 * @param message Pesan yang akan otomatis terisi di chat sales.
 * @returns URL `https://wa.me/62xxx?text=...`
 */
export function buildWhatsAppLink(message: string): string {
  const base = `https://wa.me/${contact.whatsapp}`;
  return `${base}?text=${encodeURIComponent(message)}`;
}

/**
 * Buka WhatsApp di tab baru.
 * `window.open` bisa diblokir popup blocker, jadi sediakan fallback
 * dengan navigasi langsung ke link yang sama.
 */
export function openWhatsApp(message: string): void {
  const url = buildWhatsAppLink(message);
  const win = window.open(url, "_blank", "noopener,noreferrer");
  if (!win) window.location.href = url;
}

/* ------------------------------------------------------------------ */
/*  VALIDASI NOMOR HP INDONESIA                                         */
/* ------------------------------------------------------------------ */

/**
 * Validasi dan normalisasi nomor WhatsApp Indonesia.
 *
 * Aturan:
 * - Hanya digit, spasi, tanda hubung, dan "+" yang diizinkan.
 * - Setelah dibersihkan harus diawali 62 (kode negara) atau 0 (format lokal).
 * - Panjang total 10-15 digit.
 *
 * @returns Nomor dalam format 62xxx, atau null jika tidak valid.
 */
export function normalizeIndonesianPhone(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  // Tolak karakter yang tidak diizinkan (sudah termasuk huruf/simbol aneh).
  if (!/^[+\d\s()-]+$/.test(trimmed)) return null;

  let digits = trimmed.replace(/\D/g, "");
  if (!digits) return null;

  // Buang awalan 0 atau +62 berulang.
  if (digits.startsWith("62")) {
    digits = digits.slice(2);
  } else if (digits.startsWith("0")) {
    digits = digits.slice(1);
  }

  // Setelah dibersihkan harus 9-13 digit (nomor lokal Indonesia).
  if (digits.length < 9 || digits.length > 13) return null;

  // Nomor Indonesia tidak diawali 0 setelah kode negara.
  if (digits.startsWith("0")) return null;

  return `62${digits}`;
}

/** Format tampilan yang lebih rapi, contoh: 62xxx -> "0812-3456-7890" */
export function formatPhoneForDisplay(normalized62: string): string {
  const local = normalized62.replace(/^62/, "0");
  return local.replace(/(\d{4})(\d{4})(\d+)/, "$1-$2-$3");
}

/* ------------------------------------------------------------------ */
/*  SIMULASI KREDIT                                                    */
/* ------------------------------------------------------------------ */

export interface CreditInput {
  /** Harga OTR kendaraan (Rp). */
  price: number;
  /** Percent DP, misal 20 berarti 20%. */
  dpPercent: number;
  /** Tenor dalam tahun. */
  tenorYears: number;
  /** Suku bunga flat per tahun (%). */
  flatRatePercent: number;
}

export interface CreditResult {
  dpAmount: number;
  principal: number;
  monthlyInstallment: number;
  totalPayment: number;
  flatRatePercent: number;
  tenorYears: number;
}

/**
 * Hitung cicilan dengan metode bunga flat.
 *
 * Flat rate dihitung dari nilai pokok (principal), bukan dari sisa
 * outstanding. Pendekatan ini umum dipakai leasing Indonesia.
 *
 * Cicilan bulanan = (Pokok + Total Bunga) / (Tenor x 12)
 * Total Bunga     = Pokok x (flatRate x tenor) / 100
 */
export function calculateCredit(input: CreditInput): CreditResult {
  const { price, dpPercent, tenorYears, flatRatePercent } = input;

  const safePrice = Math.max(0, price);
  const safeDpPercent = Math.min(100, Math.max(0, dpPercent));
  const safeTenor = Math.max(1, tenorYears);

  const dpAmount = Math.round((safePrice * safeDpPercent) / 100);
  const principal = Math.max(0, safePrice - dpAmount);
  const totalBunga = (principal * (flatRatePercent * safeTenor)) / 100;
  const monthlyInstallment = Math.round((principal + totalBunga) / (safeTenor * 12));
  const totalPayment = monthlyInstallment * safeTenor * 12;

  return {
    dpAmount,
    principal,
    monthlyInstallment,
    totalPayment,
    flatRatePercent,
    tenorYears: safeTenor,
  };
}

/* ------------------------------------------------------------------ */
/*  FORMAT TANGGAL                                                     */
/* ------------------------------------------------------------------ */

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Asia/Jakarta",
});

/** Format tanggal menjadi "Kamis, 5 Maret 2026" (WIB). */
export function formatTanggal(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return dateFormatter.format(date);
}

/** Tanggal minimal untuk input date (hari ini, format YYYY-MM-DD). */
export function todayInputValue(): string {
  const now = new Date();
  // Offset WIB (+7 jam) agar tanggal tidak bergeser.
  const wib = new Date(now.getTime() + (7 * 60 + now.getTimezoneOffset()) * 60_000);
  return wib.toISOString().slice(0, 10);
}

/* ------------------------------------------------------------------ */
/*  CLASSNAME HELPER                                                   */
/* ------------------------------------------------------------------ */

/** Gabungkan class name, buang yang falsy. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/* ------------------------------------------------------------------ */
/*  SLUG / LAIN-LAIN                                                   */
/* ------------------------------------------------------------------ */

/** Ubah nilai menjadi slug sederhana untuk id elemen. */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/* ------------------------------------------------------------------ */
/*  ANGKA DALAM BAHASA INDONESIA                                        */
/* ------------------------------------------------------------------ */

const indonesianDigits = [
  "nol",
  "satu",
  "dua",
  "tiga",
  "empat",
  "lima",
  "enam",
  "tujuh",
  "delapan",
  "sembilan",
  "sepuluh",
] as const;

/**
 * Ubah angka kecil (0-10) menjadi kata Indonesia, agar copy seperti
 * "Tiga varian" atau "Lima langkah" ikut berubah otomatis saat jumlah
 * item di config ditambah atau dikurangi.
 *
 * Di luar rentang tersebut angka dikembalikan apa adanya supaya teks
 * tetap terbaca ("12 varian"), bukan "-- varian".
 */
export function spell(value: number): string {
  if (!Number.isInteger(value) || value < 0 || value > indonesianDigits.length) {
    return String(value);
  }
  return indonesianDigits[value];
}