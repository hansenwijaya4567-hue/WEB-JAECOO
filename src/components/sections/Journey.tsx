import { CircleParking, MessageCircle, Send, Signature, UserRound } from "lucide-react";
import { journeySteps } from "@/data/config";
import { spell } from "@/lib/utils";
import { Section, SectionHeading } from "@/components/ui/Section";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";

const icons = {
  chat: MessageCircle,
  user: UserRound,
  steering: CircleParking,
  document: Signature,
  delivery: Send,
} as const;

/**
 * Timeline proses pembelian. Setiap langkah menunjukkan perkiraan
 * durasi agar calon pembeli tahu persis apa yang akan terjadi.
 */
export function Journey() {
  return (
    <Section id="proses" tone="mist">
      <RevealGroup>
        <SectionHeading
          eyebrow="Proses Pembelian"
          title={
            <>
              Dari chat sampai <span className="text-brand-600">unit di tangan</span>
            </>
          }
          description={`${spell(journeySteps.length)} langkah sederhana, tanpa berbelit. Anda selalu tahu posisi proses dan kapan unit tiba.`}
        />

        <div className="relative mt-14">
          {/* Garis penghubung (desktop) */}
          <div
            className="absolute left-[27px] top-2 hidden h-[calc(100%-3rem)] w-0.5 bg-gradient-to-b from-brand-200 via-brand-200 to-transparent sm:block lg:left-0 lg:top-[27px] lg:h-0.5 lg:w-full lg:bg-gradient-to-r lg:from-brand-100 lg:via-brand-200 lg:to-transparent"
            aria-hidden="true"
          />

          <ol className="relative flex flex-col gap-8 sm:gap-9 lg:flex-row lg:justify-between lg:gap-4">
            {journeySteps.map((item) => {
              const Icon = icons[item.icon as keyof typeof icons] ?? MessageCircle;
              return (
                <RevealItem key={item.step} as="li" className="relative lg:flex-1">
                  <div className="flex gap-5 lg:block">
                    {/* Nomor + ikon */}
                    <div className="relative shrink-0">
                      <span className="tabular grid h-14 w-14 place-items-center rounded-2xl border border-brand-100 bg-white text-lg font-black text-brand-600 shadow-soft">
                        {String(item.step).padStart(2, "0")}
                      </span>
                      <span className="absolute -right-2 -bottom-2 grid h-7 w-7 place-items-center rounded-full bg-brand-500 text-white shadow-soft">
                        <Icon className="h-3.5 w-3.5" strokeWidth={2.5} />
                      </span>
                    </div>

                    {/* Konten */}
                    <div className="min-w-0 flex-1 pb-1 lg:mt-5 lg:pr-4">
                      <h3 className="text-base font-extrabold text-ink sm:text-lg">
                        {item.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-ink/60">
                        {item.description}
                      </p>
                      <span className="mt-2.5 inline-block rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-bold text-brand-700">
                        {item.duration}
                      </span>
                    </div>
                  </div>
                </RevealItem>
              );
            })}
          </ol>
        </div>

        <RevealItem delay={0.2}>
          <p className="mt-10 text-center text-sm text-ink/55">
            Butuh jawaban lebih cepat?{" "}
            <a
              href="#spk"
              className="font-bold text-brand-700 underline-offset-4 hover:underline"
            >
              Isi form SPK
            </a>{" "}
            dan sales kami akan menghubungi Anda hari ini juga.
          </p>
        </RevealItem>
      </RevealGroup>
    </Section>
  );
}