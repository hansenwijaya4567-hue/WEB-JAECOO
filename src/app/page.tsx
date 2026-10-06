import {
  address,
  contact,
  faqs,
  hero,
  isPlaceholder,
  models,
  priceRange,
  seo,
  site,
  variants,
} from "@/data/config";
import { LandingPage } from "@/components/LandingPage";

/** Cari model induk sebuah varian. */
function modelOf(variant: (typeof variants)[number]) {
  return models.find((model) => model.id === variant.modelId)!;
}

/**
 * Structured data (JSON-LD) untuk membantu mesin pencari memahami:
 * - Dealer ini adalah LocalBusiness / AutoDealer
 * - Mobil yang dijual beserta harganya
 * - FAQ yang bisa langsung ditampilkan di hasil pencarian
 *
 * PENTING: nilai placeholder (`[ISI ...]`) sengaja dibuang dari JSON-LD.
 * Structured data yang tidak lengkap lebih baik daripada memuat teks
 * placeholder yang bisa terindeks dan merusak reputasi halaman.
 */
function buildJsonLd() {
  const hasGeo =
    !isPlaceholder(address.geo.latitude) && !isPlaceholder(address.geo.longitude);

  const dealer = {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    "@id": `${seo.siteUrl}/#dealer`,
    name: `Dealer Resmi ${site.brand} ${site.city}`,
    description: seo.description,
    url: seo.siteUrl,
    telephone: contact.phoneDisplay,
    email: contact.email,
    image: `${seo.siteUrl}${hero.image}`,
    priceRange: `${priceRange.min} - ${priceRange.max}`,
    currenciesAccepted: "IDR",
    address: {
      "@type": "PostalAddress",
      streetAddress: address.street,
      addressLocality: address.city,
      addressRegion: address.province,
      postalCode: address.postalCode,
      addressCountry: "ID",
    },
    // Koordinat hanya boleh masuk ke structured data kalau sudah diisi
    // angka asli. Schema.org mewajibkan latitude/longitude berupa angka,
    // dan koordinat tebakan yang salah justru merusak SEO lokal.
    ...(hasGeo
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: Number(address.geo.latitude),
            longitude: Number(address.geo.longitude),
          },
        }
      : {}),
    openingHoursSpecification: contact.businessHours.map((slot) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: slot.days,
      opens: slot.opens,
      closes: slot.closes,
    })),
    areaServed: {
      "@type": "City",
      name: site.cityLong,
    },
    sameAs: [seo.siteUrl],
  };

  const products = variants.map((variant) => {
    const model = modelOf(variant);

    return {
      "@context": "https://schema.org",
      "@type": "Car",
      "@id": `${seo.siteUrl}/#${variant.id}`,
      name: `${model.fullName} ${variant.name}`.trim(),
      ...(isPlaceholder(variant.subtitle) ? {} : { description: variant.subtitle }),
      image: `${seo.siteUrl}${variant.image}`,
      brand: { "@type": "Brand", name: site.brand },
      model: model.name,
      vehicleConfiguration: variant.name,
      fuelType: variant.fuel,
      offers: {
        "@type": "Offer",
        price: variant.price,
        priceCurrency: "IDR",
        // `availability` sengaja tidak diisi. Ketersediaan unit per varian
        // berubah-ubah dan belum dikonfirmasi, jadi memaksakan "InStock"
        // berisiko menampilkan stok yang sebenarnya tidak ada. Schema.org
        // memperbolehkan Offer tanpa `availability`. Tambahkan begitu
        // konfirmasi stok per varian sudah diterima.
        url: `${seo.siteUrl}/#varian`,
        seller: { "@id": `${seo.siteUrl}/#dealer` },
      },
    };
  });

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs
      // FAQ berplaceholder tidak boleh masuk structured data.
      .filter((faq) => !isPlaceholder(faq.answer))
      .map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: `Dealer ${site.brand} ${site.city}`,
    url: seo.siteUrl,
    inLanguage: "id-ID",
  };

  return [dealer, ...products, faqPage, website];
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd()) }}
      />
      <LandingPage />
    </>
  );
}