import { ArrowRight, FileText, MessageCircle } from "lucide-react";
import {
  contact,
  entryVariant,
  lowestMonthlyInstallment,
  site,
  visibleClosingOffers as closingOffers,
  visibleMicroTrust as microTrust,
  waMessages,
} from "@/data/config";
import { formatRupiah, formatRupiahShort } from "@/lib/utils";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";

/**
 * CTA penutup. Berulangannya disengaja: setelah melewati seluruh isi
 * halaman, tombol konversi muncul lagi di titik paling dekat tombol
 * konversi biasanya diklik.
 */
export function ClosingCTA() {
  return (
    <Section id="cta" tone="brand" className="relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern" aria-hidden="true" />
      <div
        className="absolute left-1/2 top-0 h-96 w-[36rem] -translate-x-1/2 rounded-full bg-accent/15 blur-3xl"
        aria-hidden="true"
      />

      <Reveal className="relative mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-black leading-[1.1] tracking-tight sm:text-5xl">
          Siap Memiliki <span className="text-brand-200">{site.brand} {site.model}</span>?
        </h2>

        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
          Harga mulai {formatRupiah(entryVariant.price)} OTR {site.city}, cicilan dari{" "}
          {formatRupiahShort(lowestMonthlyInstallment)} per bulan.
          Promo bulan ini terbatas - sisakan unit Anda sebelum kuota habis.
        </p>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <a
            href="#spk"
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-4 text-base font-bold text-brand-700 shadow-[0_14px_32px_-12px_rgb(0_0_0/0.55)] transition-all hover:bg-brand-50 active:scale-[0.98]"
          >
            <FileText className="h-5 w-5" />
            Pesan SPK Sekarang
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </a>

          <WhatsAppLink
            message={waMessages.general(contact.salesName)}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-7 py-4 text-base font-bold text-white backdrop-blur-sm transition-all hover:bg-white/20 active:scale-[0.98]"
          >
            <MessageCircle className="h-5 w-5 fill-current" />
            Chat {contact.salesName}
          </WhatsAppLink>
        </div>

        {/* Micro trust */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-white/55">
          {microTrust
            .filter((item) => item.icon === "shield" || item.icon === "wallet")
            .map((item) => (
              <span key={item.label}>{item.label}</span>
            ))}
          {closingOffers.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}