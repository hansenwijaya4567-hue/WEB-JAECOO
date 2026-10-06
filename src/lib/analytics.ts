/**
 * Event tracking terpusat untuk GA4 dan Meta Pixel.
 *
 * ID diambil dari environment variable sehingga tidak perlu hardcode:
 *   NEXT_PUBLIC_GA_ID       -> G-XXXXXXXXXX
 *   NEXT_PUBLIC_META_PIXEL_ID -> 123456789012345
 *
 * Tracker bersifat no-op bila ID tidak di-set, jadi aman dipanggil
 * di development tanpa error.
 */

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

/** Nama event GA4 (paling sesuai untuk konversi). */
export const GA_EVENTS = {
  waClick: "whatsapp_click",
  spkSubmit: "spk_form_submit",
  testDriveSubmit: "test_drive_submit",
  creditSimulate: "credit_simulation",
  variantSelect: "variant_select",
  phoneClick: "phone_click",
  directionClick: "direction_click",
} as const;

export type GaEventName = (typeof GA_EVENTS)[keyof typeof GA_EVENTS];

const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "";
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "";

export function hasGa(): boolean {
  return GA_ID.length > 0;
}

export function hasMetaPixel(): boolean {
  return META_PIXEL_ID.length > 0;
}

/**
 * Kirim event ke GA4 dan Meta Pixel sekaligus.
 *
 * @param name Nama event (lihat GA_EVENTS).
 * @param params Parameter tambahan, misal { variant: "J7 AWD" }.
 */
export function trackEvent(name: GaEventName | string, params: Record<string, unknown> = {}): void {
  if (typeof window === "undefined") return;

  // GA4
  if (hasGa() && typeof window.gtag === "function") {
    window.gtag("event", name, params);
  }

  // Meta Pixel
  if (hasMetaPixel() && typeof window.fbq === "function") {
    window.fbq("track", mapToMetaEvent(name), {
      ...params,
      content_name: String(params.variant ?? name),
      content_category: "jaecoo_medan",
    });
  }
}

/** Petakan event internal ke nama event standar Meta. */
function mapToMetaEvent(name: string): string {
  switch (name) {
    case GA_EVENTS.waClick:
      return "Lead";
    case GA_EVENTS.spkSubmit:
    case GA_EVENTS.testDriveSubmit:
      return "Lead";
    case GA_EVENTS.creditSimulate:
      return "AddToCart";
    case GA_EVENTS.variantSelect:
      return "ViewContent";
    default:
      return "CustomEvent";
  }
}

/** Inisialisasi gtag dan fbq setelah halaman dimuat. */
export function initAnalytics(): void {
  if (typeof window === "undefined") return;

  if (hasGa() && typeof window.gtag === "function") {
    window.gtag("js", new Date());
  }

  if (hasMetaPixel() && typeof window.fbq === "function") {
    window.fbq("init", META_PIXEL_ID);
  }
}