"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Modal yang bisa dipakai untuk tabel perbandingan varian.
 *
 * Fitur:
 * - Ditutup dengan tombol Escape atau klik backdrop.
 * - Fokus dikunci di dalam modal saat terbuka (accessibility).
 * - Body dikunci scroll saat terbuka.
 * - Render via portal agar tidak terpengaruh overflow parent.
 */
export function Modal({
  open,
  onClose,
  title,
  children,
  size = "lg",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: "md" | "lg" | "xl";
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    // Fokuskan panel agar pembaca layar langsung membaca judul modal.
    panelRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (typeof document === "undefined") return null;

  const sizes = {
    md: "max-w-2xl",
    lg: "max-w-5xl",
    xl: "max-w-7xl",
  } as const;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Tutup modal"
            className="absolute inset-0 cursor-default bg-ink/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className={cn(
              "relative flex max-h-[92vh] w-full flex-col overflow-hidden bg-white shadow-lift outline-none",
              "rounded-t-3xl sm:rounded-3xl",
              sizes[size],
            )}
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4 sm:px-7">
              <h3 className="text-lg font-bold text-ink sm:text-xl">{title}</h3>
              <button
                type="button"
                onClick={onClose}
                aria-label="Tutup"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-ink/60 transition-colors hover:bg-mist hover:text-ink"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body (scrollable) */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-7 sm:py-6">
              {children}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}