import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { sheetsWebhookEnvVar, sheetsWebhookUrl } from "@/data/config";

/**
 * API route: meneruskan lead ke Google Sheets lewat Google Apps Script webhook.
 *
 * Alasan tidak memanggil Apps Script langsung dari browser:
 *  1. Webhook URL tidak terekspos di client bundle.
 *  2. Bisa ditambahkan validasi dan rate limit di server.
 *  3. Kalau webhook kosong (mode demo), route ini tetap mengembalikan
 *     sukses sehingga pengalaman pengguna tidak terganggu.
 */

export const runtime = "nodejs";

/** Nama sheet yang digunakan di Google Sheets. */
const SHEET_NAME = "Leads";

interface LeadPayload {
  [key: string]: unknown;
}

/** Header wajib agar Google Apps Script bisa memproses POST JSON. */
function buildHeaders(): Record<string, string> {
  return {
    "Content-Type": "application/json",
    // Google Apps ScriptdoGet doPost butuh header ini untuk menerima JSON.
    "X-Requested-With": "XMLHttpRequest",
  };
}

export async function POST(request: Request) {
  // 1. Rate limit per IP.
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  if (!checkRateLimit(ip, 5, 60_000)) {
    return NextResponse.json(
      { ok: false, error: "Terlalu banyak permintaan. Coba lagi dalam 1 menit." },
      { status: 429 },
    );
  }

  // 2. Parse body.
  let payload: LeadPayload;
  try {
    payload = (await request.json()) as LeadPayload;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Format permintaan tidak valid." },
      { status: 400 },
    );
  }

  // 3. Honeypot: kalau field ini terisi, anggap bot. Tetap balas sukses
  //    supaya bot tidak belajar, tapi jangan kirim ke Sheets.
  if (payload.website) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  // 4. Ambil URL webhook: environment variable menimpa nilai di config.
  const webhookUrl = process.env[sheetsWebhookEnvVar] || sheetsWebhookUrl;

  // 5. Mode demo: tidak ada webhook yang dikonfigurasi.
  if (!webhookUrl) {
    return NextResponse.json({ ok: true, mode: "demo" });
  }

  // 6. Kirim ke Google Apps Script.
  const sheetPayload = {
    sheetName: SHEET_NAME,
    ...payload,
    submittedAt: new Date().toISOString(),
  };

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: buildHeaders(),
      body: JSON.stringify(sheetPayload),
      // Timeout 8 detik agar tidak menggantung form.
      signal: AbortSignal.timeout(8_000),
    });

    if (!response.ok) {
      return NextResponse.json(
        { ok: false, error: "Gagal menyimpan ke database. Silakan hubungi sales via WhatsApp." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Gagal menyimpan ke database. Silakan hubungi sales via WhatsApp." },
      { status: 502 },
    );
  }
}