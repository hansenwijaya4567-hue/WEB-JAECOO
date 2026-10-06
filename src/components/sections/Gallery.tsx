"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, MessageCircle, X, ZoomIn } from "lucide-react";
import { createPortal } from "react-dom";
import { contact, gallery, galleryCategories, site, waMessages } from "@/data/config";
import { cn } from "@/lib/utils";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal, RevealGroup } from "@/components/ui/Reveal";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";

type GalleryItem = (typeof gallery)[number];

/**
 * Galeri dengan filter kategori dan lightbox yang bisa di-swipe
 * (drag horizontal + swipe di mobile).
 */
export function Gallery() {
  const [category, setCategory] = useState<string>(galleryCategories[0]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered: GalleryItem[] =
    category === "Semua" ? [...gallery] : gallery.filter((item) => item.category === category);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  return (
    <Section id="galeri" tone="white">
      <RevealGroup>
        <SectionHeading
          eyebrow="Galeri"
          title={
            <>
              Lihat Detailnya <span className="text-brand-600">sebelum datang</span>
            </>
          }
          description={`Eksterior, interior, dan fitur-fitur ${site.brand} ${site.model}. Ketuk foto untuk melihat lebih besar.`}
        />

        {/* Filter kategori */}
        <Reveal delay={0.05}>
          <div
            role="tablist"
            aria-label="Filter kategori galeri"
            className="no-scrollbar mt-8 flex gap-2 overflow-x-auto pb-1 sm:justify-center"
          >
            {galleryCategories.map((item) => {
              const isActive = category === item;
              return (
                <button
                  key={item}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setCategory(item)}
                  className={cn(
                    "relative shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                    isActive ? "text-white" : "text-ink/65 hover:text-brand-700",
                  )}
                >
                  {isActive ? (
                    <motion.span
                      layoutId="gallery-filter"
                      className="absolute inset-0 rounded-full bg-brand-500"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  ) : (
                    <span className="absolute inset-0 rounded-full border border-line bg-white" />
                  )}
                  <span className="relative">{item}</span>
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* Grid foto */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((item, index) => (
              <motion.button
                key={item.src}
                type="button"
                layout
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => openLightbox(index)}
                aria-label={`Perbesar ${item.label}`}
                className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-line bg-brand-50 shadow-soft transition-shadow hover:shadow-card"
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.07]"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent opacity-80 transition-opacity group-hover:opacity-95"
                  aria-hidden="true"
                />
                <span className="absolute right-2.5 top-2.5 grid h-8 w-8 place-items-center rounded-full bg-white/85 text-ink opacity-0 shadow-soft backdrop-blur-sm transition-opacity group-hover:opacity-100">
                  <ZoomIn className="h-4 w-4" />
                </span>
                <span className="absolute inset-x-0 bottom-0 p-3 text-left text-[11px] font-semibold leading-snug text-white sm:text-xs">
                  {item.label}
                </span>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>

        <Reveal delay={0.1}>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <WhatsAppLink
              message={waMessages.testDrive(contact.salesName)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-500 px-6 py-3.5 text-sm font-bold text-white shadow-[0_10px_24px_-10px_rgb(15_122_131/0.85)] transition-colors hover:bg-brand-600 sm:w-auto"
            >
              <MessageCircle className="h-4 w-4 fill-current" />
              Chat Sales untuk Lihat Unit Langsung
            </WhatsAppLink>
          </div>
        </Reveal>
      </RevealGroup>

      <Lightbox
        items={filtered}
        index={lightboxIndex}
        onClose={closeLightbox}
        onNavigate={setLightboxIndex}
      />
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  LIGHTBOX                                                           */
/* ------------------------------------------------------------------ */

function Lightbox({
  items,
  index,
  onClose,
  onNavigate,
}: {
  items: GalleryItem[];
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}) {
  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef<number>(0);
  const [dragOffset, setDragOffset] = useState(0);

  const isOpen = index !== null;

  const goPrev = useCallback(() => {
    if (index === null) return;
    onNavigate((index - 1 + items.length) % items.length);
  }, [index, items.length, onNavigate]);

  const goNext = useCallback(() => {
    if (index === null) return;
    onNavigate((index + 1) % items.length);
  }, [index, items.length, onNavigate]);

  // Keyboard navigation.
  useEffect(() => {
    if (!isOpen) return;

    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") goPrev();
      if (event.key === "ArrowRight") goNext();
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKey);
    };
  }, [isOpen, goPrev, goNext, onClose]);

  // Reset offset drag saat pindah foto, dengan menyesuaikan state saat
  // render (bukan di dalam effect) agar tidak ada render berlapis.
  // Nilai `touchDeltaX` sudah di-reset di dalam handler touchstart.
  const [lastIndex, setLastIndex] = useState<number | null>(index);
  if (index !== lastIndex) {
    setLastIndex(index);
    setDragOffset(0);
  }

  if (typeof document === "undefined" || !isOpen || index === null) return null;

  const item = items[index];
  if (!item) return null;

  // Geser sedikit mengikuti jari untuk memberi feedback visual.
  const handleTouchStart = (event: React.TouchEvent) => {
    touchStartX.current = event.touches[0].clientX;
    touchDeltaX.current = 0;
  };

  const handleTouchMove = (event: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = event.touches[0].clientX - touchStartX.current;
    touchDeltaX.current = delta;
    setDragOffset(delta * 0.55);
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null) return;
    if (touchDeltaX.current < -70) goNext();
    else if (touchDeltaX.current > 70) goPrev();
    touchStartX.current = null;
    setDragOffset(0);
  };

  return createPortal(
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[110] flex flex-col bg-ink/95 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <p className="tabular text-sm font-semibold text-white/70">
            {index + 1} / {items.length}
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup galeri"
            className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Area foto */}
        <div
          className="relative flex flex-1 items-center justify-center overflow-hidden px-3 pb-4 sm:px-16"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Tombol navigasi (desktop) */}
          <button
            type="button"
            onClick={goPrev}
            aria-label="Foto sebelumnya"
            className="absolute left-2 z-10 hidden h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25 sm:grid"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <motion.div
            key={item.src}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1, x: dragOffset }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.18}
            onDragEnd={(_, info) => {
              if (info.offset.x < -80) goNext();
              else if (info.offset.x > 80) goPrev();
            }}
            className="relative h-full w-full max-w-4xl cursor-grab active:cursor-grabbing"
          >
            <Image
              src={item.src}
              alt={item.alt}
              fill
              sizes="100vw"
              className="pointer-events-none object-contain"
              draggable={false}
            />
          </motion.div>

          <button
            type="button"
            onClick={goNext}
            aria-label="Foto berikutnya"
            className="absolute right-2 z-10 hidden h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25 sm:grid"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>

        {/* Caption + thumbnail strip */}
        <div className="shrink-0 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <p className="px-4 text-center text-sm font-semibold text-white sm:text-base">
            {item.label}
          </p>

          <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto px-4 pb-2">
            {items.map((thumb, thumbIndex) => (
              <button
                key={thumb.src}
                type="button"
                onClick={() => onNavigate(thumbIndex)}
                aria-label={`Buka ${thumb.label}`}
                aria-current={thumbIndex === index}
                className={cn(
                  "relative h-14 w-20 shrink-0 overflow-hidden rounded-lg transition-all",
                  thumbIndex === index
                    ? "ring-2 ring-brand-400"
                    : "opacity-45 hover:opacity-80",
                )}
              >
                <Image
                  src={thumb.src}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body,
  );
}