import Image from "next/image";
import { Quote, Star } from "lucide-react";
import { isPlaceholder, site, testimonials } from "@/data/config";
import { Section, SectionHeading } from "@/components/ui/Section";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";

/**
 * Testimoni pelanggan.
 *
 * Data di src/data/config.ts (field `testimonials`) masih placeholder.
 * Section ini disembunyikan selama belum ada testimoni asli, karena
 * menampilkan nama, lokasi, dan kutipan rekaan berisiko merusak kepercayaan.
 * Isi `testimonials` dengan data pelanggan sungguhan untuk mengaktifkan
 * section ini.
 */
export function Testimonials() {
  const realTestimonials = testimonials.filter(
    (item) => !isPlaceholder(item.quote) && !isPlaceholder(item.name),
  );

  if (realTestimonials.length === 0) {
    return null;
  }

  return (
    <Section id="testimoni" tone="white">
      <RevealGroup>
        <SectionHeading
          eyebrow="Testimoni"
          title={
            <>
              Kata mereka yang{" "}
              <span className="text-brand-600">sudah punya {site.brand}</span>
            </>
          }
          description={`Cerita nyata dari pelanggan ${site.brand} di ${site.city} dan sekitarnya.`}
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {realTestimonials.map((item) => (
            <RevealItem key={item.id} className="h-full">
              <figure className="flex h-full flex-col rounded-3xl border border-line bg-white p-5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
                {/* Rating */}
                <div
                  className="flex items-center gap-1"
                  aria-label={`Rating ${item.rating} dari 5`}
                >
                  {Array.from({ length: item.rating }).map((_, index) => (
                    <Star
                      key={index}
                      className="h-4 w-4 fill-accent text-accent"
                      aria-hidden="true"
                    />
                  ))}
                </div>

                {/* Kutipan */}
                <blockquote className="relative mt-3 flex-1">
                  <Quote
                    className="absolute -top-1 -left-1 h-7 w-7 text-brand-100"
                    aria-hidden="true"
                  />
                  <p className="relative pl-5 text-sm leading-relaxed text-ink/70">
                    {item.quote}
                  </p>
                </blockquote>

                {/* Identitas */}
                <figcaption className="mt-5 flex items-center gap-3 border-t border-line pt-4">
                  <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-brand-50">
                    <Image
                      src={item.image}
                      alt={`Foto ${item.name}`}
                      fill
                      sizes="44px"
                      className="object-cover"
                    />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-bold text-ink">
                      {item.name}
                    </span>
                    <span className="block truncate text-[11px] text-ink/50">
                      {item.location} - {item.variant}
                    </span>
                  </span>
                </figcaption>
              </figure>
            </RevealItem>
          ))}
        </div>
      </RevealGroup>
    </Section>
  );
}
