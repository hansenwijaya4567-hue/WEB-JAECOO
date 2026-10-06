"use client";

import Image from "next/image";
import { Check, MessageCircle } from "lucide-react";
import { contact, features, isPlaceholder, site, waMessages } from "@/data/config";
import { spell } from "@/lib/utils";
import { Section, SectionHeading } from "@/components/ui/Section";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";

/**
 * Section keunggulan: empat kartu dengan gambar, tiga poin manfaat,
 * dan CTA WhatsApp per kartu.
 */
export function Features() {
  return (
    <Section id="keunggulan" tone="mist">
      <RevealGroup>
        <SectionHeading
          eyebrow={`Kenapa ${site.brand} ${site.model}`}
          title={
            <>
              Fitur yang biasanya ada di SUV{" "}
              <span className="text-brand-600">jauh lebih mahal</span>
            </>
          }
          description={`${spell(features.length)} hal yang paling sering jadi alasan pemilik pindah ke ${site.model}. Tidak ada istilah teknis yang membingungkan - hanya hal yang Anda rasakan setiap hari.`}
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {features.map((feature) => (
            <RevealItem key={feature.id} className="h-full">
              <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-white shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-200 hover:shadow-lift">
                {/* Gambar */}
                <div className="relative aspect-[4/3] overflow-hidden bg-brand-50">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.07]"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-ink/45 via-transparent to-transparent"
                    aria-hidden="true"
                  />
                  <h3 className="absolute inset-x-0 bottom-0 p-4 text-lg font-extrabold leading-tight text-white">
                    {feature.title}
                  </h3>
                </div>

                {/* Isi */}
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-sm leading-relaxed text-ink/65">
                    {feature.description}
                  </p>

                  {/* Poin spesifikasi disembunyikan selama masih placeholder. */}
                  {feature.points.filter((point) => !isPlaceholder(point)).length > 0 ? (
                    <ul className="mt-4 flex-1 space-y-2.5">
                      {feature.points
                        .filter((point) => !isPlaceholder(point))
                        .map((point) => (
                          <li
                            key={point}
                            className="flex items-start gap-2.5 text-sm text-ink/75"
                          >
                            <span className="mt-0.5 grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full bg-brand-500/12 text-brand-600">
                              <Check className="h-3 w-3" strokeWidth={3} />
                            </span>
                            <span className="leading-snug">{point}</span>
                          </li>
                        ))}
                    </ul>
                  ) : (
                    <p className="mt-4 flex-1 text-sm text-ink/35 italic">
                      Spesifikasi lengkap menyusul.
                    </p>
                  )}

                  <WhatsAppLink
                    message={waMessages.feature(contact.salesName, feature.title)}
                    className="mt-5 inline-flex items-center justify-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-2.5 text-sm font-bold text-brand-700 transition-all hover:border-brand-300 hover:bg-brand-100"
                  >
                    <MessageCircle className="h-4 w-4 fill-current" />
                    {feature.ctaLabel}
                  </WhatsAppLink>
                </div>
              </article>
            </RevealItem>
          ))}
        </div>
      </RevealGroup>
    </Section>
  );
}