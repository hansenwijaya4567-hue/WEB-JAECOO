"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, MessageCircle } from "lucide-react";
import {
  colorLabel,
  colorsForVariant,
  contact,
  isPlaceholder,
  models,
  variants,
  waMessages,
  type ColorId,
} from "@/data/config";
import { formatRupiah, spell } from "@/lib/utils";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { GA_EVENTS, trackEvent } from "@/lib/analytics";

/**
 * Section interaktif pilihan warna.
 *
 * Daftar warna mengikuti model dari varian yang dipilih, jadi pindah dari J5
 * ke J8 otomatis menukar pilihan warnanya. Swatch yang diklik mengganti foto
 * unit dengan transisi halus (crossfade + scale ringan) via AnimatePresence.
 */
export function ColorPicker({ onSelectColor }: { onSelectColor?: (id: string) => void }) {
  const [variantId, setVariantId] = useState<string>(variants[0].id);
  const activeVariant = variants.find((variant) => variant.id === variantId) ?? variants[0];

  const availableColors = colorsForVariant(activeVariant);
  const firstColorId = availableColors[0]?.id ?? "";

  const [activeId, setActiveId] = useState<ColorId>(firstColorId);
  const [lastVariantId, setLastVariantId] = useState(activeVariant.id);

  // Pindah varian berarti daftar warna ikut berubah, jadi reset ke warna
  // pertama model tersebut. Diadjust saat render, bukan di effect, supaya
  // tidak ada frame dengan warna yang tidak milik model aktif.
  if (activeVariant.id !== lastVariantId) {
    setLastVariantId(activeVariant.id);
    setActiveId(firstColorId);
  }

  const activeColor = availableColors.find((color) => color.id === activeId) ?? availableColors[0];
  const activeColorIndex = Math.max(
    0,
    availableColors.findIndex((color) => color.id === activeColor.id),
  );
  const activeColorName = colorLabel(activeColor, activeColorIndex);

  const handleColorChange = (id: ColorId) => {
    setActiveId(id);
    onSelectColor?.(id);
    trackEvent(GA_EVENTS.variantSelect, {
      action: "color_picker",
      color: colorLabel(
        availableColors.find((color) => color.id === id) ?? activeColor,
        availableColors.findIndex((color) => color.id === id),
      ),
      variant: activeVariant.name,
    });
  };

  const colorCount = availableColors.length;

  return (
    <Section id="warna" tone="mist">
      <RevealGroup>
        <SectionHeading
          eyebrow="Pilih Warna"
          title={
            <>
              {`${spell(colorCount)} warna`},{" "}
              <span className="text-brand-600">gaya Anda sendiri</span>
            </>
          }
          description="Ketuk warna di bawah untuk melihat langsung tampilannya. Waktu pengiriman untuk warna tertentu bergantung pada ketersediaan unit."
        />

        <div className="mt-12 grid items-center gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-12">
          {/* Foto unit */}
          <RevealItem>
            <div className="relative overflow-hidden rounded-3xl border border-line bg-white shadow-card">
              <div className="relative aspect-[16/10]">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={activeColor.id}
                    className="absolute inset-0"
                    initial={{ opacity: 0, scale: 1.03 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.985 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Image
                      src={activeColor.image}
                      alt={`${activeVariant.name} warna ${activeColorName}`}
                      fill
                      sizes="(max-width: 1024px) 100vw, 55vw"
                      className="object-cover"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Info warna aktif */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-5 py-4">
                <div>
                  <p className="text-lg font-extrabold text-ink">{activeColorName}</p>
                  {!isPlaceholder(activeColor.description) ? (
                    <p className="mt-0.5 text-sm text-ink/60">{activeColor.description}</p>
                  ) : null}
                </div>
                <span className="rounded-full bg-brand-50 px-3 py-1.5 text-xs font-bold text-brand-700">
                  {activeVariant.name}
                </span>
              </div>
            </div>

            {/* Caption harga */}
            <p className="mt-3 text-center text-sm text-ink/55 sm:text-left">
              Harga OTR <span className="tabular font-bold text-ink">{activeVariant.name}</span>:{" "}
              <span className="tabular font-bold text-brand-700">
                {formatRupiah(activeVariant.price)}
              </span>
            </p>
          </RevealItem>

          {/* Kontrol */}
          <RevealItem delay={0.1}>
            <div>
              {/* Varian (memengaruhi harga dan daftar warna) */}
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-ink/45">
                Varian
              </p>
              <div className="mt-2.5 space-y-3">
                {models.map((model) => (
                  <div key={model.id}>
                    <p className="mb-1.5 text-[11px] font-bold text-ink/40">{model.fullName}</p>
                    <div className="flex flex-wrap gap-2">
                      {variants
                        .filter((variant) => variant.modelId === model.id)
                        .map((variant) => {
                          const isActive = variant.id === variantId;
                          return (
                            <button
                              key={variant.id}
                              type="button"
                              onClick={() => setVariantId(variant.id)}
                              aria-pressed={isActive}
                              className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                                isActive
                                  ? "bg-brand-500 text-white shadow-[0_8px_18px_-8px_rgb(15_122_131/0.8)]"
                                  : "border border-line bg-white text-ink/70 hover:border-brand-300 hover:text-brand-700"
                              }`}
                            >
                              {variant.name}
                            </button>
                          );
                        })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Swatch warna */}
              <p className="mt-6 text-xs font-bold uppercase tracking-[0.14em] text-ink/45">
                {`Warna Bodi ${activeVariant.name}`}
              </p>
              <div
                role="radiogroup"
                aria-label="Pilihan warna kendaraan"
                className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2"
              >
                {availableColors.map((color, colorIndex) => {
                  const isActive = color.id === activeColor.id;
                  return (
                    <button
                      key={color.id}
                      type="button"
                      role="radio"
                      aria-checked={isActive}
                      onClick={() => handleColorChange(color.id)}
                      className={`group flex items-center gap-3 rounded-2xl border px-3.5 py-3 text-left transition-all ${
                        isActive
                          ? "border-brand-400 bg-white shadow-card ring-1 ring-brand-200"
                          : "border-line bg-white/70 hover:border-brand-200 hover:bg-white"
                      }`}
                    >
                      <span
                        className="relative grid h-9 w-9 shrink-0 place-items-center rounded-full ring-1 ring-ink/10"
                        style={{ backgroundColor: color.hex }}
                      >
                        {isActive ? (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="grid h-5 w-5 place-items-center rounded-full bg-white/90 shadow-soft"
                          >
                            <Check className="h-3.5 w-3.5 text-brand-700" strokeWidth={3} />
                          </motion.span>
                        ) : null}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-bold text-ink">
                          {colorLabel(color, colorIndex)}
                        </span>
                        {!isPlaceholder(color.description) ? (
                          <span className="block truncate text-[11px] text-ink/55">
                            {color.description}
                          </span>
                        ) : null}
                      </span>
                    </button>
                  );
                })}
              </div>

              <WhatsAppLink
                message={waMessages.color(
                  contact.salesName,
                  activeVariant.name,
                  activeColorName,
                )}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-wa px-5 py-3.5 text-sm font-bold text-white shadow-[0_10px_24px_-10px_rgb(37_211_102/0.85)] transition-colors hover:bg-[#1eb856] sm:w-auto"
              >
                <MessageCircle className="h-4 w-4 fill-current" />
                Tanya Warna Ini via WA
              </WhatsAppLink>

              <Reveal className="mt-4">
                <p className="text-xs leading-relaxed text-ink/45">
                  Warna pada layar bisa berbeda karena pengaruh pencahayaan dan pengaturan monitor.
                  Warna unit aktual akan dikonfirmasi saat test drive.
                </p>
              </Reveal>
            </div>
          </RevealItem>
        </div>
      </RevealGroup>
    </Section>
  );
}