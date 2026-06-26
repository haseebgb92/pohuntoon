import type { MetadataRoute } from "next";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://pohuntoon.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: appUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${appUrl}/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];
}
