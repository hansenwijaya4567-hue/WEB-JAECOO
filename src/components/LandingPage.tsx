"use client";

import { useCallback, useState } from "react";
import { colorsForVariant, variants } from "@/data/config";
import { Hero } from "@/components/sections/Hero";
import { TrustBar } from "@/components/sections/TrustBar";
import { Features } from "@/components/sections/Features";
import { ModelShowcase } from "@/components/sections/ModelShowcase";
import { VariantsSection } from "@/components/sections/Variants";
import { ColorPicker } from "@/components/sections/ColorPicker";
import { Gallery } from "@/components/sections/Gallery";
import { CreditSimulator } from "@/components/sections/CreditSimulator";
import { Promo } from "@/components/sections/Promo";
import { Journey } from "@/components/sections/Journey";
import { SPKForm } from "@/components/sections/SPKForm";
import { TestDriveBooking } from "@/components/sections/TestDrive";
import { Testimonials } from "@/components/sections/Testimonials";
import { FAQ } from "@/components/sections/FAQ";
import { Location } from "@/components/sections/Location";
import { ClosingCTA } from "@/components/sections/ClosingCTA";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { FloatingWhatsApp, MobileStickyBar } from "@/components/FloatingActions";

/**
 * Halaman utama landing page dealer JAECOO.
 *
 * State bersama (varian & warna terpilih) dikelola di sini agar pilihan
 * dari section Varian dan Warna otomatis mengisi form SPK serta
 * simulasi kredit tanpa perlu INPUT ulang.
 */
export function LandingPage() {
  const [selectedVariantId, setSelectedVariantId] = useState<string>(variants[0].id);
  const [selectedColorId, setSelectedColorId] = useState<string>(
    colorsForVariant(variants[0])[0]?.id ?? "",
  );
  const [formActive, setFormActive] = useState(false);

  // Callback harus stabil agar tidak memicu efek berulang pada form.
  const handleFormActive = useCallback((active: boolean) => {
    setFormActive(active);
  }, []);

  return (
    <>
      <Header />

      <main>
        <Hero />
        <TrustBar />
        <Features />
        <ModelShowcase />

        <VariantsSection
          onSelectVariant={(id) => {
            setSelectedVariantId(id);
          }}
        />

        <ColorPicker
          onSelectColor={(id) => {
            setSelectedColorId(id);
          }}
        />

        <Gallery />
        <CreditSimulator
          selectedVariantId={selectedVariantId}
          onRequestCredit={(id) => {
            setSelectedVariantId(id);
            document.getElementById("spk")?.scrollIntoView({ behavior: "smooth" });
          }}
        />

        <Promo />
        <Journey />

        <SPKForm
          selectedVariantId={selectedVariantId}
          selectedColorId={selectedColorId}
          isFormActive={handleFormActive}
        />

        <TestDriveBooking />
        <Testimonials />
        <FAQ />
        <Location />
        <ClosingCTA />
      </main>

      <Footer />

      <FloatingWhatsApp />
      <MobileStickyBar hidden={formActive} />
    </>
  );
}