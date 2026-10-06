import { Car, Headset, ShieldCheck, Wallet } from "lucide-react";
import { visibleTrustStats as trustStats } from "@/data/config";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";

const icons = {
  shield: ShieldCheck,
  headset: Headset,
  wallet: Wallet,
  car: Car,
} as const;

/**
 * Jumlah kolom desktop mengikuti jumlah statistik yang benar-benar terisi.
 * Tailwind hanya memindai class yang tertulis literal, jadi pemetaannya
 * dibuat eksplisit di sini.
 */
const COLUMN_CLASSES: Record<number, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
};

/**
 * Trust bar: angka kunci yang menjawab pertanyaan calon pembeli sebelum
 * mereka perlu chat sales. Statistik yang angkanya belum diisi otomatis
 * dilewati, dan layout menyesuaikan.
 */
export function TrustBar() {
  return (
    <section aria-label="Keunggulan dealer" className="relative z-10 -mt-px bg-white">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-6 lg:px-8">
        <RevealGroup
          className={`grid grid-cols-2 gap-3 rounded-3xl border border-line bg-white p-4 shadow-card sm:gap-4 sm:p-6 ${COLUMN_CLASSES[trustStats.length] ?? "lg:grid-cols-2"}`}
          stagger={0.08}
        >
          {trustStats.map((stat) => {
            const Icon = icons[stat.icon as keyof typeof icons] ?? ShieldCheck;
            return (
              <RevealItem
                key={stat.label}
                className="flex items-center gap-3 rounded-2xl bg-mist px-3.5 py-4 sm:px-4"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-500/10 text-brand-600 sm:h-11 sm:w-11">
                  <Icon className="h-5 w-5 sm:h-[22px] sm:w-[22px]" />
                </span>
                <span className="min-w-0">
                  <span className="tabular block text-lg font-black leading-tight text-ink sm:text-xl">
                    {stat.value}
                  </span>
                  <span className="block text-[11px] leading-snug text-ink/60 sm:text-xs">
                    {stat.label}
                  </span>
                </span>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}