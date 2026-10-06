import type { MetadataRoute } from "next";
import { seo } from "@/data/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Endpoint API tidak perlu diindeks.
      disallow: "/api/",
    },
    sitemap: `${seo.siteUrl}/sitemap.xml`,
  };
}