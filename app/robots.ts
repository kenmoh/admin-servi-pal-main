import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://admin.servi-pal.com";

  return {
    rules: [
      {
        userAgent: "*",
        disallow: ["/", "/admin/", "/login/", "/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
