"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, MessageCircle, Phone } from "lucide-react";
import { contact, navLinks, site, waMessages } from "@/data/config";
import { buildWhatsAppLink, cn } from "@/lib/utils";
import { GA_EVENTS, trackEvent } from "@/lib/analytics";

/**
 * Header sticky: logo, navigasi desktop, tombol WA.
 * Di mobile berubah jadi menu drawer yang bisa dibuka-tutup.
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("beranda");

  // Efek bayangan header saat halaman di-scroll.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight menu sesuai section yang sedang terlihat.
  useEffect(() => {
    const sectionIds = ["beranda", "keunggulan", "varian", "simulasi", "faq"];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0.05, 0.3, 0.6] },
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Tutup menu mobile saat layar berubah atau pengguna klik link.
  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleResize = () => {
      if (window.innerWidth >= 1024) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("resize", handleResize);
    };
  }, [menuOpen]);

  const waHref = buildWhatsAppLink(waMessages.general(contact.salesName));

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          scrolled
            ? "border-b border-line bg-white/90 shadow-soft backdrop-blur-xl"
            : "border-b border-transparent bg-white/70 backdrop-blur-md",
        )}
      >
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-5 sm:h-[4.5rem] sm:px-6 lg:px-8">
          {/* Logo */}
          <Link
            href="#beranda"
            className="flex shrink-0 items-center gap-2.5"
            aria-label={`${site.brand} ${site.model} di ${site.city} - kembali ke beranda`}
          >
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-500 text-sm font-black text-white shadow-[0_6px_16px_-6px_rgb(15_122_131/0.8)]">
              {site.model}
            </span>
            <span className="flex flex-col leading-none">
              <span className="text-[15px] font-extrabold tracking-tight text-ink">
                {site.brand}
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-600">
                {site.city}
              </span>
            </span>
          </Link>

          {/* Navigasi desktop */}
          <nav aria-label="Navigasi utama" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {navLinks.map((link) => {
                const id = link.href.replace("#", "");
                const isActive = activeSection === id;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        "relative rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                        isActive
                          ? "text-brand-700"
                          : "text-ink/65 hover:text-brand-700",
                      )}
                    >
                      {link.label}
                      {isActive ? (
                        <motion.span
                          layoutId="nav-active"
                          className="absolute inset-0 -z-10 rounded-full bg-brand-50"
                          transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        />
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Aksi kanan */}
          <div className="flex items-center gap-2">
            <a
              href={`tel:${contact.phoneDial}`}
              onClick={() => trackEvent(GA_EVENTS.phoneClick, { placement: "header" })}
              aria-label={`Telepon ${contact.phoneDisplay}`}
              className="hidden h-10 w-10 place-items-center rounded-full border border-line text-ink/70 transition-colors hover:border-brand-300 hover:text-brand-700 sm:grid"
            >
              <Phone className="h-[18px] w-[18px]" />
            </a>

            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackEvent(GA_EVENTS.waClick, { placement: "header" })
              }
              className="hidden items-center gap-2 rounded-full bg-wa px-4 py-2.5 text-sm font-bold text-white shadow-[0_8px_20px_-8px_rgb(37_211_102/0.85)] transition-all hover:bg-[#1eb856] active:scale-[0.98] sm:inline-flex"
            >
              <MessageCircle className="h-4 w-4 fill-current" />
              Hubungi WA
            </a>

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
              aria-expanded={menuOpen}
              className="grid h-10 w-10 place-items-center rounded-full border border-line text-ink transition-colors hover:border-brand-300 hover:text-brand-700 lg:hidden"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Drawer menu mobile */}
      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            className="fixed inset-0 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <button
              type="button"
              aria-label="Tutup menu"
              className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
              onClick={() => setMenuOpen(false)}
            />

            <motion.nav
              aria-label="Navigasi mobile"
              className="absolute inset-x-0 top-0 origin-top rounded-b-3xl bg-white px-5 pb-6 pt-20 shadow-lift"
              initial={{ y: -24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -24, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <ul className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="block rounded-2xl px-4 py-3.5 text-base font-semibold text-ink/80 transition-colors hover:bg-brand-50 hover:text-brand-700"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  trackEvent(GA_EVENTS.waClick, { placement: "mobile_menu" });
                  setMenuOpen(false);
                }}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-wa px-5 py-3.5 text-base font-bold text-white"
              >
                <MessageCircle className="h-5 w-5 fill-current" />
                Hubungi WhatsApp Sales
              </a>
            </motion.nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}