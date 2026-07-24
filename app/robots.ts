import type { MetadataRoute } from "next";
import { company } from "@/data/company";

// §8.1 robots.txt — allow content, block admin/checkout/thank-you style routes.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/book/confirmation"],
      },
    ],
    sitemap: `${company.url}/sitemap.xml`,
    host: company.url,
  };
}
