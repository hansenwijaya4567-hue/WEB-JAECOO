"use client";

import { useEffect, useState } from "react";
import { Flame, Gift, MessageCircle, Users } from "lucide-react";
import { contact, isPlaceholder, promo, waMessages } from "@/data/config";
import { formatTanggal } from "@/lib/utils";
import { Section } from "@/components/ui/Section";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
}

function calculateTimeLeft(endsAt: string): TimeLeft {
  const target = new Date(endsAt).getTime();
  const now = Date.now();
  const diff = target - now;

  if (Number.isNaN(target) || diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  }

  const seconds = Math.floor(diff / 1000) % 60;
  const minutes = Math.floor(diff / 60_000) % 60;
  const hours = Math.floor(diff / 3_600_000) % 24;
  const days = Math.floor(diff / 86_400_000);

  return { days, hours, minutes, seconds, expired: false };
}

/**
 * Banner promo dengan countdown timer dan badge kuota tersisa.
 *
 * Section disembunyikan penuh selama detail promo masih placeholder, supaya
 * tidak ada klaim diskon, kuota, atau batas waktu yang belum dikonfirmasi
 * ikut tayang. Pengecekan dilakukan di komponen pembungkus - bukan di dalam
 * komponen ini - karena `useState`/`useEffect` tidak boleh dipanggil
 * kondisional.
 */
export function Promo() {
  if (isPlaceholder(promo.title) || isPlaceholder(promo.description)) {
    return null;
  }

  return <PromoContent />;
}

function PromoContent() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calculateTimeLeft(promo.endsAt));

  useEffect(() => {
    // Hitung di server lalu sinkronkan setiap detik di client agar
    // tidak ada hydration mismatch.
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(promo.endsAt));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const quotaTone =
    promo.quotaRemaining <= 0
      ? "bg-white/10 text-white/60"
      : promo.quotaRemaining <= promo.urgentThreshold
        ? "bg-accent text-white"
        : "bg-white/10 text-white";

  return (
    <Section id="promo" tone="brand" className="relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern" aria-hidden="true" />
      <div
        className="absolute -right-20 top-0 h-96 w-96 rounded-full bg-accent/20 blur-3xl"
        aria-hidden="true"
      />

      <RevealGroup className="relative">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-14">
          {/* --- Copy --- */}
          <RevealItem>
            <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3.5 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-white">
              <Flame className="h-3.5 w-3.5 fill-current" />
              {promo.badge}
            </span>

            <h2 className="mt-4 text-3xl font-black leading-[1.12] tracking-tight sm:text-4xl lg:text-[2.75rem]">
              {promo.title}
            </h2>

            <p className="mt-4 max-w-xl text-base leading-relaxed text-white/75">
              {promo.description}
            </p>

            <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
              {promo.bullets.map((bullet) => (
                <li
                  key={bullet}
                  className="flex items-start gap-2.5 rounded-xl bg-white/8 px-3.5 py-2.5 text-sm text-white/90 ring-1 ring-white/10"
                >
                  <Gift className="mt-0.5 h-4 w-4 shrink-0 text-brand-200" />
                  <span className="leading-snug">{bullet}</span>
                </li>
              ))}
            </ul>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <WhatsAppLink
                message={waMessages.promo(contact.salesName)}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-brand-700 shadow-[0_14px_30px_-12px_rgb(0_0_0/0.5)] transition-colors hover:bg-brand-50 active:scale-[0.98]"
              >
                <MessageCircle className="h-4 w-4 fill-current" />
                {promo.ctaLabel}
              </WhatsAppLink>

              {promo.quotaRemaining > 0 ? (
                <span
                  className={`inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-xs font-bold ${quotaTone}`}
                >
                  <Users className="h-4 w-4" />
                  Sisa {promo.quotaRemaining} dari {promo.quotaTotal} unit
                </span>
              ) : null}
            </div>

            <p className="mt-4 text-xs leading-relaxed text-white/45">{promo.terms}</p>
          </RevealItem>

          {/* --- Countdown --- */}
          <RevealItem delay={0.12}>
            <div className="rounded-3xl border border-white/15 bg-white/8 p-5 backdrop-blur-sm sm:p-6">
              <p className="text-center text-xs font-bold uppercase tracking-[0.18em] text-brand-100">
                {timeLeft.expired ? "Promo telah berakhir" : "Promo berakhir dalam"}
              </p>

              {timeLeft.expired ? (
                <p className="mt-4 text-center text-base font-semibold text-white/70">
                  Hubungi sales untuk info promo berikutnya.
                </p>
              ) : (
                <>
                  <div className="mt-4 grid grid-cols-4 gap-2 sm:gap-2.5">
                    <TimeCell value={timeLeft.days} label="Hari" />
                    <TimeCell value={timeLeft.hours} label="Jam" />
                    <TimeCell value={timeLeft.minutes} label="Menit" />
                    <TimeCell value={timeLeft.seconds} label="Detik" />
                  </div>

                  <p className="mt-4 text-center text-xs text-white/55">
                    Berlaku sampai {formatTanggal(promo.endsAt)} WIB
                  </p>
                </>
              )}

              <div className="mt-5 border-t border-white/15 pt-4">
                <p className="text-center text-[11px] leading-relaxed text-white/45">
                  {promo.terms}
                </p>
              </div>
            </div>
          </RevealItem>
        </div>
      </RevealGroup>
    </Section>
  );
}

function TimeCell({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-2xl bg-ink/25 px-1 py-3 text-center ring-1 ring-white/10">
      <span className="tabular block text-2xl font-black leading-none text-white sm:text-3xl">
        {String(value).padStart(2, "0")}
      </span>
      <span className="mt-1.5 block text-[10px] font-semibold uppercase tracking-wider text-white/50">
        {label}
      </span>
    </div>
  );
}