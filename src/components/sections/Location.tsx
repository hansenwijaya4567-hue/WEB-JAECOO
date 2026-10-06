import { Clock, ExternalLink, Mail, MapPin, Navigation, Phone } from "lucide-react";
import { address, contact, site, waMessages } from "@/data/config";
import { GA_EVENTS, trackEvent } from "@/lib/analytics";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";

/**
 * Section lokasi: alamat, jam buka, embed Google Maps, dan Petunjuk Arah.
 *
 * GANTI `address.mapsEmbedUrl` dan `address.mapsUrl` di src/data/config.ts
 * dengan tautan dealer Anda yang sebenarnya.
 */
export function Location() {
  const fullAddress = `${address.street}, ${address.district}, ${address.city} ${address.postalCode}, ${address.province}`;

  return (
    <Section id="lokasi" tone="white">
      <RevealGroup>
        <SectionHeading
          eyebrow="Lokasi Dealer"
          title={
            <>
              Datang ke <span className="text-brand-600">{site.city}</span>, unitnya sudah siap
            </>
          }
          description={`Kunjungi dealer kami untuk melihat unit ${site.brand} ${site.model} langsung, atau datangkan diri ke test drive.`}
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-8">
          {/* --- Info --- */}
          <RevealItem>
            <div className="flex h-full flex-col gap-4">
              <div className="rounded-3xl border border-line bg-mist p-5 sm:p-6">
                <h3 className="flex items-center gap-2 text-base font-extrabold text-ink">
                  <MapPin className="h-5 w-5 text-brand-600" />
                  Alamat Dealer
                </h3>
                <address className="mt-3 text-sm not-italic leading-relaxed text-ink/70">
                  {address.street}
                  <br />
                  {address.district}, {address.city} {address.postalCode}
                  <br />
                  {address.province}
                </address>

                <ul className="mt-3 space-y-1.5">
                  {address.landmarks.map((landmark) => (
                    <li key={landmark} className="text-xs text-ink/50">
                      {landmark}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-3xl border border-line bg-white p-5 shadow-soft sm:p-6">
                <h3 className="flex items-center gap-2 text-base font-extrabold text-ink">
                  <Clock className="h-5 w-5 text-brand-600" />
                  Jam Operasional
                </h3>
                <dl className="mt-3 space-y-2">
                  {contact.hours.map((row) => (
                    <div
                      key={row.day}
                      className="flex items-baseline justify-between gap-3 border-b border-line pb-2 last:border-0 last:pb-0"
                    >
                      <dt className="text-sm text-ink/60">{row.day}</dt>
                      <dd className="tabular text-sm font-bold text-ink">{row.time}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* Kontak */}
              <div className="grid gap-2.5 sm:grid-cols-2">
                <a
                  href={`tel:${contact.phoneDial}`}
                  onClick={() => trackEvent(GA_EVENTS.phoneClick, { placement: "location" })}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-line bg-white px-4 py-3.5 text-sm font-bold text-ink/75 transition-colors hover:border-brand-300 hover:text-brand-700"
                >
                  <Phone className="h-4 w-4" />
                  {contact.phoneDisplay}
                </a>
                <a
                  href={`mailto:${contact.email}`}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-line bg-white px-4 py-3.5 text-sm font-bold text-ink/75 transition-colors hover:border-brand-300 hover:text-brand-700"
                >
                  <Mail className="h-4 w-4" />
                  Email Dealer
                </a>
              </div>
            </div>
          </RevealItem>

          {/* --- Peta --- */}
          <RevealItem delay={0.1}>
            <div className="flex h-full flex-col gap-4">
              <div className="relative min-h-[340px] flex-1 overflow-hidden rounded-3xl border border-line bg-mist shadow-soft">
                <iframe
                  src={address.mapsEmbedUrl}
                  title={`Peta lokasi dealer ${site.brand} ${site.model} di ${address.city}, ${address.province}`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full border-0"
                />
              </div>

              <div className="flex flex-col gap-2.5 sm:flex-row">
                <a
                  href={address.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent(GA_EVENTS.directionClick, { placement: "location" })}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-brand-500 px-5 py-3.5 text-sm font-bold text-white shadow-[0_10px_24px_-10px_rgb(15_122_131/0.85)] transition-colors hover:bg-brand-600"
                >
                  <Navigation className="h-4 w-4" />
                  Petunjuk Arah
                </a>

                <a
                  href={address.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-line bg-white px-5 py-3.5 text-sm font-bold text-ink/75 transition-colors hover:border-brand-300 hover:text-brand-700"
                >
                  <ExternalLink className="h-4 w-4" />
                  Buka di Maps
                </a>
              </div>

              <WhatsAppLink
                message={waMessages.location(contact.salesName)}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-wa/35 bg-wa/10 px-5 py-3.5 text-sm font-bold text-[#128c4a] transition-colors hover:bg-wa/15"
              >
                Tanya Lokasi ke Sales
              </WhatsAppLink>
            </div>
          </RevealItem>
        </div>

        {/* Alamat teks tersembunyi untuk mesin pencari */}
        <Reveal className="mt-8">
          <p className="sr-only">{fullAddress}</p>
        </Reveal>
      </RevealGroup>
    </Section>
  );
}