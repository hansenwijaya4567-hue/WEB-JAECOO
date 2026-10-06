import Link from "next/link";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import {
  address,
  contact,
  entryVariant,
  footerDisclaimer,
  navLinks,
  site,
  social,
  waMessages,
} from "@/data/config";
import { GA_EVENTS, trackEvent } from "@/lib/analytics";
import { formatRupiah } from "@/lib/utils";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";

const socialLinks = [
  { key: "instagram", label: "Instagram", href: social.instagram },
  { key: "facebook", label: "Facebook", href: social.facebook },
  { key: "tiktok", label: "TikTok", href: social.tiktok },
] as const;

/**
 * Instagram, Facebook, dan TikTok memakai ikon homemade agar tidak
 * bergantung pada package ikon pihak ketiga yang sering berubah.
 */
function SocialIcon({ name }: { name: (typeof socialLinks)[number]["key"] }) {
  if (name === "instagram") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
        <rect
          x="3"
          y="3"
          width="18"
          height="18"
          rx="5"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
      </svg>
    );
  }

  if (name === "facebook") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
        <path d="M14 9V7.2c0-.8.2-1.2 1.4-1.2H17V3h-2.6C11.4 3 10.5 4.6 10.5 6.8V9H8.5v3h2v9h3.5v-9h2.4l.5-3H14Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
      <path d="M16.5 3h-2.4a4.9 4.9 0 0 0-4.9 4.9V11H6.8v3h2.4v7h3.1v-7h2.4l.5-3h-2.9V8.1c0-.9.3-1.4 1.4-1.4h1.8V3Z" />
    </svg>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink pb-28 text-white/70 lg:pb-10">
      <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)]">
          {/* Brand */}
          <div>
            <Link href="#beranda" className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-500 text-sm font-black text-white">
                {site.model}
              </span>
              <span className="flex flex-col leading-none">
                <span className="text-[15px] font-extrabold tracking-tight text-white">
                  {site.brand}
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-300">
                  {site.city}
                </span>
              </span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/55">
              Dealer resmi {site.brand} {site.model} di {site.cityLong}. Melayani pembelian cash
              dan kredit, test drive, serta layanan purna jual untuk seluruh {site.region}.
            </p>

            {/* Sosial */}
            <div className="mt-5 flex items-center gap-2">
              {socialLinks.map((item) => (
                <a
                  key={item.key}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.label}
                  className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-white/60 transition-all hover:border-brand-400 hover:bg-brand-500/15 hover:text-brand-200"
                >
                  <SocialIcon name={item.key} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigasi */}
          <nav aria-label="Navigasi footer">
            <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-white/40">
              Navigasi
            </h3>
            <ul className="mt-4 space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 transition-colors hover:text-brand-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="#test-drive"
                  className="text-sm text-white/60 transition-colors hover:text-brand-200"
                >
                  Test Drive
                </Link>
              </li>
              <li>
                <Link
                  href="#spk"
                  className="text-sm text-white/60 transition-colors hover:text-brand-200"
                >
                  Form Pemesanan SPK
                </Link>
              </li>
            </ul>
          </nav>

          {/* Kontak */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-white/40">
              Kontak
            </h3>
            <ul className="mt-4 space-y-3.5">
              <li className="flex items-start gap-2.5 text-sm">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                <address className="not-italic leading-relaxed">
                  {address.street}
                  <br />
                  {address.city} {address.postalCode}, {address.province}
                </address>
              </li>
              <li>
                <a
                  href={`tel:${contact.phoneDial}`}
                  onClick={() => trackEvent(GA_EVENTS.phoneClick, { placement: "footer" })}
                  className="flex items-center gap-2.5 text-sm transition-colors hover:text-brand-200"
                >
                  <Phone className="h-4 w-4 shrink-0 text-brand-400" />
                  {contact.phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-center gap-2.5 text-sm transition-colors hover:text-brand-200"
                >
                  <Mail className="h-4 w-4 shrink-0 text-brand-400" />
                  {contact.email}
                </a>
              </li>
              <li>
                <WhatsAppLink
                  message={waMessages.general(contact.salesName)}
                  className="flex items-center gap-2.5 text-sm font-bold text-brand-200 transition-colors hover:text-brand-100"
                >
                  <MessageCircle className="h-4 w-4 shrink-0 fill-current" />
                  Chat {contact.salesName}
                </WhatsAppLink>
              </li>
            </ul>

            <p className="mt-4 text-xs leading-relaxed text-white/40">
              {contact.hours.map((slot) => (
                <span key={slot.day} className="block">
                  {slot.day}: {slot.time}
                </span>
              ))}
            </p>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-12 space-y-2 border-t border-white/10 pt-7 text-[11px] leading-relaxed text-white/35">
          <p>{footerDisclaimer.price}</p>
          <p>{footerDisclaimer.credit}</p>
          <p>{footerDisclaimer.images}</p>
        </div>

        <div className="mt-6 flex flex-col items-center justify-between gap-3 text-[11px] text-white/35 sm:flex-row">
          <p>
            &copy; {year} {site.legalName}. Dealer resmi {site.brand} {site.model}{" "}
            {site.cityLong}.
          </p>
          <p>
            Harga mulai{" "}
            <span className="tabular font-bold text-white/55">
              {formatRupiah(entryVariant.price)}
            </span>{" "}
            OTR {site.city}.
          </p>
        </div>
      </div>
    </footer>
  );
}