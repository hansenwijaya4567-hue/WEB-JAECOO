"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check, GitCompare, MessageCircle } from "lucide-react";
import { contact, isPlaceholder, models, site, SPEC_KEYS, specValue, variants, waMessages, type Variant } from "@/data/config";
import { formatRupiah, spell } from "@/lib/utils";
import { GA_EVENTS, trackEvent } from "@/lib/analytics";
import { Section, SectionHeading } from "@/components/ui/Section";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { Modal } from "@/components/ui/Modal";

/**
 * Section varian & harga.
 *
 * Tombol "Pilih Varian Ini"fillsform SPK dengan varian terpilih
 * lalu menggulir ke form, sehingga alur konversi tidak terputus.
 */
export function VariantsSection({ onSelectVariant }: { onSelectVariant: (id: string) => void }) {
  const [compareOpen, setCompareOpen] = useState(false);

  const handleSelect = (variant: Variant) => {
    trackEvent(GA_EVENTS.variantSelect, {
      variant: variant.name,
      price: variant.price,
    });
    onSelectVariant(variant.id);

    // Gulir ke form SPK agar pengguna langsung melihat field terisi.
    document.getElementById("spk")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <Section id="varian" tone="white">
      <RevealGroup>
        <SectionHeading
          eyebrow="Varian dan Harga"
          title={
            <>
              {`${spell(variants.length)} varian`}, satu keputusan yang{" "}
              <span className="text-brand-600">tepat</span>
            </>
          }
          description={`Harga OTR ${site.city} sudah termasuk PPN dan BPKB. Pilih varian yang paling sesuai - tombol di bawah langsung mengisi form pemesanan SPK Anda.`}
        />

        {/* Tombol pembanding */}
        <div className="mt-7 flex justify-center">
          <button
            type="button"
            onClick={() => {
              trackEvent(GA_EVENTS.variantSelect, { action: "open_comparison" });
              setCompareOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-5 py-2.5 text-sm font-bold text-ink shadow-soft transition-all hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
          >
            <GitCompare className="h-4 w-4" />
            Bandingkan Varian
          </button>
        </div>

        {/* Kartu varian, dikelompokkan per model */}
        <div className="mt-10 space-y-14">
          {models.map((model) => {
            const modelVariants = variants.filter(
              (variant) => variant.modelId === model.id,
            );
            if (modelVariants.length === 0) return null;

            return (
              <div key={model.id}>
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-line pb-3">
                  <h3 className="text-2xl font-black tracking-tight text-ink">
                    {model.fullName}
                  </h3>
                  <span className="text-sm font-bold text-brand-600">
                    {`${spell(modelVariants.length)} varian`}
                  </span>
                  {!isPlaceholder(model.bodyType) ? (
                    <span className="text-sm text-ink/50">{model.bodyType}</span>
                  ) : null}
                </div>
                {!isPlaceholder(model.tagline) ? (
                  <p className="mt-3 text-sm text-ink/60">{model.tagline}</p>
                ) : null}

                <div className="mt-6 grid gap-6 lg:grid-cols-2">
                  {modelVariants.map((variant) => (
                    <VariantCard key={variant.id} variant={variant} onSelect={handleSelect} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Catatan */}
        <p className="mx-auto mt-8 max-w-2xl text-center text-xs leading-relaxed text-ink/50">
          Harga OTR dapat berubah sewaktu-waktu. Harga final serta bonus promo dikonfirmasi dalam
          dokumen SPK resmi.
        </p>
      </RevealGroup>

      {/* Modal perbandingan */}
      <CompareModal open={compareOpen} onClose={() => setCompareOpen(false)} />
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  KARTU VARIAN                                                       */
/* ------------------------------------------------------------------ */

function VariantCard({
  variant,
  onSelect,
}: {
  variant: Variant;
  onSelect: (variant: Variant) => void;
}) {
  const isFeatured = variant.isFeatured;
  const subtitle = isPlaceholder(variant.subtitle) ? null : variant.subtitle;
  const highlights = variant.highlights.filter((item) => !isPlaceholder(item));

  return (
    <RevealItem className="h-full">
      <motion.article
        whileHover={{ y: -6 }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
        className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border bg-white transition-shadow duration-300 hover:shadow-lift ${
          isFeatured
            ? "border-brand-400 shadow-card ring-1 ring-brand-200"
            : "border-line shadow-soft"
        }`}
      >
        {variant.badge && !isPlaceholder(variant.badge) ? (
          <span
            className={`absolute top-4 left-4 z-10 rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-wider text-white shadow-soft ${
              isFeatured ? "bg-brand-500" : "bg-ink/85"
            }`}
          >
            {variant.badge}
          </span>
        ) : null}

        <div className="relative aspect-[16/10] overflow-hidden bg-brand-50">
          <Image
            src={variant.image}
            alt={variant.imageAlt}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
          />
        </div>

        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-xl font-extrabold text-ink sm:text-2xl">{variant.name}</h3>
            <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-[11px] font-bold text-brand-700">
              {variant.powertrain}
            </span>
          </div>
          {subtitle ? <p className="mt-1 text-sm text-ink/55">{subtitle}</p> : null}

          <div className="mt-4">
            <span className="tabular text-3xl font-black tracking-tight text-ink">
              {formatRupiah(variant.price)}
            </span>
            <p className="mt-0.5 text-[11px] text-ink/45">
              OTR {site.city} - sudah termasuk PPN &amp; BPKB
            </p>
          </div>

          {highlights.length > 0 ? (
            <ul className="mt-5 flex-1 space-y-2.5">
              {highlights.map((highlight) => (
                <li key={highlight} className="flex items-start gap-2.5 text-sm text-ink/75">
                  <span className="mt-0.5 grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full bg-brand-500/12 text-brand-600">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  <span className="leading-snug">{highlight}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-5 flex-1" />
          )}

          <div className="mt-6 flex flex-col gap-2.5">
            <button
              type="button"
              onClick={() => onSelect(variant)}
              className={`group/btn inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition-all active:scale-[0.98] ${
                isFeatured
                  ? "bg-brand-500 text-white shadow-[0_10px_24px_-10px_rgb(15_122_131/0.85)] hover:bg-brand-600"
                  : "bg-ink text-white hover:bg-ink-soft"
              }`}
            >
              Pilih Varian Ini
              <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
            </button>

            <WhatsAppLink
              message={waMessages.variant(contact.salesName, variant.name)}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-line bg-white px-5 py-3 text-sm font-bold text-ink/75 transition-all hover:border-wa/40 hover:bg-wa/5 hover:text-[#128c4a]"
            >
              <MessageCircle className="h-4 w-4 fill-current" />
              Tanya Varian Ini via WA
            </WhatsAppLink>
          </div>
        </div>
      </motion.article>
    </RevealItem>
  );
}

/* ------------------------------------------------------------------ */
/*  TABEL PERBANDINGAN                                                 */
/* ------------------------------------------------------------------ */

function CompareModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  /**
   * Baris spesifikasi yang semua variannya masih placeholder disembunyikan,
   * supaya tabel tidak terlihat penuh "[ISI SPESIFIKASI]". Baris akan muncul
   * sendiri begitu data spesifikasi asli dimasukkan ke `config.ts`.
   *
   * Urutan baris mengikuti `SPEC_KEYS` di config supaya tabel selalu sama
   * antar varian, bukan ikut urutan penulisan objek.
   */
  const specKeys = SPEC_KEYS.filter((key) =>
    variants.some((variant) => specValue(variant, key) !== null),
  );

  return (
    <Modal open={open} onClose={onClose} title={`Perbandingan Varian ${site.brand} ${site.city}`} size="xl">
      <div className="-mx-1 overflow-x-auto px-1">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <caption className="sr-only">
            {`Perbandingan spesifikasi dan harga seluruh varian ${site.brand} ${site.city}`}
          </caption>
          <thead>
            <tr>
              <th scope="col" className="sticky left-0 z-10 bg-white px-3 py-3 align-bottom">
                <span className="text-xs font-semibold uppercase tracking-wider text-ink/45">
                  Spesifikasi
                </span>
              </th>
              {variants.map((variant) => (
                <th key={variant.id} scope="col" className="px-3 py-3 align-bottom">
                  <span className="block text-base font-extrabold text-ink">
                    {variant.name}
                  </span>
                  <span className="mt-1 block text-[11px] font-bold text-brand-600">
                    {variant.powertrain}
                  </span>
                  <span className="tabular mt-2 block text-sm font-black text-brand-600">
                    {formatRupiah(variant.price)}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="bg-brand-50/60">
              <th scope="row" className="sticky left-0 z-10 bg-brand-50/60 px-3 py-3 text-xs font-bold uppercase tracking-wider text-brand-700">
                Harga OTR
              </th>
              {variants.map((variant) => (
                <td key={variant.id} className="tabular px-3 py-3 text-sm font-bold text-ink">
                  {formatRupiah(variant.price)}
                </td>
              ))}
            </tr>

            {specKeys.map((key) => (
              <tr key={key} className="border-b border-line last:border-0">
                <th
                  scope="row"
                  className="sticky left-0 z-10 bg-white px-3 py-3 text-sm font-semibold text-ink/70"
                >
                  {key}
                </th>
                {variants.map((variant) => {
                  const value = specValue(variant, key);
                  return (
                    <td key={variant.id} className="px-3 py-3 text-sm text-ink/75">
                      {value === null ? (
                        <span className="text-ink/30">-</span>
                      ) : (
                        value
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>

        {specKeys.length === 0 ? (
          <p className="mt-4 rounded-2xl bg-brand-50 px-4 py-3 text-center text-sm text-brand-800">
            Tabel spesifikasi lengkap akan tampil di sini setelah data teknis resmi tiap
            varian dimuat.
          </p>
        ) : null}
      </div>

      <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
        {variants.map((variant) => (
          <WhatsAppLink
            key={variant.id}
            message={waMessages.variant(contact.salesName, variant.name)}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-wa px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1eb856]"
          >
            <MessageCircle className="h-4 w-4 fill-current" />
            Tanya {variant.name}
          </WhatsAppLink>
        ))}
      </div>
    </Modal>
  );
}