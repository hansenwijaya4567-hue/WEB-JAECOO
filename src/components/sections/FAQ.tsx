"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, MessageCircle } from "lucide-react";
import { contact, faqs, isPlaceholder, responseTime, waMessages } from "@/data/config";
import { cn } from "@/lib/utils";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";

/**
 * FAQ accordion.
 *
 * Hanya satu jawaban yang terbuka pada satu waktu agar halaman
 * tetap ringkas di layar ponsel.
 */
export function FAQ() {
  // FAQ dengan jawaban placeholder disembunyikan supaya tidak ada teks
  // "[ISI ...]" yang muncul di accordion.
  const visibleFaqs = faqs.filter((faq) => !isPlaceholder(faq.answer));
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <Section id="faq" tone="mist">
      <RevealGroup>
        <SectionHeading
          eyebrow="Pertanyaan Umum"
          title={
            <>
              Masih ada yang <span className="text-brand-600">mengganjal</span>?
            </>
          }
          description="Pertanyaan yang paling sering masuk ke WhatsApp kami, dijawab lengkap di sini."
        />

        <div className="mx-auto mt-12 max-w-3xl">
          <ul className="space-y-2.5">
            {visibleFaqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <RevealItem key={faq.question} as="li">
                  <div
                    className={cn(
                      "overflow-hidden rounded-2xl border bg-white transition-colors",
                      isOpen ? "border-brand-200 shadow-soft" : "border-line",
                    )}
                  >
                    <h3>
                      <button
                        type="button"
                        onClick={() => setOpenIndex(isOpen ? null : index)}
                        aria-expanded={isOpen}
                        aria-controls={`faq-panel-${index}`}
                        id={`faq-button-${index}`}
                        className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition-colors hover:bg-brand-50/40 sm:px-5"
                      >
                        <span className="flex min-w-0 items-start gap-3">
                          <span className="mt-1 hidden shrink-0 rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-700 sm:inline-block">
                            {faq.category}
                          </span>
                          <span className="text-[15px] font-bold leading-snug text-ink">
                            {faq.question}
                          </span>
                        </span>
                        <motion.span
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: 0.22 }}
                          className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-700"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </motion.span>
                      </button>
                    </h3>

                    <AnimatePresence initial={false}>
                      {isOpen ? (
                        <motion.div
                          id={`faq-panel-${index}`}
                          role="region"
                          aria-labelledby={`faq-button-${index}`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-line px-4 py-4 sm:px-5">
                            <p className="text-sm leading-relaxed text-ink/70">{faq.answer}</p>

                            <WhatsAppLink
                              message={waMessages.general(contact.salesName)}
                              className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 underline-offset-4 hover:underline"
                            >
                              <MessageCircle className="h-3.5 w-3.5 fill-current" />
                              Tanya langsung ke sales
                            </WhatsAppLink>
                          </div>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </div>
                </RevealItem>
              );
            })}
          </ul>

          <Reveal delay={0.1}>
            <p className="mt-6 text-center text-sm text-ink/55">
              Tidak menemukan jawabannya?{" "}
              <WhatsAppLink
                message={waMessages.general(contact.salesName)}
                className="font-bold text-brand-700 underline-offset-4 hover:underline"
              >
                Chat sales kami
              </WhatsAppLink>{" "}
              - biasanya dibalas {responseTime.onWorkingHours}.
            </p>
          </Reveal>
        </div>
      </RevealGroup>
    </Section>
  );
}