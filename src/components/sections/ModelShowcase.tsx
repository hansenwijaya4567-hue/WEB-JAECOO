"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import {
  isPlaceholder,
  models,
  site,
  variantsByModel,
} from "@/data/config";
import { formatRupiah, spell } from "@/lib/utils";
import { GA_EVENTS, trackEvent } from "@/lib/analytics";
import { Section, SectionHeading } from "@/components/ui/Section";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";

/**
 * Section lineup model.
 *
 * Satu kartu per model (J5, J7, J8) yang merangkum powertrain, jumlah
 * varian, dan harga termurah model tersebut. Tujuannya supaya pengunjung
 * langsung paham_scope dealer sebelum ikut ke tabel harga.
 */
export function ModelShowcase() {
  return (
    <Section id="model" tone="white">
      <RevealGroup>
        <SectionHeading
          eyebrow="Lineup Kami"
          title={
            <>
              {`${spell(models.length)} model`},{" "}
              <span className="text-brand-600">satu dealer resmi</span>
            </>
          }
          description={`Harga OTR ${site.city} sudah termasuk PPN dan BPKB. Pilih model untuk melihat seluruh varian dan spesifikasinya.`}
        />

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {models.map((model) => {
            const modelVariants = variantsByModel(model.id);
            if (modelVariants.length === 0) return null;

            const cheapest = modelVariants.reduce((lowest, variant) =>
              variant.price < lowest.price ? variant : lowest,
            );
            const powertrains = Array.from(
              new Set(modelVariants.map((variant) => variant.powertrain)),
            );

            return (
              <RevealItem key={model.id} className="h-full">
                <motion.article
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 300, damping: 26 }}
                  className="group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-white shadow-soft transition-shadow hover:shadow-lift"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-brand-50">
                    <Image
                      src={model.image}
                      alt={model.imageAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                    />
                  </div>

                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <h3 className="text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
                      {model.fullName}
                    </h3>

                    {!isPlaceholder(model.bodyType) ? (
                      <p className="mt-0.5 text-sm font-semibold text-brand-600">
                        {model.bodyType}
                      </p>
                    ) : null}

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {powertrains.map((powertrain) => (
                        <span
                          key={powertrain}
                          className="rounded-full bg-ink/5 px-2.5 py-0.5 text-[11px] font-bold text-ink/65"
                        >
                          {powertrain}
                        </span>
                      ))}
                      <span className="rounded-full bg-ink/5 px-2.5 py-0.5 text-[11px] font-bold text-ink/65">
                        {`${spell(modelVariants.length)} varian`}
                      </span>
                    </div>

                    {!isPlaceholder(model.tagline) ? (
                      <p className="mt-3 text-sm leading-relaxed text-ink/65">{model.tagline}</p>
                    ) : null}

                    <div className="mt-auto pt-5">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/45">
                        Mulai dari
                      </p>
                      <p className="tabular text-2xl font-black tracking-tight text-ink">
                        {formatRupiah(cheapest.price)}
                      </p>

                      <button
                        type="button"
                        onClick={() => {
                          trackEvent(GA_EVENTS.variantSelect, {
                            action: "browse_model",
                            model: model.name,
                          });
                          document
                            .getElementById("varian")
                            ?.scrollIntoView({ behavior: "smooth", block: "start" });
                        }}
                        className="group/btn mt-4 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-ink-soft"
                      >
                        Lihat Varian
                        <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                      </button>
                    </div>
                  </div>
                </motion.article>
              </RevealItem>
            );
          })}
        </div>
      </RevealGroup>
    </Section>
  );
}
