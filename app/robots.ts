import type { MetadataRoute } from "next";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://pohuntoon.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/login", "/forgot-password"],
        disallow: ["/app", "/admin", "/api"],
      },
    ],
    sitemap: `${appUrl}/sitemap.xml`,
  };
}
