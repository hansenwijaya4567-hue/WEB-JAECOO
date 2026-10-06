"use client";

import { MessageCircle, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { contact, waMessages } from "@/data/config";
import { buildWhatsAppLink, cn } from "@/lib/utils";
import { GA_EVENTS, trackEvent } from "@/lib/analytics";

/**
 * Tombol WhatsApp mengambang di kanan bawah (desktop & mobile).
 * Muncul setelah pengguna scroll sedikit agar tidak menutupi hero.
 */
export function FloatingWhatsApp() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href={buildWhatsAppLink(waMessages.general(contact.salesName))}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent(GA_EVENTS.waClick, { placement: "floating" })}
      aria-label="Chat WhatsApp sales JAECOO Medan"
      className={cn(
        "fixed right-4 bottom-[5.25rem] z-40 grid h-14 w-14 place-items-center rounded-full bg-wa text-white shadow-[0_10px_28px_-8px_rgb(37_211_102/0.85)] transition-all duration-300 hover:scale-110 hover:bg-[#1eb856] sm:right-6 sm:bottom-6 sm:h-16 sm:w-16",
        visible
          ? "translate-y-0 scale-100 opacity-100"
          : "pointer-events-none translate-y-4 scale-90 opacity-0",
      )}
    >
      <MessageCircle className="h-7 w-7 fill-current" />
      {/* Pulse halus sebagai penanda konversi */}
      <span className="absolute inset-0 animate-pulse-ring rounded-full" aria-hidden="true" />
    </a>
  );
}

/**
 * Sticky bottom bar untuk mobile: dua tombol konversi utama.
 * Disembunyikan saat `hidden` true agar tidak menutupi form yang
 * sedang diisi pengguna.
 */
export function MobileStickyBar({ hidden = false }: { hidden?: boolean }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 260);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const show = visible && !hidden;

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 backdrop-blur-xl transition-transform duration-300 lg:hidden",
        show ? "translate-y-0" : "translate-y-full",
      )}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="grid grid-cols-2 gap-2 px-3 py-2.5">
        <a
          href={buildWhatsAppLink(waMessages.general(contact.salesName))}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent(GA_EVENTS.waClick, { placement: "sticky_bar" })}
          className="flex items-center justify-center gap-2 rounded-full border border-wa/35 bg-wa/10 px-4 py-3 text-sm font-bold text-[#128c4a]"
        >
          <MessageCircle className="h-[18px] w-[18px] fill-current" />
          Chat WA
        </a>

        <a
          href="#spk"
          onClick={() => trackEvent(GA_EVENTS.spkSubmit, { placement: "sticky_bar_click" })}
          className="flex items-center justify-center gap-2 rounded-full bg-brand-500 px-4 py-3 text-sm font-bold text-white shadow-[0_8px_20px_-8px_rgb(15_122_131/0.75)]"
        >
          <FileText className="h-[18px] w-[18px]" />
          Pesan Sekarang
        </a>
      </div>
    </div>
  );
}