"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CalendarCheck, MessageCircle, ShieldCheck, Zap } from "lucide-react";
import {
  contact,
  entryVariant,
  hero,
  visibleMicroTrust as microTrust,
  models,
  priceRange,
  site,
  variants,
  waMessages,
} from "@/data/config";
import { formatRupiah, formatRupiahShort } from "@/lib/utils";
import { GA_EVENTS, trackEvent } from "@/lib/analytics";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";

export function Hero() {
  const reduceMotion = useReducedMotion();

  /**
   * Ringkasan singkat di bawah headline. Semuanya diturunkan dari `variants`
   * supaya tidak ada angka yang bisa meleset dari tabel harga.
   */
  const quickSpecs = [
    { label: "Model", value: models.map((model) => model.name).join(" / ") },
    {
      label: "Powertrain",
      value: Array.from(new Set(variants.map((variant) => variant.powertrain))).join(" / "),
    },
    { label: "Mulai dari", value: formatRupiahShort(entryVariant.price) },
    { label: "Harga hingga", value: formatRupiahShort(priceRange.max) },
  ];

  return (
    <section
      id="beranda"
      className="relative overflow-hidden bg-brand-gradient pb-14 pt-28 text-white sm:pb-20 sm:pt-32 lg:pb-24 lg:pt-40"
    >
      {/* Dekorasi latar */}
      <div className="absolute inset-0 bg-grid-pattern" aria-hidden="true" />
      <div
        className="absolute -right-24 -top-24 h-[28rem] w-[28rem] rounded-full bg-brand-400/25 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-brand-300/15 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-10 px-5 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-14 lg:px-8">
        {/* --- Copy --- */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="order-2 text-center lg:order-1 lg:text-left"
        >
          {/* Badge dealer */}
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-brand-50 ring-1 ring-white/20 backdrop-blur-sm sm:text-xs">
            <Zap className="h-3.5 w-3.5 fill-current" />
            {hero.eyebrow}
          </span>

          <h1 className="mt-5 text-5xl font-black leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl">
            {hero.title}
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-base font-semibold text-brand-100 sm:text-xl lg:mx-0">
            {hero.headline}
          </p>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/70 sm:text-base lg:mx-0">
            {hero.subheadline}
          </p>

          {/* Harga */}
          <div className="mt-7 flex flex-col items-center gap-2 lg:items-start">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/55">
              Mulai dari
            </span>
            <div className="flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1 lg:justify-start">
              <span className="tabular text-4xl font-black tracking-tight sm:text-5xl">
                {formatRupiah(entryVariant.price)}
              </span>
              <span className="text-xs text-white/50 sm:text-base">
                {`hingga ${formatRupiah(priceRange.max)}`}
              </span>
            </div>
            <span className="text-xs text-white/60">
              Harga OTR {site.city} - sudah termasuk PPN &amp; BPKB
            </span>
          </div>

          {/* CTA */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <a
              href="#spk"
              onClick={() =>
                trackEvent(GA_EVENTS.spkSubmit, { placement: "hero_primary" })
              }
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-4 text-base font-bold text-brand-700 shadow-[0_14px_34px_-12px_rgb(0_0_0/0.55)] transition-all hover:bg-brand-50 active:scale-[0.98] sm:text-[1.0625rem]"
            >
              Booking SPK Sekarang
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </a>

            <WhatsAppLink
              message={waMessages.testDrive(contact.salesName)}
              variant="stacked"
              ariaLabel="Chat WhatsApp untuk booking test drive"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 py-4 text-base font-bold text-white backdrop-blur-sm transition-all hover:bg-white/20 active:scale-[0.98] sm:text-[1.0625rem]"
            >
              <CalendarCheck className="h-5 w-5" />
              Test Drive
            </WhatsAppLink>
          </div>

          {/* Micro trust */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-white/65 lg:justify-start">
            {microTrust.map((item) => (
              <span key={item.label} className="inline-flex items-center gap-1.5">
                {item.icon === "shield" && <ShieldCheck className="h-4 w-4 text-brand-200" />}
                {item.icon === "chat" && <MessageCircle className="h-4 w-4 text-brand-200" />}
                {item.label}
              </span>
            ))}
          </div>
        </motion.div>

        {/* --- Gambar mobil --- */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, scale: 0.96, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="order-1 lg:order-2"
        >
          <div className="relative">
            <div className="absolute -inset-4 rounded-[2.5rem] bg-white/5 blur-2xl" aria-hidden="true" />
            <Image
              src={hero.image}
              alt={hero.imageAlt}
              width={1200}
              height={800}
              priority
              fetchPriority="high"
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="relative w-full rounded-[2rem] object-contain shadow-lift"
            />

            {/* Badge mengambang: harga varian termurah */}
            <div className="absolute -bottom-4 left-3 rounded-2xl bg-white px-4 py-3 shadow-lift sm:left-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink/45">
                Mulai
              </p>
              <p className="tabular text-base font-black text-ink sm:text-lg">
                {formatRupiah(entryVariant.price)}
              </p>
            </div>
          </div>

          {/* Ringkasan lineup - diturunkan dari data varian, bukan ditulis manual */}
          <dl className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
            {quickSpecs.map((spec) => (
              <div
                key={spec.label}
                className="rounded-2xl bg-white/10 px-3 py-3 text-center ring-1 ring-white/10 backdrop-blur-sm"
              >
                <dt className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/55">
                  {spec.label}
                </dt>
                <dd className="tabular mt-1 text-sm font-bold text-white sm:text-base">
                  {spec.value}
                </dd>
              </div>
            ))}
          </dl>
        </motion.div>
      </div>
    </section>
  );
}