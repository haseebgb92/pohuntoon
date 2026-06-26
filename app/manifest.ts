import type { MetadataRoute } from "next";

import { brand } from "@/lib/config/brand";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: brand.name,
    short_name: brand.name,
    description: brand.description,
    start_url: "/app/dashboard",
    display: "standalone",
    background_color: brand.backgroundColor,
    theme_color: brand.themeColor,
    orientation: "portrait",
    icons: [
      {
        src: "/icons/pohuntoon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/pohuntoon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icons/pohuntoon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    shortcuts: [
      {
        name: "Home",
        short_name: "Home",
        description: "Open your Pohuntoon dashboard",
        url: "/app/dashboard",
      },
      {
        name: "Learn",
        short_name: "Learn",
        description: "Continue learning in Pohuntoon",
        url: "/app/learning",
      },
      {
        name: "Community",
        short_name: "Community",
        description: "Open Pohuntoon community spaces",
        url: "/app/community",
      },
      {
        name: "New Lead",
        short_name: "Lead",
        description: "Create a new funding opportunity",
        url: "/app/leads/new",
      },
      {
        name: "Notifications",
        short_name: "Updates",
        description: "Open your Pohuntoon activity center",
        url: "/app/notifications",
      },
    ],
  };
}
