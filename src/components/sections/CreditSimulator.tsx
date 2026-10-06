"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Calculator, Info, MessageCircle, TrendingDown } from "lucide-react";
import { contact, credit, site, variants, waMessages, type Variant } from "@/data/config";
import { calculateCredit, formatRupiah, cn } from "@/lib/utils";
import { GA_EVENTS, trackEvent } from "@/lib/analytics";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";

/**
 * Simulasi kredit interaktif.
 *
 * Harga mengikuti varian terpilih (bisa diisi dari section Varian).
 * Slider DP 10-50%, tenor 1-5 tahun, hasil cicilan real-time.
 */
export function CreditSimulator({
  selectedVariantId,
  onRequestCredit,
}: {
  selectedVariantId: string;
  onRequestCredit?: (variantId: string) => void;
}) {
  const [variantId, setVariantId] = useState<string>(selectedVariantId);
  const [dpPercent, setDpPercent] = useState<number>(credit.defaultDpPercent);
  const [tenor, setTenor] = useState<number>(credit.tenorOptions[2]);
  const [userInteracted, setUserInteracted] = useState(false);
  const [lastExternalVariantId, setLastExternalVariantId] = useState<string>(
    selectedVariantId,
  );

  // Ikuti varian yang dipilih dari section lain tanpa efek samping.
  // Pola "adjust state saat prop berubah" ini disengaja - memanggil
  // setState di dalam effect akan memicu render berlapis.
  if (selectedVariantId !== lastExternalVariantId) {
    setLastExternalVariantId(selectedVariantId);
    setVariantId(selectedVariantId);
  }

  const variant: Variant = useMemo(
    () => variants.find((item) => item.id === variantId) ?? variants[0],
    [variantId],
  );

  const result = useMemo(
    () =>
      calculateCredit({
        price: variant.price,
        dpPercent,
        tenorYears: tenor,
        flatRatePercent: credit.flatRatePercent,
      }),
    [variant.price, dpPercent, tenor],
  );

  // Kirim event hanya saat pengguna benar-benar berinteraksi (bukan render awal),
  // dan throttle agar tidak Flood analytics saat slider digeser terus.
  const lastTracked = useRef<number>(0);
  useEffect(() => {
    if (!userInteracted) return;

    const now = Date.now();
    if (now - lastTracked.current < 1500) return;
    lastTracked.current = now;

    trackEvent(GA_EVENTS.creditSimulate, {
      variant: variant.name,
      dp_percent: dpPercent,
      tenor_years: tenor,
      monthly_installment: result.monthlyInstallment,
    });
  }, [userInteracted, variant.name, dpPercent, tenor, result.monthlyInstallment]);

  const installmentText = `${formatRupiah(result.monthlyInstallment)}/bulan`;

  const handleWaRequest = () => {
    trackEvent(GA_EVENTS.waClick, {
      placement: "credit_simulator",
      variant: variant.name,
    });
    onRequestCredit?.(variant.id);
  };

  return (
    <Section id="simulasi" tone="mist">
      <RevealGroup>
        <SectionHeading
          eyebrow="Simulasi Kredit"
          title={
            <>
              Berapa cicilan <span className="text-brand-600">{site.brand} {site.model}</span> per bulan?
            </>
          }
          description={credit.subtitle}
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-8">
          {/* ---- Kontrol ---- */}
          <RevealItem>
            <div className="rounded-3xl border border-line bg-white p-5 shadow-soft sm:p-7">
              {/* Varian */}
              <fieldset>
                <legend className="text-xs font-bold uppercase tracking-[0.14em] text-ink/45">
                  Varian Kendaraan
                </legend>
                <div className="mt-2.5 grid grid-cols-3 gap-2">
                  {variants.map((item) => {
                    const isActive = item.id === variantId;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setVariantId(item.id);
                          setUserInteracted(true);
                        }}
                        aria-pressed={isActive}
                        className={cn(
                          "rounded-xl border px-2 py-2.5 text-center transition-all",
                          isActive
                            ? "border-brand-400 bg-brand-50 text-brand-700 ring-1 ring-brand-200"
                            : "border-line bg-white text-ink/65 hover:border-brand-200",
                        )}
                      >
                        <span className="block text-sm font-bold">{item.name}</span>
                        <span className="tabular mt-0.5 block text-[10px] text-ink/50">
                          {formatRupiah(item.price)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              {/* Slider DP */}
              <div className="mt-7">
                <div className="flex items-baseline justify-between gap-3">
                  <label
                    htmlFor="dp-slider"
                    className="text-xs font-bold uppercase tracking-[0.14em] text-ink/45"
                  >
                    Down Payment (DP)
                  </label>
                  <span className="tabular text-lg font-black text-brand-700">
                    {dpPercent}%
                  </span>
                </div>

                <input
                  id="dp-slider"
                  type="range"
                  min={credit.minDpPercent}
                  max={credit.maxDpPercent}
                  step={1}
                  value={dpPercent}
                  onChange={(event) => {
                    setDpPercent(Number(event.target.value));
                    setUserInteracted(true);
                  }}
                  aria-valuetext={`${dpPercent} persen`}
                  className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-full bg-brand-100 accent-brand-500 outline-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand-500 [&::-webkit-slider-thumb]:shadow-[0_2px_8px_rgb(15_122_131/0.45)] [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-brand-500"
                />

                <div className="mt-2 flex justify-between text-[11px] font-semibold text-ink/40">
                  <span>{credit.minDpPercent}%</span>
                  <span className="tabular text-ink/60">
                    {formatRupiah(result.dpAmount)}
                  </span>
                  <span>{credit.maxDpPercent}%</span>
                </div>

                <p className="mt-2 text-xs text-ink/50">{credit.financingNote}</p>
              </div>

              {/* Tenor */}
              <fieldset className="mt-7">
                <legend className="text-xs font-bold uppercase tracking-[0.14em] text-ink/45">
                  Tenor Cicilan
                </legend>
                <div className="mt-2.5 grid grid-cols-5 gap-2">
                  {credit.tenorOptions.map((option) => {
                    const isActive = option === tenor;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => {
                          setTenor(option);
                          setUserInteracted(true);
                        }}
                        aria-pressed={isActive}
                        className={cn(
                          "tabular rounded-xl border px-1 py-2.5 text-sm font-bold transition-all",
                          isActive
                            ? "border-brand-500 bg-brand-500 text-white shadow-[0_8px_18px_-8px_rgb(15_122_131/0.8)]"
                            : "border-line bg-white text-ink/65 hover:border-brand-200 hover:text-brand-700",
                        )}
                      >
                        {option} Th
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            </div>
          </RevealItem>

          {/* ---- Hasil ---- */}
          <RevealItem delay={0.1}>
            <div className="flex h-full flex-col overflow-hidden rounded-3xl bg-brand-gradient p-5 text-white shadow-lift sm:p-7">
              <div className="flex items-center gap-2 text-brand-100">
                <Calculator className="h-5 w-5" />
                <span className="text-xs font-bold uppercase tracking-[0.14em]">
                  Estimasi Cicilan
                </span>
              </div>

              {/* Angka besar */}
              <div className="mt-5">
                <AnimateNumber value={result.monthlyInstallment} />
                <p className="mt-1 text-sm text-white/65">
                  per bulan · tenor {tenor} tahun · bunga flat {credit.flatRatePercent}%
                </p>
              </div>

              {/* Rincian */}
              <dl className="mt-6 space-y-2.5 border-t border-white/15 pt-5 text-sm">
                <Row label={`Harga OTR ${variant.name}`} value={formatRupiah(variant.price)} />
                <Row
                  label={`DP ${dpPercent}%`}
                  value={formatRupiah(result.dpAmount)}
                  tone="accent"
                />
                <Row label="Pokok Pinjaman" value={formatRupiah(result.principal)} />
                <Row label="Total Bunga" value={formatRupiah(result.totalPayment - result.principal)} />
                <Row label="Total Bayar" value={formatRupiah(result.totalPayment)} strong />
              </dl>

              {/* CTA */}
              <WhatsAppLink
                message={waMessages.credit(contact.salesName, variant.name, installmentText)}
                className="group mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-wa px-5 py-3.5 text-sm font-bold text-white shadow-[0_10px_24px_-10px_rgb(37_211_102/0.9)] transition-all hover:bg-[#1eb856] active:scale-[0.99]"
              >
                <MessageCircle className="h-4 w-4 fill-current" />
                Ajukan Kredit via WA
              </WhatsAppLink>

              <button
                type="button"
                onClick={handleWaRequest}
                className="mt-2.5 inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-white/20"
              >
                Isi Form Pengajuan Kredit
              </button>

              {/* Disclaimer */}
              <p className="mt-4 flex items-start gap-2 text-[11px] leading-relaxed text-white/55">
                <Info className="mt-px h-3.5 w-3.5 shrink-0" />
                <span>{credit.disclaimer}</span>
              </p>
            </div>
          </RevealItem>
        </div>

        {/* Baris bantuan */}
        <Reveal delay={0.15}>
          <div className="mt-6 flex flex-col items-center justify-between gap-3 rounded-2xl border border-brand-100 bg-white px-5 py-4 sm:flex-row">
            <p className="flex items-center gap-2 text-sm text-ink/65">
              <TrendingDown className="h-4 w-4 text-brand-600" />
              Cicilan bisa lebih kecil kalau tenor diperpanjang atau DP ditabung.
            </p>
            <WhatsAppLink
              message={waMessages.credit(contact.salesName, variant.name, installmentText)}
              className="shrink-0 text-sm font-bold text-brand-700 underline-offset-4 hover:underline"
            >
              Tanya opsi lain ke sales
            </WhatsAppLink>
          </div>
        </Reveal>
      </RevealGroup>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  SUB-KOMPONEN                                                      */
/* ------------------------------------------------------------------ */

function Row({
  label,
  value,
  strong,
  tone,
}: {
  label: string;
  value: string;
  strong?: boolean;
  tone?: "accent";
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-white/60">{label}</dt>
      <dd
        className={cn(
          "tabular font-bold",
          strong ? "text-base text-white" : "text-sm",
          tone === "accent" && "text-brand-200",
        )}
      >
        {value}
      </dd>
    </div>
  );
}

/**
 * Angka animasi: menghitung naik dari 0 ke nilai target saat berubah.
 * Memakai requestAnimationFrame agar tidak memicu render berlebihan.
 */
function AnimateNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(value);
  const previous = useRef(value);

  useEffect(() => {
    const from = previous.current;
    const to = value;

    if (from === to) return;

    const duration = 450;
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(from + (to - from) * eased));

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        previous.current = to;
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return (
    <motion.p
      className="tabular text-4xl font-black leading-tight tracking-tight sm:text-5xl"
      aria-live="polite"
      aria-atomic="true"
    >
      <span className="sr-only">{formatRupiah(value)}</span>
      <span aria-hidden="true">{formatRupiah(display)}</span>
      <span className="ml-1.5 text-base font-bold text-white/60 sm:text-lg">/bln</span>
    </motion.p>
  );
}